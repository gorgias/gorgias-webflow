// Add brand name to the page
document.addEventListener('DOMContentLoaded', () => {
  const source = document.querySelector('[data-el="brand-name-source"]');
  const target = document.querySelector('[data-el="brand-name"]');

  if (source && target) {
    target.textContent = source.textContent;
  }
});

// Calculate gauges
 // Reusable logic for calculating gauge width
  function calculateBarWidth(value) {
    if (typeof value !== 'number') value = parseFloat(value);
    if (isNaN(value)) return 0;
    return value < 5 ? value * 20 : value * 10;
  }

  // Apply width styles to all gauge fillers with data-value
  function updateGaugeWidths() {
    const fillers = document.querySelectorAll('[data-value]');
    fillers.forEach(filler => {
      const value = parseFloat(filler.getAttribute('data-value'));
      const width = calculateBarWidth(value);
      filler.style.width = `${width}%`;
    });
  }

  // Optional: only run when in viewport
// Run callback once when any of the target elements enters viewport
function observeAnyAndRunOnce(targetSelector, callback) {
  const targets = document.querySelectorAll(targetSelector);
  if (!targets.length || !window.IntersectionObserver) {
    callback(); // fallback for unsupported browsers
    return;
  }

  const observer = new IntersectionObserver((entries, observerInstance) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        callback();
        // Stop observing all once triggered
        targets.forEach(el => observerInstance.unobserve(el));
        break;
      }
    }
  }, { threshold: 0.1 });

  targets.forEach(target => observer.observe(target));
}

  // Init when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    observeAnyAndRunOnce('.num-revs_block', updateGaugeWidths);
  });

