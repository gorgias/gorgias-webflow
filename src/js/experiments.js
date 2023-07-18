function displayDefaultCustomerLogosList(logosToSelect) {
  setTimeout(function() {
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

if (path === "/demo-test-wider") {
  // first we show old layout and then select logos
  const oldLayoutDemo = document.getElementsByClassName('page_demo-old-layout')[0]
  oldLayoutDemo.style.display = 'block'
  const logosToSelect = document.getElementsByClassName(
    "customer_logos-collection-wrapper"
  )
  if (logosToSelect.length > 0) {
    displayDefaultCustomerLogosList(logosToSelect)
  }
}
