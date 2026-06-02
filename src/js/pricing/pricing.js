var Webflow = Webflow || [];
Webflow.push(function () {

  // State
  let billingCycle = 'yearly';
  let currentPlan = 'pro';
  let toggleState = 'off';

  // DOM elements
  const $monthly = $('[data-el="monthly"]');
  const $yearly = $('[data-el="yearly"].pricing-toggle_option');
  const $cursor = $('.is-toggle-cursor');
  const $billingInfo = $('[data-el="billing-info"]');
  const $starterTab = $('[tab-link="starter"]');
  const $starterText = $('[data-el="starter-text"]');
  const $toggleButton = $('[data-el="toggle-button"]');
  const $toggleSwitch = $('[data-el="toggle-switch"]');
  const $pricingTxt = $('[data-el="total-price-txt"]');
  const $yearlySaving = $('[data-el="yearly-saving"]');
  const voicePrice = $('[data-price="voice-price"]');
  const smsPrice = $('[data-price="sms-price"]');
  const voiceSelected = $('[data-el="voice-selected"]');
  const smsSelected = $('[data-el="sms-selected"]');
  const faqSelected = $('[data-el="faq-selected"]');

  // Precomputed widths
  const monthlyWidth = $monthly.outerWidth();
  const yearlyWidth = $yearly.outerWidth();

  // Constants
  const PLANS = ['starter', 'basic', 'pro', 'advanced'];

  const baseTicketVolumes = {
    starter: 50,
    basic: 300,
    pro: 2000,
    advanced: 5000
  };

  const cardPrices = {
    monthly: { Starter: 10, Basic: 60, Pro: 360, Advanced: 900 },
    yearly:  { Starter: 10, Basic: 50, Pro: 300, Advanced: 750 }
  };

  const automationTables = {
    starter:  { 0:'0', 10:'5',   20:'10',  30:'15',  40:'20',  50:'25',  60:'30', 70:'35', 80:'40', 90:'45', 100:'50' },
    basic:    { 0:'0', 10:'30',  20:'60',  30:'100', 40:'120', 50:'150' },
    pro:      { 0:'0', 10:'190', 20:'410', 30:'600', 40:'800', 50:'1000' },
    advanced: { 0:'0', 10:'530', 20:'1000',30:'1500',40:'2000',50:'2500' }
  };

  let selectedAutomationTier = { starter: 0, basic: 0, pro: 0, advanced: 0 };
  let automationPrices = { starter: 0, basic: 0, pro: 0, advanced: 0 };

  const voiceTiers = {
    monthly: [
      { range: 'No Voice Tickets', tier: 'Tier 0', price: 0   },
      { range: '0-24',             tier: 'Tier 1', price: 30  },
      { range: '25-74',            tier: 'Tier 2', price: 90  },
      { range: '75-149',           tier: 'Tier 3', price: 135 },
      { range: '150-249',          tier: 'Tier 4', price: 175 },
      { range: '250-499',          tier: 'Tier 5', price: 250 },
      { range: '500-999',          tier: 'Tier 6', price: 400 },
    ],
    yearly: [
      { range: 'No Voice Tickets', tier: 'Tier 0', price: 0   },
      { range: '0-24',             tier: 'Tier 1', price: 25  },
      { range: '25-74',            tier: 'Tier 2', price: 75  },
      { range: '75-149',           tier: 'Tier 3', price: 113 },
      { range: '150-249',          tier: 'Tier 4', price: 146 },
      { range: '250-499',          tier: 'Tier 5', price: 208 },
      { range: '500-999',          tier: 'Tier 6', price: 333 },
    ],
  };

  const smsTiers = {
    monthly: [
      { range: 'No SMS Tickets', tier: 'Tier 0', price: 0   },
      { range: '0-24',           tier: 'Tier 1', price: 20  },
      { range: '25-74',          tier: 'Tier 2', price: 60  },
      { range: '75-149',         tier: 'Tier 3', price: 90  },
      { range: '150-249',        tier: 'Tier 4', price: 140 },
      { range: '250-499',        tier: 'Tier 5', price: 216 },
      { range: '500-999',        tier: 'Tier 6', price: 408 },
      { range: '999+',           tier: 'Tier 7', price: 0   },
    ],
    yearly: [
      { range: 'No SMS Tickets', tier: 'Tier 0', price: 0   },
      { range: '0-24',           tier: 'Tier 1', price: 17  },
      { range: '25-74',          tier: 'Tier 2', price: 50  },
      { range: '75-149',         tier: 'Tier 3', price: 75  },
      { range: '150-249',        tier: 'Tier 4', price: 117 },
      { range: '250-499',        tier: 'Tier 5', price: 180 },
      { range: '500-999',        tier: 'Tier 6', price: 340 },
      { range: '999+',           tier: 'Tier 7', price: 0   },
    ],
  };

  // =========================
  // Helpers
  // =========================

  function formatNumberWithCommas(number) {
    return Number(number).toLocaleString('en-US');
  }

  function formatPrice(number) {
    const n = Number(number);
    return n % 1 === 0
      ? n.toLocaleString('en-US')
      : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function updateUrlParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url.toString());
    appendQueryParamsToCtaLinks();
  }

  function appendQueryParamsToCtaLinks() {
    const currentParams = new URLSearchParams(window.location.search).toString();
    if (!currentParams) return;
    $('[href*="/signup"], [href*="/demo"]').each(function () {
      const $link = $(this);
      const baseHref = $link.attr('href').split('?')[0];
      $link.attr('href', `${baseHref}?${currentParams}`);
    });
  }

  function moveCursor(positionX, width) {
    $cursor.css({ transform: `translate(${positionX}, -50%)` });
    setTimeout(() => { $cursor.css({ width }); }, 100);
  }

  function calcAutomationPrice(plan, ticketCount) {
    return plan === 'starter'
      ? ticketCount
      : ticketCount * (billingCycle === 'yearly' ? 0.9 : 1);
  }

  // =========================
  // UI update functions
  // =========================

  function updateBillingInfoText(cycle) {
    $billingInfo.text(cycle === 'monthly'
      ? 'Switch to yearly and get 2 months free'
      : 'Includes 2 months free on all plans');
    $pricingTxt.text(cycle === 'monthly' ? 'Total billed monthly' : 'Total billed yearly');
  }

  function updateStarterText(cycle) {
    $starterText.text(cycle === 'monthly'
      ? '50 tickets/mo'
      : 'Only available for monthly subscription');
  }

  function toggleStarterTab(cycle) {
    const isActive = $starterTab.hasClass('w--current') ||
      $starterTab.find('[g-accordion-element="trigger"]').hasClass('is-active');
    $starterTab.toggleClass('is-inactive', cycle !== 'monthly');
    if (cycle !== 'monthly' && isActive) {
      const $nextTab = $('[tab-link="basic"]');
      if ($nextTab.length) $nextTab.trigger('click');
    }
  }

  function updatePlanTotal(plan) {
    const basePrice = cardPrices[billingCycle][capitalize(plan)];
    const automationPrice = automationPrices[plan] || 0;
    const $pane = $(`.pricing_tab-panes[data-w-tab="${capitalize(plan)}"]`);

    $(`[data-price="${plan}"]`).text(`$${formatPrice(basePrice + automationPrice)}`);
    $pane.find('[data-el="selected-helpdesk-amount"]').text(formatNumberWithCommas(baseTicketVolumes[plan]));
    $pane.find('[data-el="selected-helpdesk-price"]').text(formatPrice(basePrice));
    $pane.find('[data-el="selected-automate-price"]').text(formatPrice(automationPrice));
  }

  function updateMonthlyPriceSpans() {
    ['basic', 'pro', 'advanced'].forEach(plan => {
      const basePrice = cardPrices['monthly'][capitalize(plan)];
      const ticketCount = parseInt(automationTables[plan][selectedAutomationTier[plan]], 10);
      $(`[data-el="monthly-price-${plan}"]`).text(formatPrice(basePrice + ticketCount));
    });
  }

  function recalcAllAutomationPrices() {
    PLANS.forEach(plan => {
      const ticketCount = parseInt(automationTables[plan][selectedAutomationTier[plan]], 10);
      automationPrices[plan] = calcAutomationPrice(plan, ticketCount);
      updatePlanTotal(plan);
    });
  }

  function updateActivePlanElement() {
    document.querySelectorAll('[g-col-highlight]').forEach(el => {
      el.classList.toggle('is-active', el.getAttribute('g-col-highlight').toLowerCase() === currentPlan);
    });
  }

  function recalculateOpenAccordions() {
    $('[g-accordion-element="content"].is-active').each(function () {
      this.style.maxHeight = null;
      setTimeout(() => { this.style.maxHeight = this.scrollHeight + 'px'; }, 10);
    });
  }

  // =========================
  // Master billing controller
  // =========================

  function handleBillingChange(cycle) {
    billingCycle = cycle;
    sessionStorage.setItem('billingCycle', cycle);
    updateUrlParam('billingCycle', cycle);

    moveCursor(cycle === 'monthly' ? '0%' : '119%', cycle === 'monthly' ? monthlyWidth : yearlyWidth);
    $('[data-el="ai-res"]').text(cycle === 'monthly' ? '1.00' : '0.90');
    updateBillingInfoText(cycle);
    updateStarterText(cycle);
    recalcAllAutomationPrices();
    updateMonthlyPriceSpans();

    // Refresh selected voice tier price
    const voiceId = $('#voice-addons .addons_dropdown-links.selected')?.attr('id');
    if (voiceId && voiceId.startsWith('voice-tier-')) {
      const tier = voiceTiers[billingCycle][parseInt(voiceId.replace('voice-tier-', ''), 10)];
      if (tier) {
        voicePrice.text(formatNumberWithCommas(tier.price));
        const addonValue = `voice-${tier.range}`;
        sessionStorage.setItem('addonSelected', addonValue);
        updateUrlParam('addonSelected', addonValue);
      }
    }

    // Refresh selected SMS tier price
    const smsId = $('#sms-addons .addons_dropdown-links.selected')?.attr('id');
    if (smsId && smsId.startsWith('sms-tier-')) {
      const tier = smsTiers[billingCycle][parseInt(smsId.replace('sms-tier-', ''), 10)];
      if (tier) {
        smsPrice.text(formatNumberWithCommas(tier.price));
        const addonValue = `sms-${tier.range}`;
        sessionStorage.setItem('addonSelected', addonValue);
        updateUrlParam('addonSelected', addonValue);
      }
    }
  }

  // =========================
  // Dropdown initializers
  // =========================

  function initAddonDropdowns() {
    function bindAddonTierClicks(prefix, tiers, $priceEl, $selectedEl) {
      $(`#${prefix}-addons .addons_dropdown-links`).on('click', function (e) {
        e.preventDefault();
        const id = $(this).attr('id');
        if (!id || !id.startsWith(`${prefix}-tier-`)) return;
        const tier = tiers[billingCycle][parseInt(id.replace(`${prefix}-tier-`, ''), 10)];
        if (!tier) return;
        $priceEl.text(formatPrice(tier.price));
        $selectedEl.text($(this).text());
        $(`#${prefix}-addons .addons_dropdown-links`).removeClass('selected');
        $(this).addClass('selected');
      });
    }
    bindAddonTierClicks('voice', voiceTiers, voicePrice, voiceSelected);
    bindAddonTierClicks('sms', smsTiers, smsPrice, smsSelected);
  }

  function initAutomationDropdowns() {
    $('[data-el^="starter-"], [data-el^="basic-"], [data-el^="pro-"], [data-el^="advanced-"]').on('click', function (e) {
      e.preventDefault();
      const [plan, percentStr] = $(this).attr('data-el').split('-');
      const percent = parseInt(percentStr, 10);
      if (!automationTables[plan]) return;

      const ticketCount = parseInt(automationTables[plan][percent], 10);
      const automationPrice = calcAutomationPrice(plan, ticketCount);

      selectedAutomationTier[plan] = percent;
      automationPrices[plan] = automationPrice;
      sessionStorage.setItem('automationRate', percent);
      updateUrlParam('automationRate', percent);
      updatePlanTotal(plan);
      updateMonthlyPriceSpans();

      const $pane = $(`.pricing_tab-panes[data-w-tab="${capitalize(plan)}"]`);
      $pane.find('[data-el="automate-item"]').removeClass('is-inactive');
      $pane.find('[data-el="selected-automate-amount"]').text(formatNumberWithCommas(ticketCount));
      $(`[data-el="chosen-automation-${plan}"]`).text(`${formatNumberWithCommas(ticketCount)} automated interactions`);

      const $toggle = $(this).closest('.w-dropdown').find('.w-dropdown-toggle');
      if ($toggle.hasClass('w--open')) $toggle.trigger('click');
    });
  }

  function syncTooltipWithActiveTab() {
    const observer = new MutationObserver(() => {
      $('.tooltip-pricing').removeClass('is-active');
      $('.pricing_tab-panes.w--tab-active .tooltip-pricing').addClass('is-active');
    });
    $('.pricing_tab-panes').each(function () {
      observer.observe(this, { attributes: true, attributeFilter: ['class'] });
    });
    $('.tooltip-pricing').removeClass('is-active');
    $('.pricing_tab-panes.w--tab-active .tooltip-pricing').addClass('is-active');
  }

  // =========================
  // Event bindings
  // =========================

  $('.pricing_tab-links').on('click', function () {
    const $this = $(this);
    const planKey = $this.attr('data-w-tab')?.toLowerCase();

    if (planKey && baseTicketVolumes[planKey] && cardPrices[billingCycle][capitalize(planKey)]) {
      $this.find('[data-el="selected-helpdesk-amount"]').text(formatNumberWithCommas(baseTicketVolumes[planKey]));
      $this.find('[data-el="selected-helpdesk-price"]').text(formatNumberWithCommas(cardPrices[billingCycle][capitalize(planKey)]));
    }

    const automateAmount = parseInt($this.find('[data-el="selected-automate-amount"]').text().replace(/\D/g, ''), 10);
    $this.find('[data-el="automate-item"]').toggleClass('is-inactive', !automateAmount);

    if (planKey) {
      currentPlan = planKey;
      updateActivePlanElement();
      sessionStorage.setItem('planSelected', planKey);
      updateUrlParam('planSelected', planKey);
    }
  });

  $toggleButton.on('click', function () {
    const $this = $(this);
    $this.toggleClass('is-active');
    $toggleSwitch.toggleClass('is-active');
    toggleState = $this.hasClass('is-active') ? 'on' : 'off';
    $('[data-el="excluded"]').toggleClass('is-hidden', toggleState === 'on');
    recalculateOpenAccordions();
  });

  $('.addons_dropdown-links[faq-q]').on('click', function () {
    const faqKey = $(this).attr('faq-q');
    if (!faqKey) return;
    $(`.component_tabs-link[faq-q="${faqKey}"]`).trigger('click');
    if (faqSelected.length) faqSelected.text($(this).text().trim());
  });

  $('.pricing_toggle-trigger[tab-link]').on('click', function () {
    const tabKey = $(this).attr('tab-link');
    if (tabKey) $(`.pricing_tab-links[tab-link="${tabKey}"]`).trigger('click');
  });

  $('[data-el="monthly"], [data-el="yearly"]').on('click', function () {
    const $clicked = $(this);
    const target = $clicked.data('el');
    if ($clicked.hasClass('is-active')) return;

    $('[data-el="monthly"], [data-el="yearly"]').removeClass('is-active');
    $(`[data-el="${target}"]`).addClass('is-active').each(function () {
      if (this !== $clicked[0]) $(this).trigger('click');
    });

    if (target === 'monthly') {
      $yearlySaving.css('opacity', 0);
      setTimeout(() => { $yearlySaving.css('display', 'none'); }, 150);
    } else {
      $yearlySaving.css({ opacity: 1, display: 'block' });
    }
  });

  // =========================
  // Init
  // =========================

  function init() {
    moveCursor('119%', yearlyWidth);
    updateBillingInfoText('yearly');
    initAddonDropdowns();
    initAutomationDropdowns();
    syncTooltipWithActiveTab();
    appendQueryParamsToCtaLinks();

    setTimeout(() => {
      $('[data-el="basic-20"]').trigger('click');
      $('[data-el="advanced-50"]').trigger('click');
      $('[data-el="pro-30"]').trigger('click');

      PLANS.forEach(plan => {
        const ticketCount = parseInt(automationTables[plan][selectedAutomationTier[plan]], 10);
        $(`[data-el="chosen-automation-${plan}"]`).text(`${formatNumberWithCommas(ticketCount)} automated interactions`);
      });

      updateMonthlyPriceSpans();
    }, 50);

    $monthly.on('click', () => handleBillingChange('monthly'));
    $yearly.on('click', () => handleBillingChange('yearly'));
  }

  init();
});
