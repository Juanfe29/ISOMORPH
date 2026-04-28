"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StatsBlockProps {
    lang: "es" | "en";
}

interface StatI18n {
    num: string;
    label: { es: string; en: string };
    desc: { es: string; en: string };
}

const STATS: StatI18n[] = [
    {
        num: "5+",
        label: { es: "Proyectos en producción", en: "Projects in production" },
        desc: {
            es: "No demos. Sistemas reales con usuarios reales y métricas en producción.",
            en: "No demos. Real systems with real users and production metrics.",
        },
    },
    {
        num: "100%",
        label: { es: "Desarrollo a la medida", en: "Custom development" },
        desc: {
            es: "Nunca usamos plantillas. Cada sistema se construye desde cero según las necesidades exactas del cliente.",
            en: "We never use templates. Every system is built from scratch around the client's exact requirements.",
        },
    },
    {
        num: "4",
        label: { es: "Categorías de producto", en: "Product verticals" },
        desc: {
            es: "AI, ML, Marketplaces y Fintech. Profundidad real en cada vertical.",
            en: "AI, ML, Marketplaces and Fintech. Real depth in every vertical.",
        },
    },
    {
        num: "Alta",
        label: { es: "Escalabilidad", en: "Scalability" },
        desc: {
            es: "Arquitectura preparada desde el día uno para crecer con el negocio.",
            en: "Architecture prepared from day one to grow with the business.",
        },
    },
];

const ROTATE_MS = 4500;
const TICK_MS = 50;

export default function StatsBlock({ lang }: StatsBlockProps) {
    const [active, setActive] = useState(0);
    const [progress, setProgress] = useState(0);
    const reduce = useReducedMotion();
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (reduce) return;
        const start = performance.now();
        tickRef.current = setInterval(() => {
            const elapsed = performance.now() - start;
            const pct = Math.min(elapsed / ROTATE_MS, 1);
            setProgress(pct);
            if (pct >= 1) {
                setActive((a) => (a + 1) % STATS.length);
            }
        }, TICK_MS);
        return () => {
            if (tickRef.current) clearInterval(tickRef.current);
        };
    }, [active, reduce]);

    const handleSelect = (idx: number) => {
        setActive(idx);
        setProgress(0);
    };

    return (
        <section
            id="stats"
            className="iso-section"
            style={{ backgroundColor: "var(--bg)" }}
        >
            <div className="iso-section-inner">
                <span className="iso-eyebrow mb-5 inline-flex">
                    {lang === "es" ? "QUIÉNES SOMOS" : "WHO WE ARE"}
                </span>
                <h2 className="iso-h2 mt-2" style={{ maxWidth: "20ch" }}>
                    {lang === "es" ? "Construimos software " : "We build the software "}
                    <em className="iso-grad">{lang === "es" ? "exacto" : "exactly"}</em>
                    {lang === "es" ? " que tu empresa necesita." : " your business needs."}
                </h2>
                <p className="iso-body-lg mt-6" style={{ maxWidth: "560px" }}>
                    {lang === "es"
                        ? "Sin plantillas. Sin atajos. Cada sistema empieza con un problema concreto y termina en producción."
                        : "No templates. No shortcuts. Every system starts with a concrete problem and ends in production."}
                </p>

                <div className="iso-stats mt-14">
                    <div className="iso-stats-list">
                        {STATS.map((stat, i) => {
                            const isActive = i === active;
                            return (
                                <button
                                    key={stat.num + i}
                                    onClick={() => handleSelect(i)}
                                    className={`iso-stat ${isActive ? "iso-stat-active" : ""}`}
                                    aria-pressed={isActive}
                                >
                                    <span className="iso-stat-num">{stat.num}</span>
                                    <span className="iso-stat-label">{stat.label[lang]}</span>
                                    {isActive && !reduce && (
                                        <span
                                            className="iso-stat-progress"
                                            style={{ width: `${progress * 100}%` }}
                                            aria-hidden
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="iso-stats-desc">
                        <span className="iso-stats-desc-eyebrow">
                            {STATS[active].label[lang]}
                        </span>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={active}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {STATS[active].desc[lang]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
