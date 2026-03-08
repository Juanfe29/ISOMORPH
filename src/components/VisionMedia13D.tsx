"use client";

import React, { useEffect, useState } from 'react';

export default function VisionMedia13D() {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        let animationFrameId: number;
        const startTime = Date.now();

        const animate = () => {
            setElapsed((Date.now() - startTime) / 1000);
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Create a pulsing effect for the AI Core
    const pulseScale = 1 + Math.sin(elapsed * 2) * 0.05;

    // Tokens flowing into the core
    const tokens = ['Caption', 'Strategy', 'Brand', 'Prompt', 'LLM'].map((word, i) => {
        const offset = i * 1.5;
        const progress = ((elapsed + offset) % 4) / 4; // 0 to 1
        return {
            id: i,
            word,
            progress,
            opacity: progress < 0.2 ? progress * 5 : progress > 0.8 ? (1 - progress) * 5 : 1
        };
    });

    return (
        <div className="w-full h-full min-h-[250px] flex items-center justify-center relative perspective-1000 overflow-hidden bg-black/20 rounded-xl border border-white/5">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c8522a]/5 to-transparent pointer-events-none" />

            {/* Left Side: Input Tokens */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 w-32 h-40 preserve-3d">
                {tokens.map((token) => (
                    <div
                        key={token.id}
                        className="absolute left-0 px-3 py-1 bg-[#c8522a]/10 border border-[#c8522a]/30 text-[#c8522a] text-[10px] font-mono whitespace-nowrap rounded font-bold transition-transform"
                        style={{
                            top: `${20 + (token.id * 15)}%`,
                            transform: `translate3d(${token.progress * 150}px, 0, ${token.progress * 50}px)`,
                            opacity: token.opacity * 0.7,
                            boxShadow: '0 0 10px rgba(200,82,42,0.2)'
                        }}
                    >
                        {token.word}
                    </div>
                ))}
            </div>

            {/* Center: AI Core Engine */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 preserve-3d z-10"
                style={{ transform: `scale(${pulseScale}) rotateY(${elapsed * 15}deg)` }}
            >
                {/* Core Rings */}
                <div className="absolute inset-0 rounded-full border border-[#c8522a]/40 shadow-[0_0_30px_rgba(200,82,42,0.4)]" style={{ transform: 'rotateX(70deg)' }} />
                <div className="absolute inset-0 rounded-full border border-[#c8522a]/40 shadow-[0_0_20px_rgba(200,82,42,0.4)]" style={{ transform: 'rotateY(70deg)' }} />

                {/* Core Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#c8522a] to-orange-400 shadow-[0_0_20px_#c8522a] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white opacity-80 blur-[2px]" />
                </div>
            </div>

            {/* Right Side: Output Cards (Instagram UI) */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 preserve-3d" style={{ transform: 'rotateY(-15deg)' }}>
                {/* Flow lines from core */}
                <svg className="absolute -left-32 top-1/2 -translate-y-1/2 w-32 h-48 opacity-30 pointer-events-none">
                    <path d="M 0 96 C 50 96, 50 20, 128 20" fill="none" stroke="#c8522a" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                    <path d="M 0 96 C 50 96, 50 96, 128 96" fill="none" stroke="#c8522a" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                    <path d="M 0 96 C 50 96, 50 176, 128 176" fill="none" stroke="#c8522a" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                </svg>

                {/* POST Card */}
                <div
                    className="absolute top-[5%] left-0 w-24 h-24 bg-[#0a0a0c] border border-white/10 rounded-md p-2 flex flex-col gap-2 preserve-3d transition-transform hover:translate-z-10 hover:border-[#c8522a]/50"
                    style={{ transform: `translateZ(${Math.sin(elapsed) * 10 + 20}px)`, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.8)' }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#c8522a] to-blue-500" />
                        <div className="h-1.5 w-12 bg-white/20 rounded" />
                    </div>
                    <div className="flex-1 bg-white/5 rounded border border-white/5 flex items-center justify-center text-[8px] text-white/30 tracking-widest">POST</div>
                </div>

                {/* STORY Card */}
                <div
                    className="absolute top-[40%] right-0 w-20 h-32 bg-[#0a0a0c] border border-white/10 rounded-md p-1.5 flex flex-col preserve-3d transition-transform hover:translate-z-10 hover:border-[#4fb3d4]/50"
                    style={{ transform: `translateZ(${Math.cos(elapsed * 1.2) * 10 + 30}px)`, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.8)' }}
                >
                    <div className="flex items-center gap-1.5 mb-1.5 p-0.5">
                        <div className="w-3 h-3 rounded-full border border-[#4fb3d4] p-[1px]"><div className="w-full h-full bg-[#4fb3d4]/40 rounded-full" /></div>
                        <div className="h-1 w-8 bg-white/20 rounded" />
                    </div>
                    <div className="flex-1 bg-gradient-to-b from-[#4fb3d4]/10 to-transparent rounded border border-white/5 flex items-end p-2 border-b-0 pb-1">
                        <div className="text-[7px] text-[#4fb3d4] tracking-widest">STORY</div>
                    </div>
                </div>

                {/* REEL Card */}
                <div
                    className="absolute bottom-[5%] left-[20%] w-16 h-28 bg-[#0a0a0c] border border-[#8a64c8]/30 rounded-md p-1 preserve-3d transition-transform hover:translate-z-10 hover:border-[#8a64c8]"
                    style={{ transform: `translateZ(${Math.sin(elapsed * 1.5) * 15 + 40}px)`, boxShadow: '0 20px 40px -10px rgba(138,100,200,0.2)' }}
                >
                    <div className="w-full h-full bg-[#8a64c8]/10 rounded border border-[#8a64c8]/20 flex flex-col justify-between p-1.5">
                        <div className="flex justify-between items-center">
                            <div className="h-1 w-6 bg-white/30 rounded" />
                        </div>
                        <div className="w-full">
                            <div className="h-1 w-2/3 bg-white/40 rounded mb-1" />
                            <div className="h-1 w-1/3 bg-white/20 rounded" />
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-[#8a64c8]">▶</div>
                </div>
            </div>
        </div>
    );
}
