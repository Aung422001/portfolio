# Aung Kyaw Hein — Portfolio

Personal portfolio for a full-stack JavaScript developer. Next.js App Router,
TypeScript, Tailwind v4, Framer Motion, Lucide icons. No CMS, no database — all
content lives in typed files under `src/data`.

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
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
| `projects.ts` | Featured project + the four others |
| `experience.ts` | Internship, education, and the five process steps |

### Adding your CV

1. Save the PDF as `public/cv/aung-kyaw-hein-cv.pdf`
2. Set `cvAvailable: true` in `src/data/profile.ts`

Both CV buttons are hidden while that flag is false, so the site never ships a
link that 404s.

### Project images

| Project | Image | Kind |
|---|---|---|
| Merbolo | `public/projects/merbolo.png` | **Real screenshot** of the live Vercel deployment |
| Tri-Apex | `public/projects/triapex.svg` | Designed cover |
| Smart Office IoT | `public/projects/smart-office.svg` | Designed cover |
| Recursion | `public/projects/recursion.svg` | Designed cover |
| CryptoQ | `public/projects/cryptoq.svg` | Designed cover |

The covers are hand-written SVGs (~4 KB each) in the site palette, standing in until real
screenshots exist. Editable sources live in `design/covers/` — edit those and copy the result
into `public/projects/`.

`imageKind` on each project controls the alt text: `"screenshot"` gets a description, `"cover"`
gets an empty alt because it is decorative and the project title sits right beside it.

**To swap a cover for a real screenshot**, capture the running app at roughly 1440×900, save it
as `public/projects/<slug>.png`, and update that project in `src/data/projects.ts`:

```ts
image: "/projects/recursion.png",
imageKind: "screenshot",
```

Covers are rendered with a plain `<img>` rather than `next/image`, because `next/image` refuses
SVG unless `dangerouslyAllowSVG` is enabled globally — which would also apply to remote SVGs.
Raster screenshots do go through `next/image`.

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

**Colour tokens are contrast-checked.** `--ink-faint` (#5a7180) is deliberately
darker than the reference's grey because it is used for small labels and dates
and has to clear 4.5:1. `--ink-ghost` is the lighter tone, used only for the
oversized hero line and the decorative marquee, where large-text rules apply.

**Marquee bands are `aria-hidden`.** The real heading sits next to them, so a
screen reader gets it once rather than six times.

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
