
interface EnvConfig {
  ELEVEN_LABS_API_KEY: string | null;
}

export const env: EnvConfig = {
  ELEVEN_LABS_API_KEY: import.meta.env.VITE_ELEVEN_LABS_API_KEY || null,
};

// Validate required environment variables
const validateEnv = () => {
  // No required environment variables for now
  // We'll make ElevenLabs optional
  const missing: string[] = [];

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and make sure all required variables are set.'
    );
  }
};

// Run validation
validateEnv(); 
