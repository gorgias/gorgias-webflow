// Expose globally for responsive script
window.initAutomate = function (wrapper) {
    const topNavLinks = wrapper.querySelectorAll('.top-nav');
  
    topNavLinks.forEach(link => {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.attributeName === 'class') {
            const subNav = link.closest('.ai-agent_features-nav-top')?.querySelector('.ai-agent_features-subnav');
            if (!subNav) return;
  
            if (link.classList.contains('w--current')) {
              setTimeout(() => {
                subNav.classList.add('is-current');
              }, 50);
            } else {
              subNav.classList.remove('is-current');
            }
          }
        });
      });
  
      observer.observe(link, { attributes: true });
    });
  };


// // Handle the AI agent sticky navigation
// // Select all top-nav elements
// const topNavLinks = document.querySelectorAll('.top-nav');

// // Add event listeners to monitor the class changes
// topNavLinks.forEach((link, index) => {
//     const observer = new MutationObserver(mutations => {
//         mutations.forEach(mutation => {
//             if (mutation.attributeName === 'class') {
//                 const subNav = link.closest('.ai-agent_features-nav-top').querySelector('.ai-agent_features-subnav');
//                 if (link.classList.contains('w--current')) {
//                     // Add staggered delay when adding the is-current class
//                     setTimeout(() => {
//                         subNav.classList.add('is-current');
//                     }, 50); // Adjust the delay (100ms here) per element index
//                 } else {
//                     // Remove is-current immediately
//                         subNav.classList.remove('is-current');
//                 }
//             }
//         });
//     });

//     // Start observing the link for class attribute changes
//     observer.observe(link, { attributes: true });
// });