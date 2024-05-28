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
  } else if (automatedTickets <= 80) {
    return "tier 1B"; // Up to 80 automated tickets
  } else if (automatedTickets <= 120) {
    return "tier 1C"; // Up to 120 automated tickets
  } else if (automatedTickets <= 150) {
    return "tier 1D"; // Up to 150 automated tickets
  } else if (automatedTickets <= 190) {
    return "tier 2"; // Up to 190 automated tickets
  } else if (automatedTickets <= 360) {
    return "tier 2B"; // Up to 360 automated tickets
  } else if (automatedTickets <= 530) {
    return "tier 3"; // Up to 530 automated tickets
  } else if (automatedTickets <= 800) {
    return "tier 3B"; // Up to 800 automated tickets
  } else if (automatedTickets <= 1125) {
    return "tier 4"; // Up to 1125 automated tickets
  } else if (automatedTickets <= 1500) {
    return "tier 4B"; // Up to 1500 automated tickets
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
      "tier 1b": 80, 
      "tier 1c": 114,
      "tier 1d": 143,
      "tier 2": 180,
      "tier 2b": 306,
      "tier 3": 450,
      "tier 3b": 640,
      "tier 4": 900,
      "tier 4b": 1125,
      "tier 5": 1500,
      "tier 6": 2100,
      "tier 7": 2500,
      "tier 8": "custom",
    },
    annual: {
      "tier 1": 25,
      "tier 1b": 66, 
      "tier 1c": 95,
      "tier 1d": 119,
      "tier 2": 150,
      "tier 2b": 255,
      "tier 3": 375,
      "tier 3b": 533,
      "tier 4": 750,
      "tier 4b": 938,
      "tier 5": 1500,
      "tier 6": 2000,
      "tier 7": 3000,
      "tier 8": "custom",
    },
  };

  // Fetch the price, or default to 0 if not found
  const price = prices[cycle][formattedTier] || 0;

  return price;
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
