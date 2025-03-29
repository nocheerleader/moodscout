
import React from 'react';

interface ConfusingElementsCardProps {
  elements: string[];
}

const ConfusingElementsCard: React.FC<ConfusingElementsCardProps> = ({ elements }) => {
  if (!elements || elements.length === 0) {
    return (
      <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-bold mb-3">Potentially Confusing Elements</h3>
        <p className="text-gray-600 italic">No potentially confusing elements were detected.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-bold mb-3">Potentially Confusing Elements</h3>
      <ul className="list-disc pl-5 space-y-2">
        {elements.map((element, index) => (
          <li key={index} className="text-gray-800">{element}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConfusingElementsCard;
