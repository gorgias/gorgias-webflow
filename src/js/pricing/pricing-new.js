$(document).ready(function () {
  // =========================
  // Variables
  // =========================

let billingCycle = 'yearly'; // default state
let currentPlan = 'pro'; // default initial plan

// DOM elements
const $monthly = $('[data-el="monthly"]');
const $yearly = $('[data-el="yearly"].pricing-toggle_option');
const $cursor = $('.is-toggle-cursor');
const $billingInfo = $('[data-el="billing-info"]');
const $starterTab = $('[tab-link="starter"]');
let $starterText = $('[data-el="starter-text"]');
let $starterOption = $('[data-el="chosen-automation-starter"]');
let $basicOption = $('[data-el="chosen-automation-basic"]');
let $proOption = $('[data-el="chosen-automation-pro"]');
let $advancedOption = $('[data-el="chosen-automation-advanced"]');
const $toggleButton = $('[data-el="toggle-button"]');
const $toggleSwitch = $('[data-el="toggle-switch"]');

// Precomputed widths
const monthlyWidth = $monthly.outerWidth();
const yearlyWidth = $yearly.outerWidth();


// Switch state
let toggleState = "off";

const baseTicketVolumes = {
  starter: "50",
  basic: "300",
  pro: "2,000",
  advanced: "5,000"
};

let selectedAutomationTier = {
  starter: 0,
  basic: 0,
  pro: 0,
  advanced: 0
};

const cardPrices = {
  monthly: {
    Starter: 10,
    Basic: 60,
    Pro: 360,
    Advanced: 900
  },
  yearly: {
    Starter: 10,
    Basic: 50,
    Pro: 300,
    Advanced: 750
  }
};
// Automation rates per plan
const starterAutomation = {
  0: '0',
  10: '5',
  20: '10',
  30: '15',
  40: '20',
  50: '25',
};

const basicAutomation = {
  0: '0',
  10: '30',
  20: '60',
  30: '90',
  40: '120',
  50: '150',
}

const proAutomation = {
  0: '0',
  10: '200',
  20: '400',
  30: '600',
  40: '800',
  50: '1000',
};

const advancedAutomation = {
  0: '0',
  10: '500',
  20: '1000',
  30: '1500',
  40: '2000',
  50: '2500',
};

let automationPrices = {
  starter: 0,
  basic: 0,
  pro: 0,
  advanced: 0
};

// Addons prices
let voicePrice = $('[data-price="voice-price"]');
let smsPrice = $('[data-price="sms-price"]');
// Addons selected elements
let voiceSelected = $('[data-el="voice-selected"]');
let smsSelected = $('[data-el="sms-selected"]');
// FAQ selected elements
let faqSelected = $('[data-el="faq-selected"]');

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
   * Helper functions
   */
  // Format figures with comma separator
  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //Function to update query parameters in the URL
  function updateUrlParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url.toString());
  }

  // Pass parameters to CTAs
  function appendQueryParamsToCtaLinks() {
  const currentParams = new URLSearchParams(window.location.search).toString();
  if (!currentParams) return;

  // Append params to /signup and /demo links
  $('[href*="/signup"], [href*="/demo"]').each(function () {
    const $link = $(this);
    const baseHref = $link.attr('href').split('?')[0]; // strip existing params
    $link.attr('href', `${baseHref}?${currentParams}`);
  });
}

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

  function updateStarterText(cycle) {
  const text = cycle === 'monthly'
    ? '50 tickets/mo'
    : 'Only available for monthly subscription';

  $starterText.text(text);
  console.log(`Starter text updated: "${text}"`);
}

  /**
   * Toggle visibility of the Starter tab based on billing cycle.
   */
