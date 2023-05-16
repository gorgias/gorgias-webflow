var path = window.location.pathname;


// Record session for the following pages
if(
    path.includes('/l/') || path.includes('/lp/') || path.includes('/lc/') // ads landing pages
    || path.includes('/demo') // demo funnel
    || path.includes('/signup') // signup funnels
    || path.includes('/pages/') // landing pages
    || path.includes('/comparison') // MOFU pages
    ){
    posthog.onFeatureFlags(function() {
        if (posthog.isFeatureEnabled('all-visitors')) {
            window.posthog.startSessionRecording();
        }
    })
}

if (path === '/pages/home-draft' || path === '/demo') {
  const logosToSelect = document.getElementsByClassName("customer_logos-collection-wrapper");

  if(logosToSelect.length > 0){
    var displayDefault = 0; 
    posthog.onFeatureFlags(() => {

      displayDefault = 1; 
      // posthog.feature_flags.override({'customer-logos': 'variant'}); // to comment after testing
      if (posthog.getFeatureFlag('customer-logos') === 'variant') {
          const loc_code = sessionStorage.getItem("loc_code");
  
          if(loc_code && loc_code!=""){
            const countryToWebflowIdentifier = {
              "au": 'australia',
              "ca": 'canada',
              "fr": 'france',
              "uk": 'united-kingdom',
              "gb": 'united-kingdom',
              "us": 'united-states'
            };
  
            if (countryToWebflowIdentifier.hasOwnProperty(loc_code)) {
              logosToSelect[0].style.display = "none";
              const showLogosByCountry = Array.from(logosToSelect).filter(el => el.classList.contains(countryToWebflowIdentifier[loc_code]));
              showLogosByCountry.forEach(el => {
                el.style.display = 'block';
              });
            } else {
              logosToSelect[0].style.display = 'block';
              logosToSelect[6].style.display = 'block'; //mobile one
            }
  
          }
  
      } else {
        logosToSelect[0].style.display = 'block';
        logosToSelect[6].style.display = 'block'; //mobile one

        // It's a good idea to let control variant always be the default behaviour,
        // so if something goes wrong with flag evaluation, you don't break your app.
      }
  
      // Clear the overrides for all flags
      // posthog.feature_flags.clearOverrides();
    })
  }

} 

function displayDefaultCustomerLogosList() {
  setTimeout(function() {
    var elements = document.getElementsByClassName("customer_logos-collection-wrapper");
    
    // Check if none of the elements are displayed
    var noneDisplayed = true;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].style.display == "block") {
        noneDisplayed = false;
        break;
      }
    }
    // If none of the elements are displayed, display the first one
    if (noneDisplayed) {
      elements[0].style.display = "block";
    }
  }, 4000); // 4 seconds
}

displayDefaultCustomerLogosList();
