/* =========================================================
   Trinetra Creations: Free Consultation form (Day 8)
   - Checks every field with friendly, plain-English messages
   - Shows each message right under its field (linked with aria-describedby)
   - When everything is fine: sends to Formspree with sendForm() from
     js/forms.js (Day 9), then shows the thank-you message
   ========================================================= */

(function () {
  "use strict";

  const form = document.getElementById("consult-form");
  if (!form) return;

  // ---------- 1. JavaScript takes over from the browser's checks ----------
  // novalidate switches off the browser's pop-up bubbles, so OUR messages show instead.
  // If this script never runs, the attribute is never added, and the browser's own
  // checks (required, type="email", pattern) still protect the form. That's the backup.
  form.noValidate = true;

  const summary = document.getElementById("form-summary");
  const success = document.getElementById("form-success");
  const helpGroup = form.querySelector(".checks");
  const helpBoxes = form.querySelectorAll('input[name="help"]');

  // ---------- 1b. Pre-fill from "Build your order" (Day 10) ----------
  // js/order.js (services.html) saves the order in sessionStorage under this name.
  // No saved order (most visitors) = this whole block does nothing.
  (function prefillFromOrder() {
    let order = null;
    try {
      const saved = sessionStorage.getItem("trinetra-order");
      if (!saved) return;
      // Read it ONCE, then delete it, so it doesn't pop up again on a later visit
      sessionStorage.removeItem("trinetra-order");
      order = JSON.parse(saved);   // text → object again (can throw if the text is damaged)
    } catch (error) {
      return;                      // storage blocked or damaged data: just skip pre-filling
    }
    // Treat it as untrusted text: check its shape before using it
    if (!order || typeof order.text !== "string") return;

    // 1. The order goes into the message box. .value is always plain text (never HTML).
    //    If the box already has text (e.g. the browser restored it), add below it.
    //    .slice(0, 1000) respects the box's maxlength of 1000 characters.
    const message = document.getElementById("message");
    const combined = message.value.trim() ? message.value.trim() + "\n\n" + order.text : order.text;
    message.value = combined.slice(0, 1000);

    // 2. Tick the matching "What do you need help with?" box (exact value match)
    helpBoxes.forEach(function (box) {
      if (box.value === order.service) box.checked = true;
    });

    // 3. Tell the visitor what happened
    const note = document.getElementById("order-note");
    note.textContent = "We've added your order from the Services page to the message below. " +
      "Add your name and phone number, and change anything you like.";
    note.hidden = false;
  })();

  // ---------- 2. The rules ----------
  // Each rule gets the field's value and returns an error message,
  // or "" (an empty string) when the value is fine.

  // Phone: remove spaces, dashes, brackets and dots, then allow an optional
  // +91 / 91 / 0 at the start, followed by 10 digits starting with 6, 7, 8 or 9
  // (that's what every Indian mobile number looks like).
  function checkPhone(value) {
    const digits = value.replace(/[\s\-().]/g, "");
    if (!digits) return "Please enter your phone number so we can call you back.";
    if (!/^(\+?91|0)?[6-9]\d{9}$/.test(digits)) {
      return "That doesn't look like a mobile number. Please use 10 digits, for example 98765 43210.";
    }
    return "";
  }

  // Email is optional: empty is fine, but if something is typed it must look like an email.
  // Simple pattern: something @ something . something, with no spaces.
  function checkEmail(value) {
    if (!value) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "That email doesn't look right. Check the @ and the dot, for example name@gmail.com.";
    }
    return "";
  }

  // id of the field → its rule. .trim() removes spaces at the start and end,
  // so a name made of only spaces counts as empty.
  const RULES = {
    name:  (v) => (v.trim() ? "" : "Please tell us your name."),
    phone: (v) => checkPhone(v.trim()),
    email: (v) => checkEmail(v.trim()),
    type:  (v) => (v ? "" : "Please choose your type of business. If none fit, pick \"Other\"."),
  };

  // ---------- 3. Show or clear one error ----------
  // element = the input/select (or the checkbox fieldset); message = text or "".
  function setError(element, errorId, message) {
    const errorEl = document.getElementById(errorId);
    errorEl.textContent = message;   // textContent = always plain text, never HTML
    if (message) {
      element.setAttribute("aria-invalid", "true");   // screen readers say "invalid entry"; CSS turns it red
    } else {
      element.removeAttribute("aria-invalid");
    }
  }

  // Check one text field / dropdown. Returns true when it's fine.
  function checkField(id) {
    const field = document.getElementById(id);
    const message = RULES[id](field.value);
    setError(field, id + "-error", message);
    return !message;
  }

  // The checkboxes: at least one must be ticked.
  // Array.from turns the list of boxes into an array so we can use .some()
  // ("is at least one of them checked?").
  function checkHelp() {
    const anyTicked = Array.from(helpBoxes).some((box) => box.checked);
    const message = anyTicked ? "" : "Please tick at least one option. Not sure? Tick \"Not sure yet\".";
    setError(helpGroup, "help-error", message);
    return anyTicked;
  }

  // ---------- 4. Check everything (used when Send is pressed) ----------
  // Returns the list of fields that failed, in the order they appear on the page.
  function checkAll() {
    const failed = [];
    ["name", "phone", "email", "type"].forEach(function (id) {
      if (!checkField(id)) failed.push(document.getElementById(id));
    });
    if (!checkHelp()) failed.push(helpBoxes[0]);   // focus the first checkbox
    return failed;
  }

  // Keep the "Please fix N things" box up to date while people fix things.
  // It only changes once it's showing (that is, after the first press of the button).
  function updateSummary() {
    if (!summary.textContent) return;
    const left = form.querySelectorAll('[aria-invalid="true"]').length;
    if (left === 0) summary.textContent = "";
    else if (left === 1) summary.textContent = "Please fix 1 thing below, then press the button again.";
    else summary.textContent = "Please fix " + left + " things below, then press the button again.";
  }

  // ---------- 5. Live re-checking ----------
  // We DON'T shout at people while they're still typing for the first time.
  // Only once a field is showing an error do we re-check it on every change,
  // so the message disappears the moment it's fixed.
  Object.keys(RULES).forEach(function (id) {
    const field = document.getElementById(id);
    // "input" fires on every keystroke; "change" covers dropdowns
    ["input", "change"].forEach(function (eventName) {
      field.addEventListener(eventName, function () {
        if (field.getAttribute("aria-invalid") === "true") { checkField(id); updateSummary(); }
      });
    });
    // When leaving a field that was already typed in, check it once (catches a typo early)
    field.addEventListener("blur", function () {
      if (field.value.trim()) { checkField(id); updateSummary(); }
    });
  });
  helpBoxes.forEach(function (box) {
    box.addEventListener("change", function () {
      if (helpGroup.getAttribute("aria-invalid") === "true") { checkHelp(); updateSummary(); }
    });
  });

  // ---------- 6. Pressing "Book my free call" ----------
  // async: this handler waits ("await") for Formspree's answer further down
  form.addEventListener("submit", async function (event) {
    event.preventDefault();   // stop the browser's normal send + page change; we send it ourselves

    const failed = checkAll();

    // Something is wrong: say how many, and put the cursor in the first problem field.
    if (failed.length) {
      summary.textContent = failed.length === 1
        ? "Please fix 1 thing below, then press the button again."
        : "Please fix " + failed.length + " things below, then press the button again.";
      failed[0].focus();   // screen readers now read that field's label + its error
      return;
    }
    summary.textContent = "";

    // ---------- 7. Everything is fine: send it ----------
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    // getAll("help") returns ALL ticked boxes (get() would return only the first).
    // join(", ") turns them into one line for the email: "Logo & identity, Packaging"
    const help = new FormData(form).getAll("help").join(", ");

    // Extra/tidied fields for the email. Keys starting with _ are Formspree settings:
    // _subject = the email's subject line, so you can spot consultations in your inbox.
    const result = await window.sendForm(form, {
      _subject: "New consultation request: " + name,
      name: name,
      phone: phone,
      help: help,
      budget: document.getElementById("budget").value || "Not sure yet",
    });

    // Didn't send: sendForm has already shown the message next to the button,
    // and the form stays filled in so nothing has to be typed again.
    if (!result.ok) return;

    // Fill in the thank-you message. First name only, so it feels personal.
    document.getElementById("success-name").textContent = name.split(/\s+/)[0];
    document.getElementById("success-phone").textContent = phone;

    form.hidden = true;
    success.hidden = false;
    success.focus();   // moves keyboard + screen-reader focus to the thank-you message
  });
})();
