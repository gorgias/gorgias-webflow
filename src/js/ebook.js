// Ensure DOM is ready (covers both early and late script loading)
function onReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

onReady(function () {
  setTimeout(function () {

  
    var hsFormName = document.querySelector('[data-el="hs-name"]');
    var inputField = document.querySelector('input[name="ebook_name"]');

    if (hsFormName && inputField) {
      inputField.value = hsFormName.textContent.trim();
      $("input[name|='ebook_name']").val(inputField.value).change();
      console.log("Input field value set to:", inputField.value);
    }
  }, 1000);
});