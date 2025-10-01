/**
 * Count up functionality using GSAP + ScrollTrigger.
 * Reads number from the element's existing text content.
 * data-round="false" => don't round; preserve decimal precision.
 * Optional: data-decimals="N" to force a specific number of decimals.
 */

gsap.registerPlugin(ScrollTrigger);

const items = document.querySelectorAll('[data-el="count-up"]');

items.forEach((item) => {
  // Parse original number from the element text (commas allowed)
  const rawText = (item.textContent || "").trim();
  const number = parseFloat(rawText.replace(/,/g, ""));

  if (isNaN(number)) {
    console.warn("[CountUp] Skipping item (not a number):", rawText, item);
    return;
  }

  // Determine decimals: from attribute or from original text
  const attrDecimals = item.getAttribute("data-decimals");
  const decimals =
    attrDecimals !== null
      ? Math.max(0, parseInt(attrDecimals, 10) || 0)
      : ((rawText.split(".")[1] || "").length);

  const hasDecimals = decimals > 0;

  // Rounding behavior
  const allowRounding = item.getAttribute("data-round") !== "false";

  console.log("[CountUp] Init ->", {
    rawText,
    number,
    decimals,
    hasDecimals,
    allowRounding,
    item
  });

  // Build the tween paused; ScrollTrigger will control when to play
  const tween = gsap.fromTo(
    item,
    { textContent: 0 },
    {
      immediateRender: false,
      textContent: number,
      duration: 1.5,
      ease: "power1.out",
      // Snap to 0.01 if decimals exist to avoid ugly jitter; otherwise to 1
      snap: { textContent: hasDecimals ? 1 / Math.pow(10, Math.min(decimals, 4)) : 1 },
      paused: true,
      onStart: () => console.log("[CountUp] Animation started for:", number),
      onUpdate: function () {
        const current = parseFloat(item.textContent);
        if (isNaN(current)) return;

        let out;
        if (!allowRounding) {
          if (hasDecimals) {
            out = current.toFixed(decimals);
          } else {
            out = String(Math.trunc(current));
          }
        } else {
          out = hasDecimals ? current.toFixed(1) : String(Math.round(current));
        }
        item.textContent = out;
      },
      onComplete: function () {
        let finalOut;
        if (!allowRounding) {
          finalOut = hasDecimals ? number.toFixed(decimals) : String(Math.trunc(number));
        } else {
          finalOut = hasDecimals ? number.toFixed(1) : String(Math.round(number));
        }
        item.textContent = finalOut;
        console.log("[CountUp] Completed ->", { finalOut, number, allowRounding, decimals });
      },
    }
  );

  // Helper: get current scroll position of the page or custom scroller
  const getScrollY = () => {
    const st = ScrollTrigger.getById && ScrollTrigger.getById("_tmp_");
    // default window scroller
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  };

  // Create ScrollTrigger separately so it doesn't auto-play the tween at init
  ScrollTrigger.create({
    trigger: item,
    start: "top 85%",
    once: true,
    onEnter: (self) => {
      // If page is at top (no user scroll yet), wait for the first scroll before playing
      const atTop = (getScrollY() === 0);
      console.log("[CountUp] ScrollTrigger onEnter:", number, item, { atTop });
      if (atTop) {
        const playAfterScroll = () => {
          tween.play(0);
          window.removeEventListener("scroll", playAfterScroll);
        };
        window.addEventListener("scroll", playAfterScroll, { once: true, passive: true });
      } else {
        tween.play(0);
      }
    },
  });
});