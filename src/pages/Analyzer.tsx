
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { env } from '@/config/env';
import AnalyzerHeader from '@/components/analyzer/AnalyzerHeader';
import InputSection from '@/components/analyzer/InputSection';
import ResultsSection from '@/components/analyzer/ResultsSection';
import type { AnalysisResult } from '@/components/analyzer/ResultsSection';

// Helper function to extract tone from analysis text (client-side fallback)
const extractToneFromAnalysis = (analysis: string): string => {
  // Look for specific tone descriptions in the analysis
  if (/tone is (friendly|warm|kind|casual|conversational)/i.test(analysis) || 
      /(friendly|warm|kind|casual|conversational) tone/i.test(analysis)) {
    return 'friendly';
  }
  
  if (/tone is (formal|professional|serious|businesslike|assertive)/i.test(analysis) || 
      /(formal|professional|serious|businesslike|assertive) tone/i.test(analysis) || 
      /tone is (aggressive|angry|impatient)/i.test(analysis)) {
    return 'formal';
  }
  
  if (/tone is (excited|enthusiastic|energetic|passionate|upbeat)/i.test(analysis) || 
      /(excited|enthusiastic|energetic|passionate|upbeat) tone/i.test(analysis)) {
    return 'excited';
  }
  
  if (/tone is (calm|peaceful|relaxed|soothing|tranquil)/i.test(analysis) || 
      /(calm|peaceful|relaxed|soothing|tranquil) tone/i.test(analysis) || 
      /tone is (sad|melancholic|depressed)/i.test(analysis)) {
    return 'calm';
  }
  
  // Default to formal for negative emotions or calm for neutral
  return 'formal';
};

const Analyzer = () => {
  const { user, signOut } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string | null>(env.ELEVEN_LABS_API_KEY);
  
  // Log API key presence for debugging
  useEffect(() => {
    console.log("ElevenLabs API Key available:", !!elevenLabsApiKey);
  }, [elevenLabsApiKey]);
  
  const analyzeSentiment = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Text Required",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
        body: { text: inputText }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Ensure the tone field exists
      const processedResult = { ...(data as AnalysisResult) };
      if (!processedResult.tone && processedResult.analysis) {
        processedResult.tone = extractToneFromAnalysis(processedResult.analysis);
      }
      
      console.log("Analysis result with tone:", processedResult);
      setResult(processedResult);
      
      // Save the analysis to the database
      if (user) {
        const { error: saveError } = await supabase.from('analyses').insert({
          user_id: user.id,
          input_text: inputText,
          analysis_result: data
        });

        if (saveError) {
          console.error('Error saving analysis:', saveError);
          toast({
            title: "Analysis Saved",
            description: "Your analysis was completed but couldn't be saved to history.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Analysis Complete",
            description: "Your text has been analyzed and saved to history.",
          });
        }
      }
    } catch (err: unknown) {
      console.error('Error analyzing sentiment:', err);
      // Type guard to check if err is an Error object before accessing message property
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to analyze text. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#67168d]">
      {/* Header */}
      <AnalyzerHeader signOut={signOut} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-white text-4xl font-bold mb-8">Text Analyzer</h1>
        <p className="text-white text-l mb-8">Paste your message into the box below and click "Analyze Text" to instantly identify the emotional tone and sentiment.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <InputSection 
            inputText={inputText}
            setInputText={setInputText}
            analyzeSentiment={analyzeSentiment}
            isAnalyzing={isAnalyzing}
          />
          
          {/* Results Section */}
          <ResultsSection 
            result={result}
            isAnalyzing={isAnalyzing}
            error={error}
            elevenLabsApiKey={elevenLabsApiKey}
          />
        </div>
      </main>
    </div>
  );
};

export default Analyzer;
