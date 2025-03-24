(function () {
    const scriptPaths = ['accordion.min.js', 'automate.min.js'];
    let resizeTimeout = null;
  
    function reloadScripts() {
      scriptPaths.forEach(filename => {
        // Remove existing script if it exists
        const existing = Array.from(document.querySelectorAll('script')).find(script =>
          script.src.includes(filename)
        );
        if (existing) existing.remove();
  
        // Re-inject the script (browser will use cached version)
        const script = document.createElement('script');
        script.src = `/path/to/${filename}`; // Replace with actual path if needed
        script.async = true;
        document.body.appendChild(script);
      });
    }
  
    // Debounced resize handler
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        reloadScripts();
      }, 300);
    });
  
    // Optional: run once on load
    reloadScripts();
  })();