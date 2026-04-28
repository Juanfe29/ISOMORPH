"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import IsomorphLogo from "./IsomorphLogo";

interface SiteNavProps {
  lang: "es" | "en";
  onToggleLang?: () => void;
}

export default function SiteNav({ lang, onToggleLang }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(3,7,30,0.85)" : "rgba(3,7,30,0.0)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(244,140,6,0.10)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="mx-auto flex w-full max-w-[var(--container)] items-center justify-between gap-6 px-5 py-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <IsomorphLogo size={26} dark />
            <span
              className="hidden sm:inline-flex items-baseline gap-0.5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                color: "var(--ink)",
              }}
            >
              ISOMORPH
              <span style={{
                background: "var(--fire-hot)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}>.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {[
              { href: "#proyectos", es: "Proyectos", en: "Projects" },
              { href: "#servicios", es: "Servicios", en: "Services" },
              { href: "#proceso", es: "Método", en: "Method" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-sm transition-colors duration-200"
                style={{ color: "var(--ink-soft)", fontFamily: "var(--font-body)" }}
              >
                {lang === "es" ? link.es : link.en}
              </Link>
            ))}

            <button
              type="button"
              onClick={onToggleLang}
              className="rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition-all duration-200"
              style={{
                borderColor: "rgba(244,140,6,0.2)",
                color: "var(--ink-mute)",
                backgroundColor: "rgba(244,140,6,0.04)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {lang === "es" ? "EN" : "ES"}
            </button>

            <Link
              href="#contact"
              className="cta-nav rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300"
              style={{
                background: "var(--fire-hot)",
                color: "#03071e",
                fontFamily: "var(--font-body)",
              }}
            >
              {lang === "es" ? "Iniciar conversación" : "Start conversation"}
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-full border p-2"
              style={{ borderColor: "rgba(244,140,6,0.2)", color: "var(--ink)" }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-5 pb-6 pt-2 flex flex-col gap-4"
            style={{ borderTop: "1px solid rgba(244,140,6,0.08)", backgroundColor: "rgba(3,7,30,0.96)" }}
          >
            {[
              { href: "#proyectos", es: "Proyectos", en: "Projects" },
              { href: "#servicios", es: "Servicios", en: "Services" },
              { href: "#proceso", es: "Método", en: "Method" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ color: "var(--ink-soft)", fontSize: "0.95rem", fontFamily: "var(--font-body)" }}
              >
                {lang === "es" ? link.es : link.en}
              </Link>
            ))}
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={onToggleLang}
                className="rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em]"
                style={{ borderColor: "rgba(244,140,6,0.2)", color: "var(--ink-mute)", fontFamily: "var(--font-mono)" }}
              >
                {lang === "es" ? "EN" : "ES"}
              </button>
              <Link
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-semibold"
                style={{ background: "var(--fire-hot)", color: "#03071e" }}
              >
                {lang === "es" ? "Iniciar conversación" : "Start conversation"}
              </Link>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        .nav-link:hover { color: var(--ink) !important; }
        .cta-nav:hover { filter: brightness(1.1); box-shadow: 0 4px 20px rgba(244,140,6,0.35); }
      `}</style>
    </>
  );
}
