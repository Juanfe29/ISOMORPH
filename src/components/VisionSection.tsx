'use client';

import { motion } from 'framer-motion';
import { Globe, Cpu, Building2, TrendingUp } from 'lucide-react';

export default function VisionSection() {
    return (
        <section className="relative w-full py-32 bg-black overflow-hidden border-t border-white/5">
            {/* Background elements */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-display mb-6 block">Our Vision</span>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium leading-tight tracking-tight mb-8 text-white/90">
                            Imaginamos una sociedad <span className="text-glow italic text-white">transformada</span> por la tecnología.
                        </h2>

                        <p className="text-lg md:text-2xl text-white/50 font-sans tracking-wide leading-relaxed mb-16">
                            Optimizamos recursos y convertimos a la inteligencia artificial en una aliada estratégica para el desarrollo.
                            Implementando infraestructura predictiva para <span className="text-white/80">pequeños, medianos y grandes negocios</span>.
                        </p>
                    </motion.div>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm"
                        >
                            <Building2 className="w-8 h-8 text-white/40 mb-6" />
                            <h3 className="text-xl font-display font-bold text-white mb-3">Escalabilidad</h3>
                            <p className="text-sm text-white/50 leading-relaxed font-sans">
                                Soluciones adaptables diseñadas para acoplarse a la realidad operativa de cualquier tamaño de empresa.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm"
                        >
                            <TrendingUp className="w-8 h-8 text-purple-400 mb-6" />
                            <h3 className="text-xl font-display font-bold text-white mb-3">Optimización</h3>
                            <p className="text-sm text-white/50 leading-relaxed font-sans">
                                Maximizamos la eficiencia de los recursos existentes mediante análisis predictivo y control automatizado.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Cpu className="w-8 h-8 text-blue-400 mb-6 relative z-10" />
                            <h3 className="text-xl font-display font-bold text-white mb-3 relative z-10">Desarrollo Aliado</h3>
                            <p className="text-sm text-white/50 leading-relaxed font-sans relative z-10">
                                La tecnología no como un gasto, sino como el motor principal de crecimiento e innovación sostenible.
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Subtle rotating globe background element */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.02] rounded-full pointer-events-none z-0"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full pointer-events-none z-0 border-dashed"
            />
        </section>
    );
}
