export const GEMINI_AUDIO_CONFIG = {
    sampleRate: 16000,
    outSampleRate: 24000,
    channels: 1,
    mimeType: 'audio/pcm;rate=16000',
};

// Converts AudioBuffer to PCM16 Int16Array
export function audioBufferToPCM16(audioBuffer: AudioBuffer): Int16Array {
    const float32Array = audioBuffer.getChannelData(0); // Assuming mono
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcm16;
}

// Converts PCM16 Int16Array to Base64 String
export function pcm16ToBase64(pcm16: Int16Array): string {
    const bytes = new Uint8Array(pcm16.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Converts Base64 to PCM16 Int16Array
export function base64ToPCM16(base64: string): Int16Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new Int16Array(bytes.buffer);
}

let nextPlaybackTime = 0;

export function resetAudioQueue() {
    nextPlaybackTime = 0;
}

export function playPCM16Base64(base64: string, audioContext: AudioContext, sampleRate: number = 24000): Promise<void> {
    return new Promise((resolve) => {
        const pcm16 = base64ToPCM16(base64);
        const float32Array = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
            float32Array[i] = pcm16[i] / 32768.0;
        }

        const audioBuffer = audioContext.createBuffer(1, float32Array.length, sampleRate);
        audioBuffer.copyToChannel(float32Array, 0);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        const currentTime = audioContext.currentTime;
        // Keep a 50ms buffer to prevent crackling if chunks are slightly delayed
        if (nextPlaybackTime < currentTime) {
            nextPlaybackTime = currentTime + 0.05;
        }

        source.start(nextPlaybackTime);
        nextPlaybackTime += audioBuffer.duration;

        source.onended = () => resolve();
    });
}
