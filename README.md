# Lodestar landing page

Static HTML, CSS, and JavaScript for `smbarne.github.io`. No build step, package install, analytics, or hosting subscription required. The existing `lodestar-privacy.html` is preserved.

## Preview

From this directory, run `python3 -m http.server 4173 --bind 127.0.0.1`, then open `http://127.0.0.1:4173`.

## Connect the testing form

The site is connected to [Lodestar Early Access](https://forms.gle/GLdfMWQAqNvqh9Y68). On November 3, 2026, a submission from the landing page using `lodestar-integration-test@example.com` reached Google's “Your response has been recorded” confirmation. This is a synthetic test response, not a tester to invite. Invalid email input was also checked and blocked by the browser. Follow the steps below if replacing the form.

1. Create a Google Form named **Lodestar testing signup**. Add a required short-answer question named **Email address** with email-format validation. Use a normal question rather than Google's signed-in email collection.
2. Explain that the address will be used for testing invitations. Set a confirmation message such as “Thanks for your interest in testing Lodestar. You’re on the list; a testing invitation will be sent separately.”
3. Allow responses without Google sign-in: don't restrict to an organization, don't limit to one response, and don't require verified email collection. Publish the form for anyone with its link. Keep respondent-visible response summaries off.
4. Use **Pre-fill form**, enter a sample email in that question, and copy the full pre-filled link. Leave any other questions empty. Run:

   ```sh
   node scripts/configure-signup.mjs 'PASTE_FULL_PREFILLED_LINK_HERE'
   ```

   The helper saves only the form endpoint and the email question's `entry` ID. The sample address is not retained.
5. Preview the site and submit an address you control. Check that Google's confirmation appears and that the response is in the form's Responses tab. Delete that test response if desired. Optionally link Responses to a Google Sheet to manage invitations.

The signup is deliberately disabled until configured. The browser posts directly to Google Forms in the current tab. Google displays confirmation or validation errors; the site never guesses whether an opaque cross-origin request succeeded. If additional required questions are added later, revisit this integration.

## Publish on GitHub Pages

Merge the landing-page changes into `master`. In repository **Settings → Pages**, use **Deploy from a branch**, `master`, `/ (root)` if Pages is not already configured. The site is intended for `https://smbarne.github.io/`. Complete signup configuration and a real response check before launch.

## Domain and hosting later

The files use relative asset URLs and have no hosting-specific runtime. They can move together to another static host. A custom domain can also be attached to the existing GitHub Pages site; separate paid hosting is not required solely to use your own domain. When a domain is chosen, configure it in Pages, add the registrar's required DNS records, and enable HTTPS. Follow GitHub's current documentation rather than copying stale DNS values: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Assets

Brand SVGs come from Lodestar's `brand/` directory. All screenshots are actual app captures, labeled as development builds on the page. Each image links to its full-size file and retains its original aspect ratio.

- `army-list.png`, `unit.png`: iPhone captures from `play-store-visual-assets-b32787/brand/app-store/raw-iphone/`.
- `android-phone.png`: Android phone list from `play-store-visual-assets-b32787/brand/play-store/raw/list.png`.
- `ipad.png`: iPad list from `play-store-visual-assets-b32787/brand/app-store/raw-ipad/list.png`.
- `mission.png`, `deployment.png`: fresh November 3, 2026 captures on Store iPhone 17 Pro, built from iOS revision `d9d8de3` (deployment-distance work, matching the merged rules implementation). Shows Supply Drop in Standard mode and Acropolis with measured distances. Captured at 1206 × 2622 using `simctl io screenshot`.
- `android-tablet.png`: fresh November 3, 2026 capture of Gauntlet with measured distances from Android revision `b331d56`. Generated on an isolated 2560 × 1600 Android 35 tablet using the existing `RulesGamePagesTest#deploymentIndexOpensAScaledMapAndCompleteSpokenKey` screenshot test, which passed. The test renders the production Rules screen and saves its Compose content; it omits system chrome.

Replace with new captures as the app evolves. Screenshot source worktrees are in the Lodestar repository under `.claude/worktrees/`.

- `mac.jpg`: Mac factions browser captured from the running Lodestar app.

- `iphone-duo.png`: iPhone Duo simulator outer display, showing the Rules screen.
