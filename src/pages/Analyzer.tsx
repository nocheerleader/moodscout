
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AnalyzerHeader from '@/components/analyzer/AnalyzerHeader';
import InputSection from '@/components/analyzer/InputSection';
import ResultsSection from '@/components/analyzer/ResultsSection';
import type { AnalysisResult } from '@/components/analyzer/ResultsSection';

const Analyzer = () => {
  const { user, signOut } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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
      
      setResult(data as AnalysisResult);
      
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
    } catch (err: any) {
      console.error('Error analyzing sentiment:', err);
      setError(err.message || 'Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <AnalyzerHeader signOut={signOut} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Text Analyzer</h1>
        
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
          />
        </div>
      </main>
    </div>
  );
};

export default Analyzer;
