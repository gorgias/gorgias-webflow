var path = window.location.pathname;


// Record session for the following pages
if(
    path.includes('/l/') || path.includes('/lp/') || path.includes('/lc/') // ads landing pages
    || path.includes('/demo') // demo funnel
    || path.includes('/signup')) // signup funnels
    {
    posthog.onFeatureFlags(function() {
        if (posthog.isFeatureEnabled('all-visitors')) {
            window.posthog.startSessionRecording();
        }
    })
}

