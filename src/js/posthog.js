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

if (path === '/pages/home-draft') {
  posthog.onFeatureFlags(() => {
    posthog.feature_flags.override({'customer-logos': 'test'});
    const logosToSelect = document.getElementsByClassName("customer_logo-collection");
    
    if (posthog.getFeatureFlag('customer-logos') === 'test') {
      $.ajax({
        url: 'https://cloudflare.com/cdn-cgi/trace',
        success: function(data) {
          const country = data.match(/loc=(.+)/)[1];
          const countryToWebflowIdentifier = {
            "AU": 'australia',
            "CA": 'canada',
            "FR": 'france',
            "UK": 'united-kingdom',
            "US": 'united-states'
          };

          if (countryToWebflowIdentifier.hasOwnProperty(country)) {
            logosToSelect[0].style.display = "none";
            const showLogosByCountry = Array.from(logosToSelect)
              .find(el => el.classList.contains(countryToWebflowIdentifier[country]));
            if (showLogosByCountry) {
              showLogosByCountry.style.display = 'block';
            }
          } else {
             logosToSelect[0].style.display = 'block';
          }
        }
      })
    } else {
      logosToSelect[0].style.display = 'block';
      // It's a good idea to let control variant always be the default behaviour,
      // so if something goes wrong with flag evaluation, you don't break your app.
    }

    // Clear the overrides for all flags
    // posthog.feature_flags.clearOverrides();
  })
} 


