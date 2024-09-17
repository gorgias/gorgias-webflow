// Get all <a> tags
let links = document.querySelectorAll('a, link');

// Loop through each <a> tag
links.forEach(link => {
    let href = link.getAttribute('href');
    let updatedHref = '';

    // Check if href contains /demo, /signup, or /signup-2 but not /signup-2/account or /signup/account
    if (
        (href.includes('/demo') || href.includes('/signup') || href.includes('/get-started') || href.includes('/signup-2')) &&
        !href.includes('/signup-2/account') &&
        !href.includes('/signup/account')
    ) {
    // Get the current path and modify it
    let path = window.location.pathname
    
    if (path === '/') {
        path = 'home';
    }
    else{
        path = path.slice(1).replace(/\//g, '-');
    }
 
    console.log(href);
    // Append the "ref" parameter to the href
    // Check if href already has a ref parameter
    if (!href.includes('ref=')) {
        updatedHref = href.includes('?') ? `${href}&ref=${path}` : `${href}?ref=${path}`;
        // Update the href attribute
        console.log(updatedHref);
    }
    else {
        console.log(href);
    }

    // Check if the <a> tag is a child of a section with class "hero"
    if (link.closest('[class*="hero"]')) {
        updatedHref = updatedHref.includes('?') ? `${updatedHref}&ref-position=hero` : `${updatedHref}?ref-position=hero`;
    }else if (link.closest('[class*="footer-cta"]')) {
        updatedHref = updatedHref.includes('?') ? `${updatedHref}&ref-position=footer-cta` : `${updatedHref}?ref-position=footer-cta`;
    }else if (link.closest('[class*="reassurance"]')) {
        updatedHref = updatedHref.includes('?') ? `${updatedHref}&ref-position=reassurance` : `${updatedHref}?ref-position=reassurance`;
    }else if (link.closest('[class*="ctas-bar-container"]')) {
        updatedHref = updatedHref.includes('?') ? `${updatedHref}&ref-position=stciky-cta-bar` : `${updatedHref}?ref-position=stciky-cta-bar`;
    }else if (link.closest('[class*="main-nav"]')) {
        updatedHref = updatedHref.includes('?') ? `${updatedHref}&ref-position=menu` : `${updatedHref}?ref-position=menu`;
    }else {
        updatedHref = updatedHref.includes('?') ? `${updatedHref}&ref-position=other` : `${updatedHref}?ref-position=other`;
    }

    link.setAttribute('href', updatedHref);
        
    }
});