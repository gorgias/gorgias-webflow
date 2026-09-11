(function() {

    const demoLeadFormId = 'ef92ccce-92bd-4010-847a-793f56b6b353';
    const demoLeadMultiStepFunnelFormId = 'c0b510e0-b9e8-49bf-a54c-872a45c50040';
    const demoFrLeadFormId = "af1d8fe3-2a0d-4dc8-afb4-eb08b6741f79";
    const demoCustomerFormId = 'b7cf896e-d7b3-4f50-a5c1-21459faa6322';
    const demoCustomerAutomateFormId = '2550ba15-99e2-4792-ba41-e389b8695d12';
    const demoCustomerConvertFormId = 'ecb4eba5-6a65-49a2-82d1-5418da6dc5ec';
    const demoCustomerAiSalesAgentFormId = '5e98af50-58ae-48eb-b262-777f40f90fd3';
    const demoCustomerVoiceFormId = 'ed918c55-148c-4ae3-a285-25cc131d2975';
    const demoLeadEnterpriseCXAuditFormId = 'a031d4fd-d19c-466d-90ce-315f9713a70c';
    const demoLeadEnterpriseCXCommercialFormId = 'acb7551c-8080-467b-97cc-da9f67a7e131';
    const postDemoFormId = 'b6a985d7-fc5d-4512-8a3d-4e6de8120cf4';
    const postDemoMultiStepFormId = '5f329430-c30d-4637-b5e3-828f02bedd06';
    const demoLeadBfcmLp2025GiftFormId  = 'a2c891e7-7fc1-4886-9d0a-fa2483f2b7e6';
    const demoLeadBfcmLp2025NoGiftFormId = '3d823e95-9cee-4865-8075-a95f8b6f8887';
    const demoCustomerRenewalFormId = 'ac5cd2e0-942d-4505-92c2-7e96e6ef6350';
    const demoAdsFormId = '61c128c5-9f98-4093-869b-650b3bd2e80e';
    let adsFormData = {}; // Store form data globally

    // For ads form: Capture form data before it's submitted
    if (window.location.pathname.includes('/demo-ads/')) {
        console.log('[DEMO.JS - ADS] Setting up ads form handlers');

        function setupFormDataCapture() {
            var form = document.querySelector('.hbspt-form form');
            if (!form) {
                console.log('[DEMO.JS - ADS] Form not found yet, retrying...');
                setTimeout(setupFormDataCapture, 500);
                return;
            }

            console.log('[DEMO.JS - ADS] Found form, setting up data capture');

            // Capture data on form input changes
            form.addEventListener('change', function(e) {
                if (e.target.name && e.target.value) {
                    adsFormData[e.target.name] = e.target.value;
                    console.log('[DEMO.JS - ADS] Captured field:', e.target.name, '=', e.target.value);
                }
            });

            // Also capture on input event for real-time capture
            form.addEventListener('input', function(e) {
                if (e.target.name && e.target.value) {
                    adsFormData[e.target.name] = e.target.value;
                }
            });

            // Capture data when submit button is clicked
            var submitBtn = form.querySelector('button[type="submit"], input[type="submit"], .hs-button');
            if (submitBtn) {
                submitBtn.addEventListener('click', function(e) {
                    console.log('[DEMO.JS - ADS] Submit button clicked, capturing all form data');
                    var inputs = form.querySelectorAll('input, select, textarea');
                    inputs.forEach(function(input) {
                        if (input.name && input.value) {
                            adsFormData[input.name] = input.value;
                        }
                    });
                    console.log('[DEMO.JS - ADS] Final captured data:', adsFormData);
                });
            } else {
                console.log('[DEMO.JS - ADS] Submit button not found');
            }
        }

        // Try to set up immediately, then retry if form isn't ready
        setupFormDataCapture();

        // Detect form submission by watching for success message
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.classList && node.classList.contains('submitted-message')) {
                            console.log('[DEMO.JS - ADS] Success message appeared! Triggering ChiliPiper with data:', adsFormData);
                            setTimeout(function() {
                                triggerChiliPipperForAds(adsFormData);
                            }, 100);
                        }
                    });
                }
            });
        });

        var wrapper = document.querySelector('.demo_form-component') || document.body;
        observer.observe(wrapper, { childList: true, subtree: true });
        console.log('[DEMO.JS - ADS] MutationObserver set up on wrapper');
    }

    function triggerChiliPipperForAds(formData) {
        console.log('[DEMO.JS - ADS] triggerChiliPipperForAds called with:', formData);

        if (!formData || Object.keys(formData).length === 0) {
            console.warn('[DEMO.JS - ADS] WARNING: No form data! Using empty object');
            formData = {};
        }

        // Convert arrays to semicolon-separated strings
        for (var key in formData) {
            if (Array.isArray(formData[key])) {
                formData[key] = formData[key].toString().replaceAll(",", ";");
            }
        }

        function forceChiliHeight(target) {
            try {
                var $el = $(target);
                if ($el && $el.length) {
                    $el.css({'display':'block', 'overflow':'hidden'});
                    $el.get(0).style.setProperty('height', '700px', 'important');
                    $el.get(0).style.setProperty('max-height', '700px', 'important');
                    console.log('[DEMO.JS - ADS] forceChiliHeight applied to:', target);
                }
            } catch(e) {
                console.error('[DEMO.JS - ADS] forceChiliHeight error:', e);
            }
        }

        function safeTrack(name) {
            try {
                if (window.analytics && typeof window.analytics.track === 'function') {
                    window.analytics.track(name);
                    console.log('[DEMO.JS - ADS] Analytics tracked:', name);
                }
            } catch(e) {}
        }

        var chilipiperDomWrapper = "#wrapper-chilipiper-embed";

        console.log('[DEMO.JS - ADS] About to call ChiliPiper.submit with:', {
            domain: "gorgias",
            router: "aug-2026-ticket-based-routing",
            domElement: chilipiperDomWrapper,
            dataKeys: Object.keys(formData)
        });

        ChiliPiper.submit("gorgias", "aug-2026-ticket-based-routing", {
            map: true,
            lead: formData,
            formId: 'hsForm_' + demoAdsFormId,
            domElement: chilipiperDomWrapper,
            onRouting: function() {
                console.log('[DEMO.JS - ADS] ChiliPiper onRouting');
                forceChiliHeight(chilipiperDomWrapper);
                safeTrack("cp_demo_request_routing");
            },
            onRouted: function() {
                console.log('[DEMO.JS - ADS] ChiliPiper onRouted');
                forceChiliHeight(chilipiperDomWrapper);
                safeTrack("cp_demo_request_routed");
            },
            onSuccess: function(data) {
                console.log('[DEMO.JS - ADS] ChiliPiper onSuccess', data);
                safeTrack("cp_demo_booked");
                forceChiliHeight(chilipiperDomWrapper);
            },
            onError: function() {
                console.log('[DEMO.JS - ADS] ChiliPiper onError');
                safeTrack("cp_demo_request_failed");
            },
            injectRootCss: true
        });
    }


    // demo functions
    window.addEventListener("message", function(event) {
        if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady' && (event.data.id === demoLeadFormId || event.data.id === demoLeadMultiStepFunnelFormId ||  event.data.id === demoFrLeadFormId || event.data.id === demoCustomerAutomateFormId || event.data.id === demoCustomerConvertFormId || event.data.id === demoCustomerAiSalesAgentFormId || event.data.id === demoCustomerVoiceFormId || event.data.id === demoLeadEnterpriseCXAuditFormId || event.data.id === demoLeadEnterpriseCXCommercialFormId || event.data.id === demoAdsFormId)) {
            if($('div.hs_demo_current_helpdesk').length  && location.href.includes('reamaze') == true){
                $('select[name=demo_current_helpdesk]').val('Reamaze').change();
                $('div.hs_demo_current_helpdesk').addClass('hidden');
            }
            var utmCampaign = sessionStorage.getItem('utm_campaign_session') || '' ;
            var utmSourceParam = sessionStorage.getItem('utm_source_session') || '' ;
            var utmMediumParam = sessionStorage.getItem('utm_medium_session') || '' ;
            var demoUtmTerm = sessionStorage.getItem('utm_term_session') || '' ;
            var demoTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '' ;      
            if (demoTimezone.length > 0) {
                $('input[name=demo_timezone]').val(demoTimezone).change();
            } else {
                $('input[name=demo_timezone]').val('').change();
            }        
            if (utmCampaign.length > 0) {
                $('input[name=demo_utm_campaign]').val(utmCampaign).change();
                $('input[name=cross_sell_utm_campaign]').val(utmCampaign).change();
            } else {
                $('input[name=demo_utm_campaign]').val('').change();
                $('input[name=cross_sell_utm_campaign]').val('').change();
            }
            if (utmSourceParam.length > 0) {
                $('input[name=demo_utm_source]').val(utmSourceParam).change();
                $('input[name=cross_sell_utm_source]').val(utmSourceParam).change();
            } else {
                $('input[name=demo_utm_source]').val('').change();
                $('input[name=cross_sell_utm_source]').val('').change();
            }
            if (utmMediumParam.length > 0) {
                $('input[name=demo_utm_medium]').val(utmMediumParam).change();
                $('input[name=cross_sell_utm_medium]').val(utmMediumParam).change();
            } else {
                $('input[name=demo_utm_medium]').val('').change();
                $('input[name=cross_sell_utm_medium]').val('').change();
            }
            if (demoUtmTerm.length > 0) {
                $('input[name=demo_utm_term]').val(demoUtmTerm).change();
                $('input[name=cross_sell_utm_term]').val(demoUtmTerm).change();
            } else {
                $('input[name=demo_utm_term]').val('').change();
                $('input[name=cross_sell_utm_term]').val('').change();
            }

            var phoneExtSelect = document.getElementById('phone_ext-' + event.data.id);
            if (phoneExtSelect) {
                var maxChars = 8;
                var originalTexts = new Map();
                phoneExtSelect.querySelectorAll('option').forEach(function(option) {
                    originalTexts.set(option.value, option.text);
                });
                function truncate(text) {
                    return text.length > maxChars ? text.substring(0, maxChars) + '…' : text;
                }
                function applyTruncation() {
                    var selected = phoneExtSelect.options[phoneExtSelect.selectedIndex];
                    if (selected) selected.text = truncate(originalTexts.get(selected.value) || selected.text);
                }
                phoneExtSelect.addEventListener('mousedown', function() {
                    phoneExtSelect.querySelectorAll('option').forEach(function(option) {
                        option.text = originalTexts.get(option.value) || option.text;
                    });
                });
                phoneExtSelect.addEventListener('change', applyTruncation);
                applyTruncation();
            }
        }
    });

    // chilipiper function 
    function q(a){return function(){ChiliPiper[a].q=(ChiliPiper[a].q||[]).concat([arguments])}}
    window.ChiliPiper=window.ChiliPiper||"submit scheduling showCalendar submit widget bookMeeting".split(" ").reduce(function(a,b){a[b]=q(b);return a},{});

    // form submitted is a demo form (lead) of customer demo
    window.addEventListener("message", function(event) {
        console.log('[DEMO.JS] Message event received:', event.data.type, event.data.eventName, event.data.id);

        if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted' && ( event.data.id == demoLeadFormId || event.data.id == demoLeadMultiStepFunnelFormId || event.data.id == demoFrLeadFormId || event.data.id == demoCustomerFormId || event.data.id == demoCustomerAutomateFormId || event.data.id == demoCustomerConvertFormId || event.data.id === demoCustomerAiSalesAgentFormId || event.data.id == demoCustomerVoiceFormId || event.data.id == demoLeadEnterpriseCXAuditFormId || event.data.id === demoLeadEnterpriseCXCommercialFormId || event.data.id === demoLeadBfcmLp2025GiftFormId || event.data.id === demoLeadBfcmLp2025NoGiftFormId || event.data.id === demoCustomerRenewalFormId || event.data.id === demoAdsFormId)) {
            console.log('[DEMO.JS] Form submitted! ID:', event.data.id);

            var submittedValues=event.data.data.submissionValues;
            console.log('[DEMO.JS] Submitted values:', submittedValues);
            for (var key in submittedValues) {
                if (Array.isArray(submittedValues[key])) {
                    submittedValues[key] = submittedValues[key].toString().replaceAll(",",";");
                }
            }
            var eventId = event.data.id;
            var formName;
            var cpTenantDomain;
            var cpRouterName;

            // selector (id, class, etc.) or a direct reference to the dom node in which the ChiliPiper widget will be embedded on the page.
            // Default is #wrapper-chilipiper-embed, but need to be updated in case there are multiple forms on the page calling ChiliPiper.submit
            var chilipiperDomWrapper = "#wrapper-chilipiper-embed";

            cpTenantDomain = "gorgias";


            // customize CP routing based on the form submitted
            if(eventId === demoLeadFormId || eventId === demoLeadMultiStepFunnelFormId || eventId === demoFrLeadFormId || eventId === demoAdsFormId || event.data.id === demoLeadBfcmLp2025GiftFormId || event.data.id === demoLeadBfcmLp2025NoGiftFormId ) {
                formName = 'demo'
                cpRouterName = "aug-2026-ticket-based-routing";

                if(eventId == demoLeadBfcmLp2025GiftFormId) {
                    chilipiperDomWrapper = ".june-campaign_modal-wrapper.is-gift .wrapper-chilipiper-embed";
                }else if(eventId == demoLeadBfcmLp2025NoGiftFormId) {
                    chilipiperDomWrapper = ".june-campaign_modal-wrapper.is-demo .wrapper-chilipiper-embed";
                }

            } else if (eventId === demoCustomerFormId ||  eventId === demoCustomerAutomateFormId || eventId === demoCustomerConvertFormId || event.data.id == demoCustomerVoiceFormId || event.data.id == demoCustomerAiSalesAgentFormId) {

                formName = 'demo_customer'
                cpRouterName = "inbound_router_customer";
            } else if (eventId === demoLeadEnterpriseCXAuditFormId) {
                formName = 'cx_audit'
                cpRouterName = "Inbound_Router_Lead_Enterprise_CX_Audit";
                console.log('cx_audit passed');
            }  else if (eventId === demoLeadEnterpriseCXCommercialFormId) {
                formName = 'cx_commercial'
                cpRouterName = "Inbound_Router_Lead_Commercial_CX_Audit";
                console.log('cx_audit passed');
            } else if (eventId === demoCustomerRenewalFormId) {
                formName = 'customer_renewal'
                cpRouterName = "inbound_router_customer";
                console.log('customer_renewal passed');
            }

            console.log('[DEMO.JS] Form config:', { formName, cpRouterName, chilipiperDomWrapper, cpTenantDomain });

            function forceChiliHeight(target){
                try {
                    var $el = $(target);
                    if ($el && $el.length) {
                        $el.css({'display':'block', 'overflow':'hidden'});
                        // ensure inline override over CP injected styles
                        $el.get(0).style.setProperty('height', '700px', 'important');
                        $el.get(0).style.setProperty('max-height', '700px', 'important');
                        console.log('[DEMO.JS] forceChiliHeight applied to:', target);
                    } else {
                        console.log('[DEMO.JS] forceChiliHeight - element not found:', target);
                    }
                } catch(e){console.error('[DEMO.JS] forceChiliHeight error:', e);}
            }

            function safeTrack(name){
                try{
                    if (window.analytics && typeof window.analytics.track === 'function') {
                        window.analytics.track(name);
                        console.log('[DEMO.JS] Analytics tracked:', name);
                    } else {
                        console.warn('analytics.track unavailable:', name);
                    }
                }catch(e){}
            }

            if(formName == 'demo'){
                $('.privacy-policy').css('display','none');
            }
            console.log('[DEMO.JS] Calling ChiliPiper.submit with:', cpTenantDomain, cpRouterName);
            ChiliPiper.submit(cpTenantDomain, cpRouterName,{
                map: true,
                lead: submittedValues,
                formId:'hsForm_' + eventId,
                domElement: chilipiperDomWrapper,
                onRouting: function () {
                    console.log('[DEMO.JS] ChiliPiper onRouting fired');
                    forceChiliHeight(chilipiperDomWrapper);
                    safeTrack("cp_"+ formName +"_request_routing");
                },

                onRouted: function () {
                    console.log('[DEMO.JS] ChiliPiper onRouted fired');
                    forceChiliHeight(chilipiperDomWrapper);
                    safeTrack("cp_"+ formName +"_request_routed");
                    // customize Frontend element based on the CP routing success

                    if(eventId == demoLeadBfcmLp2025GiftFormId) {
                        // hide the modal header above the form gift request when it has been submitted
                        $(".june-campaign_modal-wrapper.is-gift .demo-form_modal_content>.signup-form_header.is-gift").addClass('is-hidden');
                        // display the modal header above the CP calendar after form gift request has been submitted
                        $(".june-campaign_modal-wrapper.is-gift .demo-form_modal_content>.signup-form_header.is-demo").removeClass('is-hidden');
                    }
                },
                onSuccess: function (data) {
                    console.log('[DEMO.JS] ChiliPiper onSuccess fired', data);
                    safeTrack("cp_" + formName + "_booked");
                    if(formName == 'demo'){
                        console.log('in success > demo')
                        $('.wrapper-post-demo-booked').removeClass('is-hidden');
                        forceChiliHeight(chilipiperDomWrapper);
                        $('.demo_step-wrapper').css('display','none');
                        $('.demo-new_status-bar').css('display','none');
                        $('.demo-form-hubspot-post-booking').css('margin-top','-3rem');
                    }
                },
                onError: function () {
                    console.log('[DEMO.JS] ChiliPiper onError fired');
                    // track ChiliPiper error through segment
                    safeTrack("cp_" + formName + "_request_failed");

                    // customize de frontend if CP request failed
                    if(eventId == demoLeadBfcmLp2025GiftFormId) {
                        // display the modal header above the form gift request when it has been submitted
                        $(".june-campaign_modal-wrapper.is-gift .demo-form_modal_content>.signup-form_header.is-gift").removelass('is-hidden');
                        // display the modal header above the CP calendar after form gift request has been submitted
                        $(".june-campaign_modal-wrapper.is-gift .demo-form_modal_content>.signup-form_header.is-demo").addClass('is-hidden');
                    }

                },
                injectRootCss: true
            })
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target && e.target.getAttribute('data-action') === 'open-gorgias-chat') {
            var initPromise = (window.GorgiasChat && typeof window.GorgiasChat.init === 'function')
                ? window.GorgiasChat.init()
                : new Promise(function(resolve) {
                    window.addEventListener('gorgias-widget-loaded', resolve);
                  });
            initPromise.then(function() {
                if (!window.GorgiasChat) return;
                if (typeof window.GorgiasChat.open === 'function') {
                    window.GorgiasChat.open();
                }
                if (typeof window.GorgiasChat.sendMessage === 'function') {
                    window.GorgiasChat.sendMessage("Hi, I'd like to book a demo");
                }
            });
        }
    });

    var hsCheckDelay = new URLSearchParams(window.location.search).has('hs_fallback') ? 0 : 3000;
    setTimeout(function() {
        var fallbackHTML =
            '<div class="hs-form-blocked" style="padding:24px 32px;text-align:center;display:flex;flex-direction:column;justify-content:center;row-gap:1rem;">' +
                '<div style="font-size:1.25rem;font-weight:500;text-align:center;">Trouble loading the form?</div>' +
                '<div style="text-align:center;">A browser extension may be blocking it. Try disabling your ad blocker for gorgias.com and refreshing the page, or chat with us directly.</div>' +
                '<a data-action="open-gorgias-chat" class="link-underline text-size-small" style="cursor:pointer;">Chat with us to book a demo</a>' +
            '</div>';

        var eventFired = false;
        function showFallback(el) {
            if (!el || el.querySelector('.hs-form-blocked')) return;
            el.innerHTML = fallbackHTML;
            if (!eventFired) {
                eventFired = true;
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({ event: 'hubspot_form_blocked', page_path: window.location.pathname });
            }
        }

        // Case A: HubSpot created the .hbspt-form wrapper but form never rendered inside it
        // Checking only `form` — a blocked form element still exists in the DOM and would mask the failure.
        document.querySelectorAll('.hbspt-form').forEach(function(wrapper) {
            if (!wrapper.querySelector('form')) {
                showFallback(wrapper);
            }
        });

        // Case B: embed script blocked entirely — no .hbspt-form wrapper was ever injected
        document.querySelectorAll('[class*="demo-form-hubspot"]').forEach(function(container) {
            if (!container.querySelector('form, iframe, .hbspt-form, input')) {
                showFallback(container);
            }
        });
    }, hsCheckDelay);

})();