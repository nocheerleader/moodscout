import { VoiceConfig } from './voiceMappings';

const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';

export class ElevenLabsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async textToSpeech(text: string, voiceConfig: VoiceConfig): Promise<ArrayBuffer> {
    const url = `${ELEVEN_LABS_API_URL}/text-to-speech/${voiceConfig.voiceId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: voiceConfig.settings,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`ElevenLabs API error: ${error.message || error.error || response.statusText}`);
    }

    return await response.arrayBuffer();
  }

  // Helper method to create an audio element from the API response
  static createAudioElement(audioData: ArrayBuffer): HTMLAudioElement {
    const blob = new Blob([audioData], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    
    // Clean up the URL when the audio is loaded
    audio.onload = () => URL.revokeObjectURL(url);
    
    return audio;
  }
} 