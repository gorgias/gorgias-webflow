var Webflow = Webflow || [];
Webflow.push(function () {

  /****************************
   *
   * MAIN VARIABLES
   *
   ****************************/

  // Get references to HTML elements for ticket range, plan type toggle, and voice and SMS tickets select
  let ticketRange = document.getElementById("ticketRange");
  const monthlyPlanRadios = document.querySelectorAll('input[data-el="monthly"]');
  const annualPlanRadios = document.querySelectorAll('input[data-el="annual"]');

  // Set data-el price elements for Helpdesk, Automation, SMS, and Voice
  let helpdeskPriceElements = document.querySelectorAll(`[data-el="helpdeskPrice"]`);
  let helpdeskPrice0Elements = document.querySelectorAll(`[data-el="helpdeskPrice0"]`);
  let helpdeskPrice10Elements = document.querySelectorAll(`[data-el="helpdeskPrice10"]`);
  let helpdeskPrice20Elements = document.querySelectorAll(`[data-el="helpdeskPrice20"]`);
  let helpdeskPrice30Elements = document.querySelectorAll(`[data-el="helpdeskPrice30"]`);
  let chosenHelpdeskPrice = document.querySelector(`[data-el="chosenHelpdeskPrice"]`);
  let chosenAutomatePrice = document.querySelector(`[data-el="chosenAutomatePrice"]`);
  let automatePrice10 = document.querySelector(`[data-update="automatePrice10"]`);
  let automatePrice20 = document.querySelector(`[data-update="automatePrice20"]`);
  let automatePrice30 = document.querySelector(`[data-update="automatePrice30"]`);

  // Select different pricing card
  let pricingCard = document.querySelector(`[data-el="pricingCard"]`);
  let pricingCard10 = document.querySelector(`[data-el="pricingCard10"]`);
  let pricingCard20 = document.querySelector(`[data-el="pricingCard20"]`);
  let pricingCard30 = document.querySelector(`[data-el="pricingCard30"]`);

  // Select all elements with the attribute data-el="planName"
  const planNameElements = document.querySelectorAll(`[data-el="planName"]`);

  // Select all elements to show ticket number for Helpdesk and Automation
  let ticketNumberElements = document.querySelectorAll(`[data-el="ticketNumber"]`);
  let automateTicketNumber10Elements = document.querySelectorAll(`[data-el="automateTicketNumber10"]`);
  let automateTicketNumber20Elements = document.querySelectorAll(`[data-el="automateTicketNumber20"]`);
  let automateTicketNumber30Elements = document.querySelectorAll(`[data-el="automateTicketNumber30"]`);

  // Select voice and SMS tickets
  let voiceTicketsSelect = document.querySelector(`[data-target="voice-tickets"]`);
  let smsTicketsSelect = document.querySelector(`[data-target="sms-tickets"]`);

  // Select the summary total price
  let summaryTotalPrice = document.querySelector(`[data-el="summaryTotalPrice"]`);
  let automationRate = document.querySelector(`[data-el="automationRate"]`);

  /****************************
   *
   * DATA DEFINITIONS
   *
   ****************************/

  // Define the helpdesk plans
  const helpdeskPlans = {
    monthly: [
      { name: "Starter", tickets_per_month: 50, monthly_cost: 10, cost_per_overage_ticket: 0.4 },
      { name: "Basic", tickets_per_month: 300, monthly_cost: 60, cost_per_overage_ticket: 0.4 },
      { name: "Pro", tickets_per_month: 2000, monthly_cost: 360, cost_per_overage_ticket: 0.36 },
      { name: "Advanced", tickets_per_month: 5000, monthly_cost: 900, cost_per_overage_ticket: 0.36 },
      { name: "Enterprise", tickets_per_month: 10000, monthly_cost: 1600, cost_per_overage_ticket: 0.32 },
    ],
    yearly: [
      { name: "Starter", tickets_per_month: 50, monthly_cost: 8, cost_per_overage_ticket: 0.4 },
      { name: "Basic", tickets_per_month: 300, monthly_cost: 50, cost_per_overage_ticket: 0.4 },
      { name: "Pro", tickets_per_month: 2000, monthly_cost: 300, cost_per_overage_ticket: 0.36 },
      { name: "Advanced", tickets_per_month: 5000, monthly_cost: 750, cost_per_overage_ticket: 0.36 },
      { name: "Enterprise", tickets_per_month: 10000, monthly_cost: 1333, cost_per_overage_ticket: 0.32 },
    ],
  };

  // Define the automate plans
  const automatePlans = {
    monthly: [
      { name: "Tier 0", interactions_per_month: 0, monthly_cost: 0 },
      { name: "Tier 1", interactions_per_month: 30, monthly_cost: 30 },
      { name: "Tier 1B", interactions_per_month: 80, monthly_cost: 80 },
      { name: "Tier 1C", interactions_per_month: 120, monthly_cost: 114 },
      { name: "Tier 2", interactions_per_month: 190, monthly_cost: 180 },
      { name: "Tier 3", interactions_per_month: 530, monthly_cost: 450 },
      { name: "Tier 4", interactions_per_month: 1125, monthly_cost: 900 },
      { name: "Tier 5", interactions_per_month: 2000, monthly_cost: 1500 },
      { name: "Tier 6", interactions_per_month: 3000, monthly_cost: 2100 },
      { name: "Tier 7", interactions_per_month: 5000, monthly_cost: 2500 },
      { name: "Tier 8", interactions_per_month: 7000, monthly_cost: 3500 },
    ],
    yearly: [
      { name: "Tier 0", interactions_per_month: 0, monthly_cost: 0 },
      { name: "Tier 1", interactions_per_month: 30, monthly_cost: 25 },
      { name: "Tier 1B", interactions_per_month: 80, monthly_cost: 67 },
      { name: "Tier 1C", interactions_per_month: 120, monthly_cost: 95 },
      { name: "Tier 2", interactions_per_month: 190, monthly_cost: 150 },
      { name: "Tier 3", interactions_per_month: 530, monthly_cost: 375 },
      { name: "Tier 4", interactions_per_month: 1125, monthly_cost: 750 },
      { name: "Tier 5", interactions_per_month: 2000, monthly_cost: 1250 },
      { name: "Tier 6", interactions_per_month: 3000, monthly_cost: 1750 },
      { name: "Tier 7", interactions_per_month: 5000, monthly_cost: 2083 },
      { name: "Tier 8", interactions_per_month: 7000, monthly_cost: 2917 },
    ],
  };

  // Define the voice tiers
  const voiceTiers = {
    monthly: [
      { range: "No Voice Tickets", tier: "Tier 0", price: 0 },
      { range: "Pay as you go", tier: "Pay as you go", price: 0 },
      { range: "0-24", tier: "Tier 1", price: 30 },
      { range: "25-74", tier: "Tier 2", price: 90 },
      { range: "75-149", tier: "Tier 3", price: 135 },
      { range: "150-249", tier: "Tier 4", price: 175 },
      { range: "250-499", tier: "Tier 5", price: 250 },
      { range: "500-999", tier: "Tier 6", price: 400 },
      { range: "999+", tier: "Tier 7", price: 0 },
    ],
    yearly: [
      { range: "No Voice Tickets", tier: "Tier 0", price: 0 },
      { range: "Pay as you go", tier: "Pay as you go", price: 0 },
      { range: "0-24", tier: "Tier 1", price: 25 },
      { range: "25-74", tier: "Tier 2", price: 75 },
      { range: "75-149", tier: "Tier 3", price: 113 },
      { range: "150-249", tier: "Tier 4", price: 146 },
      { range: "250-499", tier: "Tier 5", price: 208 },
      { range: "500-999", tier: "Tier 6", price: 333 },
      { range: "999+", tier: "Tier 7", price: 0 },
    ],
  };

  // Define the SMS tiers
  const smsTiers = {
    monthly: [
      { range: "No SMS Tickets", tier: "Tier 0", price: 0 },
      { range: "Pay as you go", tier: "Pay as you go", price: 0 },
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
      { range: "Pay as you go", tier: "Pay as you go", price: 0 },
      { range: "0-24", tier: "Tier 1", price: 17 },
      { range: "25-74", tier: "Tier 2", price: 50 },
      { range: "75-149", tier: "Tier 3", price: 75 },
      { range: "150-249", tier: "Tier 4", price: 117 },
      { range: "250-499", tier: "Tier 5", price: 180 },
      { range: "500-999", tier: "Tier 6", price: 340 },
      { range: "999+", tier: "Tier 7", price: 0 },
    ],
  };

/****************************
 *
 * BILLING CYCLE FUNCTIONALITY
 *
 ****************************/

// Function to toggle between monthly and yearly pricing
function setupBillingCycleToggle() {
    document.querySelectorAll('.billing-toggle-radio').forEach(el => {
        el.addEventListener('click', function () {
            const input = this.querySelector('input[type="radio"]');
            input.checked = true;

            // Log the selected billing cycle
            //console.log(`${input.value} plan selected`);

            const number_of_tickets = parseInt(ticketRange.value, 10) || 0;
            // Update all prices and summary for the new billing cycle
            updatePricesForCurrentPlan();
            calculatePricePerMonth(number_of_tickets);
            updateSummaryTotalPrice();
            //console.log("The summary total is now: " + summaryTotalPrice.textContent + " chosen helpdesk price is: " + chosenHelpdeskPrice + " chosen automate price is: " + chosenAutomatePrice);
        });
    });

    $('.billing-toggle-radio.is-yearly').on('click', function () {
        $('.billing-toggle-radio.is-yearly').addClass('active');
        $('.billing-toggle-radio.is-monthly').removeClass('active');
        setupBillingCycleToggle()
        console.log('Updated all radio buttons for yearly')
    });

    $('.billing-toggle-radio.is-monthly').on('click', function () {
        $('.billing-toggle-radio.is-yearly').removeClass('active');
        $('.billing-toggle-radio.is-monthly').addClass('active');
        setupBillingCycleToggle()
        console.log('Updated all radio buttons for monthly')
    });

    // if .billing-toggle-radio.is-yearly has class active then child input radio should be checked
    if ($('.billing-toggle-radio.is-yearly').hasClass('active')) {
        $('.billing-toggle-radio.is-yearly input[type="radio"]').prop('checked', true);
    }

    // if .billing-toggle-radio.is-monthly has class active then child input radio should be checked 
    if ($('.billing-toggle-radio.is-monthly').hasClass('active')) {
        $('.billing-toggle-radio.is-monthly input[type="radio"]').prop('checked', true);
    }
}
  // Function to initialize the yearly plan as default on page load
  function initializeBillingCycle() {
    // Set the yearly plan as active
    const yearlyPlanRadio = document.querySelector('.billing-toggle-radio.is-yearly');
    if (yearlyPlanRadio) {
      yearlyPlanRadio.classList.add('active');
      yearlyPlanRadio.querySelector('input[type="radio"]').checked = true;
    }
  
    // Update prices and summary for the yearly plan
    updatePricesForCurrentPlan();
    updateSummaryTotalPrice();
  }
  
  // Call the setup for the billing cycle toggle
  setupBillingCycleToggle();
  initializeBillingCycle();  // Initialize the yearly plan on page load
  /****************************
   *
   * HELPER FUNCTIONS
   *
   ****************************/

  // Function to update the elements with new prices
  function updateElements(target, value) {
    document.querySelectorAll(`[data-el="${target}"]`).forEach((element) => {
      element.textContent = value;
    });
  }

  // Function to get the current plan type (yearly or monthly)
  function getCurrentPlanType() {
    return annualPlanRadios[0]?.checked ? "yearly" : "monthly";
  }

/****************************
 *
 * FUNCTION TO UPDATE PRICES BASED ON CURRENT PLAN
 *
 ****************************/
function updatePricesForCurrentPlan() {
    const planType = getCurrentPlanType(); // 'monthly' or 'yearly'
    const number_of_tickets = parseInt(ticketRange.value, 10) || 0;
  
    // Update helpdesk prices
    const { planCost } = calculateHelpdeskPrice(number_of_tickets);
    helpdeskPriceElements.forEach((element) => {
      element.textContent = planCost;
    });
  
    // Update automate prices
    const automationRates = [0.1, 0.2, 0.3];
    automationRates.forEach((rate) => {
      const automatedTickets = Math.floor(rate * number_of_tickets);
      const automateCost = calculateAutomatePrice(automatedTickets);
  
      if (rate === 0.1 && automatePrice10) {
        automatePrice10.textContent = automateCost;
      } else if (rate === 0.2 && automatePrice20) {
        automatePrice20.textContent = automateCost;
      } else if (rate === 0.3 && automatePrice30) {
        automatePrice30.textContent = automateCost;
      }
    });
  
    // Update voice and SMS prices
    updateVoiceTicketPrice();
    updateSmsTicketPrice();
  
    //console.log('Prices updated for current billing cycle:', planType);
  }

  /****************************
   *
   * HELPER FUNCTION TO CALCULATE AUTOMATION PRICE
   *
   ****************************/

  function calculateAutomatePrice(automatedTickets) {
    const planType = getCurrentPlanType();
    const plans = automatePlans[planType];

    let selectedPlan = plans[0];

    for (let i = 0; i < plans.length; i++) {
      if (automatedTickets <= plans[i].interactions_per_month) {
        selectedPlan = plans[i];
        break;
      }
    }

    //console.log(`Automation Price Calculation: Plan Name: ${selectedPlan.name}, Monthly Cost: ${selectedPlan.monthly_cost}, Automated Tickets: ${automatedTickets}`);
    updateElements("automatePrice", selectedPlan.monthly_cost);
    return selectedPlan.monthly_cost;
  }

  /****************************
   *
   * FUNCTION TO CALCULATE HELPDESK PRICE WITH OVERAGES
   *
   ****************************/

  function calculateHelpdeskPrice(nb_of_tickets) {
    const planType = getCurrentPlanType();
    const plans = helpdeskPlans[planType];

    let currentPlanIndex = 0;
    let applicablePlan = plans[currentPlanIndex];
    let planCost = 0;
    let overageCost = 0;

    // Loop through plans and check base price + overage cost
    while (currentPlanIndex < plans.length) {
      const plan = plans[currentPlanIndex];
      const overageTickets = nb_of_tickets - plan.tickets_per_month;
      overageCost = overageTickets > 0 ? overageTickets * plan.cost_per_overage_ticket : 0;
      planCost = plan.monthly_cost;

      //console.log(`Checking Plan: ${plan.name}, Base Price: ${planCost}, Overage Tickets: ${overageTickets}, Overage Cost: ${overageCost}`);

      const totalPrice = planCost + overageCost;

      // Move to the next plan if the next one has a better total price
      if (currentPlanIndex < plans.length - 1 && totalPrice > plans[currentPlanIndex + 1].monthly_cost) {
        currentPlanIndex++;
        applicablePlan = plans[currentPlanIndex];
      } else {
        break;
      }
    }

    const totalPrice = planCost + overageCost;

    //console.log(`Final Plan Selected: ${applicablePlan.name}, Plan Cost: ${planCost}, Overage Cost: ${overageCost}, Total Cost: ${totalPrice}`);

    return {
      planName: applicablePlan.name,
      planCost: planCost,
      overageCost: overageCost,
      totalPrice: totalPrice,
    };
  }

  /****************************
   *
   * FUNCTION TO CALCULATE TOTAL PRICE INCLUDING AUTOMATION
   *
   ****************************/

  function calculatePricePerMonth(nb_of_tickets) {
    // Calculate the best helpdesk plan
    const { planName, planCost, overageCost, totalPrice } = calculateHelpdeskPrice(nb_of_tickets);

    // Update the helpdesk-only price in all matching elements
    helpdeskPriceElements.forEach((element) => {
      element.textContent = `${planCost}`;
    });

    // Update the plan name in all elements with data-el="planName"
    planNameElements.forEach((element) => {
      element.textContent = planName;
    });

    // Update the ticket number for Helpdesk (total number of tickets)
    ticketNumberElements.forEach((element) => {
      element.textContent = `${nb_of_tickets}`;
    });

    //console.log(`Helpdesk Plan: ${planName}, Plan Cost: ${planCost}, Overage Cost: ${overageCost}, Total Price: ${totalPrice}`);

    // Calculate the total cost for each automation rate (10%, 20%, 30%)
    const automationRates = [0.1, 0.2, 0.3];

    automationRates.forEach((rate) => {
        const automatedTickets = Math.floor(rate * nb_of_tickets);
        const automateCost = calculateAutomatePrice(automatedTickets);
        const totalCost = planCost + automateCost;
      
        if (rate === 0) {
          helpdeskPrice0Elements.forEach((element) => {
            element.textContent = `${totalCost}`;
          });
        } else if (rate === 0.1) {
          automateTicketNumber10Elements.forEach((element) => {
            element.textContent = `${automatedTickets}`;
          });
          if (automatePrice10) {
            automatePrice10.textContent = `${automateCost}`;
            automationRate.textContent = `10`;
          }
          helpdeskPrice10Elements.forEach((element) => {
            element.textContent = `${totalCost}`;
          });
        } else if (rate === 0.2) {
          automateTicketNumber20Elements.forEach((element) => {
            element.textContent = `${automatedTickets}`;
          });
          if (automatePrice20) {
            automatePrice20.textContent = `${automateCost}`;
            automationRate.textContent = `20`;
          }
          helpdeskPrice20Elements.forEach((element) => {
            element.textContent = `${totalCost}`;
          });
        } else if (rate === 0.3) {
          automateTicketNumber30Elements.forEach((element) => {
            element.textContent = `${automatedTickets}`;
          });
          if (automatePrice30) {
            automatePrice30.textContent = `${automateCost}`;
            automationRate.textContent = `30`;
          }
          helpdeskPrice30Elements.forEach((element) => {
            element.textContent = `${totalCost}`;
          });
        }
      
       // console.log(`Automation Rate: ${rate * 100}%, Automated Tickets: ${automatedTickets}, Automate Cost: ${automateCost}, Total Price: ${totalCost}`);
      });

    // Call the updateActivePlanElement with the actual plan name
    updateActivePlanElement(planName);
  }

  /****************************
   *
   * VOICE AND SMS TICKET PRICING
   *
   ****************************/

  // Function to calculate voice ticket price
  function calculateVoiceTicketPrice(selectedTier, planType) {
    const tier = voiceTiers[planType].find(t => t.tier === selectedTier);
    return tier ? tier.price : 0;
  }

  // Function to calculate SMS ticket price
  function calculateSmsTicketPrice(selectedTier, planType) {
    const tier = smsTiers[planType].find(t => t.tier === selectedTier);
    return tier ? tier.price : 0;
  }

  // Function to update the UI with voice ticket prices
  function updateVoiceTicketPrice() {
    const selectedTier = voiceTicketsSelect.value;
    const planType = getCurrentPlanType();
    const voiceTicketPrice = calculateVoiceTicketPrice(selectedTier, planType);
    updateElements("voicePrice", voiceTicketPrice.toFixed(0));
    //(`Updated UI with voice ticket price: ${voiceTicketPrice}`);
    updateSummaryTotalPrice();
  }

  // Function to update the UI with SMS ticket prices
  function updateSmsTicketPrice() {
    const selectedTier = smsTicketsSelect.value;
    const planType = getCurrentPlanType();
    const smsTicketPrice = calculateSmsTicketPrice(selectedTier, planType);
    updateElements("smsPrice", smsTicketPrice.toFixed(0));
    //console.log(`Updated UI with SMS ticket price: ${smsTicketPrice}`);
    updateSummaryTotalPrice();
  }

  function updateElements(target, value) {
    document.querySelectorAll(`[data-el="${target}"]`).forEach((element) => {
      element.textContent = value;
    });
  }

  function updateSummaryTotalPrice() {
    // Ensure chosenHelpdeskPrice and chosenAutomatePrice are numbers before attempting to manipulate them
    const helpdeskPrice = parseInt(chosenHelpdeskPrice || "0", 10) || 0;
    const automatePrice = parseInt(chosenAutomatePrice || "0", 10) || 0;

    // Use the selected tier to find the voice and SMS prices from the corresponding tier objects
    const voiceTier = voiceTiers[getCurrentPlanType()].find(t => t.tier === voiceTicketsSelect.value);
    const voicePrice = voiceTier ? voiceTier.price : 0;

    const smsTier = smsTiers[getCurrentPlanType()].find(t => t.tier === smsTicketsSelect.value);
    const smsPrice = smsTier ? smsTier.price : 0;
  
    // Calculate the total price
    const totalPrice = helpdeskPrice + automatePrice + voicePrice + smsPrice;
  
    // Update the summary total price element
    updateElements("summaryTotalPrice", totalPrice.toFixed(2));
  
    //console.log(`Summary Total Price Updated: ${totalPrice.toFixed(2)}`);
  }

  /****************************
   *
   * FUNCTION TO UPDATE ACTIVE PLAN ELEMENT
   *
   ****************************/

  function updateActivePlanElement(planName) {
    const planElements = document.querySelectorAll('[g-col-highlight]');

    planElements.forEach((element) => {
      if (element.getAttribute('g-col-highlight').toLowerCase() === planName.toLowerCase()) {
        element.classList.add('is-active');
      } else {
        element.classList.remove('is-active');
      }
    });

   // console.log(`Active Plan Element Updated: ${planName}`);
  }

  /****************************
   *
   * FUNCTION TO HANDLE PRICING CARD SELECTION
   *
   ****************************/ 

  function handlePricingCardClick() {
    // Deselect all cards and their automate pills
    $(".pricing_card").removeClass("is-selected");
    $(".pricing_card .pricing_automate-pill").removeClass("is-selected");

    // Select the clicked card and its automate pill
    $(this).toggleClass("is-selected");
    $(this).find(".pricing_automate-pill").toggleClass("is-selected");

    // Get the chosen helpdesk price from the clicked card
    chosenHelpdeskPrice = $(this).find('[data-el="helpdeskPrice"]').text();

    // Check which automate price to update based on the clicked card
    if ($(this).is(pricingCard)) {
      chosenAutomatePrice = $(this).find('[data-update="automatePrice"]').text();
    } else if ($(this).is(pricingCard10)) {
      chosenAutomatePrice = $(this).find('[data-update="automatePrice10"]').text();
    } else if ($(this).is(pricingCard20)) {
      chosenAutomatePrice = $(this).find('[data-update="automatePrice20"]').text();
    } else if ($(this).is(pricingCard30)) {
      chosenAutomatePrice = $(this).find('[data-update="automatePrice30"]').text();
    }

    // Log the selected prices for debugging
    //console.log(`Chosen Helpdesk Price: ${chosenHelpdeskPrice}`);
    //console.log(`Chosen Automate Price: ${chosenAutomatePrice}`);

    // Update the summary elements with the chosen prices
    updateElements('chosenHelpdeskPrice', chosenHelpdeskPrice);
    updateElements('chosenAutomatePrice', chosenAutomatePrice);

    // Update the summary total price
    updateSummaryTotalPrice();
  }

  // Attach event listener for all pricing cards
  $(".pricing_card").on("click", handlePricingCardClick);


  /****************************
   *
   * EVENT LISTENERS
   *
   ****************************/

  if (ticketRange) {
    ticketRange.addEventListener("input", function () {
      const number_of_tickets = parseInt(ticketRange.value, 10) || 0;
      //console.log(`Input Event Fired: Number of Tickets: ${number_of_tickets}`);
      calculatePricePerMonth(number_of_tickets);
    });
  } else {
    console.error("ticketRange element not found!");
  }

  voiceTicketsSelect.addEventListener("change", function () {
    updateVoiceTicketPrice();
  });

  smsTicketsSelect.addEventListener("change", function () {
    updateSmsTicketPrice();
  });

  // Initialize with the default selected values
  updateVoiceTicketPrice();
  updateSmsTicketPrice();
  updateSummaryTotalPrice();

});