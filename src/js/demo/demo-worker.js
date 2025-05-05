$('.edit-email').on('click', function(e) {
    e.preventDefault(); // Prevent the link's default behavior
    // Find the sibling input element with the "form_input" class.
    let $input = $(this).siblings('input.form_input');
    // Remove the "is-ghost" class and then focus the input.
    $input.removeClass('is-ghost').focus();
    // Hide the clicked ".edit-email" element by setting its opacity to 0 and disabling pointer events.
    $(this).css({'opacity': '0', 'pointer-events': 'none'});
  });
  
  // Mirror email input
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