var Webflow = Webflow || [];
Webflow.push(function () {
    var path = window.location.pathname;
    var url = window.location.href;
    var debug = url.includes('debug');
    var scriptBase = debug ? "http://127.0.0.1:5500" : "https://cdn.jsdelivr.net/gh/gorgias/gorgias-webflow@latest";
    // Get HTML head element

    var head = document.getElementsByTagName('HEAD')[0];
        
        // pricing page
        if(path == '/pricing' || path == '/github-test'){
            (async () => {
                import( scriptBase + '/src/js/pricing.js');
            })();
            // Create new link Element
            var link = document.createElement('link');
            // set the attributes for link element
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = scriptBase + '/src/css/pricing.css';
            // Append link element to HTML head
            head.appendChild(link);

            console.log('test css');
            import('https://cdn.jsdelivr.net/npm/@finsweet/attributes-mirrorclick@1/mirrorclick.js');
        }
        


})
