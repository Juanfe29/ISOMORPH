"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code, Bot, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServicesStackProps {
    lang: "es" | "en";
}

interface Service {
    title: { es: string; en: string };
    desc: { es: string; en: string };
    accent: string;
    Icon: LucideIcon;
}

const SERVICES: Service[] = [
    {
        title: { es: "Software a la medida", en: "Custom software" },
        desc: {
            es: "Desarrollo empresarial sin plantillas. Arquitectura desde cero, ingeniería de alto nivel.",
            en: "Enterprise development without templates. Architecture from scratch, high-end engineering.",
        },
        accent: "#c8522a",
        Icon: Code,
    },
    {
        title: { es: "Agentes de IA", en: "AI agents" },
        desc: {
            es: "Sistemas autónomos que automatizan procesos críticos del negocio sin perder el toque humano.",
            en: "Autonomous systems that automate critical business processes without losing the human touch.",
        },
        accent: "#e8851a",
        Icon: Bot,
    },
    {
        title: { es: "Construido contigo", en: "Built with you" },
        desc: {
            es: "Desde la primera reunión hasta el lanzamiento, trabajamos como tu equipo de ingeniería externo.",
            en: "From the first meeting to launch, we work as your external engineering team.",
        },
        accent: "#ffa050",
        Icon: Users,
    },
];

export default function ServicesStack({ lang }: ServicesStackProps) {
    const reduce = useReducedMotion();

    return (
        <section
            id="servicios"
            className="iso-section"
            style={{ backgroundColor: "var(--bg-deep)" }}
        >
            <div className="iso-section-inner">
                <div className="iso-services">
                    <div>
                        <span className="iso-eyebrow mb-5 inline-flex">
                            {lang === "es" ? "SERVICIOS" : "SERVICES"}
                        </span>
                        <h2 className="iso-h2 mt-2" style={{ maxWidth: "14ch" }}>
                            {lang === "es" ? "Problemas reales, " : "Real problems, "}
                            <em className="iso-grad">
                                {lang === "es" ? "soluciones exactas." : "exact solutions."}
                            </em>
                        </h2>
                        <p className="iso-body-lg mt-6" style={{ maxWidth: "440px" }}>
                            {lang === "es"
                                ? "Tres líneas de trabajo, una sola disciplina: ingeniería rigurosa al servicio del negocio."
                                : "Three lines of work, one discipline: rigorous engineering at the service of business."}
                        </p>
                    </div>

                    <div className="iso-services-stack">
                        {SERVICES.map((s, i) => {
                            const Icon = s.Icon;
                            return (
                                <motion.div
                                    key={s.title.en}
                                    className="iso-service-card"
                                    style={{ ["--service-accent" as string]: s.accent }}
                                    initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.4 }}
                                    transition={{
                                        duration: reduce ? 0.2 : 0.7,
                                        delay: reduce ? 0 : i * 0.08,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                >
                                    <span className="iso-service-icon">
                                        <Icon size={20} strokeWidth={1.6} />
                                    </span>
                                    <h3 className="iso-service-title">{s.title[lang]}</h3>
                                    <p className="iso-service-body">{s.desc[lang]}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
