"use strict";

// Mixpanel web analytics. The project token is a public client identifier (it
// ships in every page that uses Mixpanel) and cannot read data back out.
const MIXPANEL_TOKEN = "5ae33c40f3d5fbd33be9a5a0e5929e5b";

// Respect Do Not Track / Global Privacy Control, and stay off for local previews.
const optedOut = navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
const isLocal = ["localhost", "127.0.0.1", ""].includes(location.hostname);

window.lodestarTrack = () => {};

if (!optedOut && !isLocal) {
  const script = document.createElement("script");
  script.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
  script.async = true;
  script.onload = () => {
    if (!window.mixpanel) return;
    window.mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: false,
      track_pageview: true,
      persistence: "localStorage",
      record_sessions_percent: 0,
      ignore_dnt: false,
    });
    window.lodestarTrack = (name, props) => window.mixpanel.track(name, props);
  };
  document.head.appendChild(script);
}
