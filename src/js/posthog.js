// var path = window.location.pathname;

// In case of ad blocker, posthog experiments won't load.
// You can use /experiments.js file to create a default path
// Record session for the following pages
if (
  path.includes('/l/') || path.includes('/lp/') || path.includes('/lc/') // ads landing pages
  ||
  path.includes('/demo') // demo funnel
  ||
  path.includes('/signup') // signup funnels
  ||
  path.includes('/pages/') // landing pages
  ||
  path.includes('/comparison') // MOFU pages
) {
  posthog.onFeatureFlags(function() {
    if (posthog.isFeatureEnabled('all-visitors')) {
      window.posthog.startSessionRecording();
    }
  })
}
window.addEventListener('load', function() {
  function showLogos() {
    const loc_code = sessionStorage.getItem("loc_code");

    if (loc_code && loc_code != "") {
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
  }
  
  function handleFeatureFlagsDemoTest() {
    // Check if PostHog script is available
    if (typeof posthog !== 'undefined' && posthog && typeof posthog.feature_flags !== 'undefined') {
      posthog.onFeatureFlags(() => {
        // Override the 'layout-test' feature flag
        posthog.feature_flags.override({
          'layout-test': 'test'
        })
        if (posthog.getFeatureFlag('layout-test') === 'test') {
          showLogos()
        } else {
          setTimeout(function() {
            window.location = 'https://gorgiasio.webflow.io/demo'
          }, 1000)
        }
        // Clear the overrides for all flags
        posthog.feature_flags.clearOverrides();
      })
    } else {
      // PostHog script is not available yet
      console.log('PostHog script is not available yet');
    }
  }

  // Callback function to handle feature flags for /pages/home-draft, /demo, and /demo-test paths
  function handleFeatureFlagsCommon() {
    // Check if PostHog script is available
    if (typeof posthog !== 'undefined' && posthog && typeof posthog.feature_flags !== 'undefined') {
      var logosToSelect = document.getElementsByClassName("customer_logos-collection-wrapper");
      if (logosToSelect.length > 0) {
        posthog.onFeatureFlags(() => {
          posthog.feature_flags.override({
            'customer-logos': 'variant'
          }); // to comment after testing
          if (posthog.getFeatureFlag('customer-logos') === 'variant') {
            showLogos()
          } else {
            logosToSelect[0].style.display = 'block';
            logosToSelect[6].style.display = 'block'; //mobile one
            // It's a good idea to let control variant always be the default behaviour,
            // so if something goes wrong with flag evaluation, you don't break your app.
          }
          // Clear the overrides for all flags
          posthog.feature_flags.clearOverrides();
        })
      }
    } else {
      // PostHog script is not available yet
      console.log('PostHog script is not available yet');
    }
  }

  if (path === '/demo-test') {
    handleFeatureFlagsDemoTest()
  } else if (path === '/pages/home-draft' || path === '/demo' || path === '/demo-test') {
    handleFeatureFlagsCommon();
  }
})
