const email_key = 'email';
const fullname_key = 'fullname';
const plan_name_key = 'plan_name';
const plan_period_key = 'period';
const password_key = 'password';
const company_domain_key = 'company_domain';
const account_domain_key = 'account_domain';
const TOKEN_KEY = 'x-account-manager-session-token';
const classErrorField = 'field-error';
const classWarningField = 'field-warning';
const classValidField = 'field-valid';
const classValidText = 'text-valid';
const classErrorMessage = 'message-error';
const classWarningMessage = 'message-warning';
const btnWaitString = 'Please wait';
const classValidMessage = 'message-valid';
const SIGNUP_ACCOUNT_FORM_PAGE = '/signup-2/account';
const SIGNUP_FORM_PAGE = '/signup-2';

var emailField = $('#signup-user-form input[name="'+ email_key + '"]') || "";
var fullnameField = $('#signup-user-form input[name="'+ fullname_key + '"]') || "";
var passwordField = $('#signup-user-form input[name="'+ password_key + '"]') || "";
var accountDomainEditButton = $('a#account-domain-edit-button') || "";
var accountDomainEditWrapper = $('#account-domain-edit-wrapper') || "";
var accountDomainWrapper = $('#account-domain-wrapper') || "";
var accountDomainLoaderWrapper = $('#account-domain-loader-wrapper') || "";
var accountDomainEditLoaderWrapper = $('#account-domain-edit-loader-wrapper') || "";
var accountDomainSaveButton = $('a#account-domain-save-button') || "";
var accountDomainText = $('#account-domain-text') || "";
var accountDomainSubdomainString = $('#account-subdomain-string') || "";
var accountDomainTextInfoWrapper = $('#account-domain-info-wrapper') || "";
var companyDomainField = $('#signup-account-form input[name="' + company_domain_key + '"]') || "";
var accountDomainField = $('#signup-account-form input[name="' + account_domain_key + '"]') || "";
var signupButton = $('input[id="signup-button"]') || "";
var signupButtonLoading = $('#signup-button-loading') || "";
var ssoGoogleButton = $('a[id="sso-button-google"]') || "";
var userForm = $('form#signup-user-form');
var accountForm = $('form#signup-account-form');
var accountFormWrapper = $('#signup-account-form-wrapper');
var accountFormLoadingWrapper = $('div#signup-account-form-loading-wrapper');

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
          $('<div id = "' + index + '-message-container" class="field-message-container"></div>').insertAfter(value);
      }
  })    
}

function setFieldStatusStorage (fieldName, fieldstatus){
  window.localStorage.setItem(fieldName + '-status', fieldstatus);
}

function getFieldStatusStorage (fieldName){
  return window.localStorage.getItem(fieldName  + '-status');
}

// Used to manage the field status and messaging: valid (green), warning (pre-form submission:orange), alert (post-form submission: red)
function handleFieldStatus (field,status,messaging){
  var fieldName = field[0].name;
  var fieldType = field[0].type;
  setFieldStatusStorage(fieldName,status);

  if(status == 'warning'){
    if(fieldType != 'submit') {
      field.removeClass(classErrorField).removeClass(classValidField).addClass(classWarningField);
    }
    field.next("div[id*='-message-container']").removeClass(classErrorMessage).removeClass(classValidMessage).addClass(classWarningMessage);
  }
  else if(status == 'error'){
    if(fieldType != 'submit') {
      field.removeClass(classValidField).removeClass(classWarningField).addClass(classErrorField);
    }
    field.next("div[id*='-message-container']").removeClass(classWarningMessage).removeClass(classValidMessage).addClass(classErrorMessage);

  }
  else if(status == 'valid'){
    if(fieldType != 'submit') {
      field.removeClass(classErrorField).removeClass(classWarningField).addClass(classValidField);
    }
    if(fieldName == account_domain_key){
      accountDomainText.addClass(classValidText);
    }
  }
  
  // all but password: we don't empty the message container in case the messaging is the same as the initial one
  if (fieldName != password_key) {
    var initialMessage= field.next("div[id*='-message-container']").innerHTML || "";
    if(initialMessage && initialMessage != "" && messaging != initialMessage){
      field.next("div[id*='-message-container']").empty().append(messaging);
    }
    else{

      field.next("div[id*='-message-container']").empty().append(messaging);
    }
  }
  if( fieldName == account_domain_key ) {
    if(status == 'warning'){
      field.nextAll().filter('.form-input-append').first().removeClass(classValidField).removeClass(classErrorField).addClass(classWarningField);
    }
    else if(status == 'error'){

      field.nextAll().filter('.form-input-append').first().removeClass(classValidField).removeClass(classWarningField).addClass(classErrorField);
    }
    else if(status == 'valid'){
      field.nextAll().filter('.form-input-append').first().removeClass(classErrorField).removeClass(classWarningField).addClass(classValidField);
    }

  }

  field.next("div[id*='-message-container']").addClass('warning-message-trembling')
  setTimeout(function(){
    field.next("div[id*='-message-container']").removeClass('warning-message-trembling');

  },300);
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
  
  signupButton.next("div[id*='-message-container']").empty().append(messaging);
}

