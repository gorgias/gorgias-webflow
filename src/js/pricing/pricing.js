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
const voiceTicketsSelect = document.querySelector(
  `[data-target="voice-tickets"]`
);
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

$(".support-tickets_cta").on("click", function () {
  const orders = parseInt($(".support-tickets_input").val(), 10);
  const tickets = Math.round(orders / 15);
  $(".support-tickets_result-value").text(tickets);
  $(".support-tickets_result").css("display", "block");
});

/****************************
 *
 * Step 1: Input Number of Tickets by User
 *
 ****************************/

// Global variable to store the number of tickets
let globalTicketNumber = 0;

// Function to handle ticket range input
$("#ticketRange").on("input", function () {
  // Parse the input value as an integer or set to 0 if invalid
  globalTicketNumber = parseInt($(this).val(), 10) || 0;

  // Log the current state
  console.log("Step 1: Number of tickets selected:", globalTicketNumber);

  // Pass the ticket number to DOM Element data-el="ticketNumber" but format first
  $('[data-el="ticketNumber"]').text(globalTicketNumber);

  // After ticket input changes, trigger next steps
  if (globalCurrentPlanName === "Starter") {
    toggleMonthly();
  }

  // Ensure that plan selection is valid before proceeding
  determinePlan(globalTicketNumber);
  updateLogosAndCTAs();
  // Display alert
  displayAlert();

  // Check if a valid plan has been determined
  if (globalCurrentPlanName && chosenHelpdeskPrice > 0) {
    // Update prices, UI elements, and calculate the summary
    updatePricesOnBillingCycleChange();
    updateActivePlanElement();
    calculateSummary();
  } else {
    console.warn("No valid plan selected, skipping summary calculation.");
  }
});

$("#ticketRange-2").on("input", function () {
  // Parse the input value as an integer or set to 0 if invalid
  globalTicketNumber = parseInt($(this).val(), 10) || 0;

  // Log the current state
  console.log("Step 1: Number of tickets selected:", globalTicketNumber);

  // Pass the ticket number to DOM Element data-el="ticketNumber" but format first
  $('[data-el="ticketNumber"]').text(globalTicketNumber);

  // After ticket input changes, trigger next steps
  if (globalCurrentPlanName === "Starter") {
    toggleMonthly();
  }

  // Ensure that plan selection is valid before proceeding
  determinePlan(globalTicketNumber);
  updateLogosAndCTAs();
  updateActivePlanElement();
  // Display alert
  displayAlert();

  // Check if a valid plan has been determined
  if (globalCurrentPlanName && chosenHelpdeskPrice > 0) {
    // Update prices, UI elements, and calculate the summary
    updatePricesOnBillingCycleChange();
    updateActivePlanElement();
    calculateSummary();
  } else {
    console.warn("No valid plan selected, skipping summary calculation.");
  }
});

let debounceTimeout;

$("#ticketRange").on("change", function () {
  // After ticket input changes, trigger next steps
  if (globalCurrentPlanName === "Starter") {
    toggleMonthly();
  }

  const ticketNumber = parseInt($(this).val(), 10);
  // After ticket input changes, trigger next steps
  determinePlan(globalTicketNumber);
  updateActivePlanElement();
  updateLogosAndCTAs();
  // Display alert
  displayAlert();

    // Check if the ticket number is more than 1500
    if (ticketNumber > 1501) {
      $(".more-tickets-cta").css("display", "flex"); // Show the CTA if tickets are higher than 1501
    } else {
      $(".more-tickets-cta").css("display", "none"); // Hide CTA if tickets are 1501 or less
    }
});

$("#ticketRange-2").on("change", function () {
  // After ticket input changes, trigger next steps
  if (globalCurrentPlanName === "Starter") {
    toggleMonthly();
  }

  const ticketNumber = parseInt($(this).val(), 10);

  // Check if the ticket number is more than 1500
  if (ticketNumber > 1501) {
    $(".more-tickets-cta").css("display", "flex"); // Show the CTA if tickets are higher than 1501
  } else {
    $(".more-tickets-cta").css("display", "none"); // Hide CTA if tickets are 1501 or less
  }
});

