/* =========================================================
   Trinetra Creations: case-study page script (Day 5)
   ONE page shows ANY project. The address decides which:
     case-study.html?project=mitti-cafe
   1. Read the project id from the address (URLSearchParams)
   2. Find it in PROJECTS (js/projects.js)
   3. Build the page, or a friendly "not found" message
   4. Update the tab title and meta description
   Needs js/projects.js and js/helpers.js loaded first.
   ========================================================= */

(function () {
  "use strict";

  const main = document.getElementById("main");

  // If the data or helpers failed to load, stop. The fallback message
  // in case-study.html stays on screen, so the visitor isn't left with a blank page.
  if (!main || typeof PROJECTS === "undefined" || typeof escapeHTML !== "function") return;

  const e = escapeHTML;                        // short name, used in every template below
  const SITE = "Trinetra Creations";

  /* ---------- 1. Read the address ----------
     location.search is everything from the "?" onwards: "?project=mitti-cafe".
     URLSearchParams splits it into name/value pairs and decodes it for us
     (%20 back into a space, and so on).
     .get() returns null if there is no ?project= at all. */
  const params = new URLSearchParams(location.search);
  const slug = (params.get("project") || "").trim().toLowerCase();

  /* ---------- 2. Find the project ----------
     findIndex returns the position in the list (0, 1, 2…) or -1 if nothing matches.
     We want the POSITION (not just the project) so we can find previous/next. */
  const index = PROJECTS.findIndex((project) => project.id === slug);

  /* ---------- 3a. Not found ---------- */
  if (index === -1) {
    showNotFound(slug);
    return;
  }

  /* ---------- 3b. Found: work out previous and next ----------
     The % (remainder) trick wraps around the ends of the list:
     after the last project comes the first, before the first comes the last. */
  const total = PROJECTS.length;
  const project = PROJECTS[index];
  const prev = PROJECTS[(index - 1 + total) % total];
  const next = PROJECTS[(index + 1) % total];

  main.innerHTML = caseStudyHTML(project, prev, next);

  /* ---------- 4. Tab title + meta description for THIS project ----------
     document.title and setAttribute treat our text as plain text, never as HTML,
     so they don't need escapeHTML (only innerHTML does). */
  // Day 14: search results cut titles at about 60 characters. If "Client: Title | Trinetra
  // Creations" is longer than 62, we drop the " | Trinetra Creations" end rather than lose
  // words that describe the project (Google shows the site name separately anyway).
  const fullTitle = `${project.client}: ${project.title} | ${SITE}`;
  const pageTitle = fullTitle.length <= 62 ? fullTitle : `${project.client}: ${project.title}`;
  // The summaries are 78–105 characters; the extra sentence brings them to the 120–155 range
  const pageDescription = `${project.summary} A case study by ${SITE}.`;

  document.title = pageTitle;
  setMeta('meta[name="description"]', pageDescription);
  setMeta('meta[property="og:title"]', pageTitle);
  setMeta('meta[property="og:description"]', pageDescription);
  setMeta('meta[name="twitter:title"]', pageTitle);              // Day 14: X (Twitter) card too
  setMeta('meta[name="twitter:description"]', pageDescription);
  // Canonical + og:url with THIS project's address (shared helper in js/helpers.js)
  if (typeof setPageAddress === "function") setPageAddress(caseLink(project));

  // The result numbers count up when scrolled into view (shared helper)
  animateCounters(main.querySelectorAll("[data-count]"));


  /* =======================================================
     Helper functions (function declarations are "hoisted":
     JavaScript lets us call them above where they're written)
     ======================================================= */

  // Change the content="" of one <meta> tag, if it exists
  function setMeta(selector, text) {
    const tag = document.querySelector(selector);
    if (tag) tag.setAttribute("content", text);
  }

  // Link to another case study (encodeURIComponent: make the id safe in an address)
  function caseLink(p) {
    return `case-study.html?project=${encodeURIComponent(p.id)}`;
  }

  /* ---------- The full case study, as one HTML string ----------
     RULE: every ${...} that holds DATA goes through e() (escapeHTML).
     The only things NOT escaped are HTML strings we built ourselves
     a few lines earlier (servicesHTML, stepsHTML…), whose data was escaped inside. */
  function caseStudyHTML(p, prev, next) {
    const badge = SHOW_SAMPLE_LABELS ? '<span class="badge">Sample project</span>' : "";

    // Day 6: optional hero photo (same image field as the card).
    // NOT lazy here: the hero is the first thing on screen, so we want it now.
    // fetchpriority="high" asks the browser to download it before other images.
    // onerror: if the file is missing, remove the <img> AND the "--photo" class,
    // so the page falls back to the gradient art with its rings.
    const photo = p.image
      ? `<img class="case-hero__photo" src="${e(p.image)}" alt=""
              width="1600" height="1200" fetchpriority="high" decoding="async"
              onerror="this.closest('.case-hero').classList.remove('case-hero--photo'); this.remove()">`
      : "";
    // Extra class when there's a photo, so the CSS can hide the decorative rings
    const heroClass = p.image ? "case-hero case-hero--photo" : "case-hero";

    // Services → one <li> each
    const servicesHTML = p.services.map((s) => `<li>${e(s)}</li>`).join("");

    // Approach steps → a numbered list (<ol> = ordered list)
    // Day 6: if a step starts with a short label and a colon ("Research: we…"),
    // show the label in bold. indexOf returns -1 when there's no ": " at all;
    // the < 20 check stops a colon later in a long sentence from being used.
    const stepsHTML = p.approach.map((step) => {
      const colon = step.indexOf(": ");
      if (colon > 0 && colon < 20) {
        const label = step.slice(0, colon);          // "Research"
        const rest = step.slice(colon + 2);          // "we spent two mornings…"
        return `<li><strong class="case-steps__label">${e(label)}</strong> ${e(rest)}</li>`;
      }
      return `<li>${e(step)}</li>`;
    }).join("");

    // Results → the final number is written in the HTML (for reduced motion / no JS),
    // data-count and data-suffix tell the counter what to count up to.
    const resultsHTML = p.results.map((r) => `
      <li class="case-result">
        <span class="case-result__num text-gradient"
              data-count="${e(r.value)}" data-suffix="${e(r.suffix)}">${e(r.value)}${e(r.suffix)}</span>
        <span class="case-result__label">${e(r.label)}</span>
      </li>`).join("");

    return `
      <!-- HERO: the project's own two colours become the "art" behind the title -->
      <section class="${heroClass}" aria-labelledby="case-title"
               style="--from: ${e(p.colors[0])}; --to: ${e(p.colors[1])};">
        <div class="case-hero__art" aria-hidden="true">
          ${photo}
          <span class="case-hero__ring case-hero__ring--1"></span>
          <span class="case-hero__ring case-hero__ring--2"></span>
          <span class="case-hero__ring case-hero__ring--3"></span>
        </div>
        <div class="container case-hero__content">
          <a class="case-back" href="work.html">&larr; All work</a>
          <!-- Two "unbreakable" halves: a long line can only wrap at the dot -->
          <p class="eyebrow">
            <span class="case-eyebrow__part">${e(p.client)}</span> ·
            <span class="case-eyebrow__part">${e(p.category)}</span>
          </p>
          <h1 id="case-title">${e(p.title)}</h1>
          <p class="case-hero__lead">${e(p.summary)}</p>
          ${badge}

          <!-- <dl> = description list: pairs of a term (dt) and its value (dd) -->
          <dl class="case-facts">
            <div><dt>Client</dt><dd>${e(p.client)}</dd></div>
            <div><dt>Year</dt><dd>${e(p.year)}</dd></div>
            <div class="case-facts__services">
              <dt>Services</dt>
              <dd><ul class="case-tags" role="list">${servicesHTML}</ul></dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- CHALLENGE + APPROACH: side by side on desktop, stacked on phones -->
      <section class="section" aria-label="The story">
        <div class="container case-story" data-scroll>
          <div>
            <h2 class="case-h2">The challenge</h2>
            <p class="case-text">${e(p.challenge)}</p>
          </div>
          <div>
            <h2 class="case-h2">Our approach</h2>
            <ol class="case-steps" role="list">${stepsHTML}</ol>
          </div>
        </div>
      </section>

      <!-- RESULTS: numbers count up when they scroll into view -->
      <section class="section case-results-section" aria-labelledby="results-title">
        <div class="container" data-scroll>
          <h2 id="results-title" class="case-h2">The results</h2>
          <ul class="case-results" role="list">${resultsHTML}</ul>
          ${SHOW_SAMPLE_LABELS ? '<p class="case-note">Sample numbers for preview.</p>' : ""}
        </div>
      </section>

      <!-- CLIENT QUOTE: <figure> groups the quote with who said it (<figcaption>) -->
      <section class="section" aria-label="What the client said">
        <div class="container" data-scroll>
          <figure class="case-quote">
            <blockquote><p>${e(p.quote.text)}</p></blockquote>
            <figcaption>
              <strong>${e(p.quote.name)}</strong>
              <span>${e(p.quote.role)}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <!-- PREVIOUS / NEXT PROJECT -->
      <nav class="container case-pager" aria-label="More projects">
        <a class="case-pager__link" href="${e(caseLink(prev))}" rel="prev">
          <span class="case-pager__dir">&larr; Previous project</span>
          <span class="case-pager__title">${e(prev.client)}</span>
        </a>
        <a class="case-pager__link case-pager__link--next" href="${e(caseLink(next))}" rel="next">
          <span class="case-pager__dir">Next project &rarr;</span>
          <span class="case-pager__title">${e(next.client)}</span>
        </a>
      </nav>

      <!-- CLOSING CALL TO ACTION (same component as Home and Work) -->
      <section class="section" aria-labelledby="cta-title">
        <div class="container">
          <div class="cta-band" data-scroll>
            <h2 id="cta-title">Want results like these?</h2>
            <p>Don't know how to advertise yourself? Ask us, we will guide you.</p>
            <a class="btn btn--primary" href="consultation.html">Book a free consultation</a>
          </div>
        </div>
      </section>`;
  }

  /* ---------- "We couldn't find that project" ----------
     Shown when ?project= is missing or doesn't match any id. */
  function showNotFound(badSlug) {
    // Repeat what they typed, so they can spot a typo.
    // This is EXACTLY why we escape: badSlug comes straight from the address bar,
    // and ANYONE can type anything there (including HTML or script).
    const typed = badSlug
      ? `<p class="case-missing__slug">We looked for: <code>${e(badSlug)}</code></p>`
      : "";

    main.innerHTML = `
      <section class="page-intro case-missing" aria-labelledby="missing-title">
        <div class="container">
          <span class="eyebrow">Case study</span>
          <h1 id="missing-title">We couldn't find that project.</h1>
          <p class="page-intro__lead">
            The link may be old or mistyped. All our projects are on the Work page.
          </p>
          ${typed}
          <a class="btn btn--primary case-missing__btn" href="work.html">&larr; Back to all work</a>
        </div>
      </section>`;

    document.title = `Project not found | ${SITE}`;
    setMeta('meta[name="description"]', "This project could not be found. See all our work on the Work page.");

    // Ask search engines not to list this "not found" version of the page
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);
  }
})();