// used to remove any field warning or error
function resetFieldStatus (field){

  // field.removeClass(classValidField).removeClass(classWarningField).removeClass(classErrorField);
  field.next("div[id*='-message-container']").removeClass(classErrorMessage).removeClass(classValidMessage).removeClass(classWarningMessage).empty();
  field.removeClass(classErrorField).removeClass(classValidField).removeClass(classWarningField).empty();

  if(field == account_domain_key){
    accountDomainText.removeClass(classValidText);
  }

}

// used to fetch the sessionToken and update the SSO link
function updateLinksForSession(sessionToken) {

    if (!sessionToken) { sessionToken = window.localStorage.getItem(TOKEN_KEY) }
    if (!sessionToken) { return }
    $("a.session-link").each(function () {
        const link = $(this)
        const href = new URL(link.attr("href"))
        href.searchParams.set(TOKEN_KEY, sessionToken)
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
          const sessionToken = window.localStorage.getItem(TOKEN_KEY)
          if (sessionToken) {
              jqXHR.setRequestHeader(TOKEN_KEY, sessionToken)
          }
      },
      success: function (data, status, jqXHR) {
        success(data);
      },
      complete: function (jqXHR) {
        if (typeof complete === 'function') {
          complete(jqXHR);
        }
        const sessionToken = jqXHR.getResponseHeader(TOKEN_KEY)
        if (sessionToken) {
          window.localStorage.setItem(TOKEN_KEY, sessionToken)
          updateLinksForSession(sessionToken)
        }
          
      },

      error: error
  })
}

