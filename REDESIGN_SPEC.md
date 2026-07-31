# Harrington & Kauffman site redesign specification

## Status and authority

This document records settled product decisions from a detailed design interview.
Implement these decisions rather than reopening them unless inspection reveals a
genuine conflict or technical impossibility.

Work on the currently checked-out `redesign` branch, which was created from
`main` for this project. Do not modify, commit to, push, merge, or rewrite
`main`. Do not change the live production site. Before any push or GitHub pull
request, obtain explicit user approval.

## Project facts

- Production URL: <https://harringtonkauffman.com/> (with the second `m`).
- `www` redirects to the apex domain.
- Netlify currently serves the site; its Netlify hostname is
  `vigorous-einstein-086ce8.netlify.app`.
- Git remote: `git@github.com:richardharrington/harringtonkauffman.git`.
- The existing site dates to 2000 and is plain, old-style HTML.
- The repository currently has no package/build configuration.
- There are 71 image files in `images/`, totaling about 14 MB. Keep all of them.
- The current May 2026 engagement has passed. There is no future engagement to
  advertise initially.

## Goals and priorities

Build a minimal, modern, responsive site that retains deliberate DIY character.
It must be much easier to navigate without becoming polished agency-style
branding.

Visitor priorities, in order:

1. Audience members: what is happening next, where, and how to attend.
2. Presenters, programmers, and press: repertoire, touring record, credibility,
   press materials, and contact.
3. Existing fans and explorers: videos, photographs, reviews, and diaries.

The site is a deliberate voice hybrid:

- Structure, dates, contact details, and essential facts must be clear and
  professional.
- Restrained captions, notices, and asides may carry Gustave and Nhar's deadpan,
  earnest voice.
- Do not turn the characters into generic quirky mascots.

## Explicit non-goals

- No React, Astro, SPA, or public client-side framework.
- No glossy cards, gradients, background video, autoplay, carousels, pop-ups,
  or agency-style animation.
- No hamburger menu.
- No analytics, trackers, advertising scripts, or cookie banner.
- No comments or reactions on diary entries.
- No downloadable press-kit PDF yet.
- No public snapshot of the old site after launch; Git history preserves it.
- No current headshots are required.
- No individual pages for every stage production in this iteration.
- Do not include Richard's or Chris's solo work in the main repertoire or
  performance ledger.
- Do not invent uncertain dates, credits, quotations, legal facts, or history.

## Technology

### Static generator

Use Eleventy (11ty) with a small Node build. Produce semantic static HTML with
little or no client-side JavaScript. Use templates/partials for shared chrome and
structured content files suitable for CMS editing.

Use a current stable, maintainable Eleventy setup. Add a lockfile and document
local development/build commands. Configure Netlify in the repository so branch
and deploy-preview builds produce the correct output.

### CMS

Use Pages CMS with a root `.pages.yml` file.

Content should remain ordinary portable Markdown, YAML, or JSON; avoid
Pages-CMS-specific content structures that would make a later switch to Decap
CMS difficult.

Pages CMS should expose:

- Upcoming engagements
- Homepage introduction and featured quotation
- Show descriptions and development histories
- Performance-history entries
- Company biographies
- Review excerpts
- Press images and captions
- Diary entries
- Social links and contact address

It must not expose navigation structure, colors, typography, templates,
redirects, or build configuration.

Publishing is direct: CMS saves commit to the selected branch. During review,
Richard or Chris can use GitHub authentication, select `redesign`, commit through
Pages CMS, update the open pull request, and trigger the same Netlify preview.
After launch, Pages CMS can edit `main`; email-only collaborators may be tested
then. Empty optional content must not render empty UI.

### Review/deployment workflow

- Continue work on the existing `redesign` branch.
- The eventual review mechanism is a draft GitHub pull request and Netlify deploy
  preview, leaving `harringtonkauffman.com` unchanged.
- A typical preview URL will resemble
  `deploy-preview-N--vigorous-einstein-086ce8.netlify.app`.
- Do not push or open the pull request without explicit user approval.
- The first implementation is a review draft, not launch-ready content.

