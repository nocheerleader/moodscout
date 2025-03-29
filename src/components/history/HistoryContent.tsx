
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import HistoryTable from './HistoryTable';
import HistoryItem from './HistoryItem';
import EmptyHistory from './EmptyHistory';
import type { AnalysisResult } from '@/components/analyzer/ResultsSection';

interface Analysis {
  id: string;
  created_at: string;
  input_text: string;
  analysis_result: AnalysisResult;
}

interface HistoryContentProps {
  analyses: Analysis[];
  isLoading: boolean;
  error: string | null;
  onClearHistory: () => void;
}

const HistoryContent: React.FC<HistoryContentProps> = ({ 
  analyses, 
  isLoading, 
  error, 
  onClearHistory 
}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  
  return (
    <div className="relative">
      <div className="absolute -top-3 -left-3 w-full h-full bg-[#FCBF49]/20 rounded-lg border-4 border-black"></div>
      <div className="relative z-10 bg-white p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Recent Analyses</h2>
          {analyses.length > 0 && !selectedAnalysis && (
            <Button 
              className="brutal-button-outline text-base px-4 py-2"
              onClick={onClearHistory}
            >
              Clear History
            </Button>
          )}
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-2 border-gray-200 rounded-md">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : analyses.length > 0 ? (
          <>
            {selectedAnalysis ? (
              <div>
                <Button 
                  onClick={() => setSelectedAnalysis(null)}
                  className="brutal-button-outline text-base px-4 py-2 mb-4"
                >
                  Back to List
                </Button>
                <HistoryItem analysis={selectedAnalysis} />
              </div>
            ) : (
              <HistoryTable 
                analyses={analyses}
                onViewDetails={setSelectedAnalysis}
              />
            )}
          </>
        ) : (
          <EmptyHistory />
        )}
      </div>
    </div>
  );
};

export default HistoryContent;
