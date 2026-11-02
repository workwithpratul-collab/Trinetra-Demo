/* =========================================================
   Trinetra Creations: shared helpers (Day 5)
   Small functions that more than one page needs.
   This file only DEFINES functions; pages call them.
   Load it before any script that uses them.
   ========================================================= */

/* ---------- 0. SITE_URL: the site's web address (Day 14) ----------
   Used by js/case.js and js/journal-post.js to write each page's canonical
   link and og:url (the full, official address of that page). No slash at the end. */
const SITE_URL = "https://www.example-trinetra.com";

/* ---------- 1. escapeHTML(text) ----------
   Makes text safe to put inside an HTML template string.
   The browser treats < > & " ' as code characters. We swap each one
   for its "entity" (a code that DISPLAYS the character instead of obeying it):
     "Tom & Jerry <3"  →  "Tom &amp; Jerry &lt;3"
   On screen the visitor still sees: Tom & Jerry <3
   Use it on EVERY piece of data that goes into innerHTML. */
function escapeHTML(value) {
  return String(value ?? "")           // ?? "": undefined/null become "" instead of "undefined"
    .replace(/&/g, "&amp;")            // & first, or we'd double-escape the others
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")           // matters inside attributes: href="..."
    .replace(/'/g, "&#39;");
}

/* ---------- 2. animateCounters(elements) ----------
   Counts numbers up from 0 when they scroll into view.
   (Moved here from home-sections.js on Day 5, so Home and the
   case study share ONE counter.)
   Each element needs: data-count="120" and optionally data-suffix="+".
   Its HTML should already show the FINAL number ("120+"), so people
   with reduced motion or an old browser still see the right value. */
function animateCounters(elements) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!elements.length || reduceMotion || !("IntersectionObserver" in window)) return;

  // Count one number from 0 up to its target over about 1.6 seconds
  function countUp(el) {
    const target = Number(el.dataset.count);   // data-count="120" → 120
    const suffix = el.dataset.suffix || "";    // data-suffix="+"  → "+"
    const duration = 1600;
    const start = performance.now();

    // requestAnimationFrame runs this once per screen refresh (about 60 times a second)
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);   // 0 → 1
      const eased = 1 - Math.pow(1 - progress, 3);              // fast start, gentle finish
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Start every counter at 0 (only now that we know we'll animate it)
  elements.forEach((el) => { el.textContent = "0" + (el.dataset.suffix || ""); });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        observer.unobserve(entry.target);        // count once only
      });
    },
    { threshold: 0.6 }                           // start when 60% of the number is visible
  );
  elements.forEach((el) => observer.observe(el));
}

/* ---------- 3. formatDate("2026-10-20") → "20 October 2026" (Day 11) ----------
   Used by the Journal. Intl.DateTimeFormat is the browser's built-in
   date formatter: "en-IN" = the Indian English style (day, month, year).
   timeZone "UTC": new Date("2026-10-20") means midnight in UTC. Without this,
   a visitor in a time zone behind UTC (e.g. the USA) would see 19 October. */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return String(isoDate);   // a typo in the date: show it as typed
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(date);
}

/* ---------- 4. setPageAddress("case-study.html?project=mitti-cafe") (Day 14) ----------
   For pages that JavaScript fills in (case study, journal article). One HTML file
   shows many projects/articles, so the HTML can't hold a fixed canonical.
   This adds, for the item on screen:
     <link rel="canonical" href="https://…/case-study.html?project=mitti-cafe">
     <meta property="og:url" content="https://…/case-study.html?project=mitti-cafe">
   Google runs JavaScript, so it sees these. Never call it on a "not found" page
   (those get noindex instead). */
function setPageAddress(path) {
  const url = `${SITE_URL}/${path}`;

  const link = document.createElement("link");
  link.rel = "canonical";
  link.href = url;
  document.head.appendChild(link);

  const meta = document.createElement("meta");
  meta.setAttribute("property", "og:url");     // "property" (not "name") is the Open Graph style
  meta.content = url;
  document.head.appendChild(meta);
}
