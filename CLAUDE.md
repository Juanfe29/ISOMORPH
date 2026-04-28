# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

**Development**
- `npm run dev` — Start Next.js dev server (runs on http://localhost:3000)
- `npm run build` — Build for production
- `npm start` — Run production server
- `npm run lint` — Run ESLint

**Package Management**
- `npm install` — Install dependencies
- `pnpm install` — Alternative (project has pnpm-lock.yaml)

## Project Overview

**ISOMORPH** is a modern Next.js 16 landing page with advanced interactive visuals and AI capabilities. The site showcases data intelligence solutions through immersive 3D graphics, animations, and multimedia experiences.

## Technology Stack

- **Framework**: Next.js 16 with React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom CSS modules
- **3D/Graphics**: Three.js, GSAP animations, Framer Motion, Vanta effects
- **UI Components**: shadcn/ui (via Base UI), custom button components
- **AI Integration**: Google Generative AI (Gemini client)
- **Audio**: Voice agent integration via useVoiceAgent hook
- **Fonts**: Multiple Google Fonts (Figtree, Syne, DM Mono, Barlow Condensed, Bebas Neue, Archivo, Inter, JetBrains Mono)

## Architecture

**App Structure**
- `src/app/` — Next.js App Router pages (layout.tsx, page.tsx, portfolio/)
- `src/components/` — React components organized by feature/section
- `src/lib/` — Utilities (gemini-client.ts for AI, audio-utils.ts, utils.ts for cn/classname helpers)
- `src/hooks/` — Custom React hooks (useVoiceAgent for audio/voice features)
- `src/types/` — TypeScript type definitions (vanta.d.ts for type declarations)
- `src/data/` — Static data and project information
- `src/app/styles/` — Global design tokens (cards.css, sections.css, tokens.css, typography.css)
- `src/app/api/` — API routes (auth/session/route.ts)

**Key Components**
- **HomePage** — Main landing page container with language support (Spanish/English via initialLang prop)
- **HeroHome** — Hero section with visual impact
- **SiteNav/SiteFooter** — Navigation and footer components
- **ProcessSteps, ServicesStack, ManifestoSection** — Content sections
- **3D/Visual Components**: AntigravityScene, LiquidChrome, Prism, GraphLandscape, BoatyShowcase, ProjectsCarousel
- **ProjectCard/ProjectDrawer** — Portfolio project display with interactive drawer
- **GlassCard** — Reusable glass-morphism UI component
- **ContactSection** — Contact/CTA section

## Important Notes

**Three.js Version Compatibility**
- The project uses Three.js r134 (loaded via CDN in layout.tsx) for Vanta BIRDS effects
- The npm Three.js package (v0.182) is for other 3D usage
- This mismatch is intentional: r182 npm build is incompatible with Vanta BIRDS, so r134 is loaded before interactive

**Design System**
- Uses CSS custom properties in tokens.css for design system values
- Tailwind CSS v4 with PostCSS integration
- Custom styling in src/app/styles/ complements Tailwind classes

**Configuration**
- TypeScript paths aliased: `@/*` maps to `src/*`
- ESLint configured with Next.js core web vitals and TypeScript rules
- Turbopack enabled in next.config.ts for faster builds
- Metadata handled in layout.tsx (title, description for SEO)

**AI/Voice Features**
- Gemini API client at `src/lib/gemini-client.ts` for AI integration
- Voice agent via useVoiceAgent hook — check AudioUtils for implementation patterns
- Session API route at `/api/auth/session` (minimal but extensible)

## Development Patterns

- Use `cn()` utility (from @/lib/utils) to merge Tailwind and custom classnames safely
- Components typically accept `initialLang` prop for Spanish/English language support
- 3D components use Three.js or WebGL via OGL library
- CSS Modules and global CSS are both used; prefer global tokens for consistency
