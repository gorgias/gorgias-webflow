// Function to update the width of elements with data-value
function updateElementWidths() {
    $('[data-value]').each(function() {
      // Get the value of the data-value attribute
      let value = $(this).data('value');
      
      // Perform different calculations based on the value
      if (value < 5) {
        // Example calculation for values less than 5: multiply by 20 to match a percentage
        value = value * 20;
      } else if (value >= 5) {
        // Example calculation for values more than or equal to 5: multiply by 10 to match a percentage
        value = value * 10;
      }
      
      // Set the width of the element to the calculated value + '%'
      $(this).css('width', value + '%');
    });
  }
  
  // Create an IntersectionObserver to watch when #num-values is fully in view
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Execute the function when #num-values is fully in view
        updateElementWidths();
        // Unobserve once the action has been performed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 1.0 // Ensures the callback is triggered when #num-values is fully in view
  });
  
  // Start observing the #num-values section
  observer.observe(document.querySelector('#num-values'));


  /* SCROLL SNAP FUNCTIONALITY */

  document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.why-gorgias_content'); // The scrollable container
    const textElements = document.querySelectorAll('.why-gorgias_text'); // The elements to track

    // Function to check if the top and bottom of the element match the container's top and bottom
    function checkAlignment(element, container) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Check if the element's top is aligned with the container's top and its bottom with the container's bottom
        const topAligned = Math.abs(elementRect.top - containerRect.top) <= 1; // Tolerance of 1px for alignment
        const bottomAligned = Math.abs(elementRect.bottom - containerRect.bottom) <= 1;

        return topAligned && bottomAligned;
    }

    // Function to handle the scroll event
    function handleScroll() {
        textElements.forEach((textElement) => {
            if (checkAlignment(textElement, container)) {
                // If the element is aligned with the container's top and bottom
                textElement.classList.add('is-active');
            } else {
                textElement.classList.remove('is-active');
            }
        });
    }

    // Attach the scroll event listener to the container
    container.addEventListener('scroll', handleScroll);

    // Check alignment on page load as well
    handleScroll();
});