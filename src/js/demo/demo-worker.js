$(document).ready(function () {
    const $source = $('[data-el="mirror-email"]');
    const $target = $('[data-el="mirror-email-target"]');
  
    if (!$source.length || !$target.length) return;
  
    // Mirror function
    const mirrorEmail = () => {
      $target.val($source.val());
    };
  
    // Initial sync (in case of pre-filled)
    mirrorEmail();
  
    // Sync on input and other possible events
    $source.on('input change blur', mirrorEmail);
  });
  

  function waitForSuperformAndInit(retries = 10, delay = 300) {
    if (!window.SuperformAPI || typeof window.SuperformAPI.push !== 'function') {
      if (retries > 0) {
        return setTimeout(() => waitForSuperformAndInit(retries - 1, delay), delay);
      } else {
        console.log("SuperformAPI never initialized.");
        return;
      }
    }
  
    window.SuperformAPI.push(({ allForms }) => {
      console.log("Full Superform objects:", allForms);
  
      const myForm = allForms[0];
  
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
  
  function populateHubspotForm(formData) {
    const hsForm = document.querySelector("#hsForm_c0b510e0-b9e8-49bf-a54c-872a45c50040");
    if (!hsForm) {
      console.log("HubSpot form not found yet.");
      return;
    }
  
    const fieldMapping = {
      email: 'email',
      Website: 'company_domain',
      'ecommerce-platform': 'demo_ecommerce_platform',
      conversations: 'demo_tickets_volume',
      'annual-sales-range': 'demo_annual_sales_range',
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
      const value = formData[sourceKey];
      if (!value) continue;
  
      const input = hsForm.querySelector(`[name="${targetName}"]`);
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        console.log(`HubSpot field "${targetName}" not found in form.`);
      }
    }
  }
  
  // Kick things off
  waitForSuperformAndInit();

// Hide elements after form submission
$(document).ready(function () {
  $('.hs-button.primary.large').on('click', function () {
    setTimeout(function () {
      $('[data-el="hide-after-form"]').css('opacity', '0');
    setTimeout(function () {
      $('[data-el="hide-after-form"]').css('display', 'none');
    }, 200);
    }, 500);
  });
});

// Open chat widget when clicking on "Talk to sales" CTA
function chatContactUs(field){
    initGorgiasChatPromise.then(function() {
    // open chat popup
    GorgiasChat.open();

    // Send a consistent welcome message
    const message = "Hi, I’m interested in Gorgias. Can you help me understand if it’s a good fit?";
    GorgiasChat.sendMessage(message);
})
}

document.querySelector('[data-el="open-chat"]').addEventListener('click', chatContactUs, console.log("Chat button clicked"));