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
  posthog.onFeatureFlags(() => {
    // posthog.feature_flags.override({'customer-logos': 'variant'}); // to comment after testing

    if (posthog.getFeatureFlag('customer-logos') === 'variant') {
        const logosToSelect = document.getElementsByClassName("customer_logos-collection-wrapper");
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
            const showLogosByCountry = Array.from(logosToSelect)
              .find(el => el.classList.contains(countryToWebflowIdentifier[loc_code]));
            if (showLogosByCountry) {
              showLogosByCountry.style.display = 'block';
            }
          } else {
            logosToSelect[0].style.display = 'block';
          }

        }

    } else {
      logosToSelect[0].style.display = 'block';
      // It's a good idea to let control variant always be the default behaviour,
      // so if something goes wrong with flag evaluation, you don't break your app.
    }

    // Clear the overrides for all flags
    // posthog.feature_flags.clearOverrides();
  })
} 


