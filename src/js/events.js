var Webflow = Webflow || [];
Webflow.push(function () {
    // Disable console.logs for production
    //console.log = function () {};
    console.log("DOM fully loaded and parsed");
  
    // Select all events_item elements
    const eventsItems = document.querySelectorAll(".events_item");
    console.log(`Found ${eventsItems.length} events_item elements`);
  
    // Function to extract the date part from the text
    function extractDate(text) {
      const datePattern =
        /\b(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}\b/;
      const match = text.match(datePattern);
      return match ? match[0] : null;
    }
  
    // Loop through each events_item
    eventsItems.forEach((item, index) => {
      console.log(`Processing events_item ${index + 1}`);
  
      // Get the elements with data-item="start-date" and data-item="end-date"
      const startDateElement = item.querySelector('[data-item="start-date"]');
      const endDateElement = item.querySelector('[data-item="end-date"]');
  
      // Check if both elements exist
      if (startDateElement && endDateElement) {
        console.log("Found start-date and end-date elements");
  
        // Get the text content of start-date and end-date
        const startDateText = startDateElement.textContent.trim();
        const endDateText = endDateElement.textContent.trim();
  
        console.log(
          `Full start date: ${startDateText}, Full end date: ${endDateText}`
        );
  
        // Extract the date parts
        const startDatePart = extractDate(startDateText);
        const endDatePart = extractDate(endDateText);
  
        console.log(
          `Extracted start date: ${startDatePart}, Extracted end date: ${endDatePart}`
        );
  
        // Compare the extracted date parts
        if (startDatePart && endDatePart && startDatePart === endDatePart) {
          console.log("Start date and end date parts are equal");
  
          // Find all elements with data-el="date" within the current events_item
          const dateElements = item.querySelectorAll('[data-el="date"]');
          console.log(`Found ${dateElements.length} date elements to remove`);
  
          // Loop through the found elements and remove each
          dateElements.forEach((dateEl) => {
            dateEl.remove();
            console.log("Removed a date element");
          });
        } else {
          console.log("Start date and end date parts are not equal");
        }
      } else {
        console.log("Start-date or end-date element not found");
      }
    });
  
    eventsItems.forEach((item, index) => {
      const cityElement = item.querySelector('[fs-cmsfilter-field="city"]');
      const countryElement = item.querySelector('[fs-cmsfilter-field="country"]');
  
      if (cityElement && countryElement) {
        // Get city and country text
        const cityText = cityElement.textContent.trim();
        const countryText = countryElement.textContent.trim();
  
        if (cityText === countryText) {
          console.log("City and country are equal");
  
          // Remove the country element
          countryElement.remove();
          console.log("Country removed");
  
          // Check and remove the comma following the city element if it exists
          const commaElement = cityElement.nextElementSibling;
          if (
            commaElement &&
            commaElement.tagName === "DIV" &&
            commaElement.textContent.trim() === ","
          ) {
            commaElement.remove();
            console.log("Comma removed");
          }
        }
      }
    });
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
  
    // Select the single events_meta element
    const eventsMeta = document.querySelector(".events_meta");
  
    // Function to extract the date part from the text
    function extractDate(text) {
      const datePattern =
        /\b(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}\b/;
      const match = text.match(datePattern);
      return match ? match[0] : null;
    }
  
    // Check if the events_meta element exists
    if (eventsMeta) {
      console.log("Found events_meta element");
  
      // Get the elements with data-item="start-date" and data-item="end-date" within events_meta
      const startDateElement = eventsMeta.querySelector(
        '[data-item="start-date"]'
      );
      const endDateElement = eventsMeta.querySelector('[data-item="end-date"]');
  
      // Check if both elements exist
      if (startDateElement && endDateElement) {
        console.log("Found start-date and end-date elements");
  
        // Get the text content of start-date and end-date
        const startDateText = startDateElement.textContent.trim();
        const endDateText = endDateElement.textContent.trim();
  
        console.log(
          `Full start date: ${startDateText}, Full end date: ${endDateText}`
        );
  
        // Extract the date parts
        const startDatePart = extractDate(startDateText);
        const endDatePart = extractDate(endDateText);
  
        console.log(
          `Extracted start date: ${startDatePart}, Extracted end date: ${endDatePart}`
        );
  
        // Compare the extracted date parts
        if (startDatePart && endDatePart && startDatePart === endDatePart) {
          console.log("Start date and end date parts are equal");
  
          // Find all elements with data-el="date" within the events_meta
          const dateElements = eventsMeta.querySelectorAll('[data-el="date"]');
          console.log(`Found ${dateElements.length} date elements to remove`);
  
          // Loop through the found elements and remove each
          dateElements.forEach((dateEl) => {
            dateEl.remove();
            console.log("Removed a date element");
          });
        } else {
          console.log("Start date and end date parts are not equal");
        }
      } else {
        console.log("Start-date or end-date element not found");
      }
    } else {
      console.log("events_meta element not found");
    }
  });

  // Add query parameters to the registration links

    // Define the query parameter to add
    const newParam = { utm_source: "events" };
  
    // Find all elements with the specified data attribute
    const eventButtons = document.querySelectorAll('[data-el="events-btn"]');
  
    // Iterate over each button and append the new query parameter
    eventButtons.forEach(button => {
      // Get the current href of the button
      const originalUrl = new URL(button.href);
  
      // Append the new query parameter to the original URL
      originalUrl.searchParams.append('utm_source', newParam.utm_source);
  
      // Set the new URL with the query parameter back to the button
      button.href = originalUrl.toString();
    });
  
  document.addEventListener("DOMContentLoaded", function () {
    // Check if the viewport width is greater than 768px
    if (window.innerWidth > 768) {
      function initializeSplide() {
        var splideElement = document.getElementById("splide");
  
        // Check if the Splide instance already exists to avoid reinitializing
        if (
          splideElement &&
          !splideElement.classList.contains("splide_initialized")
        ) {
          var splide = new Splide(splideElement, {
            type: "loop",
            perPage: 1,
            pagination: true, // Enable pagination
            breakpoints: {
              768: {
                // Adjust this breakpoint according to your needs
                perPage: 1,
              },
            },
          }).mount();
  
          // Mark the element as initialized
          splideElement.classList.add("splide_initialized");
        }
      }
  
      // Initialize Splide on load
      initializeSplide();
  
      // Reinitialize Splide on resize if the viewport is resized above 768px
      window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
          initializeSplide();
        }
      });
    }

  });
  


  