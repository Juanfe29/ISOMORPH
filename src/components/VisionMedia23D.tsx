"use client";

import React, { useEffect, useState } from 'react';

export default function VisionMedia23D() {
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

    const segments = [
        { id: 'A', color: '#2a6b8c', y: '20%', translateZ: '40px' },
        { id: 'B', color: '#4a9aba', y: '50%', translateZ: '0px' },
        { id: 'C', color: '#2a4a6a', y: '80%', translateZ: '-40px' },
    ];

    // Generate emails flowing
    const emails = Array.from({ length: 8 }).map((_, i) => {
        const segIdx = i % 3;
        const offset = i * 0.8;
        const progress = ((elapsed + offset) % 3) / 3; // 0 to 1
        return {
            id: i,
            segIdx,
            progress,
            x: 20 + (progress * 60) // 20% to 80% left
        };
    });

    return (
        <div className="w-full h-full min-h-[250px] flex items-center justify-center relative perspective-1000 overflow-hidden bg-black/20 rounded-xl border border-white/5">
            {/* 3D Scene Container */}
            <div className="absolute inset-0 preserve-3d" style={{ transform: `rotateY(${Math.sin(elapsed * 0.5) * 5 - 10}deg) rotateX(5deg)` }}>

                {/* Source Node */}
                <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#4a9aba]/10 border border-[#4a9aba]/30 shadow-[0_0_20px_rgba(74,154,186,0.3)] flex items-center justify-center preserve-3d" style={{ transform: 'translateZ(0px)' }}>
                    <div className="text-[10px] text-[#4a9aba] uppercase tracking-widest font-bold font-mono text-center leading-tight">
                        CRM<br />DB
                    </div>
                </div>

                {/* Tubes / Paths */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" style={{ transform: 'translateZ(-10px)' }}>
                    {segments.map((seg, i) => (
                        <path
                            key={`path-${i}`}
                            d={`M 25% 50% C 45% 50%, 55% ${parseInt(seg.y as string)}%, 75% ${parseInt(seg.y as string)}%`}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            className="animate-[dash_20s_linear_infinite]"
                        />
                    ))}
                </svg>

                {/* Destination Segments */}
                {segments.map((seg, i) => (
                    <div
                        key={`seg-${i}`}
                        className="absolute left-[80%] -translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-black/50 border backdrop-blur-sm rounded-lg flex items-center justify-center preserve-3d transition-transform"
                        style={{
                            top: seg.y,
                            borderColor: `${seg.color}60`,
                            transform: `translateZ(${seg.translateZ})`,
                            boxShadow: `0 10px 20px -5px ${seg.color}30`
                        }}
                    >
                        <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: seg.color }}>
                            Segment {seg.id}
                        </div>
                    </div>
                ))}

                {/* Flowing Email Packets */}
                {emails.map(email => {
                    const targetY = parseInt(segments[email.segIdx].y as string);
                    // Ease-in-out curve for Y movement
                    const p = email.progress;
                    const easeP = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
                    const currentY = 50 + (targetY - 50) * easeP;

                    if (email.progress < 0.05 || email.progress > 0.95) return null;

                    return (
                        <div
                            key={`email-${email.id}`}
                            className="absolute top-0 left-0 w-6 h-4 border rounded-[2px] backdrop-blur-md flex items-center justify-center preserve-3d"
                            style={{
                                transform: `translate3d(${email.x}cqw, ${currentY}cqh, ${parseInt(segments[email.segIdx].translateZ) * easeP}px)`,
                                borderColor: segments[email.segIdx].color,
                                backgroundColor: `${segments[email.segIdx].color}20`,
                                boxShadow: `0 0 10px ${segments[email.segIdx].color}50`
                            }}
                        >
                            <div className="w-full h-px bg-current opacity-50 absolute top-1/2 -translate-y-1/2" style={{ color: segments[email.segIdx].color }} />
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