## URL structure

Use lowercase directory URLs:

- `/`
- `/shows/`
- `/performance-history/`
- `/about/`
- `/press/`
- `/press/image-archive/`
- `/diary/`
- One page per diary entry under `/diary/`

Add Netlify redirects from legacy public URLs to appropriate replacements,
including at least:

- `Company.html` -> `/about/`
- `shows.html` -> `/shows/` (preserve/map useful old fragment IDs)
- `Reviews.html` -> `/press/`
- `HK_image_downloads.html` -> `/press/`
- `Calendar.html` -> `/`
- `Contactus.html` -> `/press/`
- `Canada_2000_diary.html` -> the appropriate 2000 diary archive/entry location

Inspect all existing local links before finalizing redirects. Preserve old diary
anchor IDs where practical. Do not publish a `/legacy/` or `/old-site/` copy.

## Primary navigation

Permanent top-level navigation:

- Shows
- Performance History
- About
- Press & Contact

The text masthead links home, so do not add a separate Home item. Keep all four
links visibly available on mobile and let them wrap. Do not use a hamburger menu.
Diary and social links are secondary, in the footer or contextual locations.

## Visual direction

Use modern editorial structure with handmade interruptions:

- Warm off-white background
- Near-black text
- Old-site red for links and small accents
- Let the blue bicycle photograph supply blue rather than creating a blue brand
  palette
- Georgia for masthead, major headings, and featured quotations
- Plain system sans-serif for navigation, metadata, captions, and body copy
- Occasional monospace for the performance ledger or character notices
- No downloaded webfonts
- Generous but not luxurious whitespace
- Strong responsive layout and readable line lengths
- Ordinary visible underlines for links where appropriate
- Slightly peculiar rules, alignments, or typewritten notes may provide DIY
  character, but usability comes first

Use a text-only `Harrington & Kauffman` masthead. There is no formal logo. Use
`HK` in Georgia for the favicon; this is provisional.

### Bicycle image

`images/Gustave_and_Nhar_2_colorized.jpg` is the full-resolution version of the
iconic bicycle portrait currently represented by `images/Bike_closeup.jpg`.
Use the full-resolution image as the principal identifying photograph. It is
intentionally timeless: do not add a date/place caption for now and do not
apologize for its age.

Create a 1200x630 social-sharing image based on the bicycle photograph, warm
space, and `Harrington & Kauffman` text. Use it as the default Open Graph/social
preview; individual shows or diary entries may override it with relevant images.
Add ordinary titles, descriptions, canonical URLs, and Open Graph metadata. Do
not perform SEO keyword stuffing.

## Shared content and editorial markers

Approved provisional homepage identification:

> Harrington & Kauffman make comedy theater as Gustave and Nhar.

This can be edited later.

Any newly invented copy specifically in a character's voice must be rendered as
plain visible text prefixed exactly:

- `AI GUSTAVE:`
- `AI NHAR:`

These are temporary editorial labels for review, not source comments and not a
finished-site joke. Keep character invention conservative. Utility copy remains
plain and need not receive an AI label. Do not label migrated historical
character writing as AI.

Other visible review-stage markers include:

- `TBD — THESE ARE OVERFLOW`
- Letter scan placeholders
- `TBD — VERIFY EMAIL`
- Missing development-history markers
- `TBD — PHOTOGRAPHER/CAPTION`

For uncertain photograph details, include any plausible evidence in the marker,
for example:

> TBD — PHOTOGRAPHER/CAPTION. INFERRED FROM FILENAME OR METADATA: xxxxx

Clearly distinguish inference from fact. Do not treat irrelevant metadata such
as Photoshop software/version as photographer evidence.

## Homepage

Keep the homepage focused but not empty. In order, include:

1. Masthead and primary navigation
2. Dominant next-engagement state
3. The bicycle portrait
4. Very short company identification/introduction
5. One static featured press quotation
6. Both existing videos, using click-to-load facades
7. Direct paths to Shows and Performance History
8. Restrained footer with Diary, contact, and social links

