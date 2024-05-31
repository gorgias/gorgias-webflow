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
  ["Basic", 60, 51, 300],
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
  // Validate tickets input
  if (isNaN(tickets) || tickets < 0) {
    return ["No plan available", "", "", Infinity];
  }

  // Find the appropriate plan
  let selectedPlan = helpdeskPlans.find(
    (plan) => tickets >= plan[2] && (tickets <= plan[3] || plan[3] === Infinity)
  );

  // Default to "No plan available" if no match is found
  if (!selectedPlan) {
    selectedPlan = ["No plan available", "", "", Infinity];
  }

  return selectedPlan;
}

/** Function to calculate the total price, applying discounts for annual plans */
function calculateTotalPrice(isAnnual) {
  // Extract and parse prices
  let prices = [helpdeskPrice, automatePrice, voicePrice, smsPrice].map(
    (p) => parseFloat(p.text().replace(/[^\d.-]/g, "")) || 0
  );

  // Apply annual discount if applicable
  if (isAnnual) {
    prices = prices.map((price) => price * (10 / 12));
  }

  // Calculate total price
  return prices.reduce((sum, price) => sum + price, 0);
}

/****************************
 *
 * UI UPDATE
 *
 ****************************/
/** Function to update the visible CTA group based on the selected helpdesk plan */
function updateCTAGroup(plan) {
  // Define CTA groups and reset display
  const ctaGroups = {
    Starter: $(".starter-ctas"),
    Basic: $(".basic-ctas"),
    Pro: $(".pro-ctas"),
    Advanced: $(".advanced-ctas"),
    Enterprise: $(".enterprise-ctas")
  };

  Object.values(ctaGroups).forEach(cta => cta.css("display", "none"));
  const helpdeskCTA = $('[data-button="helpdesk"]');
  const demoCTA = $(".demo-cta");
  const enterpriseInfo = $('[data-info="enterprise"]');

  // Update display based on the selected plan
  if (plan in ctaGroups) {
    ctaGroups[plan].css("display", "flex");
    if (plan === "Enterprise") {
      helpdeskCTA.css("display", "none");
      demoCTA.css("display", "flex");
      enterpriseInfo.css("display", "inline-block");
    } else {
      helpdeskCTA.css("display", "flex");
      demoCTA.css("display", "none");
      enterpriseInfo.css("display", "none");
    }
  } else {
    ctaGroups.Pro.css("display", "flex");
  }
}


// Ensure displayPlanDetails updates the helpdesk price correctly
function displayPlanDetails(planDetails) {
  const [plan, price, min, max] = planDetails;
  const formattedMin = min === Infinity ? "+" : formatNumberWithCommas(min);
  const formattedMax = max === Infinity ? "+" : formatNumberWithCommas(max);
  const formattedPrice = price === "Contact us" ? price : `$${formatNumberWithCommas(price)}/mo`;

  helpdeskPlan.text(plan);
  planMin.text(formattedMin);
  planMax.text(formattedMax);
  helpdeskPriceDisplay.text(formattedPrice);
  helpdeskPrice.text(formattedPrice);

  updateCTAGroup(plan);
  updateTotalPrice();
}


/** Function to update the total price displayed on the UI */
function displayTotalPrice(total) {
  const isEnterprisePlan = helpdeskPrice.text() === "Contact us";
  const totalItemElement = $(".summary_total");
  const dashElement = $(".is-dash");

  if (isEnterprisePlan) {
    totalItemElement.css("display", "none");
    totalPrice.text(" — ");
    dashElement.css("display", "none");
  } else {
    totalItemElement.css("display", "flex");
    dashElement.css("display", "inline-block");
    totalPrice.text(formatNumberWithCommas(total.toFixed(0)));
  }
}


/** Function to show/hide the automate alert based on automate number */
function checkAndDisplayAutomateAlert() {
  const value = parseInt(automateNumber.val(), 10) || 0;
  $(".automate-alert").css("display", value < 30 ? "flex" : "none");
}


/** Function to sync ticket number input with entry tickets value */
function syncTicketNumberWithEntryTickets() {
  const numericValue = parseInt(ticketNumber.val(), 10) || 0;
  entryTickets.val(numericValue);
  entryTickets.trigger("entryTicketsUpdated", [{ value: numericValue }]);
}

/** Function to sync the automate number with the entry rate */
function syncEntryRateWithAutomateNumber() {
  const automateValue = automateNumber.val();
  if (entryRate) {
    entryRate.value = automateValue;
    entryRate.textContent = automateValue;
    $(entryRate).trigger("automateRateUpdated", [{ value: automateValue }]);
  }
}

