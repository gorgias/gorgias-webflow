
//var Webflow = Webflow || [];
//Webflow.push(function () {
const tPath = window.location.pathname;  
const approvedUrlsStage = ['/pages/template-long', '/pages/crm', '/pages/live-chat', '/pages/ticketing-system', '/pages/helpdesk', '/pages/customer-service', '/pages/ticketing-system-long', 
  '/pages/customer-service-long', '/pages/helpdesk-long', '/pages/live-chat-long', '/pages/crm-long']; 
const templatePagesPaths = approvedUrlsStage.includes(tPath);
function estimatePrice(a){
    setTimeout(function() {   
    var planPricing = $(".tabs-plan__pricing .w-tab-pane.w--tab-active .tabs-plan__pricing .w--current .wrapper-flex-right__tab-pane-pricing>.price:not(.discount-old-price)")[0].textContent.replace('$','');
    var planPeriod = $('.tabs-menu__pricing.w-tab-menu>a.w--current')[0].textContent.toLowerCase();
    var planName = $('.tabs-plan__pricing .w-tab-pane.w--tab-active .tabs-plan__pricing .w--current .heading-tab-pane__pricing')[0].textContent.toLowerCase();
        if (templatePagesPaths) {
          planName = $('.tabs-plan__pricing .w-tab-pane.w--tab-active .tabs-plan__pricing .w--current .text24px')[0].textContent.toLowerCase();
        }
    var aaoToggle = $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:first-child .w-checkbox-input")[0].classList.contains('w--redirected-checked');
    var aaoDisplayPrice= $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:first-child .heading-text-content__pricing span")[0].textContent.replace('$','').replace('/mo','').replace('+','');
    var aaoCost = 0;
    var paoToggle = $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(2n) .w-checkbox-input")[0].classList.contains('w--redirected-checked');
    var paoSelect = $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(2n) select")[0].value;
    var paoDisplayPrice= $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(2n) .heading-text-content__pricing span")[0].textContent.replace('$','').replace('/mo','').replace('+','');
    var paoCost = 0;
    var saoToggle = $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(3n) .w-checkbox-input")[0].classList.contains('w--redirected-checked');
    var saoSelect = $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(3n) select")[0].value
    var saoDisplayPrice= $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(3n) .heading-text-content__pricing span")[0].textContent.replace('$','').replace('/mo','').replace('+','');
    var saoCost = 0;
    var totalPriceDisplay = planPricing;
    var ctaTextDisplay = $("#wf-form-pricing-form a.button")[0].text;
    var ctaHrefDisplay = $("#wf-form-pricing-form a.button")[0].href;

    // automation
    if(planName =='starter' && planPeriod == 'monthly') {
      aaoCost = 0;
      aaoDisplayPrice = 'Not available'
    }
    else if(planName =='starter' && planPeriod == 'annual') {
      aaoCost = 0;
      aaoDisplayPrice = 'Not available'
    }
    else if(planName =='basic' && planPeriod == 'monthly') {
      aaoCost = 30;
      aaoDisplayPrice = '+$30/mo';
    }
    else if(planName =='basic' && planPeriod == 'annual') {
      aaoCost = 25;
      aaoDisplayPrice = '+$25/mo';
    }
    else if(planName =='pro' && planPeriod == 'monthly') {
      aaoCost = 180;
      aaoDisplayPrice = '+$180/mo';
    }
    else if(planName =='pro' && planPeriod == 'annual') {
      aaoCost = 150;
      aaoDisplayPrice = '+$150/mo';
    }
    else if(planName =='advanced' && planPeriod == 'monthly') {
      aaoCost = 450;
      aaoDisplayPrice = '+$450/mo';
    }
    else if(planName =='advanced' && planPeriod == 'annual') {
      aaoCost = 375;
      aaoDisplayPrice = '+$375/mo';
    }
    else if(planName =='enterprise' && planPeriod == 'monthly') {
      aaoCost = 0;
      aaoDisplayPrice = 'custom';
    }
    else if(planName =='enterprise' && planPeriod == 'annual') {
      aaoCost = 0;
      aaoDisplayPrice = 'custom';
    }
    if(aaoToggle == false) {
      aaoCost = 0;
    }
    if(aaoToggle == true) {
      aaoCost = aaoCost;
      aaoDisplayPrice = aaoDisplayPrice;
    }
    if(paoToggle == true) {
      $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(2n) select").removeClass('hidden');
    }
    if(paoSelect == 1 && planPeriod == 'monthly'){
      paoCost = 30 ;
      paoDisplayPrice = '+$30/mo';
    }
    else if(paoSelect == 1 && planPeriod == 'annual'){
      paoCost = 25 ;
      paoDisplayPrice = '+$25/mo';
    }
    else if(paoSelect == 2  && planPeriod == 'monthly'){
      paoCost = 90 ;
      paoDisplayPrice = '+$90/mo';
    }
    else if(paoSelect == 2 && planPeriod == 'annual'){
      paoCost = 75 ;
      paoDisplayPrice = '+$75/mo';
    }
    else if(paoSelect == 3  && planPeriod == 'monthly'){
      paoCost = 135 ;
      paoDisplayPrice = '+$135/mo';
    }
    else if(paoSelect == 3 && planPeriod == 'annual'){
      paoCost = 113 ;
      paoDisplayPrice = '+$113/mo';
    }
    else if(paoSelect == 4  && planPeriod == 'monthly'){
      paoCost = 175;
      paoDisplayPrice = '+$175/mo';
    }
    else if(paoSelect == 4 && planPeriod == 'annual'){
      paoCost = 146 ;
      paoDisplayPrice = '+$146/mo';
    }
    else if(paoSelect == 5  && planPeriod == 'monthly'){
      paoCost = 250;
      paoDisplayPrice = '+$250/mo';
    }
    else if(paoSelect == 5 && planPeriod == 'annual'){
      paoCost = 208 ;
      paoDisplayPrice = '+$208/mo';
    }
    else if(paoSelect == 6 && planPeriod == 'monthly'){
      paoCost = 400;
      paoDisplayPrice = '+$400/mo' ;
    }
    else if(paoSelect == 6 && planPeriod == 'annual'){
      paoCost = 333 ;
      paoDisplayPrice = '+$333/mo';
    }
    else if(paoSelect == 7){
      paoCost = 0;
      paoDisplayPrice = 'custom' ;
    }
    if(paoToggle == false) {
      if(planPeriod == 'annual'){
        paoCost = 0 ;
        paoDisplayPrice = '+$25/mo';
      }
      if(planPeriod == 'monthly'){
        paoCost = 0 ;
        paoDisplayPrice = '+$30/mo';
      }
      $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(2n) select").val("1").addClass('hidden');
    }
    if(saoToggle == true) {
      $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(3n) select").removeClass('hidden');
    }
    if(saoSelect == 1 && planPeriod == 'monthly'){
      saoCost = 20 ;
      saoDisplayPrice = '+$20/mo';
    }
    if(saoSelect == 1 && planPeriod == 'annual'){
      saoCost =  17;
      saoDisplayPrice = '+$17/mo';
    }
    else if(saoSelect == 2 && planPeriod == 'monthly'){
      saoCost = 60 ;
      saoDisplayPrice = '+$60/mo';
    }
    if(saoSelect == 2 && planPeriod == 'annual'){
      saoCost =  50;
      saoDisplayPrice = '+$50/mo';
    }
    else if(saoSelect == 3 && planPeriod == 'monthly'){
      saoCost = 90 ;
      saoDisplayPrice = '+$90/mo';
    }
    if(saoSelect == 3 && planPeriod == 'annual'){
      saoCost =  75;
      saoDisplayPrice = '+$75/mo';
    }
    else if(saoSelect == 4 && planPeriod == 'monthly'){
      saoCost = 140;
      saoDisplayPrice = '+$140/mo';
    }
    if(saoSelect == 4 && planPeriod == 'annual'){
      saoCost =  117;
      saoDisplayPrice = '+$117/mo';
    }
    else if(saoSelect == 5 && planPeriod == 'monthly'){
      saoCost = 216;
      saoDisplayPrice = '+$216/mo';
    }
    if(saoSelect == 5 && planPeriod == 'annual'){
      saoCost =  180;
      saoDisplayPrice = '+$180/mo';
    }
    else if(saoSelect == 6 && planPeriod == 'monthly'){
      saoCost = 408;
      saoDisplayPrice = '+$408/mo' ;
    }
    if(saoSelect == 6 && planPeriod == 'annual'){
      saoCost =  340;
      saoDisplayPrice = '+$340/mo';
    }
    else if(saoSelect == 7){
      saoCost = 0;
      saoDisplayPrice = 'custom' ;
    }
    if(saoToggle == false) {
      if(planPeriod == 'annual'){
        saoCost = 0 ;
        saoDisplayPrice = '+$17/mo';
      }
      if(planPeriod == 'monthly'){
        saoCost = 0 ;
        saoDisplayPrice = '+$20/mo';  
      }
      $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(3n) select").val("1").addClass('hidden');
    }
    if(planName =='starter' && planPeriod == 'monthly') {
       saoDisplayPrice = 'Not available';
       paoDisplayPrice = 'Not available';
       aaoDisplayPrice = 'Not available';
       $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(1n) .heading-text-content__pricing span").css("color", "#afafaf");
       Array.from(document.getElementsByClassName('wrapper-master-select__pricing')).forEach(el => el.style['pointer-events'] = 'none')
    } else {
        $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(1n) .heading-text-content__pricing span").css("color", "#1a9970");
        Array.from(document.getElementsByClassName('wrapper-master-select__pricing')).forEach(el => el.style['pointer-events'] = 'auto')
    }
    if( planPeriod =='annual' &&  planName == 'starter') {
      totalPriceDisplay = 'Switch to monthly';
      ctaTextDisplay = 'Start a free trial';
      ctaHrefDisplay = 'https://www.gorgias.com/signup?plan_name='+ planName +'&period=' + planPeriod;;
      $("#wf-form-pricing-form .wrapper-button__pricing .options-block *:nth-child(2)").removeClass('hidden');
      $("#wf-form-pricing-form a.button").addClass("button_disable").prop("href","").html(ctaTextDisplay); 
      $("#wf-form-pricing-form .wrapper-button__pricing .options-block *:nth-child(2)").addClass('hidden');
    }
    else if(
    (saoToggle == true && saoSelect == 7)
    || (paoSelect == 7 && paoToggle == true )
    || planName == 'enterprise'
    ){
    totalPriceDisplay = 'Custom price';
    ctaTextDisplay = 'Contact us';
    ctaHrefDisplay = 'https://www.gorgias.com/demo?plan_name='+ planName +'&period=' + planPeriod;
    $("#wf-form-pricing-form .wrapper-button__pricing .options-block *:nth-child(2)").addClass('hidden');
    $("#wf-form-pricing-form a.button").removeClass("button_disable").prop("href",ctaHrefDisplay).html(ctaTextDisplay);
    $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:first-child .heading-text-content__pricing span").prop("href",ctaHrefDisplay)
    }
    else {
    var totalPrice = Number(planPricing) + Number(aaoCost) + Number(paoCost) + Number(saoCost);
    var parts = totalPrice.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // var totalPrice = Number(parts.join("."));
    totalPriceDisplay =  '$' + totalPrice.toLocaleString("en");
    ctaTextDisplay = 'Start a free trial';
    ctaHrefDisplay = 'https://www.gorgias.com/signup?plan_name='+ planName +'&period=' + planPeriod;
    $("#wf-form-pricing-form .wrapper-button__pricing .options-block *:nth-child(2)").removeClass('hidden');
    $("#wf-form-pricing-form a.button").removeClass("button_disable").prop("href",ctaHrefDisplay).html(ctaTextDisplay);
    $("#wf-form-pricing-form .wrapper-button__pricing .options-block *:nth-child(2)").removeClass('hidden');
    } 
    $('.wrapper-button__pricing .heading-tab-pane__pricing:not(.fixed-bar)').html(totalPriceDisplay);
    $('.wrapper-button__pricing .heading-tab-pane__pricing.fixed-bar').html(planName + ' plan');
    $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(3n) .heading-text-content__pricing span").html(saoDisplayPrice);
    $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:nth-child(2n) .heading-text-content__pricing span").html(paoDisplayPrice);
    $("#wf-form-pricing-form .wrapper-master-checkbox__pricing>*:first-child .heading-text-content__pricing span").html(aaoDisplayPrice);
    },300)
}


