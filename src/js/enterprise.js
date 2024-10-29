// Handles card animation on the slider, targets the card following the .is-next-slide and applies styles to the card's children
window.fsComponents = window.fsComponents || [];
window.fsComponents.push([
  'slider',
  (sliderInstances) => {
    console.log('Slider component loaded!');

    // Loop through each slider instance
    sliderInstances.forEach((sliderInstance, index) => {
      console.log(`Configuring slider instance #${index + 1}`);

      // Add event listener for slide change
      sliderInstance.on('slideChange', function () {
        console.log(`Slide changed to index: ${sliderInstance.activeIndex}`);

        // Reset all flip cards to their initial state
        sliderInstance.slides.forEach((slide, slideIndex) => {
          const cardFront = slide.querySelector('.shopify-reviews_card-front');
          const reviewCard = slide.querySelector('.shopify-reviews_card');

          if (cardFront) {
            cardFront.style.opacity = ''; // Reset to default
            console.log(`Reset display for .shopify-reviews_card-front on slide #${slideIndex + 1}`);
          }
          if (reviewCard) {
            reviewCard.style.opacity = ''; // Reset to default
            console.log(`Reset opacity for .shopify-reviews_card on slide #${slideIndex + 1}`);
          }
        });

        // Find the current slide with 'is-slide-next' and style the next slide's children
        sliderInstance.slides.forEach((slide, slideIndex) => {
          if (slide.classList.contains('is-slide-next')) {
            console.log(`Slide #${slideIndex + 1} has 'is-slide-next' class.`);

            // Target the next flip card in the DOM
            const nextFlipCard = slide.nextElementSibling;
            if (nextFlipCard && nextFlipCard.classList.contains('shopify-reviews_flip-card')) {
              console.log(`Applying styles to next .shopify-reviews_flip-card after slide #${slideIndex + 1}`);

              // Apply styles to child elements of the next flip card
              const nextCardFront = nextFlipCard.querySelector('.shopify-reviews_card-front');
              const nextReviewCard = nextFlipCard.querySelector('.shopify-reviews_card');

              if (nextCardFront) {
                nextCardFront.style.opacity = '0';
                console.log(`Hid .shopify-reviews_card-front for next slide`);
              }
              if (nextReviewCard) {
                nextReviewCard.style.opacity = '1';
                console.log(`Set opacity for .shopify-reviews_card on next slide`);
              }
            }
          }
        });
      });
    });
  },
]);

// Checks users IP and displays a marquee corresponding to his location
// Define the EMEA countries based on country codes
const emeaCountries = [
    "AL", "DZ", "AD", "AO", "AM", "AT", "AZ", "BH", "BY", "BE", "BJ", "BA", "BW", "BG", "BF", "BI", "CM", "CV",
    "CF", "TD", "KM", "CG", "CD", "CI", "HR", "CY", "CZ", "DK", "DJ", "EG", "GQ", "ER", "EE", "ET", "FI", "FR",
    "GA", "GM", "GE", "DE", "GH", "GR", "GN", "GW", "HU", "IS", "IR", "IQ", "IE", "IL", "IT", "JO", "KZ", "KE",
    "KW", "KG", "LV", "LB", "LS", "LR", "LY", "LT", "LU", "MG", "MW", "ML", "MT", "MR", "MU", "MD", "MC", "ME",
    "MA", "MZ", "NA", "NL", "NE", "NG", "NO", "OM", "PS", "PL", "PT", "QA", "RO", "RU", "RW", "ST", "SA", "SN",
    "RS", "SC", "SL", "SK", "SI", "ZA", "ES", "SD", "SZ", "SE", "CH", "SY", "TZ", "TG", "TN", "TR", "TM", "UG",
    "UA", "AE", "GB", "UZ", "EH", "ZM", "ZW"
  ];
  
  // Fetch user's location using IP
  fetch('https://ipinfo.io/json?token=16b2fa7a6332cb')
    .then(response => response.json())
    .then(data => {
      const userCountry = data.country; // Country code (e.g., "US", "FR")
      console.log("User country:", userCountry);
  
      // Select elements
      const marqueeNa = document.querySelector('[data-el="marquee-na"]');
      const marqueeEmea = document.querySelector('[data-el="marquee-emea"]');
  
      // Check if the user's country is in the EMEA region
      if (emeaCountries.includes(userCountry)) {
        // User is in EMEA - show EMEA marquee and hide NA marquee
        marqueeEmea.classList.remove('is-hidden');
        marqueeNa.classList.add('is-hidden');
        console.log("User is in EMEA, showing EMEA marquee");
      } else {
        // User is outside EMEA - show NA marquee and hide EMEA marquee
        marqueeEmea.classList.add('is-hidden');
        marqueeNa.classList.remove('is-hidden');
        console.log("User is outside EMEA, showing NA marquee");
      }
    })
    .catch(error => {
      console.error("Error fetching IP information:", error);
    });