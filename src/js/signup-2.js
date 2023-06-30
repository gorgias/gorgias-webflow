const email_key = 'email';
const fullname_key = 'fullname';
const password_key = 'password';
const company_domain_key = 'company_domain';
const account_domain_key = 'account_domain';
var emailField = $('#signup-user-form input[name="'+ email_key + '"]') || "";
var fullnameField = $('#signup-user-form input[name="'+ fullname_key + '"]') || "";
var passwordField = $('#signup-user-form input[name="'+ password_key + '"]') || "";
var accountDomainEditButton = $('a#account-domain-edit-button') || "";
var accountDomainEditWrapper = $('#account-domain-edit-wrapper') || "";
var accountDomainWrapper = $('#account-domain-wrapper') || "";
var accountDomainSaveButton = $('a#account-domain-save-button') || "";
var accountDomainText = $('#account-domain-text') || "";
var accountDomainTextInfoWrapper = $('#account-domain-info-wrapper') || "";






var companyDomainField = $('#signup-account-form input[name="' + company_domain_key + '"]') || "";
var accountDomainField = $('#signup-account-form input[name="' + account_domain_key + '"]') || "";
var signupButton = $('input[id="signup-button"]') || "";
var signupButtonLoading = $('#signup-button-loading') || "";
var ssoGoogleButton = $('a[id="sso-button-google"]') || "";
var userForm = $('form#signup-user-form');
var accountForm = $('form#signup-account-form');
const token_key = 'x-account-manager-session-token';


const classErrorField = 'field-error';
const classWarningField = 'field-warning';
const classValidField = 'field-valid';
const classErrorMessage = 'message-error';
const classWarningMessage = 'message-warning';
const btnWaitString = 'Please wait';
const classValidMessage = 'message-valid';
const SIGNUP_ACCOUNT_FORM_PAGE = '/signup-2/account';

var delayTimer;

function waitForAnalytics (callback) {
  var waitForAnalyticsIntervalCount = 0
  var waitForAnalyticsIntervalMax = 3
  var waitForAnalyticsInterval = null
  waitForAnalyticsInterval = window.setInterval(function () {
      if (typeof analytics.user === 'function' || waitForAnalyticsIntervalCount >= waitForAnalyticsIntervalMax) {
          window.clearInterval(waitForAnalyticsInterval)
          callback()
      } else { waitForAnalyticsIntervalCount += 1 }
  }, 1000)
}

// insert below each field a div that will contain the error/warning messaging
function initiateMessageContainer (){
  fields = {
    'email' : emailField,
    'fullname' : fullnameField,
    'company_domain' : companyDomainField,
    'account_domain' : accountDomainField,
    'signup_button' : signupButton
    
  }

  $.each(fields, function(index, value) {    
      if(value.length){
          $('<div id = "' + index + '-message-container" class="field-message-container" style="position:absolute;"></div>').insertAfter(value);
      }
  })    
}

function setFieldStatusStorage (fieldName, fieldstatus){
  window.localStorage.setItem(fieldName + '-status', fieldstatus);
}

function getFieldStatusStorage (fieldName){
  return window.localStorage.getItem(fieldName  + '-status');
}

// 3 fields status
// 1) warning: orange color, used when the focus on a field is left and the rules are not meet
// 2) error: color red: used when the form is submitted but some fields didn't pass the verifications
// 3) valid: color: green: used when the fields are valid
function handleFieldStatus (field,status,messaging){

  var fieldName = field[0].name;

  setFieldStatusStorage(fieldName,status)

  if(status == 'warning'){
      field.removeClass(classErrorField).removeClass(classValidField).addClass(classWarningField);
      field.next("div[id*='-message-container']").removeClass(classErrorMessage).removeClass(classValidMessage).addClass(classWarningMessage);
  }
 else if(status == 'error'){
      field.removeClass(classValidField).removeClass(classWarningField).addClass(classErrorField);
      field.next("div[id*='-message-container']").removeClass(classWarningMessage).removeClass(classValidMessage).addClass(classErrorMessage);

  }
  else if(status == 'valid'){
      field.removeClass(classErrorField).removeClass(classWarningField).addClass(classValidField);
  }

  // all but password: we don't empty the message container in case the messaging is the same as the initial one
  if (fieldName != password_key) {

    var initialMessage= field.next("div[id*='-message-container']").innerHTML || "";
    if(initialMessage && initialMessage!= "" && messaging != initialMessage){
      field.next("div[id*='-message-container']").empty().append(messaging);
    }
    else{
      field.next("div[id*='-message-container']").empty().append(messaging);
    }
  }
}

