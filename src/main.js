var path = window.location.pathname;
var url = window.location.href;
var debug = url.includes('debug');
scriptBase = debug ? "http://127.0.0.1:5500" : "https://cdn.jsdelivr.net/gh/gorgias/gorgias-webflow@latest";
var head = document.getElementsByTagName('HEAD')[0]; // Get HTML head element

var Webflow = Webflow || [];
Webflow.push(function () {
    // all pages
    $.getScript( scriptBase + '/src/js/all.js', function(){
        // pricing page
        if(path == '/pricing' || path == '/github-test'){
            import('https://cdn.jsdelivr.net/npm/@finsweet/attributes-mirrorclick@1/mirrorclick.js');
            newCdnStyle('/src/css/pricing.css');
            newCdnAsyncScript('/src/js/pricing.js');
        }
    });
})
