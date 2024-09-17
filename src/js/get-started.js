const getStartedFormId = 'a8a43852-67b4-4e38-92f8-612782939945';
const signupPath = '/signup-2';
const demoPath = '/demo';

// Form submitted event listener
window.addEventListener("message", (event) => {
    let { type, eventName, id, data } = event.data;
    // check the form submitted is get started form
    if (type === 'hsFormCallback' && eventName === 'onFormSubmitted' && id === getStartedFormId) {
        let submittedValues = data.submissionValues;

        // Append field values to an arry
        Object.keys(submittedValues).forEach(key => {
            if (Array.isArray(submittedValues[key])) {
                submittedValues[key] = submittedValues[key].join(';');
            }
        });
        // store the values in a variable as number    
        let numberOfAgents = Number(submittedValues['number_of_agents']);
        console.log('numberOfAgents:', numberOfAgents);
        // check if the value is a number and not empty
        if (!isNaN(numberOfAgents)) {
            window.location = numberOfAgents > 1 ?  demoPath: signupPath;
        }
    }
});