function handleFormStatus (form,status,messaging){  
  if(status == 'warning'){
    signupButton.next("div[id*='-message-container']").removeClass(classErrorMessage).removeClass(classValidMessage).addClass(classWarningMessage);
  }
 else if(status == 'error'){
  signupButton.next("div[id*='-message-container']").removeClass(classWarningMessage).removeClass(classValidMessage).addClass(classErrorMessage);

  }
  else if(status == 'valid'){
  }
  
  signupButton.next("div[id*='-message-container']").append(messaging);
}

// used to remove any field warning or error
function resetFieldStatus (field){

  // field.removeClass(classValidField).removeClass(classWarningField).removeClass(classErrorField);
  field.next("div[id*='-message-container']").removeClass(classErrorMessage).removeClass(classValidMessage).removeClass(classWarningMessage).empty();
}

// used to fetch the sessionToken and update the SSO link
function updateLinksForSession(sessionToken) {

    if (!sessionToken) { sessionToken = window.localStorage.getItem(token_key) }
    if (!sessionToken) { return }
    $("a.session-link").each(function () {
        const link = $(this)
        const href = new URL(link.attr("href"))
        href.searchParams.set(token_key, sessionToken)
        link.attr("href", href.toString())
    })
}

function post (endpoint, data, success, error, complete) {
  //const API_BASE_URL = new URL(document.currentScript.src).origin + '/signup'
  var API_BASE_URL = "https://accounts.gorgias.com" + "/signup";

  return $.ajax({
      method: 'POST',
      url: API_BASE_URL + endpoint,
      data: JSON.stringify(data),
      contentType: 'application/json',
      crossOrigin: true,
      xhrFields: {
          withCredentials: true
      },
      crossDomain: true,
      beforeSend: function (jqXHR) {
          const sessionToken = window.localStorage.getItem(token_key)
          if (sessionToken) {
              jqXHR.setRequestHeader(token_key, sessionToken)
          }
      },
      success: function (data, status, jqXHR) {
        success(data);
      },
      complete: function (jqXHR) {
        if (typeof complete === 'function') {
          complete(jqXHR);
        }
        const sessionToken = jqXHR.getResponseHeader(token_key)
        if (sessionToken) {
          window.localStorage.setItem(token_key, sessionToken)
          updateLinksForSession(sessionToken)
        }
          
      },

      error: error
  })
}

// used to to fetch url parameters, set a session token key as local storage and prefilled fields using url parameters
function processURLSearchParams () {

  var searchParams = new URLSearchParams(window.location.search)
  var sessionToken = searchParams.get(token_key)
  var sessionEmail = searchParams.get(email_key.toLowerCase());
  var sessionfullname = searchParams.get(fullname_key.toLowerCase())
  if (sessionToken) {
      window.localStorage.setItem(session_token_key, sessionToken)
      updateLinksForSession(sessionToken)
  }

  if(sessionEmail){
    emailField.val(sessionEmail);
  }
  if(sessionfullname){
    fullnameField.val(sessionfullname);

  }

}

// used ot check is email adress is personnal or not. Currently not used in our emailVerify function
function isPersonalEmail(email) {
  // Custom logic to determine if the email is professional or not
  // You can use regular expressions or any other method
  // Here's a simple example using a predefined list of non-professional email domains
  var personalDomains = ['gmail.com', 'outlook.com'];
  var domain = email.split('@')[1];
  
  return personalDomains.includes(domain);
}

