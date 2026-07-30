import { readFileSync } from "node:fs";
import path from "node:path";
import { load as loadYaml } from "js-yaml";
import MarkdownIt from "markdown-it";
import { dateAttribute, orderEngagements } from "./src/assets/js/event-state.mjs";

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[character]));

function imageCatalog() {
  return JSON.parse(readFileSync(path.resolve(".cache/images.json"), "utf8"));
}

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yml", (contents) => loadYaml(contents));

  const catalog = imageCatalog();
  const imagesByFilename = Object.fromEntries(catalog.map((image) => [image.filename, image]));
  const markdown = new MarkdownIt({ html: false, linkify: true, typographer: false });
  const normalizeFilename = (filename) => path.basename(decodeURIComponent(String(filename || "")));

  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("harrington");
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ ".cache/generated": "generated" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  eleventyConfig.addGlobalData("imageArchive", catalog);
  eleventyConfig.addGlobalData("buildYear", new Date().getUTCFullYear());

  eleventyConfig.addShortcode("image", function (filename, alt, className = "", sizes = "100vw", loading = "lazy") {
    const normalizedFilename = normalizeFilename(filename);
    const image = imagesByFilename[normalizedFilename];
    if (!image) throw new Error(`Unknown source image: ${normalizedFilename}`);
    const largest = image.outputs.at(-1);
    const jpegSrcset = image.outputs.map((output) => `${output.jpeg} ${output.width}w`).join(", ");
    const webpSrcset = image.outputs.map((output) => `${output.webp} ${output.width}w`).join(", ");
    return `<picture${className ? ` class="${escapeHtml(className)}"` : ""}>
      <source type="image/webp" srcset="${webpSrcset}" sizes="${escapeHtml(sizes)}">
      <img src="${largest.jpeg}" srcset="${jpegSrcset}" sizes="${escapeHtml(sizes)}" alt="${escapeHtml(alt)}" width="${image.width}" height="${image.height}" loading="${loading === "eager" ? "eager" : "lazy"}" decoding="async">
    </picture>`;
  });

  eleventyConfig.addFilter("findImage", (filename) => imagesByFilename[normalizeFilename(filename)]);
  eleventyConfig.addFilter("markdown", (value = "") => markdown.render(String(value)));
  eleventyConfig.addFilter("htmlDateTime", dateAttribute);
  eleventyConfig.addFilter("formatShowtime", (value) => {
    const source = value instanceof Date ? value.toISOString() : String(value || "");
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(source);
    if (!match) return source;
    const [, year, month, day, hour, minute] = match;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  });
  eleventyConfig.addFilter("byFilename", (items = []) => Object.fromEntries(items.map((item) => [item.filename, item])));
  eleventyConfig.addFilter("reverse", (items = []) => [...items].reverse());
  eleventyConfig.addFilter("diaryAdjacent", (collection, inputPath, offset) => {
    const index = collection.findIndex((entry) => entry.inputPath === inputPath);
    return index < 0 ? undefined : collection[index + Number(offset)];
  });

  eleventyConfig.addCollection("shows", (api) => api.getFilteredByGlob("src/shows/*.md")
    .sort((a, b) => Number(a.data.order) - Number(b.data.order)));
  eleventyConfig.addCollection("performanceHistory", (api) => api.getFilteredByGlob("src/performance-history/*.md")
    .sort((a, b) => String(b.data.sortDate).localeCompare(String(a.data.sortDate))));
  eleventyConfig.addCollection("diary", (api) => api.getFilteredByGlob("src/diary/*.md")
    .sort((a, b) => String(a.data.entryDate).localeCompare(String(b.data.entryDate))));
  eleventyConfig.addCollection("engagements", (api) => api.getFilteredByGlob("src/engagements/*.md"));
  eleventyConfig.addCollection("engagementsDisplay", (api) => {
    const entries = api.getFilteredByGlob("src/engagements/*.md").map((entry) => ({
      entry,
      startDate: entry.data.startDate,
      endDate: entry.data.endDate || entry.data.startDate,
    }));
    return orderEngagements(entries)
      .filter((item) => item.state === "future" || item.state === "recent")
      .map((item) => {
        item.entry.data.eventState = item.state;
        return item.entry;
      });
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
