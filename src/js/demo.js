const demoLeadFormId = 'ef92ccce-92bd-4010-847a-793f56b6b353';
const demoFrLeadFormId = "af1d8fe3-2a0d-4dc8-afb4-eb08b6741f79";
const demoCustomerFormId = 'b7cf896e-d7b3-4f50-a5c1-21459faa6322';
const demoCustomerAutomateFormId = '2550ba15-99e2-4792-ba41-e389b8695d12';
const demoCustomerConvertFormId = 'ecb4eba5-6a65-49a2-82d1-5418da6dc5ec';
const postDemoFormId = 'b6a985d7-fc5d-4512-8a3d-4e6de8120cf4';

// demo functions
window.addEventListener("message", function(event) {
    // when form is ready
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady' && (event.data.id === demoLeadFormId ||  event.data.id === demoFrLeadFormId || event.data.id === demoCustomerAutomateFormId || event.data.id === demoCustomerConvertFormId)) {
        // if url contains reamaze --> autocomplete current_helpdesk field if it exist and then and hide it
        if($('div.hs_demo_current_helpdesk').length  && location.href.includes('reamaze') == true){
            $('select[name=demo_current_helpdesk]').val('Reamaze').change();
            $('div.hs_demo_current_helpdesk').addClass('hidden');
        }
   
        // get utm and timzezone data to autocomplete hidden fields
        var utmCampaign = sessionStorage.getItem('utm_campaign_session') || '' ;
        var utmSourceParam = sessionStorage.getItem('utm_source_session') || '' ;
        var utmMediumParam = sessionStorage.getItem('utm_medium_session') || '' ;
        var demoUtmTerm = sessionStorage.getItem('utm_term_session') || '' ;
        var demoTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '' ;      
    
        if (demoTimezone.length > 0) {
            $('input[name=demo_timezone]').val(demoTimezone).change();
        }
        else{
            $('input[name=demo_timezone]').val('').change();
        }        
      
        if (utmCampaign.length > 0) {
        $('input[name=demo_utm_campaign]').val(utmCampaign).change();
        $('input[name=cross_sell_utm_campaign]').val(utmCampaign).change();

        }
        else{
            $('input[name=demo_utm_campaign]').val('').change();
            $('input[name=cross_sell_utm_campaign]').val('').change();
        }

        if (utmSourceParam.length > 0) {
        $('input[name=demo_utm_source]').val(utmSourceParam).change();
        $('input[name=cross_sell_utm_source]').val(utmSourceParam).change();

        }
        else{
            $('input[name=demo_utm_source]').val('').change();
            $('input[name=cross_sell_utm_source]').val('').change();
        }

        if (utmMediumParam.length > 0) {
            $('input[name=demo_utm_medium]').val(utmMediumParam).change();
            $('input[name=cross_sell_utm_medium]').val(utmMediumParam).change();
        }
        else{
            $('input[name=demo_utm_medium]').val('').change();
            $('input[name=cross_sell_utm_medium]').val('').change();
        }

        if (demoUtmTerm.length > 0) {
        $('input[name=demo_utm_term]').val(demoUtmTerm).change();
        $('input[name=cross_sell_utm_term]').val(demoUtmTerm).change();

        }

        else{
            $('input[name=demo_utm_term]').val('').change();
            $('input[name=cross_sell_utm_term]').val('').change();

        }

        // Update ecommerce platform input field with utm_source
        let ecommerceSource = sessionStorage.getItem('ecommerce_source') || '' ;
        if (ecommerceSource.length > 0) {
            $('input[name=demo_ecommerce_platform]').val(ecommerceSource).change();
        }
        else{
            $('input[name=demo_ecommerce_platform]').val('other').change();
        }
     }
});

// chilipiper function 
function q(a){return function(){ChiliPiper[a].q=(ChiliPiper[a].q||[]).concat([arguments])}}window.ChiliPiper=window.ChiliPiper||"submit scheduling showCalendar submit widget bookMeeting".split(" ").reduce(function(a,b){a[b]=q(b);return a},{});

// form submitted is a demo form (lead) of customer demo
window.addEventListener("message", function(event) {
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted' && ( event.data.id == demoLeadFormId || event.data.id == demoFrLeadFormId || event.data.id == demoCustomerFormId || event.data.id == demoCustomerAutomateFormId || event.data.id == demoCustomerConvertFormId )) {

        // store the value submitted
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

        // demo form for prospect (on /demo and /demo-2)
        if(eventId === demoLeadFormId || eventId === demoFrLeadFormId) {
            formName = 'demo'
            cpRouterName = "inbound-router"; 
        }
        // demo form for customers (on /demo-product)
        else if (eventId === demoCustomerFormId ||  eventId === demoCustomerAutomateFormId || eventId === demoCustomerConvertFormId) {
            formName = 'demo_customer'
            cpRouterName = "inbound_router_customer"; 
        }

        ChiliPiper.submit(cpTenantDomain, cpRouterName,{
            map: true,
            lead: submittedValues,
            formId:'hsForm_' + eventId,
            domElement: "#wrapper-chilipiper-embed",
            // submission received by CP & routing attempt has been made, whether successful or not
            onRouted: function () {
                analytics.track("cp_"+ formName +"_request_routed");
            },
            // successful booking
            onSuccess: function (data) { 
                analytics.track("cp_" + formName + "_booked");

                if(formName == 'demo'){
                    $('.wrapper-post-demo-booked').removeClass('is-hidden');
                    $('.wrapper-chilipiper-embed').height('250px');
                    $('.demo_step-wrapper').css('display','none');
                    $('.demo-new_status-bar').css('display','none');
                }

            }, 
            // submission received but does not match any queue rules and cannot be routed, thus no calendar is displayed.
            // This is usually when someone is disqualified from booking
            onError: function () {
                analytics.track("cp_" + formName + "_demo_request_failed");
            }, 
            injectRootCss: true
        })  
    }
});

// form submitted is a post demo form
window.addEventListener("message", function(event) {
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted' && ( event.data.id == postDemoFormId )) {
        $('.post-demo-booked-heading').addClass('is-hidden');
        $('.demo-form-hubspot-post-booking').addClass('is-hidden');
        $('.post-demo-booked-confirmation').removeClass('is-hidden');
    }
});