// used to verify the email field
function emailVerify(verifyStatus){
  // resetFieldStatus(emailField);
  const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  var verifyMessage = "";
  var verifyStatus = verifyStatus;
  if (!emailField.val() || emailField.val() === '') {
    verifyMessage =  'We need your email to create your account';
    handleFieldStatus(emailField,verifyStatus,verifyMessage);
    return verifyStatus;
  } else if (!regexEmail.test(emailField.val())) {
    verifyMessage =  'Your email is not correct';
    handleFieldStatus(emailField,verifyStatus,verifyMessage);
    return verifyStatus;
  }
  /* else if (isPersonalEmail(emailField.val())) {
    verifyMessage =  'Keep a good work-life balance, use a professional email'
  }
  */
  else {

    var validationData = {
      name: fullnameField.val(),
      email: emailField.val(),
      password: emailField.val()
    }
    const API_VALIDATION_ENDPOINT = '/user/validation';
    post(
      API_VALIDATION_ENDPOINT,
      validationData,
      // success callback
      function (data) {
        if (data && data['signup-email-validation']) {
          var validationResult = data['signup-email-validation']
          if (validationResult.risk === 'high') {
            if (validationResult.reason === 'mailbox_does_not_exist' || validationResult.result === "undeliverable") {
              verifyMessage = 'Are you sure this email address exists?';
            }
            else if (validationResult.reason === 'mailbox_is_disposable_address') {
              verifyMessage = "Please don't use disposable email addresses.";
            }
            else {
              verifyStatus = 'valid';
            }
          }
          else{
            verifyStatus = 'valid';
          }
        }
        else{
          verifyStatus = 'valid';
        }


      },
      //error callback
      function (response) {
        handleErrors(self, response)
      },
      // compelete
      function(data) {
        handleFieldStatus(emailField,verifyStatus,verifyMessage);
        return verifyStatus;
      }
    )
  }
}



function extractDomain(url) {

  // Convert url to string if it's not already a string
  if (typeof url !== 'string') {
    url = String(url);
  }

  // Remove protocol (http:// or https://) if present
  url = url.replace(/^(https?:\/\/)?(www\.)?/i, '');
  
  // Extract domain name
  var domain = url.split('/')[0];
  
  // Remove file extension if present
  domain = domain.replace(/\.[^.]*$/, '');

  // Check if the domain matches "myshopify" or "mybigcommerce"
  if (domain === 'myshopify' || domain === 'mybigcommerce') {
    // Extract subdomain
    var subdomain = url.split('.')[0];
    return subdomain;
  }

  // Remove subdomains if present
  var parts = domain.split('.');
  if (parts.length > 2) {
    domain = parts.slice(-2).join('.');
  }

  domain = domain.replace(/\.[^.]*$/, '');

  return domain;
}

function accountDomainVerify(verifyStatus){

  var verifyMessage = "";
  var API_BASE_URL = "https://us-central1-gorgias-growth-production.cloudfunctions.net/check_helpdesk_domain";
  var data = {'account_name_predicted':'gorgias' //accountDomainField.val()
  };

  var settings = {
    "url": API_BASE_URL,
    "method": "POST",
    "crossDomain": "true",
    "headers": {
      "Content-Type":"application/json",
      "X-PINGOVER": "pingpong"
    },
    "data": JSON.stringify(data)
  };
  
  $.ajax(settings)
  // cloud function failed
  .fail(function (response) {
    console.log("cloud function fail");
    console.log(response);
  })
  .done(function (response) {
    console.log("cloud function done");
    console.log(response);

  })
  .always(function (jqXHR, textStatus, errorThrown) {
    console.log("cloud function always");
    console.log(jqXHR);

    var response = {
      domain_exist:false,
      account_domain: 'gorgias-4',
      incrementation: 4

    }

    accountDomainPrefilled(response);
 
  });


  function accountDomainPrefilled(response){

    var domain_exist = response.domain_exist;
    var account_domain = response.account_domain;
    accountDomainText.empty().text( account_domain + ".gorgias.com");
    accountDomainField.val(account_domain);


    if(!account_domain || account_domain == ''){
      accountDomainTextInfoWrapper.removeClass('hidden');;
      accountDomainEditWrapper.removeClass('hidden');
      accountDomainTextInfoWrapper.removeClass('hidden');

    }

    else{
      accountDomainTextInfoWrapper.removeClass('hidden');
      accountDomainWrapper.removeClass('hidden');
      accountDomainField.val(account_domain);
      accountDomainText.empty().text( account_domain + ".gorgias.com");


    }

      // shouldn't happen since the cloud function is supposed to incremante until a available domain is found
      if(domain_exist == true) {
        verifyMessage = "This workspace is not available, try another one"
      }

            // shouldn't happen since the cloud function is supposed to incremante until a available domain is found
            if(domain_exist == true) {
              verifyMessage = "This workspace is not available, try another one"
      
            }

  }

 
  /*



      else if ( !account_domain || account_domain == '') {
        verifyMessage = 'Unexpected issue, please try again or reach out support';
      }
      else{
        verifyStatus = 'valid';
        
      }
      handleFieldStatus(accountDomainField,verifyStatus,verifyMessage);

      // Check if a callback function is provided
      if (typeof callback === 'function') {
        console.log("verifyStatus sent to callback: " + verifyStatus)
        callback(verifyStatus);
      }
      return verifyStatus;
    }
    */

    /*
    if(DomainFieldverifyStatus != 'valid'){
      if (accountDomainEditWrapper.css('display') != 'block') {
        accountDomainEditWrapper.css('display','block');
      }
      else if (accountDomainWrapper.css('display') == 'block') {
        accountDomainWrapper.css('display','none');
      }
    }

    accountDomainTextInfoWrapper.css('display','flex');
    if (accountDomainEditWrapper.css('display') != 'block') {
      accountDomainWrapper.css('display','block');
    }
    */
  }