// Handle click event on the more-tickets-cta button
$(".more-tickets-cta").on("click", function () {
  // Hide the lower graduation and show the higher graduation
  $(".range-slider_graduation.is-lower").css("display", "none");
  $(".range-slider_graduation.is-higher").css("display", "flex");
  $(this).remove();

  $(".pricing-step_range-module.is-lower").css("display", "none");
  $(".pricing-step_range-module.is-lower").remove();
  $(".pricing-step_range-module.is-higher").css("display", "flex");

  // Set the ticket number to 2500
  globalTicketNumber = 2500;

  // Update the ticket range input value
  $("#ticketRange-2").val(globalTicketNumber);

  // Pass the ticket number to DOM Element data-el="ticketNumber"
  $('[data-el="ticketNumber"]').text(
    formatNumberWithCommas(globalTicketNumber)
  );

  // After ticket input changes, trigger next steps
  determinePlan(globalTicketNumber);
  updateActivePlanElement();
  updateLogosAndCTAs();
  // Display alert
  displayAlert();

  // Log the change for debugging
  console.log("Range slider updated to max 10000 and step 100");
});

let isThumbDragging = false; // Flag to track if the thumb is being dragged

// Listen for mousedown on the .range-slider_thumb
$(".range-slider_thumb").on("mousedown", function () {
  console.log("Mouse down on range slider thumb");
  isThumbDragging = true; // Set the flag to true when dragging starts
});

// Listen for mouseup anywhere in the document
$(document).on("mouseup", function () {
  if (isThumbDragging) {
    // Check if dragging was happening
    console.log("Mouse up detected after dragging thumb");
    isThumbDragging = false; // Reset the flag

    // Scroll to #step-1
    var scrollTarget = $("#step-1");
    if (scrollTarget.length) {
      // Check if the target element exists
      console.log("Scrolling to #step-1");
      $("html, body").animate(
        {
          scrollTop: scrollTarget.offset().top - $(window).height() * -0.1, // Scroll with a 20% offset
        },
        400
      ); // 400ms scroll duration
    } else {
      console.log("Element #step-1 not found");
    }
  }
});

$('.range-slider_track.is-pricing').on("mouseup", function(){
   // Scroll to #step-1
   var scrollTarget = $("#step-1");
   if (scrollTarget.length) {
     // Check if the target element exists
     console.log("Scrolling to #step-1");
     $("html, body").animate(
       {
         scrollTop: scrollTarget.offset().top - $(window).height() * -0.1, // Scroll with a 20% offset
       },
       400
     ); // 400ms scroll duration
   } else {
     console.log("Element #step-1 not found");
   }
});

// Function to initialize at 2000 tickets on page load
function initTicketNumber() {
  // Set the ticket number to 1250
  globalTicketNumber = 1250;

  // Update the ticket range input value
  $("#ticketRange").val(globalTicketNumber);

  // Pass the ticket number to DOM Element data-el="ticketNumber"
  $('[data-el="ticketNumber"]').text(
    formatNumberWithCommas(globalTicketNumber)
  );
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
  // Display alert
  displayAlert();
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
  console.log("Switched to Monthly billing cycle");
  // After changing the billing cycle, reinitialize plan pricing
  determinePlan(globalTicketNumber);
  if (globalCurrentPlanName === "Starter") {
    // Set yearly toggle button to pointer-events none
    $(".billing-toggle-radio.is-yearly").css("pointer-events", "none");
  } else {
    // Set yearly toggle button to pointer-events auto
    $(".billing-toggle-radio.is-yearly").css("pointer-events", "auto");
  }
  // Display alert
  displayAlert();
}