// used to to fetch url parameters, set a session token key as local storage and prefilled fields using url parameters
function processURLSearchParams () {

  let searchParams = new URLSearchParams(window.location.search)
  let sessionToken = searchParams.get(TOKEN_KEY)
  let sessionEmail = searchParams.get(email_key.toLowerCase());
  let sessionfullname = searchParams.get(fullname_key.toLowerCase());
  let sessionPlanName = searchParams.get(plan_name_key.toLowerCase());
  let sessionPlanPeriod = searchParams.get(plan_period_key.toLowerCase());
  if (sessionToken) {
      window.localStorage.setItem(session_TOKEN_KEY, sessionToken)
      updateLinksForSession(sessionToken)
  }
  if(sessionEmail){
    emailField.val(sessionEmail);
  }
  if(sessionfullname){
    fullnameField.val(sessionfullname);
  }
  if(sessionPlanName){
    window.localStorage.setItem(plan_name_key, sessionPlanName)
  }
  if(sessionPlanPeriod){
    window.localStorage.setItem(plan_period_key, sessionPlanPeriod)
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
    verifyMessage =  'The email you entered is incomplete';
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
    var API_VALIDATION_ENDPOINT = '/user/validation';
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

// used to extract a domain from an URL
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

// used to verify the domainField using a custom cloud function. The CF return an incremented domain in case the domain set originally is not available.
function accountDomainVerify(verifyStatus, domain, prefilled){

  resetFieldStatus(accountDomainField);
  
  var account_domain_submitted = domain;

  // happen on keyup trigger : $this is an input, not the input value
  if(typeof account_domain_submitted != 'string'){
    account_domain_submitted = account_domain_submitted.val();
  }
  var verifyStatus = verifyStatus;
  var verifyMessage = "";
  var regexAccountDomain = /^[a-zA-Z0-9\-]+$/;
  var regexAccountDomain2 = /^-|-/;

  if (!regexAccountDomain.test(account_domain_submitted)) {
    var verifyMessage = "This field allow only the following special caracter: -";
    handleFieldStatus(accountDomainField,verifyStatus,verifyMessage);
    return verifyStatus;
  }
  
  // Before calling the cloud function, Check if the accoun_domain has been already submitted
  // If it already exists, retrieve the existing data and append the new key/value

  try {
    var accountSubdomainsApproved = JSON.parse(localStorage.getItem('account-subdomains-approved'));
  } catch (error) {
    var accountSubdomainsApproved = {}
    localStorage.removeItem('account-subdomains-approved');
    handleFieldStatus(accountDomainField,verifyStatus,verifyMessage);
    return verifyStatus;
  }
  if (localStorage.getItem('account-subdomains-approved') === null || !accountSubdomainsApproved.hasOwnProperty(account_domain_submitted) ) {
    var API_BASE_URL = "https://us-central1-gorgias-growth-production.cloudfunctions.net/check_helpdesk_domain";
    var data = {'account_name_predicted':account_domain_submitted};
    var settings = {
      "url": API_BASE_URL,
      "method": "POST",
      "crossDomain": "true",
      "headers": {
        "Content-Type":"application/json"
      },
      "data": JSON.stringify(data),
      beforeSend:
      function( xhr ) {
        accountDomainLoaderWrapper.removeClass('hidden');
        accountDomainEditLoaderWrapper.removeClass('hidden');
        accountDomainSubdomainString.addClass('skeleton-text');
      }
    };
    var APIresponse;
    
    $.ajax(settings)
    // cloud function failed
    .fail(function (response) {
      APIresponse = {
        domain_exist:false,
        account_domain: ''
      }
    })
    .done(function (response) {
      APIresponse = {
        domain_exist:false,
        account_domain: response.account_domain
      }      
      // Check if "account-subdomains-approved" exists in local storage
      var data = localStorage.getItem('account-subdomains-approved') || {};
      var dataObject;

      try {
        dataObject = JSON.parse(data);

      } catch (error) {
        dataObject = {};
      }
      
      dataObject[account_domain_submitted] = APIresponse.account_domain;
      localStorage.setItem('account-subdomains-approved', JSON.stringify(dataObject));
      verifyStatus = 'valid';
      var verifyMessage = "";

    })
    .always(function (jqXHR, textStatus, errorThrown) {
      if( prefilled == true) {
        accountDomainPrefilled(APIresponse, verifyStatus);
      }
      accountDomainLoaderWrapper.addClass('hidden');
      accountDomainEditLoaderWrapper.hide();
      accountDomainSubdomainString.removeClass('skeleton-text');

      handleFieldStatus(accountDomainField,verifyStatus,verifyMessage);


      return verifyStatus;
    });
  }
  else{

    var approvedSubdomains =  JSON.parse(localStorage.getItem('account-subdomains-approved'));
    var recommendedSubdomain = approvedSubdomains[account_domain_submitted];  

    response = {
      domain_exist:false,
      account_domain: recommendedSubdomain
    }

    if( prefilled == true) {
      accountDomainPrefilled(response, verifyStatus);
    }
    else{

      if(accountDomainField.val() === recommendedSubdomain){
        verifyStatus = 'valid';
      }
      else{
        verifyMessage = 'Workspace domain not available. Recommendation: '+ recommendedSubdomain ;
      }
    
      handleFieldStatus(accountDomainField,verifyStatus,verifyMessage);
    }

    return verifyStatus;
  }
}

function accountDomainPrefilled(response, verifyStatus){

  var domain_exist = response.domain_exist;
  var account_domain = response.account_domain;
  var verifyMessage = "";

  // shouldn't happen since the cloud function is supposed to incremante until a available domain is found
  if(domain_exist == true) {
    verifyMessage = "This workspace is not available, try another one"
    accountDomainWrapper.hide();
    accountDomainEditWrapper.removeClass('hidden');
  }

  if(!account_domain || account_domain == ''){
    accountDomainWrapper.hide();
    accountDomainEditWrapper.removeClass('hidden');
  }

  else{
    verifyStatus = 'valid';
    accountDomainField.val(account_domain);
    accountDomainSubdomainString.empty().text(account_domain);
    accountDomainLoaderWrapper.addClass('hidden');
    accountDomainSubdomainString.removeClass('skeleton-text'); 
  }

  handleFieldStatus(accountDomainField,verifyStatus,verifyMessage);


}

// used to verfiy the domain field is not empty and with the right format
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
    //display the loader, account domain sections
    accountDomainLoaderWrapper.removeClass('hidden');
    accountDomainTextInfoWrapper.removeClass('hidden');

    if(accountDomainEditWrapper.hasClass('hidden')){
      accountDomainWrapper.removeClass('hidden');
    }
    // extract the domain from company domain and check the account domain
    var extractedDomain = extractDomain(companyDomainField.val());
    accountDomainVerify('warning', extractedDomain, true);
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

// used to create or get the anymousId if it exist
function getOrCreateAnonymousId (anonymousId) {
  if (typeof analytics.user === 'function') {
      if (anonymousId) {
          analytics.user().anonymousId(anonymousId)
      } else {
          return analytics.user().anonymousId()
      }
  }
}

// used to manage errors responses from the account manager API
function handleErrors(response) {
  var verifyStatus = 'error';

  if (response) {
      if (response.responseJSON) {
        for (const field of Object.keys(response.responseJSON)) {
          const error = response.responseJSON[field]
          const inputField = $('input[name=' + field + ']')
          var stringToCheck = 'Company website or helpdesk website already exists or is reserved';
          var errorCheck = JSON.stringify(error).includes(stringToCheck);

          if(errorCheck == true){
            handleFieldStatus(companyDomainField,verifyStatus,"This URL is already linked to an existing workspace. Try a new URL or login");
            handleFieldStatus(accountDomainField,verifyStatus,"This workspace is reserved. Try a new one");
          }   

          // stylized the input when there is an error
          if (inputField.length > 0) {
            // insert an error messaging before the field
            for (const errorMsg of error) {
              handleFieldStatus(inputField,verifyStatus,error);
            }
          }
    
        }

      }
      else {
        handleFieldStatus(signupButton,"error","An unexpected error occurred. Please try again.")
      }
    }
  }
  
// used to init the form used (step 1)
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

// used to init the form account (step 2)
function signupAccountFormHandler(form){
  var API_INIT_ENDPOINT = '/account/init';

  post(
    API_INIT_ENDPOINT,
    null,
    //success
    function (data) {
      if (data.redirect_url) {
        window.location =  SIGNUP_FORM_PAGE;
      }
      
      if (data.shopify) {

        //if (!companyDomainField.val() && data.shopify.domain) { companyDomainField.val(data.shopify.domain) }
        if (!accountDomainField.val() && data.shopify.name) {
          companyDomainVerify('warning');
          accountDomainField.val(data.shopify.name)
        }
      }
      if (data.sso) {
        if (!companyDomainField.val() && data.sso.company_domain) {
          companyDomainField.val(data.sso.company_domain)
          companyDomainVerify('warning');
        }
        if (!accountDomainField.val() && data.sso.account_domain) {
          accountDomainField.val(data.sso.account_domain)
        }
      }
      if (typeof window.GORGIAS_INIT_CALLBACK === 'function') {
        window.GORGIAS_INIT_CALLBACK(data);
      }
    }
  )
}

// once submission start - clean all alert messaging and customize the button (disable + update value) an disable all fields to avoid update
function onSubmitStart(form, button) {
  form.find('input').prop("disabled", true);
  button.hide();
  signupButtonLoading.show();
}
  // once submission end - reset the submission button status and enable fields
function onSubmitEnd(form, button) {
    form.find('input').prop("disabled", false);
    button.show();
    signupButtonLoading.hide();

}

// function to create user using account manager API (step 1)
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

// used to reset the storage fields.
function resetLocalStorageFields () {
  window.localStorage.removeItem(email_key + '-status');
  window.localStorage.removeItem(password_key + '-status');
  window.localStorage.removeItem(fullname_key + '-status');
}

// function to create the account using account manager API (step 2)
function onSubmitAccountSignupForm(formData) {
  var API_VALIDATION_ENDPOINT = '/account/submit';
  accountFormLoadingWrapper.show()
  accountFormWrapper.hide();

  post(
    API_VALIDATION_ENDPOINT,
    formData,
    // success
    function (data) {
      // before redirecting, remove local storage to avoid confusion in case of resigning up
      localStorage.removeItem('account-subdomains-approved');
      window.location = data.redirect_url
    },
    //error
      function (response) {
        handleErrors(response)
        // remove the disable attribute + reset the styl of the button
        onSubmitEnd(accountForm, signupButton)
          // Hide the webflow animation turned with webflow interaction feature when click on form submission button
        // resetFieldStatus(accountDomainField);
        // resetFieldStatus(companyDomainField);
        accountDomainText.remove(classValidText);
        accountDomainWrapper.hide();
        accountDomainEditWrapper.show();
        accountFormLoadingWrapper.hide()
        accountFormWrapper.show();
    },
    //complete
    function (){
    }
  )
}


// once page is fully loaded
var Webflow = Webflow || [];
Webflow.push(function () {
  resetLocalStorageFields();
  Enablefields();

  // listen click on the edito button of the domain field (step 2)
  accountDomainEditButton.on('click',function(){
    accountDomainEditWrapper.show();
    accountDomainWrapper.hide();
  })

  // listen click on the save button of the domain field (step 2)
  accountDomainSaveButton.on('click',function(){

    var accountDomainSatus = accountDomainVerify('warning',accountDomainField.val(), false);
    if(accountDomainSatus == 'valid'){
      accountDomainEditWrapper.hide();
      accountDomainWrapper.show();
      accountDomainSubdomainString.empty().text(accountDomainField.val());

    }
  });

  // checking the email field when leaving the field
  emailField.on('blur', function() {
    emailVerify('warning');
  })

  // checking the company domain field when leaving the field
  companyDomainField.on('blur', function() {
    companyDomainVerify('warning');
  })

  // checking the company domain field when 1s after a keyup event
  companyDomainField.keyup(function() {
    clearTimeout(delayTimer); // Clear the previous timer, if any
    delayTimer = setTimeout(function() {
      companyDomainVerify('warning');
    }, 1000); 
  });

  // checking the account domain field when 1s after a keyup event
  accountDomainField.keyup(function() {
    clearTimeout(delayTimer); // Clear the previous timer, if any
    delayTimer = setTimeout(function() {
      accountDomainVerify('warning',accountDomainField.val(), false);
    }, 1000); 
  });

  // checking the account domain field when leaving the field
  accountDomainField.on('blur', function() {
    accountDomainVerify('warning',$(this).val(), false);
  })
  
  // checking the full name field when leaving the field
  fullnameField.on('blur', function() {
    fullnameVerify('warning');
  })
  
  // checking the password field when leaving the field
  passwordField.on('blur', function(){
    passwordVerify('warning');
  })
  
  // checking the email field when 1s after a keyup event
  emailField.keyup(function() {
    clearTimeout(delayTimer); // Clear the previous timer, if any
    delayTimer = setTimeout(function() {
      emailVerify('warning');
    }, 1000); 
  });
  
    // checking the fullname field when 1s after a keyup event
  fullnameField.keyup(function() {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
      fullnameVerify('warning');
    }, 1000); 
  });
  
  // checking password field without delay right after typing
  passwordField.on('input', function(){
    passwordVerify('warning');
  })
  
  // used to display / hide the password field content using the button within the field
  $('#transformButton').on('click', function() {
    currentType = passwordField.attr('type');
    
    if (currentType === 'password') {
      passwordField.attr('type', 'text')
    } else {
      passwordField.attr('type', 'password')
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
      resetLocalStorageFields();
    
      const DATADOG_BOT_USER_AGENT = 'Datadog/Synthetics';
      if (navigator.userAgent === DATADOG_BOT_USER_AGENT) {
        onSubmitUserSignupForm();
      }
      else {
        grecaptcha.execute();
      }
    }


  })
 
  // Used to trigger the function that will create the user through account manager API Once the captach is completed (step 1)
  window.onUserSignUpRecaptchaResponse = onSubmitUserSignupForm;

  // submission account form (step 2)
  accountForm.submit(function (event){
    event.preventDefault();
    event.stopPropagation();
    
   
    var form = $(this);
    var accountDomainStatus = getFieldStatusStorage(account_domain_key);
    var companyDomainStatus = getFieldStatusStorage(company_domain_key);
    var status = 'error';
    var messaging = 'Please check fields with error, then submit'

    if (accountDomainStatus !== 'valid' || companyDomainStatus !== 'valid') {
      companyDomainVerify(status);
      accountDomainVerify(status,companyDomainField.val(),false);
      handleFormStatus (form,status,messaging);

      return false; 
    }

    else{
      status = 'valid';
      window.localStorage.removeItem(account_domain_key + '-status');
      window.localStorage.removeItem(company_domain_key + '-status');


      let formData = {
        company_domain: companyDomainField.val(),
        account_domain: accountDomainField.val()
    
      }
      if(window.localStorage.getItem(plan_name_key)
        && window.localStorage.getItem(plan_name_key) == 'starter'
        && window.localStorage.getItem(plan_period_key) 
        && window.localStorage.getItem(plan_period_key) == 'monthly') {
        formData['account_subscription'] = {
            helpdesk: 'starter-monthly-usd-4'
        }
      }
      onSubmitStart(accountForm, signupButton)
      onSubmitAccountSignupForm(formData);
    }
  })

})