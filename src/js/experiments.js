function displayDefaultCustomerLogosList(logosToSelect) {
  setTimeout(function () {
      // in case posthog does not load we still need to show main wrapper on demo page
    const mainWrapperDemo = document.getElementsByClassName('demo_main-wrapper')[0]
    const displayValue = window.getComputedStyle(mainWrapperDemo).getPropertyValue('display')
    if (mainWrapperDemo && displayValue === 'none') {
      mainWrapperDemo.style.display = 'block'
    }
    // Check if none of the elements are displayed
    var noneDisplayed = true;
    for (var i = 0; i < logosToSelect.length; i++) {
      if (logosToSelect[i].style.display == "block") {
        noneDisplayed = false;
        break;
      }
    }
    // If none of the elements are displayed, display the first one
    if (noneDisplayed) {
      logosToSelect[0].style.display = "block";
      logosToSelect[6].style.display = "block"; // for mobile
    }
  }, 3000); // 3 seconds
}

if (path === "/pages/home-draft" || path === "/demo" || path === "/demo-2") {
  
  var logosToSelect = document.getElementsByClassName(
    "customer_logos-collection-wrapper"
  );
  if (logosToSelect.length > 0) {
    displayDefaultCustomerLogosList(logosToSelect);
  }
}
