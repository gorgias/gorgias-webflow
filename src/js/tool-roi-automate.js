function initialize() {
    const elements = {
        numOfMonthlyTickets: 0,
        billableTicketCost: 0,
        costOfAutomatedInteraction: 0,
        automateSubscriptionCost: 0,
        agentCostPerTicket: 0,
        calculatorRateInput: querySelector('[dev-target="rate-input"]'),
        withoutAutomateBar: querySelector('[dev-target="with-automate-bar"]'),
        withAutomateBar: querySelector('[dev-target="without-automate-bar"]'),
        calculatorResults: querySelector('[dev-target="calculator-results"]'),
        costWithOutAutomateDiv: querySelector('[dev-target="cost-without-automate"]'),
        costWithAutomateDiv: querySelector('[dev-target="cost-with-automate"]'),
        automateSavingWrapper: querySelector('[dev-target="automate-saving-wrapper"]'),
        automateSaving: querySelector('[dev-target="automate-saving"]'),
        sliderValueIndicators: querySelectorAll('[dev-target="slider-value-indicator"]'),
        responseTimeInput: querySelector('[dev-target="response-time-input"]'),
        resolutionTimeInput: querySelector('[dev-target="resolution-time-input"]'),
        responseTimeOutput: querySelector('[dev-target="response-time-output"]'),
        resolutionTimeOutput: querySelector('[dev-target="resolution-time-output"]'),
        estimateSavingDiv: querySelector('[dev-target="estimate-saving"]'),
        sliderInput: querySelector('[dev-target="slider-input"]'),
        supportSelect: querySelector('[dev-target="support-select"]'),
        agentWagesSelect: querySelector('[dev-target="agent-wages"]'),
        sliderThumb: querySelector('[dev-target="slider-thumb"]'),
        sliderProgress: querySelector('[dev-target="slider-progress"]'),
        displayedNumbers: document.querySelectorAll('[dev-target="cal-num"]'),
        newDisplayedNumbers: document.querySelector('[dev-target="new-cal-num"]'),
    };
    const inputEvent = new Event("input", { bubbles: true });
    const debounceCalculateValues = debounce(calculateValues, 300);
    elements.responseTimeInput.min = "0";
    elements.resolutionTimeInput.min = "0";
    elements.calculatorResults.style.display = "grid";
    elements.calculatorResults.style.gridTemplateRows = "1fr";
    elements.automateSavingWrapper.style.opacity = "0";
    elements.calculatorResults.firstElementChild.style.overflow = "hidden";
    if (elements.supportSelect?.value === "Support Tickets") {
        elements.sliderInput.max = "99999";
    }
    else if (elements.supportSelect?.value === "Support Agents") {
        elements.sliderInput.max = "38";
    }
    calculatorRateInputInit();
    customSlider();
    fourDigitInputLogicInit();
    newDisplayInputLogicInit();
    responseAndResolutionTime();
    function querySelector(selector) {
        return document.querySelector(selector);
    }
    function querySelectorAll(selector) {
        return document.querySelectorAll(selector);
    }
    function debounce(func, delay) {
        let debounceTimer;
        return function (...args) {
            const context = this;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }
    function responseAndResolutionTime() {
        elements.responseTimeInput?.addEventListener("input", handleResponseTimeInput);
        elements.resolutionTimeInput?.addEventListener("input", handleResolutionTimeInput);
        elements.responseTimeInput?.addEventListener("blur", handleInputBlur(elements.responseTimeInput, "hrs"));
        elements.responseTimeInput?.addEventListener("focus", handleInputFocus(elements.responseTimeInput, "hrs"));
        elements.resolutionTimeInput?.addEventListener("blur", handleInputBlur(elements.resolutionTimeInput, "hrs"));
        elements.resolutionTimeInput?.addEventListener("focus", handleInputFocus(elements.resolutionTimeInput, "hrs"));
    }
    function handleResponseTimeInput() {
        const output = Number((Number(elements.responseTimeInput.value) -
            Number(elements.responseTimeInput.value) * 0.30).toFixed(1));
        elements.responseTimeOutput.textContent = elements.responseTimeInput.value
            ? output + "hrs"
            : "(x)hrs";
    }
    function handleResolutionTimeInput() {
        const output = Number((Number(elements.resolutionTimeInput.value) -
            Number(elements.resolutionTimeInput.value) * 0.30).toFixed(1));
        elements.resolutionTimeOutput.textContent = elements.resolutionTimeInput
            .value
            ? output + "hrs"
            : "(x)hrs";
    }
    function handleInputBlur(inputElement, unit) {
        return () => {
            if (inputElement?.value) {
                inputElement.classList.add("active");
                inputElement.type = "text";
                inputElement.value = inputElement.value + unit;
            }
            else {
                inputElement?.classList.remove("active");
            }
        };
    }
    function handleInputFocus(inputElement, unit) {
        return () => {
            const value = inputElement.value.replace(unit, "");
            inputElement.type = "number";
            inputElement.value = value;
        };
    }
    function customSlider() {
        if (elements.supportSelect?.value === "Support Tickets") {
            elements.numOfMonthlyTickets = Number(elements.sliderInput?.value);
            // billableTicketCost
            if (elements.numOfMonthlyTickets >= 0 && elements.numOfMonthlyTickets <= 300) {
                elements.billableTicketCost = 0.2;
            }
            else if (elements.numOfMonthlyTickets > 300 && elements.numOfMonthlyTickets <= 5000) {
                elements.billableTicketCost = 0.18;
            }
            else if (elements.numOfMonthlyTickets > 5000) {
                elements.billableTicketCost = 0.15;
            }
            // costOfAutomatedInteraction
            if (elements.numOfMonthlyTickets >= 0 && elements.numOfMonthlyTickets <= 150) {
                elements.costOfAutomatedInteraction = 1;
            }
            else if (elements.numOfMonthlyTickets > 150 && elements.numOfMonthlyTickets <= 633) {
                elements.costOfAutomatedInteraction = 0.95;
            }
            else if (elements.numOfMonthlyTickets > 633 && elements.numOfMonthlyTickets <= 1766) {
                elements.costOfAutomatedInteraction = 0.85;
            }
            else if (elements.numOfMonthlyTickets > 1766 && elements.numOfMonthlyTickets <= 3750) {
                elements.costOfAutomatedInteraction = 0.80;
            }
            else if (elements.numOfMonthlyTickets > 3750 && elements.numOfMonthlyTickets <= 6666) {
                elements.costOfAutomatedInteraction = 0.75;
            }
            else if (elements.numOfMonthlyTickets > 6666 && elements.numOfMonthlyTickets <= 9999) {
                elements.costOfAutomatedInteraction = 0.70;
            }
            // automateSubscriptionCost
            if (elements.numOfMonthlyTickets >= 0 && elements.numOfMonthlyTickets <= 150) {
                elements.automateSubscriptionCost = 30;
            }
            else if (elements.numOfMonthlyTickets > 150 && elements.numOfMonthlyTickets <= 633) {
                elements.automateSubscriptionCost = 180;
            }
            else if (elements.numOfMonthlyTickets > 633 && elements.numOfMonthlyTickets <= 1766) {
                elements.automateSubscriptionCost = 450;
            }
            else if (elements.numOfMonthlyTickets > 1766 && elements.numOfMonthlyTickets <= 3750) {
                elements.automateSubscriptionCost = 900;
            }
            else if (elements.numOfMonthlyTickets > 3750 && elements.numOfMonthlyTickets <= 6666) {
                elements.automateSubscriptionCost = 1500;
            }
            else if (elements.numOfMonthlyTickets > 6666 && elements.numOfMonthlyTickets <= 9999) {
                elements.automateSubscriptionCost = 2100;
                // console.log("1-numOfMonthlyTickets",elements.numOfMonthlyTickets)
            }
        }
        else if (elements.supportSelect?.value === "Support Agents") {
            elements.numOfMonthlyTickets =
                Number(elements.sliderInput?.value) * 40 * 21;
            // billableTicketCost
            if (elements.numOfMonthlyTickets >= 0 && elements.numOfMonthlyTickets <= 300) {
                elements.billableTicketCost = 0.2;
            }
            else if (elements.numOfMonthlyTickets > 300 && elements.numOfMonthlyTickets <= 5000) {
                elements.billableTicketCost = 0.18;
            }
            else if (elements.numOfMonthlyTickets > 5000) {
                elements.billableTicketCost = 0.15;
            }
            // costOfAutomatedInteraction
            if (elements.numOfMonthlyTickets >= 0 && elements.numOfMonthlyTickets <= 150) {
                elements.costOfAutomatedInteraction = 1;
            }
            else if (elements.numOfMonthlyTickets > 150 && elements.numOfMonthlyTickets <= 633) {
                elements.costOfAutomatedInteraction = 0.95;
            }
            else if (elements.numOfMonthlyTickets > 633 && elements.numOfMonthlyTickets <= 1766) {
                elements.costOfAutomatedInteraction = 0.85;
            }
            else if (elements.numOfMonthlyTickets > 1766 && elements.numOfMonthlyTickets <= 3750) {
                elements.costOfAutomatedInteraction = 0.80;
            }
            else if (elements.numOfMonthlyTickets > 3750 && elements.numOfMonthlyTickets <= 6666) {
                elements.costOfAutomatedInteraction = 0.75;
            }
            else if (elements.numOfMonthlyTickets > 6666 && elements.numOfMonthlyTickets <= 9999) {
                elements.costOfAutomatedInteraction = 0.70;
            }
            // automateSubscriptionCost
            if (elements.numOfMonthlyTickets >= 0 && elements.numOfMonthlyTickets <= 150) {
                elements.automateSubscriptionCost = 30;
            }
            else if (elements.numOfMonthlyTickets > 150 && elements.numOfMonthlyTickets <= 633) {
                elements.automateSubscriptionCost = 180;
            }
            else if (elements.numOfMonthlyTickets > 633 && elements.numOfMonthlyTickets <= 1766) {
                elements.automateSubscriptionCost = 450;
            }
            else if (elements.numOfMonthlyTickets > 1766 && elements.numOfMonthlyTickets <= 3750) {
                elements.automateSubscriptionCost = 900;
            }
            else if (elements.numOfMonthlyTickets > 3750 && elements.numOfMonthlyTickets <= 6666) {
                elements.automateSubscriptionCost = 1500;
            }
            else if (elements.numOfMonthlyTickets > 6666 && elements.numOfMonthlyTickets <= 9999) {
                // console.log("2-numOfMonthlyTickets",elements.numOfMonthlyTickets)
                elements.automateSubscriptionCost = 2100;
            }
        }
        if (elements.numOfMonthlyTickets === 0) {
            elements.numOfMonthlyTickets = 0;
            elements.billableTicketCost = 0;
            elements.costOfAutomatedInteraction = 0;
            elements.automateSubscriptionCost = 0;
        }
        console.log("-----------------------------------------------------------------");
        console.log("numOfMonthlyTickets", elements.numOfMonthlyTickets);
        console.log("billableTicketCost", elements.billableTicketCost);
        console.log("costOfAutomatedInteraction", elements.costOfAutomatedInteraction);
        console.log("automateSubscriptionCost", elements.automateSubscriptionCost);
        console.log("agentCostPerTicket", elements.agentCostPerTicket);
        console.log("-----------------------------------------------------------------");
        const maxVal = elements.sliderInput?.getAttribute("max");
        elements.automateSavingWrapper.style.opacity = "0";
        elements.calculatorResults.style.display = "grid";
        elements.calculatorResults.style.gridTemplateRows = "1fr";
        elements.calculatorResults.firstElementChild.style.overflow = "hidden";
        elements.costWithOutAutomateDiv.textContent = "$0";
        elements.costWithAutomateDiv.textContent = "$0";
        if (elements.withoutAutomateBar && elements.withAutomateBar) {
            setElementWidth(elements.withoutAutomateBar);
            setElementWidth(elements.withAutomateBar);
        }
        if (elements.sliderInput && maxVal) {
            updateSlider(elements.sliderInput, maxVal);
        }
    }
    function setElementWidth(element) {
        if (element) {
            element.style.width = "auto";
            element.style.width =
                (element.clientWidth / element.parentElement.clientWidth) * 100 + "%";
        }
    }
    function updateSlider(sliderInput, maxVal) {
        if (sliderInput && maxVal) {
            const val = (Number(sliderInput.value) / Number(maxVal)) * 100 + "%";
            const fourDigitValueArray = sliderInput?.value.padStart(5, "").split("");
            const costWithOutAutomate = elements.numOfMonthlyTickets * (elements.agentCostPerTicket + elements.billableTicketCost);
            console.log("costWithOutAutomate", costWithOutAutomate);
            const costWithAutomate = costWithOutAutomate - (0.3 * elements.numOfMonthlyTickets * ((elements.agentCostPerTicket + elements.billableTicketCost) - elements.costOfAutomatedInteraction)) + (elements.automateSubscriptionCost);
            const amountSavedWithAutomate = costWithOutAutomate - costWithAutomate;
            const percentSaved = Math.round(((costWithOutAutomate - costWithAutomate) / costWithOutAutomate) * 100);
            if (elements.sliderProgress) {
                elements.sliderProgress.style.width = val;
            }
            if (elements.sliderThumb) {
                elements.sliderThumb.style.left = val;
            }
            elements.newDisplayedNumbers.type = "text";
            elements.newDisplayedNumbers.value = formatNumberWithCommas(sliderInput.value.padStart(5, "").slice(0, 5));
            elements.displayedNumbers.forEach((num, index) => {
                num.value = fourDigitValueArray[index];
            });
            debounceCalculateValues(elements.costWithOutAutomateDiv, elements.costWithAutomateDiv, elements.automateSaving, elements.estimateSavingDiv, costWithOutAutomate, costWithAutomate, percentSaved, amountSavedWithAutomate);
        }
    }
    function fourDigitInputLogicInit() {
        elements.displayedNumbers.forEach((displayNumber, index) => {
            const nextInput = elements.displayedNumbers[index + 1];
            displayNumber.addEventListener("blur", () => {
                const currentNumbers = Array.from(elements.displayedNumbers)
                    .map((item) => item.value)
                    .join("");
                elements.sliderInput.value = currentNumbers;
                elements.sliderInput?.dispatchEvent(inputEvent);
            });
            displayNumber.addEventListener("input", () => {
                if (nextInput) {
                    nextInput.focus();
                }
                else {
                    displayNumber.blur();
                }
            });
            displayNumber.addEventListener("focus", () => {
                displayNumber.select();
            });
        });
    }
    function calculatorRateInputInit() {
        // init agentCostPerTicket value
        if (elements.agentWagesSelect.value === "hourly-rate") {
            elements.agentCostPerTicket = Number(elements.calculatorRateInput.value.replace("$", "")) / 5;
        }
        else {
            elements.agentCostPerTicket = Number(elements.calculatorRateInput.value.replace("$", "")) / 10400;
        }
        // add listeners
        elements.calculatorRateInput?.addEventListener("input", () => {
            const value = elements.calculatorRateInput.value.replace("$", "");
            const agentWagesSelectValue = elements.agentWagesSelect.value;
            if (agentWagesSelectValue === "hourly-rate") {
                elements.agentCostPerTicket = Number(value) / 5;
                customSlider();
            }
            else {
                elements.agentCostPerTicket = Number(value) / 10400;
                customSlider();
            }
        });
        elements.calculatorRateInput?.addEventListener("focus", () => {
            const value = elements.calculatorRateInput.value.replace("$", "");
            elements.calculatorRateInput.type = "number";
            elements.calculatorRateInput.value = value;
        });
        elements.calculatorRateInput?.addEventListener("blur", () => {
            const value = "$" + elements.calculatorRateInput.value;
            elements.calculatorRateInput.type = "text";
            elements.calculatorRateInput.value = value;
        });
        elements.agentWagesSelect?.addEventListener("change", () => {
            const value = elements.calculatorRateInput.value.replace("$", "");
            const agentWagesSelectValue = elements.agentWagesSelect.value;
            if (agentWagesSelectValue === "hourly-rate") {
                elements.agentCostPerTicket = Number(value) / 5;
                customSlider();
            }
            else {
                elements.agentCostPerTicket = Number(value) / 10400;
                customSlider();
            }
        });
    }
    function newDisplayInputLogicInit() {
        elements.newDisplayedNumbers?.addEventListener("blur", (e) => {
            elements.newDisplayedNumbers.value = elements.newDisplayedNumbers.value.padStart(5, "");
            elements.sliderInput.value = elements.newDisplayedNumbers.value;
            elements.sliderInput?.dispatchEvent(inputEvent);
            elements.newDisplayedNumbers.type = "text";
            elements.newDisplayedNumbers.value = formatNumberWithCommas(elements.newDisplayedNumbers.value);
        });
        elements.newDisplayedNumbers?.addEventListener("focus", (e) => {
            const value = elements.newDisplayedNumbers.value.replace(/,/g, '')
            elements.newDisplayedNumbers.type = "number";
            elements.newDisplayedNumbers.value = value;
            elements.newDisplayedNumbers?.select();
        });
    }
    function calculateValues(costWithOutAutomateDiv, costWithAutomateDiv, automateSaving, estimateSavingDiv, costWithOutAutomate, costWithAutomate, percentSaved, amountSavedWithAutomate) {
        setTimeout(() => {
            costWithOutAutomateDiv.textContent =
                "$" + formatNumberWithCommas(Math.round(costWithOutAutomate));
            costWithAutomateDiv.textContent = "$" + formatNumberWithCommas(Math.round(costWithAutomate));
        }, 200);
        estimateSavingDiv.textContent = "$" + formatNumberWithCommas(Math.round(amountSavedWithAutomate));
        if (percentSaved) {
            automateSaving.textContent = percentSaved.toString();
        }
        if (costWithOutAutomate > 0) {
            elements.withoutAutomateBar.style.width = "95%";
            elements.withAutomateBar.style.width = "70%";
            elements.calculatorResults.style.gridTemplateRows = "1fr";
            elements.automateSavingWrapper.style.opacity = "1";
        }
    }
    elements.sliderInput?.addEventListener("input", () => customSlider());
    elements.supportSelect?.addEventListener("change", () => {
        const value = elements.supportSelect?.value;
        if (value === "Support Tickets") {
            elements.sliderInput.max = "99999";
            elements.newDisplayedNumbers.value = "0";
        }
        else if (value === "Support Agents") {
            elements.sliderInput.max = "38";
            elements.newDisplayedNumbers.value = "0";
        }
        elements.numOfMonthlyTickets = 0;
        elements.automateSubscriptionCost = 0;
        elements.costOfAutomatedInteraction = 0;
        elements.billableTicketCost = 0;
        elements.newDisplayedNumbers.dispatchEvent(new Event("input", { bubbles: true }));
        // elements.displayedNumbers.forEach((displayedNumber) => {
        //   displayedNumber.value = "0";
        //   displayedNumber.dispatchEvent(new Event("input", { bubbles: true }));
        // });
        if (value === "Support Tickets") {
            elements.sliderValueIndicators[0].textContent = "840";
            elements.sliderValueIndicators[1].textContent = "2900";
            elements.sliderValueIndicators[2].textContent = "5000";
            elements.sliderValueIndicators[3].textContent = "7000";
            elements.sliderValueIndicators[4].textContent = "9000+";
            customSlider();
        }
        else if (value === "Support Agents") {
            elements.sliderValueIndicators[0].textContent = "3";
            elements.sliderValueIndicators[1].textContent = "11";
            elements.sliderValueIndicators[2].textContent = "19";
            elements.sliderValueIndicators[3].textContent = "27";
            elements.sliderValueIndicators[4].textContent = "35+";
            customSlider();
        }
    });
}
initialize()
