// demo functions
window.addEventListener("message", function(event) {
    // when form is ready
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady' && event.data.id === "ef92ccce-92bd-4010-847a-793f56b6b353") {
  
        // if url contains reamaze --> autocomplete current_helpdesk field if it exist and then and hide it
        if($('div.hs_demo_current_helpdesk').length  && location.href.includes('reamaze') == true){
            $('select[name=demo_current_helpdesk]').val('Reamaze').change();
            $('div.hs_demo_current_helpdesk').addClass('hidden');
        }
   
        // get utm and timzezone data to autocomplete hidden fields
        var utmCampaign = sessionStorage.getItem('utm_campaign_session') || '' ;
        var utmSourceParam = sessionStorage.getItem('utm_source_session') || '' ;
        var utmMediumParam = sessionStorage.getItem('utm_medium_session') || '' ;
        var demoUtmTerm = sessionStorage.getItem('demo_utm_term_session') || '' ;
        var demoUtmTerm = sessionStorage.getItem('demo_utm_term_session') || '' ;
        var demoTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '' ;      
    
        if (demoTimezone.length > 0) {
            $('input[name=demo_timezone]').val(demoTimezone).change();
        }
        else{
            $('input[name=demo_timezone]').val('').change();
        }        
      
        if (utmCampaign.length > 0) {
        $('input[name=demo_utm_campaign]').val(utmCampaign).change();
        }
        else{
            $('input[name=demo_utm_campaign]').val('').change();
        }

        if (utmSourceParam.length > 0) {
        $('input[name=demo_utm_source]').val(utmSourceParam).change();
        }
        else{
            $('input[name=demo_utm_source]').val('').change();
        }

        if (utmMediumParam.length > 0) {
        $('input[name=demo_utm_medium]').val(utmMediumParam).change();
        }
        else{
            $('input[name=demo_utm_medium]').val('').change();
        }

        if (demoUtmTerm.length > 0) {
        $('input[name=demo_utm_term]').val(demoUtmTerm).change();
        }
        else{
            $('input[name=demo_utm_term]').val('').change();
        }
     }
});

// chilipiper function 
function q(a){return function(){ChiliPiper[a].q=(ChiliPiper[a].q||[]).concat([arguments])}}window.ChiliPiper=window.ChiliPiper||"submit scheduling showCalendar submit widget bookMeeting".split(" ").reduce(function(a,b){a[b]=q(b);return a},{});

// form submitted
window.addEventListener("message", function(event) {
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmit' && event.data.id === "ef92ccce-92bd-4010-847a-793f56b6b353") {
        
        ChiliPiper.submit("gorgias", "inbound-router",{
            formId:'hsForm_ef92ccce-92bd-4010-847a-793f56b6b353',
            domElement: "#wrapper-chilipiper-embed",
            // lead's submission has been received by Chili Piper and a routing attempt has been made, whether successful or not
            onRouted: function () {
                analytics.track("cp_demo_request_routed");
            },
            // successful booking
            onSuccess: function () { 
                analytics.track("cp_demo_booked");
            }, 
            // lead is submitted but does not match any queue rules and cannot be routed, thus no calendar is displayed. This is usually when someone is disqualified from booking
            onError: function () {
                analytics.track("cp_demo_request_failed");
            }, 
            // onClose: function () { console.log("onCloseChiliPiper") }, // This will call a function when a lead is submitted and is displayed the option to book (meaning the lead has qualified for a meeting), but exits the booking module.
            injectRootCss: true
        })  
    }
});