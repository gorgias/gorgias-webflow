(function () {
  // Use global formatNumberWithCommas if available (from all.js); otherwise fallback
  const fmtWithCommas = (n) => {
    const s = String(n);
    if (typeof window !== 'undefined' && typeof window.formatNumberWithCommas === 'function') {
      return window.formatNumberWithCommas(s);
    }
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatUS = (num) => {
    const fixed = Number(num || 0).toFixed(0);
    return fmtWithCommas(fixed);
  };

  // Get affiliate tier multiplier based on number of referrals
  const getAffiliateTier = (referrals) => {
    if (referrals >= 100) return { name: 'Diamond', multiplier: 0.4 };
    if (referrals >= 20) return { name: 'Platinum', multiplier: 0.25 };
    if (referrals >= 5) return { name: 'Gold', multiplier: 0.22 };
    return { name: 'Coral', multiplier: 0.2 };
  };

  // Fixed assumptions: Basic plan with 20% automation
  // (50% of customers are on Basic, avg automation rate is 20%)
  const HELPDESK_PRICING_BASIC = 60;
  const HELPDESK_TICKETS_BASIC = 300;
  const AUTOMATION_RATE = 0.2; // 20%

  const affiliateCalculator = () => {
    console.log('[Affiliate Calculator] Initializing...');

    const form = document.querySelector('#wf-form-affiliate-calculator');
    if (!form) {
      console.log('[Affiliate Calculator] Form not found');
      return;
    }

    // Input element (single input for number of referrals)
    // Try direct input first, then look for input inside wrapper
    let numberReferralsInput = form.querySelector('input[data-el="number-referrals"]');
    if (!numberReferralsInput) {
      const wrapper = form.querySelector('[data-el="number-referrals"]');
      numberReferralsInput = wrapper?.querySelector('input') || wrapper;
    }
    const calculateBtn = form.querySelector('[data-el="cta-calc"]');

    // Output elements
    const quarterlyOutput = form.querySelector('[data-el="q-calc"]');
    const yearlyOutput = form.querySelector('[data-el="y-calc"]');
    const tierInfoOutput = form.querySelector('[data-el="tier-info"]');
    const overlays = form.querySelectorAll('[data-el="out"]');

    console.log('[Affiliate Calculator] Elements found:', {
      numberReferralsInput: !!numberReferralsInput,
      calculateBtn: !!calculateBtn,
      quarterlyOutput: !!quarterlyOutput,
      yearlyOutput: !!yearlyOutput,
      tierInfoOutput: !!tierInfoOutput,
      overlaysCount: overlays.length,
    });

    if (!calculateBtn) {
      console.log('[Affiliate Calculator] Calculate button not found');
      return;
    }

    const calculate = () => {
      const rawValue = numberReferralsInput?.value;
      const numberReferrals = parseInt(rawValue, 10);

      console.log('[Affiliate Calculator] Input values:', {
        rawValue,
        numberReferrals,
        isNaN: isNaN(numberReferrals),
      });

      // Validate input
      if (isNaN(numberReferrals) || numberReferrals < 1) {
        console.log('[Affiliate Calculator] Validation failed - invalid referrals');
        alert('Please enter a valid number of referrals (minimum 1).');
        return;
      }

      // Get tier based on number of referrals
      const tier = getAffiliateTier(numberReferrals);

      // Calculate AI Agent Tickets: HelpdeskTickets * automation rate
      const aiAgentTickets = HELPDESK_TICKETS_BASIC * AUTOMATION_RATE; // 300 * 0.1 = 30

      // Formula: 3 * (AffiliateTier * ((HelpdeskPricing + AiAgentTickets) * NumberOfReferrals))
      const quarterlyEarnings =
        3 * (tier.multiplier * ((HELPDESK_PRICING_BASIC + aiAgentTickets) * numberReferrals));

      // Total reward: 8 * AffiliateQuarterlyReward
      const totalEarnings = 8 * quarterlyEarnings;

      console.log('[Affiliate Calculator] Calculation details:', {
        tier: tier.name,
        tierMultiplier: tier.multiplier,
        helpdeskPricing: HELPDESK_PRICING_BASIC,
        aiAgentTickets,
        numberReferrals,
        quarterlyEarnings,
        totalEarnings,
      });

      // Format and output results (US dollar format)
      quarterlyOutput.textContent = formatUS(quarterlyEarnings);
      yearlyOutput.textContent = formatUS(totalEarnings);

      // Output tier info sentence
      if (tierInfoOutput) {
        const revenueSharePercent = Math.round(tier.multiplier * 100);
        tierInfoOutput.textContent = `With ${numberReferrals} referral${numberReferrals > 1 ? 's' : ''}, you'd be a ${tier.name} affiliate with ${revenueSharePercent}% revenue share.`;
        tierInfoOutput.style.display = 'block';
        tierInfoOutput.style.opacity = '1';
      }

      // Hide overlays
      overlays.forEach((overlay) => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      });

      console.log('[Affiliate Calculator] Results displayed, overlays hidden');
    };

    // Prevent form submission and trigger calculate instead
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('[Affiliate Calculator] Form submit prevented, calculating...');
      calculate();
    });

    calculateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('[Affiliate Calculator] Calculate button clicked');
      calculate();
    });

    // Allow Enter key in input to trigger calculation
    numberReferralsInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        console.log('[Affiliate Calculator] Enter key pressed');
        calculate();
      }
    });

    console.log('[Affiliate Calculator] Ready');
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', affiliateCalculator);
  } else {
    affiliateCalculator();
  }
})();
