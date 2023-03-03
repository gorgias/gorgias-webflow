var path = window.location.pathname;
var url = window.location.href;
var scriptBase, isDebug = url.includes('debug');
if (isDebug) {
    console.log('Debug mode');
    scriptBase = "http://127.0.0.1:5500";
}
else {
    scriptBase = "https://cdn.jsdelivr.net/gh/gorgias/gorgias-webflow@latest";
}

var Webflow = Webflow || [];
Webflow.push(function () {
    $.getScript( scriptBase + '/src/js/all.js', function(){

        newScript('/src/js/cookies.js','body',1);
        newScript('/src/js/sessions.js','body', 0); // set as sync because following script need it to autocomplete field
        newScript('/src/js/autocompletefields.js','body',1);
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
            newScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-codehighlight@1/codehighlight.js','body',1);
            // [Attributes by Finsweet] Powerful Rich Text
            newScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-richtext@1/richtext.js','head',1);
            // Hubspot CTA
            newScript('https://js.hscta.net/cta/current.js','head',0);
            // [Attributes by Finsweet] Social Share
            newScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-socialshare@1/socialshare.js','body',1);
            // Images zoom in library
            newScript('https://cdn.jsdelivr.net/npm/medium-zoom@1.0.3/dist/medium-zoom.min.js','body',1);
            // custom code
            newStyle('/src/css/blog.css','body');
            newScript('/src/js/blog.js','head',1);
        }
    });
})

