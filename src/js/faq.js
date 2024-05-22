/****************************
 *
 * This script creates links when detected in FAQ section
 *
 ****************************/

document.addEventListener("DOMContentLoaded", () => {
    // Regular expression to match URLs with or without protocols
    const urlPattern =
      /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/g;
  
    // Get all elements with the class 'new-faq_content'
    const faqElements = document.querySelectorAll(".new-faq_content");
  
    faqElements.forEach((element) => {
      // Get the inner HTML of the element
      let content = element.innerHTML;
  
      // Replace the URLs in the content with anchor tags
      const updatedContent = content.replace(urlPattern, (url) => {
        // Ensure the URL starts with http:// or https://
        const href = url.startsWith("http") ? url : `https://${url}`;
        const link = `<a class="faq-link" href="${href}" target="_blank">${url}</a>`;
        return link;
      });
  
      // Update the element's HTML content
      element.innerHTML = updatedContent;
    });
  });
  