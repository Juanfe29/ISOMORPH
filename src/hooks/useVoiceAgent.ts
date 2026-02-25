import { useState, useEffect, useRef, useCallback } from 'react';
import { GeminiClient } from '@/lib/gemini-client';
import { audioBufferToPCM16, pcm16ToBase64, playPCM16Base64, resetAudioQueue, GEMINI_AUDIO_CONFIG } from '@/lib/audio-utils';

export function useVoiceAgent() {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false); // User is speaking
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [limitMessage, setLimitMessage] = useState<string | null>(null);

    const clientRef = useRef<GeminiClient | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDMXX5Zl4ScTbXbGZNMrWBF8yH3IHXxrhc'; // Fallback if env isn't set, as requested

    const disconnect = useCallback(() => {
        if (clientRef.current) {
            clientRef.current.disconnect();
            clientRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        // Don't close AudioContext completely immediately if it's currently playing a final response,
        // but suspending is safer for cleanup.
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(console.error);
        }
        audioContextRef.current = null;
        resetAudioQueue();

        setIsSessionActive(false);
        setIsSpeaking(false);
        setIsAgentSpeaking(false);
    }, []);

    const handleAudioInput = useCallback(async (e: AudioProcessingEvent) => {
        if (!clientRef.current?.isConnected || isAgentSpeaking) return;

        const inputData = e.inputBuffer;

        // Very rudimentary VAD for UI animation
        const channelData = inputData.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < channelData.length; i++) {
            sum += Math.abs(channelData[i]);
        }
        const averageVolume = sum / channelData.length;

        setIsSpeaking(averageVolume > 0.005);

        // Always stream audio to Gemini (its internal VAD handles silence and turns)
        try {
            const pcm16 = audioBufferToPCM16(inputData);
            const base64 = pcm16ToBase64(pcm16);
            if (clientRef.current) {
                clientRef.current.sendAudioChunk(base64);
            }
        } catch (err) {
            console.error("Audio sending failed", err);
        }

    }, [isAgentSpeaking]);

    const startSession = async () => {
        try {
            setError(null);
            setLimitMessage(null);
            setIsSessionActive(true); // Optimistic

            // 1. Authorize Session via API
            const authRes = await fetch('/api/auth/session', { method: 'POST' });
            if (!authRes.ok) {
                const errorData = await authRes.json();
                throw new Error(errorData.error || 'Failed to authorize session');
            }

            // 2. Setup Audio Context & Microphone
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: GEMINI_AUDIO_CONFIG.sampleRate
            });
            streamRef.current = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: { ideal: GEMINI_AUDIO_CONFIG.sampleRate },
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
            // Deprecated but works simply across browsers for raw PCM access without Worklets overhead for testing
            processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

            source.connect(processorRef.current);
            processorRef.current.connect(audioContextRef.current.destination);

            processorRef.current.onaudioprocess = handleAudioInput;

            // 3. Connect to Gemini WS
            clientRef.current = new GeminiClient(apiKey);

            clientRef.current.addEventListener('connected', () => {
                console.log('Gemini WS Connected');
            });

            clientRef.current.addEventListener('disconnected', () => {
                console.log('Gemini WS Disconnected');
                disconnect();
            });

            clientRef.current.addEventListener('error', () => {
                setError('Connection error occurred.');
                disconnect();
            });

            clientRef.current.addEventListener('limitReached', (e: any) => {
                setLimitMessage(e.detail);
            });

            clientRef.current.addEventListener('audio', async (e: any) => {
                setIsAgentSpeaking(true);
                const base64Audio = e.detail;
                if (audioContextRef.current) {
                    await playPCM16Base64(base64Audio, audioContextRef.current, GEMINI_AUDIO_CONFIG.outSampleRate);
                    // Clear the agent speaking flag slightly after the chunk finishes
                    setTimeout(() => setIsAgentSpeaking(false), 200);
                }
            });

            clientRef.current.connect();

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to start voice session.');
            disconnect();
        }
    };

    const interruptAgent = () => {
        if (clientRef.current && isAgentSpeaking) {
            clientRef.current.interrupt();
            resetAudioQueue();
            setIsAgentSpeaking(false);
        }
    };

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        isSessionActive,
        isSpeaking,
        isAgentSpeaking,
        error,
        limitMessage,
        startSession,
        disconnect,
        interruptAgent
    };
}
