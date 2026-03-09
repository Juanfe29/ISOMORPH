'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DesktopSlide {
    type: 'video' | 'image';
    src: string;
    label: string;
    caption?: string;
}

interface BoatyDesktopSliderProps {
    slides: DesktopSlide[];
    accentColor?: string;
}

const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function BoatyDesktopSlider({
    slides,
    accentColor = '#c8522a',
}: BoatyDesktopSliderProps) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const goTo = (index: number) => {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
    };

    const prev = () => goTo(current === 0 ? slides.length - 1 : current - 1);
    const next = () => goTo(current === slides.length - 1 ? 0 : current + 1);

    const slide = slides[current];

    return (
        <div className="w-full flex flex-col items-center gap-4">

            {/* ── Laptop Frame ───────────────────────────────────────────── */}
            <div className="w-full max-w-[680px] relative">

                {/* Screen lid */}
                <div
                    className="relative rounded-t-[12px] rounded-b-[4px] bg-gradient-to-b from-zinc-700 to-zinc-800 p-[10px] pb-[18px]"
                    style={{
                        boxShadow: '0 -2px 0 rgba(255,255,255,0.08) inset, 0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
                    }}
                >
                    {/* Traffic lights */}
                    <div className="absolute top-[13px] left-[16px] flex gap-[6px] z-10">
                        <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]/80" />
                        <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]/80" />
                        <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]/80" />
                    </div>

                    {/* Slide label in top bar */}
                    <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-10">
                        <span className="text-[10px] text-white/55 font-mono tracking-widest uppercase">
                            {slide?.label || 'Preview'}
                        </span>
                    </div>

                    {/* Camera dot */}
                    <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-zinc-600 border border-zinc-500 z-20" />

                    {/* Screen */}
                    <div
                        className="relative rounded-[6px] overflow-hidden bg-zinc-950 mt-5"
                        style={{ aspectRatio: '16 / 10' }}
                    >
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={current}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
                                className="absolute inset-0"
                            >
                                {slide?.src ? (
                                    slide.type === 'video' ? (
                                        <video
                                            className="w-full h-full object-cover"
                                            src={slide.src}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={slide.src}
                                            alt={slide.label}
                                            className="w-full h-full object-cover object-top"
                                        />
                                    )
                                ) : (
                                    /* Placeholder when no media is loaded yet */
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-zinc-900">
                                        <div
                                            className="w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center"
                                            style={{ borderColor: `${accentColor}40` }}
                                        >
                                            <span className="text-2xl" style={{ color: `${accentColor}60` }}>▶</span>
                                        </div>
                                        <span className="text-white/20 text-xs font-mono tracking-widest uppercase">
                                            Add video / screenshot
                                        </span>
                                    </div>
                                )}

                                {/* Subtle screen glare */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06] pointer-events-none" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Arrow overlays on screen edges */}
                        {slides.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 transition-all backdrop-blur-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 transition-all backdrop-blur-sm"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Hinge */}
                <div className="w-full h-[4px] bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-none" />

                {/* Base / keyboard deck */}
                <div
                    className="w-full h-[18px] rounded-b-[8px] bg-gradient-to-b from-zinc-700 to-zinc-900"
                    style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}
                >
                    {/* Trackpad hint */}
                    <div className="mx-auto mt-[4px] w-[60px] h-[8px] rounded-sm bg-zinc-600/40 border border-zinc-500/20" />
                </div>
            </div>

            {/* ── Dots + Caption ─────────────────────────────────────────── */}
            {slides.length > 1 && (
                <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2 items-center">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className="rounded-full transition-all duration-300"
                                style={{
                                    width: i === current ? '20px' : '6px',
                                    height: '6px',
                                    backgroundColor: i === current ? accentColor : 'rgba(255,255,255,0.2)',
                                }}
                            />
                        ))}
                    </div>
                    {slide?.caption && (
                        <p className="text-[11px] text-white/55 font-mono tracking-wide">{slide.caption}</p>
                    )}
                </div>
            )}
        </div>
    );
}
