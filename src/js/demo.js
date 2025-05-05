(function() {

    const demoLeadFormId = 'ef92ccce-92bd-4010-847a-793f56b6b353';
    const demoLeadVariantFormId = 'c0b510e0-b9e8-49bf-a54c-872a45c50040';
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

    // demo functions
    window.addEventListener("message", function(event) {
        if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady' && (event.data.id === demoLeadFormId || event.data.id === demoLeadVariantFormId ||  event.data.id === demoFrLeadFormId || event.data.id === demoCustomerAutomateFormId || event.data.id === demoCustomerConvertFormId || event.data.id === demoCustomerAiSalesAgentFormId || event.data.id === demoCustomerVoiceFormId || event.data.id === demoLeadEnterpriseCXAuditFormId || event.data.id === demoLeadEnterpriseCXCommercialFormId)) {
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
        }
    });

    // chilipiper function 
    function q(a){return function(){ChiliPiper[a].q=(ChiliPiper[a].q||[]).concat([arguments])}}
    window.ChiliPiper=window.ChiliPiper||"submit scheduling showCalendar submit widget bookMeeting".split(" ").reduce(function(a,b){a[b]=q(b);return a},{});

    // form submitted is a demo form (lead) of customer demo
    window.addEventListener("message", function(event) {
        if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted' && ( event.data.id == demoLeadFormId || event.data.id == demoLeadVariantFormId || event.data.id == demoFrLeadFormId || event.data.id == demoCustomerFormId || event.data.id == demoCustomerAutomateFormId || event.data.id == demoCustomerConvertFormId || event.data.id === demoCustomerAiSalesAgentFormId || event.data.id == demoCustomerVoiceFormId || event.data.id == demoLeadEnterpriseCXAuditFormId || event.data.id === demoLeadEnterpriseCXCommercialFormId)) {
            var submittedValues=event.data.data.submissionValues;
            for (var key in submittedValues) {
                if (Array.isArray(submittedValues[key])) {
                    submittedValues[key] = submittedValues[key].toString().replaceAll(",",";");
                }
            }
            var eventId = event.data.id;
            var formName;
            var cpTenantDomain;
            var cpRouterName;
            cpTenantDomain = "gorgias"; 
            if(eventId === demoLeadFormId || eventId === demoLeadVariantFormId || eventId === demoFrLeadFormId) {
                formName = 'demo'
                cpRouterName = "inbound-router"; 
            }else if (eventId === demoCustomerFormId ||  eventId === demoCustomerAutomateFormId || eventId === demoCustomerConvertFormId || event.data.id == demoCustomerVoiceFormId || event.data.id == demoCustomerAiSalesAgentFormId) {
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
            }

            if(formName == 'demo'){
                $('.privacy-policy').css('display','none');
            }

            ChiliPiper.submit(cpTenantDomain, cpRouterName,{
                map: true,
                lead: submittedValues,
                formId:'hsForm_' + eventId,
                domElement: "#wrapper-chilipiper-embed",
                onRouted: function () {
                    analytics.track("cp_"+ formName +"_request_routed");
                },
                onSuccess: function (data) { 
                    analytics.track("cp_" + formName + "_booked");
                    if(formName == 'demo'){
                        $('.wrapper-post-demo-booked').removeClass('is-hidden');
                        $('.wrapper-chilipiper-embed').height('176px');
                        $('.demo_step-wrapper').css('display','none');
                        $('.demo-new_status-bar').css('display','none');
                        $('.demo-form-hubspot-post-booking').css('margin-top','-3rem');                       
                    }
                }, 
                onError: function () {
                    analytics.track("cp_" + formName + "_demo_request_failed");
                }, 
                injectRootCss: true
            })  
        }
    });

})();



/****************************
 * 
 * IP based redirections
 * 
 ****************************/


    // // Function to check the user's IP and redirect based on location
    // function checkUserLocationAndRedirect() {
    //     // Check if the URL has the "ecommerce_platform" parameter
    //     let urlParams = new URLSearchParams(window.location.search);
    //     if (urlParams.has("ecommerce_platform") && !sessionStorage.getItem('redirected')) {
    //         // Convert URL parameters to string to append to the new URL
    //         let queryString = urlParams.toString();

    //         // Fetch the user's IP information
    //         fetch('https://ipinfo.io/json?token=16b2fa7a6332cb')
    //             .then(response => response.json())
    //             .then(data => {
    //                 let country = data.country.toLowerCase();
    //                 if (country === 'fr') {
    //                     sessionStorage.setItem('redirected', 'true');
    //                     //console.log('Redirecting to /fr/demo');
    //                     window.location.href = '/fr/demo?' + queryString;
    //                 } else if (country === 'es') {
    //                     sessionStorage.setItem('redirected', 'true');
    //                     //console.log('Redirecting to /es/demo');
    //                     window.location.href = '/es/demo?' + queryString;
    //                 }
    //             })
    //             .catch(error => console.error('Error fetching IP info:', error));
    //     } else {
    //        // console.log('No ecommerce_platform parameter or already redirected.');
    //     }
    // }

    // // Call the function to check the user's location and redirect if necessary
    // checkUserLocationAndRedirect();