var path = window.location.pathname;


// Session record for all ads landing pages
if(path.includes('/l/') || path.includes('/lp/') || path.includes('/lc/')){
    posthog.onFeatureFlags(function() {
        if (posthog.isFeatureEnabled('all-visitors')) {
            window.posthog.startSessionRecording();
        }
    })
}

