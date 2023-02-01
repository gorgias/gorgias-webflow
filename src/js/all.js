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
    script.setAttribute('src',scriptBase + filePath);
    script.setAttribute("type","text/javascript");
    script.async = syncStatus;
    $(position)[0].appendChild(script);    
}

// cookies functions

// utm parameters functions