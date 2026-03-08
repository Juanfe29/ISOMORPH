'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import AntigravityScene from './AntigravityScene';
import IsomorphWordmark from './IsomorphWordmark';
import GraphLandscape from './GraphLandscape';

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
                <GraphLandscape />
            </div>

            <div className="relative z-1">
                <AntigravityScene />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center justify-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="max-w-6xl mx-auto mt-4 md:mt-10"
                >
                    <IsomorphWordmark
                        size="xl"
                        dark={true}
                        animated={true}
                        className="mb-6 md:mb-8"
                        showSubtext={true}
                    />

                    <h2 className="text-xl md:text-5xl font-display font-medium tracking-tight mb-6 md:mb-8 text-white/80 px-2">
                        OUR VISION: <span className="text-glow">REDEFINE</span> DIGITAL <span className="text-white/40">EVOLUTION</span>.
                    </h2>

                    <p className="text-sm md:text-xl text-white/50 mb-8 md:mb-12 max-w-3xl mx-auto font-sans tracking-wide leading-relaxed px-4">
                        We don't just build software. We craft intelligent, autonomous ecosystems.
                        Our mission is to push the boundaries of what's possible with AI, seamless data integration, and future-proof architectures.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
                        <Link href="/portfolio">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-black font-display font-bold text-sm tracking-widest uppercase cursor-pointer"
                            >
                                EXPLORE PORTFOLIO
                            </motion.button>
                        </Link>

                        <a href="#vision">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                className="px-8 py-4 border border-white/20 font-display font-bold text-sm tracking-widest uppercase backdrop-blur-sm cursor-pointer"
                            >
                                READ OUR VISION
                            </motion.button>
                        </a>
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