function companyDomainVerify(verifyStatus){
  // resetFieldStatus(emailField);
  var regexCompanyDomain = /^(?:(?:https?:\/\/)?(?:www\.)?)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/;
  var verifyMessage = "";
  var verifyStatus = verifyStatus;
  
  if (!companyDomainField.val() || companyDomainField.val() === '') {
    verifyMessage =  'We need your website URL to create your account';
  } else if (!regexCompanyDomain.test(companyDomainField.val())) {
    verifyMessage =  "It doesn't seem to be a proper URL, please double check";
  }else{
    verifyStatus = 'valid';
  }

  // if company Domain field is valid, we're going to prefilled the account domain field and input by extracting the company domain
  if(verifyStatus == 'valid'){
    var extractedDomain = extractDomain(companyDomainField.val());
 

    // then, before displaying the account domain field or input; we're going to verify it
    // if it returns an error (shouldn't happen) - then we'll display the input directly to allow to edit the account domain, otherwise we'll display the default field prefilled
    accountDomainVerify('warning');
  }

  handleFieldStatus(companyDomainField,verifyStatus,verifyMessage)
  return verifyStatus;

}

// used to verify the fullname field
function fullnameVerify(verifyStatus){
    resetFieldStatus(fullnameField);
    const regexFullname = /^[A-Za-z]+(\s[A-Za-z]+)*$/;
    let verifyMessage;

    if (!fullnameField.val()) {
      verifyMessage =  'We need your fullname to create your account'
    }
    else{
      verifyStatus = 'valid';

    }

    handleFieldStatus(fullnameField,verifyStatus,verifyMessage)

    return verifyStatus;

}

