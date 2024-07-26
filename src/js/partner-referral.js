var Webflow = Webflow || [];
Webflow.push(function () {
    // Function to get query parameters from the URL
    function getQueryParams(url) {
      var params = {};
      var parser = document.createElement("a");
      parser.href = url;
      var query = parser.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
      return params;
    }
  
    // Add event listener for form ready event
    window.addEventListener("message", function (event) {
      if (
        event.data.type === "hsFormCallback" &&
        event.data.eventName === "onFormReady"
      ) {
        // console.log("Form is ready. Event data:", event.data);
  
        // Extract UTM parameters from URL
        let queryParams = getQueryParams(window.location.href);
        //console.log("Query parameters:", queryParams);
  
        let utmMedium = queryParams["referral_utm_medium"] || "";
        let utmSource = queryParams["referral_utm_source"] || "";
        let utmCampaign = queryParams["referral_utm_campaign"] || "";
  
        // console.log("UTM Medium:", utmMedium);
        // console.log("UTM Source:", utmSource);
        // console.log("UTM Campaign:", utmCampaign);
  
        // Autocomplete hidden fields with the UTM parameters
        if (utmMedium.length > 0) {
          $("input[name=referral_utm_medium]").val(utmMedium).change();
          // console.log("Set referral_utm_medium to:", utmMedium);
        } else {
          $("input[name=referral_utm_medium]").val("").change();
          // console.log("Set referral_utm_medium to empty");
        }
  
        if (utmSource.length > 0) {
          $("input[name=referral_utm_source]").val(utmSource).change();
          // console.log("Set referral_utm_source to:", utmSource);
        } else {
          $("input[name=referral_utm_source]").val("").change();
          // console.log("Set referral_utm_source to empty");
        }
  
        if (utmCampaign.length > 0) {
          $("input[name=referral_utm_campaign]").val(utmCampaign).change();
          // console.log("Set referral_utm_campaign to:", utmCampaign);
        } else {
          $("input[name=referral_utm_campaign]").val("").change();
          // console.log("Set referral_utm_campaign to empty");
        }
      }
    });
  
    function onHubSpotFormReady() {
      // Checkbox element
      const checkbox = $('input[name="0-2/bizdev_ok_to_contact"]');
  
      // Element to be displayed
      const elementToDisplay = $(".hs_0-2\\/expected_receiving_introduction_date");
  
      // Initially show the element to be displayed
      elementToDisplay.show();
  
      // Function to toggle visibility based on checkbox state
      function toggleElementVisibility() {
          if (checkbox.is(":checked")) {
              elementToDisplay.hide();
  
              // Remove required attribute
              elementToDisplay.find("input").prop("required", false);
          } else {
              elementToDisplay.show();
  
              // Set inputs inside as required
              elementToDisplay.find("input").prop("required", true);
          }
      }
  
      // Initially check the state of the checkbox
      toggleElementVisibility();
  
      // Add event listener to checkbox
      checkbox.on("change", toggleElementVisibility);
  }
  
  // Check if HubSpot form is ready
  const formCheckInterval = setInterval(function () {
      if ($("form").length > 0) {
          clearInterval(formCheckInterval);
          onHubSpotFormReady();
      }
  }, 100); // Check every 100ms
});  