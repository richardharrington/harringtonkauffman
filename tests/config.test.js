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

test("every Pages CMS select field provides valid options", async () => {
  const config = loadYaml(await readFile(".pages.yml", "utf8"));
  const visit = (fields = []) => fields.flatMap((field) => [field, ...visit(field.fields)]);
  const fields = config.content.flatMap((section) => visit(section.fields));
  for (const field of fields.filter((item) => item.type === "select")) {
    assert.ok(Array.isArray(field.options?.values), `${field.name} is missing options.values`);
    assert.ok(field.options.values.length > 0, `${field.name} has no select options`);
  }
});

test("engagement showtimes use a friendly date-and-time field", async () => {
  const config = loadYaml(await readFile(".pages.yml", "utf8"));
  const engagements = config.content.find((section) => section.name === "engagements");
  const showtimes = engagements.fields.find((field) => field.name === "showtimes");
  const datetime = showtimes.fields.find((field) => field.name === "datetime");
  assert.equal(datetime.type, "date");
  assert.equal(datetime.options.time, true);
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
