/* =========================================================
   Trinetra Creations: shared project card (Day 4)
   ONE template for a project card, used by the Home page
   (3 featured) and the Work page (all, with filters).
   Needs js/projects.js (for SHOW_SAMPLE_LABELS) and js/helpers.js
   (for escapeHTML) loaded first.
   ========================================================= */

// Takes one project object from PROJECTS and returns the card's HTML as a string.
//  - class="project-card" on the <li> is what the Work page filter shows/hides
//  - data-category lets the filter know which category the card belongs to
//  - --from / --to feed the two colours into the gradient "image" (see components.css)
function projectCardHTML(project) {
  // The Sample badge only appears when the switch in projects.js is on
  const badge = SHOW_SAMPLE_LABELS
    ? '<span class="badge work-card__badge">Sample</span>'
    : "";

  // Short name for the escaping helper, so the template below stays readable
  const e = escapeHTML;

  // Link to the ONE case-study page, telling it which project to show.
  // encodeURIComponent makes the id safe inside a web address
  // (a space becomes %20, & becomes %26, and so on).
  const caseLink = `case-study.html?project=${encodeURIComponent(project.id)}`;

  // Day 6: optional photo. If the project has image: "assets/work/x.jpg",
  // put an <img> inside the gradient box. It sits ON TOP of the gradient,
  // so if the photo is missing or slow, the gradient still shows.
  //   loading="lazy"   = only download when the card gets near the screen
  //   decoding="async" = decode the photo without freezing the page
  //   width/height     = tells the browser the 4:3 shape before it loads (no jumping)
  //   alt=""           = decorative: the title next to it already names the project
  //   onerror          = runs if the file can't load (wrong name, not uploaded yet).
  //                      this.remove() deletes the <img>, so the gradient shows
  //                      cleanly instead of a broken-image icon. (Tested Day 6:
  //                      Chrome DOES show the icon without this, even with alt="".)
  const photo = project.image
    ? `<img class="work-card__img" src="${e(project.image)}" alt=""
            width="1600" height="1200" loading="lazy" decoding="async"
            onerror="this.remove()">`
    : "";

  // Every ${...} that holds data goes through e(). The browser's
  // dataset.category gives back the ORIGINAL text ("Logo & Identity"),
  // so the Work page filter still matches.
  return `
    <li class="project-card" data-category="${e(project.category)}">
      <a class="work-card" href="${e(caseLink)}"
         style="--from: ${e(project.colors[0])}; --to: ${e(project.colors[1])};">
        <div class="work-card__media" aria-hidden="true">${photo}${badge}</div>
        <div class="work-card__body">
          <p class="work-card__meta">${e(project.category)} · ${e(project.year)}</p>
          <h3 class="work-card__title">${e(project.title)}</h3>
          <p class="work-card__client">${e(project.client)}</p>
        </div>
      </a>
    </li>`;
}
