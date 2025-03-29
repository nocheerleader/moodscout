
import React from 'react';
import { Link } from 'react-router-dom';

const EmptyHistory: React.FC = () => {
  return (
    <div className="py-12 flex flex-col items-center justify-center">
      <div className="text-6xl mb-4">📋</div>
      <h3 className="text-xl font-bold mb-2">No analyses yet</h3>
      <p className="text-gray-500 mb-4">Your analysis history will appear here</p>
      <Link to="/analyzer" className="brutal-button-secondary text-base px-4 py-2">
        Start Analyzing
      </Link>
    </div>
  );
};

export default EmptyHistory;
