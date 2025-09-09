import { generatePassword } from './utils.js';

let password = generatePassword();
let passwordField = $('[data-name="password"]');
const shopifSignupForm = $('[data-name="Signup Form"]');
const shopifySignupFormWrapper = $('[data-name="shopify-signup-form-wrapper"]');
const shopifySignupLoaderWrapper = $('[data-name="shopify-signup-loader-wrapper"]');


// once confident, set this stage automatically on the page through the hidden classes
shopifySignupFormWrapper.hide();
shopifySignupLoaderWrapper.removeClass('hidden')


window.GORGIAS_INIT_CALLBACK = function (data) {

  console.log("Gorgias init data:", data);

    // Set an auto-generated password in the password field
    passwordField.val(password);
    shopifSignupForm.submit();

  // If you want to preserve any previous callback:
  if (window._origGorgiasInitCb) {
    window._origGorgiasInitCb(data);
  }
};
