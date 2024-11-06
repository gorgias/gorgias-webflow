$(document).ready(function () {
    // Base salary as a starting value
    const baseSalary = 65000;

    // Function to format number with commas
    function formatNumberWithCommas(number) {
        console.log("Formatting number:", number); // Log before formatting
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Function to calculate salary based on selected options
    function calculateSalary() {
        // Retrieve the selected values from each dropdown
        const locationMultiple = parseFloat($('[data-el="location"]').val());
        const experienceMultiple = parseFloat($('[data-el="experience"]').val());
        const teamMultiple = parseFloat($('[data-el="size"]').val());
        const roleMultiple = parseFloat($('[data-el="role"]').val());

        // Log the selected values to help debug
        console.log("Location Multiple:", locationMultiple);
        console.log("Experience Multiple:", experienceMultiple);
        console.log("Team Size Multiple:", teamMultiple);
        console.log("Role Multiple:", roleMultiple);

        // Check that all options have been selected
        if (isNaN(locationMultiple) || isNaN(experienceMultiple) || isNaN(teamMultiple) || isNaN(roleMultiple)) {
            console.log("One or more selections are missing.");
            $('#salary-amount').text("Please select all options to calculate the salary.");
            return;
        }

        // Calculate the estimated yearly salary by applying all modifiers to the base salary
        const estimatedSalary = baseSalary * locationMultiple * experienceMultiple * teamMultiple * roleMultiple;
        console.log("Calculated Estimated Salary:", estimatedSalary);

        // Display the calculated salary, formatted to include commas
        const formattedSalary = formatNumberWithCommas(Math.round(estimatedSalary));
        console.log("Formatted Estimated Salary:", formattedSalary); // Log formatted result
        $('#salary-amount').text(`Estimated Yearly Salary: $${formattedSalary}`);
    }

    // Trigger calculation each time a dropdown selection is changed
    $('[data-el="location"], [data-el="experience"], [data-el="size"], [data-el="role"]').on('change', calculateSalary);

    // Initial calculation if default selections are made in dropdowns
    calculateSalary();
});