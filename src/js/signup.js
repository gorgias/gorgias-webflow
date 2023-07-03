(function(ns) {
  let waitForAnalyticsIntervalCount = 0
  let waitForAnalyticsIntervalMax = 3
  let waitForAnalyticsInterval = null

  // Wait up to 1000ms for Analytics library (Segment) to load
  ns.waitForAnalytics = function(callback) {
    waitForAnalyticsInterval = window.setInterval(function() {
      if (typeof analytics.user === 'function' || waitForAnalyticsIntervalCount >= waitForAnalyticsIntervalMax) {
        window.clearInterval(waitForAnalyticsInterval)
        callback()
      } else {
        waitForAnalyticsIntervalCount += 1
      }
    }, 1000)
  }
  // retrieve the frontend anonymous ID or create it (e.g. when the visitor use an ad_blocker)
  ns.getOrCreateAnonymousId = function(anonymousId) {
    if (typeof analytics.user === 'function') {
      if (anonymousId) {
        analytics.user().anonymousId(anonymousId)
      } else {
        return analytics.user().anonymousId()
      }
    }
  }
})

(window.signupGorgiasNamespace = window.signupGorgiasNamespace || {});

(function(ns) {
  const ERROR_COLOR = '#F54D63'
  const WARNING_COLOR = '#FF9B53'
  const API_BASE_URL = new URL(document.currentScript.src).origin + '/signup'
  const SESSION_TOKEN_KEY = 'x-account-manager-session-token'

  // function used to send data to our account manager API
  ns.post = function(endpoint, data, success, error) {
    return $.ajax({
      method: 'POST',
      url: API_BASE_URL + endpoint,
      data: JSON.stringify(data),
      contentType: 'application/json',
      beforeSend: function(jqXHR) {
        const sessionToken = window.localStorage.getItem(SESSION_TOKEN_KEY)
        if (sessionToken) {
          jqXHR.setRequestHeader(SESSION_TOKEN_KEY, sessionToken)
        }
      },
      complete: function(jqXHR, textStatus) {
        const sessionToken = jqXHR.getResponseHeader(SESSION_TOKEN_KEY)
        if (sessionToken) {
          window.localStorage.setItem(SESSION_TOKEN_KEY, sessionToken)
          ns.updateLinksForSession(sessionToken)
        }
      },
      success: function(data, status, jqXHR) {
        success(data)
      },
      error: error,
      crossDomain: true,
      crossOrigin: true,
      xhrFields: {
        withCredentials: true
      },
    })
  }

  // function used to to fetch url parameters and set a session token key as local storage
  ns.processURLSearchParams = function() {
    const searchParams = new URLSearchParams(window.location.search)
    const sessionToken = searchParams.get(SESSION_TOKEN_KEY)
    if (sessionToken) {
      window.localStorage.setItem(SESSION_TOKEN_KEY, sessionToken)
      ns.updateLinksForSession(sessionToken)
    }
    return searchParams
  }
  // update the link of the Google SSO by adding the sessionToken as URL parameter
  ns.updateLinksForSession = function(sessionToken) {
    if (!sessionToken) {
      sessionToken = window.localStorage.getItem(SESSION_TOKEN_KEY)
    }
    if (!sessionToken) {
      return
    }
    $("a.session-link").each(function() {
      const link = $(this)
      const href = new URL(link.attr("href"))
      href.searchParams.set(SESSION_TOKEN_KEY, sessionToken)
      link.attr("href", href.toString())
    })
  }
  // once submission start - clean all alert messaging and customize the button (disable + update value) an disable all fields to avoid update
  ns.onSubmitStart = function(form, button) {
    ns.clearAlert(form)
    form.find('input').prop("disabled", true)
    const buttonValue = button.val()
    button.val(button.data('wait'))
    button.data('wait', buttonValue)
  }

  // once submission end - reset the submission button status and enable fields
  ns.onSubmitEnd = function(form, button) {
    form.find('input').prop("disabled", false)
    const buttonValue = button.val()
    button.val(button.data('wait'))
    button.data('wait', buttonValue)
  }
  // manage errors responses from the account manager API
  ns.handleErrors = function(input, response) {
    if (response) {
      if (response.responseJSON) {
        for (const fieldName of Object.keys(response.responseJSON)) {
          const errors = response.responseJSON[fieldName]
          const inputField = $('input[name=' + fieldName + ']')

          // stylized the input when there is an error
          if (inputField.length) {
            inputField.addClass('error-outline')
          }

          // insert an error messaging before the field
          for (const errorMsg of errors) {
            ns.error(input, errorMsg)
          }
        }
      } else {
        ns.error(input, "An unexpected error occurred. Please try again.")
      }
    }
  }
  ns.error = function(input, errorMsg) {
    input.before(`<div class="input-alert" style="color: ${ERROR_COLOR}">${errorMsg}</div>`)
  }
  ns.warning = function(input, errorMsg) {
    input.before(`<div class="input-alert" style="color: ${WARNING_COLOR}">${errorMsg}</div>`)
  }

  // remove all the alert messaging
  ns.clearAlert = function() {
    const alerts = $('.input-alert')
    if (alerts) {
      alerts.remove()
    }
    $('input').removeClass('error-outline')
  }
})(window.signupGorgiasNamespace = window.signupGorgiasNamespace || {});
(function($) {
  // function to set a delay after a keyup in field in order to trigger live check functions
  $.fn.delayedChange = function(options) {
    let timer
    let o
    if (jQuery.isFunction(options)) {
      o = {
        onChange: options
      }
    } else {
      o = options
    }
    o = $.extend({}, $.fn.delayedChange.defaultOptions, o)
    return this.each(function() {
      const self = this
      const element = $(this)
      element.on('keyup paste', function() {
        clearTimeout(timer)
        timer = setTimeout(function() {
          let newVal = element.val()
          newVal = $.trim(newVal)
          if (element.delayedChange.oldVal !== newVal) {
            element.delayedChange.oldVal = newVal
            o.onChange.call(self)
          }
        }, o.delay)
      })
    })
  }
  $.fn.delayedChange.defaultOptions = {
    delay: 300,
    onChange: function() {}
  }
  $.fn.delayedChange.oldVal = ""
})(jQuery);
(function(ns) {


  const SIGNUP_ACCOUNT_FORM_PAGE = '/signup/account'
  const API_USER_SUBMIT_ENDPOINT = '/user/submit'
  $(document).ready(function() {
    // there is a function in the head of the pages that disable the fields by default, the following line turned them back on once JQuery is loaded to avoid visitors trying to submit the form while the page is not fully ready to submit data
    $("input").prop("disabled", false)
    const searchParams = ns.processURLSearchParams()

    // personalize the SSO button link
    ns.updateLinksForSession()

    // autocomplete email field with url parameter data if possible
    const emailValue = searchParams.get('email')
    const emailInput = $('input[name=email]')
    if (emailValue && emailInput.length) {
      emailInput.val(emailValue)
    }
    // wait for analytics (segment) to load - up to 1000ms - then identify which form is no the page: step 1 = user-form & step 2 = account-form. Lastly trigger the right function
    ns.waitForAnalytics(function() {
      const userForm = $('#signup-user-form')
      const accountForm = $('#signup-account-form')
      if (userForm.length) {
        signupUserFormHandler(userForm)
      } else if (accountForm.length) {
        signupAccountFormHandler(accountForm)
      }
    })
  })

  function signupUserFormHandler(form) {
    const API_INIT_ENDPOINT = '/user/init'
    const API_VALIDATION_ENDPOINT = '/user/validation'
    const EMAIL_INPUT_SELECTOR = 'input[name=email]'
    const NAME_INPUT_SELECTOR = 'input[name=name]'
    const PASSWORD_INPUT_SELECTOR = 'input[name=password]'
    const initParams = {
      'anonymous_id': ns.getOrCreateAnonymousId()
    }

    // initiat the API 
    ns.post(API_INIT_ENDPOINT, initParams, function(data) {
      ns.getOrCreateAnonymousId(data.anonymous_id)
      // question: in which scenario can we get an error at the intit call?
      // what are all the errors options?
      if (data.errors) {
        ns.handleErrors(form, {
          responseJSON: data.errors
        })
      }
      // question: what do we get in data.shopify?
      // In which occasion it returns value
      if (data.shopify) {
        const emailInput = $(EMAIL_INPUT_SELECTOR)
        const nameInput = $(NAME_INPUT_SELECTOR)
        const passwordInput = $(PASSWORD_INPUT_SELECTOR)
        if (!emailInput.val() && data.shopify.email) {
          emailInput.val(data.shopify.email)
        }
        if (!nameInput.val() && data.shopify.shop_owner) {
          nameInput.val(data.shopify.shop_owner)
        }
        if (emailInput.val() && nameInput.val() && !passwordInput.val()) {
          passwordInput.focus()
        }
      }
      if (typeof window.GORGIAS_INIT_CALLBACK === 'function') {
        // question: what are the data passed in GORGIAS_INIT_CALLBACK
        window.GORGIAS_INIT_CALLBACK(data)
      }
    }, function(response) {
      console.error("API init call failed", response)
    })
    // when the email input is updated, wait a delay then send data for validation 
    $(EMAIL_INPUT_SELECTOR).delayedChange(function() {
      const self = $(this)
      ns.clearAlert(form)
      if (self.is(':valid')) {
        const validationData = {
          name: $(NAME_INPUT_SELECTOR).val(),
          email: $.trim(self.val()),
          password: $(PASSWORD_INPUT_SELECTOR).val(),
        }
        ns.post(API_VALIDATION_ENDPOINT, validationData, function(data) {
          if (data && data['signup-email-validation']) {
            const validationResult = data['signup-email-validation']
            if (validationResult.risk === 'high') {
              if (validationResult.reason === 'mailbox_is_disposable_address') {
                ns.error(self, 'Please do not use disposable email addresses.')
              }
              if (validationResult.reason === 'mailbox_does_not_exist') {
                ns.warning(self, 'Are you sure this email address exists?')
              }
            }
            if (validationResult.risk === 'medium') {
              if (validationResult.reason === 'mailbox_is_role_address') {
                ns.warning(self, 'Please use your personal work email address if possible.')
              }
            }
          }
        }, function(response) {
          ns.handleErrors(self, response)
        })
      }
    })

    // on form submission, stop the default submission logic.
    // let's check is submission come from datadog our error monitoring tool
    // If notdatadog let's execute the captcha logic first
    form.submit(function(event) {
      event.preventDefault()
      event.stopPropagation()
      const DATADOG_BOT_USER_AGENT = 'Datadog/Synthetics'
      if (navigator.userAgent === DATADOG_BOT_USER_AGENT) {
        onSubmitUserSignupForm()
      } else {
        grecaptcha.execute()
      }
    })
  }
  // function to create user (step 1)
  function onSubmitUserSignupForm(response) {
    const userForm = $('#signup-user-form')
    const submitButton = $('#signup-button')
    const formData = {
      'email': $.trim($('input[name=email]').val()),
      'name': $.trim($('input[name=name]').val()),
      'password': $('input[name=password]').val(),
      'recaptcha_response': response
    }
    // pass the form and button to onSubmitStart function to disable fields and change button copy
    ns.onSubmitStart(userForm, submitButton)
    ns.post(
      API_USER_SUBMIT_ENDPOINT,
      formData,
      // in case of success, redirect to the 2nd step of the funnel
      function() {
        // Important: we keep the search (url parameters) in order to pass them to the following step
        window.location = SIGNUP_ACCOUNT_FORM_PAGE + window.location.search
      },
      // in case of error:
      function(response) {
        // pass the form and button to reset fields and change button copy
        ns.onSubmitEnd(userForm, submitButton)
        // Manage error to display the right message for the right field
        // question: can we have the list of all error options
        ns.handleErrors(userForm, response)
        // reset the captcha
        grecaptcha.reset()
      })
  }
  // Once the captach is completed, then trigger the function to create user
  window.onUserSignUpRecaptchaResponse = onSubmitUserSignupForm

  // function to create an account (step 2)
  function signupAccountFormHandler(form) {
    const API_INIT_ENDPOINT = '/account/init'
    const API_ACCOUNT_ACTION_ENDPOINT = '/account/submit'
    const COMPANY_DOMAIN_INPUT_SELECTOR = 'input[name=company_domain]'
    const ACCOUNT_DOMAIN_INPUT_SELECTOR = 'input[name=account_domain]'
    const urlParams = new URLSearchParams(window.location.search)
    // note: the post function also send the session_token as well to retrieve the signup details of previous step
    ns.post(API_INIT_ENDPOINT, null, function(data) {

      // question: In which occasion can we have a redirection here?
      if (data.redirect_url) {
        window.location = data.redirect_url
      }

      // question: In which occasion do we have data.shopify as a return?
      if (data.shopify) {
        const companyDomainInput = $(COMPANY_DOMAIN_INPUT_SELECTOR)
        const accountDomainInput = $(ACCOUNT_DOMAIN_INPUT_SELECTOR)
        if (!companyDomainInput.val() && data.shopify.domain) {
          companyDomainInput.val(data.shopify.domain)
        }
        if (!accountDomainInput.val() && data.shopify.name) {
          accountDomainInput.val(data.shopify.name)
        }
      }
      if (data.sso) {
        const companyDomainInput = $(COMPANY_DOMAIN_INPUT_SELECTOR)
        // in case the previous step come from SSO, if the company domain field is empty but we retreive the company domain from previous SSO step, then let's autocomplete the field
        // question: How do we do that on the backend, what's the logic?
        if (!companyDomainInput.val() && data.sso.company_domain) {
          companyDomainInput.val(data.sso.company_domain)
        }
        // in case the previous step come from SSO, if the account domain field is empty but we retreive the account domain from previous SSO step, then let's autocomplete the field
        // question: How is it possible since the account is not yet created?
        const accountDomainInput = $(ACCOUNT_DOMAIN_INPUT_SELECTOR)
        if (!accountDomainInput.val() && data.sso.account_domain) {
          accountDomainInput.val(data.sso.account_domain)
        }
      }
      // question: what are the data passed in GORGIAS_INIT_CALLBACK
      if (typeof window.GORGIAS_INIT_CALLBACK === 'function') {
        window.GORGIAS_INIT_CALLBACK(data)
      }
    })
    // one one of the field change, let's valid the data
    $(COMPANY_DOMAIN_INPUT_SELECTOR + ', ' + ACCOUNT_DOMAIN_INPUT_SELECTOR).delayedChange(function() {
      const self = $(this)
      ns.clearAlert(self)
      if (self.is(':valid')) {
        let validationData = {
          company_domain: $.trim($(COMPANY_DOMAIN_INPUT_SELECTOR).val()),
          account_domain: $.trim($(ACCOUNT_DOMAIN_INPUT_SELECTOR).val()),
        }
        // add in the validation data some helpdesk plan details depending of the url paramerters
        if (urlParams.get('plan_name') === 'starter' && urlParams.get('period') === 'monthly') {
          validationData['account_subscription'] = {
            helpdesk: 'starter-monthly-usd-4'
          }
        }
      }
    })

    // once form is submitted on /signup/account
    form.submit(function(e) {
      // stop the default propagation
      e.preventDefault()
      e.stopPropagation()
      let formData = {
        company_domain: $.trim($(COMPANY_DOMAIN_INPUT_SELECTOR).val()),
        account_domain: $.trim($(ACCOUNT_DOMAIN_INPUT_SELECTOR).val()),
      }
      if (urlParams.get('plan_name') === 'starter' && urlParams.get('period') === 'monthly') {
        formData['account_subscription'] = {
          helpdesk: 'starter-monthly-usd-4'
        }
      }
      const submitButton = $('#signup-button')
      ns.onSubmitStart(form, submitButton)
      ns.post(
        API_ACCOUNT_ACTION_ENDPOINT,
        formData,
        // in case of success, redirect to the helpdesk url
        function(data) {
          window.location = data.redirect_url
        },
        // in cas of error, handle them
        function(response) {
          // remove the disable attribute + reset the styl of the button
          ns.onSubmitEnd(form, submitButton)
          ns.handleErrors(form, response)
          // Hide the webflow animation turned with webflow interaction feature when click on form submission button
          $('.pop-up-waiting').removeClass('visible')
        }
      )
    })
  }
})(window.signupGorgiasNamespace = window.signupGorgiasNamespace || {})

