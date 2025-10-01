/** ====== CONFIG ====== **/
const JOB_BOARD_NAME = "Gorgias";
const API_URL = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(
  JOB_BOARD_NAME
)}?includeCompensation=false`;
const MIN_JOBS_PER_CITY = 2; // hide cities with fewer than this many jobs

const LIST = document.getElementById("city-list");
const TEMPLATE = document.getElementById("city-row-template");
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
function getCityData(job) {
  if (
    job.isRemote ||
    (typeof job.location === "string" &&
      job.location.toLowerCase() === "remote")
  ) {
    return { cityKey: "remote", label: "Remote", rawCity: "remote" };
  }
  const p = getPostal(job);
  const city = p.addressLocality || (job.location || "").trim();
  const country = p.addressCountry || "";
  const region = p.addressRegion || "";

  if (!city) return { cityKey: "", label: "", rawCity: "" };

  const label = isUSA(country)
    ? region
      ? `${city}, ${region}`
      : city
    : country
    ? `${city}, ${country}`
    : city;

  return { cityKey: slugify(city), label, rawCity: city };
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
