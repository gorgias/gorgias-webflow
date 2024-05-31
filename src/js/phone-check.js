window.onload = () => {
    console.log("Phone check script loaded.");
    const form = document.getElementById("signup-user-form");
    const phoneInput = document.getElementById("phone");
    const errorAlert = document.querySelector(".alert-error");
    const successAlert = document.querySelector(".alert-info");
    let iti; // Variable to hold the intl-tel-input instance
    let timeout = null;
  
    // Initialize the phone input with country code from the user's IP
    function initializePhoneInputWithCountryCode() {
      fetch("https://ipapi.co/json/")
        .then((response) => response.json())
        .then((data) => {
          console.log("Country Code:", data.country);
          initializePhoneInput(data.country.toLowerCase());
        })
        .catch((error) => {
          console.error("Error fetching country code:", error);
          initializePhoneInput("us"); // Default to US if there's an error
        });
    }
  
    // Initialize intl-tel-input with the country code
    function initializePhoneInput(countryCode) {
      iti = window.intlTelInput(phoneInput, {
        initialCountry: countryCode,
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
      phoneInput.addEventListener("countrychange", validatePhoneNumber);
    }
  
    // Validate the phone number format and send for backend validation if valid
    function validatePhoneNumber() {
      const rawInput = phoneInput.value;
      const phoneNumber = iti.getNumber();
      const isNumberValid = iti.isValidNumber();
  
      // Initially hide both alerts
      errorAlert.style.display = "none";
      successAlert.style.display = "none";
  
      // Exit validation if the input is empty and not triggered by form submission
      if (!rawInput) return;
  
      // Display error if invalid characters are detected
      if (/[^0-9\s\-\+\(\)]+/.test(rawInput)) {
        console.error("Invalid characters detected.");
        errorAlert.style.display = "block";
        return;
      }
  
      // Display error if the phone number format is incorrect
      if (!isNumberValid) {
        console.error("Phone number format is incorrect.");
        errorAlert.style.display = "block";
        return;
      }
  
      // Proceed to backend validation
      fetchValidation(phoneNumber);
    }
  
    // Fetch validation from Cloudflare Worker
    function fetchValidation(phoneNumber) {
      fetch("https://worker-little-unit-6473-joseph.gorgias.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error || (data.carrier && data.carrier.error_code !== null)) {
            throw new Error("Phone number validation failed.");
          }
          successAlert.style.display = "block"; // Show success alert on valid response
        })
        .catch((error) => {
          console.error("Fetch error or validation failure:", error.message);
          errorAlert.style.display = "block"; // Show error alert on fetch failure or validation error
        });
    }
  
    phoneInput.addEventListener("input", () => {
      // Debounce input to avoid too frequent validations
      clearTimeout(timeout);
      timeout = setTimeout(validatePhoneNumber, 1000);
    });
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!phoneInput.value) {
        errorAlert.style.display = "block"; // Display error if the phone number is required but missing
        return; // Prevent form submission if the phone field is empty
      }
      if (successAlert.style.display === "block") {
        form.submit(); // Only submit the form if the success alert is displayed
      } else {
        errorAlert.style.display = "block"; // Display error if there are errors before submitting
      }
    });
  
    initializePhoneInputWithCountryCode();
  };
  