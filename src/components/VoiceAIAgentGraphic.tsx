'use client';

import { motion } from 'framer-motion';
import { Mic, Radio, Cloud, Server, Database, Activity, PhoneCall, Bot, Loader2, XCircle } from 'lucide-react';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';

const nodes = [
  { id: 'user', icon: PhoneCall, label: 'User Stream', x: '10%', y: '50%', color: 'text-blue-400' },
  { id: 'stt', icon: Radio, label: 'Real-time STT', x: '30%', y: '50%', color: 'text-purple-400' },
  { id: 'llm', icon: Bot, label: 'Antigravity Engine', x: '50%', y: '50%', color: 'text-white', main: true },
  { id: 'tts', icon: Mic, label: 'Neural TTS', x: '70%', y: '50%', color: 'text-amber-400' },
  { id: 'output', icon: Activity, label: 'Voice Response', x: '90%', y: '50%', color: 'text-emerald-400' }
];

const clouds = [
  { id: 'aws', icon: Cloud, label: 'AWS Connect', x: '40%', y: '20%' },
  { id: 'gcp', icon: Server, label: 'GCP Dialogflow', x: '50%', y: '15%' },
  { id: 'azure', icon: Database, label: 'Azure Bot', x: '60%', y: '20%' },
];

export default function VoiceAIAgentGraphic() {
  const {
    isSessionActive,
    isSpeaking,
    isAgentSpeaking,
    error,
    limitMessage,
    startSession,
    disconnect,
    interruptAgent
  } = useVoiceAgent();

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-[450px] border border-white/5 bg-black/40 overflow-hidden rounded-3xl mt-8">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Main Flow Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(96, 165, 250, 0.2)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(52, 211, 153, 0.2)" />
            </linearGradient>
          </defs>

          {/* Horizontal Main Flow */}
          <motion.line
            x1="10%" y1="50%" x2="90%" y2="50%"
            stroke="url(#gradient-line)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Cloud Connection Lines (from LLM to Clouds) */}
          {clouds.map((cloud, i) => (
            <motion.line
              key={i}
              x1="50%"
              y1="50%"
              x2={cloud.x}
              y2={cloud.y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 1 + (i * 0.2) }}
            />
          ))}

          {/* Animated Particles along the main line (Only when active) */}
          {(isSessionActive || !isSessionActive) && (
            <>
              <motion.circle
                r="3"
                fill={isSessionActive ? (isSpeaking ? "#3b82f6" : (isAgentSpeaking ? "#34d399" : "#fff")) : "#555"}
                initial={{ cx: "10%", cy: "50%", opacity: 0 }}
                animate={{ cx: ["10%", "30%", "50%", "70%", "90%"], cy: "50%", opacity: [0, 1, 1, 1, 0] }}
                transition={{ duration: isSessionActive ? 1.5 : 3, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                r="3"
                fill={isSessionActive ? (isSpeaking ? "#3b82f6" : (isAgentSpeaking ? "#34d399" : "#fff")) : "#333"}
                initial={{ cx: "10%", cy: "50%", opacity: 0 }}
                animate={{ cx: ["10%", "30%", "50%", "70%", "90%"], cy: "50%", opacity: [0, 1, 1, 1, 0] }}
                transition={{ duration: isSessionActive ? 1.5 : 3, delay: isSessionActive ? 0.75 : 1.5, repeat: Infinity, ease: "linear" }}
              />
            </>
          )}
        </svg>

        {/* Cloud Nodes */}
        {clouds.map((node, i) => (
          <motion.div
            key={node.id}
            style={{ left: node.x, top: node.y }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group z-10"
          >
            <div className={`p-2 rounded-lg backdrop-blur-md border transition-colors ${isSessionActive ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10'}`}>
              <node.icon className={`w-4 h-4 transition-colors ${isSessionActive ? 'text-white/80' : 'text-white/40'}`} />
            </div>
            <span className="text-[9px] uppercase tracking-widest font-display text-white/40 whitespace-nowrap">
              {node.label}
            </span>
          </motion.div>
        ))}

        {/* Main Flow Nodes */}
        {nodes.map((node, i) => {
          let isActiveNode = false;
          if (isSessionActive) {
            if (isSpeaking && (node.id === 'user' || node.id === 'stt' || node.id === 'llm')) isActiveNode = true;
            if (isAgentSpeaking && (node.id === 'llm' || node.id === 'tts' || node.id === 'output')) isActiveNode = true;
          }

          return (
            <motion.div
              key={node.id}
              style={{ left: node.x, top: node.y }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 group z-20"
            >
              <div className={`p-4 rounded-xl backdrop-blur-md border transition-all duration-300 ${node.main ? 'bg-white border-white' : (isActiveNode ? 'bg-white/10 border-white/50 scale-110' : 'bg-black/60 border-white/20')}`}>
                <node.icon className={`w-6 h-6 transition-colors ${node.main ? 'text-black' : (isActiveNode ? node.color : 'text-white/40')} ${node.main && 'animate-pulse'}`} />
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-display transition-colors whitespace-nowrap ${isActiveNode ? 'text-white' : 'text-white/50'}`}>
                {node.label}
              </span>

              {node.main && (
                <div className="absolute inset-0 -z-10 bg-white/10 blur-xl rounded-full scale-150 animate-pulse" />
              )}
            </motion.div>
          );
        })}

        {/* Live Badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/50 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
          <div className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
          <span className="text-[9px] uppercase tracking-widest font-display text-white/80">
            {isSessionActive ? 'Live Connect' : 'Standby'}
          </span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex-1 flex flex-col">
          <span className="text-white font-display text-sm font-semibold">
            {isSessionActive
              ? (isSpeaking ? 'Listening to you...' : isAgentSpeaking ? 'Agent is speaking...' : 'Agent is listening...')
              : 'Try the Antigravity Voice Agent'}
          </span>
          <span className="text-white/40 text-xs font-sans">
            {limitMessage
              ? limitMessage
              : error
                ? error
                : isSessionActive ? 'Speak directly into your microphone. Max 3 questions.' : 'Requires microphone permissions to connect to Gemini Native Audio.'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isSessionActive && isAgentSpeaking && (
            <button
              onClick={interruptAgent}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-display tracking-wider uppercase transition-colors flex items-center gap-2 border border-white/10"
            >
              Interrupt
            </button>
          )}

          {!isSessionActive ? (
            <button
              onClick={startSession}
              disabled={!!limitMessage}
              className="px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200 text-xs font-display font-bold tracking-wider uppercase transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-4 h-4" />
              Talk to Agent
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-display font-bold tracking-wider uppercase transition-colors flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              End Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

