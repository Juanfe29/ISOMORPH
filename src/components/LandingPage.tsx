"use client";

import { Suspense, useState } from "react";
import HeroPortfolio from "./HeroPortfolio";
import ProjectsGrid from "./ProjectsGrid";
import ProcessSteps from "./ProcessSteps";
import FinalCTA from "./FinalCTA";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

interface LandingPageProps {
  initialLang?: "es" | "en";
}

export default function LandingPage({ initialLang = "es" }: LandingPageProps) {
  const [lang, setLang] = useState<"es" | "en">(initialLang);

  return (
    <main className="min-h-screen selection:bg-white/10" style={{ backgroundColor: "var(--bg-deep)" }}>
      <SiteNav lang={lang} onToggleLang={() => setLang((value) => (value === "es" ? "en" : "es"))} />

      <div id="top" />
      <HeroPortfolio lang={lang} workAnchor="#work" />

      <section id="work" className="w-full border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
        <div className="mx-auto w-full max-w-[var(--container)] px-6 py-20 md:px-8 md:py-28">
          <div className="max-w-3xl">
            <span className="iso-eyebrow mb-5 inline-flex">{lang === "es" ? "PROYECTOS" : "PROJECTS"}</span>
            <h2 className="iso-h2 max-w-2xl">
              {lang === "es" ? "Problemas reales," : "Real problems,"}
              <br />
              <em className="iso-grad">{lang === "es" ? "soluciones en producción." : "solutions in production."}</em>
            </h2>
            <p className="iso-body-lg mt-6 max-w-2xl">
              {lang === "es"
                ? "Cada caso aquí empezó como un problema de negocio concreto. Boaty usa screenshots reales del public/ y conserva el efecto 3D del teléfono y el computador en la galería del caso."
                : "Every case here started as a concrete business problem. Boaty uses real screenshots from public/ and keeps the 3D phone and computer effect in the case gallery."}
            </p>
          </div>

          <div className="mt-12">
            <Suspense fallback={<div className="iso-pg-grid" aria-hidden />}>
              <ProjectsGrid lang={lang} />
            </Suspense>
          </div>
        </div>
      </section>

      <ProcessSteps lang={lang} />
      <FinalCTA lang={lang} />
      <SiteFooter lang={lang} />
    </main>
  );
}
