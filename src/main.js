import estimatePrice from './js/pricing'
// test new branch



var Webflow = Webflow || [];
Webflow.push(function () {

    var path = location.path;
    if(path == '/pricing'){
        
        $(document).ready(estimatePrice);
        $("form[name='wf-form-pricing-form'").change(estimatePrice);
        $(".tabs-plan__pricing >a").click(estimatePrice);
        $(".tabs-menu__pricing.w-tab-menu>a").click(estimatePrice);

        $(".wrapper-flex-right__tab-pane-pricing .link").click(function(){
            var planPeriod = $('.tabs-menu__pricing.w-tab-menu>a.w--current')[0].textContent.toLowerCase();
            var planName = $('.tabs-plan__pricing .w-tab-pane.w--tab-active .tabs-plan__pricing .w--current .heading-tab-pane__pricing')[0].textContent.toLowerCase();
            window.location.href = 'https://www.gorgias.com/demo?plan_name='+ planName +'&period=' + planPeriod;
        });
    }

})
