# VisTwin Design System

> Distilled from the VisTwin website build. Reusable spec for technical B2B
> marketing sites — AEC, industrial, platform / infrastructure narratives.
> The language is **systems-first**: engineering aesthetic, restraint on
> colour, one signal accent, HUD-monospace vocabulary borrowed from
> industrial control panels.

**Brand & logo**
- The wordmark, lockups, favicon, and application templates live in
  [`brand/`](brand/README.md) — outlined SVG (font-independent) + PNG.
  Read it before placing the logo anywhere.

**Reference implementations**
- VisTwin — `github.com/metaarchetech/vistwinsite` → `vistwinsite.vercel.app`

---

## 0 · Design principles

1. **Restraint beats decoration.** Two greyscale families + one brand
   accent. No illustrations, no stock imagery, no shadows bigger than a
   hairline unless the UI is floating.
2. **Engineering vocabulary.** HUD labels (mono uppercase), section
   indices (`/0.4`), bracket brand (`{ wordmark }`), live dots, numeric
   specs over adjectives.
3. **Grid honesty.** 12-column grid visible everywhere. Hairline borders
   mark section starts. Nothing breaks the grid just to look interesting.
4. **One accent colour, used sparingly.** NVIDIA-flavoured tech green.
   Never two accents in the same viewport.
5. **Mirror flip for dark mode.** Inversion of the zinc scale; same
   semantics at every position. Accent green stays the same hue.
6. **Text first, images second.** Screenshots or photos sit inside
   bordered frames, treated as evidence, never as decoration.
7. **Motion is invitation, not performance.** Entrance reveals on
   scroll. Hover micro-interactions. No always-on WebGL unless it is
   genuinely load-bearing narrative.
8. **Platform-altitude voice.** Declarative noun phrases over marketing
   adjectives. "One substrate. Three axes." beats "industry-leading
   solution."

---

## 1 · Color

### 1.1 Zinc scale (true neutral, no warmth)

```
--color-zinc-50:   #FAFAFA    /* almost white — section backdrop */
--color-zinc-100:  #F4F4F5    /* subtle panel */
--color-zinc-150:  #ECECEE    /* grid hairline */
--color-zinc-200:  #E4E4E7    /* borders */
--color-zinc-300:  #D4D4D8    /* stronger borders */
--color-zinc-400:  #A1A1AA    /* muted / tertiary text */
--color-zinc-500:  #71717A    /* HUD labels */
--color-zinc-600:  #52525B    /* body secondary */
--color-zinc-700:  #3F3F46    /* body primary */
--color-zinc-800:  #27272A    /* strong borders on dark */
--color-zinc-900:  #18181B    /* primary text & "dark slab" bg */
--color-zinc-950:  #09090B    /* near-black, page bg in dark mode */
```

Rules of use:
- **Page / section bg**: `bg-white` or `bg-zinc-50` (two flavours only).
- **Dark strong section**: `bg-zinc-900` with `text-zinc-100` (CTA, etc.).
  One dark slab per page maximum.
- **Body text primary**: `text-zinc-900` on light bg, `text-zinc-100` on dark.
- **Body text secondary**: `text-zinc-600`.
- **HUD labels**: `text-zinc-500` (or `text-zinc-400` for the dimmest).
- **Hairlines / borders**: `border-zinc-200` (soft) or `border-zinc-300` (stronger).
- **Muted dividers inside dark slab**: `border-zinc-700`.

### 1.2 Signal — brand accent (NVIDIA green)

```
--color-signal-50:   #F2FAE0    /* background tint — rare */
--color-signal-100:  #E1F4BC
--color-signal-300:  #B7E25C
--color-signal-400:  #9DD11F    /* text on dark bg */
--color-signal-500:  #76B900    /* brand green — live dot, key indicator */
--color-signal-600:  #5C9300    /* text on light bg (primary accent text) */
--color-signal-700:  #4A7700    /* muted accent */
```

Rules of use:
- **≤ 5% of the viewport** at any time — if you see green everywhere,
  it stops signalling anything.
- **`text-signal-600`** for kicker text on light bg.
- **`text-signal-400`** for kicker text on dark bg.
- **`bg-signal-500`** only for the live-dot (pulsing) or a single call-to-action.
- **Borders**: `border-signal-500/30` for architectural frames.
- **Background tint**: `bg-signal-500/[0.04]` for panel strips inside
  signal-bordered frames.

### 1.3 Rose — notification only

