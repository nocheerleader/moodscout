
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface HistoryHeaderProps {
  title: string;
}

const HistoryHeader: React.FC<HistoryHeaderProps> = ({ title }) => {
  const { signOut } = useAuth();
  
  return (
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
  );
};

export default HistoryHeader;
