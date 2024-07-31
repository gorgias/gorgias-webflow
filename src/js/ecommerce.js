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
  
  // Add event listener to the demo button to append the utm_source parameter
const demoButtons = document.querySelectorAll('[data-el="demo-btn"]');
demoButtons.forEach(function(button) {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        const ecommercePlatform = getSessionCookie("ecommerce_platform");
        const demoUrl = `/demo?ecommerce_platform=${ecommercePlatform}`;
        window.location.href = demoUrl;
    });
});
  