/** Function to toggle back to monthly if we go bellow 60 tickets when on annual billing */
function toggleToMonthlyIfBelow60(tickets) {
  if ($('input[name="billingCycle"]:checked').val() === "annual" && tickets < 60) {
    $("#monthly").prop("checked", true).trigger("change");
    $(toggle).removeClass("active");
    $(toggleDot).removeClass("active");
  }
}

/****************************
 *
 * EVENT HANDLERS & INITIALIZATION
 *
 ****************************/


$('#monthly').prop('checked', true);
const initialValue = 1500; // Set the initial value for the ticket count.
const initialValueAutomate = 0; // Set the initial value for the ticket count.

slider.val(initialValue).trigger("input");
ticketNumber.val(initialValue);
updateProgressBar(slider[0]);


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

if (smsTicketsElement) {
  smsTicketsElement.addEventListener("change", displaySelectedSmsPrice);
}

// Handles helpdesk slider interactions
slider.on("input", function () {
  const val = parseInt(this.value, 10);
  if (isNaN(val)) {
    console.error("Invalid slider value:", this.value);
    return;
  }

  ticketNumber.val(val);
  slider.attr("step", val < 1000 ? 10 : val < 2500 ? 100 : 500);

  toggleToMonthlyIfBelow60(val);

  const planDetails = updateHelpdeskPlan(val);
  if (!planDetails) {
    console.error("No plan details found for value:", val);
    return;
  }

  displayPlanDetails(planDetails);
  updateTotalPrice();
  updateProgressBar(this);
  syncTicketNumberWithEntryTickets();
  syncEntryRateWithAutomateNumber();
});


// Handles automate slider interactions
automateSlider.on("input", function () {
  const val = parseInt(this.value, 10);
  if (isNaN(val)) {
    console.error("Invalid automate slider value:", this.value);
    return;
  }
  automateNumber.val(val);
  $(automateSummary).css("display", "flex");
  checkAndDisplayAutomateAlert();
  syncEntryRateWithAutomateNumber();
  updateAutomateProgressBar(this);
  updateTotalPrice();
});



// Toggle switch script
$(".summary_toggle").on("click", function () {
  // console.log("Toggle switch clicked");
  // Check which radio button is currently selected
  const currentSelection = $('input[name="billingCycle"]:checked').val();

  // console.log("Current selection:", currentSelection);

  // Get the current slider value
  const currentSliderValue = parseInt(slider.val(), 10);

  if (currentSliderValue < 60) {
    // Toggle to the opposite selection
    if (currentSelection === "monthly") {
      $("#annual").prop("checked", true).trigger("change");
      $(toggle).addClass("active");
      $(toggleDot).addClass("active");


      // Save the current slider value before changing it
      previousSliderValue = currentSliderValue;
      // console.log("Saved previous slider value:", previousSliderValue);

      // Set the slider value to 60 for the annual plan and trigger the input event
      const annualSliderValue = 60;

      // console.log("Setting slider value to 60 as it was below 60.");
      slider.val(annualSliderValue).trigger("input");
      ticketNumber.val(annualSliderValue); // Update the ticket number input as well

      // Call the necessary functions to update the UI
      let planDetails = updateHelpdeskPlan(annualSliderValue);
      displayPlanDetails(planDetails);

      syncTicketNumberWithEntryTickets(annualSliderValue);
      updateProgressBar(slider[0]);
    } else {
      $("#monthly").prop("checked", true).trigger("change");
      $(toggle).removeClass("active");
      $(toggleDot).removeClass("active");

      // Restore the previous slider value and trigger the input event
      // console.log("Restoring previous slider value:", previousSliderValue);
      slider.val(previousSliderValue).trigger("input");
      ticketNumber.val(previousSliderValue); // Update the ticket number input as well

      // Call the necessary functions to update the UI
      let planDetails = updateHelpdeskPlan(previousSliderValue);
      displayPlanDetails(planDetails);
      syncTicketNumberWithEntryTickets(previousSliderValue);
      updateProgressBar(slider[0]);

    }
  } else {
    // Toggle to the opposite selection without changing the slider value
    if (currentSelection === "monthly") {
      $("#annual").prop("checked", true).trigger("change");
      $(toggle).addClass("active");
      $(toggleDot).addClass("active");
    } else {
      $("#monthly").prop("checked", true).trigger("change");
      $(toggle).removeClass("active");
      $(toggleDot).removeClass("active");
    }
  }

  updateTotalPrice();
});


