/* Convert Bundle Start */ 
var scriptBundleConvert = document.createElement('script');
var scriptBundleConvertId = 'convert-bundle-loader';
var scriptBundleConvertSrc = 'https://bundle.dyn-rev.app/loader.js?g_cvt_id=921d1a43-21e9-4795-a845-6ab05e79503f';
var scriptBundleConvertType = 'text/javascript';
scriptBundleConvert.setAttribute("src",scriptBundleConvertSrc);
scriptBundleConvert.setAttribute("type",scriptBundleConvertType);
scriptBundleConvert.setAttribute("id",scriptBundleConvertId);
scriptBundleConvert.async = 1;
$('body')[0].appendChild(scriptBundleConvert);  
/* GorConvert Bundle End */



/* Gorgias Chat Widget Start */ 
var scriptGorgiasChat = document.createElement('script');
var scriptGorgiasChatId = 'gorgias-chat-widget-install-v3';
var scriptGorgiasChatSrc = 'https://config.gorgias.chat/bundle-loader/01J5V1J9ZV18ZCZZZ6ZCFDGFE5';
var scriptGorgiasChatType = 'text/javascript';

scriptGorgiasChat.setAttribute('src',scriptGorgiasChatSrc);
scriptGorgiasChat.setAttribute("type",scriptGorgiasChatType);
scriptGorgiasChat.setAttribute("id",scriptGorgiasChatId);
scriptGorgiasChat.async = 1;
$('body')[0].appendChild(scriptGorgiasChat);  
/* Gorgias Chat Widget End */

/* Track chat widget open event */
document.getElementById(scriptGorgiasChatId).addEventListener("load", function(event) {
    GorgiasChat.init().then(function () {
      GorgiasChat.on('widget:opened', function (data) {
        analytics.track('chat-widget-opened');
      });
   })
});
/* END: Track chat widget open event */

// Use this script to customize the chat button.
var initGorgiasChatPromise = (window.GorgiasChat) ? window.GorgiasChat.init() : new Promise(function (resolve) {
  window.addEventListener('gorgias-widget-loaded', function () { resolve();})
});

initGorgiasChatPromise.then(async () => {
  GorgiasChat.disableAttachments()
})

/*
// personnalize chat
window.addEventListener('gorgias-widget-loaded', function (){
    
    var timer = setTimeout(function () {

      //Create a Zoom in effect on imag click within the chat
      var image = document.querySelector("#chat-campaigns").contentDocument.body.querySelector(".message-container img");
      image.classList.toggle("zoomable-image");
      image.setAttribute("style","opacity: 1; display: block; width: 100%; height: auto; transition: .5s ease;backface-visibility: hidden;");
      var figure = document.querySelector("#chat-campaigns").contentDocument.body.querySelector(".message-container figure");
      figure.setAttribute("style","position:relative;width:100%;")

      var middleDiv = document.createElement('div');
      middleDiv.setAttribute("class","middle")
      middleDiv.setAttribute("style"," opacity: 0;cursor:pointer;transition: .5s ease;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);text-align: center;")
      $(figure)[0].appendChild(middleDiv);
    

      // create and display the CTA for hover effect on the image within the chat
      var middleDivCTA = document.createElement('div');
      middleDivCTA.setAttribute("class","middleCTA")
      middleDivCTA.setAttribute("style","color: #fff;background-color: #161616;border: 2px solid #161616;border-radius: 5px;justify-content: center;align-items: center;padding: 13px 20px 14px;font-size: 12px;font-weight: 400;line-height: 24px;")
      middleDivCTA.innerHTML = "Zoom in 🔎";
      $(middleDiv)[0].appendChild(middleDivCTA);

      // when hover on an image within the chat
      figure.addEventListener("mouseover",function(e){
        var image = this.querySelector("img");
        var middle = this.querySelector(".middle");

        image.setAttribute("style","opacity: 0.3; display: block; width: 100%; height: auto; transition: .5s ease;backface-visibility: hidden;");
        middleDiv.setAttribute("style"," opacity: 1;cursor:pointer;transition: .5s ease;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);text-align: center;")

      })

      // when hover out on an image within the chat
      figure.addEventListener("mouseout",function(e){
        var image = this.querySelector("img");
        var middle = this.querySelector(".middle");
        image.setAttribute("style","opacity: 1; display: block; width: 100%; height: auto; transition: .5s ease;backface-visibility: hidden;");
        middleDiv.setAttribute("style"," opacity: 0;cursor:pointer;transition: .5s ease;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);text-align: center;")

      })
      
      // when click on the image within the chat
      figure.addEventListener("click",function(e){
              var image = this.querySelector("img");
              const element2 = document.querySelector("div.wrapper-chat-imagezoom");
              // if the zoomed image has not been displayed
              if(!element2){

                // let's display the zoomed image
                var imgWrapper = document.createElement('div')
                imgWrapper.setAttribute("class","wrapper-chat-imagezoom");
                imgWrapper.setAttribute("style","padding-top:100px;position: absolute;z-index: 2147483010;top: 0px;width: 100%;background-color: rgba(0,0,0,0.5);height: 100%;")
                $("body")[0].appendChild(imgWrapper);

                //  this will prevent being able to scroll while the modal is open
                $("body").css("height", "100vh");
                $("body").css("overflow-y", "hidden");

                var img = document.createElement('img');
                img.src = image.src;
                img.setAttribute("class","chatImageZoom");
                img.setAttribute("style","max-width: 41vw;max-height: 85vh;display: block;margin: auto;")
                $(imgWrapper)[0].appendChild(img);
              }
              else{
                // if the image already exist, let's just remove the hidden class
                imgWrapper.classList.remove("hidden");

              }
              // to cloe the modal, just click on the wrapper
              [ imgWrapper].forEach(function(element) {
                element.addEventListener("click", function(e) {
                  if (e.target !== this){ return };
                  imgWrapper.setAttribute("class","hidden");
                  $("body").css("height", "inherit");
                  $("body").css("overflow-y", "");
                });
            });
      });

      // personalize links
      var cta = document.querySelector("#chat-campaigns").contentDocument.body.querySelector(".message-container a");
      cta.setAttribute("style","text-align:center;display:block;margin-top:16px;text-decoration:none;color: #fff;background-color: #161616;border: 2px solid #161616;border-radius: 5px;justify-content: center;align-items: center;padding: 13px 20px 14px;font-size: 12px;font-weight: 400;line-height: 24px;")

      image.click();

    }, 1300);

})

*/