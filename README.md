# Aung Kyaw Hein — Portfolio

Personal portfolio for a frontend developer. Next.js App Router,
TypeScript, Tailwind v4, Framer Motion, Lucide icons. No CMS, no database — all
content lives in typed files under `src/data`.

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # project links, assets and navigation data
```

## Structure

```
src/
├── app/
│   ├── layout.tsx      metadata, fonts, motion provider
│   ├── page.tsx        composes the sections
│   ├── globals.css     design tokens + the few non-Tailwind animations
│   ├── icon.svg        favicon
│   ├── robots.ts       /robots.txt
│   └── sitemap.ts      /sitemap.xml
├── components/
│   ├── Navbar/  Hero/  About/  Skills/  Services/
│   ├── Projects/       Projects, FeaturedProject, ProjectList
│   ├── Experience/  Process/  Contact/  Footer/
│   ├── providers/      MotionProvider (client boundary for MotionConfig)
│   └── ui/             Section, Marquee, Reveal, Button, ProjectVisual
├── data/               profile, skills, services, projects, experience
├── lib/                motion variants, scroll hooks
└── types/              shared interfaces
```

`legacy/` holds the previous hand-written HTML/CSS/JS version of this site. It is
excluded from TypeScript and ESLint and is not part of the build — delete it
whenever you're happy with the replacement.

## Editing content

Everything a recruiter reads is in `src/data`. No component needs touching to
change copy.

| File | Holds |
|---|---|
| `profile.ts` | Name, role, intro, contact links, stats, nav items |
| `skills.ts` | The five skill groups |
| `services.ts` | The six "What I Can Build" cards |
| `projects.ts` | Featured ApplyTrail project + five more |
| `experience.ts` | Internship, education, and the five process steps |

### Adding your CV

1. Save the PDF as `public/cv/aung-kyaw-hein-cv.pdf`
2. Set `cvAvailable: true` in `src/data/profile.ts`

Both CV buttons are hidden while that flag is false, so the site never ships a
link that 404s.

### Project images

Every project carries a real screenshot of the running app, in `public/projects/`:
`merbolo.png`, `applytrail.jpg`, `triapex.png`, `recursion.png`, `smart-office.png`, `cryptoq.png`.
ApplyTrail uses fictional guest demo records; its private repository is not linked.
Project cards show screenshots on both mobile and desktop, without requiring hover.

They are pre-cropped to **16:10** and rendered with `object-position: top`, so a tall
page screenshot shows its header and headline figures rather than a slice of its middle.
Capture at any size, then crop to 1600x1000 anchored to the top.

The home page puts projects immediately after the hero, followed by About, Skills,
Experience and Contact. Services and Process are not rendered to avoid repeating
the project and experience descriptions.

To replace one, drop the new file in `public/projects/` keeping the same name. To add a
project without a screenshot yet, leave `image` unset — `ProjectVisual` draws a styled
placeholder rather than a broken image.

`imageKind: "screenshot"` gives the image a descriptive alt. `"cover"` marks it decorative
with an empty alt, for artwork that only stands in for a screenshot.

### Connecting the contact form

`ContactForm.tsx` validates on the client and then stops at a clearly marked
integration point. It does **not** fake a successful send — it hands the visitor
a prefilled `mailto:` instead. To make it send for real, add
`src/app/api/contact/route.ts` and POST to it from the marked spot.

## Notes on the implementation

**The hero is CSS-animated, not Framer-animated, on purpose.** Framer serialises
its `initial` state into the server HTML as `opacity:0`, so a Framer hero stays
invisible until hydration finishes — that's the largest text on the page gated
behind JavaScript, which costs LCP badly on a slow connection. The hero uses a
plain CSS keyframe with `animation-fill-mode: both` so it paints immediately.
Framer still drives every scroll reveal below the fold, where the content is
off-screen at load anyway.

**`.shell` uses `overflow: clip`, not `hidden`.** `hidden` would make it a scroll
container and break `position: sticky` on the navbar.

**Midnight & lime uses shared colour tokens.** The canvas is `#11151b`, raised
surfaces `#1c232d`, primary text `#edf1f5`, and the accent `#c5f277`. The
`theme.test.mjs` checks normal text, button states, badges and form errors against
their actual opaque backgrounds for at least 4.5:1 contrast. Decorative marquee
bands are not rendered. Native controls use the dark colour scheme.

## Accessibility

Semantic landmarks, one `h1`, no skipped heading levels, skip link, visible
focus rings, labelled form fields with `aria-invalid` and `aria-describedby`,
`aria-expanded` on the menu button, `rel="noopener"` on every external link, and
`prefers-reduced-motion` honoured via `MotionConfig reducedMotion="user"` plus a
CSS fallback.

## Deploying

Vercel is the path of least resistance: push to GitHub, import the repo, done —
no configuration needed. Update `SITE_URL` in `src/app/layout.tsx`,
`robots.ts` and `sitemap.ts` to the real domain once you have one.

GitHub Pages will not work without `output: "export"`, and static export would
disable `next/image` optimisation.
