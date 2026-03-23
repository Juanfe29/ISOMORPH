'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * GraphButton - A premium button with node-and-line hover effects
 */
export const GraphButton = ({
    children,
    onClick,
    className = "",
    variant = "primary",
    href
}: {
    children: React.ReactNode,
    onClick?: () => void,
    className?: string,
    variant?: "primary" | "outline",
    href?: string
}) => {
    const isPrimary = variant === "primary";
    const content = (
        <motion.div
            whileHover="hover"
            className={`relative group px-8 py-4 overflow-hidden transition-all duration-300 ${isPrimary ? 'bg-white text-black' : 'border border-white/20 text-white backdrop-blur-sm'} ${className}`}
        >
            {/* Corner Nodes */}
            <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-1 h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-1 h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Scanning Line Effect */}
            <motion.div
                variants={{
                    hover: { left: "100%", transition: { duration: 0.6, ease: "easeInOut" } }
                }}
                initial={{ left: "-10%" }}
                className="absolute top-0 bottom-0 w-[2px] bg-[#E8851A]/40 blur-[1px] pointer-events-none"
            />

            <span className="relative z-10 font-display font-bold text-sm tracking-widest uppercase">
                {children}
            </span>
        </motion.div>
    );

    if (href) {
        return <a href={href} className="inline-block">{content}</a>;
    }

    return (
        <button onClick={onClick} className="outline-none">
            {content}
        </button>
    );
};

/**
 * GraphCard - A container with topographic/node border accents
 */
export const GraphCard = ({
    children,
    className = "",
    delay = 0
}: {
    children: React.ReactNode,
    className?: string,
    delay?: number
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className={`relative p-8 glass group overflow-hidden ${className}`}
        >
            {/* Topographic Lines Background (SVG) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,20 Q25,15 50,25 T100,20" fill="none" stroke="white" strokeWidth="0.5" />
                    <path d="M0,40 Q30,35 60,45 T100,40" fill="none" stroke="white" strokeWidth="0.5" />
                    <path d="M0,60 Q20,65 50,55 T100,60" fill="none" stroke="white" strokeWidth="0.5" />
                    <path d="M0,80 Q40,75 70,85 T100,80" fill="none" stroke="white" strokeWidth="0.5" />
                </svg>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/15 group-hover:border-[#E8851A]/60 transition-colors duration-300" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/15 group-hover:border-[#E8851A]/60 transition-colors duration-300" />

            <div className="relative z-10 h-full flex flex-col">
                {children}
            </div>
        </motion.div>
    );
};

/**
 * GraphDivider - A section separator using the graph-line aesthetic
 */
export const GraphDivider = () => {
    return (
        <div className="w-full relative py-20 flex items-center justify-center">
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#E8851A]/15 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#E8851A]/70 border border-[#E8851A]/40 relative z-10 shadow-[0_0_12px_rgba(200,32,26,0.5)]" />
        </div>
    );
};

/**
 * MeshBackground - A subtle topographic mesh for section backgrounds
 */
export const MeshBackground = () => {
    return (
        <div className="absolute inset-0 pointer-events-none opacity-[0.045] overflow-hidden">
            <svg width="100%" height="100%" className="blur-[0.5px]">
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
                    <circle cx="0" cy="0" r="1.5" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
    );
};
