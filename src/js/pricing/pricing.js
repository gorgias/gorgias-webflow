$(document).ready(function () {
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
    let automateTicketNumberElements = document.querySelectorAll(`[data-el="automateTicketNumber"]`);
  
    /****************************
     *
     * DATA DEFINITIONS
     *
     ****************************/
  
    // Define the helpdesk plans
    const helpdeskPlans = {
      monthly: [
        { name: "Starter", tickets_per_month: 50, monthly_cost: 10 },
        { name: "Basic", tickets_per_month: 300, monthly_cost: 60 },
        { name: "Pro", tickets_per_month: 2000, monthly_cost: 360 },
        { name: "Advanced", tickets_per_month: 5000, monthly_cost: 900 },
        { name: "Enterprise", tickets_per_month: 10000, monthly_cost: 1600 },
      ],
      yearly: [
        { name: "Starter", tickets_per_month: 50, monthly_cost: 8 },
        { name: "Basic", tickets_per_month: 300, monthly_cost: 50 },
        { name: "Pro", tickets_per_month: 2000, monthly_cost: 300 },
        { name: "Advanced", tickets_per_month: 5000, monthly_cost: 750 },
        { name: "Enterprise", tickets_per_month: 10000, monthly_cost: 1333 },
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
  
      // Find the appropriate automate plan for the number of automated tickets
      let selectedPlan = plans[0]; // Default to smallest plan
  
      for (let i = 0; i < plans.length; i++) {
        if (automatedTickets <= plans[i].interactions_per_month) {
          selectedPlan = plans[i];
          break;
        }
      }
  
      return selectedPlan.monthly_cost;
    }
  
    /****************************
     *
     * FUNCTION TO CALCULATE TOTAL PRICE INCLUDING AUTOMATION
     *
     ****************************/
  
    function calculatePricePerMonth(nb_of_tickets) {
      // Determine if the user has selected monthly or yearly plans
      const planType = annualPlanRadio.checked ? "yearly" : "monthly";
      const plans = helpdeskPlans[planType];
  
      // Find the appropriate helpdesk plan based on number of tickets
      let selectedPlan = plans[0]; // Default to the smallest plan
  
      for (let i = 0; i < plans.length; i++) {
        if (nb_of_tickets <= plans[i].tickets_per_month) {
          selectedPlan = plans[i];
          break;
        }
      }
  
      const helpdeskCost = selectedPlan.monthly_cost;
  
      // Update the helpdesk-only price in all matching elements
      helpdeskPriceElements.forEach((element) => {
        element.textContent = `${helpdeskCost}`;
      });
  
      // Update the plan name in all elements with data-el="planName"
      planNameElements.forEach((element) => {
        element.textContent = selectedPlan.name;
      });

      // Update the ticket number for Helpdesk and Automation
        ticketNumberElements.forEach((element) => {
            element.textContent = `${nb_of_tickets}`;
        });
        automateTicketNumberElements.forEach((element) => {
            element.textContent = `${nb_of_tickets}`;
        });
  
      // Calculate the total cost for each automation rate (10%, 20%, 30%)
      const automationRates = [0.1, 0.2, 0.3];
  
      automationRates.forEach((rate) => {
        const automatedTickets = Math.floor(rate * nb_of_tickets);
        const automateCost = calculateAutomatePrice(automatedTickets);
        const totalCost = helpdeskCost + automateCost;
  
        if (rate === 0.1) {
          helpdeskPrice10Elements.forEach((element) => {
            element.textContent = `${totalCost}`;
          });
        } else if (rate === 0.2) {
          helpdeskPrice20Elements.forEach((element) => {
            element.textContent = `${totalCost}`;
          });
        } else if (rate === 0.3) {
          helpdeskPrice30Elements.forEach((element) => {
            element.textContent = `${totalCost}`;
          });
        }
      });
  
      // Call the updateActivePlanElement with the actual plan name
      updateActivePlanElement(selectedPlan.name);
    }
  
    /****************************
     *
     * FUNCTION TO UPDATE ACTIVE PLAN ELEMENT
     *
     ****************************/
  
    function updateActivePlanElement(planName) {
      // Select all elements with the g-col-highlight attribute
      const planElements = document.querySelectorAll('[g-col-highlight]');
  
      // Loop through all plan elements
      planElements.forEach((element) => {
        // Check if the g-col-highlight attribute matches the current plan name
        if (element.getAttribute('g-col-highlight') === planName.toLowerCase()) {
          // Add is-active class to the matching element
          element.classList.add('is-active');
        } else {
          // Remove is-active class from non-matching elements
          element.classList.remove('is-active');
        }
      });
    }
  
    /****************************
     *
     * EVENT LISTENERS
     *
     ****************************/
  
    // Check if ticketRange element exists
    if (ticketRange) {
      console.log("ticket range is found: " + ticketRange);
  
      // Add an event listener to log the value whenever it changes and update the price
      ticketRange.addEventListener("input", function () {
        console.log("Input event fired!");
        let number_of_tickets = parseInt(ticketRange.value, 10) || 0; // Parse the input as an integer
        console.log("Number of tickets: " + number_of_tickets);
  
        // Call the function to calculate and display the price
        calculatePricePerMonth(number_of_tickets);
      });
    } else {
      console.error("ticketRange element not found!");
    }
  
    // Pricing card click handler
    $(".pricing_card").on("click", function () {
      // Remove .is-selected from all .pricing_card and their child .pricing_automate-pill
      $(".pricing_card").removeClass("is-selected");
      $(".pricing_card .pricing_automate-pill").removeClass("is-selected");
  
      // Add .is-selected to the clicked .pricing_card
      $(this).toggleClass("is-selected");
  
      // Toggle .is-selected on the child .pricing_automate-pill of the clicked .pricing_card
      $(this).find(".pricing_automate-pill").toggleClass("is-selected");
    });
  });