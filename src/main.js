// scripts belows requires Jquery or are not crucial for website work
const path = window.location.pathname;

var Webflow = Webflow || [];
Webflow.push(function () {
    // var path = window.location.pathname;
    var url = window.location.href;
    var isDebug = url.includes('debug=gorgias');
    var scriptBase = isDebug ? "http://127.0.0.1:5500" : "https://cdn.jsdelivr.net/gh/gorgias/gorgias-webflow@latest";
    var minBase = isDebug ? "" : ".min";

    newScript(scriptBase + '/src/js/autocompletefields'+minBase+'.js','body',1);
    newScript( 'https://js.na.chilipiper.com/marketing.js','body',1);
    newScript(scriptBase + '/src/js/schema'+minBase+'.js','body',1);
    // newScript(scriptBase + '/src/js/experiments'+minBase+'.js','body',1);
    newScript(scriptBase + '/src/js/gorgiaschat'+minBase+'.js','body',1);
    newStyle(scriptBase + '/src/css/all'+minBase+'.css','body');
    newStyle(scriptBase + '/src/css/chilipiper'+minBase+'.css','body');
    // demo pages
    newScript(scriptBase + '/src/js/demo'+minBase+'.js','body',1);
    if (path === '/demo-2' || path === '/wip/demo') {
      newScript(scriptBase + '/src/js/demo-2'+minBase+'.js','body',1);  
    }
    // pricing page
    if (path === '/pricing' || path === '/pricing-test/pricing' || path === '/pages/template-long' 
      || path === '/pages/customer-service' || path === '/pages/ticketing-system' || path === '/pages/live-chat'
      || path === '/pages/helpdesk' || path === '/pages/crm' || path === '/wip/pricing') {
        // [Attributes by Finsweet] Mirrorclick
        newScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-mirrorclick@1/mirrorclick.js','body',1);
        newStyle(scriptBase + '/src/css/pricing'+minBase+'.css','body');
        newScript(scriptBase + '/src/js/pricing'+minBase+'.js','head',1);

        // scripts for splide js
        newStyle('https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/css/splide-core.min.css','head');
        newStyle(scriptBase + '/src/css/splide'+minBase+'.css','head');
        newScript('https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/js/splide.min.js','body',1);
        newScript(scriptBase + '/src/js/splide'+minBase+'.js','body',1)
    }
    // blog pages
    if (path.includes('/blog/')) {
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
    
    if (path === '/product-tour'){
        newScript(scriptBase + '/src/js/producttour'+minBase+'.js','head',1)
    } 

    if (path.includes('signup-2') || path.includes('signup-3')){
        newStyle(scriptBase + '/src/css/signup'+minBase+'.css','body');
    }
    // Check if the path is specifically for the French version of signup-2
    if (path.includes("/fr/signup-2")) {
      // Load the French version of the script
      newScript(scriptBase + "/src/js/signup-2-fr" + minBase + ".js", "head", 1);
    } else if (path.includes("/signup-2")) {
      // Load the default version of the script if not the French version
      newScript(scriptBase + "/src/js/signup-2" + minBase + ".js", "head", 1);
    }
    if (path.includes('/products/automate')){
        newScript(scriptBase + '/src/js/tool-roi-automate'+minBase+'.js','head',0);
        newScript(scriptBase + '/src/js/tool-roi-automate'+minBase+'.css','head',0);
    }
    if (path.includes('/products/convert')){
        newScript(scriptBase + '/src/js/tool-roi-convert'+minBase+'.js','head',0);
    }
})

