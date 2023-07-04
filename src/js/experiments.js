const localPath = window.location.pathname

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
    }
  }, 3000); // 3 seconds
}

if (localPath === '/pages/home-draft' || localPath === '/demo') {
  var logosToSelect = document.getElementsByClassName("customer_logos-collection-wrapper");
  if(logosToSelect.length > 0){
      displayDefaultCustomerLogosList(logosToSelect);
  }
}

if (localPath === '/demo-test') {
  // in case of add blocker show new layout since it is hidden
  setTimeout(function() {
    const logos = document.getElementsByClassName("customer_logos-collection-wrapper");
    const hiddenElementTest = document.getElementsByClassName('page_demo-new-layout')[0]
    hiddenElementTest.style.display = 'block'
    displayDefaultCustomerLogosList(logos)
  }, 2000)
}
