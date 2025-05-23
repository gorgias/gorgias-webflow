if (path === '/v/demo' || path === '/demo-2') {
  $('.demo-form-hubspot-cp').hide();
  window.addEventListener("message", function(event) {
      if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady' && event.data.id === "ef92ccce-92bd-4010-847a-793f56b6b353") {
          if($('div[class*=demo-form-hubspot] .hs-company_domain input').val() != ''){
              $('.demo-form-hubspot-cp').fadeIn(500);
          }
          else{
              $('div[class*=demo-form-hubspot] .hs-number_of_agents, div[class*=demo-form-hubspot] .hs-phone, div[class*=demo-form-hubspot] .hs-demo_ecommerce_platform, div[class*=demo-form-hubspot] .hs-demo_product_interest').hide( function (){
                  $('.demo-form-hubspot-cp').fadeIn(500);
              })
          }

      }

      $('div[class*=demo-form-hubspot] .hs-company_domain input').on('input', function() {
          var companyDomain = $(this).val();
          var domainPattern = /^(?:https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(?:\/.*)?$/;
          if (companyDomain != '' && domainPattern.test(companyDomain)) {
              setTimeout(function() {
                  $('div[class*=demo-form-hubspot] .hs-number_of_agents, div[class*=demo-form-hubspot] .hs-phone, div[class*=demo-form-hubspot] .hs-demo_ecommerce_platform, div[class*=demo-form-hubspot] .hs-demo_product_interest').fadeIn(1000);
              }, 250)
          }
      });

  });
}