// Function to toggle to monthly billing cycle
function toggleYearly() {
  // Add active class to monthly, remove from yearly
  $(".is-monthly").removeClass("active");
  $(".is-yearly").addClass("active");
  // Mark the monthly radio input as checked
  $(".annualPlan").prop("checked", true);
  // Update the global billing cycle
  globalBillingCycle = "yearly";
  // Log the change
  console.log("Switched to Yearly billing cycle");
  // After changing the billing cycle, reinitialize plan pricing
  determinePlan(globalTicketNumber);
  if (globalCurrentPlanName != "Starter") {
    // Set yearly toggle button to pointer-events none
    $(".billing-toggle-radio.is-yearly").css("pointer-events", "auto");
  } else {
    // Set yearly toggle button to pointer-events auto
    $(".billing-toggle-radio.is-yearly").css("pointer-events", "auto");
  }
  // Display alert
  displayAlert();
}

function displayAlert() {
  // Hide all alerts initially
  $(".yearly-billing-alert").css("display", "none");
  $(".monthly-billing-alert").css("display", "none");
  $(".starter-billing-alert").css("display", "none");

  // Check for the conditions and show the appropriate alert
  if (globalBillingCycle === "yearly") {
    // Display yearly alert only if the billing cycle is yearly
    $(".yearly-billing-alert").css("display", "flex");
    $('.radio-wrap.billing-toggle-radio.is-yearly').removeClass('is-disabled');
    console.log("Displaying yearly billing alert");
  } else if (
    globalBillingCycle === "monthly" &&
    globalCurrentPlanName === "Starter"
  ) {
    // Display starter alert if the plan is Starter and billing cycle is monthly
    $(".starter-billing-alert").css("display", "flex");
    $('.radio-wrap.billing-toggle-radio.is-yearly').addClass('is-disabled');
    console.log("Displaying starter monthly billing alert");
  } else if (
    globalBillingCycle === "monthly" &&
    globalCurrentPlanName !== "Starter"
  ) {
    // Display monthly alert if billing cycle is monthly and plan is not Starter
    $(".monthly-billing-alert").css("display", "flex");
    $('.radio-wrap.billing-toggle-radio.is-yearly').removeClass('is-disabled');
    console.log("Displaying monthly billing alert");
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
  const previousPlanName = globalCurrentPlanName; // Save the current plan name before updating
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

  // Simpler condition to toggle to yearly if needed
  if (
    previousPlanName === "Starter" &&
    globalCurrentPlanName !== "Starter" &&
    globalBillingCycle === "monthly"
  ) {
    console.log(
      "Toggling to yearly due to plan change from 'Starter' and monthly billing."
    );
    toggleYearly();
  }

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

  // For each percentage, update the DOM element with the calculated ticket count format numbers first and also pass updated amount of normal tickets to the DOM

  $('[data-el="automateTicketNumber10"]').text(
    formatNumberWithCommas(globalAutomateTickets10)
  );
  $('[data-el="ticketNumber10"]').text(
    formatNumberWithCommas(globalTicketNumber - globalAutomateTickets10)
  );
  $('[data-el="automateTicketNumber20"]').text(
    formatNumberWithCommas(globalAutomateTickets20)
  );
  $('[data-el="ticketNumber20"]').text(
    formatNumberWithCommas(globalTicketNumber - globalAutomateTickets20)
  );
  $('[data-el="automateTicketNumber30"]').text(
    formatNumberWithCommas(globalAutomateTickets30)
  );
  $('[data-el="ticketNumber30"]').text(
    formatNumberWithCommas(globalTicketNumber - globalAutomateTickets30)
  );

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
// Global flag to track programmatic clicks
let isProgrammaticClick = false;

// Event listener for pricing card clicks
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

  // Find the chosen automation rate from selected card type and display in data-el="automationRate" element
  const automationRate = selectedCardType.replace("pricingCard", "");
  $('[data-el="automationRate"]').text(automationRate);

  // Update chosen prices and summary total
  updateChosenPrices();
  calculateSummary();
  calculateROISavings();

  // Only scroll to #step-3 if this is a user click
  if (!isProgrammaticClick) {
    $("html, body").animate(
      {
        scrollTop: $("#step-3").offset().top,
      },
      400 // Scroll speed in milliseconds
    );
    console.log("User clicked, scrolling to #step-3");
  } else {
    console.log("Programmatic click, skipping scroll to #step-3");
  }
});
/****************************
 *
 * Function to Calculate ROI Savings Based on Chosen Plan
 *
 ****************************/

