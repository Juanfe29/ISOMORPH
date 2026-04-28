"use client";

import { motion, useReducedMotion } from "framer-motion";
import AntigravityCanvas from "./AntigravityCanvas";

interface ManifestoSectionProps {
    lang: "es" | "en";
}

export default function ManifestoSection({ lang }: ManifestoSectionProps) {
    const reduce = useReducedMotion();

    return (
        <section
            id="manifiesto"
            className="iso-section"
            style={{ backgroundColor: "var(--bg-deep)" }}
        >
            <div className="iso-section-inner">
                <div className="iso-manifesto">
                    <motion.div
                        className="iso-manifesto-canvas"
                        initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: reduce ? 0.2 : 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <AntigravityCanvas />
                    </motion.div>

                    <div>
                        <span className="iso-eyebrow mb-5 inline-flex">
                            {lang === "es" ? "CÓMO PENSAMOS" : "HOW WE THINK"}
                        </span>
                        <h2 className="iso-h2 mt-2" style={{ maxWidth: "14ch" }}>
                            {lang === "es" ? "Sintetizamos caos. " : "We synthesise chaos. "}
                            <em className="iso-grad">
                                {lang === "es" ? "Predict control." : "Predict control."}
                            </em>
                        </h2>
                        <p className="iso-body-lg mt-6" style={{ maxWidth: "520px" }}>
                            {lang === "es"
                                ? "Cada proyecto empieza como un grafo de problemas — datos dispersos, decisiones manuales, procesos que no escalan. Lo descomponemos, mapeamos las conexiones críticas y diseñamos un sistema que vuela solo."
                                : "Every project starts as a graph of problems — scattered data, manual decisions, processes that don't scale. We break it down, map the critical connections and design a system that flies on its own."}
                        </p>
                        <p className="iso-body mt-4" style={{ maxWidth: "520px" }}>
                            {lang === "es"
                                ? "No vendemos demos ni promesas. Construimos infraestructura que se queda funcionando cuando nos vamos."
                                : "We don't sell demos or promises. We build infrastructure that keeps running after we're gone."}
                        </p>

                        <blockquote className="iso-manifesto-quote">
                            {lang === "es"
                                ? "Cada proyecto empieza como un grafo de problemas. Termina como un sistema en producción."
                                : "Every project starts as a graph of problems. It ends as a system in production."}
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>
    );
}
