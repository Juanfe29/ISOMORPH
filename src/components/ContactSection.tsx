"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import SplitText from "./SplitText";

// 👉 Replace with your Formspree endpoint: https://formspree.io/f/YOUR_ID
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrernpeb";

interface ContactSectionProps {
  lang?: "es" | "en";
}

export default function ContactSection({ lang = "es" }: ContactSectionProps) {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });

  const t = {
    eyebrow: lang === "es" ? "CONTACTO" : "CONTACT",
    heading1: lang === "es" ? "¿Listo para " : "Ready to ",
    heading2: lang === "es" ? "encender tu stack?" : "ignite your stack?",
    sub: lang === "es"
      ? "Cuéntanos tu desafío. Te respondemos en menos de 24 horas con un plan claro."
      : "Tell us your challenge. We'll reply in under 24 hours with a clear plan.",
    name: lang === "es" ? "Nombre" : "Name",
    namePh: lang === "es" ? "Juan Felipe" : "John Smith",
    company: lang === "es" ? "Empresa" : "Company",
    companyPh: "Acme Corp",
    email: "Email",
    emailPh: "tu@empresa.com",
    message: lang === "es" ? "¿Qué necesitas?" : "What do you need?",
    messagePh: lang === "es"
      ? "Cuéntanos sobre tu negocio y qué está bloqueando tu crecimiento..."
      : "Tell us about your business and what's blocking growth...",
    send: lang === "es" ? "Iniciar conversación" : "Start conversation",
    sending: lang === "es" ? "Enviando..." : "Sending...",
    sent: lang === "es" ? "¡Mensaje recibido!" : "Message received!",
    sentSub: lang === "es" ? "Te respondemos en menos de 24h." : "We'll reply within 24h.",
    error: lang === "es"
      ? "Error al enviar. Escríbenos a hello@isomorph.lat"
      : "Send failed. Email us at hello@isomorph.lat",
    reply: lang === "es" ? "Respondemos en 24h" : "Reply within 24h",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, _subject: `[ISOMORPH] ${form.name} — ${form.company}` }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(3,7,30,0.6)",
    border: "1px solid rgba(244,140,6,0.15)",
    borderRadius: "8px",
    color: "var(--ink)",
    fontFamily: "var(--font-body)",
    fontSize: "0.92rem",
    padding: "0.8rem 1rem",
    outline: "none",
    transition: "border-color 220ms ease, background 220ms ease",
  };

  return (
    <section
      id="contact"
      className="iso-section"
      style={{ backgroundColor: "var(--bg-deep)" }}
    >
      {/* fire radial glow */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(157,2,8,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="iso-section-inner" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduce ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}
        >
          <span className="iso-eyebrow" style={{ display: "inline-flex", marginBottom: "1.5rem" }}>
            {t.eyebrow}
          </span>
          <SplitText
            text={`${t.heading1}${t.heading2}`}
            tag="h2"
            className="iso-h2"
            style={{ marginBottom: "1rem" }}
            delay={30}
            duration={0.8}
            ease="power3.out"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            splitType="words"
          />
          <p className="iso-body-lg" style={{ marginBottom: "3rem", color: "var(--ink-soft)" }}>
            {t.sub}
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduce ? 0.2 : 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            background: "linear-gradient(135deg, rgba(55,6,23,0.4) 0%, rgba(3,7,30,0.7) 100%)",
            border: "1px solid rgba(244,140,6,0.12)",
            borderRadius: "20px",
            padding: "clamp(1.5rem, 5vw, 3rem)",
            backdropFilter: "blur(12px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* corner accents */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: "2px solid rgba(232,93,4,0.4)", borderLeft: "2px solid rgba(232,93,4,0.4)", borderTopLeftRadius: 20 }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: "2px solid rgba(232,93,4,0.4)", borderRight: "2px solid rgba(232,93,4,0.4)", borderBottomRightRadius: 20 }} />

          {status === "sent" ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <CheckCircle size={48} style={{ color: "var(--fire-6)", margin: "0 auto 1rem" }} />
              <p className="iso-h3" style={{ marginBottom: "0.5rem" }}>{t.sent}</p>
              <p style={{ color: "var(--ink-soft)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{t.sentSub}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-mute)", display: "block", marginBottom: "0.5rem" }}>
                    {t.name}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.namePh}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={inputBase}
                    onFocus={e => { e.target.style.borderColor = "rgba(232,93,4,0.5)"; e.target.style.background = "rgba(3,7,30,0.8)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(244,140,6,0.15)"; e.target.style.background = "rgba(3,7,30,0.6)"; }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-mute)", display: "block", marginBottom: "0.5rem" }}>
                    {t.company}
                  </label>
                  <input
                    type="text"
                    placeholder={t.companyPh}
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    style={inputBase}
                    onFocus={e => { e.target.style.borderColor = "rgba(232,93,4,0.5)"; e.target.style.background = "rgba(3,7,30,0.8)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(244,140,6,0.15)"; e.target.style.background = "rgba(3,7,30,0.6)"; }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-mute)", display: "block", marginBottom: "0.5rem" }}>
                  {t.email}
                </label>
                <input
                  type="email"
                  required
                  placeholder={t.emailPh}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputBase}
                  onFocus={e => { e.target.style.borderColor = "rgba(232,93,4,0.5)"; e.target.style.background = "rgba(3,7,30,0.8)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(244,140,6,0.15)"; e.target.style.background = "rgba(3,7,30,0.6)"; }}
                />
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-mute)", display: "block", marginBottom: "0.5rem" }}>
                  {t.message}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={t.messagePh}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputBase, resize: "none" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(232,93,4,0.5)"; e.target.style.background = "rgba(3,7,30,0.8)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(244,140,6,0.15)"; e.target.style.background = "rgba(3,7,30,0.6)"; }}
                />
              </div>

              {status === "error" && (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#dc2f02", textAlign: "center" }}>
                  {t.error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  padding: "1rem 2rem",
                  background: status === "sending"
                    ? "rgba(208,0,0,0.4)"
                    : "linear-gradient(90deg, var(--fire-4) 0%, var(--fire-6) 100%)",
                  border: "none",
                  borderRadius: "50px",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                  transition: "transform 220ms ease, filter 220ms ease",
                  width: "100%",
                  boxShadow: "0 8px 32px rgba(208,0,0,0.35)",
                }}
                onMouseEnter={e => { if (status !== "sending") (e.target as HTMLButtonElement).style.filter = "brightness(1.1)"; }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.filter = ""; }}
              >
                {status === "sending" ? (
                  <><Loader2 size={16} className="animate-spin" /> {t.sending}</>
                ) : (
                  <>{t.send} <ArrowRight size={16} strokeWidth={2} /></>
                )}
              </button>

              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.12em", color: "var(--ink-mute)", textAlign: "center" }}>
                {t.reply}
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
