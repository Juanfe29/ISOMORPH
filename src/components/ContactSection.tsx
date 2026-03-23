'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MeshBackground } from './GraphUIElements';
import { GraphButton } from './GraphUIElements';

export default function ContactSection() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Wire to your backend / Formspree / etc.
        setSubmitted(true);
    };

    const inputClass = "w-full bg-white/[0.04] border border-white/10 text-white/80 placeholder:text-white/25 font-sans text-sm px-4 py-3 outline-none focus:border-[#E8851A]/50 focus:bg-white/[0.06] transition-all duration-200";

    return (
        <section id="contact" className="relative w-full py-16 md:py-32 bg-black overflow-hidden">
            <MeshBackground />

            {/* Accent glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#E8851A]/[0.03] blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-12"
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono mb-6 block">Get In Touch</span>
                        <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white/90 mb-4">
                            Ready to <span className="text-glow text-accent italic">upgrade</span> your tech?
                        </h2>
                        <p className="text-white/40 font-sans text-base leading-relaxed">
                            Tell us about your business. We'll get back to you within 24 hours.
                        </p>
                    </motion.div>

                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 border border-white/10 bg-white/[0.02]"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#E8851A] mx-auto mb-6 shadow-[0_0_16px_rgba(232,133,26,0.6)]" />
                            <p className="text-white/70 font-display tracking-widest uppercase text-sm">Message received.</p>
                            <p className="text-white/30 font-sans text-xs mt-2">We'll be in touch shortly.</p>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            onSubmit={handleSubmit}
                            className="space-y-4 border border-white/8 bg-white/[0.02] p-8 md:p-10 relative"
                        >
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#E8851A]/30" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#E8851A]/30" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-display block mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Juan Felipe"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-display block mb-2">Company</label>
                                    <input
                                        type="text"
                                        placeholder="Acme Corp"
                                        value={form.company}
                                        onChange={e => setForm({ ...form, company: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-display block mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="you@company.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-display block mb-2">What do you need?</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tell us about your business and what's blocking your growth..."
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                            <div className="pt-2">
                                <GraphButton>
                                    SEND MESSAGE
                                </GraphButton>
                            </div>
                        </motion.form>
                    )}
                </div>
            </div>
        </section>
    );
}
