/* =========================================================
   Trinetra Creations: Home page script (Day 2)
   Job: play a short intro once per visit, then reveal the hero.
   Loaded only by index.html (with "defer", so the HTML is ready first).
   ========================================================= */

(function () {
  "use strict";

  const root = document.documentElement;   // the <html> element: our CSS listens to classes on it

  // Adding "is-ready" is the signal for the CSS to reveal the hero text
  function ready() {
    root.classList.add("is-ready");
  }

  // Has this browser tab already seen the intro? sessionStorage lasts until the tab closes.
  // try/catch because some browsers block storage; the intro still plays then.
  let seen = false;
  try {
    seen = sessionStorage.getItem("trinetra-intro") === "1";
  } catch (error) { /* ignore */ }

  // Visitors who asked their device for less motion never see the intro
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Nothing to play: reveal the hero straight away
  if (seen || reduceMotion) {
    ready();
    return;
  }

  try {
    sessionStorage.setItem("trinetra-intro", "1");   // remember, so it only plays once
  } catch (error) { /* ignore */ }

  // ---------- Build the intro curtain ----------
  // aria-hidden: it is decoration, so screen readers skip it.
  // The image path is relative (no leading "/") so GitHub Pages works.
  const intro = document.createElement("div");
  intro.className = "intro";
  intro.setAttribute("aria-hidden", "true");
  intro.innerHTML = `
    <img class="intro__mark" src="assets/logo.svg" alt="" width="88" height="84">
    <span class="intro__bar"></span>
    <p class="intro__tag">Imagine · Believe · Achieve</p>`;
  document.body.appendChild(intro);
  root.classList.add("intro-active");                // stops scrolling behind the curtain

  // ---------- Lift the curtain (once only) ----------
  let finished = false;
  function finish() {
    if (finished) return;                            // clicking and the timer must not both run it
    finished = true;
    intro.classList.add("is-leaving");               // CSS fades it out and slides it up
    root.classList.remove("intro-active");
    ready();                                         // the hero starts revealing as the curtain lifts
    window.setTimeout(() => intro.remove(), 800);    // delete it from the page after the fade
  }

  window.setTimeout(finish, 1900);                   // lift automatically after 1.9 seconds
  intro.addEventListener("click", finish);           // or let visitors click to skip
})();