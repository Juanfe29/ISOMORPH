'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Share2, Layers, Sparkles, Instagram, Twitter, Linkedin, Youtube, Fingerprint, Type, Image as ImageIcon, Video } from 'lucide-react';

// Content types being generated
const CONTENT_TYPES = [
    { id: 'copy', icon: Type, label: 'Persuasive Copy', color: 'text-blue-400' },
    { id: 'image', icon: ImageIcon, label: 'Visual Assets', color: 'text-purple-400' },
    { id: 'video', icon: Video, label: 'Short-form Video', color: 'text-emerald-400' },
];

// Target channels for deployment
const CHANNELS = [
    { id: 'ig', icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
    { id: 'tw', icon: Twitter, label: 'X (Twitter)', color: 'text-sky-400' },
    { id: 'in', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-600' },
    { id: 'yt', icon: Youtube, label: 'YouTube Shorts', color: 'text-red-500' },
];

// Simulated Campaign Engine State
const STAGES = ['Ingesting Brand Identity...', 'Analyzing Market Trends...', 'Synthesizing Content...', 'Deploying Omni-channel...'];

export default function MarketingAIAgentGraphic() {
    const [activeStage, setActiveStage] = useState(0);
    const [generatingContent, setGeneratingContent] = useState<string | null>(null);
    const [deployedChannels, setDeployedChannels] = useState<string[]>([]);

    // Main orchestration loop
    useEffect(() => {
        const runCycle = async () => {
            // Stage 0: Ingest
            setActiveStage(0);
            setDeployedChannels([]);
            await new Promise(r => setTimeout(r, 2000));

            // Stage 1: Analyze
            setActiveStage(1);
            await new Promise(r => setTimeout(r, 2000));

            // Stage 2: Synthesize
            setActiveStage(2);
            for (const content of CONTENT_TYPES) {
                setGeneratingContent(content.id);
                await new Promise(r => setTimeout(r, 1500));
            }
            setGeneratingContent(null);

            // Stage 3: Deploy
            setActiveStage(3);
            for (const channel of CHANNELS) {
                setDeployedChannels(prev => [...prev, channel.id]);
                await new Promise(r => setTimeout(r, 800)); // Stagger deployment
            }

            await new Promise(r => setTimeout(r, 3000)); // Hold final state
            runCycle(); // Loop
        };

        runCycle();
    }, []);

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-between p-8 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden">

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Top Status Bar */}
            <div className="w-full flex justify-between items-center z-10 mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-display tracking-widest uppercase text-white/80">
                        Campaign Architect
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">
                        {STAGES[activeStage]}
                    </span>
                </div>
            </div>

            {/* Main Visualizer Area */}
            <div className="relative w-full flex-1 flex flex-col md:flex-row items-center justify-center gap-12 z-10">

                {/* 1. Brand Identity Core (Input) */}
                <div className="flex flex-col items-center gap-4 relative">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-display">Brand DNA</span>

                    <motion.div
                        animate={{
                            boxShadow: activeStage === 0 ? ['0 0 0px rgba(168,85,247,0)', '0 0 40px rgba(168,85,247,0.3)', '0 0 0px rgba(168,85,247,0)'] : 'none',
                            borderColor: activeStage === 0 ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 rounded-2xl bg-white/5 border flex items-center justify-center relative backdrop-blur-sm"
                    >
                        <Fingerprint className={`w-10 h-10 ${activeStage === 0 ? 'text-purple-400' : 'text-white/40'} transition-colors duration-500`} />

                        {/* Data flowing out */}
                        <AnimatePresence>
                            {activeStage > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 100 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="absolute left-full top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-purple-500/50 to-transparent"
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <div className="flex gap-2">
                        <div className="w-4 h-4 rounded-full bg-black border border-white/20" />
                        <div className="w-4 h-4 rounded-full bg-white border border-white/20" />
                        <div className="w-4 h-4 rounded-full bg-purple-500 border border-white/20" />
                    </div>
                </div>

                {/* 2. AI Generator Engine (Center) */}
                <div className="flex flex-col items-center justify-center relative mx-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute w-64 h-64 rounded-full border border-white/5 border-t-purple-500/30 border-b-purple-500/30 border-dashed"
                    />

                    <div className="w-32 h-32 rounded-full border-2 border-white/10 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center relative z-20 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {/* Gradient active glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 transition-opacity duration-500 ${activeStage === 2 ? 'opacity-100' : 'opacity-0'}`} />

                        <Layers className={`w-8 h-8 mb-2 relative z-10 transition-colors duration-500 ${activeStage === 2 ? 'text-white' : 'text-white/40'}`} />

                        <div className="h-4 relative z-10">
                            <AnimatePresence mode="wait">
                                {generatingContent ? (
                                    <motion.span
                                        key={generatingContent}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className={`text-[10px] font-bold uppercase tracking-widest ${CONTENT_TYPES.find(c => c.id === generatingContent)?.color}`}
                                    >
                                        Generating...
                                    </motion.span>
                                ) : (
                                    <motion.span key="idle" className="text-[10px] text-white/20 font-mono">STANDBY</motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Content Icons floating around Engine */}
                    {CONTENT_TYPES.map((type, i) => {
                        const isGenerating = generatingContent === type.id;
                        const angle = (i * 120) * (Math.PI / 180);
                        const radius = 90;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                            <motion.div
                                key={type.id}
                                animate={{
                                    x, y,
                                    scale: isGenerating ? 1.2 : 1,
                                    opacity: isGenerating ? 1 : 0.3
                                }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="absolute z-30"
                            >
                                <div className={`w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] ${isGenerating ? 'border-' + type.color.split('-')[1] + '-500/50' : ''}`}>
                                    <type.icon className={`w-4 h-4 ${isGenerating ? type.color : 'text-white/40'}`} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* 3. Social Distribution (Output) */}
                <div className="flex flex-col gap-4 relative justify-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-display mb-2 text-center">Deployment</span>

                    <div className="grid grid-cols-2 gap-4">
                        {CHANNELS.map((channel, i) => {
                            const isDeployed = deployedChannels.includes(channel.id);

                            return (
                                <div key={channel.id} className="relative flex items-center min-w-[120px]">

                                    {/* Deployment Line from Engine */}
                                    <AnimatePresence>
                                        {activeStage === 3 && isDeployed && (
                                            <motion.div
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: 60, opacity: 1 }}
                                                className={`absolute right-full top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent to-current ${channel.color}`}
                                            >
                                                {/* Traveling payload dot */}
                                                <motion.div
                                                    initial={{ x: '-100%' }}
                                                    animate={{ x: '100%' }}
                                                    transition={{ duration: 0.5, ease: "linear" }}
                                                    className="w-1 h-1 bg-white rounded-full absolute right-0 top-1/2 -translate-y-1/2 shadow-[0_0_10px_white]"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.div
                                        animate={{
                                            scale: isDeployed ? [1, 1.1, 1] : 1,
                                            borderColor: isDeployed ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)'
                                        }}
                                        transition={{ duration: 0.5 }}
                                        className={`flex items-center gap-3 bg-white/5 border p-3 rounded-xl w-full backdrop-blur transition-colors ${isDeployed ? 'bg-white/10' : ''}`}
                                    >
                                        <channel.icon className={`w-5 h-5 ${isDeployed ? channel.color : 'text-white/40'}`} />
                                        <span className={`text-xs font-display tracking-wide ${isDeployed ? 'text-white' : 'text-white/40'}`}>
                                            {channel.label}
                                        </span>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

        </div>
    );
}
