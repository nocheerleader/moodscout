
interface EnvConfig {
  ELEVEN_LABS_API_KEY: string | null;
}

export const env: EnvConfig = {
  // We need to make sure we're properly retrieving the API key from Supabase
  ELEVEN_LABS_API_KEY: import.meta.env.VITE_ELEVEN_LABS_API_KEY || null,
};

// Validate and log environment variables for debugging
const validateEnv = () => {
  // Log environment variables for debugging
  console.log("Environment variables loaded:", {
    hasElevenLabsKey: !!env.ELEVEN_LABS_API_KEY,
  });

  // No required environment variables for now
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
