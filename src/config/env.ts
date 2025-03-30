interface EnvConfig {
  ELEVEN_LABS_API_KEY: string;
}

export const env: EnvConfig = {
  ELEVEN_LABS_API_KEY: import.meta.env.VITE_ELEVEN_LABS_API_KEY || '',
};

// Validate required environment variables
const validateEnv = () => {
  const required: (keyof EnvConfig)[] = ['ELEVEN_LABS_API_KEY'];
  const missing = required.filter(key => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and make sure all required variables are set.'
    );
  }
};

// Run validation
validateEnv(); 