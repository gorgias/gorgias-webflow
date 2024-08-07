// Get all utmParameter and set a session cookie to reuse them later during the session (e.g. complete forms fields)
function cookieSessionFromUtmParameter() {
    var query = window.location.search.substring(1);
    if (query != '') {
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var paramName = pair[0];
        var paramValue = decodeURIComponent(pair[1]);
  
        if (paramName === "email") {
          sessionStorage.setItem('email', paramValue);
          console.log('Stored email:', paramValue);
        } else if (paramName === "first_name") {
          sessionStorage.setItem('first_name', paramValue);
          console.log('Stored first name:', paramValue);
        } else if (paramName === "last_name") {
          sessionStorage.setItem('last_name', paramValue);
          console.log('Stored last name:', paramValue);
        } else if (paramName === "number_of_agents") {
          sessionStorage.setItem('number_of_agents', paramValue);
          console.log('Stored number of agents:', paramValue);
        } else if (paramName === "name") {
          sessionStorage.setItem('name', paramValue);
          console.log('Stored name:', paramValue);
        } else if (paramName === "domain") {
          sessionStorage.setItem('domain', paramValue);
          console.log('Stored domain:', paramValue);
        } else if (paramName === "gorgias_subdomain") {
          sessionStorage.setItem('gorgias_subdomain', paramValue);
          console.log('Stored Gorgias subdomain:', paramValue);
        } else if (paramName === "phone") {
          sessionStorage.setItem('phone', paramValue);
          console.log('Stored phone:', paramValue);
        } else if (paramName === "about_us") {
          sessionStorage.setItem('about_us', paramValue);
          console.log('Stored about us:', paramValue);
        } else if (paramName === "ecommerce_platform") {
          sessionStorage.setItem('ecommerce_platform', paramValue);
          console.log('Stored ecommerce platform:', paramValue);
        } else if (paramName === "utm_campaign") {
          sessionStorage.setItem('utm_campaign_session', paramValue);
          console.log('Stored utm_campaign:', paramValue);
        } else if (paramName === "utm_source") {
          sessionStorage.setItem('utm_source_session', paramValue);
          console.log('Stored utm_source:', paramValue);
        } else if (paramName === "utm_term") {
          sessionStorage.setItem('utm_term_session', paramValue);
          console.log('Stored utm_term:', paramValue);
        } else if (paramName === "utm_medium") {
          sessionStorage.setItem('utm_medium_session', paramValue);
          console.log('Stored utm_medium:', paramValue);
        } else if (paramName === "ajs_prop_adset_name") {
          sessionStorage.setItem('adset_name_session', paramValue);
          console.log('Stored adset_name:', paramValue);
        } else if (paramName === "ajs_prop_ad_name") {
          sessionStorage.setItem('ad_name_session', paramValue);
          console.log('Stored ad_name:', paramValue);
        } else if (paramName === "ajs_prop_campaign_name") {
          sessionStorage.setItem('ad_campaign_name_session', paramValue);
          console.log('Stored ad_campaign_name:', paramValue);
        } else if (paramName === "metadata_cid") {
          sessionStorage.setItem('metadata_cid', paramValue);
          console.log('Stored metadata_cid:', paramValue);
        } else if (paramName === "gclid") {
          if (typeof analytics !== "undefined") {
            analytics.track("Gclid caught");
          }
        }
      }
    }
  }
  
  // fetch the IP and store it in variable session
  // function getandStoreIp(){
  //     if(sessionStorage.getItem('ipVisitor') === null || sessionStorage.getItem('ipVisitor') == ""){
  //         $.getJSON( "https://api.ipify.org?format=jsonp&callback=?", function(json) {
  //             if(json.ip.length > 0){
  //                 sessionStorage.setItem('ipVisitor', json.ip);
  //             }
  //             else{
  //                 sessionStorage.setItem('ipVisitor', '');
  //             }
  //         })
  //     }
  // }
  
  function productInterest() {
    var sessionStorageName = 'product_interest';
    var interests = {
      'convert': {
        pathConditions: ['convert'],
        searchConditions: ['convert']
      },
      'automate': {
        pathConditions: ['automate', 'automation'],
        searchConditions: ['automate', 'automation']
      },
      'helpdesk': {
        pathConditions: ['helpdesk'],
        searchConditions: ['helpdesk']
      }
    };
  
    var sessionProductInterest = sessionStorage.getItem(sessionStorageName);
    var existing_interest = [];
  
    // Check if there are already product interests stored in session. If so, store them in an array.
    if (sessionProductInterest) {
      var sessionArray = JSON.parse(sessionProductInterest);
      existing_interest.push.apply(existing_interest, sessionArray);
    }
  
    // Iterate through the interests and conditions.
    for (var interest in interests) {
      if (interests.hasOwnProperty(interest)) {
        var conditions = interests[interest];
  
        // Check path conditions.
        if (conditions.pathConditions.some(function (condition) {
          return location.pathname.toLowerCase().indexOf(condition) >= 0;
        })) {
          // Check if the interest was not already detected previously.
          if (existing_interest.indexOf(interest) === -1) {
            existing_interest.push(interest);
          }
        }
  
        // Check search conditions.
        if (conditions.searchConditions.some(function (condition) {
          return location.search.toLowerCase().indexOf(condition) >= 0;
        })) {
          // Check if the interest was not already detected previously.
          if (existing_interest.indexOf(interest) === -1) {
            existing_interest.push(interest);
          }
        }
      }
    }
  
    // Update the session storage with the updated interests array.
    sessionStorage.setItem(sessionStorageName, JSON.stringify(existing_interest));
    console.log('Stored product interests:', existing_interest);
  }
  
  cookieSessionFromUtmParameter();
  productInterest();
  //getandStoreIp()
  