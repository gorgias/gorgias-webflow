(() => {
  'use strict';

  // ===== Constants =====
  const DEMO_FORM_ID = 'c0b510e0-b9e8-49bf-a54c-872a45c50040';
  const HS_FORM_SELECTOR = '#hsForm_' + DEMO_FORM_ID;

  // ===== Utility Functions =====

  // Safe analytics tracking wrapper
  function safeTrack(name) {
    try {
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track(name);
      } else {
        console.warn('analytics.track unavailable:', name);
      }
    } catch (e) {}
  }

  // Parse email to extract full name + domain
  function parseEmail(email) {
    if (typeof email !== 'string') return null;
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return null;

    const localPart = email.slice(0, atIndex);
    const domainPart = email.slice(atIndex + 1);

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

  // Set field value and dispatch change event
  function setFieldValue(selector, value) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.value = value;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // HubSpot form wait helper (deduped + promise-based)
  const __hsWaiters = new Map();

  function waitForHubspotForm(selector, retries = 20, delay = 300) {
    if (__hsWaiters.has(selector)) return __hsWaiters.get(selector);

    const promise = new Promise((resolve) => {
      const attempt = (remaining) => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);

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

  // Populate HubSpot form fields from Superform data
  async function populateHubspotForm(formData) {
    const hsForm = await waitForHubspotForm(HS_FORM_SELECTOR);
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
        value = value.filter(Boolean).map(v => String(v).trim()).filter(Boolean).join(',').trim();
        if (!value) continue;
      } else {
        value = String(value).trim();
        if (!value) continue;
      }

      const input = hsForm.querySelector(`[name="${targetName}"]`);
      if (!input || input.value === value) continue;

      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  // ===== Superform Integration =====

  function waitForSuperformAndInit(retries = 10, delay = 300) {
    if (!window.SuperformAPI || typeof window.SuperformAPI.push !== 'function') {
      if (retries > 0) {
        return setTimeout(() => waitForSuperformAndInit(retries - 1, delay), delay);
      }
      console.log("SuperformAPI never initialized.");
      return;
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
        Object.assign(formStepData, params.data);
        console.log("All stored data so far:", formStepData);
        populateHubspotForm(formStepData);
      });
    });
  }

  // Kick things off (guard against double execution)
  if (!window.__demoWorkerInit) {
    window.__demoWorkerInit = true;
    waitForSuperformAndInit();
  }

  // ===== Gorgias Chat Integration =====

  const initGorgiasChatPromise = (window.GorgiasChat && typeof window.GorgiasChat.init === 'function')
    ? window.GorgiasChat.init()
    : new Promise((resolve) => {
        window.addEventListener('gorgias-widget-loaded', resolve);
      });

  initGorgiasChatPromise.then(() => {
    if (window.GorgiasChat && typeof window.GorgiasChat.isOpen === 'function') {
      window.GorgiasChat.isOpen();
    }
  });

  function chatContactUs() {
    initGorgiasChatPromise.then(() => {
      if (!window.GorgiasChat) return;

      if (typeof window.GorgiasChat.open === 'function') {
        window.GorgiasChat.open();
      }

      const message = "Hi, I'm interested in Gorgias. Can you help me understand if it's a good fit?";
      if (typeof window.GorgiasChat.sendMessage === 'function') {
        window.GorgiasChat.sendMessage(message);
      }
    });
  }

  // Bind chat CTA button
  const chatBtn = document.querySelector('[data-el="open-chat"]');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      console.log("Chat button clicked");
      chatContactUs();
    });
  }

  // ===== DOM Ready Initializations =====

  document.addEventListener('DOMContentLoaded', () => {
    // Mirror email -> target
    const source = document.querySelector('[data-el="mirror-email"]');
    const target = document.querySelector('[data-el="mirror-email-target"]');

    if (source && target) {
      const mirrorEmail = () => { target.value = source.value; };
      mirrorEmail();
      source.addEventListener('input', mirrorEmail);
      source.addEventListener('change', mirrorEmail);
      source.addEventListener('blur', mirrorEmail);
    }

    // Hide elements after form submission (delegated event for dynamically injected HS button)
    document.addEventListener('click', (e) => {
      if (!e.target.matches('.hs-button.primary.large')) return;

      setTimeout(() => {
        const el = document.querySelector('[data-el="hide-after-form"]');
        if (!el) return;

        el.style.opacity = '0';
        setTimeout(() => { el.style.display = 'none'; }, 200);
      }, 500);
    });
  });

  // ===== ChiliPiper Initialization =====

  function cpQueueMethod(method) {
    return function() {
      ChiliPiper[method].q = (ChiliPiper[method].q || []).concat([arguments]);
    };
  }

  window.ChiliPiper = window.ChiliPiper ||
    "submit scheduling showCalendar submit widget bookMeeting".split(" ").reduce((acc, method) => {
      acc[method] = cpQueueMethod(method);
      return acc;
    }, {});

  // ===== HubSpot Form Message Handlers =====

  window.addEventListener("message", (event) => {
    const { type, eventName, id, data } = event.data;

    // Only handle HubSpot form callbacks for our specific form
    if (type !== 'hsFormCallback' || id !== DEMO_FORM_ID) return;

    if (eventName === 'onFormReady') {
      handleFormReady();
    } else if (eventName === 'onFormSubmitted') {
      handleFormSubmitted(data);
    }
  });

  function handleFormReady() {
    // Pre-select Reamaze if URL contains it
    const helpdeskWrapper = document.querySelector('div.hs_demo_current_helpdesk');
    if (helpdeskWrapper && location.href.includes('reamaze')) {
      setFieldValue('select[name=demo_current_helpdesk]', 'Reamaze');
    }

    // Populate UTM and timezone fields
    const utmFields = [
      { sessionKey: 'utm_campaign_session', fields: ['demo_utm_campaign', 'cross_sell_utm_campaign'] },
      { sessionKey: 'utm_source_session', fields: ['demo_utm_source', 'cross_sell_utm_source'] },
      { sessionKey: 'utm_medium_session', fields: ['demo_utm_medium', 'cross_sell_utm_medium'] },
      { sessionKey: 'utm_term_session', fields: ['demo_utm_term', 'cross_sell_utm_term'] }
    ];

    utmFields.forEach(({ sessionKey, fields }) => {
      const value = sessionStorage.getItem(sessionKey) || '';
      fields.forEach(field => setFieldValue(`input[name=${field}]`, value));
    });

    // Set timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    setFieldValue('input[name=demo_timezone]', timezone);
  }

  // Force height on ChiliPiper wrapper
  function forceChiliHeight() {
    const cpWrapper = document.querySelector('.wrapper-chilipiper-embed.is-variant');
    if (cpWrapper) {
      cpWrapper.style.display = 'block';
      cpWrapper.style.overflow = 'hidden';
      cpWrapper.style.setProperty('height', '350px', 'important');
      cpWrapper.style.setProperty('max-height', '350px', 'important');
    }
  }

  // Apply UI changes after form submission
  function applyPostSubmitStyles() {
    // Hide element with data-el="hide-after-form"
    const hideEl = document.querySelector('[data-el="hide-after-form"]');
    if (hideEl) {
      hideEl.style.display = 'none';
    }

    forceChiliHeight();
  }

  function handleFormSubmitted(eventData) {
    const submittedValues = eventData.submissionValues;

    // Apply post-submission UI changes
    applyPostSubmitStyles();

    // Convert arrays to semicolon-separated strings
    for (const key in submittedValues) {
      if (Array.isArray(submittedValues[key])) {
        submittedValues[key] = submittedValues[key].toString().replaceAll(",", ";");
      }
    }

    ChiliPiper.submit("gorgias", "inbound-router", {
      map: true,
      lead: submittedValues,
      formId: 'hsForm_' + DEMO_FORM_ID,
      domElement: ".wrapper-chilipiper-embed.is-variant",
      onRouting: () => {
        forceChiliHeight();
        safeTrack("cp_demo_request_routing");
      },
      onRouted: () => {
        forceChiliHeight();
        safeTrack("cp_demo_request_routed");
      },
      onSuccess: () => {
        safeTrack("cp_demo_booked");
        console.log('in success > demo');
        forceChiliHeight();

        // Hide all elements with data-el="hide-after-form"
        document.querySelectorAll('[data-el="hide-after-form"]').forEach(el => {
          el.style.display = 'none';
        });

        // Show post-demo booked wrapper
        const postBookedWrapper = document.querySelector('.wrapper-post-demo-booked');
        if (postBookedWrapper) {
          postBookedWrapper.classList.remove('is-hidden');
          postBookedWrapper.style.minWidth = '100%';
        }

        // Apply post-booking layout styles
        const formComponent = document.querySelector('.demo_form-component');
        if (formComponent) {
          formComponent.style.flexDirection = 'row';
          formComponent.style.minWidth = '100%';
          formComponent.style.justifyContent = 'center';
          formComponent.style.alignSelf = 'center';
        }

        const formWrapperMaxWidth = document.querySelector('.demo_form-wrapper-max-width');
        if (formWrapperMaxWidth) {
          formWrapperMaxWidth.style.display = 'none';
        }

        const cpWrapper = document.querySelector('.wrapper-chilipiper-embed.is-variant');
        if (cpWrapper) {
          cpWrapper.style.minWidth = '100%';
        }

        // Style the post-booking button
        const postBookedButton = document.querySelector('.wrapper-post-demo-booked button');
        if (postBookedButton) {
          postBookedButton.style.cssText = `
            display: flex;
            gap: 0.5rem;
            border: 0px none;
            border-radius: var(--border-radius--xsmall-5px);
            background-color: var(--black);
            color: var(--primary-white);
            text-align: center;
            text-transform: none;
            white-space: nowrap;
            cursor: pointer;
            justify-content: center;
            align-items: center;
            width: 100%;
            max-width: 23rem;
            margin-left: auto;
            margin-right: auto;
            padding: 0.75rem 1.25rem;
            font-size: 1.125rem;
            font-weight: 400;
            line-height: 1;
            text-decoration: none;
            transition: all 0.15s;
          `;
        }
      },
      onError: () => safeTrack("cp_demo_request_failed"),
      injectRootCss: true
    });
  }
})();
