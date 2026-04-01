/**
 * Share Buttons
 *
 * Dynamically sets href values on share links based on the current page URL and title.
 * Add a `data-share` attribute to each link element in Webflow:
 *
 *   - data-share="x"        — shares on X (Twitter)
 *   - data-share="linkedin" — shares on LinkedIn
 *   - data-share="email"    — opens mailto with subject + body
 *
 * The download button requires no JS — link it directly to your PDF in Webflow.
 */

function initShareButtons() {
  const pageUrl   = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  const map = {
    x:        `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
    email:    `mailto:?subject=${pageTitle}&body=${pageUrl}`,
  };

  Object.entries(map).forEach(([key, href]) => {
    const el = document.querySelector(`[data-share="${key}"]`);
    if (!el) return;
    el.href = href;
    // Open social share links in a new tab
    if (key !== 'email') el.setAttribute('target', '_blank');
  });
}

initShareButtons();
