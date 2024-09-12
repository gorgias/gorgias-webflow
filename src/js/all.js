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

/****************************
 *
 * This script creates links when detected in FAQ section
 *
 ****************************/

document.addEventListener("DOMContentLoaded", () => {
    // Regular expression to match URLs with or without protocols
    const urlPattern =
      /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/g;
  
    // Get all elements with the class 'new-faq_content'
    const faqElements = document.querySelectorAll(".new-faq_content");
  
    faqElements.forEach((element) => {
      // Get the inner HTML of the element
      let content = element.innerHTML;
  
      // Replace the URLs in the content with anchor tags
      const updatedContent = content.replace(urlPattern, (url) => {
        // Ensure the URL starts with http:// or https://
        const href = url.startsWith("http") ? url : `https://${url}`;
        const link = `<a class="faq-link" href="${href}" target="_blank">${url}</a>`;
        return link;
      });
  
      // Update the element's HTML content
      element.innerHTML = updatedContent;
    });
  });

 /****************************
 * 
 * Checks UTM source to display banner
 * 
 ****************************/

document.addEventListener('DOMContentLoaded', () => {
    // Step 1: Find the element with data-target="banner"
    const banner = document.querySelector('[data-target="banner"]');
  
    // Step 2: Function to get URL parameters
    const getUrlParameter = (name) => {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      const results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
  
    // Step 3: Check if the utm_source is "google"
    const utmSource = getUrlParameter('utm_source');
    const utmMedium = getUrlParameter('utm_medium');
    if (utmSource === 'google' && utmMedium === 'cpc') {
      // Step 4: Remove the class .is-hidden if the traffic comes from Google search with CPC medium
      banner.classList.remove('is-hidden');
    }
  });
  
  // Step 4: pass info to demo url
  $(document).ready(function() {
    // Function to get URL parameters (reused)
    const getUrlParameter = (name) => {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      const results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
  

    $("#incentive-demo").click(function() {  
      // Create the URL with the parameters
      const demoUrl = `/stimulus/fr/100amazon?utm_source=google&utm_medium=cpc&utm_campaign=incentive_website_banner`;
  
      // Redirect to the demo URL
      window.location.href = demoUrl;
    });
  });
  

/****************************
 * 
 * Find and append query parameters to a button URL
 * 
 ****************************/

document.addEventListener("DOMContentLoaded", function() {
  // Get the current page URL search parameters
  const queryParams = new URLSearchParams(window.location.search);

  // Find the element with the specified data attribute
  const paramButton = document.querySelector('[data-el="params"]');

  // Check if the element exists
  if (paramButton) {
    // Get the current href of the button
    const originalUrl = new URL(paramButton.href);

    // Append the query parameters from the current page to the original URL
    queryParams.forEach((value, key) => {
      originalUrl.searchParams.append(key, value);
    });

    // Set the new URL with the query parameters back to the button
    paramButton.href = originalUrl.toString();
  }
});

// Function to deactivate console logs in production
(function () {
  // Parse the current URL and look for the ?debug=gorgias parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isDebugMode = urlParams.has('debug') && urlParams.get('debug') === 'gorgias';

  // Function to disable console.log if not in debug mode (i.e., if on production)
  function handleConsoleLogs() {
    if (!isDebugMode) {
      // Overwrite console.log to do nothing (production mode)
      console.log = function() {};
    } else {
      // Debug mode, keep console.log as it is
      console.log("Debug mode active - console.log is enabled.");
    }
  }

  // Call the function to apply the console.log handling
  handleConsoleLogs();
})();



