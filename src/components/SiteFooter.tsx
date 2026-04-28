import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import IsomorphLogo from "./IsomorphLogo";

interface SiteFooterProps {
  lang: "es" | "en";
}

export default function SiteFooter({ lang }: SiteFooterProps) {
  return (
    <footer className="w-full border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-deep)" }}>
      <div className="mx-auto grid w-full max-w-[var(--container)] gap-10 px-6 py-12 md:grid-cols-3 md:items-center md:px-8 md:py-16">
        <div className="flex items-center gap-4">
          <IsomorphLogo size={30} dark />
          <div>
            <div className="font-display text-sm font-semibold tracking-[0.24em] uppercase" style={{ color: "var(--ink)" }}>
              ISOMORPH
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.22em]" style={{ color: "var(--ink-faint)" }}>
              {lang === "es" ? "ANTIGRAVITY ENGINE · PREDICT CONTROL" : "ANTIGRAVITY ENGINE · PREDICT CONTROL"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 text-xs uppercase tracking-[0.18em] md:justify-center">
          <Link href="#work" className="transition-colors duration-200" style={{ color: "var(--ink-soft)" }}>
            {lang === "es" ? "Proyectos" : "Projects"}
          </Link>
          <Link href="#contact" className="transition-colors duration-200" style={{ color: "var(--ink-soft)" }}>
            {lang === "es" ? "Contacto" : "Contact"}
          </Link>
          <Link href="/portfolio" className="transition-colors duration-200" style={{ color: "var(--ink-soft)" }}>
            Portfolio
          </Link>
        </div>

        <div className="flex items-center gap-3 md:justify-end">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border p-3 transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{ borderColor: "var(--border-hi)", color: "var(--ink-soft)" }}
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border p-3 transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{ borderColor: "var(--border-hi)", color: "var(--ink-soft)" }}
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="mailto:hello@isomorph.ai"
            className="rounded-full border p-3 transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{ borderColor: "var(--border-hi)", color: "var(--ink-soft)" }}
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