$(document).ready(estimatePrice);
$("form[name='wf-form-pricing-form'").change(estimatePrice);
$(".tabs-plan__pricing >a").click(estimatePrice);
$(".tabs-menu__pricing.w-tab-menu>a").click(estimatePrice);
$(".wrapper-flex-right__tab-pane-pricing .link").click(function(){
    var planPeriod = $('.tabs-menu__pricing.w-tab-menu>a.w--current')[0].textContent.toLowerCase();
    var planName = $('.tabs-plan__pricing .w-tab-pane.w--tab-active .tabs-plan__pricing .w--current .heading-tab-pane__pricing')[0].textContent.toLowerCase();
    window.location.href = 'https://www.gorgias.com/demo?plan_name='+ planName +'&period=' + planPeriod;
});

const pricingTabs = document.getElementsByClassName("tab-pane__pricing");
const timeTab = document.getElementsByClassName("text-menu__pricing");

// find if we have selected checkboxes
const checkBoxes = document.getElementsByClassName('w--redirected-checked')
const tabsForTemplates = {
  0: 4,
  1: 5,
  2: 6,
  3: 7,
  4: 0,
  5: 1,
  6: 2,
  7: 3,
}
const tabsForPricing = {
  0: 0,    
  1: 6,
  2: 7,
  3: 8,
  4: 9,
  6: 1,
  7: 2,
  8: 3,
  9: 4,
}

for (let i = 0; i < pricingTabs.length; i++) {
 // Add a click event listener to the element
    pricingTabs[i].addEventListener('click', function () {
      if (!templatePagesPaths && i === 5) {
        timeTab[0].click()
        pricingTabs[0].click()
        document.getElementsByClassName("tab-pane__pricing")[0].click()
      }
      const chooseTabs = templatePagesPaths ? tabsForTemplates : tabsForPricing
      pricingTabs[chooseTabs[i]].click()
      if (checkBoxes.length) {
        Array.from(checkBoxes).forEach(el => {
          el.parentNode.nextElementSibling.nextElementSibling.firstChild.click()
        })
      }
    });
}
const isStarterSelected = pricingTabs[0].classList.contains('w--current')
for (let i = 0; i < timeTab.length; i++) {
  timeTab[i].addEventListener('click', function () {
    if(!templatePagesPaths && i === 1 && isStarterSelected) {
       pricingTabs[6].click()
    }
  })
}
  

// })
