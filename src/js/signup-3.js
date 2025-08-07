"use strict";
(() => {
    // jQuery plugin: delayedChange - triggers onChange after a delay when input changes
    (function ($2) {
        $2.fn.delayedChange = function (options) {
            let timer;
            let po;
            if (jQuery.isFunction(options)) {
                po = { onChange: options };
            } else {
                po = options;
            }
            const o = $2.extend({}, $2.fn.delayedChange.defaultOptions, po);
            return this.each(function () {
                const self = this;
                const element = $2(self);
                element.on("keyup paste", () => {
                    clearTimeout(timer);
                    timer = window.setTimeout(() => {
                        let newVal = element.val();
                        newVal = $2.trim(newVal);
                        if (element.delayedChange.oldVal !== newVal) {
                            element.delayedChange.oldVal = newVal;
                            o.onChange.call(self);
                        }
                    }, o.delay);
                });
            });
        };
        $2.fn.delayedChange.defaultOptions = { delay: 300, onChange: function () { } };
        $2.fn.delayedChange.oldVal = "";
    })(jQuery);

    var WAIT_FOR_ANALYTICS_INTERVAL_MS = 1e3;
    var WAIT_FOR_ANALYTICS_MAX_TRIES = 3;

    function waitForAnalytics(callback) {
        let waitForAnalyticsIntervalCount = 0;
        let waitForAnalyticsInterval = 0;
        waitForAnalyticsInterval = window.setInterval(() => {
            if (typeof analytics.user === "function" || waitForAnalyticsIntervalCount >= WAIT_FOR_ANALYTICS_MAX_TRIES) {
                window.clearInterval(waitForAnalyticsInterval);
                callback();
            } else {
                waitForAnalyticsIntervalCount += 1;
            }
        }, WAIT_FOR_ANALYTICS_INTERVAL_MS);
    }

    function getOrSetAnonymousId(anonymousId) {
        if (typeof analytics.user === "function") {
            if (anonymousId) {
                analytics.user().anonymousId(anonymousId);
            } else {
                return analytics.user().anonymousId();
            }
        }
        return void 0;
    }

    var ERROR_COLOR = "#F54D63";
    var WARNING_COLOR = "#FF9B53";
    const scriptOrigin = new URL(document.currentScript.src).origin;
    const API_BASE_URL = scriptOrigin === "http://127.0.0.1:5500"
        ? "https://accounts.gorgias.com/signup"
        : scriptOrigin + "/signup";
    var SESSION_TOKEN_KEY = "x-account-manager-session-token";

    function post(endpoint, data, success, error2, complete) {
        void $.ajax({
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
                complete?.(jqXHR);
                const sessionToken = jqXHR.getResponseHeader(SESSION_TOKEN_KEY);
                if (sessionToken) {
                    window.localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
                    updateLinksForSession(sessionToken);
                }
            },
            success: (data2) => { success(data2); },
            error: error2,
            crossDomain: true,
            crossOrigin: true,
            xhrFields: { withCredentials: true }
        });
    }

    function processURLSearchParams() {
        const searchParams = new URLSearchParams(window.location.search);
        const sessionToken = searchParams.get(SESSION_TOKEN_KEY);
        if (sessionToken) {
            window.localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
            updateLinksForSession(sessionToken);
        }
        return searchParams;
    }

    function updateLinksForSession(token) {
        const sessionToken = token || window.localStorage.getItem(SESSION_TOKEN_KEY);
        if (!sessionToken) { return; }
        $("a.session-link").each(function () {
            const link = $(this);
            const href = new URL(link.attr("href") || "");
            href.searchParams.set(SESSION_TOKEN_KEY, sessionToken);
            link.attr("href", href.toString());
        });
    }

    function onSubmitStart(form, button) {
        clearAlert();
        form.find("input").prop("disabled", true);
        const buttonValue = button.val();
        button.val(button.data("wait"));
        button.data("wait", buttonValue);
    }

    function onSubmitEnd(form, button) {
        form.find("input").prop("disabled", false);
        const buttonValue = button.val();
        button.val(button.data("wait"));
        button.data("wait", buttonValue);
    }

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

    function error(input, errorMsg) {
        input.before(`<div class="input-alert" style="color: ${ERROR_COLOR}">${errorMsg}</div>`);
    }

    function warning(input, errorMsg) {
        input.before(`<div class="input-alert" style="color: ${WARNING_COLOR}">${errorMsg}</div>`);
    }

    function clearAlert() {
        const alerts = $(".input-alert");
        if (alerts) { alerts.remove(); }
        $("input").removeClass("error-outline");
    }

    var SIGNUP_ACCOUNT_FORM_PAGE = "/signup/account";
    var API_USER_SUBMIT_ENDPOINT = "/user/submit";

    function init() {
        $("input").prop("disabled", false);
        const searchParams = processURLSearchParams();
        updateLinksForSession();
        const emailValue = searchParams.get("email");
        const emailInput = $("input[name=email]");
        if (emailValue && emailInput.length) { emailInput.val(emailValue); }
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
        window.onUserSignUpRecaptchaResponse = onSubmitUserSignupForm;
    }

    function signupUserFormHandler(form) {
        const API_INIT_ENDPOINT = "/user/init";
        const API_VALIDATION_ENDPOINT = "/user/validation";
        const EMAIL_INPUT_SELECTOR = "input[name=email]";
        const NAME_INPUT_SELECTOR = "input[name=name]";
        const PASSWORD_INPUT_SELECTOR = "input[name=password]";
        const initParams = { "anonymous_id": getOrSetAnonymousId() };
        post(API_INIT_ENDPOINT, initParams, function (data) {
            getOrSetAnonymousId(data.anonymous_id);
            if (data.errors) { handleErrors(form, { responseJSON: data.errors }); }
            if (data.shopify) {
                const emailInput = $(EMAIL_INPUT_SELECTOR);
                const nameInput = $(NAME_INPUT_SELECTOR);
                const passwordInput = $(PASSWORD_INPUT_SELECTOR);
                if (!emailInput.val() && data.shopify.email) { emailInput.val(data.shopify.email); }
                if (!nameInput.val() && data.shopify.shop_owner) { nameInput.val(data.shopify.shop_owner); }
                if (emailInput.val() && nameInput.val() && !passwordInput.val()) { passwordInput.focus(); }
            }
            if (typeof window.GORGIAS_INIT_CALLBACK === "function") { window.GORGIAS_INIT_CALLBACK(data); }
        }, function (response) {
            console.error("API init call failed", response);
        });
        $(EMAIL_INPUT_SELECTOR).delayedChange(function () {
            const self = $(this);
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
            console.info(`
                                Request for submitting user data is completed successfully.
                                Redirecting to account page.
                                `);
            window.location.href = SIGNUP_ACCOUNT_FORM_PAGE + window.location.search;
        }, function (response2) {
            console.error("Request for submitting user data is failed.");
            onSubmitEnd(userForm, submitButton);
            handleErrors(userForm, response2);
            grecaptcha.reset();
        });
    }

    function signupAccountFormHandler(form) {
        const API_INIT_ENDPOINT = "/account/init";
        const API_ACCOUNT_ACTION_ENDPOINT = "/account/submit";
        const COMPANY_DOMAIN_INPUT_SELECTOR = "input[name=company_domain]";
        const ACCOUNT_DOMAIN_INPUT_SELECTOR = "input[name=account_domain]";
        const urlParams = new URLSearchParams(window.location.search);
        post(API_INIT_ENDPOINT, null, function (data) {
            if (data.redirect_url) { window.location.href = data.redirect_url; }
            if (data.shopify) {
                const companyDomainInput = $(COMPANY_DOMAIN_INPUT_SELECTOR);
                const accountDomainInput = $(ACCOUNT_DOMAIN_INPUT_SELECTOR);
                if (!companyDomainInput.val() && data.shopify.domain) { companyDomainInput.val(data.shopify.domain); }
                if (!accountDomainInput.val() && data.shopify.name) { accountDomainInput.val(data.shopify.name); }
            }
            if (data.sso) {
                const companyDomainInput = $(COMPANY_DOMAIN_INPUT_SELECTOR);
                if (!companyDomainInput.val() && data.sso.company_domain) { companyDomainInput.val(data.sso.company_domain); }
                const accountDomainInput = $(ACCOUNT_DOMAIN_INPUT_SELECTOR);
                if (!accountDomainInput.val() && data.sso.account_domain) { accountDomainInput.val(data.sso.account_domain); }
            }
            if (typeof window.GORGIAS_INIT_CALLBACK === "function") { window.GORGIAS_INIT_CALLBACK(data); }
        });
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
            }
        });
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

    var API_USER_VALIDATION_ENDPOINT = "/user/validation";

    function validateEmail(email) {
        if (!email || email === "") { return "We need your email to create your account"; }
        const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!regexEmail.test(email)) { return "The email you entered is incomplete"; }
        return void 0;
    }

    function validateName(name) {
        if (!name || name === "") { return "We need your fullname to create your account"; }
        return void 0;
    }

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

    function validateUser(user, callback) {
        post(API_USER_VALIDATION_ENDPOINT, user, (data) => {
            if (data && data["signup-email-validation"]) {
                const validationResult = data["signup-email-validation"];
                if (validationResult.risk === "high") {
                    if (validationResult.reason === "mailbox_does_not_exist" || validationResult.result === "undeliverable") {
                        callback({ email: "Are you sure this email address exists?" }); return;
                    }
                    if (validationResult.reason === "mailbox_is_disposable_address") {
                        callback({ email: "Please don't use disposable email addresses." }); return;
                    }
                }
            }
            callback();
        }, (response) => {
            if (response.responseJSON) { callback(response.responseJSON); }
        });
    }

    var FIELD_STATUS_SUFFIX = "-status";
    var FIELD_MESSAGE_SHAKE_DURATION_MS = 300;
    var inputStatusClasses = { error: "field-error", warning: "field-warning", valid: "field-valid" };
    var messageStatusClasses = { error: "message-error", warning: "message-warning", valid: "message-valid" };

    function setFieldStatus(field, status, message) {
        const fieldName = field[0].name;
        const fieldType = field[0].type;
        const messageContainer = field.next("div[id*='-message-container']");
        window.localStorage.setItem(fieldName + FIELD_STATUS_SUFFIX, status);
        if (fieldType != "submit") {
            setInputStatusClass(field, status);
            const fieldAppend = field.nextAll().filter(".form-input-append").first();
            if (fieldAppend) { setInputStatusClass(fieldAppend, status); }
        }
        if (messageContainer) {
            setMessageStatusClass(messageContainer, status);
            messageContainer.empty().append(message || "");
        }
        messageContainer.addClass("warning-message-trembling");
        setTimeout(() => { messageContainer.removeClass("warning-message-trembling"); }, FIELD_MESSAGE_SHAKE_DURATION_MS);
    }

    function getFieldStatus(field) {
        const fieldName = typeof field === "string" ? field : field[0].name;
        return window.localStorage.getItem(fieldName + FIELD_STATUS_SUFFIX);
    }

    function setInputStatusClass(field, status) {
        field.removeClass(inputStatusClasses.valid).removeClass(inputStatusClasses.warning).removeClass(inputStatusClasses.error);
        if (status) { field.addClass(inputStatusClasses[status]); }
    }

    function setMessageStatusClass(container, status) {
        container.removeClass(messageStatusClasses.valid).removeClass(messageStatusClasses.warning).removeClass(messageStatusClasses.error);
        if (status) { container.addClass(messageStatusClasses[status]); }
    }

    var API_DOMAIN_VALIDATION_URL = "https://us-central1-gorgias-growth-production.cloudfunctions.net/check_helpdesk_domain";

    function extractDomain(url) {
        if (typeof url !== "string") { url = String(url); }
        url = url.replace(/^(https?:\/\/)?(www\.)?/i, "");
        let domain = url.split("/")[0];
        domain = domain.replace(/\.[^.]*$/, "");
        if (domain.endsWith(".myshopify") || domain.endsWith(".mybigcommerce")) {
            return url.split(".")[0];
        }
        const parts = domain.split(".");
        if (parts.length > 2) { domain = parts.slice(-2).join("."); }
        domain = domain.replace(/\.[^.]*$/, "");
        return domain;
    }

    function validateCompanyDomain(domain) {
        if (!domain || domain === "") { return "We need your website URL to create your account"; }
        const regexCompanyDomain = /^(?:(?:https?:\/\/)?(?:www\.)?)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/;
        if (!regexCompanyDomain.test(domain)) { return "It doesn't seem to be a proper URL, please double check"; }
        return void 0;
    }

    function getCachedDomainMappings() {
        try {
            const mappings = localStorage.getItem("account-subdomains-approved");
            return JSON.parse(mappings || "{}");
        } catch (error2) {
            localStorage.removeItem("account-subdomains-approved");
            return {};
        }
    }

    function getCachedDomainMapping(domain) {
        const mappings = getCachedDomainMappings();
        return domain in mappings ? mappings[domain] : null;
    }

    function setCachedDomainMapping(domain, result) {
        const mappings = getCachedDomainMappings();
        mappings[domain] = result;
        localStorage.setItem("account-subdomains-approved", JSON.stringify(mappings));
    }

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
        void $.ajax({
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
            error: () => { callback(""); }
        });
    }

    var email_key = "email";
    var fullname_key = "fullname";
    var plan_name_key = "plan_name";
    var plan_period_key = "period";
    var password_key = "password";
    var company_domain_key = "company_domain";
    var account_domain_key = "account_domain";
    var classValidText = "text-valid";

    function getSignupAccountFormPage() {
        return window.location?.pathname?.includes("staging") ? "/staging-signup/account" : "/signup/account";
    }

    function getSignupFormPage() {
        return window.location?.pathname?.includes("staging") ? "/staging-signup" : "/signup";
    }

    function init2() {
        const emailField = $('#signup-user-form input[name="' + email_key + '"]');
        const fullnameField = $('#signup-user-form input[name="' + fullname_key + '"]');
        const passwordField = $('#signup-user-form input[name="' + password_key + '"]');
        const accountDomainEditButton = $("a#account-domain-edit-button");
        const accountDomainEditWrapper = $("#account-domain-edit-wrapper");
        const accountDomainWrapper = $("#account-domain-wrapper");
        const accountDomainLoaderWrapper = $("#account-domain-loader-wrapper");
        const accountDomainEditLoaderWrapper = $("#account-domain-edit-loader-wrapper");
        const accountDomainSaveButton = $("a#account-domain-save-button");
        const accountDomainText = $("#account-domain-text");
        const accountDomainSubdomainString = $("#account-subdomain-string");
        const accountDomainTextInfoWrapper = $("#account-domain-info-wrapper");
        const companyDomainField = $('#signup-user-form input[name="' + company_domain_key + '"]');
        const accountDomainField = $('#signup-user-form input[name="' + account_domain_key + '"]');
        const signupButton = $('input[id="signup-button"]');
        const signupButtonLoading = $("#signup-button-loading");
        const ssoGoogleButton = $('a[id="sso-button-google"]');
        const userForm = $("form#signup-user-form");
        const accountForm = $("form#signup-account-form");
        const accountFormWrapper = $("#signup-account-form-wrapper");
        const userFormWrapper = $("#signup-user-form-wrapper");
        // const accountFormLoadingWrapper = $("div#signup-account-form-loading-wrapper");
        const userFormLoadingWrapper = $("div#signup-user-form-loading-wrapper");

        let delayTimer = 0;

        /**
         * Mirrors the email input value to the fullname input.
         */
        function mirrorEmailToFullname(fullname, email) {
            if (emailField.val()) {
            fullnameField.val(emailField.val());
        }
        }

        /**
         * 
         * auto populate a randomly generated password that meets the specified criteria.
         */
        function generatePassword() {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const allChars = lowercase + uppercase + numbers;

        const minLength = 14;
        const maxLength = 24;
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

        // Ensure 1 lowercase, 1 uppercase, 1 number
        let password = '';
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];

        // Fill the rest randomly
        for (let i = 3; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the password so required characters aren’t always at the beginning
        passwordField.val(password.split('').sort(() => 0.5 - Math.random()).join(''));
        }

  


        function initiateMessageContainer() {
            const fields = {
                "email": emailField,
                "fullname": fullnameField,
                "company_domain": companyDomainField,
                "account_domain": accountDomainField,
                "signup_button": signupButton
            };
            $.each(fields, function (index, value) {
                if (value.length) {
                    $('<div id = "' + index + '-message-container" class="field-message-container"></div>').insertAfter(value);
                }
            });
        }

        function handleFieldStatus(field, status, message) {
            setFieldStatus(field, status, message);
            if (status == "valid" && field == accountDomainField) {
                accountDomainText.addClass(classValidText);
            }
        }

        function handleFormStatus(form, status, messaging) {
            const messageContainer = signupButton.next("div[id*='-message-container']");
            setMessageStatusClass(messageContainer, status);
            messageContainer.empty().append(messaging);
        }

        function resetFieldStatus(field) {
            const messageContainer = field.next("div[id*='-message-container']");
            setMessageStatusClass(messageContainer, null);
            setInputStatusClass(field, null);
            if (field == accountDomainField) {
                accountDomainText.removeClass(classValidText);
            }
        }

        function processSearchParams() {
            const searchParams = processURLSearchParams();
            const sessionEmail = searchParams.get(email_key.toLowerCase());
            const sessionFullName = searchParams.get(fullname_key.toLowerCase());
            const sessionPlanName = searchParams.get(plan_name_key.toLowerCase());
            const sessionPlanPeriod = searchParams.get(plan_period_key.toLowerCase());
            if (sessionEmail && emailField.length) { emailField.val(sessionEmail); emailVerify("warning"); }
            if (sessionFullName && fullnameField.length) { fullnameField.val(sessionFullName); fullnameVerify("warning"); }
            if (sessionPlanName) { window.localStorage.setItem(plan_name_key, sessionPlanName); }
            if (sessionPlanPeriod) { window.localStorage.setItem(plan_period_key, sessionPlanPeriod); }
        }

        function emailVerify(status) {
            resetFieldStatus(emailField);
            const error2 = validateEmail(emailField.val() || "");
            if (error2) { handleFieldStatus(emailField, status, error2); return; }
            const userData = { name: fullnameField.val() || "", email: emailField.val() || "", password: passwordField.val() || "" };
            validateUser(userData, (errors) => {
                if (errors) { setFieldErrors(errors); }
                else { handleFieldStatus(emailField, "valid", ""); }
            });
        }

        function accountDomainVerify(status, domain, prefilled, callback) {
            resetFieldStatus(accountDomainField);
            accountDomainLoaderWrapper.removeClass("hidden");
            accountDomainEditLoaderWrapper.removeClass("hidden");
            accountDomainSubdomainString.addClass("skeleton-text");
            validateAccountDomain(domain, (recommendedDomain, error2) => {
                if (prefilled) {
                    if (!recommendedDomain || recommendedDomain === "") {
                        accountDomainWrapper.hide();
                        accountDomainEditWrapper.removeClass("hidden");
                    } else {
                        accountDomainField.val(recommendedDomain);
                        accountDomainSubdomainString.empty().text(recommendedDomain);
                        error2 = void 0;
                    }
                }
                accountDomainLoaderWrapper.addClass("hidden");
                accountDomainEditLoaderWrapper.hide();
                accountDomainSubdomainString.removeClass("skeleton-text");
                const result = error2 ? status : "valid";
                handleFieldStatus(accountDomainField, result, error2);
                callback?.(result);
            });
        }

        function companyDomainReformat() {
            const oldValue = companyDomainField.val();
            if (!oldValue) { return; }
            const newValue = oldValue.replace(/^(https?:\/\/)?(www\.)?/i, "");
            if (newValue !== oldValue) { companyDomainField.val(newValue); }
        }

        function companyDomainVerify(status) {
            companyDomainReformat();
            resetFieldStatus(companyDomainField);
            const error2 = validateCompanyDomain(companyDomainField.val() || "");
            const result = error2 ? status : "valid";
            handleFieldStatus(companyDomainField, result, error2);
            if (result === "valid") {
                accountDomainTextInfoWrapper.removeClass("hidden");
                if (accountDomainEditWrapper.hasClass("hidden")) {
                    accountDomainWrapper.removeClass("hidden");
                }
                const extractedDomain = extractDomain(companyDomainField.val() || "");
                accountDomainVerify(status, extractedDomain, true);
            }
        }

        function fullnameVerify(status) {
            resetFieldStatus(fullnameField);
            const error2 = validateName(fullnameField.val() || "");
            const result = error2 ? status : "valid";
            handleFieldStatus(fullnameField, result, error2 || "");
        }

        function passwordVerify(status) {
            const result = validatePassword(passwordField.val() || "");
            setMessageStatusClass($("#signup-user-form ul li#pwd-message-length"), result.length ? "valid" : status);
            setMessageStatusClass($("#signup-user-form ul li#pwd-message-uppercase"), result.uppercase ? "valid" : status);
            setMessageStatusClass($("#signup-user-form ul li#pwd-message-lowercase"), result.lowercase ? "valid" : status);
            setMessageStatusClass($("#signup-user-form ul li#pwd-message-number"), result.number ? "valid" : status);
            const fullResult = result.length && result.uppercase && result.lowercase && result.number ? "valid" : status;
            handleFieldStatus(passwordField, fullResult, "");
        }

        function setFieldErrors(data) {
            const verifyStatus = "error";
            for (const field of Object.keys(data)) {
                const error2 = data[field];
                const errors = Array.isArray(error2) ? error2 : [error2];
                const inputField = $("input[name=" + field + "]");
                const stringToCheck = "Company website or helpdesk website already exists or is reserved";
                const errorCheck = JSON.stringify(errors).includes(stringToCheck);
                if (errorCheck == true) {
                    handleFieldStatus(companyDomainField, verifyStatus, "This URL is already linked to an existing workspace. Try a new URL or login");
                    handleFieldStatus(accountDomainField, verifyStatus, "This workspace is reserved. Try a new one");
                }
                if (inputField.length > 0) {
                    for (const errorMsg of errors) {
                        handleFieldStatus(inputField, verifyStatus, errorMsg);
                    }
                }
            }
        }

        function handleErrors2(response) {
            if (response) {
                if (response.responseJSON) {
                    const data = response.responseJSON;
                    setFieldErrors(data);
                } else {
                    handleFieldStatus(signupButton, "error", "An unexpected error occurred. Please try again.");
                }
            }
        }

        function signupUserFormHandler2() {
            const API_INIT_ENDPOINT = "/user/init";
            const initParams = { "anonymous_id": getOrSetAnonymousId() };
            post(API_INIT_ENDPOINT, initParams, function (data) {
                getOrSetAnonymousId(data.anonymous_id);
                if (data.errors) { handleErrors2({ responseJSON: data.errors }); }
                if (data.shopify) {
                    if (!emailField.val() && data.shopify.email) { emailField.val(data.shopify.email); emailVerify("warning"); }
                    if (!fullnameField.val() && data.shopify.shop_owner) { fullnameField.val(data.shopify.shop_owner); fullnameVerify("warning"); }
                }
                if (typeof window.GORGIAS_INIT_CALLBACK === "function") { window.GORGIAS_INIT_CALLBACK(data); }
            });
        }

        function signupAccountFormHandler2() {
            const API_INIT_ENDPOINT = "/account/init";
            post(API_INIT_ENDPOINT, null, function (data) {
                if (data.redirect_url) { window.location.href = getSignupFormPage() + window.location.search; }
                if (data.shopify) {
                    if (!accountDomainField.val() && data.shopify.name) { companyDomainVerify("warning"); accountDomainField.val(data.shopify.name); }
                }
                if (data.sso) {
                    if (!companyDomainField.val() && data.sso.company_domain) { companyDomainField.val(data.sso.company_domain); companyDomainVerify("warning"); }
                    if (!accountDomainField.val() && data.sso.account_domain) { accountDomainField.val(data.sso.account_domain); }
                }
                if (typeof window.GORGIAS_INIT_CALLBACK === "function") { window.GORGIAS_INIT_CALLBACK(data); }
            });
        }

        function onSubmitStart2(form, button) {
            form.find("input").prop("disabled", true);
            button.hide();
            signupButtonLoading.show();
        }

        function onSubmitEnd2(form, button) {
            form.find("input").prop("disabled", false);
            button.show();
            signupButtonLoading.hide();
        }

        function onSubmitUserSignupForm2(response) {
            userFormWrapper.hide();
            userFormLoadingWrapper.show();
            const formDataUser = {
                "email": $.trim(emailField.val() || ""),
                "name": $.trim(fullnameField.val() || ""),
                "password": passwordField.val(),
                "recaptcha_response": response
            };
            const API_USER_SUBMIT_ENDPOINT2 = "/user/submit";
            onSubmitStart2(userForm, signupButton);
            post(API_USER_SUBMIT_ENDPOINT2, formDataUser, function () {
                //window.location.href = getSignupAccountFormPage() + window.location.search;

                
                    const formDataAccount = {
                        company_domain: (companyDomainField.val() || "").trim().toLowerCase(),
                        account_domain: (accountDomainField.val() || "").trim().toLowerCase()
                    };
                    if (window.localStorage.getItem(plan_name_key) && window.localStorage.getItem(plan_name_key) == "starter" &&
                        window.localStorage.getItem(plan_period_key) && window.localStorage.getItem(plan_period_key) == "monthly") {
                        formData["account_subscription"] = { helpdesk: "starter-monthly-usd-4" };
                    }
                    onSubmitStart2(userForm, signupButton);
                    onSubmitAccountSignupForm(formDataAccount);
                    return void 0;
                
            }, function (response2) {
                onSubmitEnd2(userForm, signupButton);
                handleErrors2(response2);
                userFormWrapper.show();
                userFormLoadingWrapper.hide();
                grecaptcha.reset();
            });
        }

        function enableFields() {
            $("input").prop("disabled", false);
            signupButton.prop("disabled", false);
            ssoGoogleButton.prop("disabled", false);
        }

        function resetLocalStorageFields() {
            window.localStorage.removeItem(email_key + "-status");
            window.localStorage.removeItem(password_key + "-status");
            window.localStorage.removeItem(fullname_key + "-status");
        }

        function onSubmitAccountSignupForm(formData) {
            const API_VALIDATION_ENDPOINT = "/account/submit";
            //accountFormLoadingWrapper.show();
            accountFormWrapper.hide();
            post(API_VALIDATION_ENDPOINT, formData, function (data) {
                localStorage.removeItem("account-subdomains-approved");
                window.location.href = data.redirect_url;
            }, function (response) {
                handleErrors2(response);
                onSubmitEnd2(userForm, signupButton);
                accountDomainText.remove(classValidText);
                // accountDomainWrapper.hide();
                // accountDomainEditWrapper.show();
                userFormLoadingWrapper.hide();
                userFormWrapper.show();
                grecaptcha.reset();
            });
        }

        function onLoad() {
            resetLocalStorageFields();
            enableFields();
            mirrorEmailToFullname(fullnameField.val(), emailField.val());
            // Autofill password field on load
            generatePassword();
            companyDomainVerify();
            accountDomainEditButton.on("click", function () {
                accountDomainEditWrapper.show();
                accountDomainWrapper.hide();
            });
            accountDomainSaveButton.on("click", function () {
                accountDomainVerify("warning", accountDomainField.val() || "", false, (accountDomainSatus) => {
                    if (accountDomainSatus == "valid") {
                        accountDomainEditWrapper.hide();
                        accountDomainWrapper.show();
                        accountDomainSubdomainString.empty().text(accountDomainField.val() || "");
                    }
                });
            });
            emailField.on("blur", function () { 
                emailVerify("warning");
            });
            companyDomainField.on("change", function () { companyDomainReformat(); });
            companyDomainField.on("blur", function () { companyDomainVerify("warning"); });
            companyDomainField.keyup(function () {
                clearTimeout(delayTimer);
                delayTimer = window.setTimeout(function () { companyDomainVerify("warning"); }, 1e3);
            });
            accountDomainField.keyup(function () {
                clearTimeout(delayTimer);
                delayTimer = window.setTimeout(function () { accountDomainVerify("warning", accountDomainField.val() || "", false); }, 1e3);
            });
            accountDomainField.on("blur", function () { accountDomainVerify("warning", $(this).val() || "", false); });
            fullnameField.on("blur", function () { fullnameVerify("warning"); });
            passwordField.on("blur", function () { passwordVerify("warning"); });
            emailField.keyup(function () {
                mirrorEmailToFullname(fullnameField.val(), emailField.val());
                clearTimeout(delayTimer);
                delayTimer = window.setTimeout(function () { emailVerify("warning"); }, 1e3);
            });
            fullnameField.keyup(function () {
                clearTimeout(delayTimer);
                delayTimer = window.setTimeout(function () { fullnameVerify("warning"); }, 1e3);
            });
            passwordField.on("input", function () { passwordVerify("warning"); });
            $("#transformButton").on("click", function () {
                const currentType = passwordField.attr("type");
                if (currentType === "password") { passwordField.attr("type", "text"); }
                else { passwordField.attr("type", "password"); }
            });
            processSearchParams();
            initiateMessageContainer();
            waitForAnalytics(function () {
                if (userForm.length) { signupUserFormHandler2(); }
                else if (accountForm.length) { signupAccountFormHandler2(); }
            });
            userForm.submit(function (event) {
                event.preventDefault();
                event.stopPropagation();


                signupButton.next("div[id*='-message-container']").empty();
                const form = $(this);
                const fullnameStatus = getFieldStatus(fullname_key);
                const emailStatus = getFieldStatus(email_key);
                const passwordStatus = getFieldStatus(password_key);
                const accountDomainStatus = getFieldStatus(account_domain_key);
                const companyDomainStatus = getFieldStatus(company_domain_key);
                let status = "error";
                const messaging = "Please check fields with error, then submit";
                if (fullnameStatus !== "valid" || emailStatus !== "valid" || passwordStatus !== "valid" || accountDomainStatus !== "valid" || companyDomainStatus !== "valid") {
                    emailVerify(status);
                    fullnameVerify(status);
                    passwordVerify(status);
                    companyDomainVerify(status);
                    accountDomainVerify(status, accountDomainField.val() || "", false); 
                    handleFormStatus(form, status, messaging);
                    return false;
                } else {
                    status = "valid";
                    resetLocalStorageFields();
                    const DATADOG_BOT_USER_AGENT = "Datadog/Synthetics";
                    if (navigator.userAgent === DATADOG_BOT_USER_AGENT) {
                        onSubmitUserSignupForm2();
                    } else {
                        void grecaptcha.execute();
                    }
                    return void 0;
                }
            });
            window.onUserSignUpRecaptchaResponse = onSubmitUserSignupForm2;
            accountForm.submit(function (event) {
                event.preventDefault();
                event.stopPropagation();
                const form = $(this);
                const accountDomainStatus = getFieldStatus(account_domain_key);
                const companyDomainStatus = getFieldStatus(company_domain_key);
                let status = "error";
                const messaging = "Please check fields with error, then submit";
                if (accountDomainStatus !== "valid" || companyDomainStatus !== "valid") {
                    companyDomainVerify(status);
                    accountDomainVerify(status, accountDomainField.val() || "", false);
                    handleFormStatus(form, status, messaging);
                    return false;
                } else {
                    status = "valid";
                    window.localStorage.removeItem(account_domain_key + "-status");
                    window.localStorage.removeItem(company_domain_key + "-status");
                    const formData = {
                        company_domain: (companyDomainField.val() || "").trim().toLowerCase(),
                        account_domain: (accountDomainField.val() || "").trim().toLowerCase()
                    };
                    if (window.localStorage.getItem(plan_name_key) && window.localStorage.getItem(plan_name_key) == "starter" &&
                        window.localStorage.getItem(plan_period_key) && window.localStorage.getItem(plan_period_key) == "monthly") {
                        formData["account_subscription"] = { helpdesk: "starter-monthly-usd-4" };
                    }
                    onSubmitStart2(accountForm, signupButton);
                    onSubmitAccountSignupForm(formData);
                    return void 0;
                }
            });
        }
        window.Webflow = window.Webflow || [];
        window.Webflow.push(onLoad);
    }

    function init3() {
        if ($("body").attr("data-signup") === "v1") { init(); }
        else { init2(); }
    }

    $(document).ready(init3);
})();