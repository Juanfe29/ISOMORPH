'use client';

import { motion } from 'framer-motion';
import AntigravityScene from './AntigravityScene';
import IsomorphWordmark from './IsomorphWordmark';
import LiquidChrome from './LiquidChrome';

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
                <LiquidChrome
                    baseColor={[0.1, 0.1, 0.1]}
                    speed={1}
                    amplitude={0.6}
                    interactive={true}
                />
            </div>

            <div className="relative z-1">
                <AntigravityScene />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center justify-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="max-w-6xl mx-auto mt-10"
                >
                    <IsomorphWordmark
                        size="xl"
                        dark={true}
                        animated={true}
                        className="mb-8"
                        showSubtext={true}
                    />

                    <h2 className="text-2xl md:text-5xl font-display font-medium tracking-tight mb-8 text-white/80">
                        SYNTHESIZE <span className="text-glow">CHAOS</span>. PREDICT <span className="text-white/40">CONTROL</span>.
                    </h2>

                    <p className="text-base md:text-xl text-white/50 mb-12 max-w-3xl mx-auto font-sans tracking-wide leading-relaxed">
                        Unified Data Intelligence & AI Forecasting for Enterprise.
                        The infrastructure of the future, suspended in precision.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white text-black font-display font-bold text-sm tracking-widest uppercase"
                        >
                            SEE THE INFRASTRUCTURE
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                            className="px-8 py-4 border border-white/20 font-display font-bold text-sm tracking-widest uppercase backdrop-blur-sm"
                        >
                            OUR TECHNOLOGY
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce">
                <span className="text-[10px] uppercase tracking-[0.3em] font-display">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
        </section>
    );
}
