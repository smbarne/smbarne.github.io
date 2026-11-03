import { writeFileSync } from "node:fs";

try {
  const url = new URL(process.argv[2]);
  if (url.origin !== "https://docs.google.com" || !/^\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform$/.test(url.pathname) || url.username || url.password) {
    throw new Error("Use the full docs.google.com/forms/d/e/.../viewform pre-filled link.");
  }
  const entries = [...url.searchParams.keys()].filter(key => /^entry\.\d+$/.test(key));
  if (entries.length !== 1) throw new Error("Create a pre-filled link with only the email question filled in.");
  const config = { action: `${url.origin}${url.pathname.replace(/viewform$/, "formResponse")}`, emailField: entries[0] };
  writeFileSync(new URL("../signup-config.js", import.meta.url), `// Public Google Form routing. No credentials or respondent data.\nwindow.LODESTAR_SIGNUP = ${JSON.stringify(config, null, 2)};\n`);
  console.log("Signup configured. Verify the live form accepts and records a test response before publishing.");
} catch (error) {
  console.error(error.message);
  console.error("Usage: node scripts/configure-signup.mjs 'GOOGLE_FORM_PREFILLED_URL'");
  process.exitCode = 1;
}
