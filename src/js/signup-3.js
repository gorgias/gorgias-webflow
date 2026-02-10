console.log("signup-3.js loaded");
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

    const API_BASE_URL = "https://accounts.gorgias.com/signup";
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
    var API_DOMAIN_VALIDATION_URL = "https://us-central1-gorgias-growth-production.cloudfunctions.net/check_helpdesk_domain";
    var email_key = "email";
    var fullname_key = "fullname";
    var plan_name_key = "plan_name";
    var plan_period_key = "period";
    var password_key = "password";
    var company_domain_key = "company_domain";
    var account_domain_key = "account_domain";
    var classValidText = "text-valid";

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

    function getSignupFormPage() {
        return window.location?.pathname?.includes("staging") ? "/staging-signup" : "/signup";
    }

    function init2() {
        const emailField = $('#signup-user-form input[name="' + email_key + '"]');
        const fullnameField = $('#signup-user-form input[name="' + fullname_key + '"]');
        const passwordField = $('#signup-user-form input[name="' + password_key + '"]');
        const accountDomainEditWrapper = $("#account-domain-edit-wrapper");
        const accountDomainWrapper = $("#account-domain-wrapper");
        const accountDomainLoaderWrapper = $("#account-domain-loader-wrapper");
        const accountDomainEditLoaderWrapper = $("#account-domain-edit-loader-wrapper");
        const accountDomainText = $("#account-domain-text");
        const accountDomainSubdomainString = $("#account-subdomain-string");
        const companyDomainField = $('#signup-user-form input[name="' + company_domain_key + '"]');
        const accountDomainField = $('#signup-user-form input[name="' + account_domain_key + '"]');
        const signupButton = $('input[id="signup-button"]');
        const signupButtonLoading = $("#signup-button-loading");
        const ssoGoogleButton = $('a[id="sso-button-google"]');
        const userForm = $("form#signup-user-form");
        const userFormWrapper = $("#signup-user-form-wrapper");
        const userFormLoadingWrapper = $("#signup-user-form-loading-wrapper");
        // Store v3 site key (will be set from init response)
        let RECAPTCHA_V3_SITE_KEY = "";

        let delayTimer = 0;

        /* Mirrors the email input value to the fullname input */
        function mirrorEmailToFullname(fullname, email) {
            if (emailField.val()) {
                fullnameField.val(emailField.val());
            }
        }

        /* auto populate a randomly generated password that meets the specified criteria. */
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
            post(
                API_INIT_ENDPOINT
                , initParams
                // SUCCESS
                , function (data) {
                    getOrSetAnonymousId(data.anonymous_id);
                    RECAPTCHA_V3_SITE_KEY = data.recaptcha_v3_site_key;
                    if (data.errors) { handleErrors2({ responseJSON: data.errors }); }
                    if (data.shopify) {
                        if (!emailField.val() && data.shopify.email) { emailField.val(data.shopify.email); emailVerify("warning"); }
                        if (!fullnameField.val() && data.shopify.shop_owner) { fullnameField.val(data.shopify.shop_owner); fullnameVerify("warning"); }
                    }
                    if (typeof window.GORGIAS_INIT_CALLBACK === "function") {
                        window.GORGIAS_INIT_CALLBACK(data);
                    }
                }
            );
        }

        function signupAccountFormHandler3() {

            let API_INIT_ENDPOINT = "/account/init";

            post(API_INIT_ENDPOINT, null,
                // SUCCESS
                function (response) {
                    /*             
                    if (data.redirect_url) {
                        window.location.href = getSignupFormPage() + window.location.search;
                    }
                    if (data.shopify) {
                        if (!accountDomainField.val() && data.shopify.name) { companyDomainVerify("warning"); accountDomainField.val(data.shopify.name); }
                    }
                    if (data.sso) {
                        if (!companyDomainField.val() && data.sso.company_domain) { companyDomainField.val(data.sso.company_domain); companyDomainVerify("warning"); }
                        if (!accountDomainField.val() && data.sso.account_domain) { accountDomainField.val(data.sso.account_domain); }
                    }
                    if (typeof window.GORGIAS_INIT_CALLBACK === "function") {
                        window.GORGIAS_INIT_CALLBACK(data);
                    }
                    */
                    if (typeof window.GORGIAS_INIT_CALLBACK === "function") { window.GORGIAS_INIT_CALLBACK(response); }
                    
                    const formDataAccount = {
                        company_domain: (companyDomainField.val() || "").trim().toLowerCase(),
                        account_domain: (accountDomainField.val() || "").trim().toLowerCase()
                    };
                    if (window.localStorage.getItem(plan_name_key) && window.localStorage.getItem(plan_name_key) == "starter" &&
                        window.localStorage.getItem(plan_period_key) && window.localStorage.getItem(plan_period_key) == "monthly") {
                        formDataAccount["account_subscription"] = { helpdesk: "starter-monthly-usd-4" };
                    }
                    onSubmitAccountSignupForm(formDataAccount);
                }
            );
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
            post(API_USER_SUBMIT_ENDPOINT2, formDataUser,
                // SUCCESS
                function (data) {
                    const formDataAccount = {
                        company_domain: (companyDomainField.val() || "").trim().toLowerCase(),
                        account_domain: (accountDomainField.val() || "").trim().toLowerCase()
                    };
                    if (window.localStorage.getItem(plan_name_key) && window.localStorage.getItem(plan_name_key) == "starter" &&
                        window.localStorage.getItem(plan_period_key) && window.localStorage.getItem(plan_period_key) == "monthly") {
                        formDataAccount["account_subscription"] = { helpdesk: "starter-monthly-usd-4" };
                    }
                    signupAccountFormHandler3();
                    return void 0;
                }
                // ERROR
                , function (response2) {
                    console.error("API USER SUBMIT call failed", response2);
                    onSubmitEnd2(userForm, signupButton);
                    handleErrors2(response2);
                    userFormWrapper.show();
                    userFormLoadingWrapper.hide();
                    grecaptcha.reset();
                }
            );
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
            post(API_VALIDATION_ENDPOINT, formData,

                // SUCCESS
                function (data) {
                    localStorage.removeItem("account-subdomains-approved");
                    window.location.href = data.redirect_url;
                },

                // ERROR
                function (response) {
                    console.error("API ACCOUNT submitt call failed", response);
                    handleErrors2(response);
                    onSubmitEnd2(userForm, signupButton);
                    accountDomainText.remove(classValidText);
                    userFormLoadingWrapper.hide();
                    userFormWrapper.show();
                    grecaptcha.reset();
                }
            );
        }

        function onLoad() {
            resetLocalStorageFields();
            enableFields();
            
            mirrorEmailToFullname(fullnameField.val(), emailField.val());
            generatePassword();

            emailVerify();
            companyDomainVerify();
            accountDomainVerify(null, accountDomainField.val() || "", false);
            fullnameVerify();
            passwordVerify(); 

            emailField.on("blur", function () {
                emailVerify("warning");
            });
            companyDomainField.on("change", function () { companyDomainReformat(); });
            companyDomainField.on("blur", function () { companyDomainVerify("warning"); });
            companyDomainField.keyup(function () {
                clearTimeout(delayTimer);
                delayTimer = window.setTimeout(function () { companyDomainVerify("warning"); }, 1e3);
            });

            accountDomainField.on("blur", function () { accountDomainVerify("warning", $(this).val() || "", false); });

            emailField.keyup(function () {
                mirrorEmailToFullname(fullnameField.val(), emailField.val());
                clearTimeout(delayTimer);
                delayTimer = window.setTimeout(function () { emailVerify("warning"); }, 1e3);
            });

            processSearchParams();
            initiateMessageContainer();

            waitForAnalytics(function () {
                signupUserFormHandler2();
            });

            userForm.submit(async function (event) {
                event.preventDefault();
                event.stopPropagation();
                signupButton.next("div[id*='-message-container']").empty();

                // frontend validation for every fields, including empty ones
                let status = "error";
                emailVerify(status);
                companyDomainVerify(status);
                accountDomainVerify(status, accountDomainField.val() || "", false);
                fullnameVerify(status);
                passwordVerify(status); 

                const form = $(this);
                const fullnameStatus = getFieldStatus(fullname_key);
                const emailStatus = getFieldStatus(email_key);
                const passwordStatus = getFieldStatus(password_key);
                const accountDomainStatus = getFieldStatus(account_domain_key);
                const companyDomainStatus = getFieldStatus(company_domain_key);
                const messaging = "Please check fields with error, then submit";

                if (fullnameStatus !== "valid" || emailStatus !== "valid" || passwordStatus !== "valid" || accountDomainStatus !== "valid" || companyDomainStatus !== "valid") {
                    handleFormStatus(form, status, messaging);
                    return false;
                } else {
                    status = "valid";
                    resetLocalStorageFields();
                    const DATADOG_BOT_USER_AGENT = "Datadog/Synthetics";
                    if (navigator.userAgent === DATADOG_BOT_USER_AGENT) {
                        onSubmitUserSignupForm2();
                    } else {
                        /*void grecaptcha.execute();*/
                        if (!RECAPTCHA_V3_SITE_KEY) {
                            console.error("reCAPTCHA v3 site key is missing");
                            return;
                        }

                        // v3 only
                        grecaptcha.ready(async () => {
                            console.info("Executing reCAPTCHA v3 verification");
                            const token = await grecaptcha.execute(
                                RECAPTCHA_V3_SITE_KEY,
                                { action: "signup" },
                            );
                            onSubmitUserSignupForm2(token);
                        });
                    }
                    return void 0;
                }
            });
            /*window.onUserSignUpRecaptchaResponse = onSubmitUserSignupForm2; */
            

        }
        window.Webflow = window.Webflow || [];
        window.Webflow.push(function () {
            onLoad();
        });
    }
    $(document).ready(init2);
})();