/* =========================================================
   Trinetra Creations: scroll motion with GSAP (Day 12)
   Needs (loaded just before this file, in the <head>):
     gsap.min.js + ScrollTrigger.min.js (CDN, pinned to 3.15.0)
   Does four things:
     1. a thin brand-gradient scroll-progress bar under the header
     2. a gentle parallax on the Home hero and the case-study hero
     3. staggered fade-up of the cards in the services, work and journal grids
     4. fade-up of every other [data-scroll] block (replacing the CSS version)
   SAFETY RULES
     - No GSAP (CDN down, wrong fingerprint)?  Stop. js/motion.js does the
       old CSS fade-in instead, so nothing changes for the visitor.
     - Reduced motion?  Do nothing at all: everything visible and still.
     - Only things BELOW the screen are ever hidden, and each one is shown
       again the moment it scrolls in. Content you can already see never blinks.
     - Every animation ends with clearProps: GSAP removes its inline styles,
       so the cards' own hover lift (in CSS) works again.
   ========================================================= */

(function () {
  "use strict";

  // ---------- 0. Can we run? ----------
  // window.gsap / window.ScrollTrigger only exist if the CDN files loaded.
  if (!window.gsap || !window.ScrollTrigger) return;   // → motion.js takes over

  // Visitors who asked for less motion: leave the page completely still.
  // motion.js also does nothing for them, so it doesn't matter who "owns" it.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);   // GSAP plugins must be registered once

  // Tell js/motion.js (the next script) that GSAP is handling the reveals,
  // so it must NOT add its CSS hiding as well (two systems = flicker).
  window.TRINETRA_GSAP_MOTION = true;

  // Everything we hide, so we can show it all again if something goes wrong
  const hidden = [];

  // Grids of cards: each CARD fades up, one after the other (a "stagger").
  // Everything else with data-scroll: the block fades up as one piece.
  // .work-grid also covers the Journal list (class="work-grid post-grid").
  // NOTE: constants must be declared ABOVE the code that uses them. Functions
  // are "hoisted" (usable before their line), but `const` is not: reading it
  // too early throws an error (the "temporal dead zone").
  const CARD_GRIDS = ".services-grid, .work-grid";

  try {
    addProgressBar();
    addParallax();
    addReveals();
    keepPositionsFresh();
    keepAnchorJumps();
  } catch (error) {
    // Something unexpected: undo our hiding and hand over to the CSS version.
    console.warn("motion-gsap.js stopped, using the CSS fallback:", error);
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (hidden.length) gsap.set(hidden, { clearProps: "opacity,transform,transition" });
    window.TRINETRA_GSAP_MOTION = false;   // motion.js runs right after us and sees this
  }

  // ---------- 1. Scroll-progress bar ----------
  // A 2px gradient line along the bottom of the header that grows from left
  // (top of page) to right (end of page). Styles: css/components.css, section 10.
  function addProgressBar() {
    const header = document.getElementById("site-header");
    if (!header) return;

    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");   // decoration: screen readers skip it
    header.appendChild(bar);

    // scaleX 0 → 1 between the very top (start: 0) and the very bottom ("max").
    // scrub: 0.3 = follow the scrollbar, with 0.3s of smoothing so it glides.
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",                            // straight line: 50% scrolled = 50% bar
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  }

  // ---------- 2. Parallax on the two heroes ----------
  // PARALLAX = the background moves slower than the page, which feels like depth.
  // We move it with a CSS variable (--parallax-y) and the separate CSS
  // `translate` property, NOT GSAP's usual `y`. Why: the Home hero background
  // already uses `transform` for its slow zoom-in (css/home.css). Two things
  // fighting over `transform` would cancel each other out; `translate` is a
  // different property, so the zoom and the parallax simply add up.
  function addParallax() {
    const heroes = [
      { section: ".hero", layer: ".hero__media" },          // Home
      { section: ".case-hero", layer: ".case-hero__art" },  // Case study (built by case.js)
    ];

    heroes.forEach(function (hero) {
      const section = document.querySelector(hero.section);
      const layer = section && section.querySelector(hero.layer);
      if (!layer) return;                     // this page doesn't have that hero

      layer.classList.add("parallax-layer");  // switches on `translate: 0 var(--parallax-y)`

      // From the top of the page until the hero has scrolled out of sight,
      // slide the background down by 20% of its own height. The page moves
      // 100%, the background effectively only 80%: gentle depth, no seasickness.
      gsap.fromTo(layer,
        { "--parallax-y": "0%" },
        {
          "--parallax-y": "20%",
          ease: "none",
          scrollTrigger: { trigger: section, start: 0, end: "bottom top", scrub: true },
        }
      );
    });
  }

  // ---------- 3 + 4. Fade-up reveals ----------
  // (CARD_GRIDS, the list of card grids, is at the top of this file.)
  function addReveals() {
    const toReveal = [];

    document.querySelectorAll("[data-scroll]").forEach(function (block) {
      // A grid gives us its cards; any other block is revealed on its own
      const pieces = block.matches(CARD_GRIDS) ? Array.from(block.children) : [block];
      pieces.forEach(function (piece) {
        if (isBelowScreen(piece)) toReveal.push(piece);
        // Already on screen (or above it)? Leave it alone: it's already visible.
      });
    });

    if (!toReveal.length) return;

    // Hide them, slightly lower than their real place.
    // transition: "none" switches off the card's own CSS transition WHILE GSAP
    // animates it (a CSS transition on transform would make every GSAP frame lag).
    // NOT visibility:hidden or display:none: those would change the layout.
    gsap.set(toReveal, { opacity: 0, y: 24, transition: "none" });
    hidden.push(...toReveal);

    // ScrollTrigger.batch: watches all of them, and groups the ones that enter
    // the screen at the same moment, so a row of cards staggers nicely.
    ScrollTrigger.batch(toReveal, {
      start: "top 95%",        // when the item's top passes 95% down the screen
      once: true,              // reveal once, then stop watching
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,       // each card starts 0.08s after the one before
          overwrite: true,
          // Remove ALL our inline styles at the end: the element is back to
          // exactly what css/*.css says (hover lift and transitions included).
          clearProps: "opacity,transform,transition",
        });
      },
    });
  }

  // True when the element's top edge is lower than the bottom of the screen
  function isBelowScreen(el) {
    if (el.hidden) return false;   // filtered-out work cards (hidden attribute) stay as they are
    return el.getBoundingClientRect().top > window.innerHeight;
  }

  // ---------- 5. Keep ScrollTrigger's measurements up to date ----------
  // ScrollTrigger works out WHERE each item is once, then remembers it.
  // If the page later changes height (Work filters hide cards, fonts arrive,
  // the order picker opens step 2), those remembered positions go stale and a
  // hidden card might never be told to appear. A ResizeObserver tells us when
  // the page's height changes; then we ask ScrollTrigger to measure again.
  function keepPositionsFresh() {
    if (!("ResizeObserver" in window)) return;
    let lastHeight = document.body.offsetHeight;
    let timer = null;
    new ResizeObserver(function () {
      const height = document.body.offsetHeight;
      if (height === lastHeight) return;   // width-only changes: ScrollTrigger handles those itself
      lastHeight = height;
      clearTimeout(timer);                 // wait until the changes settle (debounce)
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    }).observe(document.body);
  }

  // ---------- 6. Keep links to a spot on a page working (services.html#ads) ----------
  // BUG FOUND IN TESTING: when the page finishes loading, ScrollTrigger measures
  // everything again (a "refresh") and puts the scroll position back where it
  // found it. That cancelled the browser's smooth jump to #order / #ads /
  // #form-title half-way, leaving visitors at the top of the page.
  // Fix: if the address has a #target, turn smooth scrolling off for a moment
  // and jump to the target ourselves after that refresh (details below).
  function keepAnchorJumps() {
    if (!location.hash) return;
    let target = null;
    try {
      target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    } catch (error) { /* a broken address like "#%E0" can't be decoded: ignore it */ }
    if (!target) return;

    // If the visitor already started scrolling on their own, don't yank them back
    let visitorMoved = false;
    ["wheel", "touchstart", "keydown"].forEach(function (type) {
      window.addEventListener(type, () => { visitorMoved = true; }, { once: true, passive: true });
    });

    // (Smooth scrolling is already OFF here: a tiny script in each page's <head>
    // switches it off when the address has a #, BEFORE the page is read, and
    // back on 2 seconds after load. It used to be here, but this file waits for
    // the GSAP download, and by then the browser could already be gliding past
    // the target: 1 overshoot in 7 cold visits. In the <head>: see test notes.)

    // The page can still shift a little just after loading (fonts arriving,
    // a note being added), which moves the target. So we jump again after
    // every ScrollTrigger refresh AND when fonts finish loading...
    let settled = false;
    function jump() {
      if (settled || visitorMoved || document.readyState !== "complete") return;
      // scroll-margin-top in our CSS keeps the target clear of the sticky header.
      target.scrollIntoView({ behavior: "instant" });
    }
    ScrollTrigger.addEventListener("refresh", jump);                     // after each re-measure
    if (document.fonts) document.fonts.addEventListener("loadingdone", jump);  // after fonts arrive

    // ...but only for 2 seconds after "load". Then stop listening and never
    // move the page again.
    window.addEventListener("load", function () {
      setTimeout(function () {
        settled = true;
        ScrollTrigger.removeEventListener("refresh", jump);
        if (document.fonts) document.fonts.removeEventListener("loadingdone", jump);
      }, 2000);
    });
  }
})();
