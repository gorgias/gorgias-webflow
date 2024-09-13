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
const voiceTicketsSelect = document.querySelector(`[data-target="voice-tickets"]`);
const smsTicketsSelect = document.querySelector(`[data-target="sms-tickets"]`);
const voiceSummary = document.querySelector(`[data-summary="voice"]`);
const smsSummary = document.querySelector(`[data-summary="sms"]`);
let chosenAutomatedTickets = document.querySelector(`[data-el="chosen-automated-tickets"]`);
let chosenHelpdeskTickets = document.querySelector(`[data-el="chosen-helpdesk-tickets"]`);

/****************************
 *
 * Global Functions
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

/****************************
 *
 * Step 1: Input Number of Tickets by User
 *
 ****************************/

// Global variable to store the number of tickets
let globalTicketNumber = 0;

// Function to update the display of .more-tickets-cta
function updateMoreTicketsCTA() {
  console.log("updateMoreTicketsCTA called, globalTicketNumber:", globalTicketNumber);
  if (globalTicketNumber >= 1500) {
    $(".more-tickets-cta").css("display", "flex");
  } else {
    $(".more-tickets-cta").css("display", "none");
  }
}

// Function to handle ticket range input and change events
$("#ticketRange, #ticketRange-2").on("input change", function () {
  // Parse the input value as an integer or set to 0 if invalid
  globalTicketNumber = parseInt($(this).val(), 10) || 0;

  // Log the current state
  console.log("Step 1: Number of tickets selected:", globalTicketNumber);

  // Update the ticket number in the DOM
  $('[data-el="ticketNumber"]').text(formatNumberWithCommas(globalTicketNumber));

  // Update the display of .more-tickets-cta
  updateMoreTicketsCTA();

  // After ticket input changes, trigger next steps
  if (globalCurrentPlanName === "Starter") {
    toggleMonthly();
  }

  // Ensure that plan selection is valid before proceeding
  determinePlan(globalTicketNumber);
  updateActivePlanElement();
  updateLogosAndCTAs();

  // Display alert
  displayAlert();

  // Check if a valid plan has been determined
  if (globalCurrentPlanName && chosenHelpdeskPrice > 0) {
    // Update prices, UI elements, and calculate the summary
    updatePricesOnBillingCycleChange();
    calculateSummary();
  } else {
    console.warn("No valid plan selected, skipping summary calculation.");
  }
});

// Handle click event on the more-tickets-cta button
$(".more-tickets-cta").on("click", function () {
  // Hide the lower graduation and show the higher graduation
  $(".range-slider_graduation.is-lower").css("display", "none");
  $(".range-slider_graduation.is-higher").css("display", "flex");
  $(this).remove();

  $(".pricing-step_range-module.is-lower").css("display", "none").remove();
  $(".pricing-step_range-module.is-higher").css("display", "flex");

  // Set the ticket number to 2500
  globalTicketNumber = 2500;

  // Update the ticket range input value
  $("#ticketRange-2").val(globalTicketNumber);

  // Update the ticket number in the DOM
  $('[data-el="ticketNumber"]').text(formatNumberWithCommas(globalTicketNumber));

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
    scrollToStep1();
  }
});

// Attach mouseup event to '.range-slider_track.is-pricing'
$(".range-slider_track.is-pricing").on("mouseup", function () {
  scrollToStep1();
});

// Function to scroll to #step-1
function scrollToStep1() {
  const scrollTarget = $("#step-1");
  if (scrollTarget.length) {
    console.log("Scrolling to #step-1");
    $("html, body").animate(
      {
        scrollTop: scrollTarget.offset().top - $(window).height() * -0.1, // Scroll with a 20% offset
      },
      400 // Scroll speed in milliseconds
    );
  } else {
    console.log("Element #step-1 not found");
  }
}

// Function to initialize at 1250 tickets on page load
function initTicketNumber() {
  // Set the ticket number to 1250
  globalTicketNumber = 1250;

  // Update the ticket range input values
  $("#ticketRange, #ticketRange-2").val(globalTicketNumber);

  // Update the ticket number in the DOM
  $('[data-el="ticketNumber"]').text(formatNumberWithCommas(globalTicketNumber));

  // Update the display of .more-tickets-cta
  updateMoreTicketsCTA();

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
  console.log("Switched to", billingCycle, "billing cycle");
  determinePlan(globalTicketNumber);
  displayAlert();
}

