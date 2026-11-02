/* =========================================================
   Trinetra Creations: Journal page script (Day 11)
   Builds one card for EVERY article in js/posts.js,
   using the same card styles as the Work page.
   Needs js/posts.js and js/helpers.js loaded first.
   ========================================================= */

(function () {
  "use strict";

  const grid = document.getElementById("post-grid");
  const fallback = document.getElementById("journal-fallback");

  // Anything missing? Stop. The fallback message stays on screen.
  if (!grid || typeof POSTS === "undefined" ||
      typeof escapeHTML !== "function" || typeof formatDate !== "function") return;

  const e = escapeHTML;

  // One card. Same building blocks as projectCardHTML (js/project-card.js):
  //   .work-card        = the whole card is one link
  //   .work-card__media = the gradient "image" (from the article's two colours)
  // .post-card adds the Journal's small changes (css/journal.css).
  // <time datetime="2026-10-20"> = a date machines can read (search engines),
  // while people read "20 October 2026".
  function postCardHTML(post) {
    const link = `journal-post.html?post=${encodeURIComponent(post.slug)}`;
    const badge = SHOW_SAMPLE_POSTS ? '<span class="badge work-card__badge">Sample</span>' : "";

    return `
      <li class="project-card post-card">
        <a class="work-card" href="${e(link)}"
           style="--from: ${e(post.colors[0])}; --to: ${e(post.colors[1])};">
          <div class="work-card__media" aria-hidden="true">${badge}</div>
          <div class="work-card__body">
            <p class="work-card__meta">${e(post.category)} · ${e(post.readingTime)} min read</p>
            <h3 class="work-card__title">${e(post.title)}</h3>
            <p class="post-card__intro">${e(post.intro)}</p>
            <p class="post-card__date"><time datetime="${e(post.date)}">${e(formatDate(post.date))}</time></p>
          </div>
        </a>
      </li>`;
  }

  grid.innerHTML = POSTS.map(postCardHTML).join("");
  if (fallback) fallback.remove();          // cards are here, so the message can go
})();
