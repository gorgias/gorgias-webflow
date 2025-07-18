var Webflow = Webflow || [];
Webflow.push(function () {
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
const $toggleButton = $('[data-el="toggle-button"]');
const $toggleSwitch = $('[data-el="toggle-switch"]');
let $pricingTxt = $('[data-el="total-price-txt"]');

// Precomputed widths
const monthlyWidth = $monthly.outerWidth();
const yearlyWidth = $yearly.outerWidth();


// Switch state
let toggleState = "off";

const baseTicketVolumes = {
  starter: 50,
  basic: 300,
  pro: 2000,
  advanced: 5000
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
  60: '30',
  70: '35',
  80: '40',
  90: '45',
  100: '50',
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
    return Number(number).toLocaleString('en-US');
  }

  function formatPrice(number) {
  const n = Number(number);
  return n % 1 === 0
    ? n.toLocaleString('en-US')
    : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

  // Use cached $pricingTxt variable
  pricingTxt = cycle === 'monthly'
    ? 'Total billed monthly'
    : 'Total billed yearly';
  $pricingTxt.text(pricingTxt);

  console.log(`Billing info updated: "${text}", pricingTxt: "${pricingTxt}"`);
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
  // toggleStarterTab(cycle);

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
    const automationPrice =
    plan === 'starter'
    ? ticketCount * 1
    : ticketCount * (billingCycle === 'yearly' ? 0.9 : 1);

    automationPrices[plan] = automationPrice;
    updatePlanTotal(plan);
  });

  updateMonthlyPriceSpans();

  // Refresh selected voice tier price
  const voiceId = $('#voice-addons .addons_dropdown-links.selected')?.attr('id');
  if (voiceId && voiceId.startsWith('voice-tier-')) {
    const index = parseInt(voiceId.replace('voice-tier-', ''), 10);
    const tier = voiceTiers[billingCycle][index];
    if (tier) {
      voicePrice.text(`${formatNumberWithCommas(tier.price)}`);
      console.log(`Voice price updated: ${tier.range} - $${tier.price}`);
      const addonValue = `voice-${tier.range}`;
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
      const addonValue = `sms-${tier.range}`;
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
        voicePrice.text(formatPrice(selectedTier.price));
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
        smsPrice.text(formatPrice(selectedTier.price));
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

  $(`[data-price="${plan}"]`).text(`$${formatPrice(total)}`);
  console.log(`Updated ${plan} price: base $${basePrice} + automation $${automationPrice} = $${total}`);

  // Update helpdesk tooltip values in the active tab pane
  const $pane = $(`.pricing_tab-panes[data-w-tab="${capitalize(plan)}"]`);

$pane.find('[data-el="selected-helpdesk-amount"]').text(formatNumberWithCommas(baseTicketVolumes[plan]));

  $pane.find('[data-el="selected-helpdesk-price"]').text(formatPrice(basePrice));
}

function initAutomationDropdowns() {
  $('[data-el^="starter-"], [data-el^="basic-"], [data-el^="pro-"], [data-el^="advanced-"]').on('click', function (e) {
    e.preventDefault();

    const dataEl = $(this).attr('data-el'); // e.g., "pro-30"
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
    const automationPrice =
    plan === 'starter'
    ? ticketCount * 1 // Always $1 for Starter
    : ticketCount * (billingCycle === 'yearly' ? 0.9 : 1);

    // Store selected percent so we can recalculate later
    selectedAutomationTier[plan] = percent;
    automationPrices[plan] = automationPrice;
    sessionStorage.setItem('automationRate', percent);
    updateUrlParam('automationRate', percent);
    updatePlanTotal(plan);
    updateMonthlyPriceSpans();

    // Update tooltip content in the active tab pane
    const $pane = $(`.pricing_tab-panes[data-w-tab="${capitalize(plan)}"]`);
    $pane.find('[data-el="automate-item"]').removeClass('is-inactive');
    $pane.find('[data-el="selected-automate-amount"]').text(`${formatNumberWithCommas(ticketCount)}`);
    $pane.find('[data-el="selected-automate-price"]').text(formatPrice(automationPrice)); 

    // Update dropdown toggle label
    $(`[data-el="chosen-automation-${plan}"]`).text($(this).text());

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

    // Only add is-active to the tooltip in the currently active tab pane
    $('.pricing_tab-panes.w--tab-active .tooltip-pricing').addClass('is-active');
  });

  // Watch for tab content (not tab links)
  $('.pricing_tab-panes').each(function () {
    observer.observe(this, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

  // Initial sync on load
  $('.tooltip-pricing').removeClass('is-active');
  $('.pricing_tab-panes.w--tab-active .tooltip-pricing').addClass('is-active');
  console.log('Tooltip sync initialized with active tab');
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

    recalculateOpenAccordions();
});

function recalculateOpenAccordions() {
  // For each open accordion content
  $('[g-accordion-element="content"].is-active').each(function () {
    const $content = $(this);
    // Remove maxHeight to let browser calculate scrollHeight
    $content[0].style.maxHeight = null;

    // Wait for reflow after DOM changes (important!)
    setTimeout(() => {
      $content[0].style.maxHeight = $content[0].scrollHeight + "px";
    }, 10);
  });
}

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
 * For variant
 */
// Sync all billing toggles across instances
// Sync all billing toggles across sections + control yearly-saving visibility
$('[data-el="monthly"], [data-el="yearly"]').on('click', function () {
  const $clicked = $(this);
  const target = $clicked.data('el'); // 'monthly' or 'yearly'

  // Avoid redundant re-triggering
  if ($clicked.hasClass('is-active')) return;

  console.log(`Billing toggle selected: ${target}`);

  // Deactivate all toggles
  $('[data-el="monthly"], [data-el="yearly"]').removeClass('is-active');

  // Activate all of the selected type and trigger logic
  $(`[data-el="${target}"]`).addClass('is-active').each(function () {
    if (this !== $clicked[0]) {
      $(this).trigger('click');
    }
  });

  // Handle yearly savings display
  if (target === 'monthly') {
    $('[data-el="yearly-saving"]').css('opacity', 0);
    setTimeout(() => {
      $('[data-el="yearly-saving"]').css('display', 'none');
    }, 150);
  } else {
    $('[data-el="yearly-saving"]').css('opacity', 1);
    $('[data-el="yearly-saving"]').css('display', 'block');
  }
});

function updateMonthlyPriceSpans() {
  // Loop through each plan except 'starter'
  ['basic', 'pro', 'advanced'].forEach(plan => {
    // Always use the monthly base price, regardless of current billingCycle
    const basePrice = cardPrices['monthly'][capitalize(plan)];
    const percent = selectedAutomationTier[plan];
    let automationTable;

    switch (plan) {
      case 'basic': automationTable = basicAutomation; break;
      case 'pro': automationTable = proAutomation; break;
      case 'advanced': automationTable = advancedAutomation; break;
      default: return;
    }
    const ticketCount = parseInt(automationTable[percent], 10);
    const automationPrice = ticketCount * 1; // Always 1x for monthly

    const total = basePrice + automationPrice;


   $(`[data-el="monthly-price-${plan}"]`).text(`${formatPrice(total)}`);

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
    
    // toggleStarterTab('yearly');
    initAddonDropdowns();
    initAutomationDropdowns();
    syncTooltipWithActiveTab();
    appendQueryParamsToCtaLinks();

    // Set default automation levels
    setTimeout(() => {
      console.log('Triggering default automation: Basic 20%');
      $('[data-el="basic-20"]').trigger('click');

      console.log('Triggering default automation: Advanced 50%');
      $('[data-el="advanced-50"]').trigger('click');

      console.log('Triggering default automation: Pro 30%');
      $('[data-el="pro-30"]').trigger('click');

      updateMonthlyPriceSpans();

    }, 50);


    // Bind events
    $monthly.on('click', () => handleBillingChange('monthly'));
    $yearly.on('click', () => handleBillingChange('yearly'));
  }

  // =========================
  // Initialize
  // =========================

  init();

});