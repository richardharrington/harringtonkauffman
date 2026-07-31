import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("_site");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : target;
  }));
  return files.flat();
}

function destinationFor(urlPath) {
  const clean = decodeURIComponent(urlPath).replace(/^\//, "");
  const direct = path.join(root, clean);
  return path.extname(clean) ? direct : path.join(direct, "index.html");
}

const anchorsIn = (html) => new Set([
  ...[...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]),
  ...[...html.matchAll(/<a\b[^>]*\sname=["']([^"']+)["']/gi)].map((match) => match[1]),
]);

const htmlFiles = (await walk(root)).filter((filename) => filename.endsWith(".html"));
const errors = [];
for (const filename of htmlFiles) {
  const html = await readFile(filename, "utf8");
  const ids = anchorsIn(html);
  const links = [...html.matchAll(/\shref=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const href of links) {
    if (!href || /^(https?:|mailto:|tel:)/i.test(href)) continue;
    const [rawPath, fragment] = href.split("#");
    if (!rawPath && fragment && !ids.has(decodeURIComponent(fragment))) {
      errors.push(`${path.relative(root, filename)}: missing fragment #${fragment}`);
      continue;
    }
    const currentUrlDirectory = `/${path.relative(root, path.dirname(filename)).replaceAll(path.sep, "/")}`;
    const urlPath = rawPath.startsWith("/")
      ? rawPath
      : path.posix.normalize(path.posix.join(currentUrlDirectory, rawPath));
    const destination = destinationFor(urlPath);
    try {
      const info = await stat(destination);
      if (!info.isFile()) throw new Error("not a file");
      if (fragment && destination.endsWith(".html")) {
        const targetHtml = await readFile(destination, "utf8");
        const targetIds = anchorsIn(targetHtml);
        if (!targetIds.has(decodeURIComponent(fragment))) errors.push(`${path.relative(root, filename)}: missing target fragment ${href}`);
      }
    } catch {
      errors.push(`${path.relative(root, filename)}: broken internal link ${href}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked internal links in ${htmlFiles.length} HTML files.`);
}
