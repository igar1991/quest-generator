"use client";

import React from 'react';
import Link from 'next/link';

interface QuestCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectName: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
}

/**
 * QuestCard component displays information about a quest
 * @param props Quest information including title, description, reward, etc.
 * @returns QuestCard component
 */
const QuestCard: React.FC<QuestCardProps> = ({
  id,
  title,
  description,
  imageUrl: _imageUrl, // eslint-disable-line @typescript-eslint/no-unused-vars
  projectName,
  reward,
  difficulty,
  estimatedTime,
}) => {
  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  }[difficulty];

  return (
    <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] flex flex-col h-full">
      <div className="relative h-40 w-full bg-gradient-to-r from-primary/20 to-aptos/20">
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white mix-blend-overlay z-0">
          {projectName.substring(0, 1)}
        </div>
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium z-10">
          {reward} APT
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {projectName}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor}`}>
            {difficulty}
          </span>
        </div>
        
        <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-dark-200">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ⏱️ {estimatedTime}
          </span>
          
          <Link 
            href={`/quest/${id}`}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Start Quest
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestCard; 