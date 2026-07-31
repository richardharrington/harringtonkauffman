# Design cleanup pass — implementation instructions

This document is the complete and self-contained specification for a design
cleanup pass on the Harrington & Kauffman website. It describes five work
items, each intended to land as its own Git commit.

## Project orientation

- Static site built with Eleventy 3 (Nunjucks templates, YAML data files).
- Source lives in `src/`; build output goes to `_site/` (do not edit `_site/`
  directly).
- Key files for this pass:
  - `src/_includes/layouts/base.njk` — site-wide layout: header, footer, head.
  - `src/index.njk` — homepage.
  - `src/press.njk` — Press & Contact page.
  - `src/shows.njk` — Shows page.
  - `src/performance-history.njk` — Selected Performance History page.
  - `src/assets/css/site.css` — all styles (CSS cascade layers:
    `reset, base, layout, components`).
  - `src/_data/site.yml` — site-wide data including social links.
  - `src/_data/pressImages.yml` — press-photo metadata.
  - `eleventy.config.js` — shortcodes, filters, collections.
- Useful commands (see `package.json`):
  - `npm run build` — clean, regenerate image derivatives, build.
  - `npm test` — Node test suite in `tests/`.
  - `npm run check:links` — internal link checker.
  - `npm run validate:html` — html-validate over `_site/`.
  - `npm run check` — all of the above in sequence. Run this to verify.

## Hard constraints — do NOT change these

The site intentionally contains pre-launch placeholder content. The owner
wants all of it left exactly as-is:

1. **Cease-and-desist letter placeholders** on the Shows page
   (`.letter-grid`, `.letter-placeholder`, the `letters:` data in
   `src/shows/01-motel-california.md`). Keep the dashed empty boxes.
2. **The test engagement** `src/engagements/2026-07-28-test-production.md`
   ("Operation Crush the Rebels 2"). It renders on the homepage on purpose.
3. **All `.review-marker` TBD text** throughout templates and data files
   (photographer/caption TBDs, "MISSING DEVELOPMENT HISTORY", "VERIFY EMAIL",
   editorial notes, the 404 page's "AI GUSTAVE" line, etc.).

Other constraints:

- Never push Git branches or commits; the owner handles pushes.
- Commit messages: concise imperative subject plus a brief body explaining
  the important changes and their rationale; every line ≤ 80 characters.
- One work item below = one commit, in the order given.

---

## Work item 1 — Press page cleanup

Files: `src/press.njk`, `src/assets/css/site.css`

The Press page currently ends with a review-only "overflow" section: a
dashed-red box containing every uncurated image, headed "TBD — THESE ARE
OVERFLOW". This is pre-launch scaffolding and must be removed. (The
letter-grid placeholders described in the constraints above are a different
feature — do not touch those.)

1. In `src/press.njk`, delete the entire final section:
   `<section class="overflow" aria-labelledby="overflow-title"> … </section>`.
2. Update the remaining copy to be launch-appropriate:
   - The photos section currently has eyebrow "Press photographs" and
     `<h2 id="photos-title">Provisional selection</h2>`. Change the h2 text
     to "Selected press photographs".
   - The paragraph "Download links provide the untouched original files. The
     page itself uses generated web-sized derivatives." may stay, but add a
     sentence pointing to the complete Image Archive (the overflow section
     previously contained the only link to `/press/image-archive/` on this
     page). Suggested wording: "The complete
     <a href="/press/image-archive/">Image Archive</a> retains every original
     file."
3. Remove the now-unused `{% set pressByName = pressImages.items | byFilename %}`
   line at the top of `src/press.njk` if nothing else on the page references
   `pressByName` after the overflow section is gone (check first).
4. In `site.css`, delete the `.overflow` ruleset, the
   `.overflow .image-grid` ruleset, and every `.overflow` entry inside the
   `@media (max-width: 65rem)`, `@media (max-width: 47rem)`, and
   `@media (max-width: 31rem)` blocks. Note: `.overflow .image-grid` appears
   inside media queries alongside plain `.image-grid` selectors — remove only
   the `.overflow`-scoped parts.

## Work item 2 — Footer redesign and homepage path-grid removal

Files: `src/_includes/layouts/base.njk`, `src/index.njk`,
`src/_data/site.yml`, `src/assets/css/site.css`

### 2a. Remove the homepage path-grid

`src/index.njk` ends with:

```njk
<nav class="path-grid" aria-label="Explore the work">
  <a href="/shows/">Shows →</a>
  <a href="/performance-history/">Touring History →</a>
</nav>
```

Delete it (its links are absorbed into the new footer, below) and delete the
`.path-grid` and `.path-grid a` rulesets from `site.css`, plus the
`.path-grid` entry in the `@media (max-width: 47rem)` block.

### 2b. Rebuild the footer

Replace the current footer in `base.njk` (the `<footer class="site-footer">`
element, which currently contains `.footer-archive`, a social-links nav, and
`.footer-meta`) with a tidy, heading-led, three-column footer plus a
full-width centered copyright line. Structure:

```njk
<footer class="site-footer">
  <div class="footer-inner">
    <nav class="footer-column" aria-label="Explore">
      <p class="footer-heading">Explore</p>
      <ul>
        <li><a href="/shows/">Shows</a></li>
        <li><a href="/performance-history/">Performance History</a></li>
        <li><a href="/about/">About</a></li>
        <li><a href="/press/">Press &amp; Contact</a></li>
      </ul>
    </nav>
    <nav class="footer-column" aria-label="Archive">
      <p class="footer-heading">Archive</p>
      <ul>
        <li><a href="/diary/">Gustave and Nhar’s Diary</a></li>
        <li><a href="/press/image-archive/">Image Archive</a></li>
      </ul>
    </nav>
    <div class="footer-column">
      <p class="footer-heading">Connect</p>
      <ul>
        <li><a href="/press/#contact">Contact</a></li>
        <!-- one <li> per entry in site.social: icon + label on one line -->
      </ul>
    </div>
  </div>
  <p class="copyright">© {{ buildYear }} Harrington &amp; Kauffman</p>
</footer>
```

Requirements:

- The footer must contain everything the top nav does (Explore column), plus
  links not important enough for the top nav (Archive column), plus
  Contact/social (Connect column).
- Social links: each on one line as `[icon] Label`, e.g. a small inline
  Facebook SVG followed by the label. Both current entries in
  `src/_data/site.yml` are Facebook pages ("Harrington & Kauffman on
  Facebook", "Gustave and Nhar on Facebook"); shorten the displayed labels to
  "Harrington &amp; Kauffman" and "Gustave &amp; Nhar" so the two links are
  distinguishable. Add an `icon:` key (e.g. `icon: facebook`) to each entry
  in `site.yml` and keep the rendering data-driven (`{% for social in
  site.social %}`), with the inline SVG chosen by the icon key. Inline the
  SVG in the template — do not add image assets. Keep
  `rel="noopener noreferrer"` on social links.
- Copyright: full-width, centered, on its own line at the very bottom,
  visually separated from the columns above it (e.g. a top border or rule
  spanning the footer width). Keep using the `buildYear` global.
- CSS: replace the existing `.footer-inner` grid and the `.footer-archive`,
  `.footer-meta`, `.footer-heading`, and `.social-links` rulesets with styles
  for the new structure: three columns on desktop (grid or flex), small font
  size (the current footer uses `0.84rem` — keep roughly that), unstyled
  lists (`list-style: none`, no padding), comfortable but not excessive gap,
  single stacked column under the existing `47rem` breakpoint. Keep
  `.site-footer`'s top border. The existing `.footer-heading` style (muted,
  bold) may be retained/adapted. Size social icons at roughly 1em and align
  them with the label text (e.g. `vertical-align` or flex on the link).

## Work item 3 — Whitespace tightening

File: `src/assets/css/site.css`

Apply exactly these value changes (roughly a 25–40% reduction of the large
vertical paddings and gaps):

| Selector | Property | From | To |
|---|---|---|---|
| `.page` | `padding-block` | `clamp(3rem, 8vw, 7rem)` | `clamp(2rem, 6vw, 4.5rem)` |
| `.page-intro` | `margin-bottom` | `clamp(3rem, 8vw, 6rem)` | `clamp(2rem, 5vw, 3.5rem)` |
| `.show-section` | `padding-block` | `3rem 5rem` | `2.5rem 3rem` |
| `.show-layout` | `gap` | `2rem clamp(2rem, 6vw, 6rem)` | `2rem clamp(1.5rem, 4vw, 3.5rem)` |
| `.home-hero` | `min-height` | `min(49rem, calc(100vh - 6rem))` | `min(34rem, calc(100vh - 6rem))` |

Rationale for the hero change: the homepage hero must keep a substantial
minimum height so the large photo retains presence, but the current ~49rem
minimum produces a full-screen void under the text when no show is
scheduled. Do not remove the minimum entirely.

Do not change any other spacing values in this pass.

## Work item 4 — Image treatment: no cropping, no letterboxing

Files: `src/assets/css/site.css`, possibly `src/shows.njk`

General principle for this item: photos must never be cropped
(`object-fit: cover` is banned for content images) and must never sit in
fixed-aspect frames with empty bars (`object-fit: contain` inside a forced
`aspect-ratio` box). Rows of images must be left-aligned — never centered —
so partial rows have clean edges. The one allowed exception to all of the
above is the homepage hero image (`.home-hero-image`), which keeps
`object-fit: cover` by design.

### 4a. Press image grid (`.image-card`)

Current CSS forces every photo into a 4:3 frame with `object-fit: contain`,
which letterboxes non-4:3 photos (a portrait press photo currently leaves
over half its frame as empty beige).

Change `.image-card img` to natural proportions with a height cap:

- Remove `aspect-ratio: 4 / 3` and `object-fit: contain`.
- Use `width: 100%; height: auto;` so each photo shows fully at its natural
  aspect ratio.