// used to verify the password field and display error/warning/valid properly
function passwordVerify(verifyStatus){
    var passwordUppercaseMessage = $('#signup-user-form ul li#pwd-message-uppercase');
    var passwordLowercaseMessage = $('#signup-user-form ul li#pwd-message-lowercase');
    var passwordLengthMessage = $('#signup-user-form ul li#pwd-message-length');
    var passwordNumber = $('#signup-user-form ul li#pwd-message-number');
    // Regular expressions to check for lowercase, uppercase, and number
    var lowercaseRegex = /[a-z]/;
    var uppercaseRegex = /[A-Z]/;
    var numberRegex = /[0-9]/;
      
    // Check password length
    if (passwordField.val().length >= 14) {
      passwordLengthMessage.addClass(classValidMessage).removeClass(classWarningMessage).removeClass(classErrorMessage);
    } else if (verifyStatus == "warning") {
      passwordLengthMessage.addClass(classWarningMessage).removeClass(classValidMessage).removeClass(classErrorMessage);
    } else if (verifyStatus == "error") {
      passwordLengthMessage.addClass(classErrorMessage).removeClass(classValidMessage).removeClass(classWarningMessage);
    }

    // check uppercase
    if (uppercaseRegex.test(passwordField.val())) {
      passwordUppercaseMessage.addClass(classValidMessage).removeClass(classWarningMessage).removeClass(classErrorMessage);

    } else if (verifyStatus == "warning") {
      passwordUppercaseMessage.addClass(classWarningMessage).removeClass(classValidMessage).removeClass(classErrorMessage);
    } else if (verifyStatus == "error") {
      passwordUppercaseMessage.addClass(classErrorMessage).removeClass(classValidMessage).removeClass(classWarningMessage);
    }
    // check lowercase
    if (lowercaseRegex.test(passwordField.val())) {
      passwordLowercaseMessage.addClass(classValidMessage).removeClass(classWarningMessage).removeClass(classErrorMessage);
    } else if (verifyStatus == "warning") {
      passwordLowercaseMessage.addClass(classWarningMessage).removeClass(classValidMessage).removeClass(classErrorMessage);
    } else if (verifyStatus == "error") {
      passwordLowercaseMessage.addClass(classErrorMessage).removeClass(classValidMessage).removeClass(classWarningMessage);
    }

    // check number
    if (numberRegex.test(passwordField.val())) {
      passwordNumber.addClass(classValidMessage).removeClass(classWarningMessage).removeClass(classErrorMessage);
    } else if (verifyStatus == "warning") {
      passwordNumber.addClass(classWarningMessage).removeClass(classValidMessage).removeClass(classErrorMessage);
    } else if (verifyStatus == "error") {
      passwordNumber.addClass(classErrorMessage).removeClass(classValidMessage).removeClass(classWarningMessage);
    }

    if(numberRegex.test(passwordField.val()) && lowercaseRegex.test(passwordField.val()) && uppercaseRegex.test(passwordField.val()) && passwordField.val().length >= 14 ){
      verifyStatus = 'valid'
    }

    handleFieldStatus(passwordField, verifyStatus, "");
    return verifyStatus;



}

function getOrCreateAnonymousId (anonymousId) {
  if (typeof analytics.user === 'function') {
      if (anonymousId) {
          analytics.user().anonymousId(anonymousId)
      } else {
          return analytics.user().anonymousId()
      }
  }
}

 // manage errors responses from the account manager API
function handleErrors(response) {
  if (response) {
      if (response.responseJSON) {
        for (const fieldName of Object.keys(response.responseJSON)) {
          const errors = response.responseJSON[fieldName]
          const inputField = $('input[name=' + fieldName + ']')
          
          // stylized the input when there is an error
          if (inputField.length) {
          
            // insert an error messaging before the field
            for (const errorMsg of errors) {
              handleFieldStatus(inputField,"error",messaging);
            }
          }
          else {
            handleFieldStatus(signupButton,"error","An unexpected error occurred. Please try again.")
          }
        
        }
      }
    }
  }
  
function signupUserFormHandler(form) {
  var API_INIT_ENDPOINT = '/user/init'
  var initParams = { 'anonymous_id': getOrCreateAnonymousId() }
    // initiat the API 
    post(
      API_INIT_ENDPOINT, 
      initParams, 
      // success 
      function (data) {
        // pass the anonymous ID from the backend in case there was nos frontend anoymous ID set
        getOrCreateAnonymousId(data.anonymous_id)

        // Handle errors in case the backend return errpr
        if (data.errors) {
          handleErrors({ responseJSON: data.errors })
        }
        if (data.shopify) {
            // if email field is empty but account manager API returns an email, then complete the email field and run the verify function
            if (!emailField.val() && data.shopify.email) {
              emailField.val(data.shopify.email);
              emailVerify("warning");
            }
            // if email field is empty but account manager API returns an full name, then complete the email field and run the verify function
            if ( !fullnameField.val() && data.shopify.shop_owner) {
              fullnameField.val(data.shopify.shop_owner)
              fullnameVerify("warning");
            }
            //if (emailField.val() && fullnameField.val() && !passwordField.val()) { passwordField.focus() }
        }

        if (typeof window.GORGIAS_INIT_CALLBACK === 'function') {
            window.GORGIAS_INIT_CALLBACK(data);
        }
      },
      //error
      function (response) {
      },
      //complete
      function (){
      }
    )
}

