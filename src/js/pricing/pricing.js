var Webflow = Webflow || [];
Webflow.push(function () {
    // Get references to HTML elements for ticket range, plan type toggle, and voice and SMS tickets select
    let ticketRange = document.getElementById("ticketRange");
    const monthlyPlanRadio = document.getElementById("monthlyPlan");
    const annualPlanRadio = document.getElementById("annualPlan");
  
    // Set data elements in variables using querySelectorAll
    let helpdeskPriceElements = document.querySelectorAll(`[data-el="helpdeskPrice"]`);
    let helpdeskPrice10Elements = document.querySelectorAll(`[data-el="helpdeskPrice10"]`);
    let helpdeskPrice20Elements = document.querySelectorAll(`[data-el="helpdeskPrice20"]`);
    let helpdeskPrice30Elements = document.querySelectorAll(`[data-el="helpdeskPrice30"]`);
  
    // Select all elements with the attribute data-el="planName"
    const planNameElements = document.querySelectorAll(`[data-el="planName"]`);
  
    // Select all elements to show ticket number for Helpdesk and Automation
    let ticketNumberElements = document.querySelectorAll(`[data-el="ticketNumber"]`);
    let automateTicketNumber10Elements = document.querySelectorAll(`[data-el="automateTicketNumber10"]`);
    let automateTicketNumber20Elements = document.querySelectorAll(`[data-el="automateTicketNumber20"]`);
    let automateTicketNumber30Elements = document.querySelectorAll(`[data-el="automateTicketNumber30"]`);
  
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
  
    /****************************
     *
     * HELPER FUNCTION TO CALCULATE AUTOMATION PRICE
     *
     ****************************/
  
    function calculateAutomatePrice(automatedTickets) {
      const planType = annualPlanRadio.checked ? "yearly" : "monthly";
      const plans = automatePlans[planType];
  
      let selectedPlan = plans[0];
  
      for (let i = 0; i < plans.length; i++) {
        if (automatedTickets <= plans[i].interactions_per_month) {
          selectedPlan = plans[i];
          break;
        }
      }
  
      console.log(`Automation Price Calculation: Plan Name: ${selectedPlan.name}, Monthly Cost: ${selectedPlan.monthly_cost}, Automated Tickets: ${automatedTickets}`);
      return selectedPlan.monthly_cost;
    }
  
    /****************************
     *
     * FUNCTION TO CALCULATE HELPDESK PRICE WITH OVERAGES
     *
     ****************************/
  
    function calculateHelpdeskPrice(nb_of_tickets) {
      const planType = annualPlanRadio.checked ? "yearly" : "monthly";
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
  
        console.log(`Checking Plan: ${plan.name}, Base Price: ${planCost}, Overage Tickets: ${overageTickets}, Overage Cost: ${overageCost}`);
  
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
  
      console.log(`Final Plan Selected: ${applicablePlan.name}, Plan Cost: ${planCost}, Overage Cost: ${overageCost}, Total Cost: ${totalPrice}`);
  
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
  
      console.log(`Helpdesk Plan: ${planName}, Plan Cost: ${planCost}, Overage Cost: ${overageCost}, Total Price: ${totalPrice}`);
  
      // Calculate the total cost for each automation rate (10%, 20%, 30%)
      const automationRates = [0.1, 0.2, 0.3];
  
      automationRates.forEach((rate) => {
        const automatedTickets = Math.floor(rate * nb_of_tickets);
        const automateCost = calculateAutomatePrice(automatedTickets);
        const totalCost = planCost + automateCost;
  
        // Update the number of automated tickets and total price for each rate
        if (rate === 0.1) {
          automateTicketNumber10Elements.forEach((element) => {
            element.textContent = `${automatedTickets}`;
          });
          helpdeskPrice10Elements.forEach((element) => {
            element.textContent = `${totalCost}`;
          });
        } else if (rate === 0.2) {
          automateTicketNumber20Elements.forEach((element) => {
            element.textContent = `${automatedTickets}`;
          });
          helpdeskPrice20Elements.forEach((element) => {
            element.textContent = `${totalCost}`;
          });
        } else if (rate === 0.3) {
          automateTicketNumber30Elements.forEach((element) => {
            element.textContent = `${automatedTickets}`;
          });
          helpdeskPrice30Elements.forEach((element) => {
            element.textContent = `${totalCost}`;
          });
        }
  
        console.log(`Automation Rate: ${rate * 100}%, Automated Tickets: ${automatedTickets}, Automate Cost: ${automateCost}, Total Price: ${totalCost}`);
      });
  
      // Call the updateActivePlanElement with the actual plan name
      updateActivePlanElement(planName);
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
  
      console.log(`Active Plan Element Updated: ${planName}`);
    }
  
    /****************************
     *
     * EVENT LISTENERS
     *
     ****************************/
  
    if (ticketRange) {
      ticketRange.addEventListener("input", function () {
        const number_of_tickets = parseInt(ticketRange.value, 10) || 0;
        console.log(`Input Event Fired: Number of Tickets: ${number_of_tickets}`);
        calculatePricePerMonth(number_of_tickets);
      });
    } else {
      console.error("ticketRange element not found!");
    }
  
    $(".pricing_card").on("click", function () {
      $(".pricing_card").removeClass("is-selected");
      $(".pricing_card .pricing_automate-pill").removeClass("is-selected");
      $(this).toggleClass("is-selected");
      $(this).find(".pricing_automate-pill").toggleClass("is-selected");
      console.log("Pricing card clicked and selected class toggled.");
    });
  });