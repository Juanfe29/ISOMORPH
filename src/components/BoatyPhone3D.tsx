"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function BoatyPhone3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);

    // Smooth trailing state for rotation
    const [currentX, setCurrentX] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || !isHovered) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            // Limit angles for realistic viewing
            setRotationY(x * 30);
            setRotationX(-y * 20);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', () => { setRotationX(0); setRotationY(0); setIsHovered(false); });
            container.addEventListener('mouseenter', () => setIsHovered(true));
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [isHovered]);

    // Smooth animation loop
    useEffect(() => {
        let animationFrameId: number;
        const updateRotation = () => {
            let targetY = rotationY;
            let targetX = rotationX;

            if (!isHovered) {
                const time = Date.now() * 0.0005;
                targetY = Math.sin(time) * 15 - 10; // Idle gentle rotation favoring one side
                targetX = Math.cos(time * 0.8) * 5 + 5;
            }

            setCurrentX(prev => prev + (targetX - prev) * 0.08);
            setCurrentY(prev => prev + (targetY - prev) * 0.08);

            animationFrameId = requestAnimationFrame(updateRotation);
        };
        updateRotation();
        return () => cancelAnimationFrame(animationFrameId);
    }, [rotationX, rotationY, isHovered]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full min-h-[600px] flex items-center justify-center relative perspective-1000"
            style={{ perspective: '1500px' }}
        >
            {/* Ambient Glow */}
            <div className="absolute w-[400px] h-[400px] bg-[#c8522a]/15 rounded-full blur-[100px] pointer-events-none transition-transform duration-500"
                style={{ transform: `translate3d(${currentY}px, ${-currentX}px, -200px)` }} />

            {/* 3D Phone Object */}
            <div
                className="relative w-[280px] h-[580px] preserve-3d"
                style={{
                    transform: `rotateX(${currentX}deg) rotateY(${currentY}deg) rotateZ(0deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* 1. Phone Frame/Bezel (Depth Simulation) */}
                <div
                    className="absolute inset-0 rounded-[44px] bg-gradient-to-br from-zinc-600 via-zinc-800 to-black shadow-2xl"
                    style={{
                        transform: 'translateZ(-8px)',
                        boxShadow: `
                            ${-currentY}px ${currentX}px 40px rgba(0,0,0,0.8),
                            inset 0 0 4px rgba(255,255,255,0.2)
                        `
                    }}
                />
                {/* Sides connecting front and back for solid look */}
                <div className="absolute inset-0 rounded-[44px] bg-[#1a1c23] border-[6px] border-zinc-700/80" style={{ transform: 'translateZ(-4px)' }} />

                {/* 2. Back of Phone */}
                <div
                    className="absolute inset-0 rounded-[44px] bg-gradient-to-tr from-[#0a0a0c] to-[#16181d] border border-white/10 overflow-hidden"
                    style={{
                        transform: 'translateZ(-9px) rotateY(180deg)',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    {/* Back glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0" style={{ transform: `translate(${currentY}%, ${-currentX}%)` }} />

                    {/* Camera Island */}
                    <div className="absolute top-8 left-6 w-20 h-24 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-xl flex flex-col justify-center items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black border-[2px] border-zinc-700 shadow-inner flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-blue-900/50 blur-[1px]"></div></div>
                        <div className="w-8 h-8 rounded-full bg-black border-[2px] border-zinc-700 shadow-inner flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-blue-900/50 blur-[1px]"></div></div>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-100 shadow-[0_0_8px_#fff]"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 font-bold tracking-[0.3em] text-lg">
                        BOATY
                    </div>
                </div>

                {/* 3. Front Screen Assembly */}
                <div
                    className="absolute inset-0 rounded-[44px] bg-black border-[8px] border-black overflow-hidden flex flex-col items-center"
                    style={{
                        transform: 'translateZ(1px)',
                        backfaceVisibility: 'hidden',
                        boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05)'
                    }}
                >
                    {/* Screen Glare (moves opposite to rotation) */}
                    <div
                        className="absolute inset-[-50%] bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-50 transition-transform mix-blend-overlay"
                        style={{
                            transform: `rotate(-45deg) translate(${currentY * 3}%, ${currentX * 3}%)`
                        }}
                    />

                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-[22px] bg-black rounded-full z-40 flex justify-between items-center px-3 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                        <div className="w-2 h-2 rounded-full bg-green-500/80 shadow-[0_0_4px_#22c55e]"></div>
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    </div>

                    {/* Status Bar */}
                    <div className="absolute top-0 w-full px-6 pt-3 flex justify-between items-center text-[10px] text-white/90 z-30 font-semibold tracking-wider">
                        <span>9:41</span>
                        <div className="flex gap-1 items-center">
                            <span className="text-[8px]">5G</span>
                            <div className="w-4 h-2.5 border border-white/50 rounded-[2px] p-[1px]"><div className="bg-white h-full w-2/3 rounded-[1px]"></div></div>
                        </div>
                    </div>

                    {/* --- APP UI (BOATY) --- */}
                    <div className="w-full h-full bg-[#050914] relative flex flex-col">

                        {/* Map Area (Takes top half) */}
                        <div className="relative h-[280px] w-full preserve-3d">
                            {/* Fake Google Maps Dark Mode Image/Gradient */}
                            <div className="absolute inset-0 bg-[#0c1220] overflow-hidden">
                                {/* Water */}
                                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1e3a8a 0%, #050914 80%)' }}></div>
                                {/* Coastline */}
                                <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0,80 Q25,85 50,70 T100,50 L100,0 L0,0 Z" fill="#111827" />
                                </svg>
                            </div>

                            {/* Layered Map Marker (3D elevated!) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-transform preserve-3d" style={{ transform: `translateZ(${isHovered ? '25px' : '5px'})` }}>
                                {/* Pulse */}
                                <div className="absolute -inset-4 bg-[#c8522a]/30 rounded-full animate-ping"></div>
                                {/* Pin */}
                                <div className="w-10 h-10 bg-[#c8522a] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                    <div className="text-white text-lg">🛳️</div>
                                </div>
                                {/* Line connecting to map */}
                                <div className="absolute top-[38px] left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-white to-transparent" style={{ transform: 'rotateX(90deg)', transformOrigin: 'top' }}></div>
                            </div>

                            {/* Nearby Boats */}
                            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full border border-white shadow-[0_0_10px_#60a5fa] preserve-3d" style={{ transform: `translateZ(${isHovered ? '10px' : '2px'})` }}></div>
                            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full border border-white shadow-[0_0_10px_#60a5fa] preserve-3d" style={{ transform: `translateZ(${isHovered ? '15px' : '2px'})` }}></div>
                        </div>

                        {/* Bottom UI Sheet */}
                        <div className="flex-1 bg-[#0a0f1d] rounded-t-3xl -mt-6 z-30 relative border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex flex-col p-5 preserve-3d"
                            style={{ transform: `translateZ(${isHovered ? '10px' : '0px'})` }}>
                            {/* Pull Handle */}
                            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>

                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">AURA 45 Luxury</h3>
                                    <p className="text-white/50 text-xs">Miami Beach Marina · 1.2 mi</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[#c8522a] font-bold text-xl">$450</div>
                                    <div className="text-white/40 text-[9px] uppercase tracking-wider">Per Hour</div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="flex gap-2 mb-4">
                                <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] text-white/70">12 Guests</div>
                                <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] text-white/70">Captain</div>
                                <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] text-white/70">Jet Ski</div>
                            </div>

                            {/* Request Button */}
                            <button className="w-full py-3.5 bg-gradient-to-r from-[#c8522a] to-[#d9663a] rounded-xl text-white font-bold text-sm shadow-[0_5px_15px_rgba(200,82,42,0.4)] mt-auto transition-transform hover:scale-[1.02] active:scale-95">
                                Request Booking
                            </button>

                        </div>

                        {/* Bottom Navigation Bar */}
                        <div className="h-16 bg-[#03050a]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-4 z-40 relative pb-2 preserve-3d" style={{ transform: `translateZ(${isHovered ? '20px' : '5px'})` }}>
                            <div className="flex flex-col items-center gap-1 opacity-100">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8522a" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </div>
                            <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/20"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
