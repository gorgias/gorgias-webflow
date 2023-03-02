// Gorgias chat

/* Gorgias Chat Widget Start */ 
var script = document.createElement('script');
var scriptId = 'gorgias-chat-widget-install-v2';
script.setAttribute('src','https://config.gorgias.chat/gorgias-chat-bundle-loader.js?applicationId=24637');
script.setAttribute("type","text/javascript");
script.setAttribute("id",scriptId);
script.async = 1;
$('body')[0].appendChild(script);  
/* Gorgias Chat Widget End */

/* Track chat widget open event */
document.getElementById('gorgias-chat-widget-install-v2').addEventListener("load", function(event) {
    GorgiasChat.init().then(function () {
      GorgiasChat.on('widget:opened', function (data) {
        analytics.track('chat-widget-opened');
      });
   })
});
/* END: Track chat widget open event */
 