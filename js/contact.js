/* =========================================================
   Trinetra Creations: Contact form (Day 9)
   Same pattern as js/consultation.js, with just 3 fields:
   check → show plain-English errors → send with sendForm() → thank you.
   ========================================================= */

(function () {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;

  // JavaScript takes over from the browser's bubbles. Without JS, the browser's
  // own checks (required, type="email", minlength) still run as the backup.
  form.noValidate = true;

  const summary = document.getElementById("contact-summary");
  const success = document.getElementById("contact-success");

  // ---------- The rules: field id → function that returns an error or "" ----------
  const RULES = {
    "c-name": function (v) {
      return v.trim() ? "" : "Please tell us your name.";
    },
    "c-email": function (v) {
      v = v.trim();
      if (!v) return "Please enter your email so we can reply.";
      // something @ something . something, no spaces
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        return "That email doesn't look right. Check the @ and the dot, for example name@gmail.com.";
      }
      return "";
    },
    "c-message": function (v) {
      v = v.trim();
      if (!v) return "Please write a short message.";
      if (v.length < 10) return "Please tell us a little more (at least 10 characters).";
      return "";
    },
  };
  const IDS = Object.keys(RULES);   // ["c-name", "c-email", "c-message"]

  // ---------- Show / clear one field's error ----------
  function checkField(id) {
    const field = document.getElementById(id);
    const message = RULES[id](field.value);
    document.getElementById(id + "-error").textContent = message;
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !message;
  }

  // Keep "Please fix N things" in step with what's left (only once it's showing)
  function updateSummary() {
    if (!summary.textContent) return;
    const left = form.querySelectorAll('[aria-invalid="true"]').length;
    summary.textContent = left === 0 ? ""
      : "Please fix " + left + (left === 1 ? " thing" : " things") + " below, then press the button again.";
  }

  // ---------- Live re-checking (same rules as the consultation form) ----------
  IDS.forEach(function (id) {
    const field = document.getElementById(id);
    // While a field shows an error, re-check on every keystroke so it clears when fixed
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true") { checkField(id); updateSummary(); }
    });
    // Leaving a field you've typed in: check it once
    field.addEventListener("blur", function () {
      if (field.value.trim()) { checkField(id); updateSummary(); }
    });
  });

  // ---------- Submit ----------
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // .filter keeps only the ids that FAIL their check
    const failed = IDS.filter(function (id) { return !checkField(id); });
    if (failed.length) {
      summary.textContent = "Please fix " + failed.length +
        (failed.length === 1 ? " thing" : " things") + " below, then press the button again.";
      document.getElementById(failed[0]).focus();
      return;
    }
    summary.textContent = "";

    const name = document.getElementById("c-name").value.trim();
    const email = document.getElementById("c-email").value.trim();

    // Send (loading state, errors and honeypot are all handled inside sendForm)
    const result = await window.sendForm(form, {
      _subject: "New contact message: " + name,
      name: name,
      email: email,
    });
    if (!result.ok) return;   // the error message is already showing by the button

    // Thank-you message (textContent = typed text is always shown as plain text)
    document.getElementById("contact-success-name").textContent = name.split(/\s+/)[0];
    document.getElementById("contact-success-email").textContent = email;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
})();
