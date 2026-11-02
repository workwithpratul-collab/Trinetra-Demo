/* =========================================================
   Trinetra Creations: shared layout (nav + footer)
   Write the nav and footer ONCE here; every page gets them.
   Each page only needs:
     <header class="site-header" id="site-header"></header>
     <footer class="site-footer" id="site-footer"></footer>
     <script src="js/layout.js" defer></script>
   ========================================================= */

(function () {
  "use strict";

  // ---------- 1. Single source of truth for the menu ----------
  // Add, remove or rename a page here and every page updates.
  // Paths are relative (no leading "/") so GitHub Pages works.
  const NAV_LINKS = [
    { href: "index.html",    label: "Home" },
    { href: "work.html",     label: "Work" },
    { href: "services.html", label: "Services" },
    { href: "about.html",    label: "About" },
    { href: "journal.html",  label: "Journal" },
    { href: "contact.html",  label: "Contact" },
  ];
  const CTA = { href: "consultation.html", label: "Free Consultation" };

  // ================================================================
  // CONTACT DETAILS: THE ONE PLACE TO EDIT THEM (Day 9)
  // Footer, Contact page, WhatsApp buttons and form error messages all
  // read from here. Type each value ONCE, the way people should see it.
  // ================================================================
  const CONTACT = {
    email: "hello@trinetracreations.com",
    phone: "+91 00000 00000",          // shown on the site; the tel: link is worked out below
    whatsapp: "+91 00000 00000",       // WhatsApp number, with country code (often the same as phone)
    whatsappMessage: "Hello Trinetra Creations, I'd like to know more about your services.",
    address: ["Studio address line 1", "Area, City, State PIN"],
    hours: [
      { days: "Monday – Saturday", time: "10:00 am – 7:00 pm" },
      { days: "Sunday", time: "Closed" },
    ],
  };

  // ---------- Links worked out from CONTACT (don't edit these) ----------
  // .replace(/\D/g, "") removes everything that isn't a digit: "+91 98765 43210" → "919876543210"
  const digitsOnly = (text) => text.replace(/\D/g, "");
  // tel: links work best with a + and digits only: tel:+919876543210
  CONTACT.phoneLink = "tel:+" + digitsOnly(CONTACT.phone);
  // wa.me = WhatsApp's official "click to chat" address: digits only, no + or spaces.
  // ?text= pre-fills the first message; encodeURIComponent makes spaces etc. safe in a URL (Day 5).
  CONTACT.whatsappLink = "https://wa.me/" + digitsOnly(CONTACT.whatsapp) +
    "?text=" + encodeURIComponent(CONTACT.whatsappMessage);
  CONTACT.emailLink = "mailto:" + CONTACT.email;

  // Share it with the other scripts (js/forms.js uses it in error messages).
  // window.something = a global: any script on the page can read it.
  window.SITE_CONTACT = CONTACT;

  // ---------- 2. Work out which page we're on ----------
  // "/Agency-site/about.html" → "about.html". An empty path (site root) means Home.
  const currentPage = location.pathname.split("/").pop() || "index.html";

  // Some pages are "children" of a menu item, so that item lights up there too:
  // a case study belongs to Work, a Journal article belongs to Journal (Day 11).
  // Add a line here for any future child page.
  const PARENT_PAGE = {
    "case-study.html": "work.html",
    "journal-post.html": "journal.html",
  };
  const activePage = PARENT_PAGE[currentPage] || currentPage;

  // ---------- 3. Logo mark: loaded from ONE file ----------
  // To swap in the client's original logo, replace assets/logo.svg only.
  // alt="" because the link around it already has an aria-label;
  // width/height reserve space so the page doesn't jump while it loads.
  // (width/height match the SVG's viewBox ratio, 384 × 364.)
  const LOGO_IMG = `<img class="logo__mark" src="assets/logo.svg" alt="" width="42" height="40">`;

  // Wordmark: typed in normal case; CSS turns it into wide capitals.
  // aria-hidden because the link's aria-label already says the name.
  const WORDMARK = `<span class="logo__wordmark" aria-hidden="true">Trinetra Creations</span>`;

  // Company details shown in the footer
  const TAGLINE = "Imagine · Believe · Achieve";
  const GST_NO = "XXXXXXXXXXXX";

  // ---------- 4. Build the header HTML ----------
  // aria-current="page" tells screen readers (and our CSS) which link is active.
  const linksHTML = NAV_LINKS.map(
    (link) => `
      <li>
        <a href="${link.href}"${link.href === activePage ? ' aria-current="page"' : ""}>
          ${link.label}
        </a>
      </li>`
  ).join("");

  const headerHTML = `
    <nav class="nav container" aria-label="Main">
      <a class="logo" href="index.html" aria-label="Trinetra Creations, home">
        ${LOGO_IMG}
        ${WORDMARK}
      </a>

      <!-- Hamburger: aria-expanded tells assistive tech if the menu is open -->
      <button class="nav-toggle" type="button"
              aria-expanded="false" aria-controls="nav-menu">
        <span class="visually-hidden">Menu</span>
        <span>
          <span class="nav-toggle__bar"></span>
          <span class="nav-toggle__bar"></span>
          <span class="nav-toggle__bar"></span>
        </span>
      </button>

      <div class="nav-menu" id="nav-menu">
        <ul class="nav-links" role="list">${linksHTML}</ul>
        <a class="btn btn--primary" href="${CTA.href}"
           ${CTA.href === activePage ? 'aria-current="page"' : ""}>${CTA.label}</a>
      </div>
    </nav>`;

  // ---------- 5. Build the footer HTML ----------
  const year = new Date().getFullYear(); // keeps © year current automatically

  const footerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="logo" href="index.html" aria-label="Trinetra Creations, home">
            ${LOGO_IMG}
            ${WORDMARK}
          </a>
          <!-- Brand tagline: small muted text right under the wordmark -->
          <p class="footer-motto">${TAGLINE}</p>
          <p class="footer-tagline">
            Three eyes on your brand: vision, insight and craft.
          </p>
          <!-- Founder credit: small muted line under the tagline -->
          <p class="footer-credit">Ashutosh Mishra, CEO</p>
        </div>

        <div>
          <h2 class="footer-heading">Explore</h2>
          <ul class="footer-list" role="list">
            ${NAV_LINKS.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}
            <li><a href="${CTA.href}">${CTA.label}</a></li>
          </ul>
        </div>

        <div>
          <h2 class="footer-heading">Get in touch</h2>
          <ul class="footer-list" role="list">
            <li><a href="${CONTACT.emailLink}">${CONTACT.email}</a></li>
            <li><a href="${CONTACT.phoneLink}">${CONTACT.phone}</a></li>
            <li><a href="${CONTACT.whatsappLink}" target="_blank" rel="noopener">WhatsApp us<span class="visually-hidden"> (opens WhatsApp)</span></a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <!-- Copyright + GST number side by side (they wrap on small screens) -->
        <p class="footer-legal">
          <span>&copy; ${year} Trinetra Creations. All rights reserved.</span>
          <span>GST No. ${GST_NO}</span>
        </p>
        <p>Designed with vision.</p>
      </div>
    </div>`;

  // ---------- 6. Inject into the page ----------
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;

  // ---------- 6b. Fill contact details anywhere on the page (Day 9) ----------
  // Any element with data-contact="email" / "phone" / "whatsapp" / "address" / "hours"
  // gets the value from CONTACT. A link (<a>) also gets the right href.
  // textContent (not innerHTML) = the values are always treated as plain text.
  document.querySelectorAll("[data-contact]").forEach(function (el) {
    const key = el.dataset.contact;
    if (key === "email") {
      el.textContent = CONTACT.email;
      if (el.tagName === "A") el.href = CONTACT.emailLink;
    } else if (key === "phone") {
      el.textContent = CONTACT.phone;
      if (el.tagName === "A") el.href = CONTACT.phoneLink;
    } else if (key === "whatsapp") {
      // Keeps the link's own text ("Chat on WhatsApp"); only the address changes
      if (el.tagName === "A") el.href = CONTACT.whatsappLink;
      else el.textContent = CONTACT.whatsapp;
    } else if (key === "address") {
      // One line per array item, separated by <br> (built safely, no innerHTML)
      el.textContent = "";
      CONTACT.address.forEach(function (line, i) {
        if (i > 0) el.appendChild(document.createElement("br"));
        el.appendChild(document.createTextNode(line));
      });
    } else if (key === "hours") {
      // Fills a <dl>: <div><dt>days</dt><dd>time</dd></div> per row
      el.textContent = "";
      CONTACT.hours.forEach(function (row) {
        const wrap = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = row.days;
        dd.textContent = row.time;
        wrap.append(dt, dd);
        el.appendChild(wrap);
      });
    }
  });

  // ---------- 6c. Floating WhatsApp button on every page (Day 9) ----------
  // A round button fixed to the bottom-right corner (styles in css/style.css).
  // target="_blank" opens WhatsApp in a new tab/app; rel="noopener" stops the new
  // tab from being able to control this page (a standard safety habit).
  // The icon is decorative (aria-hidden); aria-label is what screen readers say.
  const WA_ICON = `
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
      <!-- speech bubble with a little tail at the bottom-left -->
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <!-- phone handset inside the bubble -->
      <path d="M9.2 7.6l1.5-.3.9 2.1-1 .9c.5 1.2 1.6 2.3 2.8 2.8l.9-1 2.1.9-.3 1.5c-.2.7-.9 1.1-1.6 1C11.3 15.2 8.8 12.7 8.5 9.2c-.1-.7.3-1.4.7-1.6z" fill="currentColor"/>
    </svg>`;
  document.body.insertAdjacentHTML("beforeend", `
    <a class="wa-float" href="${CONTACT.whatsappLink}" target="_blank" rel="noopener"
       aria-label="Chat with us on WhatsApp (opens WhatsApp)" title="Chat with us on WhatsApp">
      ${WA_ICON}
    </a>`);

  if (!headerEl) return; // nothing else to wire up

  // ---------- 7. Mobile menu behaviour ----------
  const toggle = headerEl.querySelector(".nav-toggle");
  const menu = headerEl.querySelector(".nav-menu");
  // Day 13: 64em (= 1024px at normal text size), the SAME breakpoint as the
  // desktop menu in css/style.css. If they differed, a menu left open between
  // the two widths would never be reset.
  const desktopQuery = window.matchMedia("(min-width: 64em)");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open); // locks page scroll
  }

  // Click hamburger → flip open/closed
  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Escape key closes the menu and returns focus to the button (keyboard users)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Tapping a link closes the menu (matters for same-page #anchor links)
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });

  // Rotating a tablet to desktop width with the menu open → reset it
  desktopQuery.addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });
})();
