
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Analyzer = () => {
  const { user, signOut } = useAuth();
  const [inputText, setInputText] = useState('');
  
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
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-64 p-4 brutal-input resize-none text-lg"
              />
              
              <div className="mt-4">
                <Button className="brutal-button-accent w-full text-lg py-4">
                  Analyze Text
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results Section (Empty for now) */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-full h-full bg-[#3A86FF]/20 rounded-lg border-4 border-black"></div>
            <div className="relative z-10 bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full">
              <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
              <p className="text-gray-600">
                Your analysis results will appear here after you submit text.
              </p>
              
              <div className="mt-8 flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-500">Enter text and click "Analyze Text" to get started</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analyzer;