// Store content based on brand vertical
const useCaseContent = {
  "Beauty & Fitness": {
    useCase1Title: "Take the stress out of post-BFCM returns",
    useCase1Paragraph: "Zendesk buries beauty brands in repetitive tickets when shade mismatches and delivery issues surge. Gorgias automates over 60% of inquiries like WISMO and return status, helping your team stay focused and efficient without losing your brand’s personal touch.",
    useCase2Title: "On-brand support at scale",
    useCase2Paragraph: "AI Agent learns your tone and policies, so answers about size, fit, or restock dates feel personal, not robotic. Automate tickets while staying on-brand and responsive across chat, social, and email, 24/7.",
    useCase3Title: "Turn sizing questions into sales",
    useCase3Paragraph: "Which size should I order?” is a conversion opportunity. Gorgias Shopping Assistant guides fit, recommends products, and creates orders while giving credit to your CX team."
  },
  "Food & Drink": {
    useCase1Title: "Take the stress out of post-BFCM order issues",
    useCase1Paragraph: "When holiday shipping delays and product concerns flood your inbox, Zendesk slows you down. Gorgias resolves over 60% of routine tickets like WISMO, damaged item reports, and delivery updates, so your team can stay fast, accurate, and focused on customer trust.",
    useCase2Title: "Personalized support, even at peak volume",
    useCase2Paragraph: "AI Agent understands your brand voice and policies, delivering quick, accurate answers about ingredients, allergens, and shipping. Automate routine questions while staying fast, friendly, and always on-brand across chat, email, and social.",
    useCase3Title: "Turn ingredient questions into confident purchases",
    useCase3Paragraph: "“Is this safe for me?” is a chance to build trust. Shopping Assistant helps answer dietary questions, recommend products, and guide reorders while keeping your CX team in the loop."
  },
  "Home & Garden": {
    useCase1Title: "Handle holiday order surges with less stress",
    useCase1Paragraph: "Zendesk gets overwhelmed by delivery and damage tickets. Gorgias automates 60% of issues like WISMO and returns, helping your team stay responsive and protect high-AOV experiences.",
    useCase2Title: "Support that matches your brand experience",
    useCase2Paragraph: "AI Agent speaks in your tone and knows your policies, providing helpful answers about delivery timelines, product materials, and return options. Automate routine tickets while maintaining a polished, personal experience across chat, email, and social—day and night.",
    useCase3Title: "Turn product questions into confident purchases",
    useCase3Paragraph: "“Will this fit my space?” is a chance to drive conversion. Shopping Assistant helps guide size, material, and style choices while crediting your CX team for the assist."
  },
  "Health": {
    useCase1Title: "Protect trust during peak season",
    useCase1Paragraph: "Holiday delays and product questions overwhelm Zendesk. Gorgias automates 60% of support tickets, so your team stays fast, clear, and focused on what matters most—customer confidence.",
    useCase2Title: "Trustworthy support, delivered instantly",
    useCase2Paragraph: "AI Agent mirrors your tone and follows your policies to answer questions about ingredients, usage, and shipping with speed and care. Automate routine tickets while providing calm, accurate support across chat, email, and social—any time of day.",
    useCase3Title: "Turn product questions into trust and conversion",
    useCase3Paragraph: "“Is this right for my needs?” is more than a support ticket—it’s a sales moment. Shopping Assistant helps answer usage and ingredient questions, recommends the right supplements, and drives confident checkouts with full credit to your CX team."
  },
  "Pets & Animals": {
    useCase1Title: "Keep pet parents calm when orders go wrong",
    useCase1Paragraph: "When food, meds, or gifts are late, Zendesk can’t keep up. Gorgias automates over 60% of tickets like WISMO, returns, and flavor swaps—so your team stays fast, empathetic, and trusted.",
    useCase2Title: "Fast, caring support for every pet parent",
    useCase2Paragraph: "AI Agent uses your tone and brand rules to answer questions about ingredients, deliveries, and product fit—instantly. Automate everyday tickets while providing warm, reliable service across chat, email, and social around the clock.",
    useCase3Title: "Turn pet care questions into loyal customers",
    useCase3Paragraph: "“Is this safe for my dog?” is your chance to build trust. Shopping Assistant guides product selection based on pet size, breed, and needs while giving your CX team the credit for every smart recommendation."
  },
  "Sports": {
    useCase1Title: "Stay ahead when urgency spikes",
    useCase1Paragraph: "When gear delays or sizing issues flood support, Zendesk lags. Gorgias automates over 60% of tickets like WISMO, returns, and fit questions so your team stays fast, accurate, and ready for game day.",
    useCase2Title: "Speedy support that keeps fans and athletes moving",
    useCase2Paragraph: "AI Agent adapts to your brand voice and policies to handle questions about gear fit, shipping, and returns. Automate routine tickets while delivering fast, accurate service across chat, email, and social—whenever it’s game time.",
    useCase3Title: "Turn gear questions into game-time conversions",
    useCase3Paragraph: "“Will this fit my workout?” is a sales opportunity. Shopping Assistant helps recommend the right gear, size, or supplement while giving your CX team credit for every assist."
  },
  "Toys & Hobbies": {
    useCase1Title: "Turn holiday chaos into calm, confident support",
    useCase1Paragraph: "When last-minute shoppers and parents flood support, Zendesk can’t keep up. Gorgias resolves over 60% of tickets like WISMO, missing pieces, and return questions so your team stays quick, cheerful, and ready for playtime.",
    useCase2Title: "On-brand support at scale",
    useCase2Paragraph: "AI Agent matches your tone and policies to quickly answer questions about product details, shipping, and returns. Automate routine tickets while delivering cheerful, reliable service across chat, email, and social—especially when it counts.",
    useCase3Title: "Turn curiosity into conversions",
    useCase3Paragraph: "“Is this right for their age?” is more than a question, it’s a chance to sell. Shopping Assistant helps guide product picks, answer safety or compatibility questions, and gives your CX team credit for every joyful match."
  }
};


// Update the brand vertical based on the content map
const brandVertical = $('[data-el="vertical"]');
const sanitizedVertical = brandVertical.text()
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9\\s]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

console.log('[UseCase] Raw vertical:', brandVertical.text());
console.log('[UseCase] Sanitized vertical:', sanitizedVertical);

// Normalize the keys of the content map
const matchedKey = Object.keys(useCaseContent).find(key => {
  const normalizedKey = key
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return normalizedKey === sanitizedVertical;
});

if (!matchedKey) {
  console.warn(`[UseCase] No matching key found for vertical: "${sanitizedVertical}"`);
} else {
  const content = useCaseContent[matchedKey];
  console.log(`[UseCase] Matched vertical key: "${matchedKey}"`);

  const mappings = [
    ['use_case_1_title', content.useCase1Title],
    ['use_case_1_paragraph', content.useCase1Paragraph],
    ['use_case_2_title', content.useCase2Title],
    ['use_case_2_paragraph', content.useCase2Paragraph],
    ['use_case_3_title', content.useCase3Title],
    ['use_case_3_paragraph', content.useCase3Paragraph],
  ];

  mappings.forEach(([attr, text]) => {
    const el = $(`[data-el="${attr}"]`);
    if (el.length) {
      el.text(text);
      console.log(`[UseCase] Updated [data-el="${attr}"] with:`, text);
    } else {
      console.warn(`[UseCase] Missing element: [data-el="${attr}"]`);
    }
  });
}