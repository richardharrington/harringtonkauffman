# Harrington & Kauffman

Eleventy source for [harringtonkauffman.com](https://harringtonkauffman.com/).
The generated `_site/` directory is not committed.

## Local development

Requirements: Node.js 20 or newer.

```sh
npm install
npm run dev
```

Eleventy serves the site locally and watches source files. Image derivatives are
created in `.cache/generated/` before the server starts.

## Production and checks

```sh
npm run build       # generate images and build _site/
npm test            # event-state tests
npm run check:links # check generated internal links and fragments
npm run validate:html # validate generated HTML
npm run check       # build, tests, links, and HTML validation
```

Netlify uses the same `npm run build` command for production, branch, and deploy
preview builds. Pages CMS edits the portable content under `src/`; during review,
select the `redesign` branch before committing changes.