Not brand. Used exclusively for attention / nudge pills (e.g., "switch
language?" detection).

```
bg-red-500/20          /* translucent wash */
border-red-400/35      /* border */
text-red-700           /* CTA text on light bg */
```

Must NOT appear more than once per page.

### 1.4 Dark-mode mirror-flip

Under `[data-theme="dark"]` on `<html>`, invert the zinc scale:

| Light value | Dark value |
|---|---|
| zinc-50 `#FAFAFA` | `#09090B` |
| zinc-100 `#F4F4F5` | `#18181B` |
| zinc-200 `#E4E4E7` | `#27272A` |
| zinc-300 `#D4D4D8` | `#3F3F46` |
| zinc-400 `#A1A1AA` | `#52525B` |
| zinc-500 `#71717A` | `#71717A` (unchanged — mid-tone) |
| zinc-600 `#52525B` | `#A1A1AA` |
| zinc-700 `#3F3F46` | `#D4D4D8` |
| zinc-800 `#27272A` | `#E4E4E7` |
| zinc-900 `#18181B` | `#F4F4F5` |
| zinc-950 `#09090B` | `#FAFAFA` |
| `--color-white` | `#09090B` |
| `--color-signal-700` | `#B7E25C` (only signal var that flips — readability) |

Signal 500/600 stay the same. Brand green is brand green in both modes.

**Implementation gotcha (Tailwind v4)**: `@theme inline` compiles the
zinc tokens to literal hex in utilities, so overriding the CSS variable
alone does not propagate. Put utility overrides **inside `@layer
utilities`** — otherwise Tailwind's pipeline strips them as duplicates.

---

## 2 · Typography

### 2.1 Font stack

```
CJK:    Chiron Hei HK (variable, 200–900) — jsDelivr CDN
Latin:  Space Grotesk (400/500/600/700) — next/font
Mono:   JetBrains Mono (400/500) — next/font
```

CDN directive:
```css
@import url("https://cdn.jsdelivr.net/npm/chiron-hei-hk-webfont@2.6.8/css/vf.css");
/* Fallback — last resort */
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap");
```

Body declaration:
```css
body {
  --cn-font: "Chiron Hei HK WS";
  --latin-font: var(--font-space-grotesk);
  --cn-wght-body: 400;
  --cn-wght-display: 900;
  font-family: var(--latin-font), var(--cn-font), "Noto Sans TC",
               system-ui, "PingFang TC", "Microsoft JhengHei", sans-serif;
  font-weight: var(--cn-wght-body);
  font-variation-settings: "wght" var(--cn-wght-body);
}
```

### 2.2 Size scale

| Role | Size | Class | Notes |
|---|---|---|---|
| Display (Hero wordmark) | `clamp(4rem, 18vw, 22rem)` | inline style on `.display` | Scales wildly across viewports |
| Section H2 | `clamp(2.5rem, 6vw, 6.5rem)` | inline style on `.display` | One per section |
| Sub-H3 (card title) | `clamp(2.25rem, 5.5vw, 6rem)` | inline style on `.display` | Must stay smaller than H2 |
| Inline H3 | `clamp(1.5rem, 2vw, 2rem)` | inline style on `.display` | Axis / spec card |
| Body lg | `text-base lg:text-lg` | 16-18px | Hero tagline, section intros |
| Body | `text-base` | 16px | Paragraphs |
| Body sm | `text-sm` | 14px | Captions, specs |
| HUD | 11px | `.hud` | Mono uppercase labels |
| HUD-sm | 10px | `.hud-sm` | Mono uppercase tiny labels |

### 2.3 `.display` class

```css
.display {
  font-family: var(--font-display);
  font-weight: 900;
  font-variation-settings: "wght" 900;
  letter-spacing: -0.04em;
  line-height: 0.95;
}
```

Opt-in CJK tweak (relax tracking at large sizes):
```css
.display-cjk {
  letter-spacing: -0.005em;
  line-height: 1.02;
  font-weight: var(--cn-wght-display);
  font-variation-settings: "wght" var(--cn-wght-display);
}
```

### 2.4 `.hud` / `.hud-sm` — signature element

```css
.hud {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-feature-settings: "tnum", "lnum";
  font-variant-numeric: tabular-nums lining-nums;
}
.hud-sm {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-feature-settings: "tnum", "lnum";
  font-variant-numeric: tabular-nums lining-nums;
}
```

CJK exception (CJK has no case):
```css
:lang(zh) .hud, :lang(zh) .hud-sm,
html[lang^="zh"] .hud, html[lang^="zh"] .hud-sm {
  text-transform: none;
  letter-spacing: 0.05em;
}
```

Chinese body size trim (CJK glyphs read 6–8% larger at the same point
size — trim to keep English/Chinese pairings balanced):
```css
html[lang^="zh"] p,
html[lang^="zh"] li,
html[lang^="zh"] dd,
html[lang^="zh"] dt {
  font-size: 0.93em;
}
/* But NOT HUD — keep at absolute px */
html[lang^="zh"] .hud { font-size: 11px; }
html[lang^="zh"] .hud-sm { font-size: 10px; }
```

### 2.5 HUD vocabulary patterns

- `{ wordmark }` — bracket brand, always HUD case. Example: `{ VISTWIN }`
- `/0.1`, `/0.2` — section / axis indices. Always with leading slash.
- `↳ unique to X` — secondary HUD annotation, with corner arrow.
- `{ category } / count` — HUD pair separator. Example: `{ sectors } / 0.4`.
- Live dot `●` — only for sections that represent active / running state.

---

## 3 · Layout & spacing

### 3.1 Grid

```tsx
<div className="mx-auto max-w-[1600px] px-6 lg:px-10 2xl:px-14">
  <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 ...">
    {/* content */}
  </div>
</div>
```

- **Max width**: `1600px` (not 1280/1440 — we want breathing room on
  ultra-wide monitors).
- **Gutters**: `px-6` mobile, `px-10` desktop, `px-14` 2xl.
- **Column gap**: `gap-x-4` mobile, `gap-x-6` desktop.
- **Rows**: No `grid-rows-*`. Vertical rhythm is `py-*` on section / `mb-*`
  on blocks.

### 3.2 Vertical rhythm

| Role | Class |
|---|---|
| Section padding | `py-24 lg:py-32` |
| Section with dark slab (CTA) | `py-24 lg:py-40` |
| Sub-section / inline strip | `py-20 lg:py-24` |
| Section → H2 gap | `mb-16 lg:mb-24` |
| H2 → content gap | `mb-16 lg:mb-20` |
| Card row gap (divider pattern) | `py-10 lg:py-16 border-t` |

### 3.3 Mobile padding tightening

On mobile, frames and panels use `px-3` / `py-3-6`, bumping to `sm:px-4
sm:py-4-8` on tablets and `lg:px-8 lg:py-10` on desktop. Never just `px-4
py-8` across all breakpoints — leaves too little content width on mobile.

---

## 4 · Surfaces, borders, radii, shadows

### 4.1 Radii

| Role | Class |
|---|---|
| Floating pills (header, ChatDock, LocaleSuggest) | `rounded-2xl` (16px) |
| Image / section frame (evidence slab) | no radius (sharp edges feel engineering-honest) |
| Small buttons / badges | `rounded-md` (6px) |
| Dropdown panels | `rounded-md` |
| Live dot | `rounded-full` |

Avoid `rounded-lg` or `rounded-xl` unless inside a floating pill.

### 4.2 Borders

- **Hairline sections**: `border-t border-zinc-300` starts every content
  section under the HUD bar.
- **Row dividers**: `border-t border-zinc-200` between list items.
- **Panel frames**: `border border-zinc-900/90` for photo / image frames
  (strong outline).
- **Accent frames**: `border border-signal-500/30` for architectural
  diagrams (ontology / spatial wrappers).
- **Dark-tinted strips inside green-accent frames**: add `bg-signal-500/[0.04]`.

### 4.3 Shadow vocabulary

Three levels, each keyed to a specific situation:

```
Floating pill (subtle, always present):
  shadow-md shadow-zinc-900/5       (light mode at rest)
  shadow-lg shadow-zinc-900/5       (light mode on scroll)
  shadow-md shadow-black/10         (dark mode at rest)
  shadow-lg shadow-black/15         (dark mode on scroll)

Evidence frame / image slab:
  shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)]   (anchor / featured image)
  shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]   (detail tile)

Never: drop-shadow, inner-shadow, box-shadow inset. Photoshop-era signals.
```

### 4.4 Frosted glass (backdrop blur)

Pattern for all floating chrome (Header, ChatDock, LocaleSuggest, mobile menu):

```tsx
className="... backdrop-blur-sm backdrop-saturate-150 bg-white/35 ..."
```

**`backdrop-blur-sm` (4px) not `-xl` (24px)** — we want the grid lines
behind the pill to remain visible. Heavy blur erases the engineering
aesthetic.

`backdrop-saturate-150` stays — it lifts colours beneath slightly without
blurring them.

Typical opacity per state:
- At rest: `bg-white/25` (light) / `bg-zinc-900/35` (dark)
- Scrolled / hovered: `bg-white/45` (light) / `bg-zinc-900/55` (dark)

### 4.5 Photo / image frame pattern

Anchor image (featured):
```tsx
<div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[1980/845]
                w-full overflow-hidden
                border border-zinc-900/90 bg-zinc-900
                shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)] group">
  <Image fill ... />
</div>
```

Detail tile:
```tsx
<div className="relative aspect-[16/9] w-full overflow-hidden
                border border-zinc-900/90 bg-zinc-900
                shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
  <Image fill ... />
</div>
```

Key pattern:
- Dark frame (`border-zinc-900/90 bg-zinc-900`) reads as matte mounting.
- Image sits on top via `fill` + `object-cover`.
- On hover: `group-hover:scale-[1.02]` for 0.7s expo-out (see motion §).
- Caption below the frame uses HUD-sm + HUD.

---

## 5 · Motion

### 5.1 Ease curves

Two canonical curves:

```
Brand expo-out:       cubic-bezier(0.16, 1, 0.3, 1)
  → Reveals, clip-masks, large-scale motion, hover micro-interactions

Codebase quick:       cubic-bezier(0.22, 0.7, 0.2, 1)
  → Small fades, transitions inside motion components
```

Use brand expo-out for **anything perceivable by the user**. Use quick
for internal framer-motion transitions on already-triggered animations.

### 5.2 Entrance reveals

**Pattern**: scroll-triggered, gated by `useShouldAnimate()` which returns
true only if `document.visibilityState === "visible"` AND no
`prefers-reduced-motion`. Without this gate, animations stall in
background tabs / preview frames and content stays invisible.

Two primitives:

```tsx
<Reveal>       // clip-mask text reveal (headline)
<FadeUp>       // soft fade + small translate (body copy)
```

Timing:
- `Reveal`: duration 0.95s, delay 0-0.1s staggered
- `FadeUp`: duration 0.85s, translate y: 14px → 0

IntersectionObserver `rootMargin` accepts **pixels only** (not percentages
— silently fails). Use `"0px 0px -80px 0px"` for Reveal, `"0px 0px -60px
0px"` for FadeUp.

### 5.3 Motion component pattern (framer-motion)

Every `<motion.X>` with `initial={{ opacity: 0, ... }}` must be gated:

```tsx
const animated = useShouldAnimate();
<motion.div
  initial={animated ? { opacity: 0, y: 16 } : false}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 0.7, 0.2, 1] }}
>
```

If `animated` is false, `initial={false}` tells framer to render the
element at its `animate`/`whileInView` final state immediately — content
is always visible even when animation engine is paused.

### 5.4 Theme-swap transition

When the user clicks the light/dark toggle:

```css
html, body, section, .bg-white, .bg-zinc-50, .bg-zinc-100, .bg-zinc-150,
.bg-zinc-200, .bg-zinc-900 {
  transition: background-color 0.18s ease-out,
              color 0.18s ease-out,
              border-color 0.18s ease-out;
}
```

180ms is the sweet spot — long enough to feel smooth in a real browser,
short enough not to stall in throttled / hidden tabs.

---

## 6 · Micro-interaction vocabulary

Four small utilities form the entire hover language of the site. Defined
once in `globals.css`, applied anywhere:

### 6.1 `.link-underline` — animated underline

```css
.link-underline {
  background-image: linear-gradient(currentColor, currentColor);
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0% 1px;
  transition: background-size 0.55s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.25s ease-out;
  padding-bottom: 2px;
}
.link-underline:hover,
.group:hover .link-underline {
  background-size: 100% 1px;
}
```

Underline draws from left on hover, retracts to right on leave.
Currentcolor respects parent text colour automatically.

### 6.2 `[data-arrow]` — arrow shift on group hover

```css
[data-arrow] {
  display: inline-block;
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}
.group:hover [data-arrow] {
  transform: translateX(4px);
}
```

Pair an `<a class="group">` wrapper with a child `<span data-arrow>↳</span>`.

### 6.3 `.row-accent` — left-edge bar draw

```css
.row-accent { position: relative; }
.row-accent::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--color-signal-500);
  transform: scaleY(0);
  transform-origin: top center;
  transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}
.row-accent:hover::before { transform: scaleY(1); }
```

For table-like rows in roadmap / work sections. Combines with `.row-tint`.

### 6.4 `.row-tint` — subtle bg wash

```css
.row-tint {
  transition: background-color 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.row-tint:hover {
  background-color: rgba(118, 185, 0, 0.025);   /* signal-500 at 2.5% */
}
```

Almost imperceptible — just enough to signal "this row is live."

### 6.5 Live dot — pulsing indicator

```css
.live-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--color-signal-500);
  box-shadow: 0 0 0 0 rgba(118, 185, 0, 0.5);
  animation: live-pulse 2.2s ease-out infinite;
}
@keyframes live-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(118, 185, 0, 0.55); }
  70%  { box-shadow: 0 0 0 8px rgba(118, 185, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(118, 185, 0, 0); }
}
```

Use for section kickers that represent **active / running state** only.
Not for every green accent.

### 6.6 Selection

```css
::selection {
  background: var(--color-signal-500);
  color: var(--color-zinc-900);
}
```

Brand green selection. Tiny detail. Users notice.

---

## 7 · Reduced motion

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

And inside React: `useReducedMotion()` from framer-motion returns true if
the user has set the preference — bail out of reveals entirely.

---

## 8 · Dark mode mechanics

### 8.1 Toggle surface

```tsx
<button
  onClick={toggle}
  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
  className="hud transition-colors w-7 h-7 rounded-full flex items-center justify-center"
>
  {isDark ? <SunIcon /> : <MoonIcon />}
</button>
```

Inline SVGs, 14px, 1.6 stroke. `strokeLinecap="round"`.

### 8.2 Anti-FOUC inline script (root `<head>`)

```tsx
<script
  dangerouslySetInnerHTML={{
    __html:
      "try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}",
  }}
/>
```

Runs synchronously before paint. Prevents light-mode flash on dark-mode
refresh.

### 8.3 Toggle click handler

```ts
function applyMode(mode: "light" | "dark") {
  const root = document.documentElement;
  if (mode === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");
  window.dispatchEvent(new Event("scroll"));  // re-probe header onDark
}
```

---

## 9 · Floating pill component (canonical)

Used by Header, ChatDock, LocaleSuggest, mobile menu. Shared DNA:

```tsx
<div className="
  fixed top-3 left-3 right-3 z-50
  rounded-2xl border
  backdrop-blur-sm backdrop-saturate-150
  bg-white/25 border-zinc-200/40
  shadow-md shadow-zinc-900/[0.03]
  transition-all duration-300
">
  {/* pointer-events gating */}
  <div className="pointer-events-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
    {/* content */}
  </div>
</div>
```

Key shared properties:
- `backdrop-blur-sm` (not `-xl`).
- Translucent bg: `/25` at rest, `/45` scrolled.
- `rounded-2xl`.
- Hairline border: `border-zinc-200/40` (light) or `border-zinc-700/30` (dark).
- `z-50` for top chrome, `z-40` for peripheral pills.

**Header adapts to section luminance below** via element probe on scroll:

```tsx
useEffect(() => {
  const onScroll = () => {
    const probe = document.elementFromPoint(window.innerWidth / 2, 28);
    const sec = probe?.closest("section");
    if (sec) {
      const bg = getComputedStyle(sec).backgroundColor;
      const m = bg.match(/\d+/g);
      if (m) {
        const lum = (parseInt(m[0]) + parseInt(m[1]) + parseInt(m[2])) / 3;
        setOnDark(lum < 80);
      }
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

---

## 10 · Section header bar (canonical pattern)

Every major section opens with this:

```tsx
<motion.div
  initial={animated ? { opacity: 0, y: 12 } : false}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.6 }}
  className="grid grid-cols-12 gap-x-4 lg:gap-x-6 border-t border-zinc-300 pt-4 mb-16 lg:mb-24"
