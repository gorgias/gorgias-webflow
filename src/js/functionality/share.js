/**
 * Share Buttons — Ecom Lab
 *
 * Builds share URLs for X, LinkedIn, and email with Gorgias branding.
 * Add a `data-share` attribute to each anchor element in Webflow:
 *
 *   data-share="x"        — X (Twitter) post, tagged via @Gorgias
 *   data-share="linkedin" — LinkedIn share with Gorgias mention in summary
 *   data-share="mail"     — mailto with Ecom Lab copy pre-filled
 */

function initShare() {
  const pageUrl   = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  const xText = encodeURIComponent(`${document.title} @Gorgias`);

  const linkedInSummary = encodeURIComponent(
    `Shared via Gorgias Ecom Lab — ${document.title}`
  );

  const mailSubject = encodeURIComponent(`Check out the Gorgias Ecom Lab`);
  const mailBody = encodeURIComponent(
    `Hey,\n\nI thought you might find this interesting:\n${document.title}\n${window.location.href}\n\nDiscover more resources from the Gorgias Ecom Lab — the go-to hub for ecommerce insights and strategies.\n\nEnjoy!`
  );

  const map = {
    x: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${xText}&via=Gorgias`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}&summary=${linkedInSummary}&source=Gorgias`,
    mail: `mailto:?subject=${mailSubject}&body=${mailBody}`,
  };

  Object.entries(map).forEach(([key, href]) => {
    document.querySelectorAll(`[data-share="${key}"]`).forEach((el) => {
      el.href = href;
      if (key !== 'mail') el.setAttribute('target', '_blank');
    });
  });
}

initShare();
