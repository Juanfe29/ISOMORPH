'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CreditCard, Users, Calendar, Settings, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Data sources for the animation
const SOURCES = [
    { id: 'pos', label: 'POS Data', icon: CreditCard, color: 'text-emerald-400', yOffset: -60 },
    { id: 'crm', label: 'CRM', icon: Users, color: 'text-blue-400', yOffset: -20 },
    { id: 'payroll', label: 'Payroll', icon: Settings, color: 'text-amber-400', yOffset: 20 },
    { id: 'res', label: 'Reservations', icon: Calendar, color: 'text-purple-400', yOffset: 60 },
];

// Simulated incoming data packets
const PACKETS = [
    { sourceId: 'pos', value: '$4.2k' },
    { sourceId: 'crm', value: 'New VIP' },
    { sourceId: 'payroll', value: 'Overtime alert' },
    { sourceId: 'res', value: 'Party of 8' },
    { sourceId: 'pos', value: '$1.1k' },
    { sourceId: 'res', value: 'Cancelation' }
];

// AI engine processing variables
const VARIABLES = ['Seasonality', 'Historical Trends', 'Local Events', 'Weather Impact', 'Volatility Index'];

// Output actionable insights
const OUTPUTS = [
    { type: 'forecast', text: 'Predicted 15% surge in weekend reservations.', confidence: 94 },
    { type: 'action', text: 'Action: Increase FOH staff by 2 for Saturday night.', status: 'pending' },
    { type: 'insight', text: 'Inventory alert: High demand for premium wine expected.', confidence: 88 },
    { type: 'action', text: 'Automated Supplier Order: Placed.', status: 'executed' }
];

export default function KineticAnalyticsGraphic() {
    const [activePackets, setActivePackets] = useState<{ id: number; source: any; value: string }[]>([]);
    const [activeVariableIndex, setActiveVariableIndex] = useState(0);
    const [outputs, setOutputs] = useState<any[]>([]);
    const [packetIdCounter, setPacketIdCounter] = useState(0);

    // Simulate data ingestion
    useEffect(() => {
        const interval = setInterval(() => {
            const randomPacket = PACKETS[Math.floor(Math.random() * PACKETS.length)];
            const source = SOURCES.find(s => s.id === randomPacket.sourceId);

            const newPacket = {
                id: packetIdCounter,
                source: source,
                value: randomPacket.value
            };

            setActivePackets(prev => [...prev.slice(-4), newPacket]); // Keep max 5 on screen
            setPacketIdCounter(prev => prev + 1);
        }, 1200);

        return () => clearInterval(interval);
    }, [packetIdCounter]);

    // Simulate AI Engine variable scanning
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveVariableIndex(prev => (prev + 1) % VARIABLES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Simulate output generation
    useEffect(() => {
        let currentOutputIdx = 0;
        const interval = setInterval(() => {
            if (currentOutputIdx < OUTPUTS.length) {
                setOutputs(prev => [OUTPUTS[currentOutputIdx], ...prev].slice(0, 3)); // show last 3
                currentOutputIdx++;
            } else {
                currentOutputIdx = 0; // loop
            }
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex-1 flex flex-col md:flex-row items-center justify-between p-8 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden min-h-[400px]">

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

            {/* Left Column: Data Sources */}
            <div className="flex flex-col gap-6 z-10 w-full md:w-1/4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 font-display">Ingestion Layer</span>
                {SOURCES.map((source, idx) => (
                    <div key={idx} className="flex items-center gap-4 relative group cursor-pointer">
                        <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${source.color}`}>
                            <source.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-sans tracking-tight text-white/80 group-hover:text-white transition-colors">{source.label}</span>

                        {/* Connection point for lines */}
                        <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-1 h-1 bg-white/20 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Middle Column: AI Engine */}
            <div className="flex-1 flex justify-center items-center relative z-10 w-full md:w-1/2 py-20 md:py-0 min-h-[300px]">
                {/* Data Packets traveling to center */}
                <AnimatePresence>
                    {activePackets.map((packet) => (
                        <motion.div
                            key={packet.id}
                            initial={{ opacity: 0, x: -100, y: packet.source.yOffset, scale: 0.5 }}
                            animate={{ opacity: [0, 1, 1, 0], x: 0, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeIn" }}
                            className="absolute flex items-center gap-2"
                        >
                            <span className={`text-xs font-mono font-bold ${packet.source.color}`}>{packet.value}</span>
                            <div className={`w-2 h-2 rounded-full blur-[2px] bg-current ${packet.source.color}`} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Central Engine Core */}
                <div className="relative flex flex-col items-center justify-center">
                    {/* Glowing outer rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute w-48 h-48 rounded-full border border-white/10 border-t-white/40 border-b-white/40"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute w-40 h-40 rounded-full border border-white/5 border-l-white/30 border-r-white/30"
                    />

                    {/* The Core */}
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center relative z-20 shadow-[0_0_80px_rgba(255,255,255,0.1)]">
                        <Activity className="w-10 h-10 text-white animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                    </div>

                    <div className="absolute -bottom-20 whitespace-nowrap text-center z-10">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2 font-display">Forecasting Model</span>
                        <div className="h-6 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeVariableIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-sm font-display font-medium text-white/80"
                                >
                                    [{VARIABLES[activeVariableIndex]}]
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Output & Actionable Insights */}
            <div className="flex flex-col gap-4 z-10 w-full md:w-1/3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 font-display text-right w-full">Prescriptive Intelligence</span>

                <div className="flex flex-col gap-3 min-h-[250px] justify-start w-full">
                    <AnimatePresence>
                        {outputs.map((output, idx) => (
                            <motion.div
                                key={idx + output.text}
                                initial={{ opacity: 0, x: 20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-lg flex flex-col gap-2 w-full"
                            >
                                <div className="flex items-center gap-2">
                                    {output.type === 'forecast' && <TrendingUp className="w-3 h-3 text-blue-400" />}
                                    {output.type === 'action' && <CheckCircle2 className={`w-3 h-3 ${output.status === 'executed' ? 'text-emerald-400' : 'text-amber-400'}`} />}
                                    {output.type === 'insight' && <AlertTriangle className="w-3 h-3 text-purple-400" />}
                                    <span className="text-[9px] font-display font-bold uppercase tracking-widest text-white/50">{output.type}</span>

                                    {output.confidence && (
                                        <span className="ml-auto text-[9px] font-mono text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/20">
                                            {output.confidence}% CONFIDENCE
                                        </span>
                                    )}
                                    {output.status === 'executed' && (
                                        <span className="ml-auto text-[9px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                                            EXECUTED
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-sans tracking-tight text-white/80 leading-relaxed font-light">
                                    {output.text}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}
