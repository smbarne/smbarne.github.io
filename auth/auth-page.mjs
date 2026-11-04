import { resolveAuthPage } from './auth-flow.mjs';

const incomingURL = window.location.href;
// Remove credentials from the address bar/history before any other interaction.
window.history.replaceState(null, '', window.location.pathname);
const result = resolveAuthPage(document.body.dataset.mode, incomingURL);
const heading = document.querySelector('h1');
const message = document.querySelector('#message');
const button = document.querySelector('#continue');
const appLink = document.querySelector('#open-app');
if (result.kind === 'verify') {
  heading.textContent = 'Continue on this device';
  message.textContent = 'Continue only if you requested this link in Lodestar on this device. If you started on another device, open this email there before continuing. Email links work once.';
  button.hidden = false;
  // Deliberate user action: loading this page never redeems the one-use token.
  button.addEventListener('click', () => {
    button.disabled = true;
    window.location.assign(result.target);
  }, { once: true });
} else if (result.kind === 'open') {
  heading.textContent = 'Finish in Lodestar';
  message.textContent = 'Open Lodestar on this device to finish. If you started on another device, request a new email link in Lodestar there. This email link has now been used.';
  appLink.href = result.target;
  appLink.hidden = false;
} else {
  heading.textContent = 'This link is unavailable';
  message.textContent = 'It may have expired or already been used. Return to Lodestar and request a new email link.';
}
