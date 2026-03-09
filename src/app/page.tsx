import Hero from "@/components/Hero";
import IsomorphLogo from "@/components/IsomorphLogo";
import Link from "next/link";
import { ArrowRight, FolderKanban, TerminalSquare, Info, Shield, BarChart3, Globe } from "lucide-react";
import VisionSection from "@/components/VisionSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between selection:bg-white/10 relative">
      <Hero />

      {/* Narrative Section 0.5: Vision */}
      <VisionSection />

      {/* Narrative Section 2: Infrastructure / Integration */}
      <section className="w-full py-16 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-display mb-4 block">Engineered Intelligence</span>
            <h2 className="text-3xl md:text-6xl font-display font-bold mb-6 md:mb-8 leading-tight">
              UNIFIED DATA<br />
              <span className="text-white/40 italic">ECOSYSTEM.</span>
            </h2>
            <p className="text-xl text-white/60 mb-12 font-sans max-w-lg">
              Our Antigravity engine eliminates friction in data integration.
              Connect any source and watch the chaos align into actionable foresight.
            </p>

            <div className="space-y-6">
              {[
                { label: "End-to-End Encryption", icon: Shield },
                { label: "Real-time Analytics", icon: BarChart3 },
                { label: "Global Deployment", icon: Globe }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white/80">
                  <div className="w-5 h-5 flex items-center justify-center border border-white/20 rounded-full">
                    <item.icon className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-sm font-display tracking-widest uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Final CTA */}
      <footer className="w-full py-20 border-t border-white/5 bg-black mt-20 relative z-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <IsomorphLogo size={32} dark={true} animated={false} />
            <div className="font-condensed font-bold text-xl tracking-widest uppercase text-white">
              ISOMORPH <span className="text-white/40 font-mono">AI</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] uppercase tracking-[0.2em] font-display text-white/40">
            <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
            <a href="#" className="hover:text-white transition-colors">Technology</a>
          </div>

          <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
            © 2026 ANTIGRAVITY ENGINE. PREDICT CONTROL.
          </div>
        </div>
      </footer>
    </main >
  );
}
