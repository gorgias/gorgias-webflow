(function (ns) {
  let waitForAnalyticsIntervalCount = 0
  let waitForAnalyticsIntervalMax = 3
  let waitForAnalyticsInterval = null
  ns.waitForAnalytics = function (callback) {
    waitForAnalyticsInterval = window.setInterval(function () {
      if (typeof analytics.user === 'function' || waitForAnalyticsIntervalCount >= waitForAnalyticsIntervalMax) {
        window.clearInterval(waitForAnalyticsInterval)
        callback()
      } else { waitForAnalyticsIntervalCount += 1 }
    }, 1000)
  }
  ns.getOrCreateAnonymousId = function (anonymousId) { if (typeof analytics.user === 'function') { if (anonymousId) { analytics.user().anonymousId(anonymousId) } else { return analytics.user().anonymousId() } } }
})(window.signupGorgiasNamespace = window.signupGorgiasNamespace || {}); (function (ns) {
  const ERROR_COLOR = '#F54D63'
  const WARNING_COLOR = '#FF9B53'
  const API_BASE_URL = new URL(document.currentScript.src).origin + '/signup'
  const SESSION_TOKEN_KEY = 'x-account-manager-session-token'
  ns.post = function (endpoint, data, success, error) {
    return $.ajax({
      method: 'POST', url: API_BASE_URL + endpoint, data: JSON.stringify(data), contentType: 'application/json', beforeSend: function (jqXHR) {
        const sessionToken = window.localStorage.getItem(SESSION_TOKEN_KEY)
        if (sessionToken) { jqXHR.setRequestHeader(SESSION_TOKEN_KEY, sessionToken) }
      }, complete: function (jqXHR, textStatus) {
        const sessionToken = jqXHR.getResponseHeader(SESSION_TOKEN_KEY)
        if (sessionToken) {
          window.localStorage.setItem(SESSION_TOKEN_KEY, sessionToken)
          ns.updateLinksForSession(sessionToken)
        }
      }, success: function (data, status, jqXHR) { success(data) }, error: error, crossDomain: true, crossOrigin: true, xhrFields: { withCredentials: true },
    })
  }
  ns.processURLSearchParams = function () {
    const searchParams = new URLSearchParams(window.location.search)
    const sessionToken = searchParams.get(SESSION_TOKEN_KEY)
    if (sessionToken) {
      window.localStorage.setItem(SESSION_TOKEN_KEY, sessionToken)
      ns.updateLinksForSession(sessionToken)
    }
    return searchParams
  }
  ns.updateLinksForSession = function (sessionToken) {
    if (!sessionToken) { sessionToken = window.localStorage.getItem(SESSION_TOKEN_KEY) }
    if (!sessionToken) { return }
    $("a.session-link").each(function () {
      const link = $(this)
      const href = new URL(link.attr("href"))
      href.searchParams.set(SESSION_TOKEN_KEY, sessionToken)
      link.attr("href", href.toString())
    })
  }
  ns.onSubmitStart = function (form, button) {
    ns.clearAlert(form)
    form.find('input').prop("disabled", true)
    const buttonValue = button.val()
    button.val(button.data('wait'))
    button.data('wait', buttonValue)
  }
  ns.onSubmitEnd = function (form, button) {
    form.find('input').prop("disabled", false)
    const buttonValue = button.val()
    button.val(button.data('wait'))
    button.data('wait', buttonValue)
  }
  ns.handleErrors = function (input, response) {
    if (response) {
      if (response.responseJSON) {
        for (const fieldName of Object.keys(response.responseJSON)) {
          const errors = response.responseJSON[fieldName]
          const inputField = $('input[name=' + fieldName + ']')
          if (inputField.length) { inputField.addClass('error-outline') }
          for (const errorMsg of errors) { ns.error(input, errorMsg) }
        }
      } else { ns.error(input, "An unexpected error occurred. Please try again.") }
    }
  }
  ns.error = function (input, errorMsg) { input.before(`<div class="input-alert" style="color: ${ERROR_COLOR}">${errorMsg}</div>`) }
  ns.warning = function (input, errorMsg) { input.before(`<div class="input-alert" style="color: ${WARNING_COLOR}">${errorMsg}</div>`) }
  ns.clearAlert = function () {
    const alerts = $('.input-alert')
    if (alerts) { alerts.remove() }
    $('input').removeClass('error-outline')
  }
})(window.signupGorgiasNamespace = window.signupGorgiasNamespace || {}); (function ($) {
  $.fn.delayedChange = function (options) {
    let timer
    let o
    if (jQuery.isFunction(options)) { o = { onChange: options } } else { o = options }
    o = $.extend({}, $.fn.delayedChange.defaultOptions, o)
    return this.each(function () {
      const self = this
      const element = $(this)
      element.on('keyup paste', function () {
        clearTimeout(timer)
        timer = setTimeout(function () {
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
  $.fn.delayedChange.defaultOptions = { delay: 300, onChange: function () { } }
  $.fn.delayedChange.oldVal = ""
})(jQuery); (function (ns) {
  const SIGNUP_ACCOUNT_FORM_PAGE = '/signup/account'
  const API_USER_SUBMIT_ENDPOINT = '/user/submit'
  $(document).ready(function () {
    $("input").prop("disabled", false)
    const searchParams = ns.processURLSearchParams()
    ns.updateLinksForSession()
    const emailValue = searchParams.get('email')
    const emailInput = $('input[name=email]')
    if (emailValue && emailInput.length) { emailInput.val(emailValue) }
    ns.waitForAnalytics(function () {
      const userForm = $('#signup-user-form')
      const accountForm = $('#signup-account-form')
      if (userForm.length) { signupUserFormHandler(userForm) } else if (accountForm.length) { signupAccountFormHandler(accountForm) }
    })
  })
  function signupUserFormHandler(form) {
    const API_INIT_ENDPOINT = '/user/init'
    const API_VALIDATION_ENDPOINT = '/user/validation'
    const EMAIL_INPUT_SELECTOR = 'input[name=email]'
    const NAME_INPUT_SELECTOR = 'input[name=name]'
    const PASSWORD_INPUT_SELECTOR = 'input[name=password]'
    const initParams = { 'anonymous_id': ns.getOrCreateAnonymousId() }
    ns.post(API_INIT_ENDPOINT, initParams, function (data) {
      ns.getOrCreateAnonymousId(data.anonymous_id)
      if (data.errors) { ns.handleErrors(form, { responseJSON: data.errors }) }
      if (data.shopify) {
        const emailInput = $(EMAIL_INPUT_SELECTOR)
        const nameInput = $(NAME_INPUT_SELECTOR)
        const passwordInput = $(PASSWORD_INPUT_SELECTOR)
        if (!emailInput.val() && data.shopify.email) { emailInput.val(data.shopify.email) }
        if (!nameInput.val() && data.shopify.shop_owner) { nameInput.val(data.shopify.shop_owner) }
        if (emailInput.val() && nameInput.val() && !passwordInput.val()) { passwordInput.focus() }
      }
      if (typeof window.GORGIAS_INIT_CALLBACK === 'function') { window.GORGIAS_INIT_CALLBACK(data) }
    }, function (response) { console.error("API init call failed", response) })
    $(EMAIL_INPUT_SELECTOR).delayedChange(function () {
      const self = $(this)
      ns.clearAlert(form)
      if (self.is(':valid')) {
        const validationData = { name: $(NAME_INPUT_SELECTOR).val(), email: $.trim(self.val()), password: $(PASSWORD_INPUT_SELECTOR).val(), }
        ns.post(API_VALIDATION_ENDPOINT, validationData, function (data) {
          if (data && data['signup-email-validation']) {
            const validationResult = data['signup-email-validation']
            if (validationResult.risk === 'high') {
              if (validationResult.reason === 'mailbox_is_disposable_address') { ns.error(self, 'Please do not use disposable email addresses.') }
              if (validationResult.reason === 'mailbox_does_not_exist') { ns.warning(self, 'Are you sure this email address exists?') }
            }
            if (validationResult.risk === 'medium') { if (validationResult.reason === 'mailbox_is_role_address') { ns.warning(self, 'Please use your personal work email address if possible.') } }
          }
        }, function (response) { ns.handleErrors(self, response) })
      }
    })
    form.submit(function (event) {
      event.preventDefault()
      event.stopPropagation()
      const DATADOG_BOT_USER_AGENT = 'Datadog/Synthetics'
      if (navigator.userAgent === DATADOG_BOT_USER_AGENT) { onSubmitUserSignupForm() }
      else { grecaptcha.execute() }
    })
  }
  function onSubmitUserSignupForm(response) {
    const userForm = $('#signup-user-form')
    const submitButton = $('#signup-button')
    const formData = { 'email': $.trim($('input[name=email]').val()), 'name': $.trim($('input[name=name]').val()), 'password': $('input[name=password]').val(), 'recaptcha_response': response }
    ns.onSubmitStart(userForm, submitButton)
    ns.post(API_USER_SUBMIT_ENDPOINT, formData, function () { window.location = SIGNUP_ACCOUNT_FORM_PAGE + window.location.search }, function (response) {
      ns.onSubmitEnd(userForm, submitButton)
      ns.handleErrors(userForm, response)
      grecaptcha.reset()
    })
  }
  window.onUserSignUpRecaptchaResponse = onSubmitUserSignupForm
  function signupAccountFormHandler(form) {
    const API_INIT_ENDPOINT = '/account/init'
    const API_ACCOUNT_ACTION_ENDPOINT = '/account/submit'
    const COMPANY_DOMAIN_INPUT_SELECTOR = 'input[name=company_domain]'
    const ACCOUNT_DOMAIN_INPUT_SELECTOR = 'input[name=account_domain]'
    const urlParams = new URLSearchParams(window.location.search)
    ns.post(API_INIT_ENDPOINT, null, function (data) {
      if (data.redirect_url) { window.location = data.redirect_url }
      if (data.shopify) {
        const companyDomainInput = $(COMPANY_DOMAIN_INPUT_SELECTOR)
        const accountDomainInput = $(ACCOUNT_DOMAIN_INPUT_SELECTOR)
        if (!companyDomainInput.val() && data.shopify.domain) { companyDomainInput.val(data.shopify.domain) }
        if (!accountDomainInput.val() && data.shopify.name) { accountDomainInput.val(data.shopify.name) }
      }
      if (data.sso) {
        const companyDomainInput = $(COMPANY_DOMAIN_INPUT_SELECTOR)
        if (!companyDomainInput.val() && data.sso.company_domain) { companyDomainInput.val(data.sso.company_domain) }
        const accountDomainInput = $(ACCOUNT_DOMAIN_INPUT_SELECTOR)
        if (!accountDomainInput.val() && data.sso.account_domain) { accountDomainInput.val(data.sso.account_domain) }
      }
      if (typeof window.GORGIAS_INIT_CALLBACK === 'function') { window.GORGIAS_INIT_CALLBACK(data) }
    })
    $(COMPANY_DOMAIN_INPUT_SELECTOR + ', ' + ACCOUNT_DOMAIN_INPUT_SELECTOR).delayedChange(function () {
      const self = $(this)
      ns.clearAlert(self)
      if (self.is(':valid')) {
        let validationData = { company_domain: $.trim($(COMPANY_DOMAIN_INPUT_SELECTOR).val()), account_domain: $.trim($(ACCOUNT_DOMAIN_INPUT_SELECTOR).val()), }
        if (urlParams.get('plan_name') === 'starter' && urlParams.get('period') === 'monthly') { validationData['account_subscription'] = { helpdesk: 'starter-monthly-usd-4' } }
      }
    })
    form.submit(function (e) {
      e.preventDefault()
      e.stopPropagation()
      let formData = { company_domain: $.trim($(COMPANY_DOMAIN_INPUT_SELECTOR).val()), account_domain: $.trim($(ACCOUNT_DOMAIN_INPUT_SELECTOR).val()), }
      if (urlParams.get('plan_name') === 'starter' && urlParams.get('period') === 'monthly') { formData['account_subscription'] = { helpdesk: 'starter-monthly-usd-4' } }
      const submitButton = $('#signup-button')
      ns.onSubmitStart(form, submitButton)
      ns.post(API_ACCOUNT_ACTION_ENDPOINT, formData, function (data) { window.location = data.redirect_url }, function (response) {
        ns.onSubmitEnd(form, submitButton)
        ns.handleErrors(form, response)
        $('.pop-up-waiting').removeClass('visible')
      })
    })
  }
})(window.signupGorgiasNamespace = window.signupGorgiasNamespace || {})
