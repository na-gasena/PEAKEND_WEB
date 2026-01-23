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
  const bgFallback = document.getElementById("bgFallback");

  const logo = document.querySelector(".logo");
  const keyVisual = document.querySelector(".keyVisual");
  const keyText = document.querySelector(".keyText");
  const snsLinks = document.querySelector(".snsLinks");

  const modal = document.getElementById("photoModal");
  const modalImg = modal?.querySelector(".modalImage");
  const modalCaption = modal?.querySelector(".modalCaption");

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
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        // Autoplay blocked / can't play → keep fallback visible
      });
    }
  } catch (_) {}

  // Hide fallback once the video is actually playing
  if (bgVideo && bgFallback) {
    const hideFallback = () => bgFallback.classList.add("isHidden");
    const showFallback = () => bgFallback.classList.remove("isHidden");
    bgVideo.addEventListener("playing", hideFallback, { passive: true });
    bgVideo.addEventListener("canplay", hideFallback, { passive: true });
    bgVideo.addEventListener("error", showFallback, { passive: true });
  }

  window.setTimeout(revealMain, SPLASH_MS);

  // Photo modal
  const renderCaption = (caption) => {
    if (!modalCaption) return;
    if (!caption) {
      modalCaption.textContent = "";
      return;
    }

    const escaped = caption
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const withLinks = escaped.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    modalCaption.innerHTML = withLinks.replace(/\n/g, "<br>");
  };

  const openModal = (imgSrc, caption, options = {}) => {
    if (!modal || !modalImg || !modalCaption) return;
    const { theme, size } = options;
    if (theme) {
      modal.dataset.theme = theme;
    } else {
      delete modal.dataset.theme;
    }
    if (size) {
      modal.dataset.size = size;
    } else {
      delete modal.dataset.size;
    }
    modalImg.src = imgSrc;
    modalImg.alt = "";
    renderCaption(caption ?? "");
    modal.hidden = false;
    document.body.classList.add("modalOpen");
  };

  const closeModal = () => {
    if (!modal || !modalImg) return;
    modal.hidden = true;
    modalImg.src = "";
    delete modal.dataset.theme;
    delete modal.dataset.size;
    document.body.classList.remove("modalOpen");
  };

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    const modalItem = t.closest("[data-modal-img]");
    if (modalItem) {
      const imgSrc = modalItem.getAttribute("data-modal-img");
      const caption = modalItem.getAttribute("data-modal-caption");
      const theme = modalItem.getAttribute("data-modal-theme");
      const size = modalItem.getAttribute("data-modal-size");
      if (imgSrc) openModal(imgSrc, caption, { theme, size });
      return;
    }

    const item = t.closest(".photoItem");
    if (item) {
      const imgSrc = item.getAttribute("data-img");
      const caption = item.getAttribute("data-caption");
      if (imgSrc) openModal(imgSrc, caption);
      return;
    }

    if (t.closest('[data-close="1"]')) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });
});

