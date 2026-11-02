/* =========================================================
   Trinetra Creations: Journal article page script (Day 11)
   ONE page shows ANY article. The address decides which:
     journal-post.html?post=why-your-logo-is-not-your-brand
   Same recipe as js/case.js:
   1. Read the slug from the address (URLSearchParams)
   2. Find it in POSTS (js/posts.js)
   3. Build the article, or a friendly "not found" message
   4. Update the tab title and meta description
   Needs js/posts.js and js/helpers.js loaded first.
   ========================================================= */

(function () {
  "use strict";

  const main = document.getElementById("main");

  // Data or helpers missing? Stop: the fallback message in journal-post.html stays.
  if (!main || typeof POSTS === "undefined" ||
      typeof escapeHTML !== "function" || typeof formatDate !== "function") return;

  const e = escapeHTML;
  const SITE = "Trinetra Creations";

  /* ---------- 1. Read the address ----------
     "?post=Why-Your-Logo" → "why-your-logo" (trim + lowercase forgive small typos).
     .get() gives null when there's no ?post= at all; || "" turns that into "". */
  const params = new URLSearchParams(location.search);
  const slug = (params.get("post") || "").trim().toLowerCase();

  /* ---------- 2. Find the article (its POSITION, for previous/next) ---------- */
  const index = POSTS.findIndex((post) => post.slug === slug);

  if (index === -1) {
    showNotFound(slug);
    return;
  }

  /* ---------- 3. Previous / next, wrapping round the ends (the % trick from Day 5) ---------- */
  const total = POSTS.length;
  const post = POSTS[index];
  const prev = POSTS[(index - 1 + total) % total];
  const next = POSTS[(index + 1) % total];

  main.innerHTML = articleHTML(post, prev, next);

  /* ---------- 4. Tab title + meta description for THIS article ----------
     document.title and setAttribute treat text as plain text: no escaping needed. */
  // Day 14: "| Journal" removed (it pushed titles to 62–86 characters; search results
  // cut at about 60). Over 62 characters, we drop " | Trinetra Creations" too and keep
  // the article's own words. The intros (115–143 characters) are already a good
  // description length, so they're used as they are.
  const fullTitle = `${post.title} | ${SITE}`;
  const pageTitle = fullTitle.length <= 62 ? fullTitle : post.title;

  document.title = pageTitle;
  setMeta('meta[name="description"]', post.intro);
  setMeta('meta[property="og:title"]', pageTitle);
  setMeta('meta[property="og:description"]', post.intro);
  setMeta('meta[name="twitter:title"]', pageTitle);               // Day 14: X (Twitter) card too
  setMeta('meta[name="twitter:description"]', post.intro);
  // Canonical + og:url with THIS article's address (shared helper in js/helpers.js)
  if (typeof setPageAddress === "function") setPageAddress(postLink(post));


  /* ======================= Helper functions ======================= */

  function setMeta(selector, text) {
    const tag = document.querySelector(selector);
    if (tag) tag.setAttribute("content", text);
  }

  function postLink(p) {
    return `journal-post.html?post=${encodeURIComponent(p.slug)}`;
  }

  /* The body: a string = a paragraph (<p>), { heading } = a sub-heading (<h2>).
     typeof tells them apart. Anything else (a typo in posts.js) is skipped. */
  function bodyHTML(blocks) {
    return blocks.map((block) => {
      if (typeof block === "string") return `<p>${e(block)}</p>`;
      if (block && block.heading) return `<h2>${e(block.heading)}</h2>`;
      return "";
    }).join("");
  }

  /* ---------- The whole article ----------
     <article> = a complete piece that makes sense on its own (an article, a post).
     RULE: every ${...} that holds DATA goes through e(). */
  function articleHTML(p, prev, next) {
    const badge = SHOW_SAMPLE_POSTS ? '<span class="badge post-hero__badge">Sample article</span>' : "";

    return `
      <article class="post" aria-labelledby="post-title">
        <!-- Article header: the same soft glow as other page intros -->
        <header class="page-intro post-hero">
          <div class="container post-narrow">
            <a class="post-back" href="journal.html">&larr; All articles</a>
            <p class="eyebrow">${e(p.category)}</p>
            <h1 id="post-title">${e(p.title)}</h1>
            <p class="post-meta">
              <time datetime="${e(p.date)}">${e(formatDate(p.date))}</time>
              <span aria-hidden="true">·</span>
              <span>${e(p.readingTime)} min read</span>
            </p>
            ${badge}
            <p class="page-intro__lead">${e(p.intro)}</p>
          </div>
        </header>

        <!-- The article text, in a narrow column (easier to read) -->
        <div class="container post-narrow">
          <div class="post-body">${bodyHTML(p.body)}</div>
        </div>
      </article>

      <!-- PREVIOUS / NEXT ARTICLE (shared styles in components.css, section 9) -->
      <nav class="container case-pager post-pager" aria-label="More articles">
        <a class="case-pager__link" href="${e(postLink(prev))}" rel="prev">
          <span class="case-pager__dir">&larr; Previous article</span>
          <span class="case-pager__title">${e(prev.title)}</span>
        </a>
        <a class="case-pager__link case-pager__link--next" href="${e(postLink(next))}" rel="next">
          <span class="case-pager__dir">Next article &rarr;</span>
          <span class="case-pager__title">${e(next.title)}</span>
        </a>
      </nav>

      <!-- CLOSING CALL TO ACTION -->
      <section class="section" aria-labelledby="cta-title">
        <div class="container">
          <div class="cta-band" data-scroll>
            <h2 id="cta-title">Want this kind of thinking for your brand?</h2>
            <p>Don't know how to advertise yourself? Ask us, we will guide you.</p>
            <a class="btn btn--primary" href="consultation.html">Book a free consultation</a>
          </div>
        </div>
      </section>`;
  }

  /* ---------- "We couldn't find that article" ----------
     badSlug comes straight from the address bar, so ANYONE can type
     anything there, including HTML. That's why it goes through e(). */
  function showNotFound(badSlug) {
    const typed = badSlug
      ? `<p class="case-missing__slug">We looked for: <code>${e(badSlug)}</code></p>`
      : "";

    main.innerHTML = `
      <section class="page-intro case-missing" aria-labelledby="missing-title">
        <div class="container">
          <span class="eyebrow">Journal</span>
          <h1 id="missing-title">We couldn't find that article.</h1>
          <p class="page-intro__lead">
            The link may be old or mistyped. Every article is on the Journal page.
          </p>
          ${typed}
          <a class="btn btn--primary case-missing__btn" href="journal.html">&larr; Back to the Journal</a>
        </div>
      </section>`;

    document.title = `Article not found | ${SITE}`;
    setMeta('meta[name="description"]', "This article could not be found. See every article on the Journal page.");

    // Ask search engines not to list this "not found" version of the page
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);
  }
})();
