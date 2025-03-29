
import React from 'react';

interface AnalysisTextCardProps {
  analysis: any;
}

const AnalysisTextCard: React.FC<AnalysisTextCardProps> = ({ analysis }) => {
  // Helper function to format analysis text
  const getFormattedAnalysis = () => {
    if (!analysis) return '';
    
    // If it's already a string, return it directly
    if (typeof analysis === 'string') {
      return analysis;
    }
    
    // If it's an object or array, stringify it
    try {
      return JSON.stringify(analysis, null, 2);
    } catch (e) {
      return 'Unable to display analysis.';
    }
  };
  
  return (
    <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-bold mb-3">Detailed Analysis</h3>
      <p className="text-gray-800 whitespace-pre-line">
        {getFormattedAnalysis()}
      </p>
    </div>
  );
};

export default AnalysisTextCard;
