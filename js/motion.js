/* =========================================================
   Trinetra Creations: shared scroll reveal (Day 3)
   Any element with the attribute data-scroll fades in when it
   scrolls into view. Works on every page that loads this file.
   ========================================================= */

(function () {
  "use strict";

  // Day 12: js/motion-gsap.js (loaded just before this file) sets this flag
  // when GSAP loaded and is doing the reveals. Then THIS file is only the
  // fallback, so it steps aside: two systems hiding the same things = flicker.
  if (window.TRINETRA_GSAP_MOTION) return;

  const items = document.querySelectorAll("[data-scroll]");

  // Stop early (leave everything visible) when:
  //  - the page has nothing to reveal
  //  - the browser is too old for IntersectionObserver
  //  - the visitor asked their device for less motion
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!items.length || !("IntersectionObserver" in window) || reduceMotion) return;

  // Day 12: anything ALREADY on screen is marked visible BEFORE the hiding
  // starts, so it never disappears and fades back in when a page opens
  // (that blink made page changes feel abrupt). Only content below the
  // screen waits for you to scroll to it.
  items.forEach(function (item) {
    if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add("is-visible");
  });

  // Only NOW is it safe to hide things: this class switches on the
  // "hidden until revealed" CSS in css/components.css.
  document.documentElement.classList.add("motion-ready");

  // IntersectionObserver = the browser tells us when an element enters the screen,
  // instead of us checking on every scroll event (much lighter on phones).
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");  // CSS fades it in
        observer.unobserve(entry.target);          // reveal once, then stop watching
      });
    },
    {
      // BUG FIX: start the fade the moment ANY pixel enters the screen.
      // Before, an element had to be 15% visible AND 40px above the bottom
      // edge, so a card could sit on screen at opacity 0 (invisible, but
      // still clickable) while you wondered why "nothing is there".
      threshold: 0,
      rootMargin: "0px",
    }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
})();