// Update the radio button change event listener
$('input[name="billingCycle"]').change(function () {
  // console.log("Radio button change event triggered");
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
  const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  $(slider).css("--progress", `${percentage}%`);
}


/** Function to update the automate progress bar */
function updateAutomateProgressBar(automateSlider) {
  const value = parseInt(automateSlider.value, 10) || 0;
  const min = parseInt(automateSlider.min, 10) || 0;
  const max = parseInt(automateSlider.max, 10) || 100;
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

  // Output the calculated tickets in .support-tickets_result-value element
  $(".support-tickets_result-value").text(tickets);

  // Show the result container
  $(".support-tickets_result").css("display", "block");
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
  // console.log("handleTicketNumberInput called");
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
  // console.log("handleAutomateNumberInput called");
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
  displayTotalPrice(calculateTotalPrice(isAnnual));
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
let isFirstTabLink2Click = true; // New flag to track first click on tabLink2
let hasOtherLinkBeenClicked = false; // Flag to track if any other link has been clicked

$(helpdeskCTA).on("click", function () {
  // console.log("helpdeskCTA clicked");
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

  // Mark that helpdeskCTA has been clicked
  hasOtherLinkBeenClicked = true;
});

$(tabLink2).on("click", function () {
  // console.log("tabLink2 clicked");
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

  // Additional condition for the first click on tabLink2
  if (isFirstTabLink2Click && !hasOtherLinkBeenClicked) {
    isFirstTabLink2Click = false; // Set the flag to false after the first click on tabLink2

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

    // Recalculate the total price
    updateTotalPrice();
  }
});

function updateButtonClasses() {
  // console.log("updateButtonClasses called");
  $('[data-button="action-cta"]').each(function () {
    $(this).removeClass("button-secondary").addClass("button");
  });
}

function reverButtonClasses() {
  // console.log("reverButtonClasses called");
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
  // console.log("removeAutomate clicked");
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
  const voicePlan = document.querySelector('[data-plan="voice"]');
  const voiceCustomBloc = $(".plan_custom-voice");
  const voicePriceBloc = $(".plan_price-voice");
  const summaryPriceBlock = $(".summary_price-block-voice");
  const summaryPriceCustomVoice = $(".summary_price-custom-voice");
  const summaryPriceEmptyVoice = $(".summary_price-empty-voice");

  $(voiceSummary).css("display", "flex");

  if (tierVoice && selectedVoice !== "Tier 8") {
    voicePlan.textContent = selectedVoice > "Tier 1" ? selectedVoice : " ";
    voiceDisplay.textContent = `${tierVoice.price}`;
    voicePrice.textContent = `${tierVoice.price}`;
    voiceCustomBloc.css("display", "none");
    voicePriceBloc.css("display", "flex");

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
    smsPlan.textContent = selectedSMS > "Tier 1" ? selectedSMS : " ";
    smsDisplay.textContent = `${tierSMS.price}`;
    smsPrice.textContent = `${tierSMS.price}`;
    smsCustomBloc.css("display", "none");
    smsPriceBloc.css("display", "flex");

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
  // console.log("resetVoicePrice called");
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
  // console.log("resetSMSPrice called");
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
// Add a 2-second delay before running the script
setTimeout(() => {
  // Select all elements with the class 'addons_dropdown-link'
  document.querySelectorAll(".addons_dropdown-link").forEach(link => {
    processText(link, 'voice-link', 'sms-link');
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
  function processText(element, voiceClass, smsClass) {
    const text = element.textContent.trim();

    // Check if the text contains the '–'
    if (text.includes("–")) {
      const [part1, part2] = text.split("–").map(part => part.trim());

      // Create and set text for span elements
      element.innerHTML = `<span>${part1}</span> <span>${part2}</span>`;

      // Determine the prefix based on the class
      const prefix = element.classList.contains(voiceClass) ? "voice-" :
                     element.classList.contains(smsClass) ? "sms-" : "";

      // Generate a valid ID from the text before '–'
      element.id = prefix + generateValidId(part1);
    }
  }

  // Select the element with id 'w-dropdown-toggle-14'
  const dropdownToggle = document.querySelector("#w-dropdown-toggle-14");
  if (dropdownToggle) {
    // Process initially if necessary
    processText(dropdownToggle, 'voice-ticket', 'sms-ticket');

    // Add an observer to watch for changes to the dropdown toggle's text content
    const observer = new MutationObserver(() => {
      processText(dropdownToggle, 'voice-ticket', 'sms-ticket');
    });

    observer.observe(dropdownToggle, { childList: true, subtree: true });
  }
}, 2000); // 2-second delay

