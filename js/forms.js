/* =========================================================
   Trinetra Creations: shared form sending (Day 9)
   Used by js/consultation.js AND js/contact.js.

   sendForm(form, extraFields) sends a form to Formspree in the
   background with fetch(), and shows the loading state on its button.
   It returns { ok: true } or { ok: false, message: "..." }.
   ========================================================= */

(function () {
  "use strict";

  // ================================================================
  // THE FORMSPREE ADDRESS: THE ONE PLACE TO EDIT IT
  // Both forms (Free Consultation and Contact) send here.
  // Not a secret: a Formspree address is designed to be public, unlike an API key.
  // ================================================================
  const FORMSPREE_URL = "https://formspree.io/f/REPLACE_ME";

  // true only once a real address has been pasted in above
  const IS_CONNECTED = FORMSPREE_URL.startsWith("https://formspree.io/f/") &&
    !FORMSPREE_URL.includes("REPLACE_ME");

  // Shown while sending. The button's original text is remembered and put back.
  const SENDING_TEXT = "Sending…";

  // Give up after 15 seconds (slow or dropped mobile connection),
  // so the button never spins forever.
  const TIMEOUT_MS = 15000;

  // ---------- Loading state on the button ----------
  function setLoading(button, loading) {
    if (loading) {
      button.dataset.label = button.textContent;   // remember "Book my free call"
      button.textContent = SENDING_TEXT;
      button.disabled = true;                      // stops double-clicks = double emails
      button.classList.add("is-loading");          // CSS adds the spinner
    } else {
      button.textContent = button.dataset.label || button.textContent;
      button.disabled = false;
      button.classList.remove("is-loading");
    }
  }

  // ---------- The friendly "it didn't send" message ----------
  // Built with real elements (not innerHTML), and offers two other ways to reach us,
  // using the details from the CONTACT object in js/layout.js.
  function showSendError(form, text) {
    const status = form.querySelector(".form-status");
    if (!status) return;
    const contact = window.SITE_CONTACT;
    status.textContent = text + " ";
    if (contact) {
      const wa = document.createElement("a");
      wa.href = contact.whatsappLink;
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.textContent = "WhatsApp us";
      const mail = document.createElement("a");
      mail.href = contact.emailLink;
      mail.textContent = contact.email;
      status.append("You can also ", wa, " or email ", mail, ".");
    }
  }

  function clearSendError(form) {
    const status = form.querySelector(".form-status");
    if (status) status.textContent = "";
  }

  // ---------- Send ----------
  // async = this function can "await" (wait for) slow things like the network.
  async function sendForm(form, extraFields) {
    const button = form.querySelector('[type="submit"]');
    clearSendError(form);

    // 1. HONEYPOT CHECK. Real people never see the _gotcha field, so it's empty.
    //    If it has anything in it, a bot filled it in. We pretend it worked
    //    (so the bot moves on happily) but send nothing.
    //    Formspree ALSO checks _gotcha on its side, which catches bots that
    //    skip our JavaScript and post straight to the Formspree address.
    const honeypot = form.querySelector('[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      return { ok: true, bot: true };
    }

    // 2. Collect the fields. FormData reads every named field, like the browser would.
    const data = new FormData(form);
    // Extra values from the page script (e.g. the email subject).
    // .set() REPLACES a field, so it can also tidy one (e.g. join the ticked boxes).
    Object.keys(extraFields || {}).forEach(function (key) {
      data.set(key, extraFields[key]);
    });
    // Remove empty fields so the email only lists what was filled in.
    // (Array.from first: we can't safely delete from a list while looping over it.)
    Array.from(data.keys()).forEach(function (key) {
      if (data.get(key) === "") data.delete(key);
    });

    // 3. NOT CONNECTED YET (FORMSPREE_URL is still the placeholder):
    //    don't send anything. Warn in the console (F12) and show what WOULD be sent,
    //    then report success so the page shows its normal thank-you message.
    //    Object.fromEntries turns the FormData into a plain object that prints nicely.
    if (!IS_CONNECTED) {
      console.warn(
        "Form not connected yet: FORMSPREE_URL in js/forms.js is still the placeholder, " +
        "so NOTHING was sent. This is what would have been sent:",
        Object.fromEntries(data)
      );
      return { ok: true, notConnected: true };
    }

    // 4. Send for real.
    setLoading(button, true);
    try {
      // fetch() = send a request to another server WITHOUT leaving the page.
      // await = wait here for the answer (the page stays usable meanwhile).
      // Accept: application/json asks Formspree to answer with data,
      // instead of sending back its own thank-you web page.
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),    // stop waiting after 15 seconds
      });

      // response.ok = true for "200 OK"-type answers (it arrived)
      if (response.ok) return { ok: true };

      // Formspree said no (e.g. the form isn't confirmed yet, or a field is invalid).
      // Its reason goes to the console for us; visitors get plain words.
      const details = await response.json().catch(function () { return {}; });
      console.warn("Formspree refused the form:", response.status, details);
      const message = "Sorry, your message didn't send. Please try again in a minute.";
      showSendError(form, message);
      return { ok: false, message: message };
    } catch (error) {
      // We get here when there was NO answer at all: no internet, a blocked
      // connection, or our 15-second timeout (that one is named "TimeoutError").
      console.warn("Form could not be sent:", error);
      const message = error.name === "TimeoutError"
        ? "Sorry, the connection was too slow and your message didn't send. Please try again."
        : "Sorry, your message didn't send. Please check your internet connection and try again.";
      showSendError(form, message);
      return { ok: false, message: message };
    } finally {
      // finally = runs whether it worked or not: always put the button back
      setLoading(button, false);
      // Disabling a focused button drops keyboard focus onto the page itself.
      // Put it back on the button, so keyboard users don't have to Tab from the top.
      // (On success the page script then moves focus to the thank-you message.)
      if (document.activeElement === document.body) button.focus();
    }
  }

  // Make sendForm usable by the page scripts (loaded after this file)
  window.sendForm = sendForm;
})();
