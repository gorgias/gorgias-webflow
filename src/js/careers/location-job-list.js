/** ====== CONFIG ====== **/
const JOB_BOARD_NAME = "Gorgias";
const API_URL = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(
  JOB_BOARD_NAME
)}?includeCompensation=false`;

// Layout preferences
const WRAP_DISPLAY = "flex"; // wrapper rows appear as flex via your template
const LOC_WRAP_DISPLAY = "flex"; // locations container display
const CHIP_DISPLAY = "inline-flex"; // each chip display (use "block" if you prefer)

/** DOM HOOKS **/
const WRAP = document.getElementById("city-list");
const TEMPLATE = document.getElementById("city-job-template");

/* Helpers */
function log(...a) {
  console.log("[CityJobs]", ...a);
}
function warn(...a) {
  console.warn("[CityJobs]", ...a);
}
function err(...a) {
  console.error("[CityJobs]", ...a);
}

function slugify(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function getPostal(job) {
  return job?.address?.postalAddress || {};
}
function isUSA(country) {
  if (!country) return false;
  const c = String(country).toLowerCase();
  return ["usa", "us", "united states", "united states of america"].includes(c);
}
function labelFromParts(city, state, country) {
  if (!city) return "";
  return isUSA(country)
    ? state
      ? `${city}, ${state}`
      : city
    : country
    ? `${city}, ${country}`
    : city;
}

/** All locations a job is offered in: [{city,state,country,label,slug}] */
function getAllJobLocations(job) {
  const out = [];
  const p = getPostal(job);

  // Primary
  const pCity =
    p.addressLocality ||
    (typeof job.location === "string" ? job.location.trim() : "");
  const pState = p.addressRegion || "";
  const pCountry =
    p.addressCountry || p.country || p.countryName || p.countryCode || "";
  if (pCity || pCountry) {
    out.push({
      city: pCity,
      state: pState,
      country: pCountry,
      label: labelFromParts(pCity, pState, pCountry),
      slug: slugify(pCity || "remote"),
    });
  }

  // locations[]
  if (Array.isArray(job.locations)) {
    for (const loc of job.locations) {
      const city =
        loc.address?.postalAddress?.addressLocality ||
        loc.name ||
        loc.location ||
        "";
      const state = loc.address?.postalAddress?.addressRegion || "";
      const country = loc.address?.postalAddress?.addressCountry || "";
      if (!city && !country) continue;
      out.push({
        city,
        state,
        country,
        label: labelFromParts(city, state, country),
        slug: slugify(city || "remote"),
      });
    }
  }

  // secondaryLocations[]
  if (Array.isArray(job.secondaryLocations)) {
    for (const loc of job.secondaryLocations) {
      const city =
        loc.address?.postalAddress?.addressLocality ||
        loc.name ||
        loc.location ||
        "";
      const state = loc.address?.postalAddress?.addressRegion || "";
      const country = loc.address?.postalAddress?.addressCountry || "";
      if (!city && !country) continue;
      out.push({
        city,
        state,
        country,
        label: labelFromParts(city, state, country),
        slug: slugify(city || "remote"),
      });
    }
  }

  // Remote
  if (job.isRemote || String(job.location || "").toLowerCase() === "remote") {
    out.push({
      city: "Remote",
      state: "",
      country: "Remote",
      label: "Remote",
      slug: "remote",
    });
  }

  // De-dupe
  const seen = new Set();
  return out.filter((l) => {
    const k = l.slug || l.label;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Find a chip template within the locations wrapper */
function getChipTemplate(locWrap) {
  return (
    locWrap.querySelector('[data-ashby="loc-chip-template"]') ||
    locWrap.querySelector("a")
  );
}

/** Build one job row from TEMPLATE */
function renderJob(job, currentCitySlug) {
  const node = TEMPLATE.cloneNode(true);
  node.id = "";
  node.style.display = "flex";
  node.setAttribute("data-job-item", "");

  // Title / meta
  node
    .querySelector('[data-ashby="title"]')
    ?.replaceChildren(document.createTextNode(job.title || "Position name"));
  node
    .querySelector('[data-ashby="department"]')
    ?.replaceChildren(
      document.createTextNode(job.department || job.team || "")
    );
  node
    .querySelector('[data-ashby="employmentType"]')
    ?.replaceChildren(document.createTextNode(job.employmentType || ""));

  // Apply URL
  const applyEl = node.querySelector('[data-ashby="applyUrl"]');
  if (applyEl) {
    const href = job.applyUrl || job.jobUrl || "#";
    applyEl.href = href;
    applyEl.target = "_blank";
    applyEl.rel = "noopener noreferrer";
  }

  // Locations
  const locWrap = node.querySelector('[data-ashby="locations"]');
  if (!locWrap) {
    warn("No [data-ashby='locations'] in row for:", job.title);
    return node;
  }

  locWrap.style.display = LOC_WRAP_DISPLAY;
  locWrap.classList.remove("hidden", "is-hidden", "u-hidden");

  const chipTpl = getChipTemplate(locWrap);
  if (!chipTpl) {
    warn("No chip template (<a>) inside locations for:", job.title);
    return node;
  }

  [...locWrap.children].forEach((ch) => {
    if (ch !== chipTpl) ch.remove();
  });

  const locs = getAllJobLocations(job);
  locs.forEach((loc) => {
    const chip = chipTpl.cloneNode(true);
    chip.style.display = CHIP_DISPLAY;
    chip.classList.remove("hidden", "is-hidden", "u-hidden");

    const labelNode =
      chip.querySelector('[data-ashby="loc-chip-label"]') ||
      chip.querySelector(".text-size-large") ||
      chip;
    labelNode.textContent = loc.label;

    if (loc.slug === currentCitySlug) {
      chip.removeAttribute("href");
      chip.setAttribute("aria-current", "true");
      chip.setAttribute("tabindex", "-1");
      chip.style.pointerEvents = "none";
      chip.style.cursor = "default";
    } else {
      chip.href = `/career/location/${loc.slug}`;
    }

    locWrap.appendChild(chip);
  });

  return node;
}


// ==== Native search ====
const SEARCH_INPUT = document.getElementById('job-search');
function getJobItems() {
  return Array.from(WRAP?.querySelectorAll('[data-job-item]') || []);
}

// --- Forgiving search helpers ---
function norm(s) {
  return (s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function tokenize(s) {
  return norm(s).split(" ").filter(Boolean);
}
// Common abbreviations / synonyms for roles and locations
const SYNONYMS = {
  // roles
  sr: ["senior"],
  jr: ["junior"],
  fe: ["frontend", "front end", "front-end"],
  be: ["backend", "back end", "back-end"],
  fs: ["fullstack", "full stack", "full-stack"],
  pm: ["product manager", "product-management", "product"],
  pd: ["product designer", "design"],
  ml: ["machine learning", "ml"],
  ds: ["data science", "data scientist"],
  swe: ["software engineer", "engineer"],
  eng: ["engineer"],
  ae: ["account executive"],
  csm: ["customer success manager"],
  cs: ["customer success"],
  se: ["sales engineer"],
  gm: ["growth manager", "growth"],
  // employment types
  ft: ["fulltime", "full time", "full-time"],
  pt: ["parttime", "part time", "part-time"],
};
function expandToken(token) {
  const t = token.toLowerCase();
  const list = SYNONYMS[t];
  if (!list) return [t];
  return [t, ...list.map(norm)];
}
// Lightweight Levenshtein distance
function lev(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0 = new Array(b.length + 1);
  const v1 = new Array(b.length + 1);
  for (let i = 0; i <= b.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    const ca = a.charCodeAt(i);
    for (let j = 0; j < b.length; j++) {
      const cost = ca === b.charCodeAt(j) ? 0 : 1;
      v1[j + 1] = Math.min(
        v1[j] + 1,         // insertion
        v0[j + 1] + 1,     // deletion
        v0[j] + cost       // substitution
      );
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v0[b.length];
}
// Does any word in haystack match the token with small typo allowance, synonyms, and relaxed rules
function tokenFuzzyHit(hayWords, token) {
  if (!token) return true;
  const t = token;
  const maxTol = Math.max(1, Math.floor(t.length * 0.4)); // ~40% typos, at least 1
  // Very short tokens: allow broad prefix/substring
  if (t.length <= 2) return hayWords.some(w => w.startsWith(t));
  for (const w of hayWords) {
    if (w.startsWith(t)) return true;            // prefix match
    if (w.includes(t)) return true;              // substring match
    // common adjacent transposition (e.g., prodcut -> product)
    if (t.length > 3 && w.length > 3) {
      for (let i = 0; i < Math.min(w.length, t.length) - 1; i++) {
        if (w[i] === t[i+1] && w[i+1] === t[i] && w.slice(i+2).startsWith(t.slice(i+2))) {
          return true;
        }
      }
    }
    if (Math.abs(w.length - t.length) > maxTol) continue; // quick prune
    if (lev(w, t) <= maxTol) return true;        // typo distance
  }
  return false;
}
function fuzzyMatch(hayText, hayWords, query) {
  const q = norm(query);
  if (!q) return true;
  if (hayText.includes(q)) return true; // fast path

  const rawTokens = q.split(" ").filter(Boolean);
  if (!rawTokens.length) return true;

  // majority rule: require ~60% tokens to hit (at least 1)
  const needed = Math.max(1, Math.ceil(rawTokens.length * 0.6));
  let hits = 0;

  for (const tok of rawTokens) {
    const expansions = expandToken(tok); // synonyms/abbr
    let tokenHit = false;
    for (const ex of expansions) {
      if (tokenFuzzyHit(hayWords, ex)) { tokenHit = true; break; }
    }
    if (tokenHit) hits++;
    // early exit if we already meet threshold
    if (hits >= needed) return true;
  }
  return false;
}

// ---- Animated show/hide for filter (300ms ease) ----
const FILTER_DUR = 300; // ms
function setTransition(el) {
  el.style.transition = `opacity ${FILTER_DUR}ms ease`;
}

function animateHide(el) {
  const cs = getComputedStyle(el);
  if (cs.display === 'none' || el.dataset.animating === 'hide') return;
  el.dataset.animating = 'hide';
  setTransition(el);
  // ensure starting state
  el.style.opacity = '1';
  // reflow
  void el.offsetHeight;
  // target: fade out only
  el.style.opacity = '0';
  const end = () => {
    el.removeEventListener('transitionend', end);
    el.style.display = 'none';
    el.style.opacity = '';
    el.style.transition = '';
    el.dataset.animating = '';
  };
  el.addEventListener('transitionend', end, { once: true });
}

function animateShow(el, displayValue) {
  const cs = getComputedStyle(el);
  if (cs.display !== 'none' && el.dataset.animating !== 'hide') return; // already visible or showing
  el.dataset.animating = 'show';
  const disp = displayValue || el.dataset.displayOriginal || 'flex';
  el.style.display = disp;
  setTransition(el);
  // start transparent
  el.style.opacity = '0';
  // reflow then fade in
  void el.offsetHeight;
  el.style.opacity = '1';
  const end = () => {
    el.removeEventListener('transitionend', end);
    el.style.opacity = '';
    el.style.transition = '';
    el.dataset.animating = '';
  };
  el.addEventListener('transitionend', end, { once: true });
}

function indexJobsForNativeSearch() {
  const items = getJobItems();
  items.forEach((el) => {
    if (!el.dataset.displayOriginal) {
      el.dataset.displayOriginal = getComputedStyle(el).display || 'flex';
    }
    const title = el.querySelector('[fs-cmsfilter-field="position"], [data-ashby="title"]')?.textContent || '';
    const dept  = el.querySelector('[fs-cmsfilter-field="department"], [data-ashby="department"]')?.textContent || '';
    const type  = el.querySelector('[fs-cmsfilter-field="employmentType"], [data-ashby="employmentType"]')?.textContent || '';
    const locs  = Array.from(el.querySelectorAll('[data-ashby="locations"] .text-size-large')).map(n => n.textContent).join(' ');
    const composite = [title, dept, type, locs].join(' ');
    const ntext = norm(composite);
    el.dataset.search = ntext;
    el.dataset.searchWords = tokenize(composite).join(' '); // store as space-delimited
  });
  log('[CityJobs] Native search indexed items:', items.length);
}

function applyNativeFilter(q) {
  const items = getJobItems();
  const query = q || '';
  let visible = 0;
  for (const el of items) {
    const hay = el.dataset.search || '';
    const hayWords = (el.dataset.searchWords || '').split(' ').filter(Boolean);
    const show = fuzzyMatch(hay, hayWords, query);
    if (show) {
      animateShow(el, el.dataset.displayOriginal);
      visible++;
    } else {
      animateHide(el);
    }
  }
  const emptyEl = document.querySelector('.empty-state');
  if (emptyEl) emptyEl.style.display = visible ? 'none' : '';
  log(`[CityJobs] Native search → ${visible}/${items.length} visible`);
}

function initNativeSearch() {
  indexJobsForNativeSearch();
  if (SEARCH_INPUT) {
    const onType = (() => {
      let t; return () => { clearTimeout(t); t = setTimeout(() => applyNativeFilter(SEARCH_INPUT.value), 500); };
    })();
    SEARCH_INPUT.addEventListener('input', onType);
    SEARCH_INPUT.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        return false;
      }
    });
    if (SEARCH_INPUT.value) applyNativeFilter(SEARCH_INPUT.value);
  }
  log('[CityJobs] Native search enabled');
}


function getCurrentCity() {
  const fromDom = (
    document.getElementById("current-city")?.textContent || ""
  ).trim();
  if (fromDom) return fromDom;
  const parts = location.pathname.split("/").filter(Boolean);
  const slug = parts[parts.length - 1] || "";
  return slug.replace(/-/g, " ");
}

async function initCityPage() {
  log("init started");
  if (!WRAP) {
    err("Missing #city-list");
    return;
  }
  if (!TEMPLATE) {
    err("Missing #city-job-template");
    return;
  }

  WRAP.style.display = WRAP_DISPLAY;

  const currentCity = getCurrentCity();
  const currentCitySlug = slugify(currentCity);
  log("Current city:", currentCity, "| slug:", currentCitySlug);

  try {
    log("Fetching:", API_URL);
    const res = await fetch(API_URL, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    log("fetch succeeded");
    const listed = (data.jobs || []).filter((j) => j.isListed !== false);

    const filtered = listed
      .filter((j) => {
        const locs = getAllJobLocations(j);
        const match = locs.some((l) => l.slug === currentCitySlug);
        return match;
      })
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    WRAP.innerHTML = "";

    if (!filtered.length) {
      WRAP.insertAdjacentHTML(
        "beforeend",
        `<p>No openings in ${currentCity} right now.</p>`
      );
    } else {
      filtered.forEach((job) => {
        const row = renderJob(job, currentCitySlug);
        WRAP.appendChild(row);
      });
    }
    log("List generated");
    initNativeSearch();

    // ---- Loader fade-out (career-loader) ----
    const loader = document.querySelector(".careers-loader");
    if (loader) {
      log("Hiding loader:", loader);
      setTimeout(() => {
        // Ensure a transition exists
        const currentTransition = getComputedStyle(loader).transition || "";
        if (!currentTransition || currentTransition.indexOf("opacity") === -1) {
          loader.style.transition = "opacity 0.3s ease";
        }
        loader.style.opacity = "0";
        const onEnd = () => {
          loader.style.display = "none";
          loader.removeEventListener("transitionend", onEnd);
        };
        loader.addEventListener("transitionend", onEnd, { once: true });
        // Fallback: force-hide if no transition fires
        setTimeout(() => {
          if (getComputedStyle(loader).opacity !== "0") return;
          loader.style.display = "none";
        }, 700);
      }, 400);
    } else {
      log("Loader not found – skipping fade");
    }
    // ----------------------------------------
  } catch (e) {
    log("List failed");
    err(e);
    WRAP.insertAdjacentHTML(
      "beforeend",
      "<p>Sorry, we couldn’t load jobs right now.</p>"
    );
    // (Finsweet logic removed)
  }
}

/* Run after Webflow is ready */
window.Webflow = window.Webflow || [];
window.Webflow.push(initCityPage);
