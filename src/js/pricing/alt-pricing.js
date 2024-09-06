/****************************
 *
 * DATA DEFINITIONS
 *
 ****************************/

// Define the helpdesk plans
const helpdeskPlans = {
  monthly: [
    {
      name: "Starter",
      tickets_per_month: 50,
      monthly_cost: 10,
      cost_per_overage_ticket: 0.4,
    },
    {
      name: "Basic",
      tickets_per_month: 300,
      monthly_cost: 60,
      cost_per_overage_ticket: 0.4,
    },
    {
      name: "Pro",
      tickets_per_month: 2000,
      monthly_cost: 360,
      cost_per_overage_ticket: 0.36,
    },
    {
      name: "Advanced",
      tickets_per_month: 5000,
      monthly_cost: 900,
      cost_per_overage_ticket: 0.36,
    },
    {
      name: "Enterprise",
      tickets_per_month: 10000,
      monthly_cost: 1600,
      cost_per_overage_ticket: 0.32,
    },
  ],
  yearly: [
    {
      name: "Starter",
      tickets_per_month: 50,
      monthly_cost: 8,
      cost_per_overage_ticket: 0.4,
    },
    {
      name: "Basic",
      tickets_per_month: 300,
      monthly_cost: 50,
      cost_per_overage_ticket: 0.4,
    },
    {
      name: "Pro",
      tickets_per_month: 2000,
      monthly_cost: 300,
      cost_per_overage_ticket: 0.36,
    },
    {
      name: "Advanced",
      tickets_per_month: 5000,
      monthly_cost: 750,
      cost_per_overage_ticket: 0.36,
    },
    {
      name: "Enterprise",
      tickets_per_month: 10000,
      monthly_cost: 1333,
      cost_per_overage_ticket: 0.32,
    },
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

// Select Voice and SMS selects
const voiceTicketsSelect = document.querySelector(`[data-target="voice-tickets"]`);
const smsTicketsSelect = document.querySelector(`[data-target="sms-tickets"]`);
const voiceSummary = document.querySelector(`[data-summary="voice"]`);
const smsSummary = document.querySelector(`[data-summary="sms"]`);

/****************************
 * 
 * Global Functions
 * 
 ****************************/

// format figures with comma separator
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/****************************
 *
 * Step 1: Input Number of Tickets by User
 *
 ****************************/

// Global variable to store the number of tickets
let globalTicketNumber = 0;

$("#ticketRange").on("input", function () {
  // Parse the input value as an integer or set to 0 if invalid
  globalTicketNumber = parseInt($(this).val(), 10) || 0;

  // Log the current state
  console.log("Step 1: Number of tickets selected:", globalTicketNumber);

  // Pass the ticket number to DOM Element data-el="ticketNumber"
  $('[data-el="ticketNumber"]').text(globalTicketNumber);

  // After ticket input changes, trigger next steps
  if (globalCurrentPlanName === "Starter") {
    toggleMonthly();
  }

  updatePricesOnBillingCycleChange();
  determinePlan(globalTicketNumber);
  updateActivePlanElement();
  updateLogosAndCTAs();
});

// Function to initialize at 2000 tickets on page load
function initTicketNumber() {
  // Set the ticket number to 2000
  globalTicketNumber = 2000;

  // Update the ticket range input value
  $("#ticketRange").val(globalTicketNumber);

  // Pass the ticket number to DOM Element data-el="ticketNumber"
  $('[data-el="ticketNumber"]').text(globalTicketNumber);

  // After ticket input changes, trigger next steps
  determinePlan(globalTicketNumber);
  updateActivePlanElement();
  updateLogosAndCTAs();
}
/****************************
 *
 * Step 2: Check Billing Cycle
 *
 ****************************/

// Global variable to track the billing cycle
let globalBillingCycle = "yearly"; // Default to yearly

// Find all elements with class .billing-toggle-radio and add click event listeners
$(".billing-toggle-radio").on("click", function () {
  // Check if it's the yearly or monthly toggle
  if ($(this).hasClass("is-yearly")) {
    // Add active class to yearly, remove from monthly
    $(".is-yearly").addClass("active");
    $(".is-monthly").removeClass("active");

    // Mark the yearly radio input as checked
    $(".annualPlan").prop("checked", true);

    // Update the global billing cycle
    globalBillingCycle = "yearly";

    // Log the change
    console.log("Step 2: Switched to Yearly billing cycle");
  } else if ($(this).hasClass("is-monthly")) {
    // Add active class to monthly, remove from yearly
    $(".is-monthly").addClass("active");
    $(".is-yearly").removeClass("active");

    // Mark the monthly radio input as checked
    $(".monthlyPlan").prop("checked", true);

    // Update the global billing cycle
    globalBillingCycle = "monthly";

    // Log the change
    console.log("Step 2: Switched to Monthly billing cycle");
  }

  // Call updatePricesOnBillingCycleChange to recalculate prices and update DOM
  updatePricesOnBillingCycleChange();
  // After changing the billing cycle, reinitialize plan pricing
  determinePlan(globalTicketNumber);
});

// Function to toggle to monthly billing cycle
function toggleMonthly() {
  // Add active class to monthly, remove from yearly
  $(".is-monthly").addClass("active");
  $(".is-yearly").removeClass("active");
  // Mark the monthly radio input as checked
  $(".monthlyPlan").prop("checked", true);
  // Update the global billing cycle
  globalBillingCycle = "monthly";
  // Log the change
  console.log("Step 2: Switched to Monthly billing cycle");
  // After changing the billing cycle, reinitialize plan pricing
  determinePlan(globalTicketNumber);
  if (globalCurrentPlanName === "Starter") {
    // Set yearly toggle button to pointer-events none
    $(".billing-toggle-radio.is-yearly").css("pointer-events", "none");
  } else {
    // Set yearly toggle button to pointer-events auto
    $(".billing-toggle-radio.is-yearly").css("pointer-events", "auto");
  }
}

/****************************
 *
 * Step 3: Compare globalTicketNumber to Data Definitions
 *
 ****************************/

// Global variables for current plan
let globalCurrentPlanName = "";
let globalCurrentPlanPrice = 0; // This will hold the base price of the selected plan

// Function to determine the plan based on the number of tickets
function determinePlan(tickets) {
  const plans = helpdeskPlans[globalBillingCycle]; // Choose the plans based on the current billing cycle
  let currentPlanIndex = 0; // Start with the first plan
  let applicablePlan = plans[currentPlanIndex]; // Default to the first plan
  let overageCost = 0; // Overage cost variable
  let planCost = 0; // Plan cost variable

  // Loop through plans and check base price + overage cost, but display base price only
  while (currentPlanIndex < plans.length) {
    const plan = plans[currentPlanIndex];
    const overageTickets = tickets - plan.tickets_per_month;
    overageCost =
      overageTickets > 0 ? overageTickets * plan.cost_per_overage_ticket : 0;
    planCost = plan.monthly_cost;

    // Calculate total price (plan base cost + overage cost)
    const totalPrice = planCost + overageCost;

    // Log current plan calculation for debugging
    console.log(
      `Checking Plan: ${plan.name}, Base Price: ${planCost}, Overage Tickets: ${overageTickets}, Overage Cost: ${overageCost}, Total Price: ${totalPrice}`
    );

    // Compare total price (plan + overage) with the next plan's base price
    if (
      currentPlanIndex < plans.length - 1 &&
      totalPrice > plans[currentPlanIndex + 1].monthly_cost
    ) {
      // Move to the next plan if it is cheaper (considering overages)
      currentPlanIndex++;
      applicablePlan = plans[currentPlanIndex];
    } else {
      // Stay on the current plan if it's cheaper or equal
      break;
    }
  }

  // Set the global current plan name and base price (excluding overage cost)
  globalCurrentPlanName = applicablePlan.name;
  globalCurrentPlanPrice = applicablePlan.monthly_cost; // Always display the base price

  // Update the DOM element with the current plan name
  $('[data-el="planName"]').text(globalCurrentPlanName);

  // Log the selected plan and base price (without overages)
  console.log(
    "Step 3: Selected Plan -",
    globalCurrentPlanName,
    "| Base Price:",
    globalCurrentPlanPrice
  );

  // After determining the plan, calculate automated ticket prices
  calculateAutomatePrices();
}

/****************************
 *
 * Step 4: Calculate Number of Automated Tickets
 *
 ****************************/

// Global variables for automated ticket counts and prices
let globalAutomateTickets0 = 0,
  globalAutomateTickets10 = 0,
  globalAutomateTickets20 = 0,
  globalAutomateTickets30 = 0;
let globalAutomatePrice0 = 0,
  globalAutomatePrice10 = 0,
  globalAutomatePrice20 = 0,
  globalAutomatePrice30 = 0;

// Function to calculate automated ticket prices based on ticket percentages
function calculateAutomatePrices() {
  // Calculate the number of automated tickets for each percentage
  globalAutomateTickets0 = 0;
  globalAutomateTickets10 = Math.round(globalTicketNumber * 0.1);
  globalAutomateTickets20 = Math.round(globalTicketNumber * 0.2);
  globalAutomateTickets30 = Math.round(globalTicketNumber * 0.3);

  // For each percentage, update the DOM element with the calculated ticket count
  $('[data-el="automateTicketNumber10"]').text(globalAutomateTickets10);
  $('[data-el="automateTicketNumber20"]').text(globalAutomateTickets20);
  $('[data-el="automateTicketNumber30"]').text(globalAutomateTickets30);

  // Fetch the automate plans for the current billing cycle
  const automatePlansForCycle = automatePlans[globalBillingCycle];

  // Determine automate prices for each percentage
  globalAutomatePrice0 = findAutomatePrice(
    globalAutomateTickets0,
    automatePlansForCycle
  );
  globalAutomatePrice10 = findAutomatePrice(
    globalAutomateTickets10,
    automatePlansForCycle
  );
  globalAutomatePrice20 = findAutomatePrice(
    globalAutomateTickets20,
    automatePlansForCycle
  );
  globalAutomatePrice30 = findAutomatePrice(
    globalAutomateTickets30,
    automatePlansForCycle
  );

  // Log the calculated automated prices
  console.log(
    "Step 4: Automated Prices | 0%:",
    globalAutomatePrice0,
    "| 10%:",
    globalAutomatePrice10,
    "| 20%:",
    globalAutomatePrice20,
    "| 30%:",
    globalAutomatePrice30
  );

  // Proceed to calculate option prices
  calculateOptionPrices();
}

// Helper function to find automate price based on ticket count
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
 * Step 5: Calculate Plan Option Prices
 *
 ****************************/

// Function to calculate total plan prices for different automation levels
function calculateOptionPrices() {
  const option1 = globalCurrentPlanPrice + globalAutomatePrice0;
  const option2 = globalCurrentPlanPrice + globalAutomatePrice10;
  const option3 = globalCurrentPlanPrice + globalAutomatePrice20;
  const option4 = globalCurrentPlanPrice + globalAutomatePrice30;

  // Update the DOM elements with the calculated prices
  $('[data-el="helpdeskPrice0"]').text(option1);
  $('[data-el="helpdeskPrice10"]').text(option2);
  $('[data-el="helpdeskPrice20"]').text(option3);
  $('[data-el="helpdeskPrice30"]').text(option4);

  // Log the option prices
  console.log(
    "Step 5: Option Prices | Option 1:",
    option1,
    "| Option 2:",
    option2,
    "| Option 3:",
    option3,
    "| Option 4:",
    option4
  );
}

/****************************
 *
 * Step 6: Choosing a Plan
 *
 ****************************/
$('[data-el^="pricingCard"]').on("click", function () {
    // Store the selected card type (e.g., "pricingCard", "pricingCard10", etc.)
    selectedCardType = $(this).attr("data-el");
    console.log("Selected card type:", selectedCardType);
  
    // Deselect all cards and their automate pills
    $(".pricing_card").removeClass("is-selected");
    $(".pricing_card .pricing_automate-pill").removeClass("is-selected");
  
    // Select the clicked card and its automate pill
    $(this).toggleClass("is-selected");
    $(this).find(".pricing_automate-pill").toggleClass("is-selected");
  
    // Display the selected plan summary and hide the no-selection message
    $(".plan_summary-layout").css("display", "flex");
    $(".plan_no-selection").css("display", "none");
  
    // Enable the code radio buttons
    $(".code-radio").removeClass("is-inactive");
  
    // Update chosen prices and summary total
    updateChosenPrices();
    calculateSummary();
  });

/****************************
 *
 * Function to Recalculate Prices When Billing Cycle Changes
 *
 ****************************/

function updatePricesOnBillingCycleChange() {
    console.log("Billing cycle changed to:", globalBillingCycle);
  
    // Recalculate prices for the current billing cycle
    determinePlan(globalTicketNumber); // This recalculates the plan based on ticket number
    calculateAutomatePrices(); // Recalculate automate prices

    updateVoiceTicketPrice();
    updateSmsTicketPrice();
  
    // Ensure that chosen prices are updated after recalculating plans
    setTimeout(() => {
      updateChosenPrices();  // Ensure this updates the DOM after recalculating
      calculateSummary();     // Recalculate summary once prices are updated
    }, 100); // Adding a slight delay to ensure execution order
  }

/****************************
 *
 * Function to Update Chosen Prices Based on Selected Card Type
 *
 ****************************/

function updateChosenPrices() {
    console.log("Updating prices for selected card:", selectedCardType);
  
    // Check if a card was selected previously
    if (!selectedCardType) {
      console.warn("No selected card type, using default (pricingCard).");
      selectedCardType = "pricingCard"; // Default to the first card if none is selected
    }
  
    // Update chosen prices based on the selected card
    switch (selectedCardType) {
      case "pricingCard":
        chosenHelpdeskPrice = globalCurrentPlanPrice;
        chosenAutomatePrice = globalAutomatePrice0;
        break;
      case "pricingCard10":
        chosenHelpdeskPrice = globalCurrentPlanPrice;
        chosenAutomatePrice = globalAutomatePrice10;
        break;
      case "pricingCard20":
        chosenHelpdeskPrice = globalCurrentPlanPrice;
        chosenAutomatePrice = globalAutomatePrice20;
        break;
      case "pricingCard30":
        chosenHelpdeskPrice = globalCurrentPlanPrice;
        chosenAutomatePrice = globalAutomatePrice30;
        break;
    }
  
    // Log updated prices
    console.log("Updated chosenHelpdeskPrice:", chosenHelpdeskPrice);
    console.log("Updated chosenAutomatePrice:", chosenAutomatePrice);
  
    // Update the DOM with the chosen prices
    $('[data-el="chosenHelpdeskPrice"]').text(chosenHelpdeskPrice);
    $('[data-el="chosenAutomatePrice"]').text(chosenAutomatePrice);
  }
  
/****************************
 *
 * Step 7: Calculating the Summary Total
 *
 ****************************/

// Function to calculate and update the summary total
function calculateSummary() {
    // Ensure chosenHelpdeskPrice, chosenAutomatePrice, voiceTicketPrice, and smsTicketPrice are added to the total
    summaryTotal = chosenHelpdeskPrice + chosenAutomatePrice + voiceTicketPrice + smsTicketPrice;
  
    // Log the calculated summary total
    console.log("Calculated summary total:", summaryTotal);
  
    // Format the summary total with comma separators
    const formattedTotal = formatNumberWithCommas(summaryTotal.toFixed(0));
  
    // Update the DOM with the new formatted summary total
    $('[data-el="summaryTotalPrice"]').text(formattedTotal);
  
    console.log("Updated DOM with formatted summary total:", formattedTotal);
  }

/****************************
 *
 * Step 8: Update Active Plan Element
 *
 ****************************/
function updateActivePlanElement() {
  globalCurrentPlanName; // Use the global variable to get the current plan name

  // Find all elements with the attribute 'g-col-highlight'
  const planElements = document.querySelectorAll("[g-col-highlight]");

  // Loop through each element to check if its value matches the current plan name
  planElements.forEach((element) => {
    // Compare the element's attribute value with the current plan name, case insensitive
    if (
      element.getAttribute("g-col-highlight").toLowerCase() ===
      globalCurrentPlanName.toLowerCase()
    ) {
      element.classList.add("is-active"); // Add the 'is-active' class if it matches
    } else {
      element.classList.remove("is-active"); // Otherwise, remove the 'is-active' class
    }
  });
}

/****************************
 *
 * Selecting and calculating voice and SMS tickets
 *
 * **************************/

// Global variables for voice and SMS ticket prices
let voiceTicketPrice = 0;
let smsTicketPrice = 0;

// Function to calculate the price of the voice tickets
function calculateVoiceTicketPrice(selectedTier, planType) {
  const tiers = voiceTiers[planType];
  const selectedPlan = tiers.find((tier) => tier.tier === selectedTier);
  return selectedPlan ? selectedPlan.price : 0;
}

// Function to calculate the price of the SMS tickets
function calculateSmsTicketPrice(selectedTier, planType) {
  const tiers = smsTiers[planType];
  const selectedPlan = tiers.find((tier) => tier.tier === selectedTier);
  return selectedPlan ? selectedPlan.price : 0;
}

// Function to update the UI with voice ticket prices
function updateVoiceTicketPrice() {
    const selectedTier = voiceTicketsSelect.value; // Get the selected tier
    const planType = globalBillingCycle; // Use the global billing cycle to determine the plan type
    voiceTicketPrice = calculateVoiceTicketPrice(selectedTier, planType); // Update global variable
  
    // Pass the selected range to the DOM
    const tiers = voiceTiers[planType];
    const selectedPlan = tiers.find((tier) => tier.tier === selectedTier);
    if (selectedPlan) {
      $('[data-el="nbVoiceTickets"]').text(selectedPlan.range);
    }
  
    // Update DOM element for voice price
    $('[data-el="voicePrice"]').text(voiceTicketPrice.toFixed(0));
    console.log(`Updated UI with voice ticket price: ${voiceTicketPrice}`);
  
    // Ensure we recalculate the summary total after updating the price
    calculateSummary();
  }
  
// Function to update the UI with SMS ticket prices
function updateSmsTicketPrice() {
    const selectedTier = smsTicketsSelect.value; // Get the selected tier
    const planType = globalBillingCycle; // Use the global billing cycle to determine the plan type
    smsTicketPrice = calculateSmsTicketPrice(selectedTier, planType); // Update global variable
  
    // Pass the selected range to the DOM
    const tiers = smsTiers[planType];
    const selectedPlan = tiers.find((tier) => tier.tier === selectedTier);
    if (selectedPlan) {
      $('[data-el="nbSMSTickets"]').text(selectedPlan.range);
    }
  
    // Update DOM element for SMS price
    $('[data-el="smsPrice"]').text(smsTicketPrice.toFixed(0));
    console.log(`Updated UI with SMS ticket price: ${smsTicketPrice}`);
  
    // Ensure we recalculate the summary total after updating the price
    calculateSummary();
  }

  voiceTicketsSelect.addEventListener("change", updateVoiceTicketPrice);
  smsTicketsSelect.addEventListener("change", updateSmsTicketPrice);

  voiceTicketsSelect.addEventListener("change", function () {
    $(voiceSummary).removeClass("is-hidden");
    updateVoiceTicketPrice();
  });
 
 smsTicketsSelect.addEventListener("change", function () {
    $(smsSummary).removeClass("is-hidden");
    updateSmsTicketPrice();
  });

  


/****************************
 *
 * Remove Items from Summary
 *
 * **************************/

// Handle clicks on remove buttons

// When click on helpdesk-remove and automate-remove buttons plan_summary-layout display none and plan_no-selection display flex
$('[data-summary="helpdesk-remove"').on("click", function () {
  $(".plan_summary-layout").css("display", "none");
  $(".plan_no-selection").css("display", "flex");
  $(".code-radio").addClass("is-inactive");
  $(".pricing_card").removeClass("is-selected");
});

$('[data-summary="automate-remove"').on("click", function () {
  $(".plan_summary-layout").css("display", "none");
  $(".plan_no-selection").css("display", "flex");
  $(".code-radio").addClass("is-inactive");
  $(".pricing_card").removeClass("is-selected");
});

$('[data-summary="voice-remove"').on("click", function () {
    // Remove the selected voice tier by choosing the default option "No Voice Tickets"
    voiceTicketsSelect.value = "Tier 0";
    // Remove current class
    $('.addons_dropdown-links.w--current').removeClass('w--current');
    $(voiceSummary).addClass("is-hidden");
    // Update the UI with the new price
    updateVoiceTicketPrice();
});

$('[data-summary="sms-remove"').on("click", function () {
  // Remove the selected voice tier by choosing the default option "No Voice Tickets"
  smsTicketsSelect.value = "Tier 0";
  // Remove current class
  $('.addons_dropdown-links.w--current').removeClass('w--current');
  $(smsSummary).addClass("is-hidden");
  // Update the UI with the new price
    updateSmsTicketPrice();
});

/***************************
 *
 * Update UI elements
 *
 * *************************/

// Function to display logos elements based on current plan name
// if plan name is Starter, Basic or Pro display logos for Pro
// if plan name is Advanced display logos for Advanced
// if plan name is Enterprise display logos for Enterprise

function updateLogosAndCTAs() {
  if (
    globalCurrentPlanName === "Starter" ||
    globalCurrentPlanName === "Basic" ||
    globalCurrentPlanName === "Pro"
  ) {
    $(".is-pro-logos").css("display", "flex");
    $(".is-advanced-logos").css("display", "none");
    $(".is-enterprise-logos").css("display", "none");
    $('[data-el="book-demo"]').css("display", "none");
    $('[data-el="start-free-trial"]').css("display", "block");
    $(".pricing_card-wrapper").css("display", "flex");
    $(".pricing-step_banner.is-enterprise").css("display", "none");
  } else if (globalCurrentPlanName === "Advanced") {
    $(".is-pro-logos").css("display", "none");
    $(".is-advanced-logos").css("display", "flex");
    $(".is-enterprise-logos").css("display", "none");
    $('[data-el="book-demo"]').css("display", "block");
    $('[data-el="start-free-trial"]').css("display", "none");
    $(".pricing_card-wrapper").css("display", "flex");
    $(".pricing-step_banner.is-enterprise").css("display", "none");
  } else if (globalCurrentPlanName === "Enterprise") {
    $(".is-pro-logos").css("display", "none");
    $(".is-advanced-logos").css("display", "none");
    $(".is-enterprise-logos").css("display", "flex");
    $(".pricing_card-wrapper").css("display", "none");
    $(".pricing-step_banner.is-enterprise").css("display", "flex");
  }
}

var Webflow = Webflow || [];
Webflow.push(function () {
  // Initialize the ticket number input
  initTicketNumber();
  // Initialize the active plan element
  updateActivePlanElement();
});
