// old layout functions
window.addEventListener("message", (event) => {
  // when form is ready
  if (event.data.type === 'hsFormCallback' &&
    event.data.eventName === 'onFormReady' &&
    event.data.id === "ef92ccce-92bd-4010-847a-793f56b6b353") {
    getUtmParameters()
  }
});

// old layout form submitted
window.addEventListener("message", (event) => {
  if (event.data.type === 'hsFormCallback' &&
    event.data.eventName === 'onFormSubmit' &&
    event.data.id === "ef92ccce-92bd-4010-847a-793f56b6b353") {
    chiliPaperSubmit('hsForm_ef92ccce-92bd-4010-847a-793f56b6b353')
  }
});

// new layout functions
window.addEventListener("message", (event) => {
  // when form is ready
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormReady" &&
    event.data.id === "6dd387bc-abfa-42cd-ba76-73aa3575b6f8"
  ) {
    getUtmParameters()
  }
});

// new layout form submitted form submitted
window.addEventListener("message", (event) => {
  if (
    event.data.type === "hsFormCallback" &&
    event.data.eventName === "onFormSubmit" &&
    event.data.id === "6dd387bc-abfa-42cd-ba76-73aa3575b6f8"
  ) {
    chiliPaperSubmit('hsForm_6dd387bc-abfa-42cd-ba76-73aa3575b6f')
  }
});

// chilipiper function 
function q(a) {
  return function() {
    ChiliPiper[a].q = (ChiliPiper[a].q || []).concat([arguments])
  }
}
window.ChiliPiper = window.ChiliPiper || "submit scheduling showCalendar submit widget bookMeeting".split(" ").reduce(function(a, b) {
  a[b] = q(b);
  return a
}, {});

function displayAddCalendarBtn(data) {
  // inject data from Chilipiper properly
  var timestampStart = data.slot.start;
  var timestampEnd = data.slot.end;
  var dateStart = new Date(timestampStart);
  var dayStart = dateStart.getDate();
  var monthStart = dateStart.getMonth() + 1;
  var yearStart = dateStart.getFullYear();
  var hoursStart = dateStart.getHours();
  var MinutesStart = dateStart.getMinutes();
  var SecondsStart = dateStart.getSeconds();
  var dateEnd = new Date(timestampEnd);
  var dayEnd = dateEnd.getDate();
  var monthEnd = dateEnd.getMonth() + 1;
  var yearEnd = dateEnd.getFullYear();
  var hoursEnd = dateEnd.getHours();
  var MinutesEnd = dateEnd.getMinutes();
  var SecondsEnd = dateEnd.getSeconds();
  if (monthStart < 10) {
    console.log("monthStart < 10");
    monthStart = "0" + monthStart;
  }
  if (dayStart < 10) {
    dayStart = "0" + dayStart;
  }
  if (hoursStart < 10) {
    hoursStart = "0" + hoursStart;
  }
  if (MinutesStart < 10) {
    MinutesStart = "0" + MinutesStart;
  }
  if (SecondsStart < 10) {
    SecondsStart = "0" + SecondsStart;
  }
  if (monthEnd < 10) {
    monthEnd = "0" + monthEnd;
  }
  if (dayEnd < 10) {
    dayEnd = "0" + dayEnd;
  }
  if (hoursEnd < 10) {
    hoursEnd = "0" + hoursEnd;
  }
  if (MinutesEnd < 10) {
    MinutesEnd = "0" + MinutesEnd;
  }
  if (SecondsEnd < 10) {
    SecondsEnd = "0" + SecondsEnd;
  }
  var dateStartFormated =
    dayStart +
    "-" +
    monthStart +
    "-" +
    yearStart +
    " " +
    hoursStart +
    ":" +
    MinutesStart +
    ":" +
    SecondsStart;
  var dateEndFormated =
    dayEnd +
    "-" +
    monthEnd +
    "-" +
    yearEnd +
    " " +
    hoursEnd +
    ":" +
    MinutesEnd +
    ":" +
    SecondsEnd;
  var eventTimezone = "Europe/Paris";
  var eventTitle = "!!! Need the right title !!!";
  var eventDescription = "!!! Need the right description !!! ";
  var eventLocation = "!!! Need the right location !!!";
  var eventOrganizer = "Julien Marcialis";
  var eventOrganizerEmail = "julien.marcialis@gorgias.com";
  var eventAlarm = "60";

  // display the hidden btn button
  $(".add-to-calendar-btn").css("display", "block");
  $(".add-to-calendar-btn .addeventatc span.start")[0].innerHTML =
    dateStartFormated;
  $(".add-to-calendar-btn .addeventatc span.end")[0].innerHTML =
    dateEndFormated;
  $(".add-to-calendar-btn .addeventatc span.timezone")[0].innerHTML =
    eventTimezone;
  $(".add-to-calendar-btn .addeventatc span.title")[0].innerHTML = eventTitle;
  $(".add-to-calendar-btn .addeventatc span.description")[0].innerHTML =
    eventDescription;
  $(".add-to-calendar-btn .addeventatc span.location")[0].innerHTML =
    eventLocation;
  $(".add-to-calendar-btn .addeventatc span.organizer")[0].innerHTML =
    eventOrganizer;
  $(".add-to-calendar-btn .addeventatc span.organizer_email")[0].innerHTML =
    eventOrganizerEmail;
  $(".add-to-calendar-btn .addeventatc span.alarm")[0].innerHTML = eventAlarm;
}

