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
  path.includes("/comparison") || // MOFU pages
  path.includes("convert") // convert pages
) {
  posthog.onFeatureFlags(function() {
    if (posthog.isFeatureEnabled("all-visitors")) {
      window.posthog.startSessionRecording()
    }
  })
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