>
  <div className="col-span-6 md:col-span-3">
    <span className="hud-sm text-signal-600">{kicker}</span>
  </div>
  <div className="col-span-6 md:col-span-3 md:col-start-10 text-right">
    <span className="hud-sm text-zinc-400">{`{ ${slug} } / 0.${index}`}</span>
  </div>
</motion.div>
```

Then the big H2:

```tsx
<motion.div className="grid grid-cols-12 gap-x-4 lg:gap-x-6 mb-16 lg:mb-20">
  <h2
    className="display text-zinc-900 col-span-12 lg:col-span-10"
    style={{ fontSize: "clamp(2.5rem, 6vw, 6.5rem)" }}
  >
    <Reveal>{title}</Reveal>
  </h2>
  <p className="col-span-12 lg:col-start-4 lg:col-span-6 mt-8 text-base lg:text-lg text-zinc-600 leading-relaxed max-w-2xl">
    {intro}
  </p>
</motion.div>
```

---

## 11 · Narrative archetype (tier 1-4)

Technical B2B marketing pages follow this arc:

```
Tier 1 — Opening, high-altitude, no jargon yet
  Hero          → platform-altitude tagline (one sentence)
  OneLiner      → thesis, abstract on purpose
  Capabilities  → three layers / axes / sides

