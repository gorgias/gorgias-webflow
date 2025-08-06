alert("this is signup-3.js");

"use strict";

/**
 * Main IIFE to encapsulate all logic and avoid polluting the global scope.
 */
(() => {
  /**
   * jQuery plugin: delayedChange
   * Triggers a callback after a delay when the input value changes.
   */
  (function ($) {
    $.fn.delayedChange = function (options) {
      let timer;
      let pluginOptions = $.isFunction(options) ? { onChange: options } : options;
      const opts = $.extend({}, $.fn.delayedChange.defaultOptions, pluginOptions);

      return this.each(function () {
        const element = $(this);
        element.on("keyup paste", () => {
          clearTimeout(timer);
          timer = window.setTimeout(() => {
            let newValue = $.trim(element.val());
            if (element.delayedChange.oldVal !== newValue) {
              element.delayedChange.oldVal = newValue;
              opts.onChange.call(this);
            }
          }, opts.delay);
        });
      });
    };
    $.fn.delayedChange.defaultOptions = {
      delay: 300,
      onChange: function () {}
    };
    $.fn.delayedChange.oldVal = "";
  })(jQuery);

  // --- Constants ---
  const WAIT_FOR_ANALYTICS_INTERVAL_MS = 1000;
  const WAIT_FOR_ANALYTICS_MAX_TRIES = 3;
  const ERROR_COLOR = "#F54D63";
  const WARNING_COLOR = "#FF9B53";
  const scriptOrigin = new URL(document.currentScript.src).origin;
  const API_BASE_URL = scriptOrigin === "http://127.0.0.1:5500"
    ? "https://accounts.gorgias.com/signup"
    : scriptOrigin + "/signup";
  const SESSION_TOKEN_KEY = "x-account-manager-session-token";
  const SIGNUP_ACCOUNT_FORM_PAGE = "/signup/account";
  const API_USER_SUBMIT_ENDPOINT = "/user/submit";
  const API_USER_VALIDATION_ENDPOINT = "/user/validation";
  const API_DOMAIN_VALIDATION_URL = "https://us-central1-gorgias-growth-production.cloudfunctions.net/check_helpdesk_domain";
  const FIELD_STATUS_SUFFIX = "-status";
  const FIELD_MESSAGE_SHAKE_DURATION_MS = 300;

  // --- Utility Functions ---

  /**
   * Waits for the analytics object to be ready before executing a callback.
   */
  function waitForAnalytics(callback) {
    let tries = 0;
    let interval = window.setInterval(() => {
      if (
        typeof analytics.user === "function" ||
        tries >= WAIT_FOR_ANALYTICS_MAX_TRIES
      ) {
        window.clearInterval(interval);
        callback();
      } else {
        tries += 1;
      }
    }, WAIT_FOR_ANALYTICS_INTERVAL_MS);
  }

  /**
   * Gets or sets the anonymous ID for analytics.
   */
  function getOrSetAnonymousId(anonymousId) {
    if (typeof analytics.user === "function") {
      if (anonymousId) {
        analytics.user().anonymousId(anonymousId);
      } else {
        return analytics.user().anonymousId();
      }
    }
    return undefined;
  }

  /**
   * Makes a POST request to the API.
   */
  function post(endpoint, data, onSuccess, onError, onComplete) {
    $.ajax({
      method: "POST",
      url: API_BASE_URL + endpoint,
      data: JSON.stringify(data),
      contentType: "application/json",
      beforeSend: function (jqXHR) {
        const sessionToken = window.localStorage.getItem(SESSION_TOKEN_KEY);
        if (sessionToken) {
          jqXHR.setRequestHeader(SESSION_TOKEN_KEY, sessionToken);
        }
      },
      complete: (jqXHR) => {
        if (onComplete) onComplete(jqXHR);
        const sessionToken = jqXHR.getResponseHeader(SESSION_TOKEN_KEY);
        if (sessionToken) {
          window.localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
          updateLinksForSession(sessionToken);
        }
      },
      success: (responseData) => {
        onSuccess(responseData);
      },
      error: onError,
      crossDomain: true,
      crossOrigin: true,
      xhrFields: { withCredentials: true }
    });
  }

  /**
   * Processes URL search parameters and updates session token if present.
   */
  function processURLSearchParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const sessionToken = searchParams.get(SESSION_TOKEN_KEY);
    if (sessionToken) {
      window.localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      updateLinksForSession(sessionToken);
    }
    return searchParams;
  }

  /**
   * Updates all links with the session token.
   */
  function updateLinksForSession(token) {
    const sessionToken = token || window.localStorage.getItem(SESSION_TOKEN_KEY);
    if (!sessionToken) return;
    $("a.session-link").each(function () {
      const link = $(this);
      const href = new URL(link.attr("href") || "");
      href.searchParams.set(SESSION_TOKEN_KEY, sessionToken);
      link.attr("href", href.toString());
    });
  }

  /**
   * Handles the UI state at the start of a form submission.
   */
  function onSubmitStart(form, button) {
    clearAlert();
    form.find("input").prop("disabled", true);
    const buttonValue = button.val();
    button.val(button.data("wait"));
    button.data("wait", buttonValue);
  }

  /**
   * Handles the UI state at the end of a form submission.
   */
  function onSubmitEnd(form, button) {
    form.find("input").prop("disabled", false);
    const buttonValue = button.val();
    button.val(button.data("wait"));
    button.data("wait", buttonValue);
  }

  /**
   * Handles and displays errors from API responses.
   */
  function handleErrors(input, response) {
    if (response) {
      if (response.responseJSON) {
        const data = response.responseJSON;
        for (const fieldName of Object.keys(data)) {
          const errors = data[fieldName];
          const inputField = $("input[name=" + fieldName + "]");
          if (inputField.length) {
            inputField.addClass("error-outline");
          }
          for (const errorMsg of errors) {
            error(input, errorMsg);
          }
        }
      } else {
        error(input, "An unexpected error occurred. Please try again.");
      }
    }
  }

  /**
   * Displays an error message before the input.
   */
  function error(input, errorMsg) {
    input.before(`<div class="input-alert" style="color: ${ERROR_COLOR}">${errorMsg}</div>`);
  }

  /**
   * Displays a warning message before the input.
   */
  function warning(input, errorMsg) {
    input.before(`<div class="input-alert" style="color: ${WARNING_COLOR}">${errorMsg}</div>`);
  }

  /**
   * Clears all alert messages and error outlines.
   */
  function clearAlert() {
    const alerts = $(".input-alert");
    if (alerts) {
      alerts.remove();
    }
    $("input").removeClass("error-outline");
  }

  /**
   * Mirrors the email input value to the fullname input.
   */
    function mirrorEmailToFullname(fullname, email) {
      if (email.val()) {
        fullname.val(email.val());
      }
    }
 
  // --- Form Initialization and Handlers ---

  /**
   * Initializes the signup page, sets up forms and handlers.
   */
  function init() {
    $("input").prop("disabled", false);
    const searchParams = processURLSearchParams();
    updateLinksForSession();

    // Prefill email if present in URL
    const emailValue = searchParams.get("email");
    const emailInput = $("input[name=email]");
    if (emailValue && emailInput.length) {
      emailInput.val(emailValue);
    }

    // Mirror email to fullname if present
    const fullnameInput = $("input[name=fullname]");
    if (emailInput.length && fullnameInput.length) {
      mirrorEmailToFullname(fullnameInput, emailInput);
    }

    // Wait for analytics to be ready before setting up form handlers
    waitForAnalytics(function () {
      console.log("Forms submission handlers setup is started.");
      const userForm = $("#signup-user-form");
      const accountForm = $("#signup-account-form");
      if (userForm.length) {
        console.info("Subscribing the user form submission handler.");
        signupUserFormHandler(userForm);
        console.info("User form submission handler successfully subscribed.");
      } else if (accountForm.length) {
        console.info("Subscribing the account form submission handler.");
        signupAccountFormHandler(accountForm);
        console.info("Account form submission handler successfully subscribed.");
      }
    });

    // Expose recaptcha callback
    window.onUserSignUpRecaptchaResponse = onSubmitUserSignupForm;
  }

  /**
   * Handles the user signup form logic.
   */
  function signupUserFormHandler(form) {
    const API_INIT_ENDPOINT = "/user/init";
    const API_VALIDATION_ENDPOINT = "/user/validation";
    const EMAIL_INPUT_SELECTOR = "input[name=email]";
    const NAME_INPUT_SELECTOR = "input[name=fullname]";
    const PASSWORD_INPUT_SELECTOR = "input[name=password]";
    const initParams = { "anonymous_id": getOrSetAnonymousId() };

    // Initialize user form with data from API
    post(API_INIT_ENDPOINT, initParams, function (data) {
      getOrSetAnonymousId(data.anonymous_id);
      if (data.errors) {
        handleErrors(form, { responseJSON: data.errors });
      }
      if (data.shopify) {
        const emailInput = $(EMAIL_INPUT_SELECTOR);
        const nameInput = $(NAME_INPUT_SELECTOR);
        const passwordInput = $(PASSWORD_INPUT_SELECTOR);
        if (!emailInput.val() && data.shopify.email) {
          emailInput.val(data.shopify.email);
        }
        if (!nameInput.val() && data.shopify.shop_owner) {
          nameInput.val(data.shopify.shop_owner);
        }
        if (emailInput.val() && nameInput.val() && !passwordInput.val()) {
          passwordInput.focus();
        }
      }
      if (typeof window.GORGIAS_INIT_CALLBACK === "function") {
        window.GORGIAS_INIT_CALLBACK(data);
      }
    }, function (response) {
      console.error("API init call failed", response);
    });

    //  on change change
    $(EMAIL_INPUT_SELECTOR).delayedChange(function () {
      const self = $(this);
      const fullnameInput = $(NAME_INPUT_SELECTOR);

      mirrorEmailToFullname(fullnameInput, self);


      // Validate email
      clearAlert();
      if (self.is(":valid")) {
        const validationData = {
          name: $(NAME_INPUT_SELECTOR).val(),
          email: $.trim(self.val()),
          password: $(PASSWORD_INPUT_SELECTOR).val()
        };
        post(API_VALIDATION_ENDPOINT, validationData, function (data) {
          if (data && data["signup-email-validation"]) {
            const validationResult = data["signup-email-validation"];
            if (validationResult.risk === "high") {
              if (validationResult.reason === "mailbox_is_disposable_address") {
                error(self, "Please do not use disposable email addresses.");
              }
              if (validationResult.reason === "mailbox_does_not_exist") {
                warning(self, "Are you sure this email address exists?");
              }
            }
            if (validationResult.risk === "medium") {
              if (validationResult.reason === "mailbox_is_role_address") {
                warning(self, "Please use your personal work email address if possible.");
              }
            }
          }
        }, function (response) {
          handleErrors(self, response);
        });
      }
    });

    // Handle form submission
    form.submit(function (event) {
      event.preventDefault();
      event.stopPropagation();
      const DATADOG_BOT_USER_AGENT = "Datadog/Synthetics";
      if (navigator.userAgent === DATADOG_BOT_USER_AGENT) {
        onSubmitUserSignupForm();
      } else {
        void grecaptcha.execute();
      }
    });
  }

  /**
   * Handles the user signup form submission.
   */
  function onSubmitUserSignupForm(response) {
    console.info("Submission of user form started.");
    const userForm = $("#signup-user-form");
    const submitButton = $("#signup-button");
    const formData = {
      "email": $.trim($("input[name=email]").val()),
      "name": $.trim($("input[name=name]").val()),
      "password": $("input[name=password]").val(),
      "recaptcha_response": response
    };
    onSubmitStart(userForm, submitButton);
    post(API_USER_SUBMIT_ENDPOINT, formData, function () {
      console.info("Request for submitting user data is completed successfully. Redirecting to account page.");
      window.location.href = SIGNUP_ACCOUNT_FORM_PAGE + window.location.search;
    }, function (response2) {
      console.error("Request for submitting user data is failed.");
      onSubmitEnd(userForm, submitButton);
      handleErrors(userForm, response2);
      grecaptcha.reset();
    });
  }

  /**
   * Handles the account signup form logic.
   */
  function signupAccountFormHandler(form) {
    const API_INIT_ENDPOINT = "/account/init";
    const API_ACCOUNT_ACTION_ENDPOINT = "/account/submit";
    const COMPANY_DOMAIN_INPUT_SELECTOR = "input[name=company_domain]";
    const ACCOUNT_DOMAIN_INPUT_SELECTOR = "input[name=account_domain]";
    const urlParams = new URLSearchParams(window.location.search);

    // Initialize account form with data from API
    post(API_INIT_ENDPOINT, null, function (data) {
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
      if (data.shopify) {
        const companyDomainInput = $(COMPANY_DOMAIN_INPUT_SELECTOR);
        const accountDomainInput = $(ACCOUNT_DOMAIN_INPUT_SELECTOR);
        if (!companyDomainInput.val() && data.shopify.domain) {
          companyDomainInput.val(data.shopify.domain);
        }
        if (!accountDomainInput.val() && data.shopify.name) {
          accountDomainInput.val(data.shopify.name);
        }
      }
      if (data.sso) {
        const companyDomainInput = $(COMPANY_DOMAIN_INPUT_SELECTOR);
        if (!companyDomainInput.val() && data.sso.company_domain) {
          companyDomainInput.val(data.sso.company_domain);
        }
        const accountDomainInput = $(ACCOUNT_DOMAIN_INPUT_SELECTOR);
        if (!accountDomainInput.val() && data.sso.account_domain) {
          accountDomainInput.val(data.sso.account_domain);
        }
      }
      if (typeof window.GORGIAS_INIT_CALLBACK === "function") {
        window.GORGIAS_INIT_CALLBACK(data);
      }
    });

    // Validate company and account domain on change
    $(COMPANY_DOMAIN_INPUT_SELECTOR + ", " + ACCOUNT_DOMAIN_INPUT_SELECTOR).delayedChange(function () {
      const self = $(this);
      clearAlert();
      if (self.is(":valid")) {
        const validationData = {
          company_domain: $.trim($(COMPANY_DOMAIN_INPUT_SELECTOR).val()),
          account_domain: $.trim($(ACCOUNT_DOMAIN_INPUT_SELECTOR).val())
        };
        if (urlParams.get("plan_name") === "starter" && urlParams.get("period") === "monthly") {
          validationData["account_subscription"] = { helpdesk: "starter-monthly-usd-4" };
        }
        // Add validation API call here if needed
      }
    });

    // Handle form submission
    form.submit(function (e) {
      console.info("Submission of account form is started.");
      e.preventDefault();
      e.stopPropagation();
      const formData = {
        company_domain: $.trim($(COMPANY_DOMAIN_INPUT_SELECTOR).val()),
        account_domain: $.trim($(ACCOUNT_DOMAIN_INPUT_SELECTOR).val())
      };
      if (urlParams.get("plan_name") === "starter" && urlParams.get("period") === "monthly") {
        formData["account_subscription"] = { helpdesk: "starter-monthly-usd-4" };
      }
      const submitButton = $("#signup-button");
      onSubmitStart(form, submitButton);
      post(API_ACCOUNT_ACTION_ENDPOINT, formData, function (data) {
        console.info("Request for submitting account data is completed successfully. Redirect to Gorgias.");
        window.location.href = data.redirect_url;
      }, function (response) {
        console.error("Request for submitting account data is failed.");
        onSubmitEnd(form, submitButton);
        handleErrors(form, response);
        $(".pop-up-waiting").removeClass("visible");
      });
    });
  }

  // --- Validation Functions ---

  /**
   * Validates an email address.
   */
  function validateEmail(email) {
    if (!email || email === "") {
      return "We need your email to create your account";
    }
    const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!regexEmail.test(email)) {
      return "The email you entered is incomplete";
    }
    return undefined;
  }

  /**
   * Validates a name.
   */
  function validateName(name) {
    if (!name || name === "") {
      return "We need your fullname to create your account";
    }
    return undefined;
  }

  /**
   * Validates a password for length and character requirements.
   */
  function validatePassword(password) {
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    return {
      length: password.length >= 14,
      uppercase: uppercaseRegex.test(password),
      lowercase: lowercaseRegex.test(password),
      number: numberRegex.test(password)
    };
  }

  /**
   * Validates a user object via API.
   */
  function validateUser(user, callback) {
    post(API_USER_VALIDATION_ENDPOINT, user, (data) => {
      if (data && data["signup-email-validation"]) {
        const validationResult = data["signup-email-validation"];
        if (validationResult.risk === "high") {
          if (
            validationResult.reason === "mailbox_does_not_exist" ||
            validationResult.result === "undeliverable"
          ) {
            callback({ email: "Are you sure this email address exists?" });
            return;
          }
          if (validationResult.reason === "mailbox_is_disposable_address") {
            callback({ email: "Please don't use disposable email addresses." });
            return;
          }
        }
      }
      callback();
    }, (response) => {
      if (response.responseJSON) {
        callback(response.responseJSON);
      }
    });
  }

  // --- Domain Validation Functions ---

  /**
   * Extracts the domain from a URL.
   */
  function extractDomain(url) {
    if (typeof url !== "string") {
      url = String(url);
    }
    url = url.replace(/^(https?:\/\/)?(www\.)?/i, "");
    let domain = url.split("/")[0];
    domain = domain.replace(/\.[^.]*$/, "");
    if (domain.endsWith(".myshopify") || domain.endsWith(".mybigcommerce")) {
      return url.split(".")[0];
    }
    const parts = domain.split(".");
    if (parts.length > 2) {
      domain = parts.slice(-2).join(".");
    }
    domain = domain.replace(/\.[^.]*$/, "");
    return domain;
  }

  /**
   * Validates a company domain.
   */
  function validateCompanyDomain(domain) {
    if (!domain || domain === "") {
      return "We need your website URL to create your account";
    }
    const regexCompanyDomain = /^(?:(?:https?:\/\/)?(?:www\.)?)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/;
    if (!regexCompanyDomain.test(domain)) {
      return "It doesn't seem to be a proper URL, please double check";
    }
    return undefined;
  }

  /**
   * Gets cached domain mappings from localStorage.
   */
  function getCachedDomainMappings() {
    try {
      const mappings = localStorage.getItem("account-subdomains-approved");
      return JSON.parse(mappings || "{}");
    } catch (error) {
      localStorage.removeItem("account-subdomains-approved");
      return {};
    }
  }

  /**
   * Gets a cached domain mapping for a specific domain.
   */
  function getCachedDomainMapping(domain) {
    const mappings = getCachedDomainMappings();
    return domain in mappings ? mappings[domain] : null;
  }

  /**
   * Sets a cached domain mapping.
   */
  function setCachedDomainMapping(domain, result) {
    const mappings = getCachedDomainMappings();
    mappings[domain] = result;
    localStorage.setItem("account-subdomains-approved", JSON.stringify(mappings));
  }

  /**
   * Validates an account domain via API.
   */
  function validateAccountDomain(accountDomain, callback) {
    const domain = accountDomain.trim().toLowerCase();
    const regexAccountDomain = /^[a-zA-Z0-9-]+$/;
    if (!regexAccountDomain.test(domain)) {
      callback("", "This field allow only the following special character: -");
      return;
    }
    const mapping = getCachedDomainMapping(domain);
    if (mapping) {
      if (mapping !== domain) {
        callback(mapping, `Workspace domain not available. Recommendation: ${mapping}`);
      } else {
        callback(mapping);
      }
      return;
    }
    const data = { "account_name_predicted": domain };
    $.ajax({
      method: "POST",
      url: API_DOMAIN_VALIDATION_URL,
      data: JSON.stringify(data),
      contentType: "application/json",
      crossDomain: true,
      success: (response) => {
        const recommendation = response.account_domain;
        if (response.domain_exist === true || response.domain_exist === "True") {
          callback("", "This workspace is not available, try another one");
          return;
        }
        setCachedDomainMapping(domain, recommendation);
        if (recommendation !== domain) {
          callback(recommendation, `Workspace domain not available. Recommendation: ${recommendation}`);
        } else {
          callback(recommendation);
        }
      },
      error: () => {
        callback("");
      }
    });
  }

  // --- Page Initialization ---

  /**
   * Initializes the correct signup version based on body attribute.
   */
  function initRouter() {
    if ($("body").attr("data-signup") === "v1") {
      init();
    } else {
      // You can add your v2+ initialization here if needed
      init();
    }
  }

  // Run initialization on document ready
  $(document).ready(initRouter);

})();