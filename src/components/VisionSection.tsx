'use client';

import { Code2, Lightbulb, RefreshCw } from 'lucide-react';
import { GraphCard, MeshBackground, GraphDivider } from './GraphUIElements';
import { motion } from 'framer-motion';

export default function VisionSection() {
    return (
        <section id="services" className="relative w-full py-16 md:py-32 bg-black overflow-hidden">
            <GraphDivider />

            <MeshBackground />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono mb-6 block">What We Do</span>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium leading-tight tracking-tight mb-8 text-white/90">
                            We turn <span className="text-glow text-accent italic">technical debt</span> into competitive advantage.
                        </h2>

                        <p className="text-base md:text-xl text-white/50 font-sans tracking-wide leading-relaxed mb-10 md:mb-16 max-w-3xl mx-auto">
                            We work with startups and established businesses that have outgrown their current technology.
                            Our AI-powered approach delivers <span className="text-white/80">production-ready software faster</span> than traditional development.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <GraphCard delay={0.2}>
                            <Code2 className="w-8 h-8 text-[#E8851A]/60 mb-6" />
                            <h3 className="text-xl font-display font-bold text-white mb-3 tracking-wider">SaaS Development</h3>
                            <p className="text-sm text-white/50 leading-relaxed font-sans">
                                We build full-stack SaaS products using AI coding agents. Our engineering team ships faster without cutting corners — from MVP to production-grade architecture.
                            </p>
                        </GraphCard>

                        <GraphCard delay={0.3}>
                            <Lightbulb className="w-8 h-8 text-[#E8851A]/60 mb-6" />
                            <h3 className="text-xl font-display font-bold text-white mb-3 tracking-wider">CTO as a Service</h3>
                            <p className="text-sm text-white/50 leading-relaxed font-sans">
                                Technical leadership for startups that need strategic direction without a full-time CTO. We own the tech stack, the roadmap, and the team — so you can focus on growth.
                            </p>
                        </GraphCard>

                        <GraphCard delay={0.4}>
                            <RefreshCw className="w-8 h-8 text-[#E8851A]/60 mb-6" />
                            <h3 className="text-xl font-display font-bold text-white mb-3 tracking-wider">AI Transformation</h3>
                            <p className="text-sm text-white/50 leading-relaxed font-sans">
                                Already have customers but stuck with aging systems? We modernize your infrastructure with AI-native tooling, automating workflows and unlocking the value already in your data.
                            </p>
                        </GraphCard>
                    </div>
                </div>
            </div>
        </section>
    );
}
