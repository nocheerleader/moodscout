export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export interface VoiceConfig {
  voiceId: string;
  name: string;
  settings: VoiceSettings;
}

export interface ToneVoiceMapping {
  [key: string]: VoiceConfig;
}

// Default voice settings
const defaultSettings: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: true,
};

// Voice mappings for different tones
export const voiceMappings: ToneVoiceMapping = {
  friendly: {
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel - warm and friendly voice
    name: "Rachel",
    settings: {
      ...defaultSettings,
      stability: 0.7,
      style: 0.3,
    },
  },
  formal: {
    voiceId: "AZnzlk1XvdvUeBnXmlld", // Adam - professional and clear
    name: "Adam",
    settings: {
      ...defaultSettings,
      stability: 0.8,
      style: 0.1,
    },
  },
  excited: {
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Bella - energetic and upbeat
    name: "Bella",
    settings: {
      ...defaultSettings,
      stability: 0.4,
      style: 0.6,
    },
  },
  calm: {
    voiceId: "MF3mGyEYCl7XYWbV9V6O", // Elli - soft and calming
    name: "Elli",
    settings: {
      ...defaultSettings,
      stability: 0.9,
      style: 0.2,
    },
  },
  // Add more mappings as needed
};

// Helper function to get voice config for a tone
export const getVoiceForTone = (tone: string): VoiceConfig => {
  const normalizedTone = tone.toLowerCase();
  return voiceMappings[normalizedTone] || voiceMappings.formal; // Default to formal if tone not found
}; 