$(document).ready(function() {
  // Create the new div element for email warning and insert it after the email field
  var emailWarningDiv = $('<div id = "emailWarning"></div>');
  var fullnameWarningDiv = $('<div id = "fullnameWarning"></div>');
  emailWarningDiv.insertAfter('#signup-user-form input[type="email"]');
  fullnameWarningDiv.insertAfter('#signup-user-form input[name="Name"]');

  // $('#wf-form-Signup-2-Form').attr('novalidate','novalidate')
  //$('#wf-form-Signup-2-Form').attr('formnovalidate','novalidate')

  // Regular expressions to check for lowercase, uppercase, and number
  var lowercaseRegex = /[a-z]/;
  var uppercaseRegex = /[A-Z]/;
  var numberRegex = /[0-9]/;


  function validateEmail(email) {
    var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (email == '') {

      return {
        status: 'error',
        message: 'We need your email to create your account'
      };
    } else if (!regex.test(email)) {
      return {
        status: 'error',
        message: 'Your email is not correct'
      };
    } else if (!isProfessionalEmail(email)) {
      return {
        status: 'warning',
        message: 'Keep a good work-life balance, use a professional email'
      };
    }
    return {
      status: 'success',
      message: null
    };
  }

  function isProfessionalEmail(email) {
    // Custom logic to determine if the email is professional or not
    // You can use regular expressions or any other method
    // Here's a simple example using a predefined list of professional email domains
    var notProfessionalDomains = ['gmail.com', 'outlook.com'];
    var domain = email.split('@')[1];
    return !notProfessionalDomains.includes(domain);
  }

  function validateFullName(fullName) {
    var regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(fullName)) {
      return {
        status: 'error',
        message: 'We need your fullname to create your account'
      };
    }
    return {
      status: 'success',
      message: null
    };
  }


  $('#signup-user-form input[type="email"]').on('blur', function() {
    var email = $(this).val();
    var error = validateEmail(email);
    if (error) {
      $('#emailWarning').text(error).addClass("warning-text").removeClass('error-text').removeClass('valid-text');
      $(this).removeClass('valid-input').removeClass('error-input').addClass('warning-input');
    }
    if (validation.status === 'success') {
      $('#emailWarning').text('').addClass("valid-text").removeClass('error-text').removeClass('warning-text');
      $(this).addClass('valid-input');
      $(this).removeClass('warning-input');
      $(this).removeClass('error-input');
    }
  });

  $('#signup-user-form input[name="Name"]').on('blur', function() {
    var fullName = $(this).val();
    var error = validateFullName(fullName);

    if (error) {
      $('#fullnameWarning').text(error).addClass("warning-text").removeClass('error-text').removeClass('valid-text');
      $(this).removeClass('valid-input').removeClass('error-input').addClass('warning-input');
    } else {
      $('#fullnameWarning').text('').addClass("valid-text").removeClass('error-text').removeClass('warning-text');
      $(this).addClass('valid-input').removeClass('warning-input').removeClass('error-input');

    }
  });

  $('#signup-user-form input[name="Password"]').on('input', function() {
    var password = $(this).val();
    // Check password length
    if (password.length >= 8) {
      $('#signup-user-form ul li#pwd-message-length').addClass('password-condition-valid').removeClass('password-condition-warning').removeClass('password-condition-error');
    } else {
      $('#signup-user-form ul li#pwd-message-length').removeClass('password-condition-valid');
    }

    // check uppercase
    if (uppercaseRegex.test(password)) {
      $('#signup-user-form ul li#pwd-message-uppercase').addClass('password-condition-valid').removeClass('password-condition-warning').removeClass('password-condition-error');
    } else {
      $('#signup-user-form ul li#pwd-message-uppercase').removeClass('password-condition-valid');
    }
    // check lowercase
    if (lowercaseRegex.test(password)) {
      $('#signup-user-form ul li#pwd-message-lowercase').addClass('password-condition-valid').removeClass('password-condition-warning').removeClass('password-condition-error');
    } else {
      $('#signup-user-form ul li#pwd-message-lowercase').removeClass('password-condition-valid');
    }

    // check number
    if (numberRegex.test(password)) {
      $('#signup-user-form ul li#pwd-message-number').addClass('password-condition-valid').removeClass('password-condition-warning').removeClass('password-condition-error');
    } else {
      $('#signup-user-form ul li#pwd-message-number').removeClass('password-condition-valid');
    }

  });

  $('#signup-user-form input[name="Password"]').on('focusout', function() {
    var password = $(this).val();

    // Check password length
    if (password.length >= 8) {
      $('#signup-user-form ul li#pwd-message-length').addClass('password-condition-valid').removeClass('password-condition-warning').removeClass('password-condition-error');
    } else {
      $('#signup-user-form ul li#pwd-message-length').removeClass('password-condition-valid').removeClass('password-condition-error').addClass('password-condition-warning');
    }
    // check uppercase
    if (uppercaseRegex.test(password)) {
      $('#signup-user-form ul li#pwd-message-uppercase').addClass('password-condition-valid').removeClass('password-condition-warning').removeClass('password-condition-error');
    } else {
      $('#signup-user-form ul li#pwd-message-uppercase').removeClass('password-condition-valid').removeClass('password-condition-error').addClass('password-condition-warning');
    }
    // check lowercase
    if (lowercaseRegex.test(password)) {
      $('#signup-user-form ul li#pwd-message-lowercase').addClass('password-condition-valid').removeClass('password-condition-warning').removeClass('password-condition-error');
    } else {
      $('#signup-user-form ul li#pwd-message-lowercase').removeClass('password-condition-valid').removeClass('password-condition-error').addClass('password-condition-warning');
    }
    // check number
    if (numberRegex.test(password)) {
      $('#signup-user-form ul li#pwd-message-number').addClass('password-condition-valid').removeClass('password-condition-warning').removeClass('password-condition-error');
    } else {
      $('#signup-user-form ul li#pwd-message-number').removeClass('password-condition-valid').removeClass('password-condition-error').addClass('password-condition-warning');
    }

    if (password.length >= 8 &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password)) {
      $(this).addClass('valid-input-pass');
      $(this).removeClass('error-input-pass');
    } else {
      $(this).removeClass('valid-input-pass');
      $(this).addClass('error-input-pass');
    }

  });

  // change password field type on click to display / hide the input
  $('#transformButton').on('click', function() {
    currentType = $('#signup-user-form input[name="Password"]').attr('type');
    if (currentType === 'password') {
      $('#signup-user-form input[name="Password"]').attr('type', 'text')
    } else {
      $('#signup-user-form input[name="Password"]').attr('type', 'password')
    }
  })

  // form submission checker
  let form = document.getElementById('wf-form-Signup-2-Form');
  form.addEventListener('submit', handlerCallback, true);

  function handlerCallback(event) {
    event.preventDefault();
    event.stopPropagation();
    var isValid = true;

    var email = $('#signup-user-form input[type="email"]');
    var errorEmail = validateEmail(email.val());
    if (errorEmail) {
      email.removeClass('valid-input');
      email.removeClass('warning-input');
      email.addClass('error-input');
      $('#emailWarning').text(errorEmail.message).addClass("error-text").removeClass('warning-text').removeClass('valid-text');
    }

    var fullName = $('#signup-user-form input[name="Name"]');
    var errorFullName = validateFullName(fullName.val());
    if (errorFullName) {
      fullName.removeClass('valid-input');
      fullName.removeClass('warning-input');
      fullName.addClass('error-input');
      $('#fullnameWarning').text(errorFullName);
      $('#fullnameWarning').text(errorEmail).addClass("error-text").removeClass('warning-text').removeClass('valid-text');
    }

    var password = $('#signup-user-form input[name="Password"]');
    var errorPasswordUppercase = !uppercaseRegex.test(password.val());
    var errorPasswordLowercase = !lowercaseRegex.test(password.val());
    var errorPasswordNumber = !numberRegex.test(password.val());
    var errorPasswordLength = password.val().length < 8;
    if (errorPasswordUppercase) {
      $('#signup-user-form ul li#pwd-message-uppercase').addClass('password-condition-error').removeClass('password-condition-warning').removeClass('password-condition-valid');
      isValid = false;
    }
    if (errorPasswordLowercase) {
      $('#signup-user-form ul li#pwd-message-lowercase').addClass('password-condition-error').removeClass('password-condition-warning').removeClass('password-condition-valid');
      isValid = false;
    }
    if (errorPasswordNumber) {
      $('#signup-user-form ul li#pwd-message-number').addClass('password-condition-error').removeClass('password-condition-warning').removeClass('password-condition-valid');
      isValid = false;
    }
    if (errorPasswordLength) {
      $('#signup-user-form ul li#pwd-message-length').addClass('password-condition-error').removeClass('password-condition-warning').removeClass('password-condition-valid');
      isValid = false;
    }

    if (errorPasswordUppercase == true || errorPasswordLowercase == true || errorPasswordNumber == true || errorPasswordLength == true) {
      isValid = false;
      password.addClass('error-input-pass')
    }

    if (!isValid) {
      return;
    }
    // the rest of your code here
  }
});
