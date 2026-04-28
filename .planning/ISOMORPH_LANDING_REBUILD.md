# ISOMORPH — Landing Page Rebuild Spec
**Status:** Planning · Ready for execution
**Owner:** Maximiliano Pulido (mapube16)
**Reference site:** https://www.landatech.org/ (Lambda — competitor / inspiration)
**Last updated:** 2026-04-28

---

## 0. Why this document exists

The current Isomorph landing (`/` and `/portfolio`) needs a complete visual rebuild. The previous "antigravity glassmorphism" direction did not land well — the result feels generic-agency and the projects section in particular collapsed under its own weight (see git log entries `cc4c033` "Solid Depth Edition", `5da26b2` "Solid Mountains Edition", and recent in-session attempts at a bento grid).

The user has chosen a new visual reference: **landatech.org (Lambda)** — a Spanish-language AI agency site with a *negro elegante* aesthetic, Syne+Inter typography, and editorial-monumental headline treatment. We are NOT cloning Lambda. We're adopting their language and building Isomorph in our own brand colors (orange + black) on top.

This document gives any agent or human enough context to start implementation **without re-reading the entire conversation history**.

---

## 1. Brand & Identity Locked

| Attribute | Value | Notes |
|-----------|-------|-------|
| Name | **ISOMORPH** | Wordmark in display font |
| Sub-tagline existing | `ANTIGRAVITY ENGINE · PREDICT CONTROL` | Keep as motto/footer signature |
| Primary accent | `#c8522a` (warm orange) | KEEP — this is brand. Don't replace with cyan. |
| Accent gradient | `linear-gradient(135deg, #c8522a 0%, #ffa050 100%)` | For italicized headline emphasis |
| Mode | Dark only | No light theme toggle for v1 |
| Language | Bilingual ES/EN | Already implemented via `lang` state — preserve |
| Voice | Premium engineering studio. Not "agency." | Avoid "we craft", "we love", buzzwords |

**Differentiation from Lambda:**
- Lambda = cyan + green gradients (cool, techy)
- Isomorph = orange + black (warm, premium, oil-and-gold feel)
- Same structural language (editorial typography, problem-first hero, multicolor project cards) but our chromatic palette is monochrome-warm.

---

## 2. Reference site analysis (Lambda / landatech.org)

### 2.1 Stack confirmed
- React + Vite SPA (we are Next.js 16 — adapt patterns, not architecture)
- Tailwind CSS v4 with custom design tokens
- Framer Motion (`vendor-motion-*.js` bundle observed)
- Theme: dark default, localStorage persistence (`lambda-theme`)

### 2.2 Lambda's design tokens (extracted from CSS bundle `index-88HfLgMP.css`)

```css
/* Lambda's actual values — for reference only */
--color-background: #0a0a0a    /* near-black body */
--page-deep:        #050508    /* deeper near-pure black for hero/footer */
--panel-bg:         #0c0c10    /* surface */
--color-surface:    #1a1a2e    /* cards (slight indigo tint — DON'T copy this) */
--color-foreground: #ffffff
--color-accent:     #00d4ff    /* their cyan — replace with our orange */

--font-display: "Syne", system-ui, sans-serif
--font-mono:    SFMono / Menlo
/* body uses Inter loaded from Google Fonts */

--default-transition-duration: 0.15s
--default-transition-timing: cubic-bezier(.4, 0, .2, 1)
```

### 2.3 Lambda's section-by-section structure (verified via screenshots)

1. **NAV (sticky, glassy on scroll)**
   - Logo cyan icon + wordmark `landa.` (with period as design element)
   - Center: 3 nav links — `Servicios · Agentes · El Método`
   - Right: theme toggle (sun icon) + `Iniciar Sesión` text + cyan-pill CTA `Solicitar Agente`
   - Background: `rgba(20,20,30,0.7)` + `backdrop-blur(12px)` — content visible underneath

2. **HERO (no canvas, no 3D, no decorative visual — text IS the image)**
   - Mini outline pill at top: `🤖 SOFTWARE · AGENTES DE IA` (icon + mono uppercase text, very small)
   - H1 GIGANTIC, centered, 2 lines:
     - Line 1 in solid white: `Tú tienes el problema.`
     - Line 2 in **italic** with **cyan→green gradient + bg-clip-text**: `Nosotros la solución.`
   - Subtitle: 2 lines Inter regular, soft gray, centered, with extreme breathing room
   - 2 CTAs centered: primary cyan-filled pill + secondary outline pill
   - **No visual decoration whatsoever above-the-fold**. Negative space IS the design.

3. **"QUIÉNES SOMOS" — eyebrow + statement + animated stats**
   - Eyebrow `QUIÉNES SOMOS` (cyan, mono, uppercase, tracking-widest, very small)
   - H2 same dual treatment: `Construimos el software` (white) + `exacto` (italic gray, isolated word) + `que tu empresa necesita.` (white) + `Sin plantillas. Sin atajos.` (gradient italic)
   - Stats list below in 2 columns:
     - Numbers HUGE (Syne 700, ~5rem) in faded gray when inactive
     - Active stat: green border with glow, animated progress bar at bottom of card
     - Right column: paragraph description that updates per active stat
     - Auto-rotates every ~4s with timer indicator

