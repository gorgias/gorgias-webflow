// this script is loaded sync on every page of the website, in the head tag, before any other script

// Function to append a styleSheet hosted on the CDN
function newStyle(filePath, position){
    // filePath should start by '/'.
    //position should be always 'head' OR 'body'
    
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = scriptBase + filePath;
    $(position)[0].appendChild(link);


    
}

// function to import a js file hosted on the CDN
function newScript(filePath, position, syncStatus){
    // filePath should start by '/'.
    // position should be always 'head' OR 'body'.
    // syncStatus should be set to 1 if async

    var script = document.createElement('script');
    var scriptId = 'js-gorgias-' + filePath.replace("/src/js/","").replace(".js","");
    script.setAttribute('src',scriptBase + filePath);
    script.setAttribute("type","text/javascript");
    script.setAttribute("type","text/javascript");
    script.setAttribute("id",scriptId);
    if(syncStatus != 1){
        syncStatus = 0;
    }
    script.async = syncStatus;
    $(position)[0].appendChild(script);    
}

/* BEGINING OF cookies functions */
// function to create a cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    var cookieDomain = location.origin.replace('https://','').replace('www','');
    document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=" + cookieDomain + ";path=/";
}
// function to get the value of a cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
/* END OF cookies functions */

// Segment script
// use a different write key in webflow development 
var SEGMENT_WRITE_KEY = window.location.hostname === 'www.gorgias.com' ? "4K8cOhGhUlCNfE3rlsYVGBTBAR92Q2Nk": "nPhO6SyfURLuit010EVhib2Xe8t9MgwS";
!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
analytics.load(SEGMENT_WRITE_KEY);
analytics.page(window.location.pathname);
}}();

// function to get value of an utm parameters
function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    var output;

    if(results === null) {
        output = "";
    }
    else{
        // utm parameter value is an email, don't replace + by space
        if ( decodeURIComponent(results[1]).indexOf("@") !== -1 ) {
        output = decodeURIComponent(results[1]);
        }
        else{
        output = decodeURIComponent(results[1].replace(/\+/g, " "))
        }
    }
    return output;
}