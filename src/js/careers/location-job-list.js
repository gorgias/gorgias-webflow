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
      log(`Chip (current) for "${job.title}" → disabled "${loc.label}"`);
    } else {
      chip.href = `/career/location/${loc.slug}`;
      log(`Chip link for "${job.title}" → ${chip.href}`);
    }

    locWrap.appendChild(chip);
  });

  log(
    `Rendered "${job.title}" (${locs.length} location chip${
      locs.length > 1 ? "s" : ""
    })`
  );
  return node;
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
    const listed = (data.jobs || []).filter((j) => j.isListed !== false);
    log("Jobs fetched:", listed.length);

    const filtered = listed
      .filter((j) => {
        const locs = getAllJobLocations(j);
        const match = locs.some((l) => l.slug === currentCitySlug);
        log(
          `Job "${j.title}" locs:`,
          locs.map((l) => l.slug).join(", "),
          "| match:",
          match
        );
        return match;
      })
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    log(`Jobs matching "${currentCity}" →`, filtered.length);

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

    // ---- Loader fade-out (career-loader) ----
    const loader = document.querySelector(".careers-loader");
    if (loader) {
      setTimeout(() => {
        loader.style.transition = "opacity 0.3s ease";
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
        }, 400);
      }, 400);
    }
    // ----------------------------------------
  } catch (e) {
    err(e);
    WRAP.insertAdjacentHTML(
      "beforeend",
      "<p>Sorry, we couldn’t load jobs right now.</p>"
    );
  }
}

/* Run after Webflow is ready */
window.Webflow = window.Webflow || [];
window.Webflow.push(initCityPage);
