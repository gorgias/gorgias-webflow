const getStartedFormId = 'a8a43852-67b4-4e38-92f8-612782939945';

let refUrlParams = '';
let refPositionUrlParams = '';
let currentPath = window.location.pathname;
let currentSearch = window.location.search;

// Get URL parameters from the clicked link of Get Started CTA and store them in variables for later use
document.querySelectorAll('a[cta*="get-started"]').forEach(anchor => {
    anchor.addEventListener('click', (event) => {
        event.preventDefault();
        var urlParams = new URL(event.target.href).searchParams;

        refPositionUrlParams = urlParams.get('ref-position');
        refUrlParams = urlParams.get('ref');
    });
});


// Listen for the form submission event of Get Started form and redirect to the appropriate page based on the number of agents
window.addEventListener("message", (event) => {
    let { type, eventName, id, data } = event.data;
    let signupPath = '/signup-2';
    let demoPath = '/demo';

    // check the form submitted is get started form
    if (type === 'hsFormCallback' && eventName === 'onFormSubmitted' && id === getStartedFormId) {
        let submittedValues = data.submissionValues;

        // Update paths with URL parameters from the clicked link of Get Started CTA
        if (refUrlParams) {
            demoPath += demoPath.includes('?') ? `&ref=${refUrlParams}` : `?ref=${refUrlParams}`;
            signupPath += signupPath.includes('?') ? `&ref=${refUrlParams}` : `?ref=${refUrlParams}`;
        }

        if (refPositionUrlParams) {
            demoPath += demoPath.includes('?') ? `&ref-position=${refPositionUrlParams}` : `?ref-position=${refPositionUrlParams}`;
            signupPath += signupPath.includes('?') ? `&ref-position=${refPositionUrlParams}` : `?ref-position=${refPositionUrlParams}`;
        }


        // Append field values to an array
        Object.keys(submittedValues).forEach(key => {
            if (Array.isArray(submittedValues[key])) {
                submittedValues[key] = submittedValues[key].join(';');
            }
        });
        // Get the number of agents from the form submission 
        let numberOfAgents = Number(submittedValues['number_of_agents']);
        // Redirect to the appropriate page based on the number of agents 
        if (!isNaN(numberOfAgents)) {
            window.location = numberOfAgents > 1 ?  demoPath: signupPath;

        }
    }
});

// Animation to show modal on get started cta click
$("[data-el='get-started-cta']").click(function() {
    // Show the component and wrapper first
    $(".get-starter_component").removeClass('is-hidden');
    $(".get-started_wrapper").removeClass("is-hidden");
  
    console.log("get started component and wrapper displayed");
  
    // After a delay, show the form
    setTimeout(function() {
      $(".get-started-form").removeClass("is-hidden");
      console.log("get started form displayed");
    }, 100);
  });
  
  // Use event delegation to handle dynamically added elements
  $(document).on('click', '#closeGetStartedModal', function() {
    // First, hide the form
    console.log("closing get started form");
    $(".get-started-form").addClass("is-hidden");
  
    // After a delay, hide the wrapper and component
    setTimeout(function() {
      $(".get-started_wrapper").addClass("is-hidden");
      $(".get-starter_component").addClass("is-hidden");
      console.log("get started component and wrapper hidden");
    }, 700);  // Adjust the delay to sync with the form hide animation
  });



// Personalize the demo page for visitors coming from Get Started form by hidding default text and displaying specific one
// Check if the current path is /demo and the ref parameter contains "get-started"
if (currentPath === '/demo') {
    if (currentSearch.includes('get-started')) {   
        $('.demo-from-getstarted').removeClass('is-hidden');
        $('.demo-new_container').addClass('is-hidden');
        $('.demo-new_container').style.display = 'none !important';

    }
}