Do not create an automated quote carousel. The initial featured quotation is:

> “Harrington & Kauffman reinvent, or just blow up, whatever category
> they're meant to occupy.”
> — Liz Nicholls, *Edmonton Journal*

The wording and attribution were migrated from the historical `Reviews.html`.

### Engagement states

The event data model must support multiple engagements and multiple showtimes.
Feature the nearest future engagement prominently and list later engagements
compactly beneath it.

When none exists, display exactly or substantially:

> No shows currently scheduled. Check back later!

Do not imply permanent closure.

An engagement remains visible for seven days after its final performance. During
that grace period:

- Change `Next show` to `Most recent show`.
- Remove/disable the ticket call to action.

After the seventh day, a very small progressive-enhancement browser script may
hide it and reveal the no-show state. Ensure the no-JavaScript result remains
understandable. Keep expired source data until an editor moves it into
Performance History; do not silently discard it.

Event CMS fields should cover at least production, presenter/festival, venue,
city, start/end dates, multiple showtimes, ticket URL, optional image, and status.

## Shows page

Use one page, with a table of contents/anchor links and this order:

1. *Motel California*
2. *Nharcolepsy*
3. *Cabaret Terrarium*
4. **Animation**

Each stage-show section should support:

- Synopsis
- How it was made/developed
- How it changed or evolved
- Credits
- Concise show-specific touring history
- One principal image and at most two additional contextual images initially
- Optional media entries; absent media must render nothing
- Links from/to relevant Performance History entries

Migrate and carefully edit existing factual descriptions as a starting point.
Use visible TBD markers for missing process/development history rather than
inventing it.

The three stage shows are the H&K/Gustave-and-Nhar canon for this page. Richard's
*Saving the Desert Tortoise* and Chris's *Action Figure* are related solo work;
mention/link them only in the respective biographies if desired.

### Video

Retain both existing videos:

- YouTube live *Cabaret Terrarium* clip:
  `https://www.youtube.com/embed/PNDHPTzSfBU`
- Vimeo animation *Gustave and Nhar at Le Yeti Rouge*:
  `https://player.vimeo.com/video/184946795`

Show both on Home and Shows. Do not load either third-party player until the
visitor clicks a lightweight poster/facade. No autoplay. On Shows, place the live
clip inside *Cabaret Terrarium*. Put *Le Yeti Rouge* in the distinct
**Animation** section; do not call that section Film and do not present the
animation as a stage show. Preserve credits migrated from the historical
`Company.html`, including animator Mike Scott and musician Raiven Hansmann,
subject to factual verification.

Allow optional future video entries for *Nharcolepsy* and *Motel California*;
do not show empty placeholders publicly.

### Cease-and-desist history

The naming/legal episode is one of the most interesting and funny parts of the
company history. Give *Motel California* a prominent subsection titled or
substantially equivalent to **The cease-and-desist letters**.

It should eventually include:

- Factual account of the correspondence and the company's actual fear at the
  time
- Successive names: *Hotel California*, *The Show Formerly Known As*, and
  *Motel California*
- Relevant contemporary review excerpts
- Accessible transcripts of the letters
- Any approved character commentary, visibly AI-labeled during review

There were two letters in succession, probably two pages each. Add four obvious,
CMS-replaceable placeholders:

- Letter 1 — page 1
- Letter 1 — page 2
- Letter 2 — page 1
- Letter 2 — page 2

Support date, sender, caption, transcript, and redaction notes. Do not invent
missing facts. Redactions will be discussed only after scans are supplied; do
not decide them now. This is historical/editorial presentation, not legal
advice.

## Performance History

Launch the page titled **Selected Performance History** because the existing
record is incomplete. Recover every reliable engagement possible from existing
pages and reviews, but do not guess. It can become `Performance History` once the
record is complete.

Use a complete chronological ledger, newest to oldest. Group with year headings
and provide simple decade anchor links at the top. Do not add production filters,
search, decade filtering, or a Show All control. Every production title links to
its Shows-page anchor.

