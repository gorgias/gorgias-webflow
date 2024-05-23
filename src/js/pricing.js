// console.log("Hello I'm the new pricing script");

/****************************
 *
 * This script handles the UI and logic for the new pricing page.
 *
 ****************************/

/****************************
 *
 * GLOBAL VARIABLES
 *
 ****************************/
const toggle = $(".summary_toggle");
const toggleDot = $(".toggle_dot");
const monthlyRadio = $("#monthly");
const annualRadio = $("#annual");
let helpdeskPlan = $('[data-plan="helpdesk"]');
let automateTier = $('[data-plan="automate"]');
let voiceTier = $('[data-plan="voice"]');
let smsTier = $('[data-plan="sms"]');
let helpdeskPrice = $('[data-price="helpdesk"]');
let helpdeskPriceDisplay = $('[data-price="helpdesk-plan"]');
let automatePrice = $('[data-price="automate"]');
let voicePrice = $('[data-price="voice"]');
let smsPrice = $('[data-price="sms"]');
let enterpriseInfo = $('[data-info="enterprise"]');
const helpdeskSummary = $('[data-summary="helpdesk"]');
const automateSummary = $('[data-summary="automate"]');
const voiceSummary = $('[data-summary="voice"]');
const smsSummary = $('[data-summary="sms"]');
const summaryPlaceholder = $(".summary_placeholder");
const removeAutomate = $('[data-summary="automate-remove"]');
const frequency = $('[data-type="frequency"]');
let totalPrice = $('[data-price="total-price"]');
const ticketNumber = $('[data-range="ticket-number"]');
const automateNumber = $('[data-range="automate-number"]');
const slider = $('[data-el="range-slider"]');
const automateSlider = $('[data-el="automate-slider"]');
const helpdeskPlans = [
  ["Starter", 10, 0, 50],
  ["Basic", 60, 50, 300],
  ["Pro", 360, 301, 2000],
  ["Advanced", 900, 2001, 4999],
  ["Enterprise", "Contact us", 5000, Infinity],
];
const voiceTiers = [
  { range: "No Voice Tickets", tier: "Tier 0", price: 0 },
  { range: "Pay as you go", tier: "Pay as you go", price: 0 },
  { range: "0-24", tier: "Tier 1", price: 30 },
  { range: "25-74", tier: "Tier 2", price: 90 },
  { range: "75-149", tier: "Tier 3", price: 135 },
  { range: "150-249", tier: "Tier 4", price: 175 },
  { range: "250-499", tier: "Tier 5", price: 250 },
  { range: "500-999", tier: "Tier 6", price: 400 },
  { range: "999+", tier: "Tier 7", price: 0 },
];
const smsTiers = [
  { range: "No SMS Tickets", tier: "Tier 0", price: 0 },
  { range: "Pay as you go", tier: "Pay as you go", price: 0 },
  { range: "0-24", tier: "Tier 1", price: 20 },
  { range: "25-74", tier: "Tier 2", price: 60 },
  { range: "75-149", tier: "Tier 3", price: 90 },
  { range: "150-249", tier: "Tier 4", price: 140 },
  { range: "250-499", tier: "Tier 5", price: 216 },
  { range: "500-999", tier: "Tier 6", price: 408 },
  { range: "999+", tier: "Tier 7", price: 0 },
];
const planMin = $('[data-range="plan-min"]');
const planMax = $('[data-range="plan-max"]');
const helpdeskCTA = $('[data-button="helpdesk"]');
const automateCTA = $('[data-button="automate"]');
const automateSkipCTA = $('[data-button="automate-skip"]');
const voiceCTA = $('[data-button="voice"]');
const voiceSkipCTA = $('[data-button="voice-skip"]');
const smsCTA = $('[data-button="sms"]');
const smsSkipCTA = $('[data-button="sms-skip"]');
const tab1 = $('[data-link="tab1"]');
const tab2 = $('[data-link="tab2"]');
const tabLink1 = $(".tab-link_1");
const tabLink2 = $(".tab-link_2");
const tabLink3 = $(".tab-link_3");
let chosenPlanPrice;
let entryTickets = $("[data-type='customer-interact-without']");
let entryRate = document.getElementById("entryRate");

/****************************
 *
 * BUSINESS LOGIC
 *
 ****************************/

/** Function to find the appropriate helpdesk plan based on the number of tickets */
function updateHelpdeskPlan(tickets) {
  let selectedPlan = helpdeskPlans.find(
    (plan) => tickets >= plan[2] && (tickets <= plan[3] || plan[3] === Infinity)
  );
  if (!selectedPlan) {
    selectedPlan = ["No plan available", "", "", Infinity];
  }

  return selectedPlan;
}

/** Function to calculate the total price, applying discounts for annual plans */
function calculateTotalPrice(isAnnual) {
  let prices = [helpdeskPrice, automatePrice, voicePrice, smsPrice].map((p) =>
    parseFloat(p.text().replace(/[^\d.-]/g, ""))
  );

  if (isAnnual) {
    prices = prices.map((price) => price * (10 / 12));
  }
  let total = prices.reduce((sum, price) => sum + price, 0);

  return total;
}

/****************************
 *
 * UI UPDATE
 *
 ****************************/
/** Function to update the visible CTA group based on the selected helpdesk plan */
function updateCTAGroup(plan) {
  const starterCTAs = $(".starter-ctas");
  const basicCTAs = $(".basic-ctas");
  const proCTAs = $(".pro-ctas");
  const advancedCTAs = $(".advanced-ctas");
  const enterpriseCTAs = $(".enterprise-ctas");
  const helpdeskCTA = $('[data-button="helpdesk"]');
  const demoCTA = $(".demo-cta");

  // Reset display of all CTA groups
  starterCTAs.css("display", "none");
  basicCTAs.css("display", "none");
  proCTAs.css("display", "none");
  advancedCTAs.css("display", "none");
  enterpriseCTAs.css("display", "none");

  // Set display of the appropriate CTA group based on the selected plan
  switch (plan) {
    case "Starter":
      starterCTAs.css("display", "flex");
      helpdeskCTA.css("display", "flex");
      demoCTA.css("display", "none");
      enterpriseInfo.css("display", "none");
      break;
    case "Basic":
      basicCTAs.css("display", "flex");
      helpdeskCTA.css("display", "flex");
      demoCTA.css("display", "none");
      enterpriseInfo.css("display", "none");
      break;
    case "Pro":
      proCTAs.css("display", "flex");
      helpdeskCTA.css("display", "flex");
      demoCTA.css("display", "none");
      enterpriseInfo.css("display", "none");
      break;
    case "Advanced":
      advancedCTAs.css("display", "flex");
      helpdeskCTA.css("display", "flex");
      demoCTA.css("display", "none");
      enterpriseInfo.css("display", "none");
      break;
    case "Enterprise":
      enterpriseCTAs.css("display", "flex");
      helpdeskCTA.css("display", "none");
      demoCTA.css("display", "flex");
      enterpriseInfo.css("display", "inline-block");
      break;
    default:
      // Default to hiding all if no match
      starterCTAs.css("display", "none");
      basicCTAs.css("display", "none");
      proCTAs.css("display", "flex");
      advancedCTAs.css("display", "none");
      enterpriseCTAs.css("display", "none");
      enterpriseInfo.css("display", "none");
      break;
  }
}

