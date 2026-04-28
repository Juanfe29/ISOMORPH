"use client";

import Link from "next/link";
import { useState } from "react";
import HeroHome from "./HeroHome";
import StatsBlock from "./StatsBlock";
import ProjectsCarousel from "./ProjectsCarousel";
import BoatyShowcase from "./BoatyShowcase";
import ServicesStack from "./ServicesStack";
import ProcessSteps from "./ProcessSteps";
import ManifestoSection from "./ManifestoSection";
import ContactSection from "./ContactSection";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import SplitText from "./SplitText";

interface HomePageProps {
  initialLang?: "es" | "en";
}

export default function HomePage({ initialLang = "es" }: HomePageProps) {
  const [lang, setLang] = useState<"es" | "en">(initialLang);

  return (
    <main
      className="min-h-screen selection:bg-white/10"
      style={{ backgroundColor: "var(--bg-deep)" }}
    >
      <SiteNav
        lang={lang}
        onToggleLang={() => setLang((value) => (value === "es" ? "en" : "es"))}
      />

      <HeroHome lang={lang} />

      <StatsBlock lang={lang} />

      {/* PROYECTOS — carousel preview, links to /portfolio for full grid */}
      <section
        id="proyectos"
        className="iso-section"
        style={{ backgroundColor: "var(--bg-deep)" }}
      >
        <div className="iso-section-inner">
          <span className="iso-eyebrow mb-5 inline-flex">
            {lang === "es" ? "PRODUCCIÓN" : "PRODUCTION"}
          </span>
          <SplitText
            text={lang === "es" ? "Proyectos en producción." : "Projects in production."}
            tag="h2"
            className="iso-h2 mt-2"
            style={{ maxWidth: "16ch" }}
            delay={30}
            duration={0.8}
            ease="power3.out"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            splitType="words"
            textAlign="left"
          />
          <p className="iso-body-lg mt-6" style={{ maxWidth: "560px" }}>
            {lang === "es"
              ? "Sistemas reales con usuarios reales y métricas en producción. Hacé click para ver el caso completo."
              : "Real systems with real users and production metrics. Click any card to see the full case."}
          </p>
        </div>

        <div className="mt-14">
          <ProjectsCarousel lang={lang} />
        </div>

        <div className="iso-section-inner mt-10">
          <Link
            href="/portfolio"
            className="iso-cta-link"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "transform var(--dur) var(--ease-in-out), color var(--dur) var(--ease-in-out)",
            }}
          >
            {lang === "es" ? "Ver todos los proyectos" : "View all projects"} →
          </Link>
        </div>
      </section>

      <BoatyShowcase lang={lang} />

      <ServicesStack lang={lang} />

      <ProcessSteps lang={lang} />

      <ManifestoSection lang={lang} />

      <ContactSection lang={lang} />

      <SiteFooter lang={lang} />

      <style jsx>{`
        .iso-cta-link:hover {
          color: var(--accent-hi) !important;
          transform: translateX(2px);
        }
      `}</style>
    </main>
  );
}
