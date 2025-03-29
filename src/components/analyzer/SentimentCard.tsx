
import React from 'react';
import { Smile, Frown, Meh, Info } from 'lucide-react';

interface SentimentCardProps {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

const SentimentCard: React.FC<SentimentCardProps> = ({ sentiment, confidence }) => {
  // Helper function to get sentiment icon
  const getSentimentIcon = () => {
    switch (sentiment) {
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
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="flex items-center justify-between p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-4">
        {getSentimentIcon()}
        <div>
          <h3 className="text-xl font-bold capitalize">{sentiment} Sentiment</h3>
          <p className="text-gray-600">Overall tone of the text</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-600">Confidence</div>
        <div className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center relative">
          <div 
            className={`absolute inset-0 rounded-full ${getConfidenceColor()}`} 
            style={{ clipPath: `inset(${100 - confidence}% 0 0 0)` }}
          ></div>
          <span className="text-lg font-bold relative z-10">{confidence}%</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentCard;