// Ensure displayPlanDetails updates the helpdesk price correctly
function displayPlanDetails(planDetails) {
  // console.log("displayPlanDetails called with planDetails:", planDetails);
  const [plan, price, min, max] = planDetails;
  helpdeskPlan.text(plan);
  planMin.text(min === Infinity ? "more" : formatNumberWithCommas(min));
  planMax.text(max === Infinity ? "more" : formatNumberWithCommas(max));
  const formattedPrice =
    price === "Contact us" ? price : `$${formatNumberWithCommas(price)}/mo`;
  helpdeskPriceDisplay.text(formattedPrice);
  helpdeskPrice.text(formattedPrice);

  // Call updateCTAGroup to update the CTA group visibility based on the selected plan
  updateCTAGroup(plan);
  updateTotalPrice();
}

/** Function to update the total price displayed on the UI */
function displayTotalPrice(total) {
  // Check if the helpdesk price is "Contact us" indicating the Enterprise plan
  const isEnterprisePlan = helpdeskPrice.text() === "Contact us";

  // Elements for talk-to-sales and total-item
  const talkToSalesElement = $(".is-talk-to-sales");
  const totalItemElement = $(".summary_total");

  // If it's an Enterprise plan, show talk-to-sales and hide total-item
  if (isEnterprisePlan) {
    // talkToSalesElement.css("display", "block");
    totalItemElement.css("display", "none");
    totalPrice.text(" — ");
  } else {
    // talkToSalesElement.css("display", "none");
    totalItemElement.css("display", "flex");

    totalPrice.text(formatNumberWithCommas(total.toFixed(0)));
  }
}

/** Function to show/hide the automate alert based on automate number */
function checkAndDisplayAutomateAlert() {
  const automateAlert = $(".automate-alert");
  const value = parseInt(automateNumber.val(), 10);
  automateAlert.css("display", value < 30 ? "flex" : "none");
}

/** Function to sync ticket number input with entry tickets value */
function syncTicketNumberWithEntryTickets(initialValue) {
  const numericValue = parseInt(ticketNumber.val(), 10);
  entryTickets.val(isNaN(numericValue) ? 0 : numericValue);
  entryTickets.trigger("entryTicketsUpdated", [{ value: numericValue }]);
}

/** Function to sync the automate number with the entry rate */
function syncEntryRateWithAutomateNumber(initialValueAutomate) {
  let automateValue = automateNumber.val();
  if (entryRate) {
    entryRate.value = automateValue;
    entryRate.textContent = automateValue;
    $(entryRate).trigger("automateRateUpdated", [{ value: automateValue }]);
  }
}

/****************************
 *
 * EVENT HANDLERS & INITIALIZATION
 *
 ****************************/

document.addEventListener("DOMContentLoaded", () => {
  const initialValue = 1500; // Set the initial value for the ticket count.
  const initialValueAutomate = 0; // Set the initial value for the ticket count.

  slider.val(initialValue).trigger("input");
  ticketNumber.val(initialValue);

  automateSlider.val(initialValueAutomate).trigger("input");
  automateNumber.val(initialValueAutomate);
  $(automateSummary).css("display", "none");

  checkAndDisplayAutomateAlert();
  syncTicketNumberWithEntryTickets(initialValue);

  let planDetails = updateHelpdeskPlan(initialValue);
  let total = calculateTotalPrice(false);

  displayPlanDetails(planDetails);
  displayTotalPrice(total);

  const voiceTicketsElement = document.querySelector("#voice-tickets");
  const smsTicketsElement = document.querySelector("#sms-tickets");

  if (voiceTicketsElement) {
    voiceTicketsElement.addEventListener("change", displaySelectedVoicePrice);
  }

  if (smsTicketsElement) {
    smsTicketsElement.addEventListener("change", displaySelectedSmsPrice);
  }
});

// Handles helpdesk slider interactions
slider.on("input", function () {
  const val = parseInt(this.value, 10);
  // console.log("Slider input event fired with value:", val);

  if (isNaN(val)) {
    console.error("Invalid slider value:", this.value);
    return;
  }

  ticketNumber.val(val);
  const stepSize = val < 1000 ? 10 : val < 2500 ? 100 : 500;
  // console.log("Step size set to:", stepSize);
  slider.attr("step", stepSize);

  let planDetails = updateHelpdeskPlan(val);
  // console.log("Plan details found:", planDetails);

  if (!planDetails) {
    // console.error("No plan details found for value:", val);
    return;
  }

  displayPlanDetails(planDetails); // Ensure the price gets updated here

  updateTotalPrice();
  updateProgressBar(this);
  syncTicketNumberWithEntryTickets(val);
  syncEntryRateWithAutomateNumber();

  // console.log("Slider input handling completed.");
});

// Handles automate slider interactions
automateSlider.on("input", function () {
  const val = parseInt(this.value, 10);
  automateNumber.val(val);
  $(automateSummary).css("display", "flex");
  checkAndDisplayAutomateAlert();
  syncEntryRateWithAutomateNumber();
  updateAutomateProgressBar(this);
  updateTotalPrice();
});