Use one entry per engagement/run, not one per individual showtime. Support date
or date range, production, presenter/festival, venue, city, region/country, and
optional factual note. The current May 2026 No Bones engagement belongs here,
not as an upcoming homepage event.

Individual show sections also contain their own concise production-specific
touring histories; this intentional hybrid gives both views.

Exclude solo projects from this ledger.

## About page

Include:

- Concise company history
- Explanation that Richard Harrington and Chris Kauffman perform as Gustave and
  Nhar
- Three substantial biographies of equal conceptual status:
  - Richard Harrington
  - Chris Kauffman
  - Patricia Buckley

Patricia is a principal company collaborator and must not be demoted to a simple
credit. Kristi McKay and other collaborators receive clear production credits
but no long biography unless updated material is later supplied.

Use the historical `Company.html` as source material, but avoid asserting that
old biographical wording is current without verification. Use visible editorial
markers where updates are needed. Do not require individual headshots; a company
image and text-led biographies are sufficient.

## Press & Contact

Build one page combining a small press kit and contact.

### Press material

The intended final curated section contains:

- Short current company description
- Three to six high-resolution photographs
- Captions and photographer credits where known
- Original-file download links
- Curated review excerpts with publication, critic, year, production, and
  surviving source link
- Contact information

Do not reproduce complete review articles. Use strong, accurately attributed
excerpts migrated from the historical `Reviews.html`; dead source links may be
omitted or replaced with reliable archive links after verification.

The user does not want to curate photographs yet. Create a provisional curated
selection, followed by a conspicuous review-only section labeled exactly:

> TBD — THESE ARE OVERFLOW

Show all remaining candidates visually there so Richard and Chris can compare
and promote/reject images. This overflow section is temporary and will later be
removed from Press; the permanent Image Archive remains.

Do not create a bundled PDF press kit.

### Contact

Provide both:

- A short Netlify-compatible form
- Eventually, visible `info@harringtonkauffman.com`

Form fields:

- Name
- Email
- Message
- Hidden spam honeypot

No subject, phone, organization, categories, newsletter opt-in, attachments, or
accounts. Provide an accessible non-JavaScript success/error flow where Netlify
permits.

Email hosting is not currently working. In the review draft display the address
with `TBD — VERIFY EMAIL`. At launch, show it only after it has been tested;
otherwise temporarily launch with the form alone.

## Image handling and archive

Keep all original files in source control. Do not delete, recompress, or replace
them. Reorganize only if every reference and migration is handled safely.

Generate responsive web derivatives at build time and keep generated output out
of source control where appropriate. Pages CMS must allow future source-image
uploads. Do not load full-resolution originals in ordinary page layouts.

Create `/press/image-archive/`, linked secondarily from Press. It must show a
thumbnail for every original and allow full-resolution download. It is not a
primary-navigation item. Shows uses only selected contextual images and links to
the archive; do not dump all images onto Shows.

## Diary

Migrate both archives into the new system:

- `Canada_2000_diary.html`
- `diary/index.html` (2010 WordPress export)

Create one `/diary/` index grouped by year, newest first, and one page per entry.
Add previous/next links. Preserve original dates and locations where available.
Keep Diary out of primary navigation but link it from the footer and relevant
contexts.

Preserve historical wording exactly, including intentional grammar, spelling,
voice, and the bracketed substitutions such as `[the Great One]` and
`[the One True Song]`. Fix only broken encoding, invalid markup, duplicated
formatting, and clear export artifacts. Do not silently copyedit prose.

Add a short editorial note linking the 2000 diary substitutions to the
cease-and-desist history. The substitutions are part of the humor and historical
record; do not reverse-engineer or restore names in the entries.

Diary content model author options:

- Gustave
- Nhar
- Gustave and Nhar

The Nhar body must be optional, allowing an image, diagram, found object, title,
or other nonverbal entry. Create no new Nhar or joint posts initially. Empty
author categories must produce no headings, filters, links, or archive pages, so
visitors cannot see dormant categories.

Do not implement comments or reactions.

