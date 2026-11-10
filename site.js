"use strict";

// Screenshot links open the full-size image in the visitor's colour scheme.
// The light file stays in the markup as the no-JavaScript default.
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const screenshotLinks = document.querySelectorAll("a[data-dark-href]");
for (const link of screenshotLinks) link.dataset.lightHref = link.getAttribute("href");
function syncScreenshotLinks() {
  for (const link of screenshotLinks) {
    link.setAttribute("href", darkQuery.matches ? link.dataset.darkHref : link.dataset.lightHref);
  }
}
syncScreenshotLinks();
darkQuery.addEventListener("change", syncScreenshotLinks);

const form = document.querySelector("#signup-form");
const email = document.querySelector("#email");
const button = form.querySelector("button");
const status = document.querySelector("#signup-status");
const config = window.LODESTAR_SIGNUP;
let ready = false;

try {
  const action = new URL(config?.action);
  ready = action.origin === "https://docs.google.com"
    && /^\/forms\/d\/e\/[A-Za-z0-9_-]+\/formResponse$/.test(action.pathname)
    && !action.search && !action.hash && !action.username && !action.password
    && /^entry\.\d+$/.test(config?.emailField);
  if (ready) {
    form.action = action.href;
    email.name = config.emailField;
    email.disabled = false;
    button.disabled = false;
    status.textContent = "Google Forms will confirm your request.";
  }
} catch {
  // An unconfigured form must never collect email or claim a successful signup.
}

form.addEventListener("submit", (event) => {
  if (!ready) event.preventDefault();
  // Use a normal browser POST. Google handles validation and confirmation;
  // there is no opaque cross-origin fetch or speculative success message.
});