// Toggle switch script
$(".summary_toggle").on("click", function () {
  // Check which radio button is currently selected
  const currentSelection = $('input[name="billingCycle"]:checked').val();
  // console.log("Current selection:", currentSelection);

  // Toggle to the opposite selection
  if (currentSelection === "monthly") {
    $("#annual").prop("checked", true).trigger("change");
    $(toggle).addClass("active");
    $(toggleDot).addClass("active");
  } else {
    $("#monthly").prop("checked", true).trigger("change");
    $(toggle).removeClass("active");
    $(toggleDot).removeClass("active");
  }

  updateTotalPrice();
});

// Update the radio button change event listener
$('input[name="billingCycle"]').change(function () {
  updateTotalPrice();

  // Update the active classes based on the selected billing cycle
  if ($(this).val() === "annual") {
    $(toggle).addClass("active");
    $(toggleDot).addClass("active");
  } else {
    $(toggle).removeClass("active");
    $(toggleDot).removeClass("active");
  }
});

/****************************
 *
 * UTILITIES
 *
 ****************************/

/** Function to format numbers with commas for better readability */
function formatNumberWithCommas(x) {
  // Convert to a number if it's not already one
  const number = parseFloat(x);
  if (isNaN(number)) return x; // Return the original value if conversion fails

  // Use toLocaleString with "en-US" for US-style commas
  return number.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/** Function to update the progress bar of a slider */
function updateProgressBar(slider) {
  const percentage =
    (100 * (slider.value - slider.min)) / (slider.max - slider.min);
  $(slider).css("--progress", `${percentage}%`);
}

/** Function to update the automate progress bar */
function updateAutomateProgressBar(automateSlider) {
  const value = parseInt(automateSlider.value, 10);
  const min = parseInt(automateSlider.min, 10);
  const max = parseInt(automateSlider.max, 10);
  const percentage = ((value - min) / (max - min)) * 100;
  $(automateSlider).css("--progress", `${percentage.toFixed(0)}%`);
  updateTotalPrice();
}

$(".support-tickets_cta").on("click", function () {
  // Find the value in the input .support-tickets_input
  const orders = parseInt($(".support-tickets_input").val(), 10);

  // Calculate the number of tickets based on the number of orders
  // Rule: On average, brands receive one support ticket for every 15 orders
  const tickets = Math.round(orders / 15);

  // Replace the number in the input with the calculated number
  $(".support-tickets_input").val(tickets);

  // Output the calculated tickets in .support-tickets_result-value element
  $(".support-tickets_result-value").text(tickets);

  // Show the result container
  $(".support-tickets_result").css("display", "block");

  // Set the value of the range slider to the calculated tickets value
  //slider.val(tickets).trigger("input");
  //ticketNumber.val(tickets); // Update the ticket number input as well

  // Trigger the slider's input event to recalculate the price and update the UI
  //slider.trigger("input");
});

// Debounce function
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Event listener for changes in the ticketNumber input (with debounce and blur)
ticketNumber
  .on("input", debounce(handleTicketNumberInput, 1500))
  .on("blur", handleTicketNumberInput);

function handleTicketNumberInput() {
  // Find the value in the input ticketNumber
  let tickets = parseInt($(this).val(), 10);

  // Validate the input to ensure it's a number
  if (isNaN(tickets)) {
    console.error("Invalid number of tickets");
    return;
  }

  // Set the value of the range slider to the calculated tickets value
  slider.val(tickets).trigger("input");

  // Trigger the slider's input event to recalculate the price and update the UI
  slider.trigger("input");
}

// Event listener for changes in the automateNumber input (with debounce and blur)
automateNumber
  .on("input", debounce(handleAutomateNumberInput, 1500))
  .on("blur", handleAutomateNumberInput);

function handleAutomateNumberInput() {
  // Find the value in the input automateNumber
  let automateValue = parseInt($(this).val(), 10);

  // Validate the input to ensure it's a number
  if (isNaN(automateValue)) {
    console.error("Invalid number of automate tickets");
    return;
  }

  // Set the value of the automate slider to the calculated automate value
  automateSlider.val(automateValue).trigger("input");

  // Trigger the automate slider's input event to recalculate the price and update the UI
  automateSlider.trigger("input");
}

/** Function to update total price when any related factor changes */
function updateTotalPrice() {
  const isAnnual = $('input[name="billingCycle"]:checked').val() === "annual";
  let total = calculateTotalPrice(isAnnual);
  displayTotalPrice(total);
}

/****************************
 *
 * EVENT LISTENERS
 *
 ****************************/

$(".full-list-trigger").on("click", function () {
  $(".features_modal-list").addClass("active");
});

$(".close-list-trigger").on("click", function () {
  $(".features_modal-list").removeClass("active");
});

$(".calculate-trigger").on("click", function () {
  $(".calculate_modal").addClass("active");
});

$(".close-calculate-trigger").on("click", function () {
  $(".calculate_modal").removeClass("active");
});

$(".active-modal-trigger").on("click", function () {
  $(this).closest(".active").removeClass("active");
});

let isProgrammaticClick = false;
let isFirstClick = true;

$(helpdeskCTA).on("click", function () {
  // Set the flag to true to indicate a programmatic click
  isProgrammaticClick = true;

  // Trigger the click event on tabLink2
  $(tabLink2).click();

  // Reset the flag after the click
  isProgrammaticClick = false;

  // Additional actions for the first helpdeskCTA click
  $(automateSummary).css("display", "flex");

  // Check if it's the first click
  if (isFirstClick) {
    isFirstClick = false; // Set the flag to false after the first click

    // Set the automate slider to 30% and trigger the input event
    const predefinedAutomationRate = 30;
    automateSlider.val(predefinedAutomationRate).trigger("input");

    // Update the automate number with the predefined rate
    automateNumber.val(predefinedAutomationRate);

    // Update the min value of the automate slider
    const newMinValue = 10; // Set this to your desired minimum value
    const rangeStyle = "--progress: 40%"; // Set range style
    automateSlider.attr("style", rangeStyle);
    automateSlider.attr("min", newMinValue);
  }

  // Recalculate the total price
  updateTotalPrice();
});

$(tabLink2).on("click", function () {
  // If the click is programmatic, do not execute the actions
  if (isProgrammaticClick) {
    return;
  }

  // Actions to execute when tabLink2 is clicked directly by the user
  $(automateSummary).css("display", "flex");

  // Get the current value of the automate slider
  const automateValue = parseInt(automateSlider.val(), 10);

  // Set the automate slider to the current value and trigger the input event
  automateSlider.val(automateValue).trigger("input");

  // Update the automate number with the current value
  automateNumber.val(automateValue);

  // Update the min value of the automate slider
  const newMinValue = 10; // Set this to your desired minimum value
  automateSlider.attr("min", newMinValue);

  // Calculate the progress percentage based on automateValue, min, and max
  const minValue = parseInt(automateSlider.attr("min"), 10);
  const maxValue = parseInt(automateSlider.attr("max"), 10);
  const progressPercentage =
    ((automateValue - minValue) / (maxValue - minValue)) * 100;
  const rangeStyle = `--progress: ${progressPercentage.toFixed(0)}%`; // Set range style
  automateSlider.attr("style", rangeStyle);

  // Recalculate the total price
  updateTotalPrice();
});

function updateButtonClasses() {
  $('[data-button="action-cta"]').each(function () {
    $(this).removeClass("button-secondary").addClass("button");
  });
}

function reverButtonClasses() {
  $('[data-button="action-cta"]').each(function () {
    $(this).removeClass("button").addClass("button-secondary");
  });
}

$(automateCTA).on("click", function () {
  // console.log("Automate CTA clicked");
  $(tabLink3).click();
  //Updates CTA style
  updateButtonClasses();
});

$(automateSkipCTA).on("click", function () {
  // console.log("Automate skip CTA clicked");
  $(tabLink3).click();

  // Set the automate slider and automate number to 0
  const zeroAutomationRate = 0;
  automateSlider.val(zeroAutomationRate).trigger("input");
  automateNumber.val(zeroAutomationRate);

  // Update the min value of the automate slider and reset the value
  const newMinValue = 0; // Set this to your desired minimum value
  automateSlider.attr("min", newMinValue);
  automateSlider.val(newMinValue); // Set the value again after changing min

  // Update automate price to 0
  automatePrice.text("0"); // Updated line to ensure it's calculated as zero

  // Calculate the percentage progress for the range slider
  const maxValue = parseInt(automateSlider.attr("max"), 10);
  const percentageProgress =
    ((newMinValue - newMinValue) / (maxValue - newMinValue)) * 100;
  const rangeStyle = `--progress: ${percentageProgress}%`;
  automateSlider.attr("style", rangeStyle);

  // Recalculate the total price with the updated automate price
  updateTotalPrice();

  $(automateSummary).css("display", "none");

  //Updates CTA style
  updateButtonClasses();
});

$(removeAutomate).on("click", function () {
  // Set the automate slider and automate number to 0
  const zeroAutomationRate = 0;
  automateSlider.val(zeroAutomationRate).trigger("input");
  automateNumber.val(zeroAutomationRate);

  // Update the min value of the automate slider and reset the value
  const newMinValue = 10; // Set this to your desired minimum value
  automateSlider.attr("min", newMinValue);
  automateSlider.val(newMinValue); // Set the value again after changing min

  // Update automate price to 0
  automatePrice.text("0"); // Updated line to ensure it's calculated as zero

  // Calculate the percentage progress for the range slider
  const maxValue = parseInt(automateSlider.attr("max"), 10);
  const percentageProgress =
    ((newMinValue - newMinValue) / (maxValue - newMinValue)) * 100;
  const rangeStyle = `--progress: ${percentageProgress}%`;
  automateSlider.attr("style", rangeStyle);

  // Recalculate the total price with the updated automate price
  updateTotalPrice();

  $(automateSummary).css("display", "none");

  //Updates CTA style
  updateButtonClasses();
});

// $(removeAutomate).on("click", function () {
//   // console.log("Automate skip CTA clicked");

//   // Set the automate slider and automate number to 0
//   const zeroAutomationRate = 0;
//   automateSlider.val(zeroAutomationRate).trigger("input");
//   automateNumber.val(zeroAutomationRate);

//   // Update the min value of the automate slider and reset the value
//   const newMinValue = 10; // Set this to your desired minimum value
//   automateSlider.attr("min", newMinValue);
//   automateSlider.val(newMinValue); // Set the value again after changing min

//   // Update automate price to 0
//   automatePrice.text("0"); // Updated line to ensure it's calculated as zero

//   // Calculate the percentage progress for the range slider
//   const maxValue = parseInt(automateSlider.attr("max"), 10);
//   const percentageProgress =
//     ((newMinValue - newMinValue) / (maxValue - newMinValue)) * 100;
//   const rangeStyle = `--progress: ${percentageProgress}%`;
//   automateSlider.attr("style", rangeStyle);

//   // Recalculate the total price with the updated automate price
//   updateTotalPrice();

//   $(automateSummary).css("display", "none");

//   //Updates CTA style
//   updateButtonClasses();
// });

$(tabLink1).on("click", function () {
  reverButtonClasses();
});

$(tabLink2).on("click", function () {
  reverButtonClasses();
});

/****************************
 *
 * FUNCTION TO FIND AND DISPLAY PRICES
 *
 ****************************/

// Function to find and display the price based on the selected voice tier
function displaySelectedVoicePrice() {
  const selectedVoice = document.querySelector("#voice-tickets").value;
  const tierVoice = voiceTiers.find((tier) => tier.tier === selectedVoice);
  const voiceDisplay = document.querySelector('[data-price="voice-plan"]');
  const voiceSummary = document.querySelector('[data-summary="voice"]');
  const voicePrice = document.querySelector('[data-price="voice"]');
  const voicePlan = document.querySelector('[data-plan="voice"');
  const voiceCustomBloc = $(".plan_custom-voice");
  const voicePriceBloc = $(".plan_price-voice");
  $(voiceSummary).css("display", "flex");
  const summaryPriceBlock = $(".summary_price-block-voice");
  const summaryPriceCustomVoice = $(".summary_price-custom-voice");
  const summaryPriceEmptyVoice = $(".summary_price-empty-voice");

  if (tierVoice && selectedVoice !== "Tier 8") {
    if (tierVoice && selectedVoice > "Tier 1") {
      voicePlan.textContent = selectedVoice;
    } else {
      voicePlan.textContent = " ";
    }
    voiceDisplay.textContent = `${tierVoice.price}`;
    voicePrice.textContent = `${tierVoice.price}`;
    voiceCustomBloc.css("display", "none");
    voicePriceBloc.css("display", "flex");

    // Additional UI handling for special tiers
    if (selectedVoice === "Pay as you go") {
      summaryPriceBlock.css("display", "none");
      summaryPriceCustomVoice.css("display", "none");
      summaryPriceEmptyVoice.css("display", "flex");
      voicePlan.textContent = "Pay as you go";
      voicePriceBloc.css("display", "none");
    } else if (selectedVoice === "Tier 7") {
      summaryPriceEmptyVoice.css("display", "none");
      summaryPriceBlock.css("display", "none");
      summaryPriceCustomVoice.css("display", "flex");
      voicePriceBloc.css("display", "none");
    } else if (selectedVoice === "Tier 0") {
      $(voiceSummary).css("display", "none");
      voicePriceBloc.css("display", "none");
    } else {
      summaryPriceEmptyVoice.css("display", "none");
      summaryPriceBlock.css("display", "flex");
      summaryPriceCustomVoice.css("display", "none");
    }
  } else {
    voicePlan.textContent = selectedVoice;
    voiceCustomBloc.css("display", "flex");
    voicePriceBloc.css("display", "none");
    summaryPriceBlock.css("display", "none");
    summaryPriceCustomVoice.css("display", "none");
    summaryPriceEmptyVoice.css("display", "none");
  }

  updateTotalPrice();
}

// Function to find and display the price based on the selected SMS tier
function displaySelectedSmsPrice() {
  const selectedSMS = document.querySelector("#sms-tickets").value;
  const tierSMS = smsTiers.find((tier) => tier.tier === selectedSMS);
  const smsDisplay = document.querySelector('[data-price="sms-plan"]');
  const smsSummary = document.querySelector('[data-summary="sms"]');
  const smsPrice = document.querySelector('[data-price="sms"]');
  const smsPlan = document.querySelector('[data-plan="sms"]');
  const smsCustomBloc = $(".plan_custom-sms");
  const smsPriceBloc = $(".plan_price-sms");
  const summaryPriceBlock = $(".summary_price-block-sms");
  const summaryPriceCustomSms = $(".summary_price-custom-sms");
  const summaryPriceEmptySms = $(".summary_price-empty-sms");

  $(smsSummary).css("display", "flex");

  if (tierSMS && selectedSMS !== "Tier 8") {
    if (tierSMS && selectedSMS > "Tier 1") {
      smsPlan.textContent = selectedSMS;
    } else {
      smsPlan.textContent = " ";
    }
    smsDisplay.textContent = `${tierSMS.price}`;
    smsPrice.textContent = `${tierSMS.price}`;
    smsCustomBloc.css("display", "none");
    smsPriceBloc.css("display", "flex");

    // Additional UI handling for special tiers
    if (selectedSMS === "Pay as you go") {
      summaryPriceBlock.css("display", "none");
      summaryPriceCustomSms.css("display", "none");
      summaryPriceEmptySms.css("display", "flex");
      smsPriceBloc.css("display", "none");
      smsPlan.textContent = "Pay as you go";
    } else if (selectedSMS === "Tier 7") {
      summaryPriceEmptySms.css("display", "none");
      summaryPriceBlock.css("display", "none");
      summaryPriceCustomSms.css("display", "flex");
      smsPriceBloc.css("display", "none");
    } else if (selectedSMS === "Tier 0") {
      smsPriceBloc.css("display", "none");
      $(smsSummary).css("display", "none");
    } else {
      summaryPriceEmptySms.css("display", "none");
      summaryPriceBlock.css("display", "flex");
      summaryPriceCustomSms.css("display", "none");
    }
  } else {
    smsPlan.textContent = selectedSMS;
    smsCustomBloc.css("display", "flex");
    smsPriceBloc.css("display", "none");
    summaryPriceBlock.css("display", "none");
    summaryPriceCustomSms.css("display", "none");
    summaryPriceEmptySms.css("display", "none");
  }

  updateTotalPrice();
}

/****************************
 *
 * RESET PRICE FUNCTION
 *
 ****************************/

function resetVoicePrice() {
  // Select the "No Voice Tickets" option
  const voiceTicketsDropdown = document.querySelector("#voice-tickets");
  voiceTicketsDropdown.value = "Tier 0"; // Set the dropdown to "No Voice Tickets"

  // Trigger a change event to update the displayed price and summary
  const event = new Event("change");
  voiceTicketsDropdown.dispatchEvent(event);

  // Hide Summary Element
  $(voiceSummary).css("display", "none");

  // Recalculate the total price with the updated voice price
  updateTotalPrice();
}

// Attach the function to the click event of all elements with data-summary="voice-remove"
const voiceRemoveElements = document.querySelectorAll(
  '[data-summary="voice-remove"]'
);
voiceRemoveElements.forEach((element) => {
  element.addEventListener("click", resetVoicePrice);
});

// Function to reset the SMS price
function resetSMSPrice() {
  // Select the "No SMS Tickets" option
  const smsTicketsDropdown = document.querySelector("#sms-tickets");
  smsTicketsDropdown.value = "Tier 0"; // Set the dropdown to "No SMS Tickets"

  // Trigger a change event to update the displayed price and summary
  const event = new Event("change");
  smsTicketsDropdown.dispatchEvent(event);

  // Hide Summary Element
  $('[data-summary="sms"]').css("display", "none");

  // Recalculate the total price with the updated SMS price
  updateTotalPrice();
}

// Attach the function to the click event of all elements with data-summary="sms-remove"
const smsRemoveElements = document.querySelectorAll(
  '[data-summary="sms-remove"]'
);
smsRemoveElements.forEach((element) => {
  element.addEventListener("click", resetSMSPrice);
});

// Handle UI and IDs for dropdown list links on Voice and SMS
document.addEventListener("DOMContentLoaded", function () {
  // Add a 2-second delay before running the script
  setTimeout(function () {
    // Select all elements with the class 'addons_dropdown-link'
    const links = document.querySelectorAll(".addons_dropdown-link");

    links.forEach((link) => {
      // Get the text inside the link element
      const text = link.textContent.trim();

      // Check if the text contains the '–'
      if (text.includes("–")) {
        // Split the text at the '–'
        const parts = text.split("–").map((part) => part.trim());

        // Create two span elements
        const span1 = document.createElement("span");
        const span2 = document.createElement("span");

        // Set the text for the spans
        span1.textContent = parts[0];
        span2.textContent = parts[1];

        // Clear the original link text
        link.textContent = "";

        // Append the spans to the link
        link.appendChild(span1);
        link.appendChild(document.createTextNode(" ")); // Add space between spans
        link.appendChild(span2);

        // Determine the prefix based on the class
        let prefix = "";
        if (link.classList.contains("voice-link")) {
          prefix = "voice-";
        } else if (link.classList.contains("sms-link")) {
          prefix = "sms-";
        }

        // Generate a valid ID from the text before '–'
        const id = generateValidId(parts[0]);
        link.id = prefix + id;
      }
    });

    // Function to generate a valid ID from a given string
    function generateValidId(text) {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove invalid characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with a single one
        .trim();
    }

    // Function to process text and split at '–'
    function processText(element) {
      const text = element.textContent.trim();

      // Check if the text contains the '–'
      if (text.includes("–")) {
        // Split the text at the '–'
        const parts = text.split("–").map((part) => part.trim());

        // Create two span elements
        const span1 = document.createElement("span");
        const span2 = document.createElement("span");

        // Set the text for the spans
        span1.textContent = parts[0];
        span2.textContent = parts[1];

        // Clear the original element text
        element.textContent = "";

        // Append the spans to the element
        element.appendChild(span1);
        element.appendChild(document.createTextNode(" ")); // Add space between spans
        element.appendChild(span2);

        // Determine the prefix based on the class
        let prefix = "";
        if (element.classList.contains("voice-ticket")) {
          prefix = "voice-";
        } else if (element.classList.contains("sms-ticket")) {
          prefix = "sms-";
        }

        // Generate a valid ID from the text before '–'
        const id = generateValidId(parts[0]);
        element.id = prefix + id;
      }
    }

    // Select the element with id 'w-dropdown-toggle-14'
    const dropdownToggle = document.querySelector("#w-dropdown-toggle-14");
    if (dropdownToggle) {
      // Process initially if necessary
      processText(dropdownToggle);

      // Add an observer to watch for changes to the dropdown toggle's text content
      const observer = new MutationObserver(() => {
        processText(dropdownToggle);
      });

      observer.observe(dropdownToggle, { childList: true, subtree: true });
    }
  }, 2000); // Change to 2000ms (2 seconds) delay
});

// console.log("Hello I'm the new pricing ROI calculator");

/****************************
 *
 * This script handles the ROI calculator modal for the new pricing page.
 *
 ****************************/

/****************************
 *
 * BASE VARIABLES
 *
 ****************************/

let nbMonthlyInteractions;
let automateRate;
const avgTimeWithout = 8.6;
const avgTimeWith = 6;
const avgCSMSalary = 35;
let billingCycle; // This should be set based on user input, e.g., "monthly" or "annual"

/****************************
 *
 * HTML ELEMENT VARIABLES
 * This is used to output calculation results
 *
 ****************************/

const agentTickets = document.getElementById("agentTickets");
const automatedTicketsEl = document.getElementById("automatedTickets");
const ticketsWithoutGorgias = document.getElementById("ticketsWithoutGorgias");
const supportTimeWithGorgias = document.getElementById("supportTimeWith");
const supportTimeWithoutGorgias = document.getElementById("supportTimeWithout");
const totalCostWithoutGorgias = document.getElementById(
  "totalCostWithoutGorgias"
);
const totalMonthlyCostWithoutGorgias = document.getElementById(
  "totalMonthlyCostWithoutGorgias"
);
const totalCostWithGorgiasEl = document.getElementById("totalCostWithGorgias");
const totalCostGorgias = document.getElementById("totalCostGorgias");
const totalCostGorgiasLabour = document.getElementById(
  "totalCostGorgiasLabour"
);
const timeSavedEl = document.getElementById("timeSaved");
const timeSavedSummary = document.getElementById("timeSavedSummary");
const moneySavedEl = document.getElementById("moneySaved");
const moneySavedSummary = document.getElementById("moneySavedSummary");
const percentageSavedEl = document.getElementById("percentageSaved");
const planPriceEl = document.getElementById("planPrice");
const tierPriceEl = document.getElementById("tierPrice");
const planNameEl = document.getElementById("planName");
const tierNameEl = document.getElementById("tierName");
let rangeslidervalue = document.getElementById("numberInteractions");
const calcTickets = document.querySelectorAll(
  '[data-type="customer-interact-without"]'
);

/****************************
 *
 * FUNCTIONS
 *
 ****************************/

// Utility function to format numbers with commas in the US style
function formatNumberWithCommas(value) {
  const number = parseFloat(value);
  if (isNaN(number)) return value;
  return number.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

document.addEventListener("DOMContentLoaded", function () {
  // Listen for custom event 'entryTicketsUpdated'
  $(document).on("entryTicketsUpdated", function (event, eventData) {
    // Call the processing function directly with the new value
    processTicketData(eventData.value);
  });

  // Listen for custom event 'automateRateUpdated'
  $(document).on("automateRateUpdated", function (event, eventData) {
    // Call the processing function directly with the new automate rate
    processTicketDataWithAutomateRate(eventData.value);
  });

  // Setup listener on calcTickets for user-initiated changes
  calcTickets.forEach((ticket) => {
    ticket.addEventListener("change", function (event) {
      processTicketData(this.value);
    });
  });
});

// Existing processTicketData function with the updated condition for moneySavedSummary
function processTicketData(value) {
  const originalTickets = parseInt(value, 10);
  const automateRate = parseFloat(entryRate.textContent) || 0;
  const automatedTickets = originalTickets * (automateRate / 100);
  const remainingTickets = originalTickets - automatedTickets;

  automatedTicketsEl.textContent = formatNumberWithCommas(automatedTickets);
  agentTickets.textContent = formatNumberWithCommas(remainingTickets);
  ticketsWithoutGorgias.textContent = formatNumberWithCommas(originalTickets);

  const helpdeskPlan = getHelpdeskPlan(originalTickets);
  const automateTier = getAutomateTier(automatedTickets);
  tierNameEl.textContent = automateTier.replace("tier ", "Tier ");

  const billingCycleElement = document.querySelector(
    'input[name="billingCycle"]:checked'
  );
  const billingCycle = billingCycleElement
    ? billingCycleElement.value
    : "monthly";

  const helpdeskPlanPrice = getHelpdeskPlanPrice(helpdeskPlan, billingCycle);
  const automateTierPrice = getAutomateTierPrice(automateTier, billingCycle);

  // Update the UI elements specifically for automate tier and price
  const automateSummaryElement = document.querySelector(
    '[data-summary="automate"]'
  );
  if (
    automateSummaryElement &&
    window.getComputedStyle(automateSummaryElement).display !== "none"
  ) {
    document.querySelector('[data-plan="automate"]').textContent =
      automateTier.replace("tier ", "Tier ");
    document.querySelector('[data-plan="tier-1"]').textContent =
      automateTier.replace("tier ", "Tier ");
    document.querySelector(
      '[data-range="automate-tickets-display"]'
    ).textContent = formatNumberWithCommas(automatedTickets);
    document.querySelector('[data-price="automate"]').textContent =
      formatNumberWithCommas(automateTierPrice);
    document.querySelector('[data-price="automate-tier"]').textContent =
      formatNumberWithCommas(automateTierPrice);
  }

  // cost with Gorgias
  const costGorgias = helpdeskPlanPrice + automateTierPrice;
  const supportTimeWith = remainingTickets * (avgTimeWith / 60);
  const costGorgiasLabour = supportTimeWith * avgCSMSalary;
  const totalCostWithGorgias = costGorgias + costGorgiasLabour;

  // without Gorgias
  const supportTimeWithout = originalTickets * (avgTimeWithout / 60);
  const totalHumanCostWithoutGorgias = supportTimeWithout * avgCSMSalary;
  const costWithoutGorgias = totalHumanCostWithoutGorgias;

  const timeSaved = (supportTimeWithout - supportTimeWith).toFixed(0);
  let moneySaved = costWithoutGorgias - totalCostWithGorgias;
  const percentageSaved = (moneySaved / costWithoutGorgias) * 100;

  // Update UI Elements for Time and Money Saved
  timeSavedEl.textContent = formatNumberWithCommas(timeSaved);
  timeSavedSummary.textContent = formatNumberWithCommas(timeSaved);

  // Update moneySavedSummary based on the condition, ensure no decimals are shown
  moneySaved = Math.max(moneySaved, 0); // Ensure moneySaved is non-negative
  moneySavedSummary.textContent = formatNumberWithCommas(moneySaved.toFixed(0));
  moneySavedEl.textContent = formatNumberWithCommas(moneySaved.toFixed(0));

  // Show/hide the .summary_automate-saving element based on moneySavedSummary
  const summaryAutomateSavingElement = $(".summary_automate-saving");
  if (moneySaved > 0) {
    summaryAutomateSavingElement.css("display", "flex");
  } else {
    summaryAutomateSavingElement.css("display", "none");
  }

  // Update the percentage saved element, ensuring a number is displayed correctly.
  percentageSavedEl.textContent = `${percentageSaved.toFixed(0)}`;

  // Update the UI with the calculated values
  updateUI(
    costWithoutGorgias,
    totalHumanCostWithoutGorgias,
    totalCostWithGorgias,
    costGorgias,
    costGorgiasLabour,
    supportTimeWithout,
    supportTimeWith,
    remainingTickets,
    helpdeskPlanPrice,
    automateTierPrice
  );
}

function processTicketDataWithAutomateRate(automateRate) {
  // Log the automate rate value received from the custom event
  const nbMonthlyInteractions = parseInt(
    $('[data-type="customer-interact-without"]').val(),
    10
  );
  processTicketData(nbMonthlyInteractions);
}

// Function to handle click events on radio buttons
function radioButtonClicked(event) {
  const billingCycle = event.target.value;

  const currentPlan = document
    .getElementById("planName")
    .textContent.toLowerCase();
  const currentTier = document
    .getElementById("tierName")
    .textContent.toLowerCase();

  const planPrice =
    parseFloat(getHelpdeskPlanPrice(currentPlan, billingCycle)) || 0;
  const tierPrice =
    parseFloat(getAutomateTierPrice(currentTier, billingCycle)) || 0;

  planPriceEl.textContent = formatNumberWithCommas(planPrice);
  tierPriceEl.textContent = formatNumberWithCommas(tierPrice);

  const totalGorgiasCost = planPrice + tierPrice;
  totalCostGorgias.textContent = formatNumberWithCommas(totalGorgiasCost);

  const totalCostWithGorgias = parseFloat(
    totalCostWithGorgiasEl.textContent.replace(/,/g, "")
  );
  const totalGorgiasLabourCost = parseFloat(
    totalCostWithGorgias - totalGorgiasCost
  );
  totalCostGorgiasLabour.textContent = formatNumberWithCommas(
    totalGorgiasLabourCost
  );

  const costWithoutGorgias = parseFloat(
    totalCostWithoutGorgias.textContent.replace(/,/g, "")
  );
  const moneySaved = costWithoutGorgias - totalGorgiasLabourCost;

  moneySavedEl.textContent = formatNumberWithCommas(moneySaved);
  moneySavedSummary.textContent = formatNumberWithCommas(moneySaved);

  // Call updateSavings to recalculate and update UI elements
  updateSavings(billingCycle === "annual");
}

function updateSavings(isAnnual) {
  const originalTickets = parseInt(rangeslidervalue.value, 10);
  const automateRate = parseFloat(entryRate.textContent) || 0;
  const automatedTickets = originalTickets * (automateRate / 100);
  const remainingTickets = originalTickets - automatedTickets;

  const helpdeskPlan = getHelpdeskPlan(originalTickets);
  const helpdeskPlanPrice = getHelpdeskPlanPrice(
    helpdeskPlan,
    isAnnual ? "annual" : "monthly"
  );
  const automateTier = getAutomateTier(automatedTickets);
  const automateTierPrice = getAutomateTierPrice(
    automateTier,
    isAnnual ? "annual" : "monthly"
  );

  // Cost with Gorgias
  const costGorgias = helpdeskPlanPrice + automateTierPrice;
  const supportTimeWith = remainingTickets * (avgTimeWith / 60);
  const costGorgiasLabour = supportTimeWith * avgCSMSalary;
  const totalCostWithGorgias = costGorgias + costGorgiasLabour;

  // Without Gorgias
  const supportTimeWithout = originalTickets * (avgTimeWithout / 60);
  const totalHumanCostWithoutGorgias = supportTimeWithout * avgCSMSalary;
  const costWithoutGorgias = totalHumanCostWithoutGorgias;

  const timeSaved = (supportTimeWithout - supportTimeWith).toFixed(0);
  let moneySaved = costWithoutGorgias - totalCostWithGorgias;
  const percentageSaved = (moneySaved / costWithoutGorgias) * 100;

  // Update UI Elements for Time and Money Saved
  timeSavedEl.textContent = formatNumberWithCommas(timeSaved);
  timeSavedSummary.textContent = formatNumberWithCommas(timeSaved);

  // Update moneySavedSummary based on the condition, ensure no decimals are shown
  moneySaved = Math.max(moneySaved, 0); // Ensure moneySaved is non-negative
  moneySavedSummary.textContent = formatNumberWithCommas(moneySaved.toFixed(0));
  moneySavedEl.textContent = formatNumberWithCommas(moneySaved.toFixed(0));

  // Show/hide the .summary_automate-saving element based on moneySavedSummary
  const summaryAutomateSavingElement = $(".summary_automate-saving");
  if (moneySaved > 0) {
    summaryAutomateSavingElement.css("display", "flex");
  } else {
    summaryAutomateSavingElement.css("display", "none");
  }

  // Update the percentage saved element, ensuring a number is displayed correctly.
  percentageSavedEl.textContent = `${percentageSaved.toFixed(0)}`;

  // Update the UI with the calculated values
  updateUI(
    costWithoutGorgias,
    totalHumanCostWithoutGorgias,
    totalCostWithGorgias,
    costGorgias,
    costGorgiasLabour,
    supportTimeWithout,
    supportTimeWith,
    remainingTickets,
    helpdeskPlanPrice,
    automateTierPrice
  );
}

function parsePrice(price) {
  if (price.startsWith("$")) {
    return parseFloat(price.substring(1));
  } else {
    return 0;
  }
}

function updateUI(
  costWithoutGorgias,
  totalHumanCostWithoutGorgias,
  totalCostWithGorgias,
  costGorgias,
  costGorgiasLabour,
  supportTimeWithout,
  supportTimeWith,
  remainingTickets,
  helpdeskPlanPrice,
  automateTierPrice
) {
  totalMonthlyCostWithoutGorgias.textContent =
    formatNumberWithCommas(costWithoutGorgias);
  totalCostWithoutGorgias.textContent = formatNumberWithCommas(
    totalHumanCostWithoutGorgias
  );
  totalCostWithGorgiasEl.textContent =
    formatNumberWithCommas(totalCostWithGorgias);
  totalCostGorgias.textContent = formatNumberWithCommas(costGorgias);
  helpdeskPrice.textContent = formatNumberWithCommas(helpdeskPlanPrice);
  totalCostGorgiasLabour.textContent =
    formatNumberWithCommas(costGorgiasLabour);

  supportTimeWithoutGorgias.textContent =
    formatNumberWithCommas(supportTimeWithout);
  supportTimeWithGorgias.textContent = formatNumberWithCommas(supportTimeWith);

  agentTickets.textContent = formatNumberWithCommas(remainingTickets);

  planPriceEl.textContent = formatNumberWithCommas(helpdeskPlanPrice);
  tierPriceEl.textContent = formatNumberWithCommas(automateTierPrice);
}

// Determines the correct helpdesk plan based on the number of agent tickets
function getHelpdeskPlan(originalTickets) {
  if (originalTickets <= 60) {
    return "starter";
  } else if (originalTickets <= 300) {
    return "basic";
  } else if (originalTickets <= 2000) {
    return "pro";
  } else if (originalTickets <= 4999) {
    return "advanced";
  } else if (originalTickets > 4999) {
    return "enterprise";
  }
}

// Determines the correct automate tier based on the number of automated tickets
function getAutomateTier(automatedTickets) {
  if (automatedTickets === 0) {
    return ""; // No automated tickets
  } else if (automatedTickets <= 30) {
    return "tier 1"; // Up to 30 automated tickets
  } else if (automatedTickets <= 190) {
    return "tier 2"; // Up to 190 automated tickets
  } else if (automatedTickets <= 530) {
    return "tier 3"; // Up to 530 automated tickets
  } else if (automatedTickets <= 1125) {
    return "tier 4"; // Up to 1125 automated tickets
  } else if (automatedTickets <= 2000) {
    return "tier 5"; // Up to 2000 automated tickets
  } else if (automatedTickets <= 3000) {
    return "tier 6"; // Up to 3000 automated tickets
  } else if (automatedTickets <= 5000) {
    return "tier 7"; // Up to 5000 automated tickets
  } else {
    return "tier 8"; // Over 5000 automated tickets
  }
}

// Retrieves the pricing for a given helpdesk plan and billing cycle
function getHelpdeskPlanPrice(plan, cycle) {
  const prices = {
    monthly: {
      starter: 10,
      basic: 60,
      pro: 360,
      advanced: 900,
      enterprise: "custom - contact us",
    },
    annual: {
      starter: "starter only available with monthly subscription",
      basic: 50,
      pro: 300,
      advanced: 750,
      enterprise: "custom - contact us",
    },
  };

  planNameEl.textContent = plan.charAt(0).toUpperCase() + plan.slice(1);

  return prices[cycle][plan] || "N/A";
}

// Retrieves the pricing for a given automate tier and billing cycle
function getAutomateTierPrice(tier, cycle) {
  const formattedTier = tier.toLowerCase().trim();
  const prices = {
    monthly: {
      "tier 1": 30,
      "tier 2": 180,
      "tier 3": 450,
      "tier 4": 900,
      "tier 5": 1500,
      "tier 6": 2100,
      "tier 7": 2500,
      "tier 8": "custom",
    },
    annual: {
      "tier 1": 25,
      "tier 2": 150,
      "tier 3": 375,
      "tier 4": 750,
      "tier 5": 1500,
      "tier 6": 2000,
      "tier 7": 3000,
      "tier 8": "custom",
    },
  };

  return prices[cycle][formattedTier] || 0;
}

// Attach click event listeners to each radio button
document.querySelectorAll('input[name="billingCycle"]').forEach((button) => {
  button.addEventListener("click", radioButtonClicked);
});

// Initialize data on page load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const initialValue = 1500;
    processTicketData(initialValue);
  }, 500);
});

const skipAutomate = document.querySelector('[data-button="automate-skip"]');
$(skipAutomate).on("click", function () {
  // $(".summary_automate-saving").css("display", "none");
});

console.log('Hello from the new pricing page!');