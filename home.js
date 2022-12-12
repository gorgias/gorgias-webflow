  // redirect to /powered-by if the utm_source equals widget
  if(location.search == "?utm_source=widget" && location.pathname=="/") {
    window.location.replace("https://www.gorgias.com/powered-by");
  }
