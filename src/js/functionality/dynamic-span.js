
document.addEventListener('DOMContentLoaded', function() {
  // Select all h1, h2, h3, h4, h5, and h6 elements
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  // Iterate over each heading element
  headings.forEach(function(heading) {
    // Get the heading content
    const headingContent = heading.innerHTML;

    // Replace the marker (e.g., '%%') with a span with the 'text-color-green' class
    const wrappedContent = headingContent.replace(/%%(.*?)%%/gi, function(_, match) {
      return `<span class="soft-text">${match}</span>`;
    });

    // Replace the original content with the wrapped content
    heading.innerHTML = wrappedContent;
  });
});
