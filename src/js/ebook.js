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

    var nameDiv = document.querySelector('[data-el="hs-name"]');
    var inputField = document.querySelector('input[name="ebook_name"]');

    if (nameDiv && inputField) {
      inputField.value = nameDiv.textContent.trim();
      console.log("Input field value set to:", inputField.value);
    }
  }, 1000);
});