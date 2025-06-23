// Disable console.logs for production
// console.log = function () {};

// Get all utmParameter and set a session cookie to reuse them later during the session (e.g. complete forms fields)
function cookieSessionFromUtmParameter() {
  const query = window.location.search.substring(1);
  if (query) {
      const vars = query.split("&");
      vars.forEach(param => {
          const [paramName, paramValue] = param.split("=").map(decodeURIComponent);
          const storageMap = {
              email: 'email',
              first_name: 'first_name',
              last_name: 'last_name',
              number_of_agents: 'number_of_agents',
              name: 'name',
              domain: 'domain',
              company_domain: 'company_domain',
              gorgias_subdomain: 'gorgias_subdomain',
              phone: 'phone',
              about_us: 'about_us',
              ecommerce_platform: 'ecommerce_platform',
              utm_campaign: 'utm_campaign_session',
              utm_source: 'utm_source_session',
              utm_term: 'utm_term_session',
              utm_medium: 'utm_medium_session',
              ajs_prop_adset_name: 'adset_name_session',
              ajs_prop_ad_name: 'ad_name_session',
              ajs_prop_campaign_name: 'ad_campaign_name_session',
              metadata_cid: 'metadata_cid'
          };
          if (paramName in storageMap) {
              sessionStorage.setItem(storageMap[paramName], paramValue);
              console.log(`Stored ${paramName}:`, paramValue);
          } else if (paramName === "gclid" && typeof analytics !== "undefined") {
              analytics.track("Gclid caught");
          }
      });
  }
}

// Fetch the IP and store it in variable session
// function getAndStoreIp() {
//     if (!sessionStorage.getItem('ipVisitor')) {
//         $.getJSON("https://api.ipify.org?format=jsonp&callback=?", json => {
//             sessionStorage.setItem('ipVisitor', json.ip || '');
//         });
//     }
// }

function productInterest() {
  const sessionStorageName = 'product_interest';
  const interests = {
      convert: {
          pathConditions: ['convert'],
          searchConditions: ['convert']
      },
      automate: {
          pathConditions: ['automate', 'automation'],
          searchConditions: ['automate', 'automation']
      },
      helpdesk: {
          pathConditions: ['helpdesk'],
          searchConditions: ['helpdesk']
      }
  };

  // Retrieve the existing product interests from session storage
  const sessionProductInterest = JSON.parse(sessionStorage.getItem(sessionStorageName) || '[]');
  const existingInterest = new Set(sessionProductInterest);

  // Define the different product interests and their associated conditions
  Object.entries(interests).forEach(([interest, conditions]) => {
    // Check if any of the path conditions or search conditions match the current page
    if (conditions.pathConditions.some(cond => location.pathname.toLowerCase().includes(cond)) ||
      conditions.searchConditions.some(cond => location.search.toLowerCase().includes(cond))) {
      // Add the interest to the existing interests set
      existingInterest.add(interest);
    }
  });

  // Convert the set of interests back to an array and update the session storage
  const updatedInterests = Array.from(existingInterest);
  sessionStorage.setItem(sessionStorageName, JSON.stringify(updatedInterests));

  // Log the updated product interests
  console.log('Stored product interests:', updatedInterests);
}

cookieSessionFromUtmParameter();
productInterest();
// getAndStoreIp();
