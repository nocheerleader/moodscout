
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Check, Frown, Info, Meh, Smile } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the Analysis Result type
type AnalysisResult = {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  analysis: string;
  potentially_confusing_elements: string[];
};

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
        await supabase.from('analyses').insert({
          user_id: user.id,
          input_text: inputText,
          analysis_result: data
        });
      }
    } catch (err: any) {
      console.error('Error analyzing sentiment:', err);
      setError(err.message || 'Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Helper function to get sentiment icon
  const getSentimentIcon = () => {
    if (!result) return null;
    
    switch (result.sentiment) {
      case 'positive':
        return <Smile className="h-12 w-12 text-green-500" />;
      case 'negative':
        return <Frown className="h-12 w-12 text-red-500" />;
      case 'neutral':
        return <Meh className="h-12 w-12 text-blue-500" />;
      default:
        return <Info className="h-12 w-12 text-gray-500" />;
    }
  };
  
  // Helper function to get confidence color
  const getConfidenceColor = () => {
    if (!result) return 'bg-gray-200';
    
    if (result.confidence >= 80) return 'bg-green-500';
    if (result.confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">MoodScout</Link>
            
            <div className="flex items-center gap-4">
              <Link to="/history" className="brutal-button-outline text-base px-4 py-2">
                History
              </Link>
              <Button 
                onClick={signOut}
                className="brutal-button-primary text-base px-4 py-2"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Text Analyzer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-full h-full bg-[#FF5A5F]/20 rounded-lg border-4 border-black"></div>
            <div className="relative z-10 bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-bold mb-4">Enter Text to Analyze</h2>
              <p className="text-gray-600 mb-4">
                Paste in the text you'd like to analyze for tone and sentiment.
              </p>
              
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-64 p-4 brutal-input resize-none text-lg"
              />
              
              <div className="mt-4">
                <Button 
                  className="brutal-button-accent w-full text-lg py-4"
                  onClick={analyzeSentiment}
                  disabled={isAnalyzing || !inputText.trim()}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Text"}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-full h-full bg-[#3A86FF]/20 rounded-lg border-4 border-black"></div>
            <div className="relative z-10 bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full overflow-y-auto max-h-[650px]">
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
                  <div className="flex items-center justify-between p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-4">
                      {getSentimentIcon()}
                      <div>
                        <h3 className="text-xl font-bold capitalize">{result.sentiment} Sentiment</h3>
                        <p className="text-gray-600">Overall tone of the text</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-600">Confidence</div>
                      <div className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center relative">
                        <div 
                          className={`absolute inset-0 rounded-full ${getConfidenceColor()}`} 
                          style={{ clipPath: `inset(${100 - result.confidence}% 0 0 0)` }}
                        ></div>
                        <span className="text-lg font-bold relative z-10">{result.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Emotions Detected */}
                  {result.emotions.length > 0 && (
                    <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="text-lg font-bold mb-3">Emotions Detected</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.emotions.map((emotion, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 border-2 border-black rounded-full text-sm font-medium bg-[#FFD166]"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Detailed Analysis */}
                  <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-lg font-bold mb-3">Detailed Analysis</h3>
                    <p className="text-gray-800 whitespace-pre-line">{result.analysis}</p>
                  </div>
                  
                  {/* Potentially Confusing Elements */}
                  {result.potentially_confusing_elements.length > 0 && (
                    <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="text-lg font-bold mb-3">Potentially Confusing Elements</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {result.potentially_confusing_elements.map((element, index) => (
                          <li key={index} className="text-gray-800">{element}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
        </div>
      </main>
    </div>
  );
};

export default Analyzer;