function toggleStarterTab(cycle) {
  const isDesktopActive = $starterTab.hasClass('w--current');
  const isMobileActive = $starterTab.find('[g-accordion-element="trigger"]').hasClass('is-active');
  const isStarterCurrent = isDesktopActive || isMobileActive;

  if (cycle === 'monthly') {
    $starterTab.removeClass('is-inactive');
    console.log('Starter tab activated (monthly)');
  } else {
    $starterTab.addClass('is-inactive');
    console.log('Starter tab deactivated (yearly)');

    // If Starter is currently selected, switch to Basic tab (works for mobile + desktop)
    if (isStarterCurrent) {
      const $nextTab = $('[tab-link="basic"]');
      if ($nextTab.length) {
        console.log('Switching to Basic tab (Starter is active & yearly selected)');
        $nextTab.trigger('click');
      }
    }
  }
}

  /**
   * Master controller: apply all changes based on billing cycle.
   */
function handleBillingChange(cycle) {
  billingCycle = cycle;
  console.log(`Billing cycle set to: ${billingCycle}`);
  sessionStorage.setItem('billingCycle', cycle);
  updateUrlParam('billingCycle', cycle);

  // Move toggle cursor
  if (cycle === 'monthly') {
    moveCursor('0%', monthlyWidth);
  } else {
    moveCursor('119%', yearlyWidth);
  }

  // Update text in ai info data-el="ai-res" from 0.90 to 1
  $('[data-el="ai-res"]').text(cycle === 'monthly' ? '1.00' : '0.90');

  updateBillingInfoText(cycle);
  updateStarterText(cycle);
  toggleStarterTab(cycle);

  // Recalculate automation prices based on selected percent for current billing cycle
  ['starter', 'basic', 'pro', 'advanced'].forEach(plan => {
    const percent = selectedAutomationTier[plan];
    const automationTable = {
      starter: starterAutomation,
      basic: basicAutomation,
      pro: proAutomation,
      advanced: advancedAutomation
    }[plan];

    const ticketCount = parseInt(automationTable[percent], 10);
    const automationPrice = ticketCount * (billingCycle === 'yearly' ? 0.9 : 1);

    automationPrices[plan] = automationPrice;
    updatePlanTotal(plan);
  });

  // Refresh selected voice tier price
  const voiceId = $('#voice-addons .addons_dropdown-links.selected')?.attr('id');
  if (voiceId && voiceId.startsWith('voice-tier-')) {
    const index = parseInt(voiceId.replace('voice-tier-', ''), 10);
    const tier = voiceTiers[billingCycle][index];
    if (tier) {
      voicePrice.text(`${formatNumberWithCommas(tier.price)}`);
      console.log(`Voice price updated: ${tier.range} - $${tier.price}`);
      const addonValue = `voice-${tierIndex}`;
      sessionStorage.setItem('addonSelected', addonValue);
      updateUrlParam('addonSelected', addonValue);
    }
  }

  // Refresh selected SMS tier price
  const smsId = $('#sms-addons .addons_dropdown-links.selected')?.attr('id');
  if (smsId && smsId.startsWith('sms-tier-')) {
    const index = parseInt(smsId.replace('sms-tier-', ''), 10);
    const tier = smsTiers[billingCycle][index];
    if (tier) {
      smsPrice.text(`${formatNumberWithCommas(tier.price)}`);
      console.log(`SMS price updated: ${tier.range} - $${tier.price}`);
      const addonValue = `sms-${tierIndex}`;
      sessionStorage.setItem('addonSelected', addonValue);
      updateUrlParam('addonSelected', addonValue);
    }
  }
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
        voicePrice.text(`${formatNumberWithCommas(selectedTier.price)}`);
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
        smsPrice.text(`${formatNumberWithCommas(selectedTier.price)}`);
        smsSelected.text($(this).text());

        // Update selected state
        $('#sms-addons .addons_dropdown-links').removeClass('selected');
        $(this).addClass('selected');

        console.log(`SMS tier selected: ${selectedTier.range} - $${selectedTier.price}`);
      }
    }
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function updatePlanTotal(plan) {
  const basePrice = cardPrices[billingCycle][capitalize(plan)];
  const automationPrice = automationPrices[plan] || 0;
  const total = basePrice + automationPrice;

  // Update the visible card price
  $(`[data-price="${plan}"]`).text(`$${formatNumberWithCommas(total)}`);
  console.log(`Updated ${plan} price: base $${basePrice} + automation $${automationPrice} = $${total}`);

  // Update tooltip values for the selected plan
  const $tab = $(`.pricing_tab-links[data-w-tab="${capitalize(plan)}"]`);

  $tab.find('[data-el="selected-helpdesk-amount"]').text(`${baseTicketVolumes[plan]}`);
  $tab.find('[data-el="selected-helpdesk-price"]').text(`${formatNumberWithCommas(basePrice)}`);
}

