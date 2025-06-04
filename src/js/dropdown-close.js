var Webflow = Webflow || [];
Webflow.push(function () {
    // Close dropdown when clicking a link inside it
    $('[g-dropdown-item="link"]').on('click', function (e) {

    const $dropdown = $(this).closest('.w-dropdown');
    const $toggle = $dropdown.find('.w-dropdown-toggle');
    const $list = $dropdown.find('.w-dropdown-list');

    // Step 1: Remove open state manually
    $toggle.removeClass('w--open').attr('aria-expanded', 'false');
    $list.removeClass('w--open');

    // Step 2: Trigger mouseup to sync Webflow's internal state
    // Webflow uses mouseup on body to reset dropdown state
    $(document).trigger('mouseup');
    $(document).trigger('touchend');

    console.log('Dropdown closed and Webflow state reset');
    });
});