4. **AGENTES — split layout (list left, live preview right)**
   - Left: vertical nav-list of agent capabilities (Investigador, Outreach, Nurturing, ¿Cómo funciona?, SecopLeads with `EXCLUSIVO` badge)
   - Active item: green-bordered card with title, description, square icon
   - Inactive items: just title + dim icon
   - Right: realistic app-window mockup with traffic-light dots (`● ● ●`), titlebar `landa · investigador`, scrolling content showing a fake lead being scored in real time
   - **This pattern is great for "showing" software without screenshots**

5. **"PROBLEMAS REALES, SOLUCIONES EXACTAS" — multicolor service stack**
   - Layout 2 cols: left = title + paragraph, right = stack of cards with offset/rotation
   - Cards have DIFFERENT accent colors (pink, yellow, more below the fold)
   - Each card: colored border, headline in its accent color, body gray, line-art icon
   - Cards visually overlap with slight rotation creating "stack of cards" feel

6. **"PRODUCCIÓN" — infinite horizontal carousel (2 rows, opposite directions)**
   - Section H2 with `producción.` in magenta gradient (every section has its OWN gradient color)
   - **2 rows of project cards scrolling horizontally in opposite directions** (marquee effect, infinite loop)
   - Each project card has its own accent color and contains a REALISTIC mockup of the product (chat UI, predictions dashboard, lending widget, etc.)
   - Projects shown: Eventra (cyan), Roleverse (purple), ISOMORPH (white/neutral — yes, we're listed!), Lucas (green), Boaty (blue)

7. **"NUESTRO PROCESO" — numbered steps with sticky preview**
   - Eyebrow `NUESTRO PROCESO` cyan
   - H2 `Cómo trabajamos.` enormous
   - Layout: left = title + paragraph, right = floating card with HUGE number `01`, week-range badge `SEMANA 1-2`, preview of step output
   - Bottom: dot indicator (4 dots, one cyan = active step)
   - `Sigue scrolleando →` cue

### 2.4 Lambda's typography rules

```
H1:    Syne 700-800, clamp(4rem, 11vw, 10rem), tracking-tighter (-0.025em), line-height 0.95
H2:    Syne 700, clamp(3rem, 7vw, 7rem), tracking-tight, line-height 1.0
H3:    Syne 600, ~2rem
Italic emphasis: same Syne but font-style:italic + bg-clip-text gradient
Eyebrow: Mono, uppercase, 0.7rem, letter-spacing 0.18em, in accent color
Body:   Inter 400, 1rem-1.125rem, line-height 1.6, color rgba(255,255,255,0.65)
Mini-pill text: Mono, uppercase, 0.65rem, letter-spacing 0.2em
```

### 2.5 Lambda's motion patterns

- **No cursor customization** (uses system cursor — we should remove our `cursor: none`)
- **No 3D tilt on cards** — only subtle hover lift (`translateY(-3px)`)
- Float keyframe (3s, translateY(-8px → 0)) on decorative elements only
- Stagger entrance on grids: `staggerChildren: 0.08, delayChildren: 0.2`
- Backdrop blur appears on nav AFTER scrolling past hero (not initial)
- Marquee carousel: pure CSS `animation: marquee 40s linear infinite` with duplicated content for seamless loop
- Stat auto-rotation: 4s timer with progress bar, click to manually advance
- Text reveals on scroll: per-line, opacity 0→1 + y 20px→0, duration 0.8s, ease `[0.16, 1, 0.3, 1]`

---

## 3. Isomorph's adopted design system (NEW)

### 3.1 Color tokens

```css
:root {
  /* Backgrounds — warmer than Lambda's blue-tinted darks */
  --bg-deep:     #050505;   /* hero, footer — almost pure black */
  --bg:          #0a0a0a;   /* body */
  --bg-elevated: #0e0e0e;   /* nav, modal backgrounds */
  --surface:     #121212;   /* cards (NEUTRAL gray, not indigo) */
  --surface-hi:  #1a1a1a;   /* card hover state */

  /* Ink */
  --ink:         #f5f5f5;
  --ink-soft:    rgba(245, 245, 245, 0.65);
  --ink-mute:    rgba(245, 245, 245, 0.40);
  --ink-faint:   rgba(245, 245, 245, 0.22);

  /* Borders */
  --border:      rgba(255, 255, 255, 0.06);
  --border-hi:   rgba(255, 255, 255, 0.14);
  --border-accent: rgba(200, 82, 42, 0.45);

  /* Brand — ORANGE (preserved) */
  --accent:      #c8522a;
  --accent-hi:   #e8651a;     /* hover/active */
  --accent-soft: #ffa050;     /* gradient endpoint, lighter orange */
  --accent-glow: rgba(200, 82, 42, 0.35);

  /* Signature gradient — replaces Lambda's cyan→green */
  --grad-fire:   linear-gradient(135deg, #c8522a 0%, #ffa050 50%, #ffd9a0 100%);
  --grad-fire-2: linear-gradient(135deg, #c8522a 0%, #e8851a 100%); /* shorter version */

  /* Multicolor accents for project cards (one per project) */
  --c-boaty:           #3a8ab8;  /* keep blue for nautical */
  --c-vision-media-1:  #c8522a;  /* orange — primary brand */
  --c-vision-media-2:  #6a8caf;  /* desaturated steel-blue */
  --c-precision:       #88aa6e;  /* warm olive-green */
  --c-coming-soon:     #888888;  /* neutral gray */
}
```

**Why this palette works:**
- All neutrals are warm grays (no blue tint) — feels expensive, not techy
- Single accent at full saturation (#c8522a) avoids visual chaos
- Gradient stays in the orange family — identity stays coherent
- Project accents are MUTED versions of their original colors so the orange stays dominant

### 3.2 Typography

```css
/* Imports — Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@500;600;700;800&display=swap');

--font-display: 'Syne', system-ui, sans-serif;   /* H1, H2, H3, hero */
--font-body:    'Inter', system-ui, sans-serif;  /* body, paragraphs, links */
--font-mono:    'JetBrains Mono', SFMono-Regular, Menlo, monospace;
```

**Type scale:**

| Element | Font | Weight | Size | Line-height | Tracking | Notes |
|---------|------|--------|------|-------------|----------|-------|
| H1 (hero) | Syne | 700 | clamp(4rem, 11vw, 10rem) | 0.92 | -0.025em | Italic emphasis allowed |
| H2 (section) | Syne | 700 | clamp(3rem, 7vw, 6.5rem) | 0.95 | -0.02em | Italic emphasis allowed |
| H3 (card) | Syne | 600 | 1.6-2rem | 1.0 | -0.01em | |
| Eyebrow | Mono | 500 | 0.65rem | 1 | 0.20em | uppercase, accent color |
| Body lg | Inter | 400 | 1.125rem | 1.6 | 0 | subtitles, hero subline |
| Body | Inter | 400 | 1rem | 1.65 | 0 | paragraphs |
| Body sm | Inter | 400 | 0.875rem | 1.55 | 0 | card body |
| Body micro | Inter | 500 | 0.7rem | 1.4 | 0 | meta info |
| Tag/pill | Mono | 500 | 0.6rem | 1 | 0.15em | uppercase |
| Stat number | Syne | 700 | clamp(3rem, 8vw, 6rem) | 1 | -0.04em | |

**Italic gradient pattern (signature treatment for emphasized words/phrases):**

```css
.grad-text {
  font-style: italic;
  background: var(--grad-fire);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* webkit-text-fill-color: transparent for older browsers */
}
```

Use this on the SECOND half of every dual headline (hero, sections).

### 3.3 Spacing & layout

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-6:  24px;
--space-8:  32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
--space-32: 128px;
--space-48: 192px;  /* hero vertical margins */

/* Container widths */
--container-narrow: 720px;   /* prose, manifesto */
--container:        1200px;  /* default */
--container-wide:   1440px;  /* projects carousel */
--container-bleed:  100vw;

/* Section padding (vertical) */
--section-py-sm: clamp(4rem, 8vw, 6rem);
--section-py:    clamp(6rem, 12vw, 10rem);
--section-py-lg: clamp(8rem, 18vw, 14rem);
```

### 3.4 Radius

```css
--radius-sm:   4px;    /* badges */
--radius-md:   8px;    /* small buttons */
--radius-lg:   16px;   /* inputs */
--radius-xl:   20px;   /* cards */
--radius-2xl:  28px;   /* feature cards */
--radius-pill: 9999px; /* nav pills, CTAs */
```

### 3.5 Shadows / elevation

```css
--shadow-sm:    0 1px 2px rgba(0,0,0,0.4);
--shadow-md:    0 8px 24px rgba(0,0,0,0.4);
--shadow-lg:    0 20px 60px rgba(0,0,0,0.5);
--shadow-glow:  0 0 0 1px rgba(255,255,255,0.04), 0 0 60px -8px var(--accent-glow);
```

### 3.6 Motion

```css
--ease-out:     cubic-bezier(0.16, 1, 0.3, 1);  /* default for entrances */
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);

--dur-fast:     150ms;
--dur:          250ms;
--dur-slow:     500ms;
--dur-reveal:   800ms;
```

**Animation rules:**
- All hover states: 250ms `ease-in-out`
- Scroll reveals: 800ms `ease-out`, opacity 0→1 + y 20px→0
- Stagger children: 0.08s delay
- Float idle: 3-5s, ease-in-out infinite, translateY ±6px
- **NO 3D tilt on cards** (failed in previous attempt)
- **NO custom cursor** (remove `cursor: none` everywhere)
- **NO continuous canvas animations in the hero** (kills paint perf and Lambda proves text alone is enough)
- Respect `prefers-reduced-motion: reduce` everywhere — disable transforms, keep opacity transitions

---

## 4. Page structure (NEW)

### 4.1 Routes

| Route | Status | Content |
|-------|--------|---------|
| `/` | Rebuild | Home — hero, vision, services, process, contact |
| `/portfolio` | Rebuild | Projects-focused page — hero, projects carousel, drawer details, CTA |

The home and portfolio share most components but emphasize differently. Home is "what we do." Portfolio is "what we've built."

### 4.2 Section sequence (HOME `/`)

```
1. NAV (fixed, transparent → glassy on scroll)
2. HERO — "Tu negocio en caos. / Nuestra ingeniería lo ordena."
3. STATS — animated counter + auto-rotating description
4. PROYECTOS — infinite carousel preview (links to /portfolio for full)
5. SERVICIOS — multicolor stacked cards
6. PROCESO — numbered steps with sticky preview
7. MANIFIESTO — antigravity canvas RECYCLED here (left) + text (right)
8. CTA FINAL — "¿Tu negocio es el próximo?"
9. FOOTER
```

### 4.3 Section sequence (PORTFOLIO `/portfolio`)

```
1. NAV (same component as home)
2. HERO PORTFOLIO — "Problemas reales. / Soluciones en producción."
3. PROYECTOS COMPLETOS — carrusel + lista filtrable (current ProjectsGrid + Drawer, RE-SKINNED)
4. PROCESO (compact version)
5. CTA FINAL
6. FOOTER
```

---

## 5. Component spec

### 5.1 NAV — `<SiteNav />` NEW

**Replaces:** Inline nav in `src/app/portfolio/page.tsx` lines 273-288 + inline nav in home.

**Behavior:**
- Position fixed, top 0, full width, z-index 200
- Transparent at scroll top, transitions to `rgba(10,10,10,0.7)` + `backdrop-filter: blur(14px)` after `scrollY > 80`
- Border-bottom appears at same threshold: `1px solid var(--border)`
- Layout: flex space-between, padding `1.2rem 2.5rem`

**Structure:**
```tsx
<nav>
  <Link href="/" className="logo">
    <IsomorphLogo size={26} dark />
    <span className="wordmark">isomorph<span className="dot">.</span></span>
  </Link>
  <ul className="links">
    <li><Link href="/#proyectos">Proyectos</Link></li>
    <li><Link href="/#servicios">Servicios</Link></li>
    <li><Link href="/#proceso">Método</Link></li>
  </ul>
  <div className="cta-group">
    <button onClick={toggleLang} className="lang-toggle">{lang === 'es' ? 'EN' : 'ES'}</button>
    <Link href="/#contacto" className="cta-pill">Iniciar conversación</Link>
  </div>
</nav>
```

**Styles:**
- `.wordmark`: Syne 600, `.dot` colored `var(--accent)` — period as Lambda design element
- `.links a`: Inter 400, 0.875rem, color `var(--ink-soft)`, hover `var(--ink)` 250ms
- `.cta-pill`: padding `0.75rem 1.5rem`, `bg var(--accent)`, color `var(--bg-deep)` (dark on orange), border-radius `var(--radius-pill)`, font Inter 500, 0.85rem; hover `bg var(--accent-hi)`, slight scale `1.02`
- `.lang-toggle`: ghost button, 0.75rem text, faint border, hover bright

### 5.2 HERO HOME — `<HeroHome />` NEW

**Replaces:** Current `<Hero />` component fully. The current Hero has a Vanta clouds background and complex layout — discard.

**Layout (full viewport height, content centered):**
```
[60vh down]  EYEBROW PILL (icon + mono text)
[70vh]       H1 LINE 1 (white)
[80vh]       H1 LINE 2 (italic + gradient)
[88vh]       SUBTITLE (2 lines, Inter, gray, max-width 640px)
[95vh]       CTA GROUP (primary + secondary)
```

**Content (ES):**
```tsx
<EyebrowPill icon={<Sparkle />} text="SOFTWARE · INGENIERÍA · IA APLICADA" />

<h1>
  Tu negocio en caos.
  <br />
  <em className="grad-text">Nuestra ingeniería lo ordena.</em>
</h1>

<p className="hero-sub">
  Software empresarial e infraestructura de IA construido como ingeniería de verdad —
  sin plantillas, sin shortcuts, sin promesas vagas.
</p>

<div className="cta-row">
  <Link href="#contacto" className="cta-primary">Iniciar conversación</Link>
  <Link href="/portfolio" className="cta-secondary">Ver proyectos →</Link>
</div>
```

**Content (EN):**
- H1: `Your business in chaos.` / `Our engineering brings order.`
- Eyebrow: `SOFTWARE · ENGINEERING · APPLIED AI`
- Sub: `Enterprise software and AI infrastructure built as real engineering — no templates, no shortcuts, no vague promises.`
- CTAs: `Start conversation` / `View projects →`

**Motion:**
- All elements appear via stagger on mount (delay children 0.15s, each fade+y from 30→0, duration 0.8s)
- Scroll cue at bottom: vertical 1px line, animated pulse, label "Scroll" mono
- NO Vanta, NO canvas. Hero is pure CSS + text.

### 5.3 HERO PORTFOLIO — `<HeroPortfolio />` NEW

Same component shape as `<HeroHome />` but different content:

**ES:**
- Eyebrow: `STUDIO · 2024–2026 · 5 PROYECTOS`
- H1: `Problemas reales.` / `Soluciones en producción.`
- Sub: `Cada proyecto aquí empezó como un problema concreto de negocio. Lo resolvimos con ingeniería e inteligencia artificial.`
- CTAs: `Ver proyectos ↓` (smooth scroll to grid) / `Iniciar conversación`

**EN:**
- Eyebrow: `STUDIO · 2024–2026 · 5 PROJECTS`
- H1: `Real problems.` / `Solutions in production.`
- Sub: `Every project here started as a concrete business problem. We solved it with engineering and AI.`
- CTAs: `View projects ↓` / `Start conversation`

### 5.4 STATS — `<StatsBlock />` NEW

**Layout 2 cols at md+:**
- Left: stack of 4 stat cards. Active card has accent border + animated progress bar at bottom (4s linear). Others muted.
- Right: paragraph that updates with active stat. Fades when stat changes.

**Stats data:**
```ts
[
  { num: '5+',  label: 'Proyectos en producción',
    desc: 'No demos. Sistemas reales con usuarios reales y métricas en producción.' },
  { num: '100%', label: 'Desarrollo a la medida',
    desc: 'Nunca usamos plantillas. Cada sistema se construye desde cero según las necesidades exactas del cliente.' },
  { num: '4',    label: 'Categorías de producto',
    desc: 'AI, ML, Marketplaces y Fintech. Profundidad real en cada vertical.' },
  { num: 'Alta', label: 'Escalabilidad',
    desc: 'Arquitectura preparada desde el día uno para crecer con el negocio.' },
]
```

**Behavior:**
- Auto-rotate every 4s (timer indicator on active card)
- Click any card → that becomes active, timer resets
- Active card: border `1.5px solid var(--accent)`, glow shadow, progress bar on bottom-edge using accent
- Numbers: Syne 700, ~5rem, ink (active) / `--ink-faint` (inactive). Smooth color transition on activation.

### 5.5 PROJECTS — `<ProjectsCarousel />` & `<ProjectsGrid />` REWORK

**On home:** carousel only (preview, max 5 cards, 1 row scrolling slowly)
**On portfolio:** grid + filter (rework current `ProjectsGrid`)

**Common card:** `<ProjectCard />` — REWRITE
- Replace placeholder with REAL screenshot/mockup of each product (when assets ready). For now keep accent placeholder (the icon-orb pattern from current ProjectCard.tsx is fine, but REMOVE 3D tilt).
- Card structure:
  ```
  [Header bar: project tag + status badge + accent dot]
  [Media area: 60% of card height — screenshot OR icon placeholder]
  [Body: number, title, problem statement, brief tagline]
  [Footer: hover-revealed "Ver caso →" with accent arrow]
  ```
- Hover: lift `translateY(-4px)`, border accent, no 3D rotation
- Click: opens existing `<ProjectDrawer />` (already built — keep)

**Carousel for home:**
- Single horizontal row, ALL cards visible scrolling slowly
- Pure CSS marquee: `animation: marquee 50s linear infinite`. Duplicate cards in markup for seamless loop.
- Pause on hover (`animation-play-state: paused`)
- Click any card → navigate to `/portfolio` with that project's drawer auto-open via query param `?p=boaty`

### 5.6 SERVICES — `<ServicesStack />` NEW

**Layout 2 cols:**
- Left: title + paragraph + 1 CTA
- Right: vertically stacked cards with slight rotation/offset (Lambda style)

**Cards (3 services):**
```ts
[
  { title: 'Software a la medida',
    desc: 'Desarrollo empresarial sin plantillas. Arquitectura desde cero, ingeniería de alto nivel.',
    accent: '#c8522a',  /* orange */
    icon: <Code /> },
  { title: 'Agentes de IA',
    desc: 'Sistemas autónomos que automatizan procesos críticos del negocio sin perder el toque humano.',
    accent: '#e8851a',  /* amber */
    icon: <Bot /> },
  { title: 'Construido contigo',
    desc: 'Desde la primera reunión hasta el lanzamiento, trabajamos como tu equipo de ingeniería externo.',
    accent: '#ffa050',  /* light orange */
    icon: <Users /> },
]
```

**Card style:**
- Border `1.5px solid var(--accent-X-30)` where accent comes from project
- Title in accent color, Syne 600, 1.8rem
- Body Inter, ink-soft
- Icon in accent
- Slight rotation: card[0] `rotate(-2deg)`, card[1] `rotate(0)`, card[2] `rotate(2deg)`
- On hover: rotation→0, lift, brighter accent

### 5.7 PROCESS — `<ProcessSteps />` NEW

**Layout:**
- Eyebrow: `NUESTRO PROCESO`
- H2: `Cómo trabajamos.`
- Subtitle (gray, max 540px): `Un proceso probado en 4 fases — desde entender el problema hasta escalar la solución.`
- Below: split layout — left sticky title col, right scrolling steps OR carousel

**Steps:**
```ts
[
  { num: '01', title: 'Descubrimiento',  weeks: 'SEMANA 1-2',
    desc: 'Entendemos tu negocio. Mapeamos procesos, dolores y oportunidades antes de escribir una línea de código.',
    deliverable: 'Diagnóstico técnico + propuesta de arquitectura' },
  { num: '02', title: 'Diseño',          weeks: 'SEMANA 3-4',
    desc: 'Arquitectura del sistema, flujos críticos, prototipos validados con tus usuarios.',
    deliverable: 'Specs técnicas + prototipos navegables' },
  { num: '03', title: 'Construcción',    weeks: 'SEMANA 5-12',
    desc: 'Sprints de 2 semanas. Demo cada sprint. Tú validas, nosotros ajustamos. Sin sorpresas.',
    deliverable: 'Sistema en staging + iteraciones' },
  { num: '04', title: 'Lanzamiento',     weeks: 'SEMANA 13+',
    desc: 'Producción, monitoreo, escalamiento. Acompañamos hasta que el sistema vuela solo.',
    deliverable: 'Sistema en producción + soporte' },
]
```

**Card design (right side):**
- Big number Syne 800, 8rem, accent
- Week badge: pill outline accent
- Title Syne 700, 2.5rem
- Desc Inter, ink-soft
- "Entregable:" label + value
- Below card: 4-dot indicator (one accent active)

**Behavior:**
- Each step appears on scroll (fade+slide)
- Title column stays sticky during scroll through steps
- OR alternative: carousel with arrow nav + auto-advance every 5s

### 5.8 MANIFESTO — `<ManifestoSection />` NEW

**Purpose:** This is where the antigravity canvas (currently in portfolio hero) GETS RECYCLED. Don't delete — relocate.

**Layout 2 cols at md+:**
- Left: the existing canvas animation (from `src/app/portfolio/page.tsx` lines 64-262 — extract to `<AntigravityCanvas />` component)
- Right:
  - Eyebrow: `CÓMO PENSAMOS`
  - H2: `Sintetizamos caos.` (white) / `Predict control.` (italic gradient)
  - Body: 2-3 paragraphs explaining the engineering philosophy (data graphs, system thinking, etc.)
  - Quote-style pull-out: `"Cada proyecto empieza como un grafo de problemas. Termina como un sistema en producción."`

**The canvas** in this context becomes decorative (not hero competition) — it's allowed to be busy because it's the visual partner to the manifesto text.

### 5.9 CTA FINAL — `<FinalCTA />` NEW

**Replaces:** Current `<section className="cta">` block in portfolio (lines 488-502).

**Layout (centered, not split):**
- H2: `¿Tu negocio es el próximo?` / `Cuéntanos tu problema.` (italic gradient)
- Sub: 1 line gray, max 480px
- Single CTA: full button pill, big, accent
- Below: small text `Respondemos en 24h` with mono dot

### 5.10 FOOTER — `<SiteFooter />` REFACTOR

Keep simple. 3 zones:
- Left: logo + wordmark + line `© 2026 ISOMORPH AI · ANTIGRAVITY ENGINE`
- Center: nav repeated (small, ink-mute, Inter)
- Right: social/contact links — github, linkedin, email (icons only, hover accent)

---

## 6. Files plan

### 6.1 Files to CREATE

```
src/components/
  SiteNav.tsx              [NEW]
  HeroHome.tsx             [NEW]
  HeroPortfolio.tsx        [NEW]
  EyebrowPill.tsx          [NEW]  small reusable component
  StatsBlock.tsx           [NEW]
  ProjectsCarousel.tsx     [NEW]
  ServicesStack.tsx        [NEW]
  ProcessSteps.tsx         [NEW]
  ManifestoSection.tsx     [NEW]
  AntigravityCanvas.tsx    [NEW]  extracted from portfolio/page.tsx useEffect
  FinalCTA.tsx             [NEW]
  SiteFooter.tsx           [NEW]

src/styles/
  tokens.css               [NEW]  the :root variables from §3
  typography.css           [NEW]  H1/H2/H3 base + .grad-text
  components.css           [NEW]  pill, button, card primitives

src/lib/
  i18n.ts                  [NEW]  centralize ES/EN strings (tired of inline ternaries)

.planning/
  ISOMORPH_LANDING_REBUILD.md  ← THIS FILE
```

### 6.2 Files to REWRITE

```
src/app/page.tsx              — replace entirely; compose new sections
src/app/portfolio/page.tsx    — replace entirely; compose new sections
src/app/portfolio/portfolio.css  — keep grid+drawer rules, delete hero/boaty/proj-detail rules
src/app/globals.css           — import tokens.css + typography.css
src/app/layout.tsx            — add Syne + Inter fonts via next/font
src/components/Hero.tsx       — DELETE (replaced by HeroHome)
src/components/VisionSection.tsx — DELETE (replaced by ManifestoSection)
```

### 6.3 Files to KEEP AS-IS (already good)

```
src/components/ProjectCard.tsx       — keep, just remove 3D tilt + restyle
src/components/ProjectDrawer.tsx     — keep entirely
src/components/ProjectsGrid.tsx      — keep, but only used in /portfolio
src/components/IsomorphLogo.tsx      — keep
src/components/BoatyPhone3D.tsx      — keep (used in drawer)
src/components/BoatyDesktopSlider.tsx — keep (used in drawer)
src/components/VisionMedia13D.tsx    — keep (used in drawer)
src/components/VisionMedia23D.tsx    — keep (used in drawer)
src/components/PrecisionBanking3D.tsx — keep (used in drawer)
src/data/projects.tsx                — keep, add screenshot URLs when ready
```

### 6.4 Files to DELETE eventually (after migration confirmed)

```
src/components/AntigravityScene.tsx
src/components/IntegrationNodes.tsx
src/components/KineticAnalyticsGraphic.tsx
src/components/MarketingAIAgentGraphic.tsx
src/components/MultimodalControlGraphic.tsx
src/components/VoiceAIAgentGraphic.tsx
src/components/GraphLandscape.tsx
src/components/InteractiveProducts.tsx
src/components/LiquidChrome.tsx
src/components/GlassCard.tsx
src/components/ContactSection.tsx     — replaced by FinalCTA + a separate /contacto route later
src/components/GraphUIElements.tsx    — keep only if any of GraphButton/Card/Divider/MeshBackground get reused
src/types/vanta.d.ts                  — Vanta no longer needed in Hero
package.json                           — remove "vanta" dependency
```

---

## 7. Implementation phases

The user has approved a phased approach. **Each phase ends in a working, demoable state.** Don't ship phase N+1 if phase N is broken.

### Phase 1 — Tokens, fonts, and a minimal hero (4-6 hours)

**Goal:** New typography + new hero visible at `/` and `/portfolio`. Everything else still old.

1. Add Syne + Inter via `next/font/google` in `src/app/layout.tsx`
2. Create `src/styles/tokens.css` with all CSS custom properties from §3
3. Create `src/styles/typography.css` with H1/H2/H3 + `.grad-text` rules
4. Import both in `globals.css`
5. Build `<EyebrowPill>` component
6. Build `<HeroHome>` and `<HeroPortfolio>` components
7. Wire them into `src/app/page.tsx` and `src/app/portfolio/page.tsx` REPLACING current heros
8. Smoke test: both routes load, fonts render, gradient text works
9. **Commit:** `feat(landing): phase 1 — Syne + Inter typography, dual-line hero pattern`

### Phase 2 — Nav + Footer (2-3 hours)

1. Build `<SiteNav>` with scroll-triggered glassy state
2. Build `<SiteFooter>` minimal version
3. Replace existing nav/footer in both pages
4. Lift `lang` state to layout level OR keep per-page (pragmatic: per-page for now, refactor later)
5. **Commit:** `feat(landing): phase 2 — site nav + footer`

### Phase 3 — Projects rework (3-4 hours)

1. Strip 3D tilt from `<ProjectCard>` (already kind of done — verify)
2. Re-skin card with new tokens (orange accent border on hover, no glassmorphism)
3. Build `<ProjectsCarousel>` (CSS marquee, 1 row, pause on hover)
4. Add `?p=<slug>` query param support to `<ProjectsGrid>` to auto-open drawer
5. Wire `<ProjectsCarousel>` on home, keep `<ProjectsGrid>` on portfolio
6. **Commit:** `feat(landing): phase 3 — projects carousel + restyled cards`

### Phase 4 — Stats + Services + Process (5-6 hours)

1. Build `<StatsBlock>` with auto-rotation
2. Build `<ServicesStack>` with rotated card stack
3. Build `<ProcessSteps>`
4. Insert into home in correct order
5. **Commit:** `feat(landing): phase 4 — stats, services, process sections`

### Phase 5 — Manifesto + Final CTA (3 hours)

1. Extract antigravity canvas useEffect into `<AntigravityCanvas>` component
2. Build `<ManifestoSection>` using extracted canvas
3. Build `<FinalCTA>`
4. Insert into home
5. **Commit:** `feat(landing): phase 5 — manifesto + final CTA`

### Phase 6 — Polish & cleanup (2-3 hours)

1. Reduced-motion audit (respect everywhere)
2. Mobile responsive pass on all new components
3. Delete dead components from §6.4
4. Remove `vanta` dependency from `package.json`
5. Lighthouse pass (target: 90+ on desktop, 80+ on mobile)
6. **Commit:** `chore(landing): cleanup, a11y, performance`

**Total estimate:** 19-25 hours of focused work.

---

## 8. Copy bank (Spanish primary, English secondary)

### Hero Home

| Field | ES | EN |
|-------|----|----|
| Eyebrow | `SOFTWARE · INGENIERÍA · IA APLICADA` | `SOFTWARE · ENGINEERING · APPLIED AI` |
| H1 line 1 | `Tu negocio en caos.` | `Your business in chaos.` |
| H1 line 2 (italic+gradient) | `Nuestra ingeniería lo ordena.` | `Our engineering brings order.` |
| Subtitle | `Software empresarial e infraestructura de IA construido como ingeniería de verdad — sin plantillas, sin shortcuts, sin promesas vagas.` | `Enterprise software and AI infrastructure built as real engineering — no templates, no shortcuts, no vague promises.` |
| CTA primary | `Iniciar conversación` | `Start conversation` |
| CTA secondary | `Ver proyectos →` | `View projects →` |

### Hero Portfolio

| Field | ES | EN |
|-------|----|----|
| Eyebrow | `STUDIO · 2024–2026 · 5 PROYECTOS` | `STUDIO · 2024–2026 · 5 PROJECTS` |
| H1 line 1 | `Problemas reales.` | `Real problems.` |
| H1 line 2 | `Soluciones en producción.` | `Solutions in production.` |
| Subtitle | `Cada proyecto aquí empezó como un problema concreto de negocio. Lo resolvimos con ingeniería e inteligencia artificial.` | `Every project here started as a concrete business problem. We solved it with engineering and AI.` |

### Stats Block

| ES Label | EN Label | Number |
|---|---|---|
| Proyectos en producción | Projects in production | 5+ |
| Desarrollo a la medida | Custom development | 100% |
| Categorías de producto | Product verticals | 4 |
| Escalabilidad | Scalability | Alta / High |

### Services

| Title ES / EN | Description ES |
|---|---|
| `Software a la medida` / `Custom software` | Desarrollo empresarial sin plantillas. Arquitectura desde cero, ingeniería de alto nivel. |
| `Agentes de IA` / `AI agents` | Sistemas autónomos que automatizan procesos críticos del negocio sin perder el toque humano. |
| `Construido contigo` / `Built with you` | Desde la primera reunión hasta el lanzamiento, trabajamos como tu equipo de ingeniería externo. |

### Process

(see §5.7 — already complete in spec)

### Final CTA

| Field | ES | EN |
|-------|----|----|
| H2 line 1 | `¿Tu negocio es el próximo?` | `Is your business next?` |
| H2 line 2 (italic+gradient) | `Cuéntanos tu problema.` | `Tell us your problem.` |
| Sub | `Trabajamos con empresas que tienen una base de clientes establecida y necesitan que su tecnología esté a la altura.` | `We work with companies that have an established customer base and need their technology to match.` |
| CTA | `Iniciar conversación →` | `Start conversation →` |
| Footnote | `Respondemos en 24h` | `We reply within 24h` |

---

## 9. Constraints & non-goals

### Constraints
- Bilingual ES/EN must be preserved everywhere
- Dark mode only — no light mode toggle for v1
- All animations must respect `prefers-reduced-motion: reduce`
- No client-side cursor customization (`cursor: none`) — accessibility
- Mobile responsive non-negotiable
- Must build cleanly (`next build`)
- Must NOT break existing project drawer functionality (keep `ProjectDrawer.tsx` and the 3D components it uses)

### Non-goals
- Light theme support
- CMS integration (content stays in code for now)
- Blog or articles
- Internationalization beyond ES/EN
- A/B testing / personalization
- Authentication on landing pages (keep `/api/auth/session` route untouched but don't surface)
- Mobile apps

---

## 10. Success criteria

**This rebuild is "done" when:**

1. A first-time visitor can articulate Isomorph's positioning in 5 seconds (problem → solution, AI engineering studio)
2. The site is visually distinct from any glassy/agency template — looks editorial and premium
3. Every project in `/portfolio` is reachable in ≤2 clicks (carousel/grid → drawer)
4. Lighthouse score: 90+ desktop, 80+ mobile (performance + accessibility)
5. Loads under 2.5s LCP on a desktop with 4G throttle
6. Works at viewport widths 360px → 2560px without breakage
7. Zero TypeScript errors, zero ESLint errors
8. The user (Maximiliano) approves the v1 visually before merge to main

**The hero alone should pass the "Lambda test":** could you swap our hero into Lambda's layout and have it feel native? If yes, the typographic discipline is right. If no, we kept too much of the old "agency" feel.

---

## 11. Open questions (for the user, before phase 1 starts)

1. **Project screenshots** — when can we get real product screenshots for the cards? Until then, accent-icon placeholder is fine but not great for the pitch.
2. **Footer contact** — is `mapube16@github` enough? Or do we need a real `/contacto` form? (User mentioned a `ContactSection.tsx` already exists from a teammate's commit — review and decide.)
3. **Domain** — currently deployed where? Need to confirm production target (Vercel? Railway?).
4. **Analytics** — install GA4 / Plausible / nothing? Default plan: nothing for v1.
5. **GitHub link in nav** — show it or not? (Lambda doesn't, even though they're a tech studio. Probably skip.)

---

## 12. Quick-start for implementing agent

If you're a fresh agent picking this up:

1. **Read this entire document** before touching any code.
2. **Read** `CLAUDE.md` if it exists at repo root (it doesn't yet — feel free to create one summarizing this).
3. Check `git status` and `git log -5` to know what state the working tree is in.
4. The existing project files (Phase 0) at the time of writing have:
   - A bento-grid attempt at `/portfolio` (functional but ugly)
   - A Vanta-based hero on `/` (heavy and generic)
   - Bilingual ES/EN already wired everywhere via `lang` state
   - `framer-motion` and `lucide-react` already installed
   - `vanta` installed but should be removed by phase 6
5. Run `npm run dev` and navigate to `/` and `/portfolio` to see baseline.
6. Start with **Phase 1**. Don't skip ahead.
7. After each phase: take a screenshot, show the user, get green light before next phase.
8. Use the Spanish copy from §8 as canonical. Don't ad-lib.
9. The orange `#c8522a` is sacred. Don't replace, don't tint, don't supplement with cyan/blue/purple.

---

## 13. Glossary

- **Lambda** — landatech.org, the visual reference site
- **Antigravity** — Isomorph's existing tagline/canvas; recycled in §5.8 manifesto
- **Bento grid** — failed previous attempt at projects layout; replaced with carousel
- **Drawer** — `<ProjectDrawer>` slide-in panel from right showing project detail; KEEP
- **3D component** — the per-project mockup React components (`BoatyPhone3D`, etc.); used inside drawer only, not in cards
- **Glass / Glassmorphism** — translucent + backdrop-blur card style; AVOID for v2 except in nav scrolled state
- **Eyebrow** — small uppercase mono label above a heading
- **Grad-text** — italic + bg-clip-text + orange gradient; signature emphasis pattern

---

**End of spec. Ship phase 1 next.**
