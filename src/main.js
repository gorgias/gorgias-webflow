var path = window.location.pathname;
var url = window.location.href;
var scriptBase, isDebug = url.includes('debug=gorgias');
if (isDebug) {
    console.log('Debug mode');
    scriptBase = "http://127.0.0.1:5500";
}
else {
    scriptBase = "https://cdn.jsdelivr.net/gh/gorgias/gorgias-webflow@latest";
}

// scripts belows requires Jquery or are not crucial for website work
var Webflow = Webflow || [];
Webflow.push(function () {

    newScript('/src/js/autocompletefields.js','body',1); // once hubspot forms are loaded and display
    newScript('/src/js/demo.js','body',1);
    newScript('https://js.na.chilipiper.com/marketing.js','body',1);
    newScript('/src/js/schema.js','body',1);
    newScript('/src/js/gorgiaschat.js','body',1);
    newStyle('/src/css/all.css','body');
    newStyle('/src/css/hubspot.css','body');
    newStyle('/src/css/chilipiper.css','body');

    // pricing page
    if(path == '/pricing'){
        // [Attributes by Finsweet] Mirrorclick
        newScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-mirrorclick@1/mirrorclick.js','body',1);
        newStyle('/src/css/pricing.css','body');
        newScript('/src/js/pricing.js','head',1);
    }
    // blog pages
    if(path.includes('/blog/')){
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
        newStyle('/src/css/blog.css','body');
        newScript('/src/js/blog.js','body',1);
    }
})

