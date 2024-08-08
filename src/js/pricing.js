var Webflow = Webflow || [];
Webflow.push(function () {
  // Get references to HTML elements for ticket range, automate range, plan type toggle, and voice and SMS tickets select
  const ticketRange = document.getElementById("ticketRange");
  const automateRange = document.getElementById("automateRange");
  const monthlyPlanRadio = document.getElementById("monthlyPlan");
  const annualPlanRadio = document.getElementById("annualPlan");
  const voiceTicketsSelect = document.querySelector(
    `[data-target="voice-tickets"]`
  );
  const smsTicketsSelect = document.querySelector(
    `[data-target="sms-tickets"]`
  );

  // These are console logs to check the values of the elements
  // console.log("ticketRange:", ticketRange);
  // console.log("automateRange:", automateRange);
  // console.log("monthlyPlanRadio:", monthlyPlanRadio);
  // console.log("annualPlanRadio:", annualPlanRadio);
  // console.log("voiceTicketsSelect:", voiceTicketsSelect);
  // console.log("smsTicketsSelect:", smsTicketsSelect);


  // Elements that change visibility based on the selected plan
  const elementsToToggle = {
    automate: $('[data-summary="automate"]'),
    voice: $('[data-summary="voice"]'),
    sms: $('[data-summary="sms"]'),
  };

  // Store initial display states
  const initialDisplayStates = {};
  for (const [key, element] of Object.entries(elementsToToggle)) {
    initialDisplayStates[key] = element.css("display");
  }

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
        cost_per_ticket: 0.2,
        cost_per_overage_ticket: 0.4,
      },
      {
        name: "Basic",
        tickets_per_month: 300,
        monthly_cost: 60,
        cost_per_ticket: 0.2,
        cost_per_overage_ticket: 0.4,
      },
      {
        name: "Pro",
        tickets_per_month: 2000,
        monthly_cost: 360,
        cost_per_ticket: 0.18,
        cost_per_overage_ticket: 0.36,
      },
      {
        name: "Advanced",
        tickets_per_month: 5000,
        monthly_cost: 900,
        cost_per_ticket: 0.18,
        cost_per_overage_ticket: 0.36,
      },
      {
        name: "Enterprise",
        tickets_per_month: 10000,
        monthly_cost: 1600,
        cost_per_ticket: 0.16,
        cost_per_overage_ticket: 0.32,
      },
    ],
    yearly: [
      {
        name: "Starter",
        tickets_per_month: 50,
        monthly_cost: 8,
        cost_per_ticket: 0.17,
        cost_per_overage_ticket: 0.4,
      },
      {
        name: "Basic",
        tickets_per_month: 300,
        monthly_cost: 50,
        cost_per_ticket: 0.17,
        cost_per_overage_ticket: 0.4,
      },
      {
        name: "Pro",
        tickets_per_month: 2000,
        monthly_cost: 300,
        cost_per_ticket: 0.15,
        cost_per_overage_ticket: 0.36,
      },
      {
        name: "Advanced",
        tickets_per_month: 5000,
        monthly_cost: 750,
        cost_per_ticket: 0.15,
        cost_per_overage_ticket: 0.36,
      },
      {
        name: "Enterprise",
        tickets_per_month: 10000,
        monthly_cost: 1333,
        cost_per_ticket: 0.13,
        cost_per_overage_ticket: 0.32,
      },
    ],
  };

  // Define the automate plans
  const automatePlans = {
    monthly: [
      {
        name: "Tier 0",
        interactions_per_month: 0,
        monthly_cost: 0,
        cost_per_overage_interaction: 0,
      },
      {
        name: "Tier 1",
        interactions_per_month: 30,
        monthly_cost: 30,
        cost_per_overage_interaction: 2.0,
      },
      {
        name: "Tier 1B",
        interactions_per_month: 80,
        monthly_cost: 80,
        cost_per_overage_interaction: 2.0,
      },
      {
        name: "Tier 1C",
        interactions_per_month: 120,
        monthly_cost: 114,
        cost_per_overage_interaction: 1.9,
      },
      {
        name: "Tier 1D",
        interactions_per_month: 150,
        monthly_cost: 143,
        cost_per_overage_interaction: 1.9,
      },
      {
        name: "Tier 2",
        interactions_per_month: 190,
        monthly_cost: 180,
        cost_per_overage_interaction: 1.9,
      },
      {
        name: "Tier 2B",
        interactions_per_month: 360,
        monthly_cost: 306,
        cost_per_overage_interaction: 1.7,
      },
      {
        name: "Tier 3",
        interactions_per_month: 530,
        monthly_cost: 450,
        cost_per_overage_interaction: 1.7,
      },
      {
        name: "Tier 3B",
        interactions_per_month: 800,
        monthly_cost: 640,
        cost_per_overage_interaction: 1.6,
      },
      {
        name: "Tier 4",
        interactions_per_month: 1125,
        monthly_cost: 900,
        cost_per_overage_interaction: 1.6,
      },
      {
        name: "Tier 4B",
        interactions_per_month: 1500,
        monthly_cost: 1125,
        cost_per_overage_interaction: 1.5,
      },
      {
        name: "Tier 5",
        interactions_per_month: 2000,
        monthly_cost: 1500,
        cost_per_overage_interaction: 1.5,
      },
      {
        name: "Tier 6",
        interactions_per_month: 3000,
        monthly_cost: 2100,
        cost_per_overage_interaction: 1.4,
      },
      {
        name: "Tier 7",
        interactions_per_month: 5000,
        monthly_cost: 2500,
        cost_per_overage_interaction: 1.0,
      },
      {
        name: "Tier 8",
        interactions_per_month: 7000,
        monthly_cost: 3500,
        cost_per_overage_interaction: 1.0,
      },
    ],
    yearly: [
      {
        name: "Tier 0",
        interactions_per_month: 0,
        monthly_cost: 0,
        cost_per_overage_interaction: 0,
      },
      {
        name: "Tier 1",
        interactions_per_month: 30,
        monthly_cost: 25,
        cost_per_overage_interaction: 1.67,
      },
      {
        name: "Tier 1B",
        interactions_per_month: 80,
        monthly_cost: 67,
        cost_per_overage_interaction: 1.67,
      },
      {
        name: "Tier 1C",
        interactions_per_month: 120,
        monthly_cost: 95,
        cost_per_overage_interaction: 1.58,
      },
      {
        name: "Tier 1D",
        interactions_per_month: 150,
        monthly_cost: 119,
        cost_per_overage_interaction: 1.58,
      },
      {
        name: "Tier 2",
        interactions_per_month: 190,
        monthly_cost: 150,
        cost_per_overage_interaction: 1.58,
      },
      {
        name: "Tier 2B",
        interactions_per_month: 360,
        monthly_cost: 255,
        cost_per_overage_interaction: 1.42,
      },
      {
        name: "Tier 3",
        interactions_per_month: 530,
        monthly_cost: 375,
        cost_per_overage_interaction: 1.42,
      },
      {
        name: "Tier 3B",
        interactions_per_month: 800,
        monthly_cost: 533,
        cost_per_overage_interaction: 1.33,
      },
      {
        name: "Tier 4",
        interactions_per_month: 1125,
        monthly_cost: 750,
        cost_per_overage_interaction: 1.33,
      },
      {
        name: "Tier 4B",
        interactions_per_month: 1500,
        monthly_cost: 938,
        cost_per_overage_interaction: 1.25,
      },
      {
        name: "Tier 5",
        interactions_per_month: 2000,
        monthly_cost: 1250,
        cost_per_overage_interaction: 1.25,
      },
      {
        name: "Tier 6",
        interactions_per_month: 3000,
        monthly_cost: 1750,
        cost_per_overage_interaction: 1.17,
      },
      {
        name: "Tier 7",
        interactions_per_month: 5000,
        monthly_cost: 2083,
        cost_per_overage_interaction: 0.83,
      },
      {
        name: "Tier 8",
        interactions_per_month: 7000,
        monthly_cost: 2917,
        cost_per_overage_interaction: 0.83,
      },
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
   * HELPER FUNCTIONS
   *
   ****************************/

  // Disable console.logs for production
  console.log = function () {};

  // Function to format numbers with commas for better readability
  function formatNumberWithCommas(x) {
    const number = parseFloat(x);
    if (isNaN(number)) return x; // Return the original value if conversion fails
    return number.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  // Function to get data-value from a data-target attribute
  function getDataValue(target) {
    const element = document.querySelector(`[data-target="${target}"]`);
    return element ? parseFloat(element.getAttribute("data-value")) : 0;
  }

  // Function to update all elements with a specific data-target attribute
  function updateElements(attribute, value) {
    const formattedValue = formatNumberWithCommas(value);
    const elements = document.querySelectorAll(`[data-target="${attribute}"]`);
    elements.forEach((element) => {
      element.textContent = formattedValue;
      element.setAttribute("data-raw-value", value);
    });
  }

  $(".support-tickets_cta").on("click", function () {
    const orders = parseInt($(".support-tickets_input").val(), 10);
    const tickets = Math.round(orders / 15);
    $(".support-tickets_result-value").text(tickets);
    $(".support-tickets_result").css("display", "block");
  });

  function updateTotalCostDisplay(planName, totalCost) {
    if (planName === "Enterprise") {
      updateElements("totalCost", "Contact us");
      $('[data-price="helpdesk"]').css("display", "none");
      $(".helpdesk_card-price").css("display", "none");
    } else {
      updateElements("totalCost", totalCost.toFixed(0));
      $('[data-price="helpdesk"]').css("display", "inline");
      $(".helpdesk_card-price").css("display", "inline");
    }
  }

  // Function to update the monthly_costs without Gorgias
  function updateMonthlyCostsWithoutGorgias() {
    const avgTimePerTicket = getDataValue("avgTimePerTicket"); // minutes
    const avgSupportSalary = getDataValue("avgSupportSalary"); // $/hour

    console.log("avgTimePerTicket:", avgTimePerTicket);
    console.log("avgSupportSalary:", avgSupportSalary);

    const number_of_tickets = parseInt(ticketRange.value, 10); // Get the number of tickets from the range input
    console.log("number_of_tickets:", number_of_tickets);

    // Calculate total support time in hours
    const totalSupportTimeInHours = (number_of_tickets * avgTimePerTicket) / 60;
    console.log("totalSupportTimeInHours:", totalSupportTimeInHours);

    // Calculate total human cost
    const totalHumanCost = totalSupportTimeInHours * avgSupportSalary;
    console.log("totalHumanCost:", totalHumanCost);

    // Update the UI elements
    updateElements("totalSupportTime", `${totalSupportTimeInHours.toFixed(0)}`);
    updateElements("totalHumanCost", `${totalHumanCost.toFixed(0)}`);
  }

  // Function to update progress bar based on slider value
  function updateProgressBar(slider) {
    const percentage =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty("--progress", `${percentage}%`);
  }

  // Function to attach event listener to update progress bar on input change
  function attachProgressBarUpdate(slider) {
    updateProgressBar(slider);
    slider.addEventListener("input", () => updateProgressBar(slider));
  }

  /****************************
   *
   * PRICE CALCULATIONS
   *
   ****************************/

  // Function to calculate the price of the helpdesk plan
  function calculatePrice(number_of_tickets, planType) {
    const plans = helpdeskPlans[planType];
    let currentPlanIndex = 0;
    let applicablePlan = plans[currentPlanIndex];
    let planCost = 0;
    let overageCost = 0;

    while (currentPlanIndex < plans.length) {
      const plan = plans[currentPlanIndex];
      const overageTickets = number_of_tickets - plan.tickets_per_month;
      overageCost =
        overageTickets > 0 ? overageTickets * plan.cost_per_overage_ticket : 0;
      planCost = plan.monthly_cost;
      const totalPrice = planCost + overageCost;

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

    const totalPrice = planCost + overageCost;
    return {
      planName: applicablePlan.name,
      planCost: planCost,
      overageCost: overageCost,
      totalPrice: totalPrice,
    };
  }

  // Function to calculate the price of the automate plan
  function calculateAutomatePrice(automatedTickets, planType) {
    const plans = automatePlans[planType];
    let applicablePlan = plans[0];
    let planCost = 0;
    let overageCost = 0;

    for (let i = 0; i < plans.length; i++) {
      const plan = plans[i];
      if (automatedTickets <= plan.interactions_per_month) {
        applicablePlan = plan;
        planCost = plan.monthly_cost;
        overageCost = 0;
        break;
      } else {
        applicablePlan = plan;
        planCost = plan.monthly_cost;
        overageCost =
          (automatedTickets - plan.interactions_per_month) *
          plan.cost_per_overage_interaction;
      }
    }

    const totalPrice = planCost + overageCost;
    return {
      planName: applicablePlan.name,
      planCost: planCost,
      overageCost: overageCost,
      totalPrice: totalPrice,
    };
  }

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

  // Function to update the UI with calculated prices
  function updatePrice() {
    const number_of_tickets = parseInt(ticketRange.value, 10);
    const planType = annualPlanRadio.checked ? "yearly" : "monthly";
    const { planName, planCost, overageCost, totalPrice } = calculatePrice(
      number_of_tickets,
      planType
    );

    // Check if the plan is "Enterprise" and update the total price display accordingly
    if (planName === "Enterprise") {
      updateElements("totalPrice", "Talk to sales");
    } else {
      updateElements("totalPrice", planCost.toFixed(0));
    }

    updateElements("ticketCount", number_of_tickets);
    updateElements("totalPrice", planCost.toFixed(0));
    updateElements("planName", planName);
    updateElements("overageCost", overageCost.toFixed(0));
    updateElements("totalCost", totalPrice.toFixed(0));

    // Call updateTotalCostDisplay to update the total cost display
    updateTotalCostDisplay(planName, totalPrice);

    updateAutomatePrice();
    updateVoiceTicketPrice();
    updateSmsTicketPrice();
    updateSummaryTotalPrice();
    updateMonthlyCostsWithGorgias();

    // Call updateCTAGroup with the plan name
    updateCTAGroup(planName);

    // Check if plan name is "Starter" and plan type is "yearly"
    if (planName === "Starter" && planType === "yearly") {
      document.querySelector(".is-monthly").click();
    }
  }

  /****************************
   *
   * UI UPDATES
   *
   ****************************/

  // Function to update the UI with automate plan prices
  function updateAutomatePrice() {
    const percentage = parseInt(automateRange.value, 10);
    const number_of_tickets = parseInt(ticketRange.value, 10);
    const automatedTickets = Math.floor((percentage / 100) * number_of_tickets);
    const planType = annualPlanRadio.checked ? "yearly" : "monthly";
    const { planName, planCost, overageCost, totalPrice } =
      calculateAutomatePrice(automatedTickets, planType);

    updateElements("automatePercentage", `${percentage}%`);
    updateElements("automatePlanName", planName);
    updateElements("automateTotalPrice", planCost.toFixed(0));
    updateElements("automateOverageCost", overageCost.toFixed(0));
    updateElements("automateTotalCost", totalPrice.toFixed(0));
    updateElements("automatedTickets", automatedTickets);

    console.log(
      `Updated UI with automate plan name: ${planName}, plan cost: ${planCost}, overage cost: ${overageCost}, total price: ${totalPrice}, automated tickets: ${automatedTickets}`
    );

    updateAgentTickets(number_of_tickets, automatedTickets);
    toggleAutomateAlert();
    updateSummaryTotalPrice();
    updateMonthlyCostsWithGorgias();
    updateMonthlyCostsWithoutGorgias();
    updateSavings();
  }

  // Function to update the number of agent tickets in the UI
  function updateAgentTickets(totalTickets, automatedTickets) {
    const agentTickets = totalTickets - automatedTickets;
    updateElements("agentTickets", agentTickets);
    console.log(`Updated UI with agent tickets: ${agentTickets}`);
    updateMonthlyCostsWithoutGorgias();
    updateSavings();
  }

  // Function to update the UI with voice ticket prices
  function updateVoiceTicketPrice() {
    const selectedTier = voiceTicketsSelect.value;
    const planType = annualPlanRadio.checked ? "yearly" : "monthly";
    const voiceTicketPrice = calculateVoiceTicketPrice(selectedTier, planType);
    const summaryPrice = $(".summary_price-block-voice");
    const customPrice = $(".summary_price-custom-voice");
    updateElements("voiceTicketPrice", voiceTicketPrice.toFixed(0));
    console.log(`Updated UI with voice ticket price: ${voiceTicketPrice}`);
    updateSummaryTotalPrice();

    if (selectedTier === "Tier 0") {
      $('[data-summary="voice"]').addClass("is-summary-hidden");
      console.log("Hide summary voice");
    } else if (selectedTier === "Pay as you go") {
      console.log("Pay as you go");
      summaryPrice.css("display", "none");
      customPrice.css("display", "flex");
      $('[data-summary="voice"]').removeClass("is-summary-hidden");
    } else if (selectedTier === "Tier 7") {
      console.log("Custom price");
      summaryPrice.css("display", "none");
      customPrice.css("display", "flex");
      $('[data-summary="voice"]').removeClass("is-summary-hidden");
    } else {
      summaryPrice.css("display", "flex");
      customPrice.css("display", "none");
      $('[data-summary="voice"]').removeClass("is-summary-hidden");
    }
  }

  // Function to update the UI with SMS ticket prices
  function updateSmsTicketPrice() {
    const selectedTier = smsTicketsSelect.value;
    const planType = annualPlanRadio.checked ? "yearly" : "monthly";
    const smsTicketPrice = calculateSmsTicketPrice(selectedTier, planType);
    const summaryPrice = $(".summary_price-block-sms");
    const customPrice = $(".summary_price-custom-sms");
    updateElements("smsTicketPrice", smsTicketPrice.toFixed(0));
    console.log(`Updated UI with SMS ticket price: ${smsTicketPrice}`);
    updateSummaryTotalPrice();

    if (selectedTier === "Tier 0") {
      $('[data-summary="sms"]').addClass("is-summary-hidden");
      console.log("Hide summary sms");
    } else if (selectedTier === "Pay as you go") {
      console.log("Pay as you go");
      $('[data-summary="sms"]').removeClass("is-summary-hidden");
      summaryPrice.css("display", "none");
      customPrice.css("display", "flex");
    } else if (selectedTier === "Tier 7") {
      console.log("Custom price");
      summaryPrice.css("display", "none");
      customPrice.css("display", "flex");
      $('[data-summary="sms"]').removeClass("is-summary-hidden");
    } else {
      summaryPrice.css("display", "flex");
      customPrice.css("display", "none");
      $('[data-summary="sms"]').removeClass("is-summary-hidden");
    }
  }

  // Function to update the UI with the summary total price
  function updateSummaryTotalPrice() {
    const totalCost = parseFloat(
      document
        .querySelector(`[data-target="totalCost"]`)
        .getAttribute("data-raw-value")
    );
    const automateTotalCost = parseFloat(
      document
        .querySelector(`[data-target="automateTotalCost"]`)
        .getAttribute("data-raw-value")
    );
    const voiceTicketPrice = parseFloat(
      document
        .querySelector(`[data-target="voiceTicketPrice"]`)
        ?.getAttribute("data-raw-value") || 0
    );
    const smsTicketPrice = parseFloat(
      document
        .querySelector(`[data-target="smsTicketPrice"]`)
        ?.getAttribute("data-raw-value") || 0
    );
    const summaryTotalPrice =
      totalCost + automateTotalCost + voiceTicketPrice + smsTicketPrice;
    updateElements("summaryTotalPrice", summaryTotalPrice.toFixed(0));
  }

  // Function to toggle the automate alert visibility
  function toggleAutomateAlert() {
    const automatePercentageElement = document.querySelector(
      '[data-target="automatePercentage"]'
    );
    const automateAlert = document.querySelector(".automate-alert");
    const content = parseInt(automatePercentageElement.textContent.trim(), 10);

    if (content < 30) {
      automateAlert.style.display = "flex";
    } else {
      automateAlert.style.display = "none";
    }
  }

  // Function to update monthly_costs with Gorgias in the UI
  function updateMonthlyCostsWithGorgias() {
    const avgSupportSalary = getDataValue("avgSupportSalary"); // $/hour
    const avgTimePerTicket = 6; // minutes, provided in the image
    const agentTickets = parseInt(
      document
        .querySelector('[data-target="agentTickets"]')
        .getAttribute("data-raw-value"),
      10
    );

    console.log("avgTimePerTicket:", avgTimePerTicket);
    console.log("avgSupportSalary:", avgSupportSalary);
    console.log("agentTickets:", agentTickets);

    // Calculate total support time in hours
    const totalSupportTimeInHours = (agentTickets * avgTimePerTicket) / 60;
    console.log("totalSupportTimeInHours:", totalSupportTimeInHours);

    // Calculate total human cost
    const totalHumanCost = totalSupportTimeInHours * avgSupportSalary;
    console.log("totalHumanCost:", totalHumanCost);

    // Calculate Gorgias cost
    const helpdeskPlanCost =
      parseFloat(
        document
          .querySelector(`[data-target="totalCost"]`)
          .getAttribute("data-raw-value")
      ) || 0;
    const automateTierCost =
      parseFloat(
        document
          .querySelector(`[data-target="automateTotalCost"]`)
          .getAttribute("data-raw-value")
      ) || 0;
    const totalGorgiasCost = helpdeskPlanCost + automateTierCost;
    console.log("helpdeskPlanCost:", helpdeskPlanCost);
    console.log("automateTierCost:", automateTierCost);
    console.log("totalGorgiasCost:", totalGorgiasCost);

    // Calculate total monthly_cost
    const totalMonthlyCostWithGorgias = totalHumanCost + totalGorgiasCost;
    console.log("totalMonthlyCostWithGorgias:", totalMonthlyCostWithGorgias);

    // Update the UI elements
    updateElements(
      "totalSupportTimeWithGorgias",
      `${totalSupportTimeInHours.toFixed(0)}`
    );
    updateElements("totalHumanCostWithGorgias", `${totalHumanCost.toFixed(0)}`);
    updateElements("totalGorgiasCost", `${totalGorgiasCost.toFixed(0)}`);
    updateElements(
      "totalMonthlyCostWithGorgias",
      `${totalMonthlyCostWithGorgias.toFixed(0)}`
    );
  }

  // New function to calculate savings and update the UI
  function updateSavings() {
    const totalSupportTimeWithoutGorgias = parseFloat(
      document
        .querySelector(`[data-target="totalSupportTime"]`)
        .getAttribute("data-raw-value")
    );
    const totalSupportTimeWithGorgias = parseFloat(
      document
        .querySelector(`[data-target="totalSupportTimeWithGorgias"]`)
        .getAttribute("data-raw-value")
    );

    const totalMonthlyCostWithoutGorgias = parseFloat(
      document
        .querySelector(`[data-target="totalHumanCost"]`)
        .getAttribute("data-raw-value")
    );
    const totalMonthlyCostWithGorgias = parseFloat(
      document
        .querySelector(`[data-target="totalMonthlyCostWithGorgias"]`)
        .getAttribute("data-raw-value")
    );

    const timeSaved =
      totalSupportTimeWithoutGorgias - totalSupportTimeWithGorgias;
    const moneySaved =
      totalMonthlyCostWithoutGorgias - totalMonthlyCostWithGorgias;
    const percentageSaved = (moneySaved / totalMonthlyCostWithoutGorgias) * 100;

    updateElements("timeSaved", `${timeSaved.toFixed(0)}`);
    updateElements("moneySaved", `${moneySaved.toFixed(0)}`);
    updateElements("percentageSaved", `${percentageSaved.toFixed(1)}`);

    console.log(`Time saved: ${timeSaved.toFixed(0)}`);
    console.log(`Money saved: ${moneySaved.toFixed(0)}`);
    console.log(`Percentage saved: ${percentageSaved.toFixed(1)}`);
  }

  /****************************
   *
   * INITIALIZATION
   *
   ****************************/

  ticketRange.value = 1500;
  annualPlanRadio.checked = true;
  updatePrice();

  ticketRange.addEventListener("input", updatePrice);
  attachProgressBarUpdate(ticketRange);

  monthlyPlanRadio.addEventListener("change", () => {
    updatePrice();
    updateVoiceTicketPrice();
    updateSmsTicketPrice();
  });
  annualPlanRadio.addEventListener("change", () => {
    updatePrice();
    updateVoiceTicketPrice();
    updateSmsTicketPrice();
  });

  automateRange.value = 0;
  updateElements("automatePercentage", "0%");
  updateAutomatePrice();
  attachProgressBarUpdate(automateRange);
  automateRange.addEventListener("input", updateAutomatePrice);

  voiceTicketsSelect.addEventListener("change", updateVoiceTicketPrice);
  smsTicketsSelect.addEventListener("change", updateSmsTicketPrice);
  updateVoiceTicketPrice();
  updateSmsTicketPrice();

  // Initial call to update the UI for monthly_costs Without Gorgias
  updateMonthlyCostsWithoutGorgias();

  // Initial call to update the savings
  updateSavings();

  /****************************
   *
   * UPDATE QUERY PARAMETERS
   *
   ****************************/
  
// Object to store selected plans and tiers
const selectedPlans = {
    "source": "pricing", // default source parameter
  "billing-cycle": "annual" // default billing cycle
};

// Function to update the selected plan and log it to the console
function updateSelectedPlan(param, value) {
  if (value) {
    selectedPlans[param.toLowerCase()] = value.toLowerCase();
  } else {
    delete selectedPlans[param.toLowerCase()];
  }
}

// Function to get and update helpdesk plan
function updateHelpdeskPlan() {
  const planName = document.querySelector('[data-target="planName"]').textContent.toLowerCase();
  updateSelectedPlan("helpdesk", planName);
}

// Function to get and update automate plan
function updateAutomatePlan() {
  const automatePlanName = document.querySelector('[data-target="automatePlanName"]').textContent.toLowerCase();
  if (automatePlanName !== "tier 0") {
    updateSelectedPlan("automate", automatePlanName);
  } else {
    updateSelectedPlan("automate", null);
  }
}

// Function to update voice tier
function updateVoiceTier() {
  const voiceTier = document.querySelector(`[data-target="voice-tickets"]`).value.toLowerCase();
  if (voiceTier !== "tier 0") {
    updateSelectedPlan("voice", voiceTier);
  } else {
    updateSelectedPlan("voice", null);
  }
}

// Function to update SMS tier
function updateSmsTier() {
  const smsTier = document.querySelector(`[data-target="sms-tickets"]`).value.toLowerCase();
  if (smsTier !== "tier 0") {
    updateSelectedPlan("sms", smsTier);
  } else {
    updateSelectedPlan("sms", null);
  }
}

// Function to update billing cycle
function updateBillingCycle() {
  const annualPlan = document.getElementById("annualPlan");
  const monthlyPlan = document.getElementById("monthlyPlan");

  if (annualPlan.checked) {
    updateSelectedPlan("billing-cycle", "annual");
  } else if (monthlyPlan.checked) {
    updateSelectedPlan("billing-cycle", "monthly");
  }
}

// Function to update signup button URLs with current selected plans
function updateSignupUrls() {
  const queryParams = new URLSearchParams(selectedPlans);
  const signupButtons = document.querySelectorAll('[data-target="query-params"]');
  signupButtons.forEach(button => {
    const baseUrl = button.getAttribute('href').split('?')[0];
    button.setAttribute('href', `${baseUrl}?${queryParams.toString()}`);
  });
}

// Function to initialize selected plans
function initializeSelectedPlans() {
  updateHelpdeskPlan();
  updateAutomatePlan();
  updateVoiceTier();
  updateSmsTier();
  updateBillingCycle(); // Ensure default billing cycle is set
}

// Attach event listeners to elements
function attachListeners() {
  // Observe changes to planName
  const planNameElement = document.querySelector('[data-target="planName"]');
  const planNameObserver = new MutationObserver(updateHelpdeskPlan);
  planNameObserver.observe(planNameElement, { childList: true, subtree: true });

  // Observe changes to automatePlanName
  const automatePlanNameElement = document.querySelector('[data-target="automatePlanName"]');
  const automatePlanObserver = new MutationObserver(updateAutomatePlan);
  automatePlanObserver.observe(automatePlanNameElement, {
    childList: true,
    subtree: true,
  });

  // Attach change event listeners to voice and SMS dropdowns
  document.querySelector(`[data-target="voice-tickets"]`).addEventListener("change", updateVoiceTier);
  document.querySelector(`[data-target="sms-tickets"]`).addEventListener("change", updateSmsTier);

  // Attach input event listeners to range sliders
  document.getElementById("ticketRange").addEventListener("input", updateHelpdeskPlan);
  document.getElementById("automateRange").addEventListener("input", updateAutomatePlan);

  // Attach change event listeners to billing cycle radio buttons
  document.getElementById("annualPlan").addEventListener("change", updateBillingCycle);
  document.getElementById("monthlyPlan").addEventListener("change", updateBillingCycle);

  // Attach click event listeners to signup buttons
  const signupButtons = document.querySelectorAll('[data-target="query-params"]');
  signupButtons.forEach(button => {
    button.addEventListener("click", updateSignupUrls);
  });
}

// Initial call to initialize selected plans and attach listeners
initializeSelectedPlans();
attachListeners();

/****************************
*
* CHECK FOR COOKIES
*
****************************/

// Function to look for cookies "gorgias_helpdesk_subdomain" and change data-type="signup-btn" for login ctas
function checkCookie() {
  const cookie = document.cookie;
  if (cookie.includes("gorgias-helpdesk-subdomain")) {
    const subdomain = cookie.split("gorgias-helpdesk-subdomain=")[1].split(";")[0];
    const signupBtns = document.querySelectorAll('[data-type="signup-btn"]');
    signupBtns.forEach((btn) => {
      btn.textContent = "Update your plan";
      btn.href = `https://${subdomain}.gorgias.com/app/settings/billing`;
    });
  }
}

// Call the function to check for cookies
checkCookie();


/****************************
*
* EVENT HANDLERS
*
****************************/

  // Function to set the automation rate and update related UI elements
  function setAutomationRate(value) {
    // Set the value of the automate range slider
    automateRange.value = value;
    // Update the displayed percentage for automation
    updateElements("automatePercentage", `${value}%`);
    // Update the automate price based on the new value
    updateAutomatePrice();
    // Update the progress bar for the automate range slider
    updateProgressBar(automateRange);
    // Update the summary total price to reflect the new automation rate
    updateSummaryTotalPrice();
  }


  let automateRangeVal

  // Event listenir for the automate range slider
  $("#automateRange").on("input", function () {
    document.querySelector('[data-summary="automate"]').style.display = "flex";
    automateRangeVal = $(this).val();
    console.log('Automate range value:', automateRangeVal);
  });

  // Event listener for the helpdesk button to set automation rate to 30%
  document
    .querySelector('[data-button="helpdesk"]')
    .addEventListener("click", function () {
      setAutomationRate(30);
    });

  // Event listener for the automate-remove button to set automation rate to 0% and hide the automate summary
  document
    .querySelector('[data-summary="automate-remove"]')
    .addEventListener("click", function () {
      setAutomationRate(0);
      // Hide the automate summary element
      document.querySelector('[data-summary="automate"]').style.display =
        "none";
    });

  // Event listener for the automate-skip button to set automation rate to 0% and hide the automate summary
  document
    .querySelector('[data-button="automate-skip"]')
    .addEventListener("click", function () {
      setAutomationRate(0);
      // Hide the automate summary element
      document.querySelector('[data-summary="automate"]').style.display =
        "none";
    });

// Event listener for the tab-link_2 element to set automation rate based on the automateRangeVal
document.querySelector(".tab-link_2").addEventListener("click", function () {
  // Check if the helpdesk button has been clicked
  const helpdeskButtonClicked = document.querySelector('[data-button="helpdesk"]').getAttribute("data-clicked");
  // Set automation rate based on the value of automateRangeVal

  if (!helpdeskButtonClicked && automateRangeVal === 0) {
    setAutomationRate(30);
  } else {
    setAutomationRate(automateRangeVal);
  }
});

  // Initialize a flag variable to false
  let flag = false;

  // Add event listener to #no-automate click to set flag to true
  $("#no-automate").on("click", function () {
    flag = true;
  });

  // Add event listener to #remove-automate click to set flag to false
  $("#remove-automate").on("click", function () {
    flag = false;
    console.log("I removed and flag is false");
  });

  $("#back-to-automate").on("click", function () {
    if (flag === true) {
      setAutomationRate(30);
      // Reset to false
      flag = false;
      console.log("Flag is flase");
    } else if (flag === false) {
      setAutomationRate(0);
      // Reset to false
      flag = false;
      console.log("Flag is still flase");
    }
  });

  // Event listener to mark the helpdesk button as clicked
  document
    .querySelector('[data-button="helpdesk"]')
    .addEventListener("click", function () {
      this.setAttribute("data-clicked", "true");
    });


/** Function to update the visible CTA group based on the selected helpdesk plan */
function updateCTAGroup(plan) {
  // Define CTA groups and reset display
  const ctaGroups = {
    Starter: $(".starter-ctas"),
    Basic: $(".basic-ctas"),
    Pro: $(".pro-ctas"),
    Advanced: $(".advanced-ctas"),
    Enterprise: $(".enterprise-ctas"),
  };

  Object.values(ctaGroups).forEach((cta) => cta.css("display", "none"));
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
      $(".summary_automate-saving").css("display", "none");
      $(".is-billing-cycle").css("display", "none");
      $(".is-total-item").css("display", "none");
      $('[data-summary="automate"]').addClass("is-summary-hidden");
      $('[data-summary="voice"]').addClass("is-summary-hidden");
      $('[data-summary="sms"]').addClass("is-summary-hidden");
    } else {
      helpdeskCTA.css("display", "flex");
      demoCTA.css("display", "none");
      enterpriseInfo.css("display", "none");
      $(".summary_automate-saving").css("display", "flex");
      $(".is-billing-cycle").css("display", "flex");
      $(".is-total-item").css("display", "flex");
      $('[data-summary="automate"]').removeClass("is-summary-hidden");
      $('[data-summary="voice"]').removeClass("is-summary-hidden");
      $('[data-summary="sms"]').removeClass("is-summary-hidden");
    }
  } else {
    ctaGroups.Pro.css("display", "flex");
    $(".summary_automate-saving").css("display", "flex");
    $(".is-billing-cycle").css("display", "flex");
    $(".is-total-item").css("display", "flex");
    $('[data-summary="automate"]').removeClass("is-summary-hidden");
    $('[data-summary="voice"]').removeClass("is-summary-hidden");
    $('[data-summary="sms"]').removeClass("is-summary-hidden");
  }
}

function resetVoicePrice() {
  const voiceTicketsDropdown = document.querySelector("#voice-tickets");
  voiceTicketsDropdown.value = "Tier 0"; // Set the dropdown to "No Voice Tickets"
  const event = new Event("change");
  voiceTicketsDropdown.dispatchEvent(event);
  $('[data-summary="voice"]').css("display", "none");
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
  const smsTicketsDropdown = document.querySelector("#sms-tickets");
  smsTicketsDropdown.value = "Tier 0"; // Set the dropdown to "No SMS Tickets"
  const event = new Event("change");
  smsTicketsDropdown.dispatchEvent(event);
  $('[data-summary="sms"]').css("display", "none");
}

// Attach the function to the click event of all elements with data-summary="sms-remove"
const smsRemoveElements = document.querySelectorAll(
  '[data-summary="sms-remove"]'
);
smsRemoveElements.forEach((element) => {
  element.addEventListener("click", resetSMSPrice);
});

// Handle UI and IDs for dropdown list links on Voice and SMS
setTimeout(() => {
  document.querySelectorAll(".addons_dropdown-link").forEach((link) => {
    processText(link, "voice-link", "sms-link");
  });

  function generateValidId(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with a single one
      .trim();
  }

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

  const dropdownToggle = document.querySelector("#w-dropdown-toggle-14");
  if (dropdownToggle) {
    processText(dropdownToggle, "voice-ticket", "sms-ticket");
    const observer = new MutationObserver(() => {
      processText(dropdownToggle, "voice-ticket", "sms-ticket");
    });
    observer.observe(dropdownToggle, { childList: true, subtree: true });
  }
}, 2000); // 2-second delay
});



