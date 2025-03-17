"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

/**
 * Type for tutorial item
 */
type Tutorial = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  author: string;
  date: string;
};

/**
 * Tutorials page component
 * @returns Tutorials page
 */
const TutorialsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  
  // Dummy data for tutorials
  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: 'Getting Started with Quest Generator',
      description: 'Learn the basics of using Quest Generator to create your first educational quest.',
      image: '/placeholder.jpg',
      category: 'platform',
      difficulty: 'Beginner',
      duration: '15 min',
      author: 'Quest Generator Team',
      date: '2023-05-15',
    },
    {
      id: 2,
      title: 'Creating Effective Quest Rewards',
      description: 'Best practices for setting up rewards that incentivize learning and engagement.',
      image: '/placeholder.jpg',
      category: 'rewards',
      difficulty: 'Intermediate',
      duration: '20 min',
      author: 'Maria Rodriguez',
      date: '2023-06-22',
    },
    {
      id: 3,
      title: 'Advanced Verification Methods',
      description: 'Explore different ways to verify quest completion for various types of tasks.',
      image: '/placeholder.jpg',
      category: 'technical',
      difficulty: 'Advanced',
      duration: '30 min',
      author: 'David Park',
      date: '2023-07-10',
    },
    {
      id: 4,
      title: 'Designing Educational Crypto Content',
      description: 'How to create engaging and informative content for crypto education.',
      image: '/placeholder.jpg',
      category: 'content',
      difficulty: 'Intermediate',
      duration: '25 min',
      author: 'Alex Chen',
      date: '2023-08-05',
    },
    {
      id: 5,
      title: 'Integrating Quests with Your Website',
      description: 'Step-by-step guide to embedding quests on your own website or application.',
      image: '/placeholder.jpg',
      category: 'technical',
      difficulty: 'Advanced',
      duration: '35 min',
      author: 'David Park',
      date: '2023-09-18',
    },
    {
      id: 6,
      title: 'Analytics and Tracking Quest Performance',
      description: 'How to use analytics to measure the success of your quests and improve engagement.',
      image: '/placeholder.jpg',
      category: 'analytics',
      difficulty: 'Intermediate',
      duration: '20 min',
      author: 'Maria Rodriguez',
      date: '2023-10-07',
    },
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'platform', name: 'Platform Basics' },
    { id: 'rewards', name: 'Rewards' },
    { id: 'technical', name: 'Technical' },
    { id: 'content', name: 'Content Creation' },
    { id: 'analytics', name: 'Analytics' },
  ];

  // Difficulty levels for filtering
  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'Beginner', name: 'Beginner' },
    { id: 'Intermediate', name: 'Intermediate' },
    { id: 'Advanced', name: 'Advanced' },
  ];

  /**
   * Filter tutorials based on selected category and difficulty
   * @returns Filtered tutorials
   */
  const getFilteredTutorials = () => {
    return tutorials.filter(tutorial => {
      const categoryMatch = activeCategory === 'all' || tutorial.category === activeCategory;
      const difficultyMatch = activeDifficulty === 'all' || tutorial.difficulty === activeDifficulty;
      return categoryMatch && difficultyMatch;
    });
  };

  const filteredTutorials = getFilteredTutorials();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Tutorials</h1>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Category Filter */}
            <div className="md:w-1/2 overflow-x-auto">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</h2>
              <div className="flex space-x-2 pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Difficulty Filter */}
            <div className="md:w-1/2 overflow-x-auto">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</h2>
              <div className="flex space-x-2 pb-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    onClick={() => setActiveDifficulty(difficulty.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      activeDifficulty === difficulty.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {difficulty.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tutorials Grid */}
          {filteredTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial) => (
                <Link 
                  key={tutorial.id} 
                  href={`/tutorials/${tutorial.id}`}
                  className="bg-white dark:bg-dark-200 rounded-lg shadow-sm border border-gray-200 dark:border-dark-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200 dark:bg-dark-100 relative">
                    <img 
                      src={tutorial.image} 
                      alt={tutorial.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x200';
                      }} 
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        tutorial.difficulty === 'Beginner' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : tutorial.difficulty === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {tutorial.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tutorial.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{tutorial.description}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{tutorial.duration}</span>
                      <span>{new Date(tutorial.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No tutorials found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveDifficulty('all');
                }}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorialsPage; 