function getUtmParameters() {
  // if url contains reamaze --> autocomplete current_helpdesk field if it exist and then and hide it
  if ($('div.hs_demo_current_helpdesk').length && location.href.includes('reamaze') == true) {
    $('select[name=demo_current_helpdesk]').val('Reamaze').change();
    $('div.hs_demo_current_helpdesk').addClass('hidden');
  }

  // get utm and timzezone data to autocomplete hidden fields
  var utmCampaign = sessionStorage.getItem('utm_campaign_session') || '';
  var utmSourceParam = sessionStorage.getItem('utm_source_session') || '';
  var utmMediumParam = sessionStorage.getItem('utm_medium_session') || '';
  var demoUtmTerm = sessionStorage.getItem('demo_utm_term_session') || '';
  var demoUtmTerm = sessionStorage.getItem('demo_utm_term_session') || '';
  var demoTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

  if (demoTimezone.length > 0) {
    $('input[name=demo_timezone]').val(demoTimezone).change();
  } else {
    $('input[name=demo_timezone]').val('').change();
  }

  if (utmCampaign.length > 0) {
    $('input[name=demo_utm_campaign]').val(utmCampaign).change();
  } else {
    $('input[name=demo_utm_campaign]').val('').change();
  }

  if (utmSourceParam.length > 0) {
    $('input[name=demo_utm_source]').val(utmSourceParam).change();
  } else {
    $('input[name=demo_utm_source]').val('').change();
  }

  if (utmMediumParam.length > 0) {
    $('input[name=demo_utm_medium]').val(utmMediumParam).change();
  } else {
    $('input[name=demo_utm_medium]').val('').change();
  }

  if (demoUtmTerm.length > 0) {
    $('input[name=demo_utm_term]').val(demoUtmTerm).change();
  } else {
    $('input[name=demo_utm_term]').val('').change();
  }
}

function chiliPaperSubmit(chilipaperFormId) {
  ChiliPiper.submit("gorgias", "inbound-router", {
    formId: chilipaperFormId,
    domElement: "#wrapper-chilipiper-embed",
    // lead's submission has been received by Chili Piper and a routing attempt has been made, whether successful or not
    onRouted: function() {
      analytics.track("cp_demo_request_routed");
    },
    // successful booking
    onSuccess: function(data) {
      analytics.track("cp_demo_booked");
      //displayAddCalendarBtn(data);
    },
    // lead is submitted but does not match any queue rules and cannot be routed, thus no calendar is displayed. This is usually when someone is disqualified from booking
    onError: function() {
      analytics.track("cp_demo_request_failed");
    },
    // onClose: function () { console.log("onCloseChiliPiper") }, // This will call a function when a lead is submitted and is displayed the option to book (meaning the lead has qualified for a meeting), but exits the booking module.
    injectRootCss: true,
  });
}

// specific functionality for new demo form

window.addEventListener("message", (event) => {
  // get all html elements that need changing
  const anim = document.getElementsByClassName("demo_video-wrapper")[0];
  const progress = document.getElementsByClassName(
    "new-signup_form-progress-innerbar"
  )[0];
  const demoWrapper = document.getElementsByClassName("demo_step-wrapper")[0];
  const progressWrapper = document.getElementsByClassName(
    "new-signup_form-progress-bar"
  )[0];
  const title1 = document.getElementsByClassName("new-demo_form-title")[0];
  const title2 = document.getElementsByClassName("new-demo_form-title")[1];

  // when the form is ready we modify titles
  if (event.data.eventName === "onFormReady" && event.data.id === "6dd387bc-abfa-42cd-ba76-73aa3575b6f8") {
    document.getElementsByClassName("new-demo-form-component newdemo")[0].style.maxWidth = "100%";
    title1.innerHTML = "Tell us about yourself";
    title2.style.display = "block";
  }
  // if form has on error we hide animation
  if (event.data.eventName === "onFormError" && event.data.id === "6dd387bc-abfa-42cd-ba76-73aa3575b6f8") {
    // in case of errors we hide animation
    anim.style.display = "none";
  }
  // when submitting we scroll top and show animation
  if (event.data.eventName === "onFormSubmit" && event.data.id === "6dd387bc-abfa-42cd-ba76-73aa3575b6f8") {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // when submitting form we hide progress elements
    // and we display animation
    demoWrapper.style.display = "none";
    progressWrapper.style.display = "none";
    anim.style.display = "block";
    document.getElementsByClassName(
      "new-demo-form-component"
    )[0].style.display = "none";
  }
  // when loading chilipaper iframe we hide animation, fill progress bar, change titles fonts
  if (event.data.action === "SetIframeSize") {
    document.getElementsByClassName(
      "new-demo-form-component"
    )[0].style.display = "block";
    // when iframe loads we make progress bar full width
    // and also we hide animation
    demoWrapper.style.display = "flex";
    progressWrapper.style.display = "block";
    progress.style.width = "100%";
    anim.style.display = "none";
    document.getElementById("loadImg").style.display = "none";
    title1.style.fontWeight = "400";
    title2.style.fontWeight = "900";
    progressWrapper.style.marginBottom = "40px";
  }
  // when calendar has loaded - some css fixes
  if (event.data.action === "availability-loaded") {
    title2.style.fontWeight = "900";
    if (window.innerWidth < 992) {
      document.getElementsByClassName(
        "demo_content-wrapper"
      )[0].style.overflow = "auto";
      document.getElementsByClassName(
        "demo_logo-form-wrapper"
      )[0].style.overflow = "auto";
      document.getElementById("loadImg").style.display = "none";
    }
  }
})

