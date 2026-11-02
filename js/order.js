/* =========================================================
   Trinetra Creations: "Build your order" picker (Day 10)
   Lives on services.html (section id="order").
   1. Visitor picks a product (radio cards built from PRODUCTS)
   2. Its options appear (size, style, quantity if needed, notes)
   3. A live summary updates as they choose
   4. "Request this order" saves the summary in sessionStorage and opens
      consultation.html, where js/consultation.js puts it in the message box
   ========================================================= */

(function () {
  "use strict";

  // ================================================================
  // THE OPTIONS: EDIT THEM HERE (one list for everything)
  // All products, sizes and styles are samples.
  //
  // Each product:
  //   id           short code, lowercase (used inside the page, never shown)
  //   name         shown on the card and in the summary
  //   description  one line under the name
  //   from, to     the two colours of its gradient "sample image"
  //   shape        the white outline drawn on the art: circle | wide | portrait | grid | box
  //   image        OPTIONAL photo, e.g. "assets/order/banner.jpg". Leave "" for the gradient.
  //                If the file is missing, the gradient shows instead.
  //   sizeLabel    what the size question is called for this product
  //   sizes        the choices. "Custom size" also shows a box to type the size.
  //   styles       the style choices
  //   quantity     OPTIONAL: { label, start } shows a number box; leave it out for no quantity
  //   service      which "What do you need help with?" box to tick on the consultation form
  //                (must match a checkbox value there EXACTLY)
  // ================================================================
  const PRODUCTS = [
    {
      id: "logo",
      name: "Logo",
      description: "A memorable mark for your business, ready for every use.",
      from: "#7b2ff7", to: "#e0218a", shape: "circle",
      image: "",
      sizeLabel: "Package",
      sizes: ["Logo only", "Logo + visiting card", "Full identity kit"],
      styles: ["Modern & minimal", "Classic & traditional", "Bold & playful", "Hand-drawn"],
      service: "Logo & identity",
    },
    {
      id: "banner",
      name: "Banner / Hoarding",
      description: "Big, bold outdoor and shop-front banners that read from far away.",
      from: "#e0218a", to: "#ff9933", shape: "wide",
      image: "",
      sizeLabel: "Size",
      sizes: ["2 × 3 ft", "3 × 6 ft", "4 × 8 ft", "Custom size"],
      styles: ["Bold offer", "Festive", "Elegant & premium", "Clean & minimal"],
      quantity: { label: "How many banners?", start: 1 },
      service: "Ads & campaigns",
    },
    {
      id: "flyer",
      name: "Flyer / Poster",
      description: "Hand-outs and posters for offers, events and openings.",
      from: "#ff9933", to: "#f5c542", shape: "portrait",
      image: "",
      sizeLabel: "Size",
      sizes: ["A5", "A4", "A3", "Custom size"],
      styles: ["Bold offer", "Festive", "Informative", "Elegant & premium"],
      quantity: { label: "How many copies?", start: 500 },
      service: "Ads & campaigns",
    },
    {
      id: "social",
      name: "Social Media Pack",
      description: "A month of on-brand posts for Instagram, Facebook and WhatsApp.",
      from: "#3a1c71", to: "#7b2ff7", shape: "grid",
      image: "",
      sizeLabel: "Pack size",
      sizes: ["8 posts a month", "12 posts a month", "20 posts a month"],
      styles: ["Bright & bold", "Clean & minimal", "Festive", "Dark & premium"],
      service: "Social media",
    },
    {
      id: "packaging",
      name: "Packaging Box",
      description: "Boxes and labels that stand out on the shelf.",
      from: "#0f766e", to: "#7b2ff7", shape: "box",
      image: "",
      sizeLabel: "Box size",
      sizes: ["Small (sweets, cosmetics)", "Medium (food, gift box)", "Large (hamper)", "Custom size"],
      styles: ["Premium & luxury", "Traditional", "Modern & minimal", "Fun & colourful"],
      quantity: { label: "How many flavours or variants?", start: 1 },
      service: "Packaging",
    },
  ];

  // The sessionStorage "key" (name) the order is saved under. js/consultation.js uses the same name.
  const STORAGE_KEY = "trinetra-order";
  const CUSTOM = "Custom size";

  // ---------- Find the parts of the page ----------
  const form = document.getElementById("order-form");
  if (!form) return;

  const productGrid   = document.getElementById("order-products");
  const optionsBox    = document.getElementById("order-options");
  const sizeGroup     = document.getElementById("order-size");
  const styleGroup    = document.getElementById("order-style");
  const customField   = document.getElementById("order-custom-field");
  const customInput   = document.getElementById("order-custom");
  const qtyField      = document.getElementById("order-qty-field");
  const qtyInput      = document.getElementById("order-qty");
  const notesInput    = document.getElementById("order-notes");
  const errorBox      = document.getElementById("order-error");

  // Summary panel parts
  const sumArt     = document.getElementById("sum-art");
  const sumProduct = document.getElementById("sum-product");
  const sumSize    = document.getElementById("sum-size");
  const sumStyle   = document.getElementById("sum-style");
  const sumQtyRow  = document.getElementById("sum-qty-row");
  const sumQty     = document.getElementById("sum-qty");
  const sumNotes   = document.getElementById("sum-notes");

  // ---------- 1. Sample "image": gradient art (+ optional photo) ----------
  // escapeHTML comes from js/helpers.js. Our own data, but escaping is a good habit
  // for ANYTHING put into innerHTML.
  function artHTML(product) {
    const photo = product.image
      ? `<img class="order-art__img" src="${escapeHTML(product.image)}" alt="" loading="lazy" onerror="this.remove()">`
      : "";
    // --from / --to are read by the CSS gradient (same idea as the Work cards)
    return `
      <span class="order-art" style="--from: ${escapeHTML(product.from)}; --to: ${escapeHTML(product.to)}" aria-hidden="true">
        <span class="order-art__shape order-art__shape--${escapeHTML(product.shape)}"></span>
        ${photo}
      </span>`;
  }

  // ---------- 2. Build the product cards (real radio buttons) ----------
  // Each card is a <label> wrapping a radio, so clicking ANYWHERE on the card picks it.
  // All radios share name="product": the browser lets only one be chosen,
  // and arrow keys move between them.
  productGrid.innerHTML = PRODUCTS.map(function (p) {
    return `
      <label class="product-card">
        <input class="product-card__radio" type="radio" name="product" value="${escapeHTML(p.id)}">
        ${artHTML(p)}
        <span class="product-card__name">${escapeHTML(p.name)}</span>
        <span class="product-card__desc">${escapeHTML(p.description)}</span>
      </label>`;
  }).join("");

  // ---------- 3. Build a group of pill radios (sizes or styles) ----------
  function pillsHTML(groupName, choices) {
    return choices.map(function (choice) {
      return `
        <label class="pill">
          <input class="pill__radio" type="radio" name="${groupName}" value="${escapeHTML(choice)}">
          <span>${escapeHTML(choice)}</span>
        </label>`;
    }).join("");
  }

  // Helpers to read the current choices
  function chosen(name) {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : "";
  }
  function currentProduct() {
    const id = chosen("product");
    return PRODUCTS.find(function (p) { return p.id === id; });   // undefined if none chosen
  }

  // ---------- 4. A product was chosen: show ITS options ----------
  function showOptions(product) {
    // Size and style groups are rebuilt for this product (choices reset).
    // The size question AND its summary row use the product's own word ("Package", "Box size"…)
    sizeGroup.querySelector("legend").textContent = product.sizeLabel;
    document.getElementById("sum-size-label").textContent = product.sizeLabel;
    sizeGroup.querySelector(".pills").innerHTML = pillsHTML("size", product.sizes);
    styleGroup.querySelector(".pills").innerHTML = pillsHTML("style", product.styles);

    // Quantity only for products that have one
    if (product.quantity) {
      qtyField.hidden = false;
      qtyField.querySelector("label").textContent = product.quantity.label;
      qtyInput.value = product.quantity.start;
    } else {
      qtyField.hidden = true;
      qtyInput.value = "";
    }

    customField.hidden = true;     // only shown after "Custom size" is picked
    customInput.value = "";
    optionsBox.hidden = false;
    errorBox.textContent = "";
    clearInvalid();
  }

  // ---------- 5. The live summary ----------
  // The rows product/size/style/quantity are inside an aria-live="polite" region,
  // so screen readers announce each change (when they finish what they're saying).
  // Notes are OUTSIDE that region on purpose: announcing every typed letter would be noise.
  function updateSummary() {
    const product = currentProduct();
    if (!product) return;

    sumArt.innerHTML = artHTML(product);
    sumProduct.textContent = product.name;

    let size = chosen("size");
    if (size === CUSTOM) size = customInput.value.trim() ? "Custom: " + customInput.value.trim() : "Custom (to discuss)";
    sumSize.textContent = size || "Not chosen yet";
    sumStyle.textContent = chosen("style") || "Not chosen yet";

    sumQtyRow.hidden = !product.quantity;
    sumQty.textContent = qtyInput.value || "Not set";

    sumNotes.textContent = notesInput.value.trim() || "None yet";
  }

  // ---------- 6. Listen for changes ----------
  // ONE listener on the whole form ("event delegation"): any radio or box that
  // changes inside it bubbles up to here, even the pills we build later.
  form.addEventListener("change", function (event) {
    const target = event.target;
    if (target.name === "product") showOptions(currentProduct());
    if (target.name === "size") {
      // Show the "Your size" box only for "Custom size"
      customField.hidden = target.value !== CUSTOM;
    }
    if (target.name === "size" || target.name === "style") {
      // Clear that group's error as soon as something is picked
      const group = target.closest("fieldset");
      group.removeAttribute("aria-invalid");
      group.querySelector(".field__error").textContent = "";
    }
    updateSummary();
  });
  // "input" fires on every keystroke, so the summary keeps up while typing
  form.addEventListener("input", function (event) {
    if (event.target.type !== "radio") updateSummary();
  });

  // ---------- 7. Checking before sending ----------
  function clearInvalid() {
    form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
    form.querySelectorAll(".field__error").forEach(function (el) { el.textContent = ""; });
  }
  function fail(element, errorId, message) {
    element.setAttribute("aria-invalid", "true");
    document.getElementById(errorId).textContent = message;
  }

  function check(product) {
    clearInvalid();
    const problems = [];   // the first thing to focus for each problem
    if (!chosen("size")) {
      fail(sizeGroup, "order-size-error", "Please choose a " + product.sizeLabel.toLowerCase() + ".");
      problems.push(sizeGroup.querySelector("input"));
    }
    if (!chosen("style")) {
      fail(styleGroup, "order-style-error", "Please choose a style.");
      problems.push(styleGroup.querySelector("input"));
    }
    if (product.quantity) {
      const n = Number(qtyInput.value);
      // Number.isInteger: whole numbers only (no 2.5 banners)
      if (!Number.isInteger(n) || n < 1 || n > 100000) {
        fail(qtyInput, "order-qty-error", "Please enter a whole number, 1 or more.");
        problems.push(qtyInput);
      }
    }
    return problems;
  }

  // ---------- 8. "Request this order" ----------
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const product = currentProduct();
    if (!product) {
      errorBox.textContent = "Please choose a product first.";
      productGrid.querySelector("input").focus();
      return;
    }

    const problems = check(product);
    if (problems.length) {
      errorBox.textContent = problems.length === 1
        ? "Please fix 1 thing above, then press the button again."
        : "Please fix " + problems.length + " things above, then press the button again.";
      problems[0].focus();
      return;
    }
    errorBox.textContent = "";

    // The summary as plain text, one line per detail. This is what lands in
    // the consultation form's message box ("\n" = new line).
    const lines = [
      "Order request (from the Services page):",
      "Product: " + product.name,
      product.sizeLabel + ": " + sumSize.textContent,
      "Style: " + chosen("style"),
    ];
    if (product.quantity) lines.push("Quantity: " + qtyInput.value);
    if (notesInput.value.trim()) lines.push("Notes: " + notesInput.value.trim());

    // sessionStorage: kept for THIS TAB only, gone when it closes. Never in the URL.
    // JSON.stringify turns the object into text (storage can only hold text).
    // try/catch: some browsers block storage (e.g. strict privacy settings);
    // then we still go to the consultation page, just without pre-filling.
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        text: lines.join("\n"),
        service: product.service,
      }));
    } catch (error) {
      console.warn("Couldn't save the order for the consultation form:", error);
    }

    // #form-title = jump straight to the form on the consultation page
    window.location.href = "consultation.html#form-title";
  });

  // ---------- 9. Everything worked: show the picker, remove the fallback ----------
  // (If this script fails anywhere above, the "needs JavaScript" note stays visible.)
  form.hidden = false;
  const fallback = document.getElementById("order-fallback");
  if (fallback) fallback.remove();
})();
