window.addEventListener('load', function () {
  console.log('[use-cases] Script loaded');

  // Step 1: Find all .cs_tag elements with fs-list-field="industry"
  const tagEls = document.querySelectorAll('.cs_tag[fs-list-field="industry"]');
  console.log('[use-cases] Tag elements with fs-list-field="industry":', tagEls.length, tagEls);

  // Step 2: Collect unique industry names
  const usedIndustries = new Set();
  tagEls.forEach(el => {
    const name = el.textContent.trim();
    if (name) usedIndustries.add(name);
  });
  console.log('[use-cases] Unique industries found on page:', [...usedIndustries]);

  // Step 3: Find the industry select element
  const industrySelect = document.querySelector('[fs-list-field="industry"][fs-list-element="select"]');
  console.log('[use-cases] Industry select element:', industrySelect);

  if (!industrySelect) {
    console.warn('[use-cases] Could not find [fs-list-field="industry"][fs-list-element="select"]');
    return;
  }

  // Step 4: Remove options not present in usedIndustries (skip empty/placeholder options)
  const options = Array.from(industrySelect.options);
  console.log('[use-cases] Total options in select:', options.length);

  options.forEach(option => {
    const name = option.text.trim();
    if (!name || !option.value) {
      console.log(`[use-cases] Skipping placeholder option`);
      return;
    }
    const isUsed = usedIndustries.has(name);
    console.log(`[use-cases] Option "${name}" — present on page: ${isUsed}`);
    if (!isUsed) {
      console.log(`[use-cases] Removing option "${name}"`);
      option.remove();
    }
  });

  console.log('[use-cases] Done. Remaining options:', industrySelect.options.length);

  // Step 5: Update demo link for identified (existing) customers
  // Check multiple signals in order of reliability
  const getCookie = (name) => { const m = document.cookie.match('(?:^|; )' + name + '=([^;]*)'); return m ? decodeURIComponent(m[1]) : null; };

  const userDataRaw = getCookie('user_data');
  const userDataDomain = userDataRaw ? (() => { try { return JSON.parse(userDataRaw).domain; } catch (e) { return null; } })() : null;
  const helpdeskSubdomain = getCookie('gorgias-helpdesk-subdomain');
  const ajsUserId = getCookie('ajs_user_id');
  const sessionToken = localStorage.getItem('x-account-manager-session-token');

  console.log('[use-cases] Customer signals:', {
    userDataDomain,
    helpdeskSubdomain,
    ajsUserId,
    sessionToken: !!sessionToken
  });

  const isExistingCustomer = !!(userDataDomain || helpdeskSubdomain || ajsUserId || sessionToken);
  console.log('[use-cases] Is existing customer:', isExistingCustomer);

  const demoLink = document.getElementById('footer-explore');
  console.log('[use-cases] Demo link element:', demoLink);

  if (demoLink && isExistingCustomer) {
    console.log('[use-cases] Customer identified — updating demo link from:', demoLink.href);
    demoLink.href = '/demo/customers/automate';
    console.log('[use-cases] Demo link updated to:', demoLink.href);
  }
});
