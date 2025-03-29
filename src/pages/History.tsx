
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const History = () => {
  const { signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="border-b-4 border-black bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">MoodScout</Link>
            
            <div className="flex items-center gap-4">
              <Link to="/analyzer" className="brutal-button-outline text-base px-4 py-2">
                Analyzer
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
        <h1 className="text-4xl font-bold mb-8">Analysis History</h1>
        
        <div className="relative">
          <div className="absolute -top-3 -left-3 w-full h-full bg-[#FCBF49]/20 rounded-lg border-4 border-black"></div>
          <div className="relative z-10 bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Recent Analyses</h2>
              <Button className="brutal-button-outline text-base px-4 py-2">
                Clear History
              </Button>
            </div>
            
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">No analyses yet</h3>
              <p className="text-gray-500 mb-4">Your analysis history will appear here</p>
              <Link to="/analyzer" className="brutal-button-secondary text-base px-4 py-2">
                Start Analyzing
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
