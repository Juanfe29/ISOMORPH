import Hero from "@/components/Hero";
import IsomorphLogo from "@/components/IsomorphLogo";
import Link from "next/link";
import { Bot, Zap, GitMerge } from "lucide-react";
import VisionSection from "@/components/VisionSection";
import ContactSection from "@/components/ContactSection";
import { MeshBackground, GraphDivider } from "@/components/GraphUIElements";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between selection:bg-white/10 relative">
      <Hero />

      {/* Section: What We Do */}
      <VisionSection />

      {/* Section: How We Work */}
      <section className="w-full py-16 md:py-32 relative overflow-hidden bg-[#050505]">
        <MeshBackground />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono mb-6 block">Our Approach</span>
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white/90 mb-4">
                AI agents do the heavy lifting.<br />
                <span className="text-glow text-accent italic">Our engineers</span> make it production-ready.
              </h2>
              <p className="text-white/40 font-sans text-base md:text-lg max-w-2xl mx-auto leading-relaxed mt-6">
                We combine experienced software engineers with AI coding agents to compress development timelines without sacrificing quality or reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
              {[
                {
                  step: "01",
                  icon: Bot,
                  title: "Diagnose",
                  desc: "We audit your current stack, identify bottlenecks, and define the shortest path from where you are to where you need to be."
                },
                {
                  step: "02",
                  icon: Zap,
                  title: "Build",
                  desc: "Our AI-assisted development pipeline ships features in days, not months. Full test coverage, CI/CD, and clean architecture from day one."
                },
                {
                  step: "03",
                  icon: GitMerge,
                  title: "Operate",
                  desc: "We don't just hand off code. We maintain, monitor, and iterate — acting as your embedded technical team for as long as you need us."
                }
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="bg-[#050505] p-8 md:p-10 group hover:bg-white/[0.02] transition-colors duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[10px] font-mono text-[#E8851A]/40 tracking-[0.3em]">{step}</span>
                    <Icon className="w-5 h-5 text-white/15 group-hover:text-[#E8851A]/50 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3 tracking-wider">{title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-sans">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <GraphDivider />

      {/* Section: Contact / Lead Capture */}
      <ContactSection />

      <GraphDivider />

      {/* Footer */}
      <footer className="w-full py-16 border-t border-white/5 bg-black relative z-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <IsomorphLogo size={32} dark={true} animated={false} />
            <div className="font-condensed font-bold text-xl tracking-widest uppercase text-white">
              ISOMORPH <span className="text-white/40 font-mono">AI</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] uppercase tracking-[0.2em] font-display text-white/40">
            <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="text-[10px] text-white/20 font-mono tracking-widest uppercase">
            © 2026 ISOMORPH AI. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </main>
  );
}
