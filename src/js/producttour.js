var isUngated = url.includes('ungated=true');
if(!isUngated){
    $(".modal-wrapper.product-tour").removeClass('hidden')
}

window.addEventListener("message", function(event) {
    // when form is ready; hide it
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmit' && event.data.id === "a62e3bd8-908f-48f3-b4bd-8938dfe45122") {
      $(".modal-wrapper.product-tour").hide();
    }
  });

  window.addEventListener("message", function(event) {
    // when form is ready
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted' && event.data.id === "0c1a0b5b-0610-4843-9494-7b7c9986af08") {
      $(".product-tour-mobile-alert div.subheading__hero").text("").append("Done! You'll receive a reminder in your inbox in a couple of seconds. In the meantime, feel free to <a class='text-color-primary text-link' href='https://www.gorgias.com/demo'>schedule a call</a> for a personalized demo or <a class='text-color-primary text-link' href='https://www.gorgias.com/blog'>visit our blog</a> to discover more about enhancing your CX.");
    }
  });