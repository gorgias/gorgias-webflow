// var path = window.location.pathname;

// In case of ad blocker, posthog experiments won't load.
// You can use /experiments.js file to create a default path

// checks if the posthog.onFeatureFlags event listener is available. 
// If it is available, the Promise resolves. If it is not available, the posthog.reloadFeatureFlags() method is called to reload the feature flags. 
// After reloading, it checks again if the event listener is now available. 
// If it is, the Promise resolves. If it is still not available, the Promise rejects with an error message.

function checkAndReloadFeatureFlags() {
  return new Promise((resolve, reject) => {
    if (typeof posthog.onFeatureFlags === 'function') {
      resolve()
    } else {
      posthog.reloadFeatureFlags().then(() => {
        if (typeof posthog.onFeatureFlags === 'function') {
          resolve()
        } else {
          reject('Unable to reload feature flags.')
        }
      }).catch((error) => {
        reject('Error reloading feature flags: ' + error)
      })
    }
  });
}

function showLogos(logosToSelect) {
  const loc_code = sessionStorage.getItem("loc_code")

  if (loc_code && loc_code != "") {
    const countryToWebflowIdentifier = {
      "au": 'australia',
      "ca": 'canada',
      "fr": 'france',
      "uk": 'united-kingdom',
      "gb": 'united-kingdom',
      "us": 'united-states'
    }

    if (countryToWebflowIdentifier.hasOwnProperty(loc_code)) {
      logosToSelect[0].style.display = "none"
      const showLogosByCountry = Array.from(logosToSelect).filter(el => el.classList.contains(countryToWebflowIdentifier[loc_code]))
      showLogosByCountry.forEach(el => {
        el.style.display = 'block'
      })
    } else {
      logosToSelect[0].style.display = 'block'
      logosToSelect[6].style.display = 'block' //mobile one
    }
  }
}

// Callback function to handle feature flags for /demo-test path
function handleFeatureFlagsDemoTest() {
  const logosToSelect = document.getElementsByClassName("customer_logos-collection-wrapper")
  checkAndReloadFeatureFlags()
    .then(() => {
      posthog.onFeatureFlags(() => {
        if (posthog.getFeatureFlag('layout-test') === 'test') {
          const layout = document.getElementsByClassName('page_demo-new-layout')[0]
          if (layout) {
            layout.style.display = 'block'
            showLogos(logosToSelect)
          }
        } else {
          window.location = 'https://gorgiasio.webflow.io/demo'
        }
      })
    })
    .catch((error) => {
      console.error(error)
    })
}

// Callback function to handle feature flags for /pages/home-draft, /demo, and /demo-test paths
function handleFeatureFlagsCommon() {
  const logosToSelect = document.getElementsByClassName("customer_logos-collection-wrapper")
  if (logosToSelect.length > 0) {
    checkAndReloadFeatureFlags()
      .then(() => {
        posthog.onFeatureFlags(() => {
          // posthog.feature_flags.override({
          // 'customer-logos': 'variant'
          // }); // to comment after testing
          if (posthog.getFeatureFlag('customer-logos') === 'variant') {
            showLogos(logosToSelect)
          } else {
            logosToSelect[0].style.display = 'block'
            logosToSelect[6].style.display = 'block' //mobile one
            // It's a good idea to let control variant always be the default behaviour,
            // so if something goes wrong with flag evaluation, you don't break your app.
          }
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

if (posthog.__loaded) {
  if (path === '/demo-test') handleFeatureFlagsDemoTest()
  if (path === '/pages/home-draft' || path === '/demo') handleFeatureFlagsCommon()
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
    checkAndReloadFeatureFlags()
      .then(() => {
        posthog.onFeatureFlags(function() {
          if (posthog.isFeatureEnabled('all-visitors')) {
            window.posthog.startSessionRecording();
          }
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
