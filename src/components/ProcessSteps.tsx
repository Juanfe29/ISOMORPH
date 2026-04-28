"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

interface ProcessStepsProps {
    lang: "es" | "en";
}

interface Step {
    num: string;
    weeks: { es: string; en: string };
    title: { es: string; en: string };
    desc: { es: string; en: string };
    deliverable: { es: string; en: string };
}

const STEPS: Step[] = [
    {
        num: "01",
        weeks: { es: "SEMANA 1-2", en: "WEEK 1-2" },
        title: { es: "Descubrimiento", en: "Discovery" },
        desc: {
            es: "Entendemos tu negocio. Mapeamos procesos, dolores y oportunidades antes de escribir una línea de código.",
            en: "We understand your business. We map processes, pains and opportunities before writing a line of code.",
        },
        deliverable: {
            es: "Diagnóstico técnico + propuesta de arquitectura",
            en: "Technical diagnosis + architecture proposal",
        },
    },
    {
        num: "02",
        weeks: { es: "SEMANA 3-4", en: "WEEK 3-4" },
        title: { es: "Diseño", en: "Design" },
        desc: {
            es: "Arquitectura del sistema, flujos críticos, prototipos validados con tus usuarios.",
            en: "System architecture, critical flows, prototypes validated with your users.",
        },
        deliverable: {
            es: "Specs técnicas + prototipos navegables",
            en: "Technical specs + navigable prototypes",
        },
    },
    {
        num: "03",
        weeks: { es: "SEMANA 5-12", en: "WEEK 5-12" },
        title: { es: "Construcción", en: "Build" },
        desc: {
            es: "Sprints de 2 semanas. Demo cada sprint. Tú validas, nosotros ajustamos. Sin sorpresas.",
            en: "2-week sprints. Demo each sprint. You validate, we adjust. No surprises.",
        },
        deliverable: {
            es: "Sistema en staging + iteraciones",
            en: "Staged system + iterations",
        },
    },
    {
        num: "04",
        weeks: { es: "SEMANA 13+", en: "WEEK 13+" },
        title: { es: "Lanzamiento", en: "Launch" },
        desc: {
            es: "Producción, monitoreo, escalamiento. Acompañamos hasta que el sistema vuela solo.",
            en: "Production, monitoring, scaling. We stay until the system flies on its own.",
        },
        deliverable: {
            es: "Sistema en producción + soporte",
            en: "Production system + support",
        },
    },
];

export default function ProcessSteps({ lang }: ProcessStepsProps) {
    const [active, setActive] = useState(0);
    const reduce = useReducedMotion();

    return (
        <section
            id="proceso"
            className="iso-section"
            style={{ backgroundColor: "var(--bg)" }}
        >
            <div className="iso-section-inner">
                <div className="iso-process">
                    <div className="iso-process-sticky">
                        <span className="iso-eyebrow mb-5 inline-flex">
                            {lang === "es" ? "NUESTRO PROCESO" : "OUR PROCESS"}
                        </span>
                        <h2 className="iso-h2 mt-2" style={{ maxWidth: "12ch" }}>
                            {lang === "es" ? "Cómo " : "How we "}
                            <em className="iso-grad">{lang === "es" ? "trabajamos." : "work."}</em>
                        </h2>
                        <p className="iso-body-lg mt-6" style={{ maxWidth: "440px" }}>
                            {lang === "es"
                                ? "Un proceso probado en cuatro fases — desde entender el problema hasta escalar la solución."
                                : "A proven four-phase process — from understanding the problem to scaling the solution."}
                        </p>
                    </div>

                    <div className="iso-process-steps">
                        {STEPS.map((step, i) => {
                            const isActive = i === active;
                            return (
                                <motion.button
                                    key={step.num}
                                    type="button"
                                    className={`iso-process-card ${isActive ? "iso-process-card-active" : ""}`}
                                    onClick={() => setActive(i)}
                                    initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{
                                        duration: reduce ? 0.2 : 0.7,
                                        delay: reduce ? 0 : i * 0.05,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                >
                                    <div className="iso-process-num">{step.num}</div>
                                    <div className="iso-process-week">{step.weeks[lang]}</div>
                                    <h3 className="iso-process-title">{step.title[lang]}</h3>
                                    <p className="iso-process-body">{step.desc[lang]}</p>
                                    <div className="iso-process-deliverable">
                                        {lang === "es" ? "Entregable" : "Deliverable"}
                                        <strong>{step.deliverable[lang]}</strong>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
