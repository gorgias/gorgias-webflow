function initialize() {
    const elements = {
      campaignReachRate: 0.25,
      campaignCTR: 0.018,
      estimatedClicks: 0,
      mostAppropriateConvertTier: 0,
      convertMostAppropriateTierPrice: 0,
      rangeSlidersWrappers: qsa(`[dev-target=rang-slider-wrapper]`),
      withConvertTarget: qs(`[dev-target=with-convert-target]`),
      withOutConvertTarget: qs(`[dev-target=without-convert-target]`),
      revenueLiftTarget: qs(`[dev-target=revenue-lift]`),
      roiTarget: qs(`[dev-target=convert-roi]`),
      monthlyVisitorSlider: qs(`[dev-average-monthly-visitor-input]`),
      conversationRateSlider: qs(`[dev-conversion-rate-input]`),
      averageOrderSlider: qs(`[dev-average-order-value-input]`),
      visitorsNumberInput: qs(`[dev-target=visitorsNumberInput]`),
      conversionRateNumberInput: qs(`[dev-target=rateNumberInput]`),
      averageOrderValueNumberInput: qs(`[dev-target=orderValueNumberInput]`),
      conversionRateAfter: qs(`[dev-rate-after]`),
      averageOrderValueAfter: qs(`[dev-average-order-value-after]`),
      //tierPriceTarget: qs(`[dev-target=tier-price]`),
    };

    rangeSliderInit(elements.rangeSlidersWrappers);
    inputSliderLogicInit(elements.monthlyVisitorSlider,elements.visitorsNumberInput,false,false,false);
    inputSliderLogicInit(elements.conversationRateSlider,elements.conversionRateNumberInput,true,false,true);
    inputSliderLogicInit(elements.averageOrderSlider,elements.averageOrderValueNumberInput,true,true,false);

    function rangeSliderInit(rangeSlidersWrappers) {
      rangeSlidersWrappers.forEach((rangeSlidersWrapper) => {
        const rangeSlider = rangeSlidersWrapper.querySelector(
          `[dev-target=slider-input]`
        );
        const rangeSliderMaxValue = rangeSlider.max;
        const rangeSliderThumb = rangeSlidersWrapper.querySelector(
          `[dev-target=slider-thumb]`
        );
        const rangeSliderProgress = rangeSlidersWrapper.querySelector(
          `[dev-target=slider-progress]`
        );

        if (rangeSlider && rangeSliderMaxValue) {
          rangeSlider.addEventListener("input", () => {
            const val =
                  (Number(rangeSlider.value) / Number(rangeSliderMaxValue)) * 100 +
                  "%";
            if (rangeSliderProgress) {
              rangeSliderProgress.style.width = val;
            }
            if (rangeSliderThumb) {
              rangeSliderThumb.style.left = val;
            }
            calculateValues()
          });
          rangeSlider.dispatchEvent(new Event("input"));
        }
      });
    }

    function inputSliderLogicInit(sliderInput, numberInput, decimalPlace,dollarSign,percentSymbol) {
      sliderInput.addEventListener("input",(e)=>{
        numberInput.type = "text";
        numberInput.value = `${dollarSign ? "$" : ""}` + formatNumberWithCommas(Number(e.target.value).toFixed(decimalPlace ? 2 : 0)) + `${percentSymbol ? "%" :""}`;
      });
      sliderInput.dispatchEvent(new Event("input"));
      numberInput.addEventListener("focus",()=>{
        const value = Number(numberInput.value.replace(/[$,|%]/g, ""));
        numberInput.type = "number";
        numberInput.value = value;
        numberInput.select();
      })
      numberInput.addEventListener("blur",(e)=>{
        const value = Number(numberInput.value.replace(/[$,|%]/g, "")); 
        numberInput.type = "text";
        numberInput.value = `${dollarSign ? "$" : ""}` + formatNumberWithCommas(Number(e.target.value).toFixed(decimalPlace ? 2 : 0)) + `${percentSymbol ? "%" :""}`;

        sliderInput.value = value;
        sliderInput.dispatchEvent(new Event("input"));
      })
    }

    function calculateValues() {
      const conversionRateAfter = (
        1.06 * Number(elements.conversationRateSlider.value)
      ).toFixed(2);
      const averageOrderValueAfter = (
        1.02 * Number(elements.averageOrderSlider.value)
      ).toFixed(2);
      const withOutConvert = Math.round(
        (Number(elements.monthlyVisitorSlider.value) *
         Number(elements.conversationRateSlider.value) *
         Number(elements.averageOrderSlider.value)) /
        100
      );
      const withConvert = Math.round(
        (Number(elements.monthlyVisitorSlider.value) *
         1.06 *
         Number(elements.conversationRateSlider.value) *
         1.02 *
         Number(elements.averageOrderSlider.value)) /
        100
      );
      const revenueInfluenced = withConvert - withOutConvert;

      elements.conversionRateAfter.innerText =
        formatNumberWithCommas(conversionRateAfter);
      elements.averageOrderValueAfter.innerText = formatNumberWithCommas(
        averageOrderValueAfter
      );
      elements.withOutConvertTarget.innerText =
        formatNumberWithCommas(withOutConvert);
      elements.withConvertTarget.innerText =
        formatNumberWithCommas(withConvert);

      elements.revenueLiftTarget.innerText =
        formatNumberWithCommas(revenueInfluenced);

      elements.estimatedClicks = Math.round(
        Number(elements.monthlyVisitorSlider.value) *
        elements.campaignReachRate *
        elements.campaignCTR
      );

      updateConvertTierAndTierPrice(elements.estimatedClicks);

      const ROI = Math.round(
        (revenueInfluenced - elements.convertMostAppropriateTierPrice) /
        elements.convertMostAppropriateTierPrice
      );

      elements.roiTarget.innerText = formatNumberWithCommas(ROI);
    }

    function updateConvertTierAndTierPrice(value) {
      const tiers = [
        { tier: 1, min: 0, max: 50, price: 30 },
        { tier: 2, min: 51, max: 500, price: 300 },
        { tier: 3, min: 501, max: 1000, price: 575 },
        { tier: 4, min: 1001, max: 2000, price: 1100 },
        { tier: 5, min: 2001, max: 3000, price: 1575 },
        { tier: 6, min: 3001, max: 4000, price: 2000 },
      ];

      for (const tier of tiers) {
        if (value >= tier.min && (value <= tier.max || !tier.max)) {
          elements.mostAppropriateConvertTier = tier.tier;
          elements.convertMostAppropriateTierPrice = tier.price;
          //elements.tierPriceTarget.innerText = formatNumberWithCommas(tier.price);
          break;
        }
      }
    }

    function formatNumberWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function qs(selector) {
      return document.querySelector(selector);
    }
    function qsa(selector) {
      return document.querySelectorAll(selector);
    }
}
initialize()