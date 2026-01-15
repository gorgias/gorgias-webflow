(() => {
  'use strict';

  // Mirror email -> target (safe no-op if jQuery or elements are missing)
  if (window.jQuery) {
    $(document).ready(function () {
      const $source = $('[data-el="mirror-email"]');
      const $target = $('[data-el="mirror-email-target"]');

      if (!$source.length || !$target.length) return;

      const mirrorEmail = () => {
        $target.val($source.val());
      };

      // Initial sync (in case of pre-filled)
      mirrorEmail();

      // Sync on input and other possible events
      $source.on('input change blur', mirrorEmail);
    });
  }
  

  function waitForSuperformAndInit(retries = 10, delay = 300) {
    if (!window.SuperformAPI || typeof window.SuperformAPI.push !== 'function') {
      if (retries > 0) {
        return setTimeout(() => waitForSuperformAndInit(retries - 1, delay), delay);
      } else {
        console.log("SuperformAPI never initialized.");
        return;
      }
    }

    window.SuperformAPI.push(({ allForms } = {}) => {
      console.log("Full Superform objects:", allForms);

      const myForm = Array.isArray(allForms) ? allForms[0] : null;

      if (!myForm || typeof myForm.onStepChange !== 'function') {
        console.log("No usable Superform instance found.");
        return;
      }

      const formStepData = {};

      myForm.onStepChange((params) => {
        const { stepCount, data } = params;
        Object.assign(formStepData, data);

        console.log("All stored data so far:", formStepData);

        // Try to populate HubSpot form
        populateHubspotForm(formStepData);
      });
    });
  }

  //Parse email to create Full name + domain in HS form
    function parseEmail(email) {
    if (typeof email !== 'string') return null;
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return null;

    const localPart = email.slice(0, atIndex);
    const domainPart = email.slice(atIndex + 1);

    // Attempt to parse full name from local part if it contains dots or underscores
    let fullName = null;
    if (localPart.includes('.') || localPart.includes('_')) {
      const parts = localPart.split(/[\._]+/).filter(Boolean);
      if (parts.length >= 2) {
        fullName = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
      }
    }
    console.log("Parsed email:", { localPart, domainPart, fullName });
    return { localPart, domainPart, fullName };
  }

  
  // HubSpot form wait helper (deduped + promise-based)
  const __hsWaiters = new Map();

  function waitForHubspotForm(selector, retries = 20, delay = 300) {
    if (__hsWaiters.has(selector)) return __hsWaiters.get(selector);

    const promise = new Promise((resolve) => {
      const attempt = (remaining) => {
        const form = document.querySelector(selector);
        if (form) return resolve(form);

        if (remaining <= 0) {
          console.log("HubSpot form never appeared.");
          return resolve(null);
        }

        setTimeout(() => attempt(remaining - 1), delay);
      };

      attempt(retries);
    });

    __hsWaiters.set(selector, promise);
    return promise;
  }

  async function populateHubspotForm(formData) {
    const hsForm = await waitForHubspotForm("#hsForm_c0b510e0-b9e8-49bf-a54c-872a45c50040");
    if (!hsForm) return;

    const fieldMapping = {
      email: 'email',
      company_domain: 'company_domain',
      demo_ecommerce_platform: 'demo_ecommerce_platform',
      demo_tickets_volume: 'demo_tickets_volume',
      demo_annual_sales_range: 'demo_annual_sales_range',
      '0-1_number_of_agents': 'number_of_agents',
      '0-1_demo_current_helpdesk': 'demo_current_helpdesk',
      '0-1_demo_utm_source': 'demo_utm_source',
      '0-1_demo_utm_medium': 'demo_utm_medium',
      '0-1_demo_utm_campaign': 'demo_utm_campaign',
      '0-1_demo_utm_term': 'demo_utm_term',
      '0-1_demo_timezone': 'demo_timezone',
      '0-1_demo_lead_product_interest': 'demo_lead_product_interest'
    };

    for (const [sourceKey, targetName] of Object.entries(fieldMapping)) {
      let value = formData?.[sourceKey];
      if (value === undefined || value === null || value === '') continue;

      // Normalize arrays to comma-separated strings (HubSpot multi-select format)
      if (Array.isArray(value)) {
        value = value
          .filter(Boolean)
          .map(v => String(v).trim())
          .filter(Boolean)
          .join(',')
          .trim();
        if (!value) continue;
      } else {
        value = String(value).trim();
        if (!value) continue;
      }

      const input = hsForm.querySelector(`[name="${targetName}"]`);
      if (!input) continue;

      // Avoid unnecessary events if value already matches
      if (input.value === value) continue;

      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  
  // Kick things off (guard against double execution)
  if (!window.__demoWorkerInit) {
    window.__demoWorkerInit = true;
    waitForSuperformAndInit();
  }

  // Hide elements after form submission (HS button may be injected later)
  if (window.jQuery) {
    $(document).ready(function () {
      $(document).on('click', '.hs-button.primary.large', function () {
        setTimeout(function () {
          const $el = $('[data-el="hide-after-form"]');
          if (!$el.length) return;

          $el.css('opacity', '0');
          setTimeout(function () {
            $el.css('display', 'none');
          }, 200);
        }, 500);
      });
    });
  }

  const initGorgiasChatPromise = (window.GorgiasChat && typeof window.GorgiasChat.init === 'function')
    ? window.GorgiasChat.init()
    : new Promise(function (resolve) {
        window.addEventListener('gorgias-widget-loaded', function () { resolve(); });
      });

  initGorgiasChatPromise.then(function () {
    if (window.GorgiasChat && typeof window.GorgiasChat.isOpen === 'function') {
      window.GorgiasChat.isOpen(); // Will return true or false.
    }
  });

  // Open chat widget when clicking on "Talk to sales" CTA
  function chatContactUs() {
    initGorgiasChatPromise.then(function () {
      if (!window.GorgiasChat) return;

      if (typeof window.GorgiasChat.open === 'function') {
        window.GorgiasChat.open();
      }

      // Send a consistent welcome message
      const message = "Hi, I’m interested in Gorgias. Can you help me understand if it’s a good fit?";
      if (typeof window.GorgiasChat.sendMessage === 'function') {
        window.GorgiasChat.sendMessage(message);
      }
    });
  }

  (function bindChatCta() {
    const btn = document.querySelector('[data-el="open-chat"]');
    if (!btn) return;

    btn.addEventListener('click', function () {
      console.log("Chat button clicked");
      chatContactUs();
    });
  })();

})();