function initAutomationDropdowns() {
  $('[data-el^="starter-"], [data-el^="basic-"], [data-el^="pro-"], [data-el^="advanced-"]').on('click', function (e) {
    e.preventDefault();

    const dataEl = $(this).attr('data-el'); // e.g., "basic-10"
    const [plan, percentStr] = dataEl.split('-');
    const percent = parseInt(percentStr, 10);

    let automationTable;
    switch (plan) {
      case 'starter': automationTable = starterAutomation; break;
      case 'basic': automationTable = basicAutomation; break;
      case 'pro': automationTable = proAutomation; break;
      case 'advanced': automationTable = advancedAutomation; break;
      default: console.warn(`Unknown plan: ${plan}`); return;
    }

    const ticketCount = parseInt(automationTable[percent], 10);
    const automationPrice = ticketCount * (billingCycle === 'yearly' ? 0.9 : 1);

    // Store selected percent so we can recalculate later
    selectedAutomationTier[plan] = percent;
    automationPrices[plan] = automationPrice;
    sessionStorage.setItem('automationRate', percent);
    updateUrlParam('automationRate', percent);
    updatePlanTotal(plan);

    // Update tooltip values
    const $tab = $(`.pricing_tab-links[data-w-tab="${capitalize(plan)}"]`);
    $tab.find('[data-el="automate-item"]').removeClass('is-inactive');
    $tab.find('[data-el="selected-automate-amount"]').text(`${formatNumberWithCommas(ticketCount)}`);
    $tab.find('[data-el="selected-automate-price"]').text(`${formatNumberWithCommas(automationPrice)}`);

    // Update dropdown toggle label
    switch (plan) {
      case 'starter': $starterOption.text($(this).text()); break;
      case 'basic': $basicOption.text($(this).text()); break;
      case 'pro': $proOption.text($(this).text()); break;
      case 'advanced': $advancedOption.text($(this).text()); break;
    }

    // Close dropdown safely
    const $toggle = $(this).closest('.w-dropdown').find('.w-dropdown-toggle');
    if ($toggle.hasClass('w--open')) {
      $toggle.trigger('click');
    }
  });
}

function updateActivePlanElement() {
  const planElements = document.querySelectorAll("[g-col-highlight]");

  planElements.forEach((element) => {
    const highlightTarget = element.getAttribute("g-col-highlight").toLowerCase();
    const isMatch = highlightTarget === currentPlan.toLowerCase();

    element.classList.toggle("is-active", isMatch);
  });

  console.log(`Active plan highlighting updated: ${currentPlan}`);
}

