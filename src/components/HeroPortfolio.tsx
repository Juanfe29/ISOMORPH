"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, FolderGit2 } from "lucide-react";
import EyebrowPill from "./EyebrowPill";

interface HeroPortfolioProps {
  lang?: "es" | "en";
  workAnchor?: string;
}

const COPY = {
  es: {
    eyebrow: "STUDIO · 2024–2026 · 5 PROYECTOS",
    h1Line1: "Problemas reales.",
    h1Line2: "Soluciones en producción.",
    sub:
      "Cada proyecto aquí empezó como un problema concreto de negocio. Lo resolvimos con ingeniería e inteligencia artificial.",
    ctaPrimary: "Ver proyectos",
    ctaSecondary: "Iniciar conversación",
  },
  en: {
    eyebrow: "STUDIO · 2024–2026 · 5 PROJECTS",
    h1Line1: "Real problems.",
    h1Line2: "Solutions in production.",
    sub:
      "Every project here started as a concrete business problem. We solved it with engineering and AI.",
    ctaPrimary: "View projects",
    ctaSecondary: "Start conversation",
  },
} as const;

export default function HeroPortfolio({
  lang = "es",
  workAnchor = "#work",
}: HeroPortfolioProps) {
  const copy = COPY[lang];
  const reduce = useReducedMotion();

  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.12,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      className="iso-hero-portfolio relative w-full"
      style={{
        backgroundColor: "var(--bg-deep)",
        minHeight: "100vh",
        paddingTop: "clamp(6rem, 14vh, 10rem)",
        paddingBottom: "clamp(4rem, 10vh, 8rem)",
      }}
    >
      <motion.div
        className="mx-auto flex flex-col items-center text-center px-6"
        style={{ maxWidth: "var(--container)" }}
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <motion.div variants={item}>
          <EyebrowPill
            icon={<FolderGit2 size={11} strokeWidth={2} />}
            text={copy.eyebrow}
          />
        </motion.div>

        <motion.h1
          variants={item}
          className="iso-h1 mt-10"
          style={{ maxWidth: "18ch" }}
        >
          {copy.h1Line1}
          <br />
          <em className="iso-grad">{copy.h1Line2}</em>
        </motion.h1>

        <motion.p
          variants={item}
          className="iso-body-lg mt-8"
          style={{ maxWidth: "640px" }}
        >
          {copy.sub}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href={workAnchor}
            className="iso-cta-primary inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              fontWeight: 500,
              backgroundColor: "var(--accent)",
              color: "var(--bg-deep)",
              padding: "0.95rem 1.6rem",
              borderRadius: "var(--radius-pill)",
              transition: `background-color var(--dur) var(--ease-in-out), transform var(--dur) var(--ease-in-out)`,
            }}
          >
            {copy.ctaPrimary}
            <ArrowDown size={16} strokeWidth={2} />
          </Link>

          <Link
            href="/#contact"
            className="iso-cta-secondary inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "var(--ink)",
              padding: "0.95rem 1.6rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--border-hi)",
              backgroundColor: "rgba(255,255,255,0.02)",
              transition: `border-color var(--dur) var(--ease-in-out), background-color var(--dur) var(--ease-in-out)`,
            }}
          >
            {copy.ctaSecondary}
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .iso-cta-primary:hover {
          background-color: var(--accent-hi) !important;
          transform: translateY(-1px);
        }
        .iso-cta-secondary:hover {
          border-color: var(--border-accent) !important;
          background-color: rgba(200, 82, 42, 0.08) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .iso-cta-primary:hover,
          .iso-cta-secondary:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
