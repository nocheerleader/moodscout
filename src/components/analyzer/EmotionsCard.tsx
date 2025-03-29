
import React from 'react';

interface EmotionsCardProps {
  emotions: string[];
}

const EmotionsCard: React.FC<EmotionsCardProps> = ({ emotions }) => {
  if (emotions.length === 0) return null;
  
  return (
    <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-bold mb-3">Emotions Detected</h3>
      <div className="flex flex-wrap gap-2">
        {emotions.map((emotion, index) => (
          <span 
            key={index} 
            className="px-3 py-1 border-2 border-black rounded-full text-sm font-medium bg-[#FFD166]"
          >
            {emotion}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EmotionsCard;
