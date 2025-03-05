$(document).ready(function () {
    // Elements
    const modalTrigger = $('[data-el="modal-trigger"]');
    const modal = $('[data-el="modal"]');
    const modalTriggerClose = $('[data-el="modal-close"]');
    const searchInput = $('[data-el="blog-search"]');
    const moreResultsLink = $('[data-el="more-results"]');
    const searchWrapper = $('.blog-search_collection-wrapper');
    const searchLink = $('.link-underline');

    const baseUrl = "/blog-search-results"; // Base URL


    let typingTimer;
    const doneTypingInterval = 500; // Delay before updating query params

    // Function to open the modal
    function openModal() {
        modal.css({ "display": "flex", "opacity": "0" });

        setTimeout(() => {
            modal.css("opacity", "1");
            searchInput.focus(); // Auto-focus the input when modal opens
        }, 100);
    }

    // Function to close the modal
    function closeModal() {
        modal.css("opacity", "0");

        setTimeout(() => {
            modal.css("display", "none");
        }, 300);
    }

    // Function to handle typing in search input
    function handleTyping() {
        clearTimeout(typingTimer);
        
        let queryValue = searchInput.val().trim();

        if (queryValue.length > 0) {
            // Remove "is-search-disabled" and set opacity to 1
            searchWrapper.removeClass('is-search-disabled').css("opacity", "1");
            searchLink.removeClass('is-search-disabled').css("opacity", "1");
        } else {
            // If input is empty, revert to initial state
            searchWrapper.css("opacity", "0").addClass('is-search-disabled');
            searchLink.css("opacity", "0").addClass('is-search-disabled');
        }

        typingTimer = setTimeout(() => {
            let queryParams = window.location.search; // Get updated query params

            if (queryParams) {
                updateMoreResultsLink(queryParams);
            }
        }, doneTypingInterval);
    }

    // Function to update "More Results" link with query parameters
    function updateMoreResultsLink(queryParams) {
        moreResultsLink.attr("href", baseUrl + queryParams);
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

    // Detect typing in search input
    searchInput.on('input', handleTyping);
});