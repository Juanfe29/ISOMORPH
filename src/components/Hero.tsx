'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import IsomorphWordmark from './IsomorphWordmark';
import { GraphButton } from './GraphUIElements';

export default function Hero() {
    const vantaRef = useRef<HTMLDivElement>(null);
    const vantaEffect = useRef<any>(null);

    useEffect(() => {
        if (vantaEffect.current || !vantaRef.current) return;

        import('vanta/dist/vanta.clouds.min').then((mod) => {
            const CLOUDS = mod.default ?? mod;
            vantaEffect.current = CLOUDS({
                el: vantaRef.current,
                THREE: (window as any).THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200,
                minWidth: 200,
                skyColor: 0x434343,
                cloudColor: 0x878787,
                cloudShadowColor: 0x3e3e3e,
                sunColor: 0xe37829,
                sunGlareColor: 0xa3e8a0,
                sunlightColor: 0xe3773d,
                speed: 2.0,
            });
        });

        return () => {
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };
    }, []);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Vanta BIRDS background */}
            <div ref={vantaRef} className="absolute inset-0 z-0" />

            {/* Text content */}
            <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center justify-center">
                <div className="max-w-6xl mx-auto mt-4 md:mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                    >
                        <IsomorphWordmark
                            size="xl"
                            dark={true}
                            animated={true}
                            className="mb-6 md:mb-8"
                            showSubtext={true}
                        />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
                        className="text-xl md:text-5xl font-display font-medium tracking-tight mb-6 md:mb-8 text-white/80 px-2"
                    >
                        WE BUILD SOFTWARE AT THE <span className="text-glow text-accent">SPEED OF AI</span>.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.55 }}
                        className="text-sm md:text-xl text-white/45 mb-8 md:mb-12 max-w-3xl mx-auto font-sans tracking-wide leading-relaxed px-4"
                    >
                        From SaaS products to legacy system overhauls — we use AI coding agents and deep engineering expertise to help businesses ship faster, modernize smarter, and scale with confidence.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.75 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4"
                    >
                        <GraphButton href="/portfolio">
                            SEE OUR PRODUCTS
                        </GraphButton>

                        <GraphButton variant="outline" href="#contact">
                            WORK WITH US
                        </GraphButton>
                    </motion.div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
            >
                <span className="text-[9px] uppercase tracking-[0.4em] font-display text-[#E8851A]/40">Scroll to Explore</span>
                <div className="w-[1px] h-10 bg-gradient-to-b from-[#E8851A]/30 to-transparent" />
            </motion.div>
        </section>
    );
}