- Add a `max-height` (suggested: `22rem`) so portrait photos cannot tower
  over a row. When the cap engages, the image must size by height
  (`width: auto; max-width: 100%`) and sit left-aligned within its card —
  implement so that both behaviors are correct (one approach: keep
  `width: 100%` uncapped, and rely on the cap only via a wrapper or via
  `object-fit: contain` *without* a forced aspect ratio and with the
  `picture` background removed, so no visible bars result; choose the
  simplest CSS that yields: uncropped photo, no visible empty frame, capped
  height, left alignment).
- Remove the `background: #e6dccb` on `.image-card picture` (it exists only
  to fill letterbox bars).
- Add `justify-items: start` to `.image-grid` so partial rows are locked
  left.

### 4b. Shows page principal image (`.show-image`)

Current CSS: `.show-image img { width: 100%; max-height: 43rem; object-fit:
cover; }` — this crops. Change to natural proportions: `width: 100%;
height: auto;` and drop `object-fit: cover`. Keep a `max-height` of `43rem`
only if it can apply without cropping (i.e. when capped, switch to
`width: auto; max-width: 100%`, left-aligned); otherwise drop the cap.

Note: the About page (`src/about.njk`) also uses `class="show-image"` for
its large photo — verify the change looks right there too.

### 4c. Shows page context images (`.context-images`)

Current CSS: a 2-column grid where each image is forced to
`aspect-ratio: 4 / 3; object-fit: cover` — this crops, and a show with a
single additional image (Motel California) leaves a half-empty row.

Replace the grid with a left-aligned "filmstrip" row:

- `.context-images` becomes `display: flex; flex-wrap: wrap; gap: 1rem;
  justify-content: flex-start; margin-top: 1.5rem;` (keep the existing
  margin).
- Each image displays at a fixed height with natural width:
  `.context-images img { height: 14rem; width: auto; }` (adjust the figure
  wrapper as needed so captions sit under images and figures size to their
  image). This gives clean top and left edges with no cropping.
- Single-image case: when a show has exactly one additional image, it should
  span the full width of its column at natural proportions instead of using
  the filmstrip height. Implement with a `:has()` or
  `:only-child`-style selector if clean, otherwise by adding a modifier
  class from the template (`src/shows.njk`) when
  `show.data.additionalImages.length == 1`. Spanning means `width: 100%;
  height: auto` — uncropped.
- Remove the old `.context-images img` aspect-ratio/cover rules and the
  `.context-images` entry in the `@media (max-width: 31rem)` block if it no
  longer applies.

### 4d. Dead CSS removal

Delete the `.home-intro` ruleset and the `.home-intro` entry in the
`@media (max-width: 47rem)` block — no template uses that class.

## Work item 5 — Data-driven ledger nav

Files: `src/performance-history.njk`, `eleventy.config.js`

The Performance History page has a hardcoded jump nav:

```njk
<nav aria-label="Jump by decade"><ul class="ledger-nav"><li><a href="#2020s">2020s</a></li><li><a href="#2010s">2010s</a></li><li><a href="#2000s">2000s</a></li><li><a href="#1990s">1990s</a></li><li><a href="#undated">Dates to recover</a></li></ul></nav>
```

If a decade has no entries, its anchor target doesn't exist and the link is
dead. Make the nav data-driven:

1. Add a filter in `eleventy.config.js` (near the existing
   `addFilter` calls), e.g.:

   ```js
   eleventyConfig.addFilter("decades", (entries = []) => {
     const seen = [];
     for (const entry of entries) {
       const decade = String(entry.decade || "undated");
       if (!seen.includes(decade)) seen.push(decade);
     }
     return seen;
   });
   ```

   This preserves first-appearance order, which matches the page's
   chronological (newest-first) ordering of year headings.
2. In `src/performance-history.njk`, replace the hardcoded `<ul>` with a
   loop over `performanceHistory.entries | decades`, rendering one
   `<li><a href="#…">` per decade. Link text: the decade string itself
   (e.g. "2010s"), except the `undated` decade, which keeps the label
   "Dates to recover". Verify the generated `href` anchors match the `id`
   values the template actually emits on the `<h2 class="ledger-year">`
   elements (the template assigns the decade as the id only on the first
   entry of each decade — confirm this logic still holds for every decade
   in the data, including `undated`).

---

## Verification

After all five commits, run `npm run check` (build + tests + link checker +
html-validate) and fix any failures. Additionally, manually inspect the
built HTML in `_site/` for these pages to confirm the changes landed:

- `index.html` — no path-grid; new footer; hero min-height.
- `press/index.html` — no overflow section; updated heading/copy; archive
  link present.
- `shows/index.html` — uncropped images; filmstrip context rows; letter
  placeholders still present and unchanged.
- `about/index.html` — large photo uncropped.
- `performance-history/index.html` — ledger nav matches the decades present
  in the data.
- Every page — new footer with three columns and centered copyright.

Also confirm the hard constraints: the letter placeholders, the test
engagement on the homepage, and all `.review-marker` TBD text are still
present and untouched.
