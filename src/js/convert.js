/****************************
 *
 * This script handles the new convert calculator.
 *
 ****************************/
  // Disable console.logs for production
  console.log = function () {};


  var Webflow = Webflow || [];
  Webflow.push(function () {
    const convertNumberInput = $("#numberInteractionsConvert");
    const convertRangeSlider = $('[data-el="convert-range-slider"]');
  
    // Fixed variables
    const medianConvertCampaignReach = 0.25; // 25%
    const medianClickRate = 0.015; // 1.50%
  
    // Calculate effective value to determine tier based on the range slider's value
    function calculateEffectiveValue(convertNumberInput) {
      return convertNumberInput * medianConvertCampaignReach * medianClickRate;
    }
  
    // Set initial value for the slider and number input
    const initialValue = 125000;
    convertRangeSlider.val(initialValue);
    convertNumberInput.val(initialValue);
    updateTierInformation(calculateEffectiveValue(initialValue));
    updateProgressBar(convertRangeSlider[0]); // Initial call to update the progress bar
  
    // Sync number input and range slider
    convertRangeSlider.on("input", function () {
      convertNumberInput.val(this.value);
      updateTierInformation(calculateEffectiveValue(parseInt(this.value, 10)));
      updateProgressBar(this);
    });
  
    convertNumberInput.on("input", function () {
      convertRangeSlider.val(this.value);
      updateTierInformation(calculateEffectiveValue(parseInt(this.value, 10)));
      updateProgressBar(convertRangeSlider[0]);
    });
  
    // Function to update tier information and display pricing based on the calculated effective value
    function updateTierInformation(effectiveValue) {
      let tierText, tierRange, priceText;
  
      if (effectiveValue < 50) {
        tierText = "Tier 1";
        tierRange = "0 - 50";
        priceText = "$30";
      } else if (effectiveValue < 500) {
        tierText = "Tier 2";
        tierRange = "51 - 500";
        priceText = "$300";
      } else if (effectiveValue < 1000) {
        tierText = "Tier 3";
        tierRange = "501 - 1,000";
        priceText = "$575";
      } else if (effectiveValue < 2000) {
        tierText = "Tier 4";
        tierRange = "1,001 - 2,000";
        priceText = "$1,100";
      } else if (effectiveValue < 3000) {
        tierText = "Tier 5";
        tierRange = "2,001 - 3,000";
        priceText = "$1,575";
      } else if (effectiveValue < 4000) {
        tierText = "Tier 6";
        tierRange = "3,001 - 4,000";
        priceText = "$2,000";
      } else {
        tierText = "Tier 7";
        tierRange = "$4,000";
        priceText = "Contact us for custom pricing";
      }
  
      // Update HTML content
      $('[data-el="convert-tier"]').text(tierText);
      $('[data-el="convert-tier-range"]').text(tierRange);
      $('[data-el="convert-tier-price"]').text(priceText);
  
      console.log(
        `Effective Value: ${effectiveValue} | ${tierText}, Range: ${tierRange}, Price: ${priceText}`
      );
    }
  
    // Update progress bar based on the slider value
    function updateProgressBar(slider) {
      const percentage =
        (100 * (slider.value - slider.min)) / (slider.max - slider.min);
      $(slider).css("--progress", `${percentage}%`);
    }
  });
  