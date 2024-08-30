$(document).ready(function () {
  // Get the current URL
  const url = window.location.href;
  console.log("Current URL:", url);

  // Function to get the collection item name from the URL
  function getCollectionItemName() {
    const pathArray = window.location.pathname.split("/");
    return pathArray[pathArray.length - 1];
  }

  // Function to set a session cookie
  function setSessionCookie(name, value) {
    document.cookie = `${name}=${value}; path=/;`;
  }

  // Function to get a session cookie by name
  function getSessionCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Get the collection item name and store it in a session cookie
  const collectionItemName = getCollectionItemName();
  setSessionCookie("ecommerce_platform", collectionItemName);

  // Function to update text and href based on language
  function updateContent(languageCode) {
    if (!languageCode) return;

    console.log(`Updating content for language code: ${languageCode}`);

    const translations = {
      fr: {
        trialText: "Essai Gratuit",
        demoText: "Réserver une Démo",
        demoHref: "/fr/demo",
        customerNumberText: "Accompagne 15000 marques ecommerce dans l'automatisation de leur support client grâce à l'IA",
      },
      es: {
        trialText: "Prueba Gratis",
        demoText: "Reserva una Demo",
        demoHref: "/es/demo",
        customerNumberText: "Ayudamos a 15,000 marcas de comercio electrónico a automatizar la experiencia del cliente con la potencia de la IA",
      },
    };

    const { trialText, demoText, demoHref, customerNumberText } = translations[languageCode] || {};

    // Update "Start free trial" text
    $("a.button.is-seashell").filter(function () {
      return $(this).text().trim().toLowerCase() === "start free trial";
    }).text(trialText);

    // Update "Book a demo" text and href
    $("a[data-el='demo-btn']").filter(function () {
      return $(this).text().trim().toLowerCase() === "book a demo";
    }).text(demoText).attr("href", demoHref);

    // Update the customer number text inside the specific child div
    $(".customer-number_item .text-size-xlarge.text-align-center").filter(function () {
      return $(this).text().includes("Helping 15,000 ecommerce brands automate CX with the power of AI");
    }).text(customerNumberText);
  }

// Function to handle demo button click and append the ecommerce_platform parameter
function handleDemoButtonClick(languageCode) {
  const demoButtons = document.querySelectorAll('[data-el="demo-btn"]');
  demoButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      let ecommercePlatform = getSessionCookie("ecommerce_platform");

      // Remove the language suffix if it exists (e.g., "-es", "-fr")
      ecommercePlatform = ecommercePlatform.replace(/-[a-z]{2}$/, '');

      let demoUrl = "/demo";
      
      // Adjust demoUrl based on languageCode
      if (languageCode === "fr") {
        demoUrl = "/fr/demo";
      } else if (languageCode === "es") {
        demoUrl = "/es/demo";
      }

      // Append query parameters
      demoUrl += `?ecommerce_platform=${ecommercePlatform}&utm_campaign=${ecommercePlatform}_landing_page`;

      console.log("Redirecting to:", demoUrl);  // Log for debugging purposes
      window.location.href = demoUrl;
    });
  });
}


  // Function to extract language code from URL
  function getLanguageCode() {
    const match = url.match(/-(\w{2})/); // Matches '-fr', '-es', etc.
    return match ? match[1] : null; // Returns language code or null if not found
  }

  // Get the language code and update content accordingly
  const languageCode = getLanguageCode();
  updateContent(languageCode);
  handleDemoButtonClick(languageCode);

  // Reapply changes after a short delay to ensure they persist
  if (languageCode) {
    setTimeout(() => updateContent(languageCode), 500);
  }
});
