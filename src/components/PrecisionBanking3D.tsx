"use client";

import React, { useEffect, useState } from 'react';

export default function PrecisionBanking3D() {
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

    // Generate static data points
    const points = Array.from({ length: 40 }).map((_, i) => {
        // Pseudo-random but deterministic distribution
        const x = ((Math.sin(i * 12.5) + 1) / 2) * 80 + 10; // 10% to 90%
        const y = ((Math.cos(i * 17.5) + 1) / 2) * 80 + 10;

        // Define a boundary line: y = x
        // If y > x, it's class 1 (Subscription), else class 0 (No Subscription)
        const isTarget = y > x + (Math.sin(x / 10) * 10 - 5);

        return {
            id: i, x, y, isTarget,
            size: (Math.sin(i * 5) + 1) * 2 + 2, // 2px to 6px
            delay: i * 0.1
        };
    });

    return (
        <div className="w-full h-full min-h-[250px] flex items-center justify-center relative perspective-1000 overflow-hidden bg-black/20 rounded-xl border border-white/5">

            {/* 3D Scene Container */}
            <div
                className="absolute inset-0 preserve-3d"
                style={{
                    // Slowly rotate the entire ML space to show 3D nature
                    transform: `rotateX(55deg) rotateZ(${elapsed * 2}deg) scale3d(1.2, 1.2, 1.2)`,
                    transformOrigin: 'center center'
                }}
            >
                {/* Decision Plane (XGBoost boundary simulation) */}
                <div
                    className="absolute inset-x-[-50%] inset-y-[-50%] bg-gradient-to-tr from-[#3a8ab8]/10 to-[#c8522a]/10 border border-white/10 rounded-full"
                    style={{ transform: 'translateZ(0px)', boxShadow: 'inset 0 0 50px rgba(255,255,255,0.05)' }}
                />

                {/* 3D Grid Lines */}
                <div
                    className="absolute inset-x-[-20%] inset-y-[-20%] opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        transform: 'translateZ(0px)'
                    }}
                />

                {/* Data Points */}
                <div className="absolute inset-0 w-full h-full">
                    {points.map(pt => {
                        const zOffset = pt.isTarget ? 30 : -30;
                        const floatAnim = Math.sin(elapsed * 2 + pt.delay) * 5;
                        const actualZ = zOffset + floatAnim;
                        const color = pt.isTarget ? '#50a050' : '#8a64c8';

                        return (
                            <div key={pt.id}>
                                {/* Projection Line */}
                                <div
                                    className="absolute w-px opacity-30 shadow-none preserve-3d"
                                    style={{
                                        left: `${pt.x}%`,
                                        top: `${pt.y}%`,
                                        height: `${Math.abs(actualZ)}px`,
                                        backgroundColor: color,
                                        transform: `translateZ(${actualZ > 0 ? 0 : actualZ}px) rotateX(90deg)`,
                                        transformOrigin: 'top'
                                    }}
                                />
                                {/* The Data Point */}
                                <div
                                    className="absolute rounded-full shadow-lg preserve-3d"
                                    style={{
                                        left: `${pt.x}%`,
                                        top: `${pt.y}%`,
                                        width: `${pt.size}px`,
                                        height: `${pt.size}px`,
                                        backgroundColor: color,
                                        transform: `translate3d(-50%, -50%, ${actualZ}px)`,
                                        boxShadow: `0 0 ${pt.size * 2}px ${color}`
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Boundary Line (Intersection of plane) */}
                <div
                    className="absolute w-[150%] h-[2px] bg-white/40 left-[-25%] top-[50%] preserve-3d"
                    style={{
                        transform: 'rotateZ(-45deg)',
                        boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                    }}
                />
            </div>

            {/* UI overlay */}
            <div className="absolute top-4 left-4 flex gap-4 text-[9px] font-mono opacity-60">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#50a050]" /> Subscription (+1)
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#8a64c8]" /> Refusal (0)
                </div>
            </div>

        </div>
    );
}
