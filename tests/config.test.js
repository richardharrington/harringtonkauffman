import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { load as loadYaml } from "js-yaml";

test("Pages CMS exposes the agreed editorial areas", async () => {
  const config = loadYaml(await readFile(".pages.yml", "utf8"));
  const names = new Set(config.content.map((section) => section.name));
  for (const required of [
    "engagements", "homepage", "shows", "performanceHistory", "company",
    "reviews", "pressImages", "diary",
  ]) assert.ok(names.has(required), `missing CMS section: ${required}`);
});

test("Pages CMS does not expose presentation or build configuration", async () => {
  const source = await readFile(".pages.yml", "utf8");
  for (const prohibited of ["site.css", "netlify.toml", "_redirects", "eleventy.config"])
    assert.equal(source.includes(prohibited), false, `CMS exposes ${prohibited}`);
});

test("legacy redirect rules cover all known public entry points", async () => {
  const redirects = await readFile("src/_redirects", "utf8");
  for (const legacy of [
    "/Company.html", "/shows.html", "/Reviews.html", "/HK_image_downloads.html",
    "/Calendar.html", "/Contactus.html", "/Canada_2000_diary.html",
  ]) assert.ok(redirects.includes(legacy), `missing redirect: ${legacy}`);
});