function calculateROISavings() {
  const avgTimePerTicketWithoutGorgias = 8.6; // Average time per ticket without Gorgias, in minutes
  const avgTimePerTicketWithGorgias = 6; // Average time per ticket with Gorgias, in minutes
  const avgSupportSalary = 35; // Average support salary in USD/hour

  // Agent tickets is set to globalTicketNumber by default
  let agentTickets = globalTicketNumber;
  let agentTicketsWithAutomate = globalTicketNumber; // Default to no automation if 0% is chosen

  // Check which card is selected (automation rate)
  if (selectedCardType === "pricingCard10") {
    agentTicketsWithAutomate = globalTicketNumber - globalAutomateTickets10;
    console.log("All tickets with 10% automate: ", agentTicketsWithAutomate);
  } else if (selectedCardType === "pricingCard20") {
    agentTicketsWithAutomate = globalTicketNumber - globalAutomateTickets20;
    console.log("All tickets with 20% automate: ", agentTicketsWithAutomate);
  } else if (selectedCardType === "pricingCard30") {
    agentTicketsWithAutomate = globalTicketNumber - globalAutomateTickets30;
    console.log("All tickets with 30% automate: ", agentTicketsWithAutomate);
  }

  // Ensure agent tickets are a valid number
  if (isNaN(agentTickets)) {
    console.error("Invalid agent ticket number");
    return;
  }

  // Calculate total support time without Gorgias (in hours)
  let totalSupportTimeWithoutGorgias =
    (agentTickets * avgTimePerTicketWithoutGorgias) / 60;

  // Calculate total human cost without Gorgias
  let totalHumanCostWithoutGorgias =
    totalSupportTimeWithoutGorgias * avgSupportSalary;

  // If 0% automation, set agentTicketsWithAutomate to agentTickets (no automation applied)
  if (
    selectedCardType === "pricingCard" ||
    agentTicketsWithAutomate === globalTicketNumber
  ) {
    agentTicketsWithAutomate = agentTickets;
    console.log("No automation selected, only helpdesk pricing considered");
  }

  // Calculate total support time with Gorgias (in hours)
  let totalSupportTimeWithGorgias =
    (agentTicketsWithAutomate * avgTimePerTicketWithGorgias) / 60;

  // Calculate total human cost with Gorgias
  let totalHumanCostWithGorgias =
    totalSupportTimeWithGorgias * avgSupportSalary;

  // Calculate total Gorgias cost (helpdesk + automate prices)
  let totalGorgiasCost = chosenHelpdeskPrice + chosenAutomatePrice;

  // Calculate time and money saved
  let timeSaved = totalSupportTimeWithoutGorgias - totalSupportTimeWithGorgias;
  let moneySaved =
    totalHumanCostWithoutGorgias -
    (totalHumanCostWithGorgias + totalGorgiasCost);

  // Log the results for debugging
  console.log(`Agent tickets: ${agentTickets}`);
  console.log(
    `Total support time without Gorgias (hours): ${totalSupportTimeWithoutGorgias}`
  );
  console.log(
    `Total human cost without Gorgias: ${totalHumanCostWithoutGorgias}`
  );
  console.log(`Chosen helpdesk price: ${chosenHelpdeskPrice}`);
  console.log(`Chosen automate price: ${chosenAutomatePrice}`);
  console.log(`Total Gorgias cost: ${totalGorgiasCost}`);
  console.log(
    `Total support time with Gorgias (hours): ${totalSupportTimeWithGorgias}`
  );
  console.log(`Total human cost with Gorgias: ${totalHumanCostWithGorgias}`);
  console.log(`Time saved: ${timeSaved} hours`);
  console.log(`Money saved: ${moneySaved} USD`);

  // Format money saved with comma separators
  const formattedMoneySaved = formatNumberWithCommas(moneySaved.toFixed(0));

  // Update the DOM with time and formatted money saved
  $('[data-target="timeSaved"]').text(timeSaved.toFixed(0));
  $('[data-target="moneySaved"]').text(formattedMoneySaved);
}

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
    updateChosenPrices(); // Ensure this updates the DOM after recalculating
    calculateSummary(); // Recalculate summary once prices are updated
    calculateROISavings();
  }, 100); // Adding a slight delay to ensure execution order
}

