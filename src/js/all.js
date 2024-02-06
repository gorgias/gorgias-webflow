// this script is loaded sync on every page of the website, in the head tag, before any other script

// function to import a js file hosted on the CDN
function newScript(filePath, position, syncStatus){
    // fillePath should start by https:// if it's a 3rd party script
    // position should be always 'head' OR 'body'.
    // syncStatus should be set to 1 if defer

    var script = document.createElement('script');
    script.setAttribute('src',filePath);
    script.setAttribute("type","text/javascript");
    
    if(syncStatus != 1){syncStatus = 0; }
    script.defer = syncStatus;
    $(position)[0].appendChild(script);    
}

// Function to append a styleSheet hosted on the CDN
function newStyle(filePath, position){
    //position should be always 'head' OR 'body'
    
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = filePath;
    $(position)[0].appendChild(link);
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

// format figures with comma separator
function formatNumberWithCommas(number) {
return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}