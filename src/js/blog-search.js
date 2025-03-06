$(document).ready(function () {
    // Elements
    const searchInput = $('[data-el="blog-search"]');
    const moreResultsLink = $('[data-el="more-results"]');
    const searchWrapper = $('.blog-search_collection-wrapper');
    const searchLink = $('.link-underline');

    const baseUrl = "/blog-search-results"; // Base URL
    let typingTimer;
    const doneTypingInterval = 500; // Delay before updating query params

    // Function to handle typing in search input
    function handleTyping() {
        clearTimeout(typingTimer);

        let queryValue = searchInput.val().trim();

        if (queryValue.length > 0) {
            searchWrapper.removeClass('is-search-disabled').css("opacity", "1");
            searchLink.removeClass('is-search-disabled').css("opacity", "1");
        } else {
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

    // Detect typing in search input
    searchInput.on('input', handleTyping);
});