function signupAccountFormHandler(form){
  var API_INIT_ENDPOINT = '/account/init';

  post(
    API_INIT_ENDPOINT,
    null,
    //success
    function (data) {
      if (data.redirect_url) {
        window.location = '/signup-2'
      }
      /*
      if (data.shopify) {
        const companyDomainInput = $(COMPANY_DOMAIN_INPUT_SELECTOR)
        const accountDomainInput = $(ACCOUNT_DOMAIN_INPUT_SELECTOR)
        if (!companyDomainInput.val() && data.shopify.domain) { companyDomainInput.val(data.shopify.domain) }
        if (!accountDomainInput.val() && data.shopify.name) { accountDomainInput.val(data.shopify.name) }
      }
      if (data.sso) {
        const companyDomainInput = $(COMPANY_DOMAIN_INPUT_SELECTOR)
        // in case the previous step come from SSO, if the company domain field is empty but we retreive the company domain from previous SSO step, then let's autocomplete the field
        // question: How do we do that on the backend, what's the logic?
        if (!companyDomainInput.val() && data.sso.company_domain) { companyDomainInput.val(data.sso.company_domain) }
        // in case the previous step come from SSO, if the account domain field is empty but we retreive the account domain from previous SSO step, then let's autocomplete the field
        // question: How is it possible since the account is not yet created?
        const accountDomainInput = $(ACCOUNT_DOMAIN_INPUT_SELECTOR)
        if (!accountDomainInput.val() && data.sso.account_domain) { accountDomainInput.val(data.sso.account_domain) }
      }
      // question: what are the data passed in GORGIAS_INIT_CALLBACK
      if (typeof window.GORGIAS_INIT_CALLBACK === 'function') {
        window.GORGIAS_INIT_CALLBACK(data);
      }
      */
    },
    // error
    function(response){
    },
    //complete
    function (){
    }
  )
}

// once submission start - clean all alert messaging and customize the button (disable + update value) an disable all fields to avoid update
function onSubmitStart(form, button) {
  form.find('input').prop("disabled", true);
  button.addClass('hidden').css('dislplay','none');
  signupButtonLoading.removeClass('hidden');
}
  // once submission end - reset the submission button status and enable fields
function onSubmitEnd(form, button) {
    form.find('input').prop("disabled", false);
    button.addClass('hidden');
    signupButtonLoading.removeClass('hidden');

}

// function to create user (step 1)
function onSubmitUserSignupForm(response) {
  const formData =
    {
      'email': $.trim(emailField.val()), 
      'name': $.trim(fullnameField.val()),
      'password': passwordField.val(),
      'recaptcha_response': response
    }
    const API_USER_SUBMIT_ENDPOINT = '/user/submit';
  // pass the form and button to onSubmitStart function to disable fields and change button copy
  onSubmitStart(userForm, signupButton)
  
  post(
    API_USER_SUBMIT_ENDPOINT,
    // data sent
    formData,
    // success
    function (data) {
    // Important: we keep the search (url parameters) in order to pass them to the following step
    window.location = SIGNUP_ACCOUNT_FORM_PAGE + window.location.search
    },
    // error
    function (response) {
        // pass the form and button to reset fields and change button copy
        onSubmitEnd(userForm, signupButton)
        // Manage error to display the right message for the right field
        // question: can we have the list of all error options
        handleErrors(userForm, response)
        // reset the captcha
        grecaptcha.reset()
    }
  )
}
  // unable all fields -> they are disable by default with script the head of the page before to prevent too early field completion or form submission while all scripts are not loaded. 
function Enablefields (){
  $("input").prop("disabled", false);
  signupButton.prop("disabled", false);
  ssoGoogleButton.prop("disabled", false);
}

function resetLocalStorageFields () {
  window.localStorage.removeItem(email_key + '-status');
  window.localStorage.removeItem(password_key + '-status');
  window.localStorage.removeItem(fullname_key + '-status');
}

