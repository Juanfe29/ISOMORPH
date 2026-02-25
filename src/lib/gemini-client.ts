export class GeminiClient extends EventTarget {
    private ws: WebSocket | null = null;
    private apiKey: string;
    private model = 'models/gemini-2.5-flash-native-audio-latest';
    private MAX_QUESTIONS = 100;
    private currentQuestionCount = 0;

    constructor(apiKey: string) {
        super();
        this.apiKey = apiKey;
    }

    get isConnected() {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    connect() {
        if (this.isConnected) return;

        try {
            const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                // Initial Setup Message
                const setupMessage = {
                    setup: {
                        model: this.model,
                        systemInstruction: {
                            parts: [{ text: "REGLAS DE BREVEDAD Y PERSONALIDAD: Eres el Agente de Inteligencia de Antigravity. ISOMORPH es una empresa que aspira a transformar a otras empresas en organizaciones 'AI first' (Primero IA) mediante infraestructura de datos unificada y previsión. Preséntate la primera vez que hables mencionando esto de forma concisa. Responde SIEMPRE de manera EXTREMADAMENTE concisa. Usa máximo una o dos oraciones por respuesta, sin rodeos, sin listas." }]
                        },
                        generationConfig: {
                            responseModalities: ["AUDIO"],
                            speechConfig: {
                                voiceConfig: {
                                    prebuiltVoiceConfig: {
                                        voiceName: "Kore" // You can change to 'Aoede', 'Charon', 'Fenrir', etc.
                                    }
                                }
                            }
                        }
                    }
                };

                this.ws?.send(JSON.stringify(setupMessage));
            };

            this.ws.onclose = () => {
                this.dispatchEvent(new Event('disconnected'));
                this.ws = null;
            };

            this.ws.onerror = (err) => {
                console.error('Gemini WS Error:', err);
                this.dispatchEvent(new Event('error'));
            };

            this.ws.onmessage = (event) => {
                this.handleIncomingMessage(event.data);
            };

        } catch (error) {
            console.error('Failed to initialize WebSocket', error);
            this.dispatchEvent(new Event('error'));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.dispatchEvent(new Event('disconnected'));
        }
    }

    interrupt() {
        if (!this.isConnected) return;

        // Sending an empty realtimeInput interrupts the current model generation
        const interruptMessage = {
            clientContent: {
                turns: [],
                turnComplete: true
            }
        };

        this.ws?.send(JSON.stringify(interruptMessage));
        this.dispatchEvent(new Event('interrupted'));
    }

    sendAudioChunk(base64PCM16: string) {
        if (!this.isConnected) return;

        const payload = {
            realtimeInput: {
                mediaChunks: [{
                    mimeType: 'audio/pcm;rate=16000',
                    data: base64PCM16
                }]
            }
        };
        this.ws?.send(JSON.stringify(payload));
    }

    private handleIncomingMessage(data: any) {
        try {
            let msg;
            if (data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.handleJSONMessage(JSON.parse(reader.result as string));
                };
                reader.readAsText(data);
                return;
            } else if (typeof data === 'string') {
                msg = JSON.parse(data);
            } else {
                msg = data;
            }

            this.handleJSONMessage(msg);
        } catch (e) {
            console.error("Error parsing live message", e);
        }
    }

    private handleJSONMessage(msg: any) {
        // Setup completion
        if (msg.setupComplete) {
            this.dispatchEvent(new Event('connected'));
            return;
        }

        if (msg.serverContent) {
            // End of turn
            if (msg.serverContent.turnComplete) {
                this.dispatchEvent(new Event('turnComplete'));
            }

            // Handle Audio Data
            if (msg.serverContent.modelTurn && msg.serverContent.modelTurn.parts) {
                for (const part of msg.serverContent.modelTurn.parts) {
                    if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                        const audioEvent = new CustomEvent('audio', { detail: part.inlineData.data });
                        this.dispatchEvent(audioEvent);
                    }
                }
            }
        }
    }

    public registerQuestion() {
        this.currentQuestionCount++;
        if (this.currentQuestionCount >= this.MAX_QUESTIONS) {
            const limitEvent = new CustomEvent('limitReached', { detail: 'Has alcanzado el límite de preguntas en esta demostración.' });
            this.dispatchEvent(limitEvent);
            setTimeout(() => this.disconnect(), 1000);
        }
    }
}
