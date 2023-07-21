//var path = window.location.pathname;

// In case of ad blocker, posthog experiments won't load.
// You can use /experiments.js file to create a default path
// Record session for the following pages
if (
  path.includes("/l/") ||
  path.includes("/lp/") ||
  path.includes("/lc/") || // ads landing pages
  path.includes("/demo") || // demo funnel
  path.includes("/signup") || // signup funnels
  path.includes("/pages/") || // landing pages
  path.includes("/comparison") // MOFU pages
) {
  posthog.onFeatureFlags(function() {
    if (posthog.isFeatureEnabled("all-visitors")) {
      window.posthog.startSessionRecording()
    }
  })
}

if (path === "/demo-test-wider") {
  const logosToSelect = document.getElementsByClassName(
    "customer_logos-collection-wrapper"
  )
  if (logosToSelect.length > 0) {
    checkAndReloadFeatureFlags()
      .then(() => {
        posthog.onFeatureFlags(() => {
           // if posthog chooses test flag we show new layout and treat logic for logos
          if (posthog.getFeatureFlag("test_funnel_demo-2") === "test") {
            // we remove old layout because of chilipaper id #wrapper-chilipiper-embed
            // which has multiple id instances and will not load the chilipaper iframe
            removeElementsByClassName('page_demo-old-layout')
            // we show new layout and logogs
            const newLayoutDemo = document.getElementsByClassName('page_demo-new-layout')[0]
            newLayoutDemo.style.display = 'block'
            showLogos(logosToSelect, true)
          } else {
            // if posthog chooses control flag we show old layout and treat logic for logos
            const oldLayoutDemo = document.getElementsByClassName('page_demo-old-layout')[0]
            oldLayoutDemo.style.display = 'block'
            showLogos(logosToSelect)
          }
        })
      })
      .catch((error) => {
        console.error(error);
      })
  }
}

if (path === "/pages/home-draft" || path === "/demo") {
  const logosToSelect = document.getElementsByClassName(
    "customer_logos-collection-wrapper"
  )
  // first we show main wrapper in order to have smooth transition if posthog redirects to demo-2
  // main wrapper is hidden from webflow

  if (logosToSelect.length > 0) {
    checkAndReloadFeatureFlags()
      .then(() => {
        posthog.onFeatureFlags(() => {
          // posthog.feature_flags.override({'customer-logos': 'variant'}); // to comment after testing
          if (posthog.getFeatureFlag("customer-logos") === "variant") {
            showLogos(logosToSelect)
          } else {
            logosToSelect[0].style.display = "block"
            logosToSelect[6].style.display = "block" //mobile one
          }
        })
      })
      .catch((error) => {
        console.error(error);
      })
  }
}

// checks if the posthog.onFeatureFlags event listener is available.
// If it is available, the Promise resolves. If it is not available, the posthog.reloadFeatureFlags() method is called to reload the feature flags.
// After reloading, it checks again if the event listener is now available.
// If it is, the Promise resolves. If it is still not available, the Promise rejects with an error message.

function checkAndReloadFeatureFlags() {
  return new Promise((resolve, reject) => {
    if (typeof posthog.onFeatureFlags === "function") {
      resolve();
    } else {
      posthog
        .reloadFeatureFlags()
        .then(() => {
          if (typeof posthog.onFeatureFlags === "function") {
            resolve();
          } else {
            reject("Unable to reload feature flags.");
          }
        })
        .catch((error) => {
          reject("Error reloading feature flags: " + error);
        });
    }
  });
}

function showLogos(logos, newLayout) {
  // we add parameter newLayout to see if it is new or old demo layout we are showing logos for
  const loc_code = sessionStorage.getItem("loc_code")
  if (loc_code && loc_code != "") {
    const countryToWebflowIdentifier = {
      au: "australia",
      ca: "canada",
      fr: "france",
      uk: "united-kingdom",
      gb: "united-kingdom",
      us: "united-states",
    }

    if (countryToWebflowIdentifier.hasOwnProperty(loc_code)) {
      if (newLayout) {
        logos[12].style.display = "none"
      } else {
        logos[0].style.display = "none"
      }
      
      const showLogosByCountry = Array.from(logos).filter((el) =>
        el.classList.contains(countryToWebflowIdentifier[loc_code])
      )
      showLogosByCountry.forEach((el) => {
        el.style.display = "block"
      })

    } else {
      if (newLayout) {
        logos[12].style.display = "block"
      } else {
        logos[0].style.display = "block"
        logos[6].style.display = "block" //mobile one
      }
    }
  }
}

function removeElementsByClassName(className) {
  const elementsToRemove = document.getElementsByClassName(className);

  // Check if elements with the specified class exist
  if (elementsToRemove.length > 0) {
    // Use the `remove()` method if supported, otherwise use `removeChild()`
    if (typeof elementsToRemove[0].remove === 'function') {
      // Use the `remove()` method (newer browsers)
      for (const element of elementsToRemove) {
        element.remove();
      }
    } else {
      // Use the `removeChild()` method (older browsers)
      for (const element of elementsToRemove) {
        const parentElement = element.parentNode;
        parentElement.removeChild(element);
      }
    }
  }
}
