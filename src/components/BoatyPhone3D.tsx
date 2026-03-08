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
            // Calculate mouse position relative to center of the component (-1 to 1)
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            // Map to rotation degrees (tilt slightly based on mouse)
            // Max rotation: 25deg Y (left/right), 15deg X (up/down)
            setRotationY(x * 25);
            setRotationX(-y * 15);
        };

        const handleMouseLeave = () => {
            // Return to resting position
            setRotationX(0);
            setRotationY(0);
            setIsHovered(false);
        };

        const handleMouseEnter = () => {
            setIsHovered(true);
        };

        const container = containerRef.current;
        if (container) {
            window.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);
            container.addEventListener('mouseenter', handleMouseEnter);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (container) {
                container.removeEventListener('mouseleave', handleMouseLeave);
                container.removeEventListener('mouseenter', handleMouseEnter);
            }
        };
    }, [isHovered]);

    // Smooth animation loop using requestAnimationFrame
    useEffect(() => {
        let animationFrameId: number;

        const updateRotation = () => {
            // Base auto-rotation if not hovered
            let targetY = rotationY;
            let targetX = rotationX;

            if (!isHovered) {
                const time = Date.now() * 0.001;
                targetY = Math.sin(time * 0.5) * 15; // Gentle sway
                targetX = Math.cos(time * 0.3) * 5;
            }

            // Interpolate (lerp) towards target for smoothness
            setCurrentX(prev => prev + (targetX - prev) * 0.1);
            setCurrentY(prev => prev + (targetY - prev) * 0.1);

            animationFrameId = requestAnimationFrame(updateRotation);
        };

        updateRotation();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [rotationX, rotationY, isHovered]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full min-h-[500px] flex items-center justify-center relative perspective-1000"
            style={{ perspective: '1200px' }}
        >
            {/* Ambient Glow */}
            <div className="absolute w-[350px] h-[350px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"
                style={{
                    transform: `translate3d(${currentY * 0.5}px, ${-currentX * 0.5}px, -100px)`
                }}
            />

            {/* 3D Phone Object */}
            <div
                className="relative w-[240px] h-[500px] preserve-3d transition-transform duration-75 ease-out"
                style={{
                    transform: `rotateX(${currentX}deg) rotateY(${currentY}deg) rotateZ(-2deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Phone Body (Side Edges) - Simulated via multiple layers or box-shadow for simple 3D */}
                <div
                    className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-zinc-800 to-black border-4 border-zinc-700/50 shadow-2xl"
                    style={{
                        transform: 'translateZ(-10px)',
                        boxShadow: '10px 20px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05)'
                    }}
                />

                {/* Back of Phone */}
                <div
                    className="absolute inset-0 rounded-[36px] bg-[#08090a] border border-white/5 opacity-80"
                    style={{
                        transform: 'translateZ(-20px) rotateY(180deg)',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    {/* Camera Bump */}
                    <div className="absolute top-6 left-6 w-12 h-16 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md flex flex-col justify-around items-center py-2">
                        <div className="w-4 h-4 rounded-full bg-black border border-white/20 shadow-inner"></div>
                        <div className="w-4 h-4 rounded-full bg-black border border-white/20 shadow-inner"></div>
                    </div>
                    {/* Boaty Logo Back */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 font-bold tracking-[0.2em] text-sm">
                        BOATY
                    </div>
                </div>

                {/* Front Screen */}
                <div
                    className="absolute inset-0 rounded-[36px] bg-black overflow-hidden border border-white/10 flex flex-col"
                    style={{
                        transform: 'translateZ(1px)',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    {/* Screen Glare */}
                    <div className="absolute top-0 left-0 w-[150%] h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent -rotate-45 pointer-events-none" style={{ transform: 'translateY(-20%) translateX(-20%)' }} />

                    {/* Dynamic Notch/Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20 border border-white/5" />

                    {/* App UI Implementation */}
                    <div className="relative z-10 p-5 pt-12 flex flex-col h-full bg-[#0a0c10]">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <div className="text-[10px] text-white/40 tracking-wider mb-1">GOOD MORNING</div>
                                <div className="text-sm font-semibold text-white">Guest</div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500/80 to-blue-500/50 border border-white/10" />
                        </div>

                        {/* Interactive Map Area (Pseudo-3D layered) */}
                        <div className="relative h-32 w-full rounded-2xl bg-[#060810] border border-white/10 overflow-hidden mb-5 preserve-3d"
                            style={{ transform: `translateZ(${isHovered ? '15px' : '5px'})`, transition: 'transform 0.3s ease' }}>
                            {/* Map Grid Pattern */}
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                            {/* User Location Pulse */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)] z-10">
                                <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                            </div>

                            {/* Boats (Animated) */}
                            <div className="absolute top-1/4 left-1/3 text-md animate-pulse">🛥️</div>
                            <div className="absolute bottom-1/4 right-1/4 text-sm animate-bounce" style={{ animationDuration: '3s' }}>⛵</div>
                        </div>

                        <div className="text-[10px] text-white/40 tracking-widest uppercase mb-3">Available Near You</div>

                        {/* Scrollable list (static visually) */}
                        <div className="flex-1 space-y-3">
                            {[
                                { name: "AURA 45", price: "$250/hr", type: "y" },
                                { name: "SPEEDSTER", price: "$180/hr", type: "s" },
                                { name: "GHOST", price: "$400/hr", type: "v" }
                            ].map((boat, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 preserve-3d"
                                    style={{ transform: `translateZ(${isHovered ? (10 - idx * 2) + 'px' : '0px'})`, transition: 'transform 0.3s ease' }}>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${boat.type === 'y' ? 'bg-orange-500/10 border-orange-500/20' : boat.type === 's' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/5 border-white/10'} border`}>
                                        {boat.type === 'y' ? '🛥️' : boat.type === 's' ? '🚤' : '⛵'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-semibold text-white mb-0.5">{boat.name}</div>
                                        <div className="text-[10px] text-orange-400">{boat.price}</div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[8px] text-white/50">→</div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Nav */}
                        <div className="h-14 mt-4 mb-2 flex justify-around items-center border-t border-white/10 pt-2 preserve-3d" style={{ transform: 'translateZ(20px)' }}>
                            <div className="text-lg opacity-100">🧭</div>
                            <div className="text-lg opacity-30">📅</div>
                            <div className="text-lg opacity-30">👤</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
