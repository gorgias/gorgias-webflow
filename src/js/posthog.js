//var path = window.location.pathname;

// In case of ad blocker, posthog experiments won't load.
// You can use /experiments.js file to create a default path
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

if (path === '/demo-test') {
  posthog.onFeatureFlags(() => {
    posthog.feature_flags.override({
      'layout-test': 'test'
    })
    if (posthog.getFeatureFlag('layout-test') === 'test') {
      const hiddenElementTest = document.getElementsByClassName('page_demo-new-layout')[0]
      hiddenElementTest && hiddenElementTest.style.display = 'block'
    } else {
      const hiddenElementControl = document.getElementsByClassName('page_demo-old-layout')[0]
      hiddenElementControl && hiddenElementControl.style.display = 'block'
    }
  })
}

if (path === '/pages/home-draft' || path === '/demo') {
  var logosToSelect = document.getElementsByClassName("customer_logos-collection-wrapper");
  if(logosToSelect.length > 0){
    posthog.onFeatureFlags(() => {
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
