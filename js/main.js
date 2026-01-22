/**
 * Splash -> Main transition
 * - Splash: yellow background + logo
 * - After ~1.5s: fade out splash, fade in main
 * - Then: stagger in logo / key visual / date
 */

document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const bgVideo = document.getElementById("bgVideo");

  const logo = document.querySelector(".logo");
  const keyVisual = document.querySelector(".keyVisual");
  const keyText = document.querySelector(".keyText");
  const snsLinks = document.querySelector(".snsLinks");

  const SPLASH_MS = 1500;
  const STAGGER_MS = { logo: 250, key: 520, text: 820, sns: 980 };

  const revealMain = () => {
    splash?.classList.add("isHidden");
    app?.classList.add("isVisible");

    window.setTimeout(() => logo?.classList.add("isVisible"), STAGGER_MS.logo);
    window.setTimeout(
      () => keyVisual?.classList.add("isVisible"),
      STAGGER_MS.key
    );
    window.setTimeout(
      () => keyText?.classList.add("isVisible"),
      STAGGER_MS.text
    );
    window.setTimeout(
      () => snsLinks?.classList.add("isVisible"),
      STAGGER_MS.sns
    );

    // Remove splash from a11y tree after animation
    window.setTimeout(() => {
      if (splash) splash.style.display = "none";
    }, 900);
  };

  // Best-effort: mobile autoplay policies can still block; try once.
  // Even if play is blocked, the rest of UI still works.
  try {
    const p = bgVideo?.play?.();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch (_) {}

  window.setTimeout(revealMain, SPLASH_MS);
});

