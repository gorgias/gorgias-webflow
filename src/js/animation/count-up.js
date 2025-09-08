/**
 * Count up functionality using GSAP + ScrollTrigger.
 * Reads number from the element's existing text content.
 * data-round="false" => don't round; preserve decimal precision.
 * Optional: data-decimals="N" to force a specific number of decimals.
 */

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

  gsap.fromTo(
    item,
    { textContent: 0 },
    {
      textContent: number,
      duration: 1.5,
      ease: "power1.out",
      // Snap to 0.01 if decimals exist to avoid ugly jitter; otherwise to 1
      snap: { textContent: hasDecimals ? 1 / Math.pow(10, Math.min(decimals, 4)) : 1 },
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        once: true,
        onEnter: () => console.log("[CountUp] ScrollTrigger onEnter:", number, item),
      },
      onStart: () => console.log("[CountUp] Animation started for:", number),
      onUpdate: function () {
        const current = parseFloat(item.textContent);
        if (isNaN(current)) return;

        // Format without changing the magnitude:
        // - If allowRounding=false: keep exact decimal precision (no Math.round, no toFixed that changes decimals count)
        // - If allowRounding=true: round to 1 decimal when original had decimals, else integer
        let out;

        if (!allowRounding) {
          if (hasDecimals) {
            // Keep original number of decimals, prevent rounding up by fixing to that precision
            // Note: toFixed does rounding; but since GSAP target is the same `number`,
            // the final frame will equal exactly `number`. During animation, this keeps consistent precision.
            out = current.toFixed(decimals);
          } else {
            out = String(Math.trunc(current)); // no decimals originally, no rounding up
          }
        } else {
          out = hasDecimals ? current.toFixed(1) : String(Math.round(current));
        }

        item.textContent = out;
        // Debug each frame sparingly; comment next line if too verbose:
        // console.log("[CountUp] onUpdate ->", { current, out, allowRounding, decimals });
      },
      onComplete: function () {
        // Ensure final formatting is exactly the intended one
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
});