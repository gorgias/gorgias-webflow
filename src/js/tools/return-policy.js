window.addEventListener("message", function (event) {
    // Check if the form is ready
    if (event.data.type === "hsFormCallback" && event.data.eventName === "onFormReady") {
        console.log("HubSpot form is ready.");

        // Add click event listener to the submit button
        $('.hs-button').on('click', function () {
            console.log('Submit button clicked');
            
            // Show the template-policy element
            const templatePolicyElement = $('#template-policy');
            const toolsFormBlockElement = $('.tools_form-block');
            
            if (templatePolicyElement.length > 0) {
                templatePolicyElement.css('display', 'block');
                console.log('template-policy element displayed');
            } else {
                console.warn('#template-policy not found');
            }

            // Hide the tools_form-block element
            if (toolsFormBlockElement.length > 0) {
                toolsFormBlockElement.css('display', 'none');
                console.log('tools_form-block element hidden');
            } else {
                console.warn('.tools_form-block not found');
            }
        });
    }
});