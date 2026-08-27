#!/usr/bin/env node
/**
 * Regenerates the script-src / style-src hashes in netlify.toml from the inline
 * <script> and <style> blocks in index.html.
 *
 *   node tools/csp-hashes.mjs          # rewrite netlify.toml
 *   node tools/csp-hashes.mjs --check  # exit 1 if it is out of date (CI)
 *
 * The page has no build step, so the Content-Security-Policy has to be kept in
 * step with the markup by hand. Run this after editing anything inside the
 * inline <style> or <script> blocks — otherwise the browser will refuse to
 * apply them and the page renders unstyled and inert.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const HTML = "index.html";
const TOML = "netlify.toml";
const check = process.argv.includes("--check");

const html = readFileSync(HTML, "utf8");
const sha = (body) => "'sha256-" + createHash("sha256").update(body, "utf8").digest("base64") + "'";
const bodies = (tag) =>
  [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "g"))].map((m) => m[1]);

// CSP hashes cover the element's exact text content, byte for byte.
const scripts = [...new Set(bodies("script").map(sha))];
const styles = [...new Set(bodies("style").map(sha))];

if (/\sstyle="/.test(html)) {
  console.error("error: inline style=\"…\" attribute found. Hashes cannot cover style\n" +
                "attributes; move it to a class in the <style> block.");
  process.exit(1);
}

let toml = readFileSync(TOML, "utf8");
const before = toml;
const swap = (dir, hashes) => {
  const re = new RegExp(`(${dir} 'self')[^;]*`);
  if (!re.test(toml)) throw new Error(`no ${dir} directive in ${TOML}`);
  toml = toml.replace(re, `$1 ${hashes.join(" ")}`);
};
swap("script-src", scripts);
swap("style-src", styles);

console.log(`${scripts.length} script hash(es), ${styles.length} style hash(es)`);

if (toml === before) {
  console.log("netlify.toml already up to date");
} else if (check) {
  console.error("error: netlify.toml CSP hashes are stale — run `node tools/csp-hashes.mjs`");
  process.exit(1);
} else {
  writeFileSync(TOML, toml);
  console.log("netlify.toml updated");
}
