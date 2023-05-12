var isUngated = url.includes('ungated=true');
if(!isUngated){
    $(".modal-wrapper").removeClass('hidden')
}

window.addEventListener("message", function(event) {
    // when form is ready
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmit' && event.data.id === "a62e3bd8-908f-48f3-b4bd-8938dfe45122") {
      $(".modal-wrapper").hide();
    }
  });
