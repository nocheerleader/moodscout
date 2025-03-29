
import React from 'react';
import { format } from 'date-fns';
import SentimentCard from '../analyzer/SentimentCard';
import EmotionsCard from '../analyzer/EmotionsCard';
import AnalysisTextCard from '../analyzer/AnalysisTextCard';
import ConfusingElementsCard from '../analyzer/ConfusingElementsCard';
import type { AnalysisResult } from '../analyzer/ResultsSection';

interface HistoryItemProps {
  analysis: {
    id: string;
    created_at: string;
    input_text: string;
    analysis_result: AnalysisResult;
  };
}

const HistoryItem: React.FC<HistoryItemProps> = ({ analysis }) => {
  const formattedDate = format(
    new Date(analysis.created_at),
    "PPPp" // March 12th, 2023, 2:30 PM
  );

  return (
    <div className="space-y-6">
      <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-bold mb-2">Input Text</h3>
        <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
          <p className="whitespace-pre-wrap">{analysis.input_text}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">Analyzed on {formattedDate}</p>
      </div>

      <div className="space-y-4">
        <SentimentCard
          sentiment={analysis.analysis_result.sentiment}
          confidence={analysis.analysis_result.confidence}
        />
        
        <EmotionsCard emotions={analysis.analysis_result.emotions} />
        
        <AnalysisTextCard analysis={analysis.analysis_result.analysis} />
        
        <ConfusingElementsCard elements={analysis.analysis_result.potentially_confusing_elements} />
      </div>
    </div>
  );
};

export default HistoryItem;
