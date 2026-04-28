"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import IsomorphLogo from "./IsomorphLogo";

interface SiteNavProps {
  lang: "es" | "en";
  onToggleLang?: () => void;
}

export default function SiteNav({ lang, onToggleLang }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl" : "backdrop-blur-0"
      }`}
      style={{
        backgroundColor: scrolled ? "rgba(10,10,10,0.72)" : "rgba(10,10,10,0.02)",
        borderColor: scrolled ? "var(--border)" : "transparent",
      }}
    >
      <div className="mx-auto flex w-full max-w-[var(--container)] items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <IsomorphLogo size={26} dark />
          <span
            className="hidden sm:inline-flex items-baseline gap-1 font-display text-sm font-semibold tracking-[0.22em] uppercase"
            style={{ color: "var(--ink)" }}
          >
            ISOMORPH <span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#work" className="text-sm transition-colors duration-200" style={{ color: "var(--ink-soft)" }}>
            {lang === "es" ? "Proyectos" : "Projects"}
          </Link>
          <Link href="#contact" className="text-sm transition-colors duration-200" style={{ color: "var(--ink-soft)" }}>
            {lang === "es" ? "Contacto" : "Contact"}
          </Link>
          <button
            type="button"
            onClick={onToggleLang}
            className="rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition-all duration-200"
            style={{
              borderColor: "var(--border-hi)",
              color: "var(--ink)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <Link
            href="#contact"
            className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--bg-deep)",
            }}
          >
            {lang === "es" ? "Iniciar conversación" : "Start conversation"}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {onToggleLang ? (
            <button
              type="button"
              onClick={onToggleLang}
              className="rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]"
              style={{ borderColor: "var(--border-hi)", color: "var(--ink)" }}
            >
              {lang === "es" ? "EN" : "ES"}
            </button>
          ) : null}
          <Link
            href="#work"
            className="rounded-full border p-2"
            style={{ borderColor: "var(--border-hi)", color: "var(--ink)" }}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