Tier 2 — Proof
  Surface       → real screenshots, "active / in motion"

Tier 3 — Concrete middle
  Position      → vs the rest of the market
  Standards     → technical alignment (external validators)
  [optional]    → Work / roadmap (skip if it undercuts "already running")

Tier 4 — Climax
  Architecture  → the philosophical payoff
                  (Palantir-style ontology syllogism,
                   deliberately system-general)

Tier 5 — Loop back & act
  Industries    → where this can plug in (concrete verticals)
  CTA           → talk to us
```

Voice shifts by tier:
- Tier 1: poetic, noun-phrase, no ontology jargon
- Tier 2: evidence, specific numbers
- Tier 3: comparison, declarative
- Tier 4: philosophical, system-general, ontology allowed
- Tier 5: concrete, action-triggering

### Key framing principles

1. **Ontology / jargon is saved for Tier 4.** Let the concept build
   across sections. Drop it in Tier 4 as the reveal.
2. **Tier 4 is climax, not intro.** Move the philosophical section NEAR
   the end, before CTA. This builds intrigue, then resolves.
3. **Industries LOOPS BACK after Tier 4.** Abstract → specific → action.
   The last thing the reader sees is "where my project fits."
4. **Don't restate concepts across tiers.** Each section adds a fresh
   angle.

---

## 12 · Content / copy voice

### 12.1 Voice rules

- Declarative sentences over marketing adjectives.
- Name concrete systems / acronyms the reader already knows (BIM, CMMS,
  MQTT, ESG, NOAA SPA, IFC 4) over generic claims ("environmental data").
- One-sentence thesis per section; no piled-up value props.
- Mid-dot `·` separators for HUD strings and tight phrases.
- Em-dash `——` (CJK) / ` — ` (Latin) for thought pivots. Never two in a
  row.
- HUD labels use braces `{ word }`, slashes `/0.3`, corner arrows `↳`.

### 12.2 Common patterns

```
"{ category } / 0.4"                  — section slug + index
"{ VISTWIN }"                         — bracket brand
"↳ unique to VisTwin"                 — secondary annotation
"· NVIDIA Warp · RTX 3080 ~4.5 fps"  — inline spec chain
"NOAA SPA ±0.0003°"                   — precision claim, inline
```

### 12.3 Bilingual handling

- **Hero tagline**: give each locale its own phrasing, not a literal translation.
- **HUD labels**: often stay in English even on zh site — they're brand
  machinery, not content. (E.g., "Active surface", "Ontology · decision
  substrate".)
- **Section titles**: mix freely per vibe. "Honest about the gap we fill"
  is more powerful than a translated Chinese equivalent; "一個 Object，
  四路匯流" is more powerful than its English equivalent.
- **Don't translate acronyms** the reader recognizes (BIM, ESG, AI, USD,
  IFC). Translate verbs and nouns around them.

---

## 13 · Responsive / mobile rules

- **Max width**: 1600px. Everything smaller centres inside.
- **Breakpoints**: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl`
  1280, `2xl` 1536).
