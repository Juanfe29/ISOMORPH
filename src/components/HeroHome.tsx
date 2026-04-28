"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import EyebrowPill from "./EyebrowPill";

interface HeroHomeProps {
  lang?: "es" | "en";
}

const COPY = {
  es: {
    eyebrow: "SOFTWARE · INGENIERÍA · IA APLICADA",
    h1Line1: "Tu negocio en caos.",
    h1Line2: "Nuestra ingeniería lo ordena.",
    sub:
      "Software empresarial e infraestructura de IA construido como ingeniería de verdad — sin plantillas, sin shortcuts, sin promesas vagas.",
    ctaPrimary: "Iniciar conversación",
    ctaSecondary: "Ver proyectos",
    scrollCue: "Scroll",
  },
  en: {
    eyebrow: "SOFTWARE · ENGINEERING · APPLIED AI",
    h1Line1: "Your business in chaos.",
    h1Line2: "Our engineering brings order.",
    sub:
      "Enterprise software and AI infrastructure built as real engineering — no templates, no shortcuts, no vague promises.",
    ctaPrimary: "Start conversation",
    ctaSecondary: "View projects",
    scrollCue: "Scroll",
  },
} as const;

export default function HeroHome({ lang = "es" }: HeroHomeProps) {
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
      className="iso-hero-home relative w-full"
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
            icon={<Sparkles size={11} strokeWidth={2} />}
            text={copy.eyebrow}
          />
        </motion.div>

        <motion.h1
          variants={item}
          className="iso-h1 mt-10"
          style={{ maxWidth: "16ch" }}
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
            href="#contact"
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
            <ArrowRight size={16} strokeWidth={2} />
          </Link>

          <Link
            href="/portfolio"
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

      {/* Scroll cue */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ bottom: "clamp(1.5rem, 4vh, 3rem)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1.6, duration: 0.6 }}
        aria-hidden
      >
        <span
          className="iso-tag"
          style={{ color: "var(--ink-faint)" }}
        >
          {copy.scrollCue}
        </span>
        <span
          className="iso-hero-scroll-line"
          aria-hidden
        />
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
        .iso-hero-scroll-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(to bottom, transparent, var(--ink-faint), transparent);
          animation: iso-scroll-pulse 2.4s ease-in-out infinite;
        }
        @keyframes iso-scroll-pulse {
          0%,
          100% {
            opacity: 0.25;
            transform: scaleY(0.7);
          }
          50% {
            opacity: 0.9;
            transform: scaleY(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .iso-hero-scroll-line {
            animation: none;
          }
          .iso-cta-primary:hover,
          .iso-cta-secondary:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
