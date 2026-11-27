"use strict";

// Mixpanel web analytics. The project token is a public client identifier (it
// ships in every page that uses Mixpanel) and cannot read data back out.
const MIXPANEL_TOKEN = "5ae33c40f3d5fbd33be9a5a0e5929e5b";

// Respect Do Not Track / Global Privacy Control, and stay off for local previews.
const optedOut = navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
const isLocal = ["localhost", "127.0.0.1", ""].includes(location.hostname);

window.lodestarTrack = () => {};

if (!optedOut && !isLocal) {
  installMixpanelStub();
  window.mixpanel.init(MIXPANEL_TOKEN, {
    autocapture: false,
    track_pageview: true,
    persistence: "localStorage",
    record_sessions_percent: 0,
    ignore_dnt: false,
  });
  // Calls made before the library arrives are queued by the stub and replayed.
  // sendBeacon lets the event survive clicks that leave the page.
  window.lodestarTrack = (name, props) => window.mixpanel.track(name, props, { transport: "sendBeacon" });
  trackSectionViews();
}

// mixpanel-2-latest.min.js is Mixpanel's "snippet" build: it does nothing unless
// window.mixpanel is already the loader stub from Mixpanel's install snippet.
// This is that stub, written out readably. It records calls in arrays, then the
// library replays them and replaces window.mixpanel with the real instance.
function installMixpanelStub() {
  if (window.mixpanel?.__SV) return;
  const methods = ("disable time_event track track_pageview track_links track_forms register register_once " +
    "alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking " +
    "has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking " +
    "people.set people.set_once people.unset people.increment people.append people.union people.remove").split(" ");
  const mixpanel = (window.mixpanel = []);
  mixpanel._i = [];
  mixpanel.init = (token, config, name) => {
    const target = name === undefined ? mixpanel : (mixpanel[name] = []);
    target.people = target.people || [];
    for (const method of methods) {
      const [first, second] = method.split(".");
      const owner = second ? target[first] : target;
      const fn = second || first;
      owner[fn] = (...args) => { owner.push([fn, ...args]); };
    }
    mixpanel._i.push([token, config, name ?? "mixpanel"]);
  };
  mixpanel.__SV = 1.2;
  const script = document.createElement("script");
  script.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
  script.async = true;
  document.head.appendChild(script);
}

// Where on the page an element sits: nav, footer, or the nearest section id.
function placement(el) {
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  return el.closest("section[id]")?.id || el.closest("main")?.id || "page";
}

function destination(a) {
  const href = a.getAttribute("href") || "";
  if (href.startsWith("mailto:")) return { type: "email" }; // address omitted
  const url = new URL(href, location.href);
  const external = url.origin !== location.origin;
  const image = /\.(png|jpe?g|svg)$/i.test(url.pathname);
  return {
    type: external ? "external" : image ? "screenshot" : "internal",
    href: external ? url.origin + url.pathname : url.pathname + url.hash,
  };
}

// One delegated listener covers every button and link on every page.
document.addEventListener("click", (event) => {
  const el = event.target.closest?.("a[href], button");
  if (!el) return;
  const label = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);
  const isButton = el.tagName === "BUTTON" || el.classList.contains("button") || el.classList.contains("nav-cta");
  window.lodestarTrack(isButton ? "Button Clicked" : "Link Clicked", {
    label,
    placement: placement(el),
    page: location.pathname,
    ...(el.tagName === "A" ? destination(el) : {}),
  });
}, { capture: true });

// Fires once per section the first time at least 40% of it is on screen.
function trackSectionViews() {
  const sections = document.querySelectorAll("main section[id]");
  if (!sections.length || !("IntersectionObserver" in window)) return;
  const seen = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      seen.unobserve(entry.target);
      window.lodestarTrack("Section Viewed", { section: entry.target.id, page: location.pathname });
    }
  }, { threshold: 0.4 });
  sections.forEach((section) => seen.observe(section));
}
