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
            modal.find('[data-el="blog-search"]').focus(); // Auto-focus input
        }, 100);
    }

    // Function to close the modal
    function closeModal() {
        modal.css("opacity", "0");

        setTimeout(() => {
            modal.css("display", "none");
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