// Code here is loaded before Jquery library, so use only Vanilla javascript 


function cookieExpectedPlanName(cookieName){
    if(
        location.href.toLowerCase().indexOf("starter") >= 0
        || location.href.toLowerCase().indexOf("g2") >= 0
        || location.href.toLowerCase().indexOf("app_store") >= 0
    ) {
        setCookie(cookieName, "starter", 90);
    }
}

cookieExpectedPlanName('expected_plan_name');



function cookieCountry(callback){
    var cookie = getCookie('loc_code');
    if(!cookie && cookie == ''){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://cloudflare.com/cdn-cgi/trace', true);

        xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            var data = xhr.responseText;
            var locCodeMatch = data.match(/loc=(.+)/);

            if (locCodeMatch) {
                var locCode = locCodeMatch[1].toLowerCase();
                setCookie('loc_code', locCode, 90);

                callback();
            }
            } else {
                //console.error('Request failed with status', xhr.status);
            }
        };

        xhr.send();
    }
    else{
        callback();
    }

    
}

function customizedCustomerLogos () {
    if (path.includes("/demo")) {
        // customer logo list
        const logosToSelect = document.getElementsByClassName("customer_logos-collection-wrapper")
        // if customer logo list exist on the page
        if (logosToSelect.length > 0) {
    
            // location code of the visitor
            const loc_code = getCookie("loc_code");
    
            // if we now the visitor location
            if (loc_code && loc_code != "") {
    
                // mapping of the location code with the country full name
                const countryToWebflowIdentifier = {
                  au: "australia",
                  ca: "canada",
                  fr: "france",
                  uk: "united-kingdom",
                  gb: "united-kingdom",
                  us: "united-states",
                }
    
                // if the localisation code of hte visitor match with one from the mapping
                if (countryToWebflowIdentifier.hasOwnProperty(loc_code)) {
                    // then we hide the default list of customer
                    logosToSelect[0].style.display = "none";
    
                    // select the appropriate list of logos
                    const showLogosByCountry = Array.from(logosToSelect).filter((el) =>
                        el.classList.contains(countryToWebflowIdentifier[loc_code])
                    )
                    // display the appropriate list of logos
                    showLogosByCountry.forEach((el) => {
                        el.style.display = "block"
                    })
                } else {
    
                    if (path === "/demo") {
                        logosToSelect[0].style.display = "block"
                        logosToSelect[6].style.display = "block" //mobile one
                    }
                    else {
                        logosToSelect[0].style.display = "block"
                    }
                }
            }
        }
    }
}

cookieCountry(function(){
    customizedCustomerLogos();
});