// once page is fully loaded
var Webflow = Webflow || [];
Webflow.push(function () {
  resetLocalStorageFields();
  Enablefields();

  accountDomainEditButton.on('click',function(){
    accountDomainEditWrapper.css('display','block');
    accountDomainWrapper.css('display','none');
  })
  
  accountDomainSaveButton.on('click',function(){


    var accountDomainVerifiedStatus = accountDomainVerify('warning');

    if(accountDomainVerifiedStatus == 'valid'){
      accountDomainEditWrapper.css('display','none');
      accountDomainWrapper.css('display','block');
    }
  })

  // checking the fields after any blur event
  emailField.on('blur', function() {
    emailVerify('warning');
  })
  companyDomainField.on('blur', function() {
    companyDomainVerify('warning');
  })

  companyDomainField.keyup(function() {
    clearTimeout(delayTimer); // Clear the previous timer, if any
    delayTimer = setTimeout(function() {
      companyDomainVerify('warning');
    }, 1500); 
  });

  accountDomainField.on('blur', function() {
    accountDomainVerify('warning');
  })
  

  // checking the fields after any blur event
  emailField.on('blur', function() {
    emailVerify('warning');
  })
  
  fullnameField.on('blur', function() {
    fullnameVerify('warning');
  })
  
  passwordField.on('blur', function(){
    passwordVerify('warning');
  })
  
  //checking the fields after key up event for all field exept password
  emailField.keyup(function() {
    clearTimeout(delayTimer); // Clear the previous timer, if any
    delayTimer = setTimeout(function() {
      emailVerify('warning');
    }, 1500); 
  });
  
  fullnameField.keyup(function() {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
      fullnameVerify('warning');
    }, 1500); 
  });
  
  // for password field we want live validation, no delay
  passwordField.on('input', function(){
    passwordVerify('warning');
  })
  
  // used to display / hide the password field content using the button within the field
  $('#transformButton').on('click', function() {
    currentType = $('#signup-user-form input[name="' + password_key+ '"]').attr('type');
    if (currentType === 'password') {
      $('#signup-user-form input[name="' + password_key+ '"]').attr('type', 'text')
    } else {
      $('#signup-user-form input[name="' + password_key+ '"]').attr('type', 'password')
    }
  })

  // used to fetch url parameters, create sessions cookies and prefilled fields
  processURLSearchParams();

  // used insert the div that will contains warning/error messaging below fields
  initiateMessageContainer(emailField, fullnameField, companyDomainField, accountDomainField);

  // wait for analytics (segment) to load - up to 1000ms - then identify which form is no the page: step 1 = user-form & step 2 = account-form. Lastly trigger the right function
  waitForAnalytics(function () {
    if (userForm.length) {
      signupUserFormHandler(userForm)
    } else if (accountForm.length) {
      signupAccountFormHandler(accountForm);
    }
  })

  // submission user form (step 1)
  userForm.submit(function (event) {
    event.preventDefault();
    event.stopPropagation();
    signupButton.next("div[id*='-message-container']").empty();

    var form = $(this);
    var fullnameStatus = getFieldStatusStorage(fullname_key);
    var emailStatus = getFieldStatusStorage(email_key);
    var passwordStatus = getFieldStatusStorage(password_key);
    var status = 'error';
    var messaging = 'Please check fields with error, then submit'
    

    if (fullnameStatus !== 'valid' || emailStatus !== 'valid' || passwordStatus !== 'valid' ) {
      emailVerify(status);
      fullnameVerify(status);
      passwordVerify(status);
      handleFormStatus (form,status,messaging);

      return false; 
    }
    else{
      status = 'valid';
      window.localStorage.removeItem(email_key + '-status');
      window.localStorage.removeItem(password_key + '-status');
      window.localStorage.removeItem(fullname_key + '-status');


      const DATADOG_BOT_USER_AGENT = 'Datadog/Synthetics';
      if (navigator.userAgent === DATADOG_BOT_USER_AGENT) {
        onSubmitUserSignupForm();
      }
      else {
        grecaptcha.execute();
      }
    }


  })

  // Once the captach is completed, then trigger the function to create user
  window.onUserSignUpRecaptchaResponse = onSubmitUserSignupForm


  accountForm.submit(function (event){
  })

})