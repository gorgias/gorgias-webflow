const demoLeadFormId = 'ef92ccce-92bd-4010-847a-793f56b6b353';
const demoCustomerFormId = 'b7cf896e-d7b3-4f50-a5c1-21459faa6322';

// demo functions
window.addEventListener("message", function(event) {
    // when form is ready
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady' && (event.data.id === demoLeadFormId || event.data.id === demoCustomerFormId)) {
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


// form submitted is a demo form
window.addEventListener("message", function(event) {
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted' && ( event.data.id == demoLeadFormId || event.data.id == demoCustomerFormId )) {

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
        if(eventId === demoLeadFormId) {
            formName = 'demo'
            cpRouterName = "inbound-router"; 
        }
        // demo form for customers (on /demo-product)
        else if (eventId === demoCustomerFormId) {
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

function displayAddCalendarBtn(data){
    // inject data from Chilipiper properly    
    var timestampStart = data.slot.start;
    var timestampEnd = data.slot.end;
    var dateStart = new Date(timestampStart);
    var dayStart = dateStart.getDate(); 
    var monthStart = ((dateStart.getMonth())+1); 
    var yearStart =  dateStart.getFullYear(); 
    var hoursStart =  dateStart.getHours(); 
    var MinutesStart =  dateStart.getMinutes(); 
    var SecondsStart =  dateStart.getSeconds();
    var dateEnd = new Date(timestampEnd);
    var dayEnd = dateEnd.getDate(); 
    var monthEnd = ((dateEnd.getMonth())+1); 
    var yearEnd =  dateEnd.getFullYear(); 
    var hoursEnd =  dateEnd.getHours(); 
    var MinutesEnd =  dateEnd.getMinutes(); 
    var SecondsEnd =  dateEnd.getSeconds(); 
    if(monthStart < 10){
        monthStart = '0' + monthStart;
    }
    if(dayStart < 10){
        dayStart = '0' + dayStart;
    }
    if(hoursStart < 10){
        hoursStart = '0' + hoursStart;
    }
    if(MinutesStart < 10){
        MinutesStart = '0' + MinutesStart;
    }
    if(SecondsStart < 10){
        SecondsStart = '0' + SecondsStart;
    }
    if(monthEnd < 10){
        monthEnd = '0' + monthEnd;
    }
    if(dayEnd < 10){
        dayEnd = '0' + dayEnd;
    }
    if(hoursEnd < 10){
        hoursEnd = '0' + hoursEnd;
    }
    if(MinutesEnd < 10){
        MinutesEnd = '0' + MinutesEnd;
    }
    if(SecondsEnd < 10){
        SecondsEnd = '0' + SecondsEnd;
    }
    var dateStartFormated = dayStart + "-" + monthStart + '-' + yearStart + " " + hoursStart +":"+ MinutesStart +":"+ SecondsStart;
    var dateEndFormated = dayEnd + "-" + monthEnd + '-' + yearEnd + " " + hoursEnd +":"+ MinutesEnd +":"+ SecondsEnd;
    var eventTimezone = "Europe/Paris";
    var eventTitle = "!!! Need the right title !!!";
    var eventDescription = "!!! Need the right description !!! ";
    var eventLocation = "!!! Need the right location !!!";
    var eventOrganizer = "Julien Marcialis";
    var eventOrganizerEmail = "julien.marcialis@gorgias.com";
    var eventAlarm = "60";

    // display the hidden btn button
    $('.add-to-calendar-btn').css('display','block');
    $('.add-to-calendar-btn .addeventatc span.start')[0].innerHTML = dateStartFormated;
    $('.add-to-calendar-btn .addeventatc span.end')[0].innerHTML = dateEndFormated;
    $('.add-to-calendar-btn .addeventatc span.timezone')[0].innerHTML = eventTimezone;
    $('.add-to-calendar-btn .addeventatc span.title')[0].innerHTML = eventTitle;
    $('.add-to-calendar-btn .addeventatc span.description')[0].innerHTML = eventDescription;
    $('.add-to-calendar-btn .addeventatc span.location')[0].innerHTML = eventLocation;
    $('.add-to-calendar-btn .addeventatc span.organizer')[0].innerHTML = eventOrganizer;
    $('.add-to-calendar-btn .addeventatc span.organizer_email')[0].innerHTML = eventOrganizerEmail;
    $('.add-to-calendar-btn .addeventatc span.alarm')[0].innerHTML = eventAlarm;

}