'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Truck, Package, AlertOctagon, CheckCircle2, TrendingDown, Navigation, Activity } from 'lucide-react';

// Supply Chain Nodes
const NODES = [
    { id: 'origin', label: 'Manufacturing Hub', x: '10%', y: '50%' },
    { id: 'dc1', label: 'Distribution Center Alpha', x: '40%', y: '20%' },
    { id: 'dc2', label: 'Distribution Center Beta', x: '40%', y: '80%' },
    { id: 'dest1', label: 'Retail Region 1', x: '80%', y: '15%' },
    { id: 'dest2', label: 'Retail Region 2', x: '80%', y: '50%' },
    { id: 'dest3', label: 'Direct to Consumer', x: '80%', y: '85%' },
];

// Active Fleet representing shipments
const INITIAL_FLEET = [
    { id: 1, from: 'origin', to: 'dc1', progress: 0, speed: 0.5, status: 'normal' },
    { id: 2, from: 'origin', to: 'dc2', progress: 0.2, speed: 0.4, status: 'normal' },
    { id: 3, from: 'dc1', to: 'dest1', progress: 0.6, speed: 0.6, status: 'normal' },
    { id: 4, from: 'dc2', to: 'dest3', progress: 0.8, speed: 0.5, status: 'normal' }
];

// Inventory Tracking
const INVENTORY = [
    { sku: 'SKU-8992', name: 'Premium Components', stock: 4500, trend: 'stable' },
    { sku: 'SKU-1044', name: 'Packaging Units', stock: 120, trend: 'critical' },
    { sku: 'SKU-3321', name: 'Retail Display Sets', stock: 890, trend: 'decreasing' },
];

// Real-time AI Interventions
const INTERVENTIONS = [
    { time: '10:42 AM', type: 'routing', text: 'Weather anomaly detected on Route DC1-R1. Rerouting 4 fleet units via secondary highway.', status: 'resolved' },
    { time: '10:45 AM', type: 'inventory', text: 'SKU-1044 dropped below threshold. Automated emergency PO dispatched to secondary supplier.', status: 'executed' },
    { time: '10:48 AM', type: 'optimization', text: 'Consolidating shipments at DC Beta to minimize fuel burn. Estimated saving: 12%.', status: 'calculating' }
];

