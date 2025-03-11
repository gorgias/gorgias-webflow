$(document).ready(function () {
    // Elements
    const modalTrigger = $('[data-el="modal-trigger"]');
    const modal = $('[data-el="modal"]');
    const modalTriggerClose = $('[data-el="modal-close"]');

    // Function to open the modal
    function openModal() {
        modal.css({ "display": "flex", "opacity": "0" });

        setTimeout(() => {
            modal.css("opacity", "1");
            const blogSearchInput = modal.find('[data-el="blog-search"]');
            if (blogSearchInput.length) {
                blogSearchInput.focus(); // Auto-focus input if it exists
            }
            $('body').css('overflow', 'hidden');
        }, 100);
    }

    function closeModal() {
        console.log("Closing modal...");
    
        modal.css("opacity", "0");
    
        setTimeout(() => {
            modal.css("display", "none");
            $('body').css('overflow', 'visible');
            console.log("Modal hidden, resetting overflow.");
    
            // Stop all <audio> and <video> elements
            modal.find("audio, video").each(function () {
                console.log("Stopping media element:", this);
                this.pause();
                this.currentTime = 0; // Reset playback position
            });
    
            // Stop YouTube videos by resetting src
            modal.find("iframe[src*='youtube.com']").each(function () {
                console.log("Resetting YouTube iframe:", this);
                let originalSrc = $(this).attr("src");
                $(this).attr("src", ""); // Clear src to stop video
                setTimeout(() => {
                    $(this).attr("src", originalSrc); // Restore src
                }, 100);
            });
    
            // Stop Wistia videos (via Embedly) by resetting src
            modal.find("iframe[src*='cdn.embedly.com']").each(function () {
                console.log("Resetting Wistia Embedly iframe:", this);
                let originalSrc = $(this).attr("src");
                $(this).attr("src", ""); // Clear src
                setTimeout(() => {
                    $(this).attr("src", originalSrc); // Restore src
                }, 100);
            });
    
        }, 300);
    }

    // Event Listeners
    modalTrigger.on("click", openModal);
    modalTriggerClose.on("click", closeModal);

    // Close modal when clicking outside it
    modal.on("click", function (event) {
        if ($(event.target).is(modal)) closeModal();
    });

    // Close modal on Escape key press
    $(document).on("keydown", function (event) {
        if (event.key === "Escape" || event.keyCode === 27) {
            closeModal();
        }
    });

    // Expose modal functions globally
    window.Modal = {
        open: openModal,
        close: closeModal,
    };
});