// Add URL ref and ref-position parameters to all links with /demo, /signup, or /signup-2 based on the page and position of the link and the url of current page

// Function to add URL parameters
function addUrlParameter(url, param, value) {
    let urlObj = new URL(url, window.location.origin);
    if (!urlObj.searchParams.has(param)) {
        urlObj.searchParams.append(param, value);
    }
    return urlObj.toString();
}

// Function to update href with ref and ref-position parameters
function updateHrefWithParams(element) {
    let href = element.getAttribute('href') || '';
    let ctaAttr = element.getAttribute('cta') || '';
    let refValue = '';
    let refPositionValue = '';
    let updatedHref = '';
    let path = window.location.pathname;
    // Target the right links by checking if href contains /demo, /signup, or /signup-2 but not /signup-2/account or /signup/account
    if (
        (href.includes('/demo') || href.includes('/signup') || (href=='#' && ctaAttr.includes('get-started')) || href.includes('/signup-2')) &&
        !href.includes('/signup-2/account') &&
        !href.includes('/signup/account')
    ) {
        // Set ref value based on the path and overide ref value for home page
        if (path === '/') {
            refValue = 'home';
        } else {
            refValue = path.slice(1).replace(/\//g, '-');
        }
        // Add get-started to ref value if the cta clicked is a Get Started button
        if(ctaAttr.includes('get-started')){
            refValue = refValue + '-get-started';
        }
        // Add ref value to the href
        updatedHref = addUrlParameter(href, 'ref', refValue);

        // Set the ref-position value based on the position of the link on the page
        // Check if the element is a child of a section with specific classes
        if (element.closest('[class*="hero"]')) {
            refPositionValue = 'hero';
        } else if (element.closest('[class*="footer-cta"]')) {
            refPositionValue = 'footer-cta';
        } else if (element.closest('[class*="reassurance"]')) {
            refPositionValue = 'reassurance';
        } else if (element.closest('[class*="ctas-bar-container"]')) {
            refPositionValue = 'stciky-cta-bar'
        } else if (element.closest('[class*="main-nav"]')) {
            refPositionValue = 'menu';
        } else {
            refPositionValue = 'other';
        }

        // Add ref-position value to the href
        updatedHref = addUrlParameter(updatedHref, 'ref-position', refPositionValue);

        // Update the href attribute of the link
        element.href = updatedHref;
    }
}

// Get all <a> tags
let links = document.querySelectorAll('a, link');

// update href with ref and ref-position parameters for each link
links.forEach(link => {
    updateHrefWithParams(link);
});