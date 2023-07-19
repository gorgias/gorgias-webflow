function displayDefaultCustomerLogosList(logosToSelect, checkLayouts) {
  setTimeout(function() {

    if (checkLayouts) {
      // in case posthog does not load we still need to show old demo layout on the page
      const oldLayoutDemo = document.getElementsByClassName('page_demo-old-layout')
      const displayValueOld = oldLayoutDemo && (window.getComputedStyle(oldLayoutDemo[0]).getPropertyValue('display'))
      const newLayoutDemo = document.getElementsByClassName('page_demo-new-layout')
      const displayValueNew = newLayoutDemo && (window.getComputedStyle(newLayoutDemo[0]).getPropertyValue('display'))
      if (displayValueOld === 'none' && displayValueNew === 'none') {
        oldLayoutDemo[0].style.display = 'block'
      }
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

if (path === "/pages/home-draft" || path === "/demo") {
  var logosToSelect = document.getElementsByClassName(
    "customer_logos-collection-wrapper"
  );
  if (logosToSelect.length > 0) {
    displayDefaultCustomerLogosList(logosToSelect);
  }
}

if (path === "/demo-test") {
  const logosToSelect = document.getElementsByClassName(
    "customer_logos-collection-wrapper"
  )
  if (logosToSelect.length > 0) {
    displayDefaultCustomerLogosList(logosToSelect, true)
  }
}
