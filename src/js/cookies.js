
function cookieExpectedPlanName(cookieName){
    if(
        location.href.toLowerCase().indexOf("starter") >= 0
        || location.href.toLowerCase().indexOf("g2") >= 0
        || location.href.toLowerCase().indexOf("app_store") >= 0
    ) {
        setCookie(cookieName, "starter", 90);
    }
}

cookieExpectedPlanName('expected_plan_name');