export default function MultimodalControlGraphic() {
    const [fleet, setFleet] = useState(INITIAL_FLEET);
    const [activeIntervention, setActiveIntervention] = useState(0);

    // Animate fleet movement
    useEffect(() => {
        let animationFrameId: number;

        const updateFleet = () => {
            setFleet(prevFleet => prevFleet.map(truck => {
                let newProgress = truck.progress + (truck.speed * 0.01);

                // Simulate reaching destination and restarting loop for visuals
                if (newProgress >= 1) {
                    newProgress = 0;
                    // Randomly swap status for visual variety
                    truck.status = Math.random() > 0.8 ? 'delayed' : 'normal';
                }

                return { ...truck, progress: newProgress };
            }));

            animationFrameId = requestAnimationFrame(updateFleet);
        };

        animationFrameId = requestAnimationFrame(updateFleet);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Rotate interventions
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIntervention(prev => (prev + 1) % INTERVENTIONS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Helper to get coordinates for lines and trucks
    const getNodeCoords = (id: string) => {
        const node = NODES.find(n => n.id === id);
        return node ? { x: node.x, y: node.y } : { x: '0%', y: '0%' };
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-between p-8 bg-black/50 border border-white/5 rounded-2xl relative overflow-hidden">

            {/* Background Map Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />
            <Map className="absolute inset-0 w-full h-full text-white/[0.02] scale-150 rotate-12" />

            {/* Top HUD Layout */}
            <div className="w-full flex justify-between items-start z-10 mb-8 pointer-events-none">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-display">Active Fleet</span>
                    <div className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
                        {fleet.length * 142} <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">UNITS ONLINE</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-right">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-display">System Status</span>
                    <div className="flex items-center gap-2 justify-end">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-sm font-mono text-blue-400">OPTIMIZING</span>
                    </div>
                </div>
            </div>

            {/* Main Map Area */}
            <div className="relative w-full flex-1 min-h-[300px] border border-white/10 rounded-xl bg-black/60 backdrop-blur-sm overflow-hidden mb-6 z-10">

                {/* Connection Lines (Routes) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="50%" stopColor="rgba(59,130,246,0.3)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                        </linearGradient>
                    </defs>

                    {/* Draw standard routes */}
                    <path d="M 10% 50% L 40% 20% L 80% 15%" stroke="url(#route-gradient)" strokeWidth="1" fill="none" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                    <path d="M 10% 50% L 40% 80% L 80% 85%" stroke="url(#route-gradient)" strokeWidth="1" fill="none" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                    <path d="M 40% 20% L 80% 50%" stroke="url(#route-gradient)" strokeWidth="1" fill="none" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                    <path d="M 40% 80% L 80% 50%" stroke="url(#route-gradient)" strokeWidth="1" fill="none" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                </svg>

                {/* Nodes */}
                {NODES.map(node => (
                    <div
                        key={node.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                        style={{ left: node.x, top: node.y }}
                    >
                        <div className="w-3 h-3 rounded-full bg-white border-2 border-black shadow-[0_0_15px_rgba(255,255,255,0.5)] z-20" />
                        <span className="text-[9px] uppercase tracking-widest font-display text-white/50 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded backdrop-blur">
                            {node.label}
                        </span>
                    </div>
                ))}

                {/* Fleet / Trucks */}
                {fleet.map(truck => {
                    const start = getNodeCoords(truck.from);
                    const end = getNodeCoords(truck.to);

                    // Simple linear interpolation for visual movement
                    const currentX = `calc(${start.x} + (${end.x} - ${start.x}) * ${truck.progress})`;
                    const currentY = `calc(${start.y} + (${end.y} - ${start.y}) * ${truck.progress})`;

                    const isDelayed = truck.status === 'delayed';

                    return (
                        <div
                            key={truck.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-75"
                            style={{ left: currentX, top: currentY }}
                        >
                            <div className={`relative flex items-center justify-center w-6 h-6 rounded-md border ${isDelayed ? 'bg-amber-500/20 border-amber-500/50' : 'bg-blue-500/20 border-blue-500/50'} backdrop-blur`}>
                                <Navigation className={`w-3 h-3 ${isDelayed ? 'text-amber-400 rotate-45' : 'text-blue-400'} transition-transform`} />

                                {/* Pulse effect */}
                                <div className={`absolute inset-0 rounded-md animate-ping opacity-50 ${isDelayed ? 'bg-amber-400' : 'bg-blue-400'}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom HUD: Inventory & Interventions */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 z-10">

                {/* Inventory Tracking */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-white/40" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-display">Inventory Nodes</span>
                    </div>
                    {INVENTORY.map((inv, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="font-mono text-white/40">{inv.sku}</span>
                            <span className="text-white/80 font-sans truncate px-2">{inv.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-white">{inv.stock.toLocaleString()}</span>
                                {inv.trend === 'critical' ? (
                                    <AlertOctagon className="w-3 h-3 text-red-400 animate-pulse" />
                                ) : inv.trend === 'decreasing' ? (
                                    <TrendingDown className="w-3 h-3 text-amber-400" />
                                ) : (
                                    <div className="w-3 h-3 rounded-full bg-emerald-400/20 border border-emerald-400/50" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Interventions Log */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 overflow-hidden relative">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-display">AI Control Log</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIntervention}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-white/40">{INTERVENTIONS[activeIntervention].time}</span>
                                <span className={`px-2 py-0.5 rounded uppercase tracking-widest ${INTERVENTIONS[activeIntervention].status === 'executed' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' :
                                    INTERVENTIONS[activeIntervention].status === 'calculating' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                                        'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                                    }`}>
                                    {INTERVENTIONS[activeIntervention].status}
                                </span>
                            </div>
                            <p className="text-sm font-sans text-white/80 leading-relaxed font-light">
                                {INTERVENTIONS[activeIntervention].text}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>

        </div>
    );
}
