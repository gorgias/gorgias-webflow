// Function to append a styleSheet hosted on the CDN
function newCdnStyle(filePath){
    // Create new link Element
    var link = document.createElement('link');
    // set the attributes for link element
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = scriptBase + filePath;
    // Append link element to HTML head
    head.appendChild(link);

    
}

// function to import a js file hosted on the CDN
function newCdnAsyncScript(filePath){
    (async () => {
        import( scriptBase + filePath);
    })();
}

// cookies functions

// utm parameters functions