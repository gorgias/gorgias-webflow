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
            onSuccess: function (data) { 
                analytics.track("cp_demo_booked");
                //displayAddCalendarBtn(data);
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
        console.log("monthStart < 10");
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


function customizedCustomerLogos () {
    if (path === "/demo" || path === "/demo-2") {
        // customer logo list
        const logosToSelect = document.getElementsByClassName("customer_logos-collection-wrapper")
    
        // if customer logo list exist on the page
        if (logosToSelect.length > 0) {
    
            // location code of the visitor
            const loc_code = sessionStorage.getItem("loc_code")
    
            // if we now the visitor location
            if (loc_code && loc_code != "") {
    
                // mapping of the location code with the country full name
                const countryToWebflowIdentifier = {
                  au: "australia",
                  ca: "canada",
                  fr: "france",
                  uk: "united-kingdom",
                  gb: "united-kingdom",
                  us: "united-states",
                }
    
                // if the localisation code of hte visitor match with one from the mapping
                if (countryToWebflowIdentifier.hasOwnProperty(loc_code)) {
                    // then we hide the default list of customer
                    logosToSelect[0].style.display = "none";
    
                    // select the appropriate list of logos
                    const showLogosByCountry = Array.from(logosToSelect).filter((el) =>
                        el.classList.contains(countryToWebflowIdentifier[loc_code])
                    )
                    // display the appropriate list of logos
                    showLogosByCountry.forEach((el) => {
                        el.style.display = "block"
                    })
                } else {
    
                    if (path === "/demo") {
                        logosToSelect[0].style.display = "block"
                        logosToSelect[6].style.display = "block" //mobile one
                    }
                    else {
                        logosToSelect[0].style.display = "block"
                    }
                }
            }
        }
    }
  }
  
customizedCustomerLogos();


if (path === '/wip/demo') {
    $('demo-form-hubspot-cp').hide();

    window.addEventListener("message", function(event) {
        if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady' && event.data.id === "340a1d09-61d3-43c5-be9b-20c3ec22f665") {
            $('div[class*=demo-form-hubspot] .hs-number_of_agents, div[class*=demo-form-hubspot] .hs-phone, div[class*=demo-form-hubspot] .hs-demo_ecommerce_platform, div[class*=demo-form-hubspot] .hs-demo_product_interest').hide( function (){
                $('demo-form-hubspot-cp').fadeIn(1000);
            })
        }

        $('div[class*=demo-form-hubspot] .hs-company_domain input').on('input', function() {
            var companyDomain = $(this).val();
            var domainPattern = /^(?:https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(?:\/.*)?$/;

            if (domainPattern.test(companyDomain)) {
                setTimeout(function() {
                    $('div[class*=demo-form-hubspot] .hs-number_of_agents, div[class*=demo-form-hubspot] .hs-phone, div[class*=demo-form-hubspot] .hs-demo_ecommerce_platform, div[class*=demo-form-hubspot] .hs-demo_product_interest').fadeIn(1000);
                }, 250)
            } 
        });
    })
}
    


