/**
 * Countdown Timer
 *
 * Targets all elements with a `data-count-date` attribute on the page.
 * Each element requires a `data-count` attribute set to a valid date string
 * (e.g. "2026-06-01" or "June 1, 2026 00:00:00").
 *
 * Child elements with the following `data-count` attributes are updated every second:
 *   - [data-count="days"]  — remaining full days
 *   - [data-count="hours"] — remaining hours within the current day
 *   - [data-count="mins"]  — remaining minutes within the current hour
 *   - [data-count="secs"]  — remaining seconds within the current minute
 *
 * Each number is split into individual digit spans that animate (slide up) on change.
 *
 * To change the target date, update the `data-count-date` attribute on the countdown wrapper
 * directly in the Webflow UI or via CMS bindings — no JS changes needed.
 */

function initCountdowns() {
  // Inject styles for the digit slot-machine animation
  const style = document.createElement('style');
  style.textContent = `
    [data-count="days"],
    [data-count="hours"],
    [data-count="mins"],
    [data-count="secs"] {
      display: flex;
      justify-content: center;
      visibility: hidden;
    }
    [data-count="days"][data-ready],
    [data-count="hours"][data-ready],
    [data-count="mins"][data-ready],
    [data-count="secs"][data-ready] {
      visibility: visible;
    }
    .count-digit {
      overflow: hidden;
      display: inline-block;
      line-height: 1;
      height: 1em;
    }
    .count-digit-track {
      display: flex;
      flex-direction: column;
      will-change: transform;
    }
    .count-digit-track.is-animating {
      animation: countSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes countSlideUp {
      from { transform: translateY(0); }
      to   { transform: translateY(-50%); }
    }
  `;
  document.head.appendChild(style);

  const countdowns = document.querySelectorAll('[data-count-date]');

  if (!countdowns.length) {
    console.log('[Countdown] No countdown elements found on this page.');
    return;
  }

  // Render (or re-render) digit spans inside a count field element
  function renderDigits(el, value, pad) {
    const str = pad ? String(value).padStart(2, '0') : String(value);
    const currentSlots = el.querySelectorAll('.count-digit');

    // First render or digit count changed — build from scratch, no animation
    if (currentSlots.length !== str.length) {
      el.innerHTML = '';
      str.split('').forEach((digit) => {
        const slot = document.createElement('span');
        slot.className = 'count-digit';
        const track = document.createElement('span');
        track.className = 'count-digit-track';
        const current = document.createElement('span');
        current.textContent = digit;
        track.appendChild(current);
        slot.appendChild(track);
        el.appendChild(slot);
      });
      // Mark as ready after first render to avoid FOUC
      el.setAttribute('data-ready', '');
      return;
    }

    // Animate only the digits that changed
    str.split('').forEach((digit, i) => {
      const track = currentSlots[i].querySelector('.count-digit-track');
      const currentDigit = track.querySelector('span');

      if (currentDigit.textContent === digit) return;

      // Append the incoming digit below the current one
      const next = document.createElement('span');
      next.textContent = digit;
      track.appendChild(next);

      // Trigger slide-up animation
      track.classList.remove('is-animating');
      void track.offsetWidth; // force reflow to restart animation
      track.classList.add('is-animating');

      // After animation: remove the outgoing digit and reset the track
      track.addEventListener('animationend', () => {
        track.classList.remove('is-animating');
        track.style.transform = '';
        currentDigit.remove();
      }, { once: true });
    });
  }

  countdowns.forEach((el) => {
    const dateStr = el.getAttribute('data-count-date');

    // If no time is specified, default to end of that day (23:59:59) in local time
    const hasTime = /T|:/.test(dateStr);
    const targetDate = new Date(hasTime ? dateStr : `${dateStr}T23:59:59`);

    if (isNaN(targetDate)) {
      console.warn(`[Countdown] Invalid date value: "${dateStr}". Update the data-count attribute to a valid date string.`);
      return;
    }

    console.log(`[Countdown] Initialised. Counting down to: ${targetDate.toUTCString()}`);

    const daysEl  = el.querySelector('[data-count="days"]');
    const hoursEl = el.querySelector('[data-count="hours"]');
    const minsEl  = el.querySelector('[data-count="mins"]');
    const secsEl  = el.querySelector('[data-count="secs"]');

    function tick() {
      const now = new Date();
      const diff = targetDate - now;

      // Stop the timer if the target date has passed
      if (diff <= 0) {
        if (daysEl)  renderDigits(daysEl,  0, false);
        if (hoursEl) renderDigits(hoursEl, 0, true);
        if (minsEl)  renderDigits(minsEl,  0, true);
        if (secsEl)  renderDigits(secsEl,  0, true);
        console.log('[Countdown] Target date reached.');
        return;
      }

      const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins  = Math.floor((diff / (1000 * 60)) % 60);
      const secs  = Math.floor((diff / 1000) % 60);

      // days is not padded (can be 1–3+ digits); hours/mins/secs are padded to 2
      if (daysEl)  renderDigits(daysEl,  days,  false);
      if (hoursEl) renderDigits(hoursEl, hours, true);
      if (minsEl)  renderDigits(minsEl,  mins,  true);
      if (secsEl)  renderDigits(secsEl,  secs,  true);

      setTimeout(tick, 1000);
    }

    tick();
  });
}

initCountdowns();
