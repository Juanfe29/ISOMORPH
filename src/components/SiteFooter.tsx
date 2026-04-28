import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import IsomorphLogo from "./IsomorphLogo";

interface SiteFooterProps {
  lang: "es" | "en";
}

export default function SiteFooter({ lang }: SiteFooterProps) {
  return (
    <footer
      className="w-full relative overflow-hidden"
      style={{
        backgroundColor: "var(--bg-deep)",
        borderTop: "1px solid rgba(244,140,6,0.10)",
      }}
    >
      {/* Ember glow top */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "60%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(244,140,6,0.4), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        className="mx-auto grid w-full max-w-[var(--container)] gap-10 px-6 py-14 md:grid-cols-3 md:items-center md:px-8 md:py-16"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Brand */}
        <div className="flex items-center gap-4">
          <IsomorphLogo size={30} dark />
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
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
              }}>.</span>
            </div>
            <div
              style={{
                marginTop: "0.3rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
              }}
            >
              ANTIGRAVITY ENGINE · PREDICT CONTROL
            </div>
          </div>
        </div>

        {/* Nav */}
        <div
          className="flex flex-wrap gap-6 md:justify-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {[
            { href: "#proyectos", es: "Proyectos", en: "Projects" },
            { href: "#servicios", es: "Servicios", en: "Services" },
            { href: "#proceso", es: "Método", en: "Method" },
            { href: "/portfolio", es: "Portfolio", en: "Portfolio" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="footer-link"
              style={{ color: "var(--ink-mute)" }}
            >
              {lang === "es" ? l.es : l.en}
            </Link>
          ))}
        </div>

        {/* Socials */}
        <div className="flex items-center gap-3 md:justify-end">
          {[
            { href: "https://github.com", Icon: Github, label: "GitHub" },
            { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
            { href: "mailto:hello@isomorph.lat", Icon: Mail, label: "Email" },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target={label !== "Email" ? "_blank" : undefined}
              rel="noreferrer"
              className="social-icon rounded-full border p-3 transition-all duration-250"
              style={{ borderColor: "rgba(244,140,6,0.12)", color: "var(--ink-mute)" }}
              aria-label={label}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          borderTop: "1px solid rgba(244,140,6,0.06)",
          padding: "1rem 2rem",
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.58rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--ink-faint)",
        }}
      >
        © 2026 ISOMORPH AI · FORGED IN FIRE
      </div>

      <style jsx>{`
        .footer-link:hover { color: var(--accent) !important; }
        .social-icon:hover {
          border-color: rgba(244,140,6,0.4) !important;
          color: var(--accent) !important;
          box-shadow: 0 0 16px rgba(244,140,6,0.2);
        }
      `}</style>
    </footer>
  );
}
