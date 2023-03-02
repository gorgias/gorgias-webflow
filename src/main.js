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

        // pricing page
        if(path == '/pricing' || path == '/github-test'){
            import('https://cdn.jsdelivr.net/npm/@finsweet/attributes-mirrorclick@1/mirrorclick.js');
            newStyle('/src/css/pricing.css','body');
            newScript('/src/js/pricing.js','head',1);
        }
    });
})

