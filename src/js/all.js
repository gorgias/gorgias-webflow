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
    // filePath should start by '/' if the file is hosted on our CDH
    // fillePath should start by https:// if it's a 3rd party script
    // position should be always 'head' OR 'body'.
    // syncStatus should be set to 1 if async

    var script = document.createElement('script');
    var scriptId;
    var scriptLink
    if(filePath.includes('https://')){
        
        var filePathArray = filePath.split('/').slice(-2).reverse().pop() + '-' + filePath.split('/').slice(-1).reverse().pop()
        scriptId = 'js-ext-' + filePathArray.replace(/(\.min)?\.js$|@/g, "").split('/').filter(e => e).slice(-1);
        scriptLink = filePath;
    }else{
        scriptId = 'js-gorgias-' + filePath.replace(/(\.min)?\.js$|@/g, "");
        scriptLink = scriptBase + filePath;
    }

    script.setAttribute("id",scriptId);
    script.setAttribute('src',scriptLink);
    script.setAttribute("type","text/javascript");
    
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