- **Padding**: `px-3` mobile → `sm:px-4` → `md:px-6` → `lg:px-10` → `2xl:px-14`.
- **Grid columns**: `col-span-12` mobile → `md:col-span-6` → `lg:col-span-3 or 4`.
- **Aspect ratios**: `aspect-[4/3]` mobile → `sm:aspect-[16/9]` → `lg:aspect-[wide]`.
  Don't force a single wide aspect on mobile — images become slivers.
- **`background-attachment: fixed`** doesn't work on iOS Safari. Always
  fall back on touch:
  ```css
  @media (max-width: 768px), (hover: none) {
    [data-fixed-bg] { background-attachment: scroll !important; }
  }
  ```
- **Dropdowns**: align rightward by default (`right-0`) on desktop where
  component sits on the right; flip to leftward (`left-0`) on mobile via
  `left-0 sm:left-auto sm:right-0`.
- **Floating notification pill**: top-anchored on mobile (below header),
  top-center on desktop. Never bottom on mobile — conflicts with ChatDock.

---

## 14 · i18n mechanics (next-intl)

### 14.1 Routing config

```ts
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ["en", "zh"],        // default first
  defaultLocale: "en",
  localePrefix: "as-needed",    // "/" = default, "/zh" = other
  localeDetection: false,       // never auto-redirect
});
```

