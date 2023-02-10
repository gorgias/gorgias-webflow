function autoCompleteInputsForms(){
    // List of inputs to autocomplete
    if (sessionStorage.email) {
        if(location.pathname == '/tools/roi-support/result' ) {
            $("input#roi_support_calculator___share_results_email-3fb61a16-5c15-491f-b643-ba37988f9f8e").val(sessionStorage.email);
        }
        else{
            $("input[name|='email']").val(sessionStorage.email);
        }
    }

    if (sessionStorage.first_name || sessionStorage.last_name) {
        $("input[name|='name']").val([sessionStorage.first_name, sessionStorage.last_name].join(" "))
    }
    else if (sessionStorage.name) {
        $("input[name|='name']").val(sessionStorage.name)
    }

    if (sessionStorage.domain && sessionStorage.domain.length > 0 ) {
        if($("input[name|='company_domain']").length>0){
            $("input[name|='company_domain']").val(sessionStorage.domain);
            $("input[name|='company_domain']").hide();
        }

        if($("input[name|='0-2/domain']").length>0){
            $("input[name|='0-2/domain']").val(sessionStorage.domain);
            $("input[name|='0-2/domain']").hide();
        }
    }
    if(sessionStorage.gorgias_subdomain){
        if ($("input[name|='account_domain']").length>0) {
            $("input[name|='account_domain']").val(sessionStorage.gorgias_subdomain);
            $("input[name|='account_domain']").hide();
        }
    }

    if (sessionStorage.phone) {
        $("input[name|='phone']").val(sessionStorage.phone)
    }
    if (sessionStorage.about_us && sessionStorage.about_us.length > 0) { 
        if($("select[name|='about_us']").length>0 ){
            $("select[name|='about_us']").val(sessionStorage.about_us);
            $('div[input-container="about_us"]').hide();
        }
        if($("select[name|='0-2/source_form']").length>0){
            $("select[name|='0-2/source_form']").val(sessionStorage.about_us);
            $("select[name|='0-2/source_form']").hide();
        }
    }
    if (sessionStorage.ecommerce_platform) {
        // For select input, let's do a map between string and value
        var ecommercePlateformSelect = new Map()
        .set('shopify', '1')
        .set('shopify plus', '2')
        .set('shopify_plus', '2')
        .set('bigcommerce', '6')
        .set('magento', '3')
        .set('magento_2', '3')
        .set('woocommerce', '4')
        .set('other', '5')
        .set('6', '6')

        $("select[name|='ecommerce_platform']").val(ecommercePlateformSelect.get(sessionStorage.ecommerce_platform))
        if($("select[name|='ecommerce_platform']").val().length > 0){
            $('div[input-container="ecommerce_platform"]').hide();
        }
    }
}

autoCompleteInputsForms();