// Event listener for billing toggle radio buttons
$(".billing-toggle-radio").on("click", function () {
  if ($(this).hasClass("is-yearly")) {
    switchBillingCycle("yearly");
    console.log("Step 2: Switched to Yearly billing cycle");
  } else if ($(this).hasClass("is-monthly")) {
    switchBillingCycle("monthly");
    console.log("Step 2: Switched to Monthly billing cycle");
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
  // Hide all alerts initially
  $(".yearly-billing-alert, .monthly-billing-alert, .starter-billing-alert").css("display", "none");

  // Check for the conditions and show the appropriate alert
  if (globalBillingCycle === "yearly") {
    $(".yearly-billing-alert").css("display", "flex");
    $(".radio-wrap.billing-toggle-radio.is-yearly").removeClass("is-disabled");
    console.log("Displaying yearly billing alert");
  } else if (globalBillingCycle === "monthly" && globalCurrentPlanName === "Starter") {
    $(".starter-billing-alert").css("display", "flex");
    $(".radio-wrap.billing-toggle-radio.is-yearly").addClass("is-disabled");
    console.log("Displaying starter monthly billing alert");
  } else if (globalBillingCycle === "monthly" && globalCurrentPlanName !== "Starter") {
    $(".monthly-billing-alert").css("display", "flex");
    $(".radio-wrap.billing-toggle-radio.is-yearly").removeClass("is-disabled");
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

    console.log(
      `Checking Plan: ${plan.name}, Base Price: ${planCost}, Overage Tickets: ${overageTickets}, Overage Cost: ${overageCost}, Total Price: ${totalPrice}`
    );

    if (
      currentPlanIndex < plans.length - 1 &&
      totalPrice > plans[currentPlanIndex + 1].monthly_cost
    ) {
      currentPlanIndex++;
      applicablePlan = plans[currentPlanIndex];
    } else {
      break;
    }
  }

  globalCurrentPlanName = applicablePlan.name;
  globalCurrentPlanPrice = applicablePlan.monthly_cost;
  $('[data-el="planName"]').text(globalCurrentPlanName);

  console.log(
    "Step 3: Selected Plan -",
    globalCurrentPlanName,
    "| Base Price:",
    globalCurrentPlanPrice
  );

  if (
    previousPlanName === "Starter" &&
    globalCurrentPlanName !== "Starter" &&
    globalBillingCycle === "monthly"
  ) {
    console.log("Toggling to yearly due to plan change from 'Starter' and monthly billing.");
    toggleYearly();
  }

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
  const percentages = [0, 10, 20, 30];
  const automatePlansForCycle = automatePlans[globalBillingCycle];

  percentages.forEach((percentage) => {
    let automateTickets = Math.round(globalTicketNumber * (percentage / 100));
    let automatePrice = findAutomatePrice(automateTickets, automatePlansForCycle);

    // Update global variables dynamically
    window[`globalAutomateTickets${percentage}`] = automateTickets;
    window[`globalAutomatePrice${percentage}`] = automatePrice;

    // Update DOM elements
    if (percentage !== 0) {
      $('[data-el="automateTicketNumber' + percentage + '"]').text(
        formatNumberWithCommas(automateTickets)
      );
      $('[data-el="ticketNumber' + percentage + '"]').text(
        formatNumberWithCommas(globalTicketNumber - automateTickets)
      );
    }
  });

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
  const percentages = [0, 10, 20, 30];

  percentages.forEach((percentage) => {
    const automatePrice = window[`globalAutomatePrice${percentage}`];
    const optionPrice = globalCurrentPlanPrice + automatePrice;
    $('[data-el="helpdeskPrice' + percentage + '"]').text(optionPrice);

    console.log(`Option ${percentage}%: ${optionPrice}`);
  });
}

/****************************
 *
 * Step 6: Choosing a Plan
 *
 ****************************/

// Initialize selectedCardType to a default value
let selectedCardType = "pricingCard"; // Default value if no card is selected
let isProgrammaticClick = false; // Flag to track programmatic clicks

// Event listener for pricing card clicks
$('[data-el^="pricingCard"]').on("click", function () {
  // Store the selected card type
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

  // Find the chosen automation rate and display it
  const automationRate = selectedCardType.replace("pricingCard", "") || "0";
  $('[data-el="automationRate"]').text(automationRate);

  // Update chosenAutomatedTickets and chosenHelpdeskTickets
  const automateTickets = window[`globalAutomateTickets${automationRate}`] || 0;
  const helpdeskTickets = globalTicketNumber - automateTickets;

  chosenAutomatedTickets.textContent = formatNumberWithCommas(automateTickets);
  chosenHelpdeskTickets.textContent = formatNumberWithCommas(helpdeskTickets);

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

  let agentTicketsWithAutomate = globalTicketNumber;
  const percentage = selectedCardType.replace("pricingCard", "") || "0";
  const automateTickets = window[`globalAutomateTickets${percentage}`] || 0;
  agentTicketsWithAutomate = globalTicketNumber - automateTickets;

  // Ensure agent tickets are a valid number
  if (isNaN(agentTicketsWithAutomate)) {
    console.error("Invalid agent ticket number");
    return;
  }

  // Calculate total support time and costs
  const totalSupportTimeWithoutGorgias = (globalTicketNumber * avgTimePerTicketWithoutGorgias) / 60;
  const totalHumanCostWithoutGorgias = totalSupportTimeWithoutGorgias * avgSupportSalary;

  const totalSupportTimeWithGorgias = (agentTicketsWithAutomate * avgTimePerTicketWithGorgias) / 60;
  const totalHumanCostWithGorgias = totalSupportTimeWithGorgias * avgSupportSalary;

  const totalGorgiasCost = chosenHelpdeskPrice + chosenAutomatePrice;

  const timeSaved = totalSupportTimeWithoutGorgias - totalSupportTimeWithGorgias;
  const moneySaved = totalHumanCostWithoutGorgias - (totalHumanCostWithGorgias + totalGorgiasCost);

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
    updateChosenPrices();
    calculateSummary();
    calculateROISavings();
  }, 100);
}

/****************************
 *
 * Function to Update Chosen Prices Based on Selected Card Type
 *
 ****************************/

function updateChosenPrices() {
  console.log("Updating prices for selected card:", selectedCardType);

  const percentage = selectedCardType.replace("pricingCard", "") || "0";
  chosenHelpdeskPrice = globalCurrentPlanPrice;
  chosenAutomatePrice = window[`globalAutomatePrice${percentage}`];

  // Check if automation is 0% and hide or show the automate summary
  if (percentage === "0") {
    $('[data-summary="automate"]').css("display", "none");
    console.log("Automation is 0%, hiding automate summary.");
  } else {
    $('[data-summary="automate"]').css("display", "flex");
    console.log("Automation is not 0%, displaying automate summary.");
  }

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
let voiceTicketPrice = 0;
let smsTicketPrice = 0;

// Function to calculate and update the summary total
function calculateSummary() {
  if (!chosenHelpdeskPrice || chosenHelpdeskPrice === 0) {
    console.warn("No plan has been selected yet.");
    return;
  }

  const summaryTotal = chosenHelpdeskPrice + chosenAutomatePrice + voiceTicketPrice + smsTicketPrice;
  const formattedTotal = formatNumberWithCommas(summaryTotal.toFixed(0));

  $('[data-el="summaryTotalPrice"]').text(formattedTotal);
  console.log("Updated DOM with formatted summary total:", formattedTotal);
}

/****************************
 *
 * Step 8: Update Active Plan Element
 *
 ****************************/

function updateActivePlanElement() {
  const planElements = document.querySelectorAll("[g-col-highlight]");
  planElements.forEach((element) => {
    if (element.getAttribute("g-col-highlight").toLowerCase() === globalCurrentPlanName.toLowerCase()) {
      element.classList.add("is-active");
      console.log("Highlight updated");
    } else {
      element.classList.remove("is-active");
    }
  });
}

/****************************
 *
 * Selecting and calculating voice and SMS tickets
 *
 ****************************/

// Function to calculate the price of the voice tickets
function calculateAddonTicketPrice(selectedTier, planType, tiers) {
  const selectedPlan = tiers[planType].find((tier) => tier.tier === selectedTier);
  return selectedPlan ? selectedPlan.price : 0;
}

// Function to update the UI with voice ticket prices
function updateVoiceTicketPrice() {
  const selectedTier = voiceTicketsSelect.value;
  const planType = globalBillingCycle;
  voiceTicketPrice = calculateAddonTicketPrice(selectedTier, planType, voiceTiers);

  // Update visibility and content
  updateAddonUI("voice", selectedTier, voiceTicketPrice);
}

// Function to update the UI with SMS ticket prices
function updateSmsTicketPrice() {
  const selectedTier = smsTicketsSelect.value;
  const planType = globalBillingCycle;
  smsTicketPrice = calculateAddonTicketPrice(selectedTier, planType, smsTiers);

  // Update visibility and content
  updateAddonUI("sms", selectedTier, smsTicketPrice);
}

// Function to update addon UI elements
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
  console.log(`Updated UI with ${addonType} ticket price: ${ticketPrice}`);

  calculateSummary();
}

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
 ****************************/

// Handle clicks on remove buttons
$('[data-summary="helpdesk-remove"]').on("click", function () {
  // Hide plan summary and show no-selection message
  $(".plan_summary-layout").css("display", "none");
  $(".plan_no-selection").css("display", "flex");

  // Disable radio buttons and deselect pricing cards
  $(".code-radio").addClass("is-inactive");
  $(".pricing_card").removeClass("is-selected");

  // Reset summary total price to "0,000"
  $('[data-el="summaryTotalPrice"]').text("0,000");

  // Reset chosen helpdesk and automate prices
  chosenHelpdeskPrice = 0;
  chosenAutomatePrice = 0;
});

$('[data-summary="automate-remove"]').on("click", function () {
  isProgrammaticClick = true;
  const defaultPricingCard = document.querySelector('[data-el="pricingCard"]');
  if (defaultPricingCard) {
    console.log("Simulating click on default pricing card for 0% automation");
    defaultPricingCard.click();
  } else {
    console.error("No pricing card found for default automation (0%)");
  }
  setTimeout(() => {
    isProgrammaticClick = false;
  }, 0);
});

// Function to reset addon price
function resetAddonPrice(addon) {
  const addonTicketsDropdown = document.querySelector(`#${addon}-tickets`);

  // Set the dropdown to "Tier 0"
  addonTicketsDropdown.value = "Tier 0";
  console.log(`${addon.toUpperCase()} tickets dropdown reset to Tier 0`);

  // Programmatically trigger the change event
  const changeEvent = new Event("change", { bubbles: true });
  addonTicketsDropdown.dispatchEvent(changeEvent);

  // Hide the addon summary block
  $(`[data-summary="${addon}"]`).addClass("is-hidden");

  // Remove the current class from the dropdown
  $(".addons_dropdown-links.w--current").removeClass("w--current");

  // Update the UI with the new price
  if (addon === "voice") {
    updateVoiceTicketPrice();
  } else if (addon === "sms") {
    updateSmsTicketPrice();
  }

  console.log(`${addon.toUpperCase()} reset completed`);
}

$('[data-summary="voice-remove"]').on("click", function () {
  console.log("Voice remove button clicked");
  resetAddonPrice("voice");
});

$('[data-summary="sms-remove"]').on("click", function () {
  console.log("SMS remove button clicked");
  resetAddonPrice("sms");
});

// Hide summaries if Tier 0 is selected
smsTicketsSelect.addEventListener("change", function () {
  if (smsTicketsSelect.value === "Tier 0") {
    $(smsSummary).addClass("is-hidden");
  }
});

voiceTicketsSelect.addEventListener("change", function () {
  if (voiceTicketsSelect.value === "Tier 0") {
    $(voiceSummary).addClass("is-hidden");
  }
});

/***************************
 *
 * Update UI elements
 *
 *************************/

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

var Webflow = Webflow || [];
Webflow.push(function () {
  // Initialize the ticket number input
  initTicketNumber();
  // Initialize the active plan element
  updateActivePlanElement();

  setTimeout(() => {
    // Function to generate valid HTML IDs
    function generateValidId(text) {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    // Function to process text and assign IDs for Voice and SMS links
    function processText(element, voiceClass, smsClass) {
      const text = element.textContent.trim();

      if (text.includes("–")) {
        const [part1, part2] = text.split("–").map((part) => part.trim());
        element.innerHTML = `<span>${part1}</span> <span>${part2}</span>`;

        const prefix = element.classList.contains(voiceClass)
          ? "voice-"
          : element.classList.contains(smsClass)
          ? "sms-"
          : "";

        element.id = prefix + generateValidId(part1);
      }
    }

    // Update the IDs and structure of text in the dropdown links
    document.querySelectorAll(".addons_dropdown-links").forEach((link) => {
      processText(link, "voice-link", "sms-link");
    });

    // Handle dropdown toggles for voice and SMS tickets
    ["#w-dropdown-toggle-14", "#w-dropdown-toggle-15"].forEach((selector) => {
      const dropdownToggle = document.querySelector(selector);
      if (dropdownToggle) {
        processText(dropdownToggle, "voice-link", "sms-link");
        const observer = new MutationObserver(() => {
          processText(dropdownToggle, "voice-link", "sms-link");
        });
        observer.observe(dropdownToggle, { childList: true, subtree: true });
      }
    });
  }, 2000);
});