/****************************
 *
 * Function to Update Chosen Prices Based on Selected Card Type
 *
 ****************************/
// Initialize selectedCardType to a default value
let selectedCardType = "pricingCard"; // Default value if no card is selected

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

  // Check if automation is 0% and hide or show the automate summary
  if (selectedCardType === "pricingCard") {
    // Automate is 0%, hide the automate summary
    $('[data-summary="automate"]').css("display", "none");
    console.log("Automation is 0%, hiding automate summary.");
  } else {
    // Automate is not 0%, show the automate summary
    $('[data-summary="automate"]').css("display", "flex");
    console.log("Automation is not 0%, displaying automate summary.");
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
// Initialize chosen prices to default values (0) to avoid errors
let chosenHelpdeskPrice = 0;
let chosenAutomatePrice = 0;

// Function to calculate and update the summary total
function calculateSummary() {
  // Ensure chosenHelpdeskPrice and chosenAutomatePrice are valid
  if (!chosenHelpdeskPrice || chosenHelpdeskPrice === 0) {
    console.warn("No plan has been selected yet.");
    return; // Exit the function without calculating or updating the DOM
  }

  // Calculate the summary total
  summaryTotal =
    chosenHelpdeskPrice +
    chosenAutomatePrice +
    voiceTicketPrice +
    smsTicketPrice;

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
      console.log('highlight updated');
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

  // If there's a selected tier != "No Voice Tickets" .voice-ticket-price display block else display none
  if (
    selectedTier === "Tier 0" ||
    selectedTier === "Pay as you go" ||
    selectedTier === "Tier 7"
  ) {
    $(".voice-ticket-price").css("display", "none");
  } else {
    $(".voice-ticket-price").css("display", "block");
  }

  if (selectedTier === "Pay as you go") {
    $(".voice-price").css("display", "none");
    $(".voice-pay-as-you-go").css("display", "block");
    $(".voice-on-demand").css("display", "none");
  } else if (selectedTier === "Tier 7") {
    $(".voice-price").css("display", "none");
    $(".voice-pay-as-you-go").css("display", "none");
    $(".voice-on-demand").css("display", "block");
  } else {
    $(".voice-price").css("display", "block");
    $(".voice-pay-as-you-go").css("display", "none");
    $(".voice-on-demand").css("display", "none");
  }

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

  // If there's a selected tier != "No Voice Tickets" .voice-ticket-price display block else display none
  if (
    selectedTier === "Tier 0" ||
    selectedTier === "Pay as you go" ||
    selectedTier === "Tier 7"
  ) {
    $(".sms-ticket-price").css("display", "none");
  } else {
    $(".sms-ticket-price").css("display", "block");
  }

  if (selectedTier === "Pay as you go") {
    $(".sms-price").css("display", "none");
    $(".sms-pay-as-you-go").css("display", "block");
    $(".sms-on-demand").css("display", "none");
  } else if (selectedTier === "Tier 7") {
    $(".sms-price").css("display", "none");
    $(".sms-pay-as-you-go").css("display", "none");
    $(".sms-on-demand").css("display", "block");
  } else {
    $(".sms-price").css("display", "block");
    $(".sms-pay-as-you-go").css("display", "none");
    $(".sms-on-demand").css("display", "none");
  }

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

// When click on helpdesk-remove and automate-remove buttons plan_summary-layout display none and plan_no-selection display flex + remove price in summary total price and go back to "0;000.00"
// When click on helpdesk-remove button
$('[data-summary="helpdesk-remove"]').on("click", function () {
  // Hide plan summary and show no-selection message
  $(".plan_summary-layout").css("display", "none");
  $(".plan_no-selection").css("display", "flex");

  // Disable radio buttons and deselect pricing cards
  $(".code-radio").addClass("is-inactive");
  $(".pricing_card").removeClass("is-selected");

  // Reset summary total price to "0,000"
  $('[data-el="summaryTotalPrice"]').text("0,000");

  // Optionally reset chosen helpdesk price
  chosenHelpdeskPrice = 0;
  chosenAutomatePrice = 0;
  console.log(
    "Helpdesk remove button clicked. " +
      "Helpdesk price equals " +
      chosenHelpdeskPrice
  );
  console.log(
    "Automate remove button clicked. " +
      "Automate price equals " +
      chosenAutomatePrice
  );
});

// When click on automate-remove button
$('[data-summary="automate-remove"]').on("click", function () {
  // Set the flag to true before triggering the programmatic click
  isProgrammaticClick = true;

  // Simulate a click on the "pricingCard" element (the default automation option, 0% automate)
  const defaultPricingCard = document.querySelector('[data-el="pricingCard"]');

  // Check if the default pricing card exists before proceeding
  if (defaultPricingCard) {
    console.log('Simulating click on default pricing card for 0% automation');
    defaultPricingCard.click(); // Trigger the click event on the pricing card
  } else {
    console.error('No pricing card found for default automation (0%)');
  }

  // Reset the flag after the programmatic click
  setTimeout(() => {
    isProgrammaticClick = false;
  }, 0); // Ensures the flag is reset immediately after the click
});

function resetVoicePrice() {
  const voiceTicketsDropdown = document.querySelector("#voice-tickets");

  // Set the dropdown to "No Voice Tickets"
  voiceTicketsDropdown.value = "Tier 0";

  // Log to confirm the dropdown value is set correctly
  console.log("Voice tickets dropdown reset to Tier 0");

  // Programmatically trigger the change event to ensure the UI updates
  const changeEvent = new Event("change", { bubbles: true });
  voiceTicketsDropdown.dispatchEvent(changeEvent);

  // Add the is-hidden class to the voice summary block
  $('[data-summary="voice"]').addClass("is-hidden");

  // Remove the w--current class from the dropdown
  $(".addons_dropdown-links.w--current").removeClass("w--current");

  // Update the UI with the new price
  updateVoiceTicketPrice();

  // Log the completion of the voice reset process
  console.log("Voice reset completed");
}

function resetSmsPrice() {
  const smsTicketsDropdown = document.querySelector("#sms-tickets");

  // Set the dropdown to "No SMS Tickets"
  smsTicketsDropdown.value = "Tier 0";

  // Log to confirm the dropdown value is set correctly
  console.log("SMS tickets dropdown reset to Tier 0");

  // Programmatically trigger the change event to ensure the UI updates
  const changeEvent = new Event("change", { bubbles: true });
  smsTicketsDropdown.dispatchEvent(changeEvent);

  // Add the is-hidden class to the SMS summary block
  $('[data-summary="sms"]').addClass("is-hidden");

  // Remove the w--current class from the dropdown
  $(".addons_dropdown-links.w--current").removeClass("w--current");

  // Update the UI with the new price
  updateSmsTicketPrice();

  // Log the completion of the SMS reset process
  console.log("SMS reset completed");
}

$('[data-summary="voice-remove"]').on("click", function () {
  console.log("Voice remove button clicked");
  resetVoicePrice(); // Call the voice reset function
});

$('[data-summary="sms-remove"]').on("click", function () {
  console.log("SMS remove button clicked");
  resetSmsPrice(); // Call the SMS reset function
});

// If the user selects sms Tier 0, hide the sms summary
smsTicketsSelect.addEventListener("change", function () {
  if (smsTicketsSelect.value === "Tier 0") {
    $(smsSummary).addClass("is-hidden");
  }
});

// If the user selects voice Tier 0, hide the voice summary
voiceTicketsSelect.addEventListener("change", function () {
  if (voiceTicketsSelect.value === "Tier 0") {
    $(voiceSummary).addClass("is-hidden");
  }
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
  let heroBtnLeft = $('[data-el="switch-btn-left"]');
  let heroBtnRight = $('[data-el="switch-btn-right"]');

  if (
    globalCurrentPlanName === "Starter" ||
    globalCurrentPlanName === "Basic"
  ) {
    $(".is-pro-logos").css("display", "flex");
    $(".is-advanced-logos").css("display", "none");
    $(".is-enterprise-logos").css("display", "none");
    $('[data-el="book-demo"]').css("display", "none");
    $('[data-el="start-free-trial"]').css("display", "block");

    // Update buttons
    heroBtnLeft.find("div:first").text("Start Free Trial");
    heroBtnLeft.attr("href", "/signup-2");
    heroBtnRight.find("div:first").text("Book a Demo");
    heroBtnRight.attr("href", "/demo");

    $(".pricing_card-wrapper").css("display", "flex");
    $(".pricing-step_banner").css("display", "flex");
    $(".pricing-step_banner.is-enterprise").css("display", "none");
  } else if (
    globalCurrentPlanName === "Advanced" ||
    globalCurrentPlanName === "Pro"
  ) {
    $(".is-pro-logos").css("display", "none");
    $(".is-advanced-logos").css("display", "flex");
    $(".is-enterprise-logos").css("display", "none");
    $('[data-el="book-demo"]').css("display", "block");
    $('[data-el="start-free-trial"]').css("display", "none");

    // Update buttons
    heroBtnLeft.find("div:first").text("Book a Demo");
    heroBtnLeft.attr("href", "/demo");
    heroBtnRight.find("div:first").text("Start Free Trial");
    heroBtnRight.attr("href", "/signup-2");

    $(".pricing_card-wrapper").css("display", "flex");
    $(".pricing-step_banner").css("display", "flex");
    $(".pricing-step_banner.is-enterprise").css("display", "none");
  } else if (globalCurrentPlanName === "Enterprise") {
    $(".is-pro-logos").css("display", "none");
    $(".is-advanced-logos").css("display", "none");
    $(".is-enterprise-logos").css("display", "flex");
    $(".pricing_card-wrapper").css("display", "none");
    $(".pricing-step_banner").css("display", "none");
    $(".pricing-step_banner.is-enterprise").css("display", "flex");
  }
}

var Webflow = Webflow || [];
Webflow.push(function () {
  // Initialize the ticket number input
  initTicketNumber();
  // Initialize the active plan element
  updateActivePlanElement();
  $(".more-tickets-cta").css("display", "none");

  setTimeout(() => {
    // Function to update the IDs and structure of text in the dropdown links
    document.querySelectorAll(".addons_dropdown-links").forEach((link) => {
      // Pass specific classes to distinguish between voice and SMS
      processText(link, "voice-link", "sms-link");
    });

    // Function to generate valid HTML IDs
    function generateValidId(text) {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove invalid characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with a single one
        .trim();
    }

    // Function to split text and assign IDs for Voice and SMS links
    function processText(element, voiceClass, smsClass) {
      const text = element.textContent.trim();

      if (text.includes("–")) {
        const [part1, part2] = text.split("–").map((part) => part.trim());
        element.innerHTML = `<span>${part1}</span> <span>${part2}</span>`;

        // Set IDs based on class
        const prefix = element.classList.contains(voiceClass)
          ? "voice-"
          : element.classList.contains(smsClass)
          ? "sms-"
          : "";

        // Assign valid ID to the element
        element.id = prefix + generateValidId(part1);
      }
    }

    // Handle dropdown toggle for voice tickets
    const voiceDropdownToggle = document.querySelector("#w-dropdown-toggle-14");
    if (voiceDropdownToggle) {
      processText(voiceDropdownToggle, "voice-link", "sms-link");
      const observer = new MutationObserver(() => {
        processText(voiceDropdownToggle, "voice-link", "sms-link");
      });
      observer.observe(voiceDropdownToggle, { childList: true, subtree: true });
    }

    // Handle dropdown toggle for SMS tickets
    const smsDropdownToggle = document.querySelector("#w-dropdown-toggle-15");
    if (smsDropdownToggle) {
      processText(smsDropdownToggle, "voice-link", "sms-link");
      const observer = new MutationObserver(() => {
        processText(smsDropdownToggle, "voice-link", "sms-link");
      });
      observer.observe(smsDropdownToggle, { childList: true, subtree: true });
    }
  }, 2000); // Delay execution by 2 seconds to ensure the DOM is ready
});
