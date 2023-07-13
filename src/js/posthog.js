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

if (path === "/demo-2") showLogos()

if (path === "/pages/home-draft" || path === "/demo") {
  const logosToSelect = document.getElementsByClassName(
    "customer_logos-collection-wrapper"
  )
  // first we show main wrapper in order to have smooth transition if posthog redirects to demo-2
  // main wrapper is hidden from webflow
  const mainWrapper = document.getElementsByClassName('demo_main-wrapper')[0]
  
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
          if (posthog.getFeatureFlag("test_funnel_demo-2") === "test") {
            window.location = "https://www.gorgias.com/demo-2"
          } else {
            showLogos(logosToSelect)
          }
          // after posthog chooses which route we show again
          mainWrapper && (mainWrapper.style.display = 'block')
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

function showLogos(logosToSelect) {
  let logos = logosToSelect
  if (!logosToSelect) {
    logos = document.getElementsByClassName(
    "customer_logos-collection-wrapper"
    )
  }
  
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
      logos[0].style.display = "none"
      const showLogosByCountry = Array.from(logosToSelect).filter((el) =>
        el.classList.contains(countryToWebflowIdentifier[loc_code])
      )
      showLogosByCountry.forEach((el) => {
        el.style.display = "block"
      })
    } else {
      logos[0].style.display = "block"
      logos[6].style.display = "block" //mobile one
    }
  }
}
