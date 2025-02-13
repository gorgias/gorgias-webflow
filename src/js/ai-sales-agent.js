window.Webflow ||= [];
window.Webflow.push(() => {
  if (window.innerWidth >= 991) {
    console.log("✅ Animation script initialized");

    // Ensure the scrollbar exists
    if ($('.ai-conv_menu-scrollbar').length === 0) {
      $('.ai-conv_tabs-menu').append('<div class="ai-conv_menu-scrollbar"></div>');
  }

  function updateScrollbarPosition() {
      const tabs = $(".ai-conv_tabs-link");
      const activeTab = $(".ai-conv_tabs-link.w--current");
      const scrollbar = $(".ai-conv_menu-scrollbar");

      if (activeTab.length === 0 || tabs.length !== 4) {
          console.warn("🚨 Could not find .w--current or unexpected number of tabs!");
          return;
      }

      // Get active tab index
      const activeIndex = tabs.index(activeTab);
      const topPosition = `${activeIndex * 25}%`; // First tab = 0%, Second = 25%, etc.

      console.log(`🟢 Active tab index: ${activeIndex}, Setting scrollbar top to: ${topPosition}`);

      // Apply position
      scrollbar.css({ top: topPosition });
  }

  // Run initially on page load
  updateScrollbarPosition();

  // Observe changes in .w--current class
  const observer = new MutationObserver(() => {
      console.log("🔄 Detected class change, updating scrollbar...");
      updateScrollbarPosition();
  });

  $(".ai-conv_tabs-link").each(function () {
      observer.observe(this, { attributes: true, attributeFilter: ["class"] });
  });

  setTimeout(() => {
    $(".tabs_trigger").each(function (index) {
      console.log(`Initializing ScrollTrigger for .tabs_trigger index: ${index}`);
    
      ScrollTrigger.create({
        trigger: $(this),
        start: "top center",
        end: "+=0",
        markers: false, // Set to true to visualize trigger points
        onEnter: () => {
          console.log(`onEnter triggered for index: ${index}`);
          console.log(`Clicking .ai-conv_tabs-link index: ${index + 1}`);
          $(".ai-conv_tabs-link").eq(index + 1).click();
        },
        onEnterBack: () => {
          console.log(`onEnterBack triggered for index: ${index}`);
          console.log(`Clicking .ai-conv_tabs-link index: ${index}`);
          $(".ai-conv_tabs-link").eq(index).click();
        },
      });
    });
  }, 10000);

  }
});