
import React from 'react';
import { ChevronRightIcon } from './icons';

interface KeyFactorCardProps {
  factor: string;
}

const KeyFactorCard: React.FC<KeyFactorCardProps> = ({ factor }) => {
  return (
    <div className="card-border-glow bg-gray-900/50 p-6 rounded-lg flex flex-col items-start justify-between h-full">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 pt-1">
          <ChevronRightIcon className="h-6 w-6 text-blue-400" />
        </div>
        <p className="text-gray-300 text-base md:text-lg">
          {factor}
        </p>
      </div>
    </div>
  );
};

export default KeyFactorCard;
