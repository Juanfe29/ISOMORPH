"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import EyebrowPill from "./EyebrowPill";
import Prism from "./Prism";
import SplitText from "./SplitText";

interface HeroHomeProps {
  lang?: "es" | "en";
}

const COPY = {
  es: {
    eyebrow: "SOFTWARE · INGENIERÍA · IA APLICADA",
    h1Line1: "Tu negocio en caos.",
    h1Line2: "Nuestra ingeniería lo ordena.",
    sub: "Software empresarial e infraestructura de IA construido como ingeniería de verdad — sin plantillas, sin shortcuts, sin promesas vagas.",
    ctaPrimary: "Iniciar conversación",
    ctaSecondary: "Ver proyectos",
    scrollCue: "Scroll",
  },
  en: {
    eyebrow: "SOFTWARE · ENGINEERING · APPLIED AI",
    h1Line1: "Your business in chaos.",
    h1Line2: "Our engineering brings order.",
    sub: "Enterprise software and AI infrastructure built as real engineering — no templates, no shortcuts, no vague promises.",
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
    show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: reduce ? 0 : 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.85, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section
      className="iso-hero-home relative w-full overflow-hidden"
      style={{
        backgroundColor: "var(--bg-deep)",
        minHeight: "100vh",
        paddingTop: "clamp(7rem, 16vh, 12rem)",
        paddingBottom: "clamp(5rem, 12vh, 9rem)",
      }}
    >
      {/* Atmospheric background — the forge's heat glow */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(157,2,8,0.25) 0%, rgba(55,6,23,0.12) 40%, transparent 70%)",
        }}
      />

      {/* PRISM — ocupa toda la primera pantalla */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.92,
        }}
      >
        <Prism
          height={3.5}
          baseWidth={5.5}
          animationType="rotate"
          glow={1}
          noise={0}
          transparent
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          hoverStrength={2}
          inertia={0.05}
          bloom={1}
          timeScale={0.5}
          firePalette={1}
          suspendWhenOffscreen
        />
      </div>
      {/* Subtle grid */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.3,
          backgroundImage: "linear-gradient(rgba(244,140,6,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,140,6,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 90% 60% at 50% 0%, black 0%, transparent 80%)",
        }}
      />

      <motion.div
        className="mx-auto flex flex-col items-center text-center px-6 relative z-10"
        style={{ maxWidth: "var(--container)" }}
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <motion.div variants={item}>
          <EyebrowPill icon={<Flame size={11} strokeWidth={2} />} text={copy.eyebrow} />
        </motion.div>

        <SplitText
          text={`${copy.h1Line1} ${copy.h1Line2}`}
          tag="h1"
          className="iso-h1 mt-10"
          style={{ maxWidth: "18ch" }}
          delay={40}
          duration={0.8}
          ease="power3.out"
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
          splitType="words"
        />

        <motion.p
          variants={item}
          className="iso-body-lg mt-8"
          style={{ maxWidth: "580px" }}
        >
          {copy.sub}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="#contact"
            className="hero-cta-primary inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              fontWeight: 600,
              background: "var(--fire-hot)",
              color: "#03071e",
              padding: "1rem 1.8rem",
              borderRadius: "var(--radius-pill)",
            }}
          >
            {copy.ctaPrimary}
            <ArrowRight size={16} strokeWidth={2} />
          </Link>

          <Link
            href="/portfolio"
            className="hero-cta-secondary inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "var(--ink-soft)",
              padding: "1rem 1.8rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid rgba(244,140,6,0.2)",
              backgroundColor: "rgba(244,140,6,0.04)",
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
        transition={{ delay: reduce ? 0 : 1.8, duration: 0.6 }}
        aria-hidden
      >
        <span className="iso-tag" style={{ color: "var(--ink-faint)" }}>{copy.scrollCue}</span>
        <span className="iso-hero-scroll-line" aria-hidden />
      </motion.div>

      <style jsx>{`
        .hero-cta-primary {
          transition: filter 250ms ease, transform 250ms ease, box-shadow 250ms ease;
        }
        .hero-cta-primary:hover {
          filter: brightness(1.12);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(244,140,6,0.45);
        }
        .hero-cta-secondary {
          transition: border-color 250ms ease, background-color 250ms ease, color 250ms ease;
        }
        .hero-cta-secondary:hover {
          border-color: rgba(244,140,6,0.45) !important;
          background-color: rgba(244,140,6,0.10) !important;
          color: var(--ink) !important;
        }
        .iso-hero-scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, var(--accent), transparent);
          animation: iso-scroll-pulse 2.4s ease-in-out infinite;
        }
        @keyframes iso-scroll-pulse {
          0%, 100% { opacity: 0.2; transform: scaleY(0.6); }
          50% { opacity: 0.8; transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .iso-hero-scroll-line { animation: none; }
          .hero-cta-primary:hover, .hero-cta-secondary:hover { transform: none !important; }
        }
      `}</style>
    </section>
  );
}
