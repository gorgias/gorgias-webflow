 // List of North American ISO country codes
 const northAmericanCodes = ['US', 'CA', 'MX'];

 // Function to adjust display based on user's location
 function adjustDisplayForLocation() {
     //console.log("Fetching user location from IP...");
     fetch("https://ipapi.co/json/")
         .then((response) => response.json())
         .then((data) => {
             //console.log("Country data fetched:", data.country);

             const isNorthAmerica = northAmericanCodes.includes(data.country.toUpperCase());
             const aiAgentBanner = document.querySelector('.announcement-banner.is-ai-agent');
             const cxBanner = document.querySelector('.announcement-banner.is-cx-connect');

             if (isNorthAmerica) {
                 cxBanner.classList.remove('is-hidden');
             } else {
                 aiAgentBanner.classList.remove('is-hidden');
             }
         })
         .catch((error) => {
             //console.error("Error fetching country code:", error);
             // Show the AI Agent banner by default if an error occurs
             document.querySelector('.announcement-banner.is-ai-agent').classList.remove('is-hidden');
         });
 }

 adjustDisplayForLocation();