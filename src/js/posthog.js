// var path = window.location.pathname;

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
// This code will execute the handleFeatureFlags function when the PostHog script is available. 
// It will then override the feature flag and execute the corresponding code based on the value of the feature flag.
// If the PostHog script hasn't loaded yet, it will wait for the script to load and trigger the callback when it becomes available.
// Callback function to handle feature flags for /demo-test path
function handleFeatureFlagsDemoTest() {
  // Check if PostHog script is available
  if (typeof posthog !== 'undefined') {
    posthog.onFeatureFlags(() => {
      // Override the 'layout-test' feature flag
      posthog.feature_flags.override({
        'layout-test': 'test'
      })
      if (posthog.getFeatureFlag('layout-test') === 'test') {
        const hiddenElementTest = document.getElementsByClassName('page_demo-new-layout')[0]
        hiddenElementTest.style.display = 'block'
      } else {
        const hiddenElementControl = document.getElementsByClassName('page_demo-old-layout')[0]
        hiddenElementControl.style.display = 'block'
      }
    })
  } else {
    // PostHog script is not available yet
    console.log('PostHog script is not available yet');
  }
}

// Callback function to handle feature flags for /pages/home-draft, /demo, and /demo-test paths
function handleFeatureFlagsCommon() {
  // Check if PostHog script is available
  if (typeof posthog !== 'undefined') {
    var logosToSelect = document.getElementsByClassName("customer_logos-collection-wrapper");
    if (logosToSelect.length > 0) {
      posthog.onFeatureFlags(() => {
        posthog.feature_flags.override({
          'customer-logos': 'variant'
        }); // to comment after testing
        if (posthog.getFeatureFlag('customer-logos') === 'variant') {
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
              if (path === '/demo-test') {
                logosToSelect[12].style.display = 'block'
              }
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
  } else {
    // PostHog script is not available yet
    console.log('PostHog script is not available yet');
  }
}

// Check the path variable and execute the appropriate code
if (path === '/demo-test') {
  // Check if PostHog script has loaded
  if (typeof posthog !== 'undefined') {
    // PostHog script has already loaded, trigger the callback immediately
    handleFeatureFlagsDemoTest();
  } else {
    // PostHog script hasn't loaded yet, add an event listener to trigger the callback
    document.addEventListener('posthog-loaded', handleFeatureFlagsDemoTest);
  }
} else if (path === '/pages/home-draft' || path === '/demo' || path === '/demo-test') {
  // Check if PostHog script has loaded
  if (typeof posthog !== 'undefined') {
    // PostHog script has already loaded, trigger the callback immediately
    handleFeatureFlagsCommon();
  } else {
    // PostHog script hasn't loaded yet, add an event listener to trigger the callback
    document.addEventListener('posthog-loaded', handleFeatureFlagsCommon);
  }
}
