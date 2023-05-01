// scripts belows requires Jquery or are not crucial for website work
var Webflow = Webflow || [];
Webflow.push(function () {
    var path = window.location.pathname;
    var url = window.location.href;
    var isDebug = url.includes('debug=gorgias');
    var scriptBase = isDebug ? "http://127.0.0.1:5500" : "https://cdn.jsdelivr.net/gh/gorgias/gorgias-webflow@latest";
    var minBase = isDebug ? "" : ".min";

    newScript(scriptBase + '/src/js/autocompletefields'+minBase+'.js','body',1);
    newScript(scriptBase + '/src/js/demo'+minBase+'.js','body',1);
    newScript( 'https://js.na.chilipiper.com/marketing.js','body',1);
    newScript(scriptBase + '/src/js/schema'+minBase+'.js','body',1);
    newScript(scriptBase + '/src/js/gorgiaschat'+minBase+'.js','body',1);
    newStyle(scriptBase + '/src/css/all'+minBase+'.css','body');
    newStyle(scriptBase + '/src/css/chilipiper'+minBase+'.css','body');

    // pricing page
    if(path === '/pricing' || path === '/pricing-test/pricing' || path === '/pages/template-long' || path === '/pages/phone' 
      || path === '/pages/customer-service' || path === '/pages/ticketing-system' || path === '/pages/live-chat'
      || path === '/pages/helpdesk' || path === '/pages/crm') {
        // [Attributes by Finsweet] Mirrorclick
        newScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-mirrorclick@1/mirrorclick.js','body',1);
        newScript(scriptBase + '/src/js/splide'+minBase+'.js','head',1)
        newStyle(scriptBase + '/src/css/pricing'+minBase+'.css','body');
        newScript(scriptBase + '/src/js/pricing'+minBase+'.js','head',1);
    }
    // blog pages
    if(path.includes('/blog/')) {
        // [Attributes by Finsweet] Code Highlight
        newScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-codehighlight@1/codehighlight.js','head',1);
        // [Attributes by Finsweet] Powerful Rich Text
        newScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-richtext@1/richtext.js','head',1);
        // Hubspot CTA
        newScript('https://js.hscta.net/cta/current.js','head',0);
        // [Attributes by Finsweet] Social Share
        newScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-socialshare@1/socialshare.js','head',1);
        // Images zoom in library
        newScript('https://cdn.jsdelivr.net/npm/medium-zoom@1.0.3/dist/medium-zoom.min.js','body',0);
        // custom code
        newStyle(scriptBase + '/src/css/blog'+minBase+'.css','body');
        newScript(scriptBase + '/src/js/blog'+minBase+'.js','body',1);
    }
})

