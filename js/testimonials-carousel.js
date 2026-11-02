/* =========================================================
   Trinetra Creations: testimonial carousel (Day 11)
   PROGRESSIVE ENHANCEMENT in two steps:
     Step 1 (always): build every quote as a simple stacked list.
     Step 2 (only if the Swiper library loaded): turn that list
             into a sliding carousel with dots, arrows and autoplay.
   If the CDN is down, step 2 is skipped and the list stays: no quote is lost.

   Needs (loaded before this file):
     js/testimonials.js  (TESTIMONIALS, SHOW_SAMPLE_TESTIMONIALS)
     js/helpers.js       (escapeHTML)
     Swiper from the CDN (optional: the page still works without it)
   ========================================================= */

(function () {
  "use strict";

  const block = document.getElementById("testimonials");

  // Missing box, data or helper? Stop. The <noscript>/fallback text stays.
  if (!block || typeof TESTIMONIALS === "undefined" || typeof escapeHTML !== "function") return;

  const e = escapeHTML;

  /* ---------- STEP 1: the stacked list (works for everyone) ----------
     <figure> groups a quote with who said it (<figcaption>), like the case-study quote.
     Every piece of data goes through e() before it goes into innerHTML.
     Day 14: each <figure> sits inside a plain <div class="testimonial-slide">.
     The DIV becomes the Swiper slide, because Swiper gives every slide role="group",
     and that role is not allowed on a <figure> (Lighthouse/axe flagged it).
     A <div> has no meaning of its own, so any role is fine on it. */
  const slidesHTML = TESTIMONIALS.map((t) => `
    <div class="testimonial-slide">
      <figure class="testimonial">
        <blockquote class="testimonial__quote"><p>${e(t.quote)}</p></blockquote>
        <figcaption class="testimonial__by">
          <strong>${e(t.name)}</strong>
          <span>${e(t.role)}, ${e(t.business)}</span>
        </figcaption>
      </figure>
    </div>`).join("");

  block.innerHTML = `
    <div class="testimonials__slider">
      <div class="testimonials__list">${slidesHTML}</div>
    </div>`;

  // The "Sample" badge next to the heading (it's in index.html, hidden by default)
  const badge = document.getElementById("testimonials-badge");
  if (badge) badge.hidden = !SHOW_SAMPLE_TESTIMONIALS;

  /* ---------- STEP 2: the carousel (only if Swiper is here) ----------
     typeof Swiper is "undefined" when the CDN file didn't load
     (no internet, CDN down, blocked by a firewall, wrong integrity hash). */
  if (typeof Swiper === "undefined") return;

  const slider = block.querySelector(".testimonials__slider");
  const list = block.querySelector(".testimonials__list");
  const slides = block.querySelectorAll(".testimonial-slide");   // the wrappers, not the figures (Day 14)

  // Swiper's CSS styles these exact class names. We add them HERE, not in the
  // HTML: if Swiper's CSS loaded but its JavaScript didn't, the CSS alone
  // would squash every quote into one clipped row.
  slider.classList.add("swiper");
  list.classList.add("swiper-wrapper");
  slides.forEach((slide) => slide.classList.add("swiper-slide"));

  // The controls: previous, the dots, next, and pause/play.
  // Icons are aria-hidden; Swiper gives the arrows and dots their spoken names (a11y below).
  const ICON_PREV = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_NEXT = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor"/></svg>';
  const ICON_PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>';

  block.insertAdjacentHTML("beforeend", `
    <div class="testimonials__controls">
      <button class="testimonials__btn testimonials__prev" type="button">${ICON_PREV}</button>
      <div class="testimonials__dots"></div>
      <button class="testimonials__btn testimonials__next" type="button">${ICON_NEXT}</button>
      <button class="testimonials__btn testimonials__pause" type="button"
              aria-label="Pause testimonials" hidden>${ICON_PAUSE}</button>
    </div>`);

  const pauseBtn = block.querySelector(".testimonials__pause");

  // Visitors who asked their device for less motion get NO autoplay at all.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let swiper;
  try {
    swiper = new Swiper(slider, {
      slidesPerView: 1,
      spaceBetween: 24,
      speed: 600,                       // slide animation, in milliseconds
      rewind: true,                     // after the last quote, go back to the first

      // Autoplay: a new quote every 7 seconds. false = switched off completely.
      // disableOnInteraction: false = keep autoplaying after someone swipes or clicks.
      autoplay: reduceMotion ? false : { delay: 7000, disableOnInteraction: false },

      // Arrow keys ← → change slides while the carousel is on screen.
      keyboard: { enabled: true, onlyInViewport: true },

      navigation: {
        prevEl: block.querySelector(".testimonials__prev"),
        nextEl: block.querySelector(".testimonials__next"),
      },

      // One dot per quote. bulletElement: "button" makes each dot a REAL button,
      // so Tab, Enter and Space work on it.
      pagination: {
        el: block.querySelector(".testimonials__dots"),
        clickable: true,
        bulletElement: "button",
      },

      // a11y = accessibility. What screen readers say for each part.
      // {{index}} and {{slidesLength}} are filled in by Swiper.
      a11y: {
        containerMessage: "Client testimonials",
        containerRoleDescriptionMessage: "carousel",
        itemRoleDescriptionMessage: "testimonial",
        slideLabelMessage: "{{index}} of {{slidesLength}}",
        prevSlideMessage: "Previous testimonial",
        nextSlideMessage: "Next testimonial",
        paginationBulletMessage: "Show testimonial {{index}}",
      },
    });
  } catch (error) {
    // Swiper broke for some reason: undo step 2, so the plain list shows again.
    console.warn("Testimonial carousel could not start; showing the list instead.", error);
    slider.classList.remove("swiper");
    list.classList.remove("swiper-wrapper");
    slides.forEach((slide) => slide.classList.remove("swiper-slide"));
    block.querySelector(".testimonials__controls").remove();
    return;
  }

  // The carousel works: this class switches css/testimonials.css to carousel mode.
  block.classList.add("is-carousel");

  /* ---------- Mark the active dot for screen readers ----------
     Swiper only colours it (a class). aria-current="true" also SAYS "current". */
  function markActiveDot() {
    block.querySelectorAll(".testimonials__dots button").forEach((dot) => {
      if (dot.classList.contains("swiper-pagination-bullet-active")) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }
  markActiveDot();
  swiper.on("paginationUpdate", markActiveDot);

  if (reduceMotion) return;             // no autoplay = nothing to pause

  /* ---------- Pausing: three reasons, one decision ----------
     Autoplay runs only when NONE of these is true:
       hover  = a mouse pointer is over the carousel
       focus  = keyboard focus is on one of its buttons
       button = the visitor pressed Pause
     (Swiper already pauses by itself while a finger is touching the slider.) */
  const pausedBecause = { hover: false, focus: false, button: false };

  function updateAutoplay() {
    const shouldPause = pausedBecause.hover || pausedBecause.focus || pausedBecause.button;
    if (shouldPause && swiper.autoplay.running) swiper.autoplay.stop();
    if (!shouldPause && !swiper.autoplay.running) swiper.autoplay.start();
  }

  // pointerType "mouse" only: on phones, a tap also fires pointerenter, but
  // there's no "leave" until you tap somewhere else, so it would stay paused.
  block.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") { pausedBecause.hover = true; updateAutoplay(); }
  });
  block.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") { pausedBecause.hover = false; updateAutoplay(); }
  });

  // focusin/focusout (unlike focus/blur) bubble up from the buttons to the block.
  // relatedTarget = where focus is going. Still inside the block? Stay paused.
  //
  // BUG FIX (fix session): only KEYBOARD focus pauses. Clicking a dot or arrow
  // with the MOUSE also puts focus on that button (Chrome does this), and focus
  // stays there after the mouse leaves. So "focus" stayed true forever and
  // autoplay never restarted. :focus-visible = "focus the browser would draw a
  // focus ring for": true after Tab, false after a mouse click on a button.
  function isKeyboardFocus(el) {
    try { return el.matches(":focus-visible"); }
    catch (error) { return true; }   // very old browser without :focus-visible: play safe, pause
  }
  // = (not "set to true"): if someone tabs in and then clicks another dot with
  // the mouse, the flag follows the CURRENT focus and switches back off.
  block.addEventListener("focusin", (event) => {
    pausedBecause.focus = isKeyboardFocus(event.target);
    updateAutoplay();
  });
  block.addEventListener("focusout", (event) => {
    if (!block.contains(event.relatedTarget)) { pausedBecause.focus = false; updateAutoplay(); }
  });

  // The Pause / Play button. Its label and icon always say what pressing it WILL do.
  pauseBtn.hidden = false;
  pauseBtn.addEventListener("click", () => {
    pausedBecause.button = !pausedBecause.button;
    pauseBtn.setAttribute("aria-label", pausedBecause.button ? "Play testimonials" : "Pause testimonials");
    pauseBtn.innerHTML = pausedBecause.button ? ICON_PLAY : ICON_PAUSE;
    updateAutoplay();
  });
})();
