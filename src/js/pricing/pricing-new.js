$(document).ready(function () {
  // =========================
  // Variables
  // =========================

  let billingCycle = 'yearly'; // default state

  // Cache DOM elements
  const $monthly = $('[data-el="monthly"]');
  const $yearly = $('[data-el="yearly"].pricing-toggle_option');
  const $cursor = $('.is-toggle-cursor');
  const $billingInfo = $('[data-el="billing-info"]');
  const $starterTab = $('[data-w-tab="Starter"]');

  // Precomputed widths
  const monthlyWidth = $monthly.outerWidth();
  const yearlyWidth = $yearly.outerWidth();

  // Card prices for yearly and monthly values
  let basic = $('[data-price="basic"]');
  let pro = $('[data-price="pro"]');
  let advanced = $('[data-price="advanced"]');

  const cardPrices = {
    monthly: {
      Starter: '$10',
      Basic: '$60',
      Pro: '$360',
      Advanced: '$900'
    },
    yearly: {
      Starter: '$10',
      Basic: '$50',
      Pro: '$300',
      Advanced: '$750'
    }
  };

// Addons prices
let voicePrice = $('[data-price="voice-price"]');
let smsPrice = $('[data-price="sms-price"]');
// Addons selected elements
let voiceSelected = $('[data-el="voice-selected"]');
let smsSelected = $('[data-el="sms-selected"]');

// Define the voice tiers
const voiceTiers = {
  monthly: [
    { range: "No Voice Tickets", tier: "Tier 0", price: 0 },
    { range: "0-24", tier: "Tier 1", price: 30 },
    { range: "25-74", tier: "Tier 2", price: 90 },
    { range: "75-149", tier: "Tier 3", price: 135 },
    { range: "150-249", tier: "Tier 4", price: 175 },
    { range: "250-499", tier: "Tier 5", price: 250 },
    { range: "500-999", tier: "Tier 6", price: 400 },

  ],
  yearly: [
    { range: "No Voice Tickets", tier: "Tier 0", price: 0 },
    { range: "0-24", tier: "Tier 1", price: 25 },
    { range: "25-74", tier: "Tier 2", price: 75 },
    { range: "75-149", tier: "Tier 3", price: 113 },
    { range: "150-249", tier: "Tier 4", price: 146 },
    { range: "250-499", tier: "Tier 5", price: 208 },
    { range: "500-999", tier: "Tier 6", price: 333 },
  ],
};

// Define the SMS tiers
const smsTiers = {
  monthly: [
    { range: "No SMS Tickets", tier: "Tier 0", price: 0 },
    { range: "0-24", tier: "Tier 1", price: 20 },
    { range: "25-74", tier: "Tier 2", price: 60 },
    { range: "75-149", tier: "Tier 3", price: 90 },
    { range: "150-249", tier: "Tier 4", price: 140 },
    { range: "250-499", tier: "Tier 5", price: 216 },
    { range: "500-999", tier: "Tier 6", price: 408 },
    { range: "999+", tier: "Tier 7", price: 0 },
  ],
  yearly: [
    { range: "No SMS Tickets", tier: "Tier 0", price: 0 },
    { range: "0-24", tier: "Tier 1", price: 17 },
    { range: "25-74", tier: "Tier 2", price: 50 },
    { range: "75-149", tier: "Tier 3", price: 75 },
    { range: "150-249", tier: "Tier 4", price: 117 },
    { range: "250-499", tier: "Tier 5", price: 180 },
    { range: "500-999", tier: "Tier 6", price: 340 },
    { range: "999+", tier: "Tier 7", price: 0 },
  ],
};

  // =========================
  // Functions
  // =========================

  /**
   * Move the toggle cursor to the specified X position
   * and apply the given width after a delay.
   */
  function moveCursor(positionX, width) {
    console.log(`Moving cursor to ${positionX}, setting width in 100ms`);
    $cursor.css({
      transform: `translate(${positionX}, -50%)`
    });

    setTimeout(() => {
      $cursor.css({ width });
      console.log(`Cursor width set to ${width}px`);
    }, 100);
  }

  /**
   * Update billing info label text based on current billing cycle.
   */
  function updateBillingInfoText(cycle) {
    const text = cycle === 'monthly'
      ? 'Switch to yearly and get 2 months free'
      : 'Includes 2 months free on all plans';
    $billingInfo.text(text);
    console.log(`Billing info updated: "${text}"`);
  }

  /**
   * Toggle visibility of the Starter tab based on billing cycle.
   */
function toggleStarterTab(cycle) {
  const isStarterCurrent = $starterTab.hasClass('w--current');

  if (cycle === 'monthly') {
    $starterTab.removeClass('is-inactive');
    console.log('Starter tab activated (monthly)');
  } else {
    $starterTab.addClass('is-inactive');
    console.log('Starter tab deactivated (yearly)');

    // If Starter is the current tab, switch to the next one
    if (isStarterCurrent) {
      const $nextTab = $('[data-w-tab="Basic"]');

      if ($nextTab.length) {
        console.log('Switching to Basic tab (Starter is active & yearly selected)');
        $nextTab.click(); // triggers tab change via Webflow
      }
    }
  }
}

/**
 * Update price values based on the selected billing cycle.
 */
function updateCardPrices(cycle) {
  console.log(`Updating card prices for: ${cycle}`);

  basic.text(cardPrices[cycle].Basic);
  pro.text(cardPrices[cycle].Pro);
  advanced.text(cardPrices[cycle].Advanced);
}

  /**
   * Master controller: apply all changes based on billing cycle.
   */
function handleBillingChange(cycle) {
  billingCycle = cycle;
  console.log(`Billing cycle set to: ${billingCycle}`);

  // Move cursor UI
  if (cycle === 'monthly') {
    moveCursor('0%', monthlyWidth);
  } else {
    moveCursor('119%', yearlyWidth);
  }

  updateBillingInfoText(cycle);
  toggleStarterTab(cycle);
  updateCardPrices(cycle);

  // Refresh voice tier price if a tier is already selected
  const voiceId = $('#voice-addons .addons_dropdown-links.selected')?.attr('id'); // optional class 'selected' can help here
  if (voiceId && voiceId.startsWith('voice-tier-')) {
    const index = parseInt(voiceId.replace('voice-tier-', ''), 10);
    const tier = voiceTiers[billingCycle][index];
    if (tier) {
      voicePrice.text(`${tier.price}`);
      console.log(`Voice price updated: ${tier.range} - $${tier.price}`);
    }
  }

  // Refresh sms tier price if a tier is already selected
  const smsId = $('#sms-addons .addons_dropdown-links.selected')?.attr('id');
  if (smsId && smsId.startsWith('sms-tier-')) {
    const index = parseInt(smsId.replace('sms-tier-', ''), 10);
    const tier = smsTiers[billingCycle][index];
    if (tier) {
      smsPrice.text(`${tier.price}`);
      console.log(`SMS price updated: ${tier.range} - $${tier.price}`);
    }
  }
}

function enterpriseRedirect() {
  const $cta = $('[data-el="enterprise-cta"]');

  if ($cta.length) {
    // Ensure it's always a clean setup
    $cta.attr('href', '/demo');
    $cta.removeAttr('tabindex aria-controls aria-selected');
    $cta.off('click.enterprise');

    $cta.on('click.enterprise', function (e) {
      e.preventDefault();
      console.log('Enterprise tab clicked — redirecting to /demo');
      window.location.href = '/demo';
    });
  }
}

function enterpriseCTA() {
  enterpriseRedirect();
  console.log('Enterprise CTA initialized');
}

/**
* Addon dropdowns
*/

function initAddonDropdowns() {
  // Voice Tier selection
  $('#voice-addons .addons_dropdown-links').on('click', function (e) {
    e.preventDefault();

    const id = $(this).attr('id'); // e.g., voice-tier-3
    if (id && id.startsWith('voice-tier-')) {
      const tierIndex = parseInt(id.replace('voice-tier-', ''), 10);
      const selectedTier = voiceTiers[billingCycle][tierIndex];

      if (selectedTier) {
        // Update price and selected label
        voicePrice.text(`${selectedTier.price}`);
        voiceSelected.text($(this).text());

        // Update selected state
        $('#voice-addons .addons_dropdown-links').removeClass('selected');
        $(this).addClass('selected');

        console.log(`Voice tier selected: ${selectedTier.range} - $${selectedTier.price}`);
      }
    }
  });

  // SMS Tier selection
  $('#sms-addons .addons_dropdown-links').on('click', function (e) {
    e.preventDefault();

    const id = $(this).attr('id'); // e.g., sms-tier-2
    if (id && id.startsWith('sms-tier-')) {
      const tierIndex = parseInt(id.replace('sms-tier-', ''), 10);
      const selectedTier = smsTiers[billingCycle][tierIndex];

      if (selectedTier) {
        // Update price and selected label
        smsPrice.text(`${selectedTier.price}`);
        smsSelected.text($(this).text());

        // Update selected state
        $('#sms-addons .addons_dropdown-links').removeClass('selected');
        $(this).addClass('selected');

        console.log(`SMS tier selected: ${selectedTier.range} - $${selectedTier.price}`);
      }
    }
  });
}

  /**
   * Initialize component: set default UI and bind events.
   */
  function init() {
    console.log('Initializing billing toggle component');
    
    // Set initial UI for default billing cycle
    moveCursor('119%', yearlyWidth);
    updateBillingInfoText('yearly');
    toggleStarterTab('yearly');
    enterpriseCTA();
    initAddonDropdowns()

    // Bind events
    $monthly.on('click', () => handleBillingChange('monthly'));
    $yearly.on('click', () => handleBillingChange('yearly'));

    $('[data-w-tab]').on('click', () => {
      enterpriseRedirect(); 
    });
  }

  // =========================
  // Initialize
  // =========================

  init();

});