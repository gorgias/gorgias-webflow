/** ====== CONFIG ====== **/
const JOB_BOARD_NAME = "Gorgias";
const API_URL = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(
  JOB_BOARD_NAME
)}?includeCompensation=false`;
const MIN_JOBS_PER_CITY = 0; // show cities with at least this many jobs (1 = include singletons)

const LIST = document.getElementById("city-list");
const TEMPLATE = document.getElementById("city-row-template");

// Company hubs: if a job is remote but in one of these cities, show the city instead of Remote
const HUB_CITIES = [
  "Paris",
  "Belgrade",
  "Lisbon",
  "Buenos Aires",
  "San Francisco",
  "New York City",
  "Toronto",
];
const HUB_CITY_SLUGS = new Set(HUB_CITIES.map((c) => slugify(c)));
/** ===================== **/

/* Helpers */
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
function isHubCity(name) {
  if (!name) return false;
  return HUB_CITY_SLUGS.has(slugify(String(name)));
}
function getCityData(job) {
  const p = getPostal(job);
  const locStr = typeof job.location === "string" ? job.location.trim() : "";
  const postalCity = p.addressLocality || "";

  // Prefer explicit city from postal address; fall back to location string when not literally "remote"
  const cityCandidate = postalCity || (locStr && locStr.toLowerCase() !== "remote" ? locStr : "");

  const country = p.addressCountry || "";
  const region = p.addressRegion || "";

  // If we have a city candidate
  if (cityCandidate) {
    const hub = isHubCity(cityCandidate);

    // If job is marked remote but it's in a hub, show the hub city
    if (job.isRemote === true && hub) {
      const label = isUSA(country)
        ? (region ? `${cityCandidate}, ${region}` : cityCandidate)
        : (country ? `${cityCandidate}, ${country}` : cityCandidate);
      return { cityKey: slugify(cityCandidate), label, rawCity: cityCandidate };
    }

    // If job is marked remote and not a hub, list under Remote
    if (job.isRemote === true && !hub) {
      return { cityKey: "remote", label: "Remote", rawCity: "remote" };
    }

    // Not remote: show the city as usual
    const label = isUSA(country)
      ? (region ? `${cityCandidate}, ${region}` : cityCandidate)
      : (country ? `${cityCandidate}, ${country}` : cityCandidate);
    return { cityKey: slugify(cityCandidate), label, rawCity: cityCandidate };
  }

  // No city available: if explicitly remote, bucket as Remote
  if (job.isRemote === true || locStr.toLowerCase() === "remote") {
    return { cityKey: "remote", label: "Remote", rawCity: "remote" };
  }

  // Otherwise, we have no city info and it's not explicitly remote → skip
  return { cityKey: "", label: "", rawCity: "" };
}

/* If the template root is the <a data-ashby="link">, return node itself */
function getLink(node) {
  return node.matches?.('[data-ashby="link"]')
    ? node
    : node.querySelector('[data-ashby="link"]');
}

async function renderCityList() {
  if (!LIST || !TEMPLATE) return;

  try {
    const res = await fetch(API_URL, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const jobs = (data.jobs || []).filter((j) => j.isListed !== false);

    console.log("[Careers] Raw jobs dump:", jobs.map(j => ({
      id: j.id,
      title: j.title,
      location: j.location,
      isRemote: j.isRemote,
      address: j.address,
    })));

    // Count jobs per city
    const buckets = new Map();
    for (const j of jobs) {
      const { cityKey, label, rawCity } = getCityData(j);
      if (!cityKey) continue;
      const row = buckets.get(cityKey) || { cityKey, label, rawCity, count: 0 };
      row.count += 1;
      buckets.set(cityKey, row);
    }

    // Before filter: log all available cities
    const allRows = Array.from(buckets.values()).sort(
      (a, b) => b.count - a.count
    );
    console.log(
      "[Careers] Available cities (all):",
      allRows.map((r) => `${r.rawCity} (${r.count})`)
    );

    // Hide singletons (count < MIN_JOBS_PER_CITY)
    const rows = allRows.filter((r) => r.count >= MIN_JOBS_PER_CITY);

    // After filter: what we will render
    console.log(
      "[Careers] Rendering cities (>= " + MIN_JOBS_PER_CITY + " jobs):",
      rows.map((r) => `${r.rawCity} (${r.count})`)
    );

    // Clear existing (keep template)
    [...LIST.children].forEach((ch) => {
      if (ch !== TEMPLATE) ch.remove();
    });

    if (!rows.length) {
      LIST.insertAdjacentHTML("beforeend", "<p>No openings at the moment.</p>");
      return;
    }

    rows.forEach(({ cityKey, label, rawCity, count }) => {
      const node = TEMPLATE.cloneNode(true);
      node.id = ""; // avoid duplicate IDs
      node.style.display = "flex"; // ensure visible + flex
      node.classList.remove("hidden", "is-hidden", "u-hidden");
      node.classList.add("city-row");

      const labelEl = node.querySelector('[data-ashby="label"]');
      const badgeEl = node.querySelector('[data-ashby="count"]');
      const linkEl = getLink(node); // root-aware

      if (labelEl) labelEl.textContent = label;
      if (badgeEl) badgeEl.textContent = String(count);

      if (linkEl) {
        const targetSlug = slugify(rawCity || cityKey); // ensures lowercase
        const targetUrl = `/careers/${targetSlug}`;
        linkEl.href = targetUrl;
        console.log(`[Careers] Link set for "${label}" → ${targetUrl}`);
      } else {
        console.warn("[Careers] No link element found for:", label);
      }

      LIST.appendChild(node);
    });
  } catch (e) {
    console.error(e);
    LIST.insertAdjacentHTML(
      "beforeend",
      "<p>Sorry, we couldn’t load locations right now.</p>"
    );
  }
}

/* Run after Webflow is ready */
window.Webflow = window.Webflow || [];
window.Webflow.push(renderCityList);
