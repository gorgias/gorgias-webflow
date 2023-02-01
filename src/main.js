var Webflow = Webflow || [];
Webflow.push(function () {
    var path = window.location.pathname;
    var url = window.location.href;
    var debug = url.includes('debug');
    var scriptBase = debug ? "http://127.0.0.1:5500" : "https://cdn.jsdelivr.net/gh/gorgias/gorgias-webflow@latest";

    (async () => {
        
        // pricing page
        if(path == '/pricing' || path == '/github-test'){
            import( scriptBase + '/src/js/pricing.js');
            import('https://cdn.jsdelivr.net/npm/@finsweet/attributes-mirrorclick@1/mirrorclick.js');
        }
        
    })();

})
