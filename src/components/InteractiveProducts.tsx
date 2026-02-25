'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, BarChart3, Navigation, Zap, Sparkles } from 'lucide-react';
import VoiceAIAgentGraphic from './VoiceAIAgentGraphic';
import KineticAnalyticsGraphic from './KineticAnalyticsGraphic';
import MultimodalControlGraphic from './MultimodalControlGraphic';
import MarketingAIAgentGraphic from './MarketingAIAgentGraphic';

const products = [
    {
        id: 'voice',
        title: 'Voice AI Agent',
        description: 'Autonomous voice intelligence with sub-200ms latency. Live-streams intent and dynamically negotiates via real-time LLM pathways.',
        icon: Mic,
        metrics: [
            { label: 'Latency', value: '< 200ms' },
            { label: 'Concurrency', value: '10k+' },
            { label: 'Uptime', value: '99.99%' },
        ],
        component: VoiceAIAgentGraphic
    },
    {
        id: 'analytics',
        title: 'Kinetic Analytics',
        description: 'High-frequency data distillation engine. Turns chaotic enterprise variables into deterministic operational commands.',
        icon: BarChart3,
        metrics: [
            { label: 'Processing', value: 'Real-time' },
            { label: 'Data Points', value: '1M/sec' },
            { label: 'Accuracy', value: '99.9%' },
        ],
        component: KineticAnalyticsGraphic
    },
    {
        id: 'multimodal',
        title: 'Multimodal Control',
        description: 'AI-driven logistics architecture. Optimizes complex supply chain routes and predicts inventory depletion before it registers on legacy dashboards.',
        icon: Navigation,
        metrics: [
            { label: 'Optimization', value: '+35%' },
            { label: 'Active Fleet', value: '25k+' },
            { label: 'Stock Accuracy', value: '99.9%' },
        ],
        component: MultimodalControlGraphic
    },
    {
        id: 'marketing',
        title: 'Marketing AI Agent',
        description: 'Autonomous omni-channel campaign architect. Ingests core brand identity to generate, optimize, and deploy content across all networks simultaneously.',
        icon: Sparkles,
        metrics: [
            { label: 'Channels', value: 'Omni' },
            { label: 'Generation', value: '0.8s/Asset' },
            { label: 'Brand Alignment', value: '99%' },
        ],
        component: MarketingAIAgentGraphic
    }
];

export default function InteractiveProducts() {
    const [activeProduct, setActiveProduct] = useState(products[0].id);

    const active = products.find(p => p.id === activeProduct) || products[0];
    const ActiveComponent = active.component;

    return (
        <section className="w-full py-32 bg-black relative border-t border-white/5">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="mb-16 md:mb-24">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-display mb-4 block">Product Ecosystem</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight flex items-center gap-4">
                        AUTONOMOUS
                        <span className="text-white/40 italic flex items-center gap-2">
                            <Zap className="w-8 h-8 text-white/40" />
                            SOLUTIONS.
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {products.map((product) => {
                            const isActive = activeProduct === product.id;
                            return (
                                <button
                                    key={product.id}
                                    onClick={() => setActiveProduct(product.id)}
                                    className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${isActive
                                        ? 'bg-white/10 border-white/20'
                                        : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                                        }`}
                                >
                                    {/* Active Indicator Line */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}

                                    <div className="flex items-center gap-4 mb-3 relative z-10">
                                        <product.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'} transition-colors`} />
                                        <h3 className={`font-display font-bold tracking-tight text-lg ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'} transition-colors`}>
                                            {product.title}
                                        </h3>
                                    </div>
                                    <p className={`text-sm leading-relaxed relative z-10 ${isActive ? 'text-white/70' : 'text-white/40 group-hover:text-white/60'} transition-colors`}>
                                        {product.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Display Area */}
                    <div className="lg:col-span-8 relative min-h-[600px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProduct}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="w-full h-full"
                            >
                                {/* Metrics Bar */}
                                <div className="flex flex-wrap gap-4 md:gap-8 mb-8 pb-8 border-b border-white/10">
                                    {active.metrics.map((metric, i) => (
                                        <div key={i} className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-widest font-display text-white/40">{metric.label}</span>
                                            <span className="text-xl font-display font-bold text-white tracking-tight">{metric.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Dynamic Component Area */}
                                <ActiveComponent />

                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}