Disable `localeDetection` if you want English to always be the front
door. Use a soft suggestion pill (LocaleSuggest pattern) to offer the
alternative when browser prefers another locale.

### 14.2 ICU escape for HUD brackets

`{ X }` in i18n strings is parsed as ICU MessageFormat variable
placeholders. To include literal HUD brackets, either:
- Escape: `'{' X '}'` in the JSON
- OR render with `t.raw(key)` not `t(key)` in the component

Symptom if ignored: `FORMATTING_ERROR: The intl string context variable
"X" was not provided`. This crashes React up to the layout boundary —
not just the single component.

### 14.3 Locale-aware hrefs

All anchor links on homepage must prefix with locale:

```ts
const locale = useLocale();
const localePrefix = locale === "en" ? "" : `/${locale}`;
<a href={`${localePrefix}/#architecture`}>...</a>
```

Or use next-intl's `<Link>` which handles prefix automatically:

```ts
import { Link } from "@/i18n/navigation";
<Link href="/#architecture">...</Link>
```

Never hardcode `href="/"` inside a client component — it'll drop the
user's locale on click.

---

## 15 · File structure (Next.js 16 + next-intl)

```
src/
├── app/
│   ├── layout.tsx               ← root layout, <html>, anti-FOUC script
│   ├── globals.css              ← design tokens + utilities + dark mode
│   └── [locale]/
│       ├── layout.tsx           ← NextIntlClientProvider + Header/Footer
│       ├── page.tsx             ← homepage section composition
│       └── contact/page.tsx
├── components/
│   ├── layout/                  ← Header, Footer, ChatDock, ThemeToggle,
│   │                              LanguageSwitcher, LocaleSuggest
│   ├── sections/                ← Hero, OneLiner, Capabilities, Surface,
│   │                              Position, Standards, Architecture,
│   │                              Industries, CTA
│   └── ui/                      ← Reveal (+ FadeUp), Button, misc primitives
├── hooks/
│   └── useShouldAnimate.ts      ← visibility + reduced-motion gate
├── i18n/
│   ├── routing.ts               ← locale config
│   ├── navigation.ts            ← Link, usePathname, useRouter
│   └── request.ts
└── proxy.ts                     ← next-intl middleware (Next 16 rename)
```

```
messages/
├── en.json                      ← English strings
└── zh.json                      ← Chinese strings
```

```
public/
├── hero/
│   ├── light.jpg                ← light-mode hero backdrop
│   └── dark.jpg                 ← dark-mode hero backdrop
└── screenshots/                 ← Surface section image tiles
```

---

## 16 · Implementation gotchas (learned in the build)

### 16.1 Tailwind v4 `@theme inline`

Tokens are compiled to **literal hex** in utilities. Overriding the CSS
variable alone doesn't propagate. Need explicit per-utility overrides
inside `@layer utilities`:

```css
@layer utilities {
  [data-theme="dark"] .bg-zinc-900 { background-color: #FAFAFA; }
  [data-theme="dark"] .text-zinc-900 { color: #F4F4F5; }
  /* ... etc per utility */
}
```

**Outside `@layer utilities`**, Tailwind's pipeline treats your rule as a
"duplicate utility definition" and strips it from compiled output.

### 16.2 IntersectionObserver rootMargin

**Pixels only**. Percentages (`"-10%"`) silently break IO construction —
observer reports nothing intersecting forever. Use pixel values:

```ts
useInView(ref, { once, amount: "some", margin: "0px 0px -80px 0px" });
```

### 16.3 framer-motion in hidden tabs

`document.visibilityState === "hidden"` pauses rAF / WAAPI / CSS
transitions. Components with `initial={{ opacity: 0 }}` get stuck
invisible — animation never runs to clear them.

Gate every such component with `useShouldAnimate()`:

```tsx
initial={animated ? { opacity: 0, y: 24 } : false}
```

`initial={false}` = render at `animate` final state directly. Page is
always visible, animation only plays when the tab is active.

### 16.4 Next.js 16 middleware rename

File is `src/proxy.ts`, not `src/middleware.ts`, in Next 16. Export a
`proxy` function, not `middleware`. Config matcher unchanged.

### 16.5 CJK glyph size

Han glyphs render ~6-8% larger than Latin at the same point size. Trim
body text to `0.93em` under `html[lang^="zh"]`. But NOT HUD — they're
already tiny, further shrinking makes them illegible.

### 16.6 Fonts in `@theme inline` lose variable indirection

Keep font tokens in a plain `@theme` block (no `inline`), so `var()`
indirection is preserved and you can swap fonts later via body-level
variable override.

---

## 17 · Quick bootstrap for a new project

### 17.1 Install

```bash
npx create-next-app@latest --typescript --tailwind --app
npm install next-intl framer-motion
```

### 17.2 Paste into `globals.css`

The entire `@theme inline { ... }` block (§1.1, §1.2). The `.display`,
`.hud`, `.hud-sm` classes (§2.3, §2.4). The four hover utilities (§6).
The dark-mode `@layer utilities` overrides (§1.4, §16.1). The reduced-
motion block (§7).

### 17.3 Copy components

- `useShouldAnimate.ts` hook
- `Reveal` / `FadeUp` primitives
- `Header` floating pill (adapt links)
- `Footer` with locale-aware `<Link>`
- `ThemeToggle` + anti-FOUC script in root layout

### 17.4 Design the section narrative

Before writing code, write the section list and one-sentence purpose per
tier (§11). Only then build components.

### 17.5 Load fonts

In root layout:

```ts
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-jb",
  display: "swap",
});
```

And in `globals.css`:

```css
@import url("https://cdn.jsdelivr.net/npm/chiron-hei-hk-webfont@2.6.8/css/vf.css");
```

---

## 18 · What NOT to do

- ❌ Don't add a second brand accent. If you need a "warning" state, use
  rose (§1.3) sparingly and ONLY for notifications, not brand elements.
- ❌ Don't use gradients for panels, buttons, or text. Flat fills only.
  Exception: `.link-underline` uses a gradient as a bg-image trick for
  smooth transition, but it renders as a solid line.
- ❌ Don't use drop-shadows > opacity/15 on ambient elements. Heavy
  shadows read as 2010 web.
- ❌ Don't use rounded corners larger than `rounded-2xl` anywhere.
- ❌ Don't use emojis in headings or body. (HUD labels can use ↳ ● · for
  typographic arrow / bullet / separator.)
- ❌ Don't set `border-radius: 50%` on anything larger than the live-dot.
- ❌ Don't render stock photos or illustrations. Only product screenshots
  or architectural photography (treated as evidence, framed in zinc-900).
- ❌ Don't use `background-attachment: fixed` without a mobile fallback.
- ❌ Don't build your own modal / dropdown library — Radix UI primitives
  match this aesthetic once you apply the classes here.

---

## 19 · Inspiration / comparables

What this language rhymes with:

- **Palantir** — ontology framing, declarative voice, restraint.
- **Linear** — HUD-like labels, tight grid, muted palette.
- **Vercel** — typography-forward, whitespace-heavy.
- **Stripe Docs** — evidence-based copy, spec-inline.
- **Figma 2018-ish** — single accent, geometric sans, serious but alive.
- **Industrial control panels** — HUD labels, mono indices, live dots.

What this language deliberately avoids:

- **Notion / Airtable** — too playful, too illustrated.
- **Apple marketing** — too cinematic, too big-budget.
- **Atlassian / IBM** — too corporate, too many accents.
- **2020-era startup landing pages** — too many gradients, too many
  value-prop cards, too much "trusted by" logo soup.

---

## 20 · Version & lineage

- **v0.1** — VisTwin (2026-04). First deployment of this system.
  Platform: Next.js 16 + Tailwind v4 + next-intl + framer-motion +
  Chiron Hei HK + Space Grotesk + JetBrains Mono.

When spawning a second site from this system, start a new file:
`Metaarchetech Design System — [Company].md` and capture deltas from
this base.

---

## 返回

- [[04 Resources MOC]]

---

## Appendix A · Colour hex quick-reference card

```
ZINC (neutral)
50  #FAFAFA    500 #71717A    950 #09090B
100 #F4F4F5    600 #52525B
150 #ECECEE    700 #3F3F46
200 #E4E4E7    800 #27272A
300 #D4D4D8    900 #18181B
400 #A1A1AA

