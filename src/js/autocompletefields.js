function autoCompleteInputsForms(){
    // List of inputs to autocomplete
    
    if (sessionStorage.email) {
        if(location.pathname == '/tools/roi-support/result' ) {
            $("input#roi_support_calculator___share_results_email-3fb61a16-5c15-491f-b643-ba37988f9f8e").val(sessionStorage.email).change();
        }
        else{
            $("input[name|='email']").val(sessionStorage.email).change();
        }
    }

    if (sessionStorage.first_name || sessionStorage.last_name) {
        $("input[name|='name']").val([sessionStorage.first_name, sessionStorage.last_name].join(" "))
    }
    else if (sessionStorage.name) {
        $("input[name|='name']").val(sessionStorage.name).change();
    }

    if (sessionStorage.domain && sessionStorage.domain.length > 0 ) {
        if($("input[name|='company_domain']").length>0){
            $("input[name|='company_domain']").val(sessionStorage.domain).change();
            //$("input[name|='company_domain']").hide();
        }

        if($("input[name|='0-2/domain']").length>0){
            $("input[name|='0-2/domain']").val(sessionStorage.domain).change();
            //$("input[name|='0-2/domain']").hide();
        }
    }

    if (sessionStorage.company_domain && sessionStorage.company_domain.length > 0 ) {
        if($("input[name|='company_domain']").length>0){
            $("input[name|='company_domain']").val(sessionStorage.company_domain).change();
            //$("input[name|='company_domain']").hide();
        }

        if($("input[name|='0-2/domain']").length>0){
            $("input[name|='0-2/domain']").val(sessionStorage.company_domain).change();
            //$("input[name|='0-2/domain']").hide();
        }
    }

    if(sessionStorage.gorgias_subdomain){
        if ($("input[name|='account_domain']").length>0) {
            $("input[name|='account_domain']").val(sessionStorage.gorgias_subdomain).change();
            $("input[name|='account_domain']").hide();
        }
    }

    if (sessionStorage.phone) {
        $("input[name|='phone']").val(sessionStorage.phone).change();
        $("input[type|='tel']").val(sessionStorage.phone).change();
    }
    if (sessionStorage.number_of_agents) {
        $("input[name|='number_of_agents']").val(sessionStorage.number_of_agents).change();
    }

    if (sessionStorage.getItem("product_interest")) {
        var productInterests = JSON.parse(sessionStorage.getItem("product_interest"));
        var productInterestMap = {
            'convert': 'convert',
            'automate': 'automate',
            'helpdesk': 'helpdesk'
        };
        
        for (var i = 0; i < productInterests.length; i++) {
            var interest = productInterests[i].trim();
        
            if (productInterestMap.hasOwnProperty(interest)) {
                if(document.querySelector('div[class*=demo-form] form input[name=demo_product_interest][value=' + productInterestMap[interest] + ']')){
                    document.querySelector('div[class*=demo-form] form input[name=demo_product_interest][value=' + productInterestMap[interest] + ']').click();
            
                }
            }
        }
    }


    if (sessionStorage.about_us && sessionStorage.about_us.length > 0) { 
        if($("select[name|='about_us']").length>0 ){
            $("select[name|='about_us']").val(sessionStorage.about_us).change();
            $('div[input-container="about_us"]').hide();
        }
        if($("select[name|='0-2/source_form']").length>0){
            $("select[name|='0-2/source_form']").val(sessionStorage.about_us).change();
            $("select[name|='0-2/source_form']").hide();
        }
    }
    if (sessionStorage.ecommerce_platform) {

        // For select input, let's do a map between string and value
        var ecommercePlateformSelect = new Map()
        .set('Shopify', 'shopify')
        .set('magento_2', 'Magento 2')
        .set('salesforce_commerce_cloud', 'Salesforce commerce cloud')
        .set('bigcommerce', 'Bigcommerce')
        .set('woocommerce', 'WooCommerce')
        .set('other', 'Other')
        if($("select[name*='ecommerce_platform']").length>0){
            $("select[name*='ecommerce_platform']").val(sessionStorage.ecommerce_platform).change();
        }
    }


}

window.addEventListener('message', event => {
    if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
        autoCompleteInputsForms();
    }
});