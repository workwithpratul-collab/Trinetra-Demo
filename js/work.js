/* =========================================================
   Trinetra Creations: Work page script (Day 4)
   1. Builds a card for EVERY project in js/projects.js
   2. Runs the category filter buttons
   Needs js/projects.js and js/project-card.js loaded first.
   ========================================================= */

(function () {
  "use strict";

  const grid = document.getElementById("project-grid");
  const filterBar = document.getElementById("filters");
  const status = document.getElementById("filter-status");
  const fallback = document.getElementById("work-fallback");

  // If anything we need is missing, stop here. Nothing has been hidden yet,
  // so the page simply shows its fallback message: it never hides content by mistake.
  if (!grid || !filterBar || !status ||
      typeof PROJECTS === "undefined" || typeof projectCardHTML !== "function") return;

  /* ---------- 1. Build all the cards ---------- */
  grid.innerHTML = PROJECTS.map((project) => projectCardHTML(project)).join("");
  if (fallback) fallback.remove();          // cards are here, so the message can go

  const cards = grid.querySelectorAll(".project-card");
  const buttons = filterBar.querySelectorAll(".filter-btn");

  /* ---------- 2. The filter ---------- */
  // category is "all" or a category name such as "Packaging"
  function applyFilter(category) {
    let shown = 0;

    // Show matching cards, hide the rest with the hidden attribute
    cards.forEach(function (card) {
      const matches = category === "all" || card.dataset.category === category;
      card.hidden = !matches;               // card.hidden = true adds <li hidden>
      if (matches) shown++;
    });

    // Only the clicked button is "pressed". Screen readers announce
    // "pressed" / "not pressed", and our CSS styles the pressed one.
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.filter === category));
    });

    // Update the live line: screen readers read the new text aloud.
    // "1 project" vs "2 projects": add the s only when it isn't exactly 1.
    status.textContent = `Showing ${shown} project${shown === 1 ? "" : "s"}`;
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyFilter(button.dataset.filter);
    });
  });

  // Everything worked: show the filter bar and start with "All"
  filterBar.hidden = false;
  applyFilter("all");
})();