When a Bluesky diary account exists, link to it unobtrusively. Do not embed an
automated feed. Allow selected future Bluesky entries to be manually preserved
through the CMS as site diary entries.

## Social links and footer

Use plain, non-prominent text links, not branded buttons or feed embeds.
Eventually include:

- Harrington & Kauffman Facebook page
- Gustave and Nhar Facebook page
- Bluesky diary/profile

Only one existing Facebook URL was found in the repository:
`https://www.facebook.com/pages/Harrington-Kauffman/259202594108605`.
Its displayed identity may not reliably distinguish which of the two pages it
is, so mark/verify it and add a placeholder for the missing second URL. Do not
restore the obsolete Twitter embed. Include contact and Diary links quietly.

## 404 page

Create a useful custom 404 with primary navigation and one restrained temporary
`AI GUSTAVE:` line for review. Do not build an animation or elaborate joke.

## Accessibility, robustness, and quality

- Use semantic landmarks, headings, lists, figures, time elements, and forms.
- Provide meaningful alt text; decorative images use empty alt text.
- Ensure keyboard access and visible focus states.
- Meet WCAG AA contrast and respect reduced-motion preferences (though motion
  should be negligible).
- Do not encode meaning by color alone.
- Keep body type and controls comfortably readable on mobile.
- Avoid horizontal scrolling at narrow widths.
- Use progressive enhancement; history and navigation work without JavaScript.
- Lazy-load below-fold images and set dimensions/aspect ratios to avoid layout
  shifts.
- External links must use safe `rel` values where needed.
- Click-to-load video controls must be keyboard accessible and clearly labeled.
- Validate generated links and HTML as practical.
- Add an automated check for the Eleventy production build and broken internal
  links if a lightweight maintained tool is suitable.

## Historical content-source map

The legacy page files below were migration sources. Obsolete working-tree copies
were removed after migration and remain available in Git history. The
`harrington/` microsite and selected `images/` originals remain active exceptions:

- `index.html`: current overview, quotes, video URLs, bicycle usage, most recent
  event, old diary/social links
- `shows.html`: three show descriptions and touring summaries
- `Company.html`: company history, bios, animation credits, naming history
- `Reviews.html`: quotations, attributions, articles, touring/history clues
- `Calendar.html`: obsolete 2019 schedule; useful only as historical evidence
- `HK_image_downloads.html`: press-image references and any known captions
- `Contactus.html`: inspect for any still-valid content, but do not expose stale
  contact details
- `Canada_2000_diary.html`: 2000 diary
- `diary/index.html`: 2010 diary
- `diary/style.css`: not a visual design source; useful only for understanding
  export artifacts
- `harrington/`: related Richard solo project; link from bio only if useful
- `images/`: retain selected original production and press photographs; generate
  responsive derivatives during the build

Treat old content as potentially stale. Distinguish migration, light neutral
editing, and invented character copy.

## Initial acceptance criteria

A review-ready implementation is complete when:

1. `npm install` and the documented development/production commands work from a
   clean checkout.
2. Eleventy outputs the complete static site with no public runtime framework.
3. Home, Shows, Selected Performance History, About, Press & Contact, Image
   Archive, Diary index/entries, and 404 exist and are responsive.
4. Navigation and internal links work without JavaScript.
5. The current production files on `main` remain untouched and the work exists
   only on `redesign`.
6. Legacy URL redirects are configured and checked.
7. Existing reliable content, both videos, both diaries, and all images are
   preserved or migrated according to this spec.
8. The videos load no YouTube/Vimeo player until activated.
9. Event grace-period behavior works for future, recent, and expired dates.
10. Pages CMS exposes agreed content and can commit to `redesign` using GitHub
    authentication.
11. Empty optional sections and dormant diary authors are invisible.
12. Every invented character line has its visible AI prefix.
13. Every unknown credit or missing item is marked rather than guessed.
14. The site has no analytics, cookies, autoplay, hamburger menu, or comments.
15. Build/link/accessibility checks pass, with any unavoidable warnings
    documented.
16. No push, pull request, merge, or production deployment occurs without
    explicit user approval.