// Tooltip sync with tab clicks
function syncTooltipWithActiveTab() {
  const observer = new MutationObserver(() => {
    $('.tooltip-pricing').removeClass('is-active');
    $('.pricing_tab-links.w--current .tooltip-pricing').addClass('is-active');
  });

  // Observe all pricing tab links for class changes
  $('.pricing_tab-links').each(function () {
    observer.observe(this, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  // Run once on load to ensure correct tooltip is active
  $('.tooltip-pricing').removeClass('is-active');
  $('.pricing_tab-links.w--current .tooltip-pricing').addClass('is-active');
}


// Update tooltip content logic
$('.pricing_tab-links').on('click', function () {
  const $this = $(this);

  const planKey = $this.attr('data-w-tab')?.toLowerCase();
  if (planKey && baseTicketVolumes[planKey] && cardPrices[billingCycle][capitalize(planKey)]) {
    const ticketCount = baseTicketVolumes[planKey];
    const price = cardPrices[billingCycle][capitalize(planKey)];

    $this.find('[data-el="selected-helpdesk-amount"]').text(`${formatNumberWithCommas(ticketCount)}`);
    $this.find('[data-el="selected-helpdesk-price"]').text(`${formatNumberWithCommas(price)}`);
  } else {
    console.warn(`Tab click failed to match plan key: ${planKey}`);
  }

  // Check automate state and toggle is-inactive
  const $automateItem = $this.find('[data-el="automate-item"]');
  const automateAmount = parseInt($this.find('[data-el="selected-automate-amount"]').text().replace(/\D/g, ''), 10);

  if (isNaN(automateAmount) || automateAmount === 0) {
    $automateItem.addClass('is-inactive');
  } else {
    $automateItem.removeClass('is-inactive');
  }

  // Update active plan highlighting
  if (planKey) {
    currentPlan = planKey;
    updateActivePlanElement();
    // Save to sessionStorage and URL
    sessionStorage.setItem('planSelected', planKey);
    updateUrlParam('planSelected', planKey);
  }

  console.log(`Tab clicked: ${$this.attr('data-w-tab')}`);
});

// Handle toggle button click to exclude or include features based on toggle state
$toggleButton.on('click', function () {
  const $this = $(this);
  $this.toggleClass('is-active');
  $toggleSwitch.toggleClass('is-active');

  toggleState = $this.hasClass('is-active') ? "on" : "off";
  console.log(`Toggle button clicked, state is now: ${toggleState}`);

  if (toggleState === "on") {
    $('[data-el="excluded"]').addClass('is-hidden');
  } else {
    $('[data-el="excluded"]').removeClass('is-hidden');
  }
});

// Mirror click from dropdown to tab link
$('.addons_dropdown-links[faq-q]').on('click', function (e) {
  const faqKey = $(this).attr('faq-q');
  const label = $(this).text().trim();

  if (faqKey) {
    // Mirror the tab click
    const $targetTab = $(`.component_tabs-link[faq-q="${faqKey}"]`);
    if ($targetTab.length) {
      $targetTab.trigger('click');
      console.log(`Mirrored click to .component_tabs-link[faq-q="${faqKey}"]`);
    } else {
      console.warn(`No .component_tabs-link found with faq-q="${faqKey}"`);
    }

    // Update displayed selected label
    if (faqSelected.length) {
      faqSelected.text(label);
      console.log(`Updated [data-el="faq-selected"] to: ${label}`);
    }
  }
});

// Mirror click from plan accordion to plan tab link
$('.pricing_toggle-trigger[tab-link]').on('click', function () {
  const tabKey = $(this).attr('tab-link');

  if (tabKey) {
    const $targetTab = $(`.pricing_tab-links[tab-link="${tabKey}"]`);
    if ($targetTab.length) {
      $targetTab.trigger('click');
      console.log(`Mirrored click to .pricing_tab-links[tab-link="${tabKey}"]`);
    } else {
      console.warn(`No .pricing_tab-links found with tab-link="${tabKey}"`);
    }
  }
});


  /**
   * Initialize component: set default UI and bind events.
   */
  function init() {
    console.log('Initializing billing toggle component');
    
    // Set initial UI for default billing cycle
    moveCursor('119%', yearlyWidth);
    updateBillingInfoText('yearly');
    toggleStarterTab('yearly');
    initAddonDropdowns();
    initAutomationDropdowns();
    syncTooltipWithActiveTab();
    appendQueryParamsToCtaLinks();

    // Bind events
    $monthly.on('click', () => handleBillingChange('monthly'));
    $yearly.on('click', () => handleBillingChange('yearly'));
  }

  // =========================
  // Initialize
  // =========================

  init();

});