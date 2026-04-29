"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Smartphone, Monitor, Lock } from "lucide-react";
import { projects } from "../data/projects";

interface BoatyShowcaseProps {
  lang: "es" | "en";
}

const MOBILE_SHOTS = [
  {
    src: "/5615f3b7-8bfb-421f-927e-dac42e655fe1.jpg",
    label: { es: "Splash", en: "Splash" },
    note: { es: "Identidad de marca", en: "Brand identity" },
  },
  {
    src: "/b71702ce-6867-48fe-a289-1cfeeb4fab7a.jpg",
    label: { es: "Onboarding", en: "Onboarding" },
    note: { es: "Marketplace bilateral", en: "Two-sided marketplace" },
  },
  {
    src: "/a693bdae-b84c-4085-865b-1c39c732cdf6.jpg",
    label: { es: "Explorar", en: "Explore" },
    note: { es: "Mapa con precios en vivo", en: "Live-pricing map" },
  },
  {
    src: "/3c4c92c2-7aa9-4b4d-96fd-6f2653cde1be.jpg",
    label: { es: "Detalle", en: "Detail" },
    note: { es: "Reserva con un toque", en: "One-tap booking" },
  },
];

type Device = "mobile" | "desktop";

export default function BoatyShowcase({ lang }: BoatyShowcaseProps) {
  const reduce = useReducedMotion();
  const [device, setDevice] = useState<Device>("mobile");
  const [shot, setShot] = useState(0);
  const [liveActive, setLiveActive] = useState(false);

  useEffect(() => {
    if (device !== "mobile" || reduce) return;
    const id = setInterval(
      () => setShot((s) => (s + 1) % MOBILE_SHOTS.length),
      3400,
    );
    return () => clearInterval(id);
  }, [device, reduce]);

  const boaty = projects.find((p) => p.slug === "boaty");
  if (!boaty) return null;

  const accent = boaty.accentColor;
  const current = MOBILE_SHOTS[shot];

  return (
    <section
      id="boaty-showcase"
      className="iso-section iso-boaty"
      style={
        {
          backgroundColor: "var(--bg)",
          ["--boaty-accent" as string]: accent,
        } as React.CSSProperties
      }
    >
      <div className="iso-section-inner">
        {/* Header bar */}
        <div className="iso-boaty-header">
          <span className="iso-eyebrow">
            {lang === "es"
              ? "01 — CASO DESTACADO · PRODUCTO PROPIO"
              : "01 — FEATURED CASE · OWN PRODUCT"}
          </span>

          <div className="iso-boaty-toggle" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={device === "mobile"}
              className={`iso-boaty-toggle-btn ${
                device === "mobile" ? "is-active" : ""
              }`}
              onClick={() => setDevice("mobile")}
            >
              <Smartphone size={13} strokeWidth={1.8} />
              <span>Mobile</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={device === "desktop"}
              className={`iso-boaty-toggle-btn ${
                device === "desktop" ? "is-active" : ""
              }`}
              onClick={() => setDevice("desktop")}
            >
              <Monitor size={13} strokeWidth={1.8} />
              <span>Desktop</span>
            </button>
            <span
              className="iso-boaty-toggle-pill"
              style={{
                transform:
                  device === "mobile" ? "translateX(0)" : "translateX(100%)",
              }}
            />
          </div>
        </div>

        {/* Two columns */}
        <div className="iso-boaty-grid">
          {/* LEFT — narrative */}
          <div className="iso-boaty-copy">
            <h2 className="iso-h2 iso-boaty-title">
              BOATY<span className="iso-boaty-title-dot">.</span>
            </h2>

            <p className="iso-boaty-problem">{boaty.problem[lang]}</p>

            <p className="iso-body-lg iso-boaty-desc">
              {boaty.description[lang]}
            </p>

            <ul className="iso-boaty-stack">
              {boaty.architecture[lang]
                .split(" · ")
                .slice(0, 5)
                .map((line, i) => (
                  <li key={i} className="iso-boaty-stack-item">
                    <span className="iso-boaty-stack-dot" />
                    {line}
                  </li>
                ))}
            </ul>

            <div className="iso-boaty-tags">
              {boaty.techTags.map((t) => (
                <span key={t} className="iso-boaty-tag">
                  {t}
                </span>
              ))}
            </div>

            <div className="iso-boaty-actions">
              {boaty.liveUrl && (
                <a
                  className="iso-boaty-cta iso-boaty-cta-primary"
                  href={boaty.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lang === "es" ? "Ver en vivo" : "View live"}
                  <ArrowUpRight size={16} strokeWidth={1.8} />
                </a>
              )}
              {boaty.githubUrl && (
                <a
                  className="iso-boaty-cta iso-boaty-cta-ghost"
                  href={boaty.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={15} strokeWidth={1.8} />
                  {lang === "es" ? "Repositorio" : "Repository"}
                </a>
              )}
            </div>
          </div>

          {/* RIGHT — device stage */}
          <div className="iso-boaty-stage">
            <div
              className="iso-boaty-glow"
              style={{ background: `radial-gradient(closest-side, ${accent}33, transparent 70%)` }}
            />

            <AnimatePresence mode="wait">
              {device === "mobile" ? (
                <motion.div
                  key="mobile"
                  className="iso-boaty-device"
                  initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -16, scale: reduce ? 1 : 0.97 }}
                  transition={{ duration: reduce ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* iPhone frame */}
                  <div className="iso-iphone">
                    <div className="iso-iphone-side iso-iphone-side-l" />
                    <div className="iso-iphone-side iso-iphone-side-r" />
                    <div className="iso-iphone-screen">
                      <div className="iso-iphone-notch" />
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={current.src}
                          src={current.src}
                          alt={current.label[lang]}
                          className="iso-iphone-img"
                          initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
                          transition={{ duration: reduce ? 0.15 : 0.55, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Caption + thumbs */}
                  <div className="iso-boaty-caption">
                    <span className="iso-boaty-caption-label">
                      {String(shot + 1).padStart(2, "0")} / {String(MOBILE_SHOTS.length).padStart(2, "0")}
                    </span>
                    <div className="iso-boaty-caption-text">
                      <strong>{current.label[lang]}</strong>
                      <span>{current.note[lang]}</span>
                    </div>
                  </div>

                  <div className="iso-boaty-thumbs">
                    {MOBILE_SHOTS.map((s, i) => (
                      <button
                        key={s.src}
                        type="button"
                        onClick={() => setShot(i)}
                        aria-label={s.label[lang]}
                        className={`iso-boaty-thumb ${i === shot ? "is-active" : ""}`}
                      >
                        <img src={s.src} alt="" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="desktop"
                  className="iso-boaty-device iso-boaty-device-desktop"
                  initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -16, scale: reduce ? 1 : 0.97 }}
                  transition={{ duration: reduce ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="iso-browser">
                    <div className="iso-browser-bar">
                      <div className="iso-browser-dots">
                        <span className="iso-browser-dot" style={{ background: "#ff5f57" }} />
                        <span className="iso-browser-dot" style={{ background: "#febc2e" }} />
                        <span className="iso-browser-dot" style={{ background: "#28c840" }} />
                      </div>
                      <div className="iso-browser-url">
                        <Lock size={11} strokeWidth={2} />
                        <span>boaty-production.up.railway.app</span>
                      </div>
                      <a
                        href={boaty.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="iso-browser-open"
                        aria-label="Abrir en nueva pestaña"
                      >
                        <ArrowUpRight size={13} strokeWidth={2} />
                      </a>
                    </div>
                    <div className="iso-browser-screen">
                      <video
                        src="/boaty-demo.mp4"
                        className="iso-browser-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                      {liveActive && (
                        <iframe
                          src={boaty.liveUrl}
                          title="Boaty live preview"
                          loading="lazy"
                          className="iso-browser-iframe"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        />
                      )}
                      {!liveActive && (
                        <button
                          type="button"
                          onClick={() => setLiveActive(true)}
                          className="iso-browser-play"
                          aria-label={lang === "es" ? "Cargar app en vivo" : "Load live app"}
                        >
                          <span className="iso-browser-play-pill">
                            <span className="iso-browser-play-dot" />
                            {lang === "es" ? "Cargar app en vivo" : "Load live app"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="iso-boaty-desktop-note">
                    {liveActive
                      ? lang === "es"
                        ? "Si no carga, abrí en pestaña nueva ↗"
                        : "If it doesn't load, open in new tab ↗"
                      : lang === "es"
                        ? "Demo en loop · click para activar la app en vivo"
                        : "Looping demo · click to load the live app"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
