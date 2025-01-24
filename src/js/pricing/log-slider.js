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
      { name: "Tier 0", interactions_per_month: 0, monthly_cost: 0, cost_per_overage_interaction: 0 },
      { name: "Tier 1", interactions_per_month: 30, monthly_cost: 30, cost_per_overage_interaction: 2.0 },
      { name: "Tier 1B", interactions_per_month: 80, monthly_cost: 80, cost_per_overage_interaction: 2.0 },
      { name: "Tier 1C", interactions_per_month: 120, monthly_cost: 114, cost_per_overage_interaction: 1.9 },
      { name: "Tier 1D", interactions_per_month: 150, monthly_cost: 143, cost_per_overage_interaction: 1.9 },
      { name: "Tier 2", interactions_per_month: 190, monthly_cost: 180, cost_per_overage_interaction: 1.9 },
      { name: "Tier 2B", interactions_per_month: 360, monthly_cost: 306, cost_per_overage_interaction: 1.7 },
      { name: "Tier 3", interactions_per_month: 530, monthly_cost: 450, cost_per_overage_interaction: 1.7 },
      { name: "Tier 3B", interactions_per_month: 800, monthly_cost: 640, cost_per_overage_interaction: 1.6 },
      { name: "Tier 4", interactions_per_month: 1125, monthly_cost: 900, cost_per_overage_interaction: 1.6 },
      { name: "Tier 4B", interactions_per_month: 1500, monthly_cost: 1125, cost_per_overage_interaction: 1.5 },
      { name: "Tier 5", interactions_per_month: 2000, monthly_cost: 1500, cost_per_overage_interaction: 1.5 },
      { name: "Tier 6", interactions_per_month: 3000, monthly_cost: 2100, cost_per_overage_interaction: 1.4 },
      { name: "Tier 7", interactions_per_month: 5000, monthly_cost: 2500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 8", interactions_per_month: 7000, monthly_cost: 3500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 9", interactions_per_month: 9000, monthly_cost: 4500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 10", interactions_per_month: 11000, monthly_cost: 5500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 11", interactions_per_month: 13000, monthly_cost: 6500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 12", interactions_per_month: 15000, monthly_cost: 7500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 13", interactions_per_month: 17000, monthly_cost: 8500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 14", interactions_per_month: 19000, monthly_cost: 9500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 15", interactions_per_month: 21000, monthly_cost: 10500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 16", interactions_per_month: 24000, monthly_cost: 12000, cost_per_overage_interaction: 1.0 },
      { name: "Tier 17", interactions_per_month: 27000, monthly_cost: 13500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 18", interactions_per_month: 30000, monthly_cost: 15000, cost_per_overage_interaction: 1.0 },
      { name: "Tier 19", interactions_per_month: 33000, monthly_cost: 16500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 20", interactions_per_month: 36000, monthly_cost: 18000, cost_per_overage_interaction: 1.0 },
      { name: "Tier 21", interactions_per_month: 39000, monthly_cost: 19500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 22", interactions_per_month: 44000, monthly_cost: 22000, cost_per_overage_interaction: 1.0 },
      { name: "Tier 23", interactions_per_month: 49000, monthly_cost: 24500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 24", interactions_per_month: 54000, monthly_cost: 27000, cost_per_overage_interaction: 1.0 },
      { name: "Tier 25", interactions_per_month: 59000, monthly_cost: 29500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 26", interactions_per_month: 64000, monthly_cost: 32000, cost_per_overage_interaction: 1.0 },
      { name: "Tier 27", interactions_per_month: 69000, monthly_cost: 34500, cost_per_overage_interaction: 1.0 },
      { name: "Tier 28", interactions_per_month: 74000, monthly_cost: 37000, cost_per_overage_interaction: 1.0 },
    ],
    yearly: [
      { name: "Tier 0", interactions_per_month: 0, monthly_cost: 0, cost_per_overage_interaction: 0 },
      { name: "Tier 1", interactions_per_month: 30, monthly_cost: 25, cost_per_overage_interaction: 1.67 },
      { name: "Tier 1B", interactions_per_month: 80, monthly_cost: 67, cost_per_overage_interaction: 1.67 },
      { name: "Tier 1C", interactions_per_month: 120, monthly_cost: 95, cost_per_overage_interaction: 1.58 },
      { name: "Tier 1D", interactions_per_month: 150, monthly_cost: 119, cost_per_overage_interaction: 1.58 },
      { name: "Tier 2", interactions_per_month: 190, monthly_cost: 150, cost_per_overage_interaction: 1.58 },
      { name: "Tier 2B", interactions_per_month: 360, monthly_cost: 255, cost_per_overage_interaction: 1.42 },
      { name: "Tier 3", interactions_per_month: 530, monthly_cost: 375, cost_per_overage_interaction: 1.42 },
      { name: "Tier 3B", interactions_per_month: 800, monthly_cost: 533, cost_per_overage_interaction: 1.33 },
      { name: "Tier 4", interactions_per_month: 1125, monthly_cost: 750, cost_per_overage_interaction: 1.33 },
      { name: "Tier 4B", interactions_per_month: 1500, monthly_cost: 938, cost_per_overage_interaction: 1.25 },
      { name: "Tier 5", interactions_per_month: 2000, monthly_cost: 1250, cost_per_overage_interaction: 1.25 },
      { name: "Tier 6", interactions_per_month: 3000, monthly_cost: 1750, cost_per_overage_interaction: 1.17 },
      { name: "Tier 7", interactions_per_month: 5000, monthly_cost: 2083, cost_per_overage_interaction: 0.83 },
      { name: "Tier 8", interactions_per_month: 7000, monthly_cost: 2917, cost_per_overage_interaction: 0.83 },
      { name: "Tier 9", interactions_per_month: 9000, monthly_cost: 3750, cost_per_overage_interaction: 0.83 },
      { name: "Tier 10", interactions_per_month: 11000, monthly_cost: 4583, cost_per_overage_interaction: 0.83 },
      { name: "Tier 11", interactions_per_month: 13000, monthly_cost: 5417, cost_per_overage_interaction: 0.83 },
      { name: "Tier 12", interactions_per_month: 15000, monthly_cost: 6250, cost_per_overage_interaction: 0.83 },
      { name: "Tier 13", interactions_per_month: 17000, monthly_cost: 7083, cost_per_overage_interaction: 0.83 },
      { name: "Tier 14", interactions_per_month: 19000, monthly_cost: 7917, cost_per_overage_interaction: 0.83 },
      { name: "Tier 15", interactions_per_month: 21000, monthly_cost: 8750, cost_per_overage_interaction: 0.83 },
      { name: "Tier 16", interactions_per_month: 24000, monthly_cost: 10000, cost_per_overage_interaction: 0.83 },
      { name: "Tier 17", interactions_per_month: 27000, monthly_cost: 11250, cost_per_overage_interaction: 0.83 },
      { name: "Tier 18", interactions_per_month: 30000, monthly_cost: 12500, cost_per_overage_interaction: 0.83 },
      { name: "Tier 19", interactions_per_month: 33000, monthly_cost: 13750, cost_per_overage_interaction: 0.83 },
      { name: "Tier 20", interactions_per_month: 36000, monthly_cost: 15000, cost_per_overage_interaction: 0.83 },
      { name: "Tier 21", interactions_per_month: 39000, monthly_cost: 16250, cost_per_overage_interaction: 0.83 },
      { name: "Tier 22", interactions_per_month: 44000, monthly_cost: 18333, cost_per_overage_interaction: 0.83 },
      { name: "Tier 23", interactions_per_month: 49000, monthly_cost: 20417, cost_per_overage_interaction: 0.83 },
      { name: "Tier 24", interactions_per_month: 54000, monthly_cost: 22500, cost_per_overage_interaction: 0.83 },
      { name: "Tier 25", interactions_per_month: 59000, monthly_cost: 24583, cost_per_overage_interaction: 0.83 },
      { name: "Tier 26", interactions_per_month: 64000, monthly_cost: 26667, cost_per_overage_interaction: 0.83 },
      { name: "Tier 27", interactions_per_month: 69000, monthly_cost: 28750, cost_per_overage_interaction: 0.83 },
      { name: "Tier 28", interactions_per_month: 74000, monthly_cost: 30833, cost_per_overage_interaction: 0.83 },
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
  
  // Select Voice and SMS selects
  const voiceTicketsSelect = document.querySelector(`[data-target="voice-tickets"]`);
  const smsTicketsSelect = document.querySelector(`[data-target="sms-tickets"]`);
  const voiceSummary = document.querySelector(`[data-summary="voice"]`);
  const smsSummary = document.querySelector(`[data-summary="sms"]`);
  const helpdeskBase = document.querySelector(`[data-summary="helpdesk-base"]`);
  const helpdeskOverages = document.querySelector(`[data-summary="helpdesk-overage"]`);
  let chosenAutomatedTickets = document.querySelector(`[data-el="chosen-automated-tickets"]`);
  let chosenHelpdeskTickets = document.querySelector(`[data-el="chosen-helpdesk-tickets"]`);
  let helpdeskOverageCost = 0;
  
  
  /****************************
   *
   * GLOBAL FUNCTIONS
   *
   ****************************/
  
  // Format figures with comma separator
  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Support tickets CTA click event
  $(".support-tickets_cta").on("click", function () {
    const orders = parseInt($(".support-tickets_input").val(), 10);
    const tickets = Math.round(orders / 15);
    $(".support-tickets_result-value").text(tickets);
    $(".support-tickets_result").css("display", "block");
  });



  // Select all elements with the combo classes .is-gradution-nb and .is-invisible
$(".is-gradution-nb.is-invisible").each(function () {
    // Remove the text content of each matched element
    $(this).text("");
});


/****************************
 *
 * STEP 1: Input Number of Tickets by User
 *
 ****************************/


// 1A) Linear interpolation for a range
function linearInterp(t, lowVal, highVal) {
   return lowVal + t * (highVal - lowVal);
}

// 1B) Map slider fraction (0..1) to ticket values with updated ranges
function piecewiseValue(fraction) {
   if (fraction < 4 / 48) {
       // 10 to 50 (5 steps of 10)
       const t = fraction / (4 / 48);
       return linearInterp(t, 10, 50);
   } else if (fraction < (4 + 5) / 48) {
       // 50 to 300 (5 steps of 50)
       const t = (fraction - 4 / 48) / (5 / 48);
       return linearInterp(t, 50, 300);
   } else if (fraction < (4 + 5 + 17) / 48) {
       // 300 to 2000 (17 steps of 100)
       const t = (fraction - (4 + 5) / 48) / (17 / 48);
       return linearInterp(t, 300, 2000);
   } else if (fraction < (4 + 5 + 17 + 15) / 48) {
       // 2000 to 5000 (15 steps of 200)
       const t = (fraction - (4 + 5 + 17) / 48) / (15 / 48);
       return linearInterp(t, 2000, 5000);
   } else {
       // 5000 to 10000 (5 steps of 1000)
       const t = (fraction - (4 + 5 + 17 + 15) / 48) / (5 / 48);
       return linearInterp(t, 5000, 10000);
   }
}

// 1C) Rounding logic for each range
function piecewiseRound(val) {
   if (val <= 50) {
       return Math.round(val / 10) * 10; // Steps of 10
   } else if (val <= 300) {
       return Math.round(val / 50) * 50; // Steps of 50
   } else if (val <= 2000) {
       return Math.round(val / 100) * 100; // Steps of 100
   } else if (val <= 5000) {
       return Math.round(val / 200) * 200; // Steps of 200
   } else {
       return Math.round(val / 1000) * 1000; // Steps of 1000
   }
}

// 1D) Map ticket count to slider fraction (0..1)
function piecewisePosition(value) {
   if (value <= 50) {
       return ((value - 10) / (50 - 10)) * (4 / 48);
   } else if (value <= 300) {
       return (4 / 48) + ((value - 50) / (300 - 50)) * (5 / 48);
   } else if (value <= 2000) {
       return (4 + 5) / 48 + ((value - 300) / (2000 - 300)) * (17 / 48);
   } else if (value <= 5000) {
       return (4 + 5 + 17) / 48 + ((value - 2000) / (5000 - 2000)) * (15 / 48);
   } else {
       return (4 + 5 + 17 + 15) / 48 + ((value - 5000) / (10000 - 5000)) * (5 / 48);
   }
}

// 1E) Total steps
const MAX_STEPS = 48;

// Convert slider position (0..48) => final ticket count
function sliderPosToTickets(sliderPos) {
   const fraction = sliderPos / MAX_STEPS;
   const rawVal = piecewiseValue(fraction);
   const roundedVal = piecewiseRound(rawVal);
   // Ensure unique values at the highest range
   if (sliderPos === MAX_STEPS - 1) return 9000; 
   if (sliderPos === MAX_STEPS) return 10000;
   return roundedVal;
}

// Convert ticket count => slider position (0..48)
function ticketsToSliderPos(value) {
   const fraction = piecewisePosition(value);
   return Math.round(fraction * MAX_STEPS);
}

// 1F) Log all steps for verification
function logAllSteps() {
   console.log("Logging all steps:");
   for (let i = 0; i <= MAX_STEPS; i++) {
       console.log(`Step ${i}: ${sliderPosToTickets(i)} tickets`);
   }
}

// 1G) Event listener for slider input
$("#ticketRange").on("input", function () {
    const sliderPos = +$(this).val(); // 0..48
    const val = sliderPosToTickets(sliderPos);
    $("#value").val(val.toFixed(0));
    globalTicketNumber = val;
 
    console.log("Step 1: Number of tickets selected:", globalTicketNumber);
 
    // Update "I have X tickets"
    $("#rangeValue").text(formatNumberWithCommas(globalTicketNumber));
 
    // Call determinePlan to update plan details
    determinePlan(globalTicketNumber);
    updateLogosAndCTAs();
 });
 
 // 1H) Event listener for typed input
 $("#value").on("change", function () {
    const typedVal = parseInt($(this).val(), 10) || 0;
    const clampedVal = Math.max(10, Math.min(typedVal, 10000));
    const pos = ticketsToSliderPos(clampedVal);
    $("#ticketRange").val(pos);
 
    globalTicketNumber = clampedVal;
    console.log("Step 1: Number of tickets typed:", globalTicketNumber);
 
    $("#rangeValue").text(formatNumberWithCommas(globalTicketNumber));
 
    // Call determinePlan to update plan details
    determinePlan(globalTicketNumber);
    updateLogosAndCTAs();
 });
 
 // 1I) Log all steps on initialization and set initial value
 $(document).ready(function () {
    const initialTickets = 300;
    const pos = ticketsToSliderPos(initialTickets);
    $("#ticketRange").val(pos);
    $("#value").val(initialTickets);
    $("#rangeValue").text(formatNumberWithCommas(initialTickets));
 
    globalTicketNumber = initialTickets;
 
    // Call determinePlan to update plan details
    determinePlan(globalTicketNumber);
    updateLogosAndCTAs();
 
    logAllSteps(); // Log steps for debugging
 });
  
  /****************************
   *
   * STEP 2: Check Billing Cycle
   *
   ****************************/
  
  // Global variable to track the billing cycle
  let globalBillingCycle = "yearly"; // Default to yearly
  
  // Function to switch billing cycle
  function switchBillingCycle(billingCycle) {
    if (billingCycle === "monthly") {
      $(".is-monthly").addClass("active");
      $(".is-yearly").removeClass("active");
      $(".monthlyPlan").prop("checked", true);
    } else if (billingCycle === "yearly") {
      $(".is-yearly").addClass("active");
      $(".is-monthly").removeClass("active");
      $(".annualPlan").prop("checked", true);
    }
    globalBillingCycle = billingCycle;
    //console.log("Switched to", billingCycle, "billing cycle");
    determinePlan(globalTicketNumber);
    displayAlert();
  }
  
  // Event listener for billing toggle radio buttons
  $(".billing-toggle-radio").on("click", function () {
    if ($(this).hasClass("is-yearly")) {
      switchBillingCycle("yearly");
     // console.log("Step 2: Switched to Yearly billing cycle");
    } else if ($(this).hasClass("is-monthly")) {
      switchBillingCycle("monthly");
     // console.log("Step 2: Switched to Monthly billing cycle");
    }
    updatePricesOnBillingCycleChange();
  });
  
  // Function to toggle to monthly billing cycle
  function toggleMonthly() {
    switchBillingCycle("monthly");
  }
  
  // Function to toggle to yearly billing cycle
  function toggleYearly() {
    switchBillingCycle("yearly");
  }
  
  // Function to display alerts based on billing cycle and plan
  function displayAlert() {
    $(".yearly-billing-alert, .monthly-billing-alert, .starter-billing-alert").css("display", "none");
  
    if (globalBillingCycle === "yearly") {
      $(".yearly-billing-alert").css("display", "flex");
      $(".radio-wrap.billing-toggle-radio.is-yearly").removeClass("is-disabled");
     // console.log("Displaying yearly billing alert");
    } else if (globalBillingCycle === "monthly" && globalCurrentPlanName === "Starter") {
      $(".starter-billing-alert").css("display", "flex");
      $(".radio-wrap.billing-toggle-radio.is-yearly").addClass("is-disabled");
      //console.log("Displaying starter monthly billing alert");
    } else if (globalBillingCycle === "monthly" && globalCurrentPlanName !== "Starter") {
      $(".monthly-billing-alert").css("display", "flex");
      $(".radio-wrap.billing-toggle-radio.is-yearly").removeClass("is-disabled");
      //console.log("Displaying monthly billing alert");
    }
  }
  
  
  /****************************
   *
   * STEP 3: Compare globalTicketNumber to Data Definitions
   *
   ****************************/
  
  // Global variables for current plan
  let globalCurrentPlanName = "";
  let globalCurrentPlanPrice = 0;
  let globalCurrentPlanOverageTickets = 0;
  let globalCurrentPlanOverageCostPerTicket = 0;
  let globalCurrentPlanTicketsPerMonth = 0;
  
  // Function to determine the plan based on # of tickets
  function determinePlan(tickets) {
    const previousPlanName = globalCurrentPlanName;
    const plans = helpdeskPlans[globalBillingCycle];
    let currentPlanIndex = 0;
    let applicablePlan = plans[currentPlanIndex];
  
    while (currentPlanIndex < plans.length) {
      const plan = plans[currentPlanIndex];
      const overageTickets = tickets - plan.tickets_per_month;
      const overageCost = overageTickets > 0 ? overageTickets * plan.cost_per_overage_ticket : 0;
      const planCost = plan.monthly_cost;
      const totalPrice = planCost + overageCost;
  
    //   console.log(
    //     `Checking Plan: ${plan.name}, Base Price: ${planCost}, Overage Tickets: ${overageTickets}, Overage Cost: ${overageCost}, Total Price: ${totalPrice}`
    //   );
  
      if (
        currentPlanIndex < plans.length - 1 &&
        totalPrice > plans[currentPlanIndex + 1].monthly_cost
      ) {
        currentPlanIndex++;
        applicablePlan = plans[currentPlanIndex];
      } else {
        break;
      }
  
      if (selectedCardType) {
        // Extract automationRate from selectedCardType
        const automationRate = parseInt(selectedCardType.replace("pricingCard", ""), 10) || 0;
        // Calculate automateTickets
        const automateTickets = Math.round(tickets * (automationRate / 100));
        // Update chosen prices & recalc summary
        updateChosenPrices(automateTickets, automationRate);
        calculateSummary();
        calculateROISavings();
      }
    }
  
    globalCurrentPlanName = applicablePlan.name;
    globalCurrentPlanPrice = applicablePlan.monthly_cost;
    globalCurrentPlanOverageTickets = tickets - applicablePlan.tickets_per_month;
    globalCurrentPlanOverageCostPerTicket = applicablePlan.cost_per_overage_ticket;
    globalCurrentPlanTicketsPerMonth = applicablePlan.tickets_per_month;
  
    // console.log(
    //   "Step 3: Selected Plan -",
    //   globalCurrentPlanName,
    //   "| Base Price:",
    //   globalCurrentPlanPrice
    // );
  
    $('[data-el="planName"]').text(globalCurrentPlanName);
  
    if (
      previousPlanName === "Starter" &&
      globalCurrentPlanName !== "Starter" &&
      globalBillingCycle === "monthly"
    ) {
     // console.log("Switching from Starter monthly → forcing yearly because new plan is not Starter");
      toggleYearly();
    }
  
    updateOveragesDisplay();
    calculateAutomatePrices();
  }
  
  // Function to update the overages display
  function updateOveragesDisplay() {
    const overagesElement = $('[data-el="overages"]');
    if (globalCurrentPlanOverageTickets > 0) {
      const overageRate = globalCurrentPlanOverageCostPerTicket.toFixed(2);
      overagesElement.css("opacity", "1");
      overagesElement.text(`$${overageRate}/overage helpdesk ticket`);
    //  console.log(`Overages apply: $${overageRate} per overage ticket`);
    } else {
      overagesElement.css("opacity", "0");
     // console.log("No overages apply");
    }
  }
  
  
  
  /****************************
   *
   * STEP 4: Calculate Number of Automated Tickets
   *
   ****************************/
  
  let globalAutomateTickets0 = 0,
    globalAutomateTickets10 = 0,
    globalAutomateTickets20 = 0,
    globalAutomateTickets30 = 0;
  let globalAutomatePrice0 = 0,
    globalAutomatePrice10 = 0,
    globalAutomatePrice20 = 0,
    globalAutomatePrice30 = 0;
  
  function calculateAutomatePrices() {
    const percentages = [0, 10, 20, 30];
    const automatePlansForCycle = automatePlans[globalBillingCycle];
  
    percentages.forEach((percentage) => {
      let automateTickets = Math.round(globalCurrentPlanTicketsPerMonth * (percentage / 100));
      let automatePrice = findAutomatePrice(automateTickets, automatePlansForCycle);
  
      // Store in dynamic variables
      window[`globalAutomateTickets${percentage}`] = automateTickets;
      window[`globalAutomatePrice${percentage}`] = automatePrice;
  
      if (percentage !== 0) {
        const automateTicketsFormatted = formatNumberWithCommas(automateTickets);
        $('[data-el="ticketNumber' + percentage + '"]').text(
          `${automateTicketsFormatted} automated`
        );
      }
    });
  
    // Update the main ticket number
    const totalTicketsText = `${formatNumberWithCommas(globalCurrentPlanTicketsPerMonth)} helpdesk tickets`;
    $('[data-el="ticketNumber"]').text(totalTicketsText);
  
    calculateOptionPrices();
  }
  
  // Helper function to find automate price from ticket count
  function findAutomatePrice(tickets, plans) {
    let selectedPlan = plans[0];
    for (let i = 0; i < plans.length; i++) {
      if (tickets <= plans[i].interactions_per_month) {
        selectedPlan = plans[i];
        break;
      }
    }
    return selectedPlan.monthly_cost;
  }
  
  
  /****************************
   *
   * STEP 5: Calculate Plan Option Prices
   *
   ****************************/
  
  function calculateOptionPrices() {
    const percentages = [0, 10, 20, 30];
  
    percentages.forEach((percentage) => {
      const automatePrice = window[`globalAutomatePrice${percentage}`];
      const optionPrice = globalCurrentPlanPrice + automatePrice;
      $('[data-el="helpdeskPrice' + percentage + '"]').text(optionPrice);
     // console.log(`Option ${percentage}%: ${optionPrice}`);
    });
  }
  
  
  /****************************
   *
   * STEP 6: Choosing a Plan
   *
   ****************************/
  
  let selectedCardType = null;
  let isProgrammaticClick = false;
  
  function updatePlanSelection(selectedCardType) {
   // console.log("Updating plan selection for card type:", selectedCardType);
  
    // Deselect all cards
    $(".pricing_card").removeClass("is-selected");
    $(".pricing_card .pricing_automate-pill").removeClass("is-selected");
  
    // Select this card
    const selectedCard = $('[data-el="' + selectedCardType + '"]');
    selectedCard.addClass("is-selected");
    selectedCard.find(".pricing_automate-pill").addClass("is-selected");
  
    // Show plan summary, hide no-selection
    $(".plan_summary-layout").css("display", "flex");
    $(".plan_no-selection").css("display", "none");
  
    // Enable code radio
    $(".code-radio").removeClass("is-inactive");
  
    // Extract automation rate
    const automationRate = selectedCardType.replace("pricingCard", "") || "0";
    $('[data-el="automationRate"]').text(automationRate);
  
    // Calculate tickets
    const automateTickets = Math.round(globalTicketNumber * (parseInt(automationRate) / 100));
    // const helpdeskTickets = globalTicketNumber; // or if you previously subtracted automateTickets
  
    chosenAutomatedTickets.textContent = formatNumberWithCommas(automateTickets);
    chosenHelpdeskTickets.textContent = formatNumberWithCommas(globalTicketNumber);
  
    // Update chosen prices
    updateChosenPrices(automateTickets, automationRate);
    calculateSummary();
    calculateROISavings();
    updateSummaryDetails();
  }
  
  // Event listener for pricing card clicks
  $('[data-el^="pricingCard"]').on("click", function () {
    selectedCardType = $(this).attr("data-el");
   // console.log("Selected card type:", selectedCardType);
  
    updatePlanSelection(selectedCardType);
  
    // Example scroll only if user click
    if (!isProgrammaticClick) {
      $("html, body").animate(
        { scrollTop: $("#step-3").offset().top },
        400
      );
    //  console.log("User clicked, scrolling to #step-3");
    } else {
     // console.log("Programmatic click, skipping scroll");
    }
  });
  
  
  /****************************
   *
   * STEP 7: Calculating the Summary Total
   *
   ****************************/
  
  let chosenHelpdeskPrice = 0;
  let chosenAutomatePrice = 0;
  let voiceTicketPrice = 0;
  let smsTicketPrice = 0;
  
  function calculateSummary() {
    if (!chosenHelpdeskPrice || chosenHelpdeskPrice === 0) {
     // console.warn("No plan has been selected yet.");
      return;
    }
    const summaryTotal = chosenHelpdeskPrice + chosenAutomatePrice + voiceTicketPrice + smsTicketPrice;
    const formattedTotal = formatNumberWithCommas(summaryTotal.toFixed(0));
    $('[data-el="summaryTotalPrice"]').text(formattedTotal);
   // console.log("Updated DOM with summary total:", formattedTotal);
  }
  
  
  /****************************
   *
   * STEP 8: Update Active Plan + Addon UI + ROI
   *
   ****************************/
  
  function updateActivePlanElement() {
    const planElements = document.querySelectorAll("[g-col-highlight]");
    planElements.forEach((element) => {
      if (
        element.getAttribute("g-col-highlight").toLowerCase() ===
        globalCurrentPlanName.toLowerCase()
      ) {
        element.classList.add("is-active");
      //  console.log("Highlight updated on plan:", globalCurrentPlanName);
      } else {
        element.classList.remove("is-active");
      }
    });
  }
  
  // ROI calculation
  function calculateROISavings() {
    const avgTimePerTicketWithoutGorgias = 8.6;
    const avgTimePerTicketWithGorgias = 6;
    const avgSupportSalary = 35;
  
    let agentTicketsWithAutomate = globalTicketNumber;
    const percentage = selectedCardType ? selectedCardType.replace("pricingCard", "") : "0";
    const automateTickets = window[`globalAutomateTickets${percentage}`] || 0;
    agentTicketsWithAutomate = globalTicketNumber - automateTickets;
  
    if (isNaN(agentTicketsWithAutomate)) {
      console.error("Invalid agent ticket number");
      return;
    }
  
    const totalSupportTimeWithoutGorgias = (globalTicketNumber * avgTimePerTicketWithoutGorgias) / 60;
    const totalHumanCostWithoutGorgias = totalSupportTimeWithoutGorgias * avgSupportSalary;
  
    const totalSupportTimeWithGorgias = (agentTicketsWithAutomate * avgTimePerTicketWithGorgias) / 60;
    const totalHumanCostWithGorgias = totalSupportTimeWithGorgias * avgSupportSalary;
  
    const totalGorgiasCost = chosenHelpdeskPrice + chosenAutomatePrice;
  
    const timeSaved = totalSupportTimeWithoutGorgias - totalSupportTimeWithGorgias;
    const moneySaved = totalHumanCostWithoutGorgias - (totalHumanCostWithGorgias + totalGorgiasCost);
  
    const formattedMoneySaved = formatNumberWithCommas(moneySaved.toFixed(0));
  
    $('[data-target="timeSaved"]').text(timeSaved.toFixed(0));
    if (moneySaved > 0) {
      $('[data-target="moneySaved"]').text(formattedMoneySaved);
    } else {
      $('[data-target="moneySaved"]').text("");
    }
  }
  
  // Recalc prices when the billing cycle changes
  function updatePricesOnBillingCycleChange() {
  //  console.log("Billing cycle changed to:", globalBillingCycle);
  
    determinePlan(globalTicketNumber);
    calculateAutomatePrices();
    updateVoiceTicketPrice();
    updateSmsTicketPrice();
  
    if (selectedCardType) {
      const automationRate = parseInt(selectedCardType.replace("pricingCard", ""), 10) || 0;
      const automateTickets = Math.round(globalTicketNumber * (automationRate / 100));
      updateChosenPrices(automateTickets, automationRate);
      calculateSummary();
      calculateROISavings();
      updateSummaryDetails();
    }
  }
  
  // Update chosen prices based on selected automation
  function updateChosenPrices(automateTicketsParam, automationRateParam) {
  //  console.log("Updating chosen prices for card:", selectedCardType);
  
    // Helpdesk overage
    if (globalCurrentPlanOverageTickets > 0) {
      helpdeskOverageCost = globalCurrentPlanOverageTickets * globalCurrentPlanOverageCostPerTicket;
    } else {
      helpdeskOverageCost = 0;
    }
    chosenHelpdeskPrice = globalCurrentPlanPrice + helpdeskOverageCost;
  
    let automateTickets = automateTicketsParam;
    let automationRate = automationRateParam;
  
    if (typeof automateTickets === "undefined" || typeof automationRate === "undefined") {
      if (selectedCardType) {
        automationRate = parseInt(selectedCardType.replace("pricingCard", ""), 10) || 0;
        automateTickets = Math.round(globalTicketNumber * (automationRate / 100));
      } else {
        automationRate = 0;
        automateTickets = 0;
      }
    }
  
    const automatePlansForCycle = automatePlans[globalBillingCycle];
    const automatePrice = findAutomatePrice(automateTickets, automatePlansForCycle);
    chosenAutomatePrice = automatePrice;
  
    // console.log("Chosen Helpdesk Price:", chosenHelpdeskPrice);
    // console.log("Chosen Automate Price:", chosenAutomatePrice);
  
    if (automationRate === 0) {
      $('[data-summary="automate"]').css("display", "none");
    } else {
      $('[data-summary="automate"]').css("display", "flex");
    }
  
    $('[data-el="chosenHelpdeskPrice"]').text(chosenHelpdeskPrice.toFixed(0));
    $('[data-el="chosenAutomatePrice"]').text(chosenAutomatePrice.toFixed(0));
  }
  
  // Summaries of base helpdesk & overages
  function updateSummaryDetails() {
    helpdeskBase.textContent = `${globalCurrentPlanPrice.toFixed(0)}`;
    if (globalCurrentPlanOverageTickets > 0) {
      helpdeskOverages.textContent = `${helpdeskOverageCost.toFixed(0)}`;
      $(".summary_plan-breakdown").css("display", "block");
    } else {
      helpdeskOverages.textContent = "0";
      $(".summary_plan-breakdown").css("display", "none");
    }
  }
  
  
  /****************************
   *
   * Voice & SMS Addons
   *
   ****************************/
  
  function updateVoiceTicketPrice() {
    const selectedTier = voiceTicketsSelect?.value;
    if (!selectedTier) return;
    const planType = globalBillingCycle;
    voiceTicketPrice = calculateAddonTicketPrice(selectedTier, planType, voiceTiers);
    updateAddonUI("voice", selectedTier, voiceTicketPrice);
  }
  
  function updateSmsTicketPrice() {
    const selectedTier = smsTicketsSelect?.value;
    if (!selectedTier) return;
    const planType = globalBillingCycle;
    smsTicketPrice = calculateAddonTicketPrice(selectedTier, planType, smsTiers);
    updateAddonUI("sms", selectedTier, smsTicketPrice);
  }
  
  function calculateAddonTicketPrice(selectedTier, planType, tiers) {
    const selectedPlan = tiers[planType].find((tier) => tier.tier === selectedTier);
    return selectedPlan ? selectedPlan.price : 0;
  }
  
  function updateAddonUI(addonType, selectedTier, ticketPrice) {
    const summaryElement = $(`[data-summary="${addonType}"]`);
    const priceElement = $(`.${addonType}-price`);
    const payAsYouGoElement = $(`.${addonType}-pay-as-you-go`);
    const onDemandElement = $(`.${addonType}-on-demand`);
    const ticketPriceElement = $(`.${addonType}-ticket-price`);
    const tiers = addonType === "voice" ? voiceTiers[globalBillingCycle] : smsTiers[globalBillingCycle];
  
    if (["Tier 0", "Pay as you go", "Tier 7"].includes(selectedTier)) {
      ticketPriceElement.css("display", "none");
    } else {
      ticketPriceElement.css("display", "block");
    }
  
    if (selectedTier === "Pay as you go") {
      priceElement.css("display", "none");
      payAsYouGoElement.css("display", "block");
      onDemandElement.css("display", "none");
    } else if (selectedTier === "Tier 7") {
      priceElement.css("display", "none");
      payAsYouGoElement.css("display", "none");
      onDemandElement.css("display", "block");
    } else {
      priceElement.css("display", "block");
      payAsYouGoElement.css("display", "none");
      onDemandElement.css("display", "none");
    }
  
    const selectedPlan = tiers.find((tier) => tier.tier === selectedTier);
    if (selectedPlan) {
      $(`[data-el="nb${addonType.charAt(0).toUpperCase() + addonType.slice(1)}Tickets"]`).text(selectedPlan.range);
    }
  
    $(`[data-el="${addonType}Price"]`).text(ticketPrice.toFixed(0));
   // console.log(`Updated UI with ${addonType} ticket price: ${ticketPrice}`);
  
    calculateSummary();
  }
  
  // Event listeners for the dropdown selects
  voiceTicketsSelect?.addEventListener("change", function () {
    $(voiceSummary).removeClass("is-hidden");
    updateVoiceTicketPrice();
  });
  
  smsTicketsSelect?.addEventListener("change", function () {
    $(smsSummary).removeClass("is-hidden");
    updateSmsTicketPrice();
  });
  
  // Hide summaries if Tier 0 is selected
  smsTicketsSelect?.addEventListener("change", function () {
    if (smsTicketsSelect.value === "Tier 0") {
      $(smsSummary).addClass("is-hidden");
    }
  });
  voiceTicketsSelect?.addEventListener("change", function () {
    if (voiceTicketsSelect.value === "Tier 0") {
      $(voiceSummary).addClass("is-hidden");
    }
  });
  
  
  /****************************
   *
   * Remove Items from Summary
   *
   ****************************/
  
  $('[data-summary="helpdesk-remove"]').on("click", function () {
    $(".plan_summary-layout").css("display", "none");
    $(".plan_no-selection").css("display", "flex");
    $(".code-radio").addClass("is-inactive");
    $(".pricing_card").removeClass("is-selected");
    $('[data-el="summaryTotalPrice"]').text("0,000");
    chosenHelpdeskPrice = 0;
    chosenAutomatePrice = 0;
  });
  
  $('[data-summary="automate-remove"]').on("click", function () {
    isProgrammaticClick = true;
    const defaultPricingCard = document.querySelector('[data-el="pricingCard"]');
    if (defaultPricingCard) {
     // console.log("Simulating click on default pricing card for 0% automation");
      defaultPricingCard.click();
    } else {
      console.error("No pricing card found for default automation (0%)");
    }
    $('[data-summary="automate"]').css("display", "none");
    setTimeout(() => {
      isProgrammaticClick = false;
    }, 0);
  });
  
  function resetAddonPrice(addon) {
    const addonTicketsDropdown = document.querySelector(`#${addon}-tickets`);
    if (!addonTicketsDropdown) return;
    addonTicketsDropdown.value = "Tier 0";
   // console.log(`${addon.toUpperCase()} tickets dropdown reset to Tier 0`);
  
    const changeEvent = new Event("change", { bubbles: true });
    addonTicketsDropdown.dispatchEvent(changeEvent);
  
    $(`[data-summary="${addon}"]`).addClass("is-hidden");
    $(".addons_dropdown-links.w--current").removeClass("w--current");
  
    if (addon === "voice") {
      updateVoiceTicketPrice();
    } else if (addon === "sms") {
      updateSmsTicketPrice();
    }
   // console.log(`${addon.toUpperCase()} reset completed`);
  }
  
  $('[data-summary="voice-remove"]').on("click", function () {
  //  console.log("Voice remove button clicked");
    resetAddonPrice("voice");
  });
  $('[data-summary="sms-remove"]').on("click", function () {
  //  console.log("SMS remove button clicked");
    resetAddonPrice("sms");
  });
  
  
  /***************************
   *
   * Update UI elements
   *
   **************************/
  
  function updateLogosAndCTAs() {
    let heroBtnLeft = $('[data-el="switch-btn-left"]');
    let heroBtnRight = $('[data-el="switch-btn-right"]');
  
    if (globalCurrentPlanName === "Starter" || globalCurrentPlanName === "Basic") {
      $(".is-pro-logos").css("display", "flex");
      $(".is-advanced-logos, .is-enterprise-logos").css("display", "none");
      $('[data-el="book-demo"]').css("display", "none");
      $('[data-el="contact-sales"]').css("display", "none");
      $('[data-el="start-free-trial"]').css("display", "block");
  
      heroBtnLeft.find("div:first").text("Start Free Trial").end().attr("href", "/signup-2");
      heroBtnRight.find("div:first").text("Book a Demo").end().attr("href", "/demo");
  
      $(".pricing_card-wrapper, .pricing-step_banner").css("display", "flex");
      $(".pricing-step_banner.is-enterprise").css("display", "none");
    } else if (globalCurrentPlanName === "Advanced" || globalCurrentPlanName === "Pro") {
      $(".is-advanced-logos").css("display", "flex");
      $(".is-pro-logos, .is-enterprise-logos").css("display", "none");
      $('[data-el="book-demo"]').css("display", "block");
      $('[data-el="contact-sales"]').css("display", "none");
      $('[data-el="start-free-trial"]').css("display", "none");
  
      heroBtnLeft.find("div:first").text("Book a Demo").end().attr("href", "/demo");
      heroBtnRight.find("div:first").text("Start Free Trial").end().attr("href", "/signup-2");
  
      $(".pricing_card-wrapper, .pricing-step_banner").css("display", "flex");
      $(".pricing-step_banner.is-enterprise").css("display", "none");
    } else if (globalCurrentPlanName === "Enterprise") {
      $(".is-enterprise-logos").css("display", "flex");
      $(".is-pro-logos, .is-advanced-logos").css("display", "none");
      $(".pricing_card-wrapper, .pricing-step_banner").css("display", "none");
      $(".pricing-step_banner.is-enterprise").css("display", "flex");
      $('[data-el="book-demo"]').css("display", "none");
      $('[data-el="contact-sales"]').css("display", "block");
    }
  }
