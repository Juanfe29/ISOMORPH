"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface FinalCTAProps {
    lang: "es" | "en";
    href?: string;
}

export default function FinalCTA({ lang, href = "#contact" }: FinalCTAProps) {
    const reduce = useReducedMotion();

    return (
        <section
            id="contact"
            className="iso-section"
            style={{ backgroundColor: "var(--bg-deep)" }}
        >
            <div className="iso-section-inner">
                <motion.div
                    className="iso-final-cta"
                    initial={{ opacity: 0, y: reduce ? 0 : 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: reduce ? 0.2 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2 className="iso-h2">
                        {lang === "es" ? "¿Tu negocio es el próximo? " : "Is your business next? "}
                        <br />
                        <em className="iso-grad">
                            {lang === "es" ? "Cuéntanos tu problema." : "Tell us your problem."}
                        </em>
                    </h2>

                    <p className="iso-final-cta-sub">
                        {lang === "es"
                            ? "Trabajamos con empresas que tienen una base de clientes establecida y necesitan que su tecnología esté a la altura."
                            : "We work with companies that have an established customer base and need their technology to match."}
                    </p>

                    <Link href={href} className="iso-final-cta-btn">
                        {lang === "es" ? "Iniciar conversación" : "Start conversation"}
                        <ArrowRight size={16} strokeWidth={2} />
                    </Link>

                    <span className="iso-final-cta-foot">
                        {lang === "es" ? "Respondemos en 24h" : "We reply within 24h"}
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
