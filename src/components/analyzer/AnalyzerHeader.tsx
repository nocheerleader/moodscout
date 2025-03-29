
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AnalyzerHeaderProps {
  signOut: () => Promise<void>;
}

const AnalyzerHeader: React.FC<AnalyzerHeaderProps> = ({ signOut }) => {
  return (
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
  );
};

export default AnalyzerHeader;
