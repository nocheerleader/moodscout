
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  analyzeSentiment: () => Promise<void>;
  isAnalyzing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ 
  inputText, 
  setInputText, 
  analyzeSentiment, 
  isAnalyzing 
}) => {
  return (
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
  );
};

export default InputSection;
