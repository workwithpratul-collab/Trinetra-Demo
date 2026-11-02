/* =========================================================
   Trinetra Creations: Home sections script (Day 3)
   1. Builds the 3 featured work cards from js/projects.js
   2. Counts the stats up when they scroll into view
   Needs js/projects.js to load FIRST (see the order in index.html).
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. Featured work cards ---------- */
  const grid = document.getElementById("work-grid");

  // typeof checks: if projects.js or project-card.js failed to load, these don't
  // exist. We stop quietly instead of crashing the rest of this script.
  if (grid && typeof PROJECTS !== "undefined" && typeof projectCardHTML === "function") {
    const featured = PROJECTS.filter((project) => project.featured).slice(0, 3);

    // Turn each project into card HTML (shared template in js/project-card.js),
    // then join them into one string.
    grid.innerHTML = featured.map((project) => projectCardHTML(project)).join("");
  }

  /* ---------- 2. Animated counters ----------
     The counting code now lives in js/helpers.js (shared with the case study).
     If helpers.js failed to load, the final numbers in the HTML simply stay put. */
  if (typeof animateCounters === "function") {
    animateCounters(document.querySelectorAll("[data-count]"));
  }
})();
