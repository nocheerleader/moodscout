
import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { env } from '@/config/env';
import SentimentCard from './SentimentCard';
import EmotionsCard from './EmotionsCard';
import AnalysisTextCard from './AnalysisTextCard';
import ConfusingElementsCard from './ConfusingElementsCard';
import { TonePlayer } from '@/components/TonePlayer';

// Define the Analysis Result type
export type AnalysisResult = {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  analysis: string;
  potentially_confusing_elements: string[];
  tone?: string; // The detected tone for voice playback
};

interface ResultsSectionProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  elevenLabsApiKey?: string | null;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  result, 
  isAnalyzing, 
  error, 
  elevenLabsApiKey = env.ELEVEN_LABS_API_KEY 
}) => {
  // Log for debugging
  useEffect(() => {
    console.log("ResultsSection loaded with:", { 
      hasTone: !!result?.tone, 
      hasApiKey: !!elevenLabsApiKey,
      apiKeyValue: elevenLabsApiKey ? "API key exists" : "No API key",
      envApiKey: env.ELEVEN_LABS_API_KEY ? "ENV API key exists" : "No ENV API key"
    });
  }, [result, elevenLabsApiKey]);

  return (
    <div className="relative">
      <div className="absolute -top-3 -left-3 w-full h-full bg-[#3A86FF]/20 rounded-lg border-4 border-black"></div>
      <div className="relative z-10 bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full">
        <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-gray-500">Analyzing your text...</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Sentiment Overview */}
            <SentimentCard 
              sentiment={result.sentiment} 
              confidence={result.confidence} 
            />
            
            {/* Tone Player - Always show if we have a tone */}
            {result.tone && (
              <div className="p-4 border-4 border-black rounded-lg bg-[#FFD166]/100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-bold mb-2">Hear this in {result.tone} tone</h3>
                <TonePlayer
                  text={result.analysis}
                  tone={result.tone}
                  apiKey={elevenLabsApiKey}
                />
              </div>
            )}
            
            {/* Emotions Detected */}
            <EmotionsCard emotions={result.emotions} />
            
            {/* Detailed Analysis */}
            <AnalysisTextCard analysis={result.analysis} />
            
            {/* Potentially Confusing Elements */}
            <ConfusingElementsCard elements={result.potentially_confusing_elements} />
          </div>
        ) : (
          <div className="mt-8 flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500">Enter text and click "Analyze Text" to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsSection;