SIGNAL (brand green)
50  #F2FAE0    500 #76B900    ← primary
100 #E1F4BC    600 #5C9300    ← text on light
300 #B7E25C    700 #4A7700    ← muted / flips in dark mode
400 #9DD11F                   ← text on dark

ROSE (notification only)
red-500/20   #ef444433 bg
red-400/35   #f87171 border
red-700      #b91c1c text
```

## Appendix B · Tailwind utility cheat sheet

```
Page bg:           bg-white                bg-zinc-50
Dark slab:         bg-zinc-900 text-zinc-100
Primary text:      text-zinc-900
Secondary text:    text-zinc-600
Muted text:        text-zinc-400 / text-zinc-500
Border hairline:   border-zinc-200 or -300
Accent text:       text-signal-600 (light) / text-signal-400 (dark)
Accent border:     border-signal-500/30

Section container: mx-auto max-w-[1600px] px-6 lg:px-10 2xl:px-14
Section padding:   py-24 lg:py-32
Section grid:      grid grid-cols-12 gap-x-4 lg:gap-x-6
Section divider:   border-t border-zinc-300 pt-4

Pill radius:       rounded-2xl
Pill bg:           bg-white/25 (light) / bg-zinc-900/35 (dark)
Pill blur:         backdrop-blur-sm backdrop-saturate-150
Pill shadow:       shadow-md shadow-zinc-900/5

Frame:             border border-zinc-900/90 bg-zinc-900
Frame shadow lg:   shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)]
Frame shadow sm:   shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]

HUD label:         hud text-zinc-500
HUD small:         hud-sm text-zinc-400
Accent kicker:     hud-sm text-signal-600

Live dot:          <span class="live-dot" />
Link underline:    className="link-underline"
Arrow:             <span data-arrow>↳</span> inside <a class="group">
Row accent:        class="row-accent row-tint"
```
