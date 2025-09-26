// // Checks users IP and displays a marquee corresponding to his location
// // Define the EMEA countries based on country codes
// const emeaCountries = [
//     "AL", "DZ", "AD", "AO", "AM", "AT", "AZ", "BH", "BY", "BE", "BJ", "BA", "BW", "BG", "BF", "BI", "CM", "CV",
//     "CF", "TD", "KM", "CG", "CD", "CI", "HR", "CY", "CZ", "DK", "DJ", "EG", "GQ", "ER", "EE", "ET", "FI", "FR",
//     "GA", "GM", "GE", "DE", "GH", "GR", "GN", "GW", "HU", "IS", "IR", "IQ", "IE", "IL", "IT", "JO", "KZ", "KE",
//     "KW", "KG", "LV", "LB", "LS", "LR", "LY", "LT", "LU", "MG", "MW", "ML", "MT", "MR", "MU", "MD", "MC", "ME",
//     "MA", "MZ", "NA", "NL", "NE", "NG", "NO", "OM", "PS", "PL", "PT", "QA", "RO", "RU", "RW", "ST", "SA", "SN",
//     "RS", "SC", "SL", "SK", "SI", "ZA", "ES", "SD", "SZ", "SE", "CH", "SY", "TZ", "TG", "TN", "TR", "TM", "UG",
//     "UA", "AE", "GB", "UZ", "EH", "ZM", "ZW"
//   ];

// // Define Australia and New Zealand
// const anzCountries = ["AU", "NZ"];
  
//   // Fetch user's location using IP
//   fetch('https://ipinfo.io/json?token=16b2fa7a6332cb')
//     .then(response => response.json())
//     .then(data => {
//       const userCountry = data.country; // Country code (e.g., "US", "FR")
//       console.log("User country:", userCountry);
  
//       // Select elements
//       const marqueeNa = document.querySelector('[data-el="marquee-na"]');
//       const marqueeEmea = document.querySelector('[data-el="marquee-emea"]');
//       const marqueeAnz = document.querySelector('[data-el="marquee-anz"]');
  
//       // Check if the user's country is in the EMEA region
//       if (emeaCountries.includes(userCountry)) {
//         // User is in EMEA - show EMEA marquee and hide NA marquee
//         marqueeEmea.classList.remove('is-hidden');
//         marqueeNa.classList.add('is-hidden');
//         console.log("User is in EMEA, showing EMEA marquee");
//       } else if (anzCountries.includes(userCountry)) {
//         // User is in ANZ - show ANZ marquee and hide EMEA marquee
//         marqueeEmea.classList.add('is-hidden');
//         marqueeNa.classList.add('is-hidden');
//         marqueeAnz.classList.remove('is-hidden');
//         console.log("User is in ANZ, showing ANZ marquee");
//       } else {
//         // User is outside EMEA - show NA marquee and hide EMEA marquee
//         marqueeEmea.classList.add('is-hidden');
//         marqueeNa.classList.remove('is-hidden');
//         console.log("User is outside EMEA, showing NA marquee");
//       }
//     })
//     .catch(error => {
//       console.error("Error fetching IP information:", error);
//     });