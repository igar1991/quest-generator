"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuestCard from '../components/QuestCard';

/**
 * Type definition for quest filter options
 */
type FilterOption = 'all' | 'newest' | 'popular' | 'rewards';

/**
 * Type definition for quest object
 */
type Quest = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  rewards: string;
  completions: number;
  steps: number;
};

/**
 * Explore Quests page component
 * @returns Explore Quests page
 */
const ExplorePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy data for quests - in a real app, this would come from an API
  const quests: Quest[] = [
    {
      id: 1,
      title: 'Introduction to Web3',
      description: 'Learn the basics of Web3 technology and decentralized applications.',
      image: '/placeholder.jpg',
      category: 'Beginner',
      rewards: '50 TOKENS',
      completions: 1234,
      steps: 5,
    },
    {
      id: 2,
      title: 'DeFi Fundamentals',
      description: 'Explore decentralized finance protocols and applications.',
      image: '/placeholder.jpg',
      category: 'Intermediate',
      rewards: '100 TOKENS',
      completions: 856,
      steps: 8,
    },
    {
      id: 3,
      title: 'NFT Creation Workshop',
      description: 'Create your first NFT and learn about digital ownership.',
      image: '/placeholder.jpg',
      category: 'Intermediate',
      rewards: '75 TOKENS',
      completions: 621,
      steps: 6,
    },
    {
      id: 4,
      title: 'Smart Contract Development',
      description: 'Build and deploy your own smart contracts.',
      image: '/placeholder.jpg',
      category: 'Advanced',
      rewards: '200 TOKENS',
      completions: 342,
      steps: 12,
    },
    {
      id: 5,
      title: 'Crypto Trading Basics',
      description: 'Learn fundamental strategies for cryptocurrency trading.',
      image: '/placeholder.jpg',
      category: 'Beginner',
      rewards: '50 TOKENS',
      completions: 978,
      steps: 4,
    },
    {
      id: 6,
      title: 'DAO Governance',
      description: 'Understand how decentralized autonomous organizations work.',
      image: '/placeholder.jpg',
      category: 'Intermediate',
      rewards: '125 TOKENS',
      completions: 413,
      steps: 7,
    },
  ];

  /**
   * Filters quests based on selected filter option
   * @param quests Array of quest objects
   * @param filter Current filter selection
   * @param search Search query string
   * @returns Filtered array of quests
   */
  const getFilteredQuests = (quests: Quest[], filter: FilterOption, search: string) => {
    // Filter by search query
    let filtered = quests;
    if (search) {
      filtered = quests.filter(quest => 
        quest.title.toLowerCase().includes(search.toLowerCase()) || 
        quest.description.toLowerCase().includes(search.toLowerCase()) ||
        quest.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply selected filter
    switch (filter) {
      case 'newest':
        // In a real app, this would sort by creation date
        return [...filtered];
      case 'popular':
        return [...filtered].sort((a, b) => b.completions - a.completions);
      case 'rewards':
        return [...filtered].sort((a, b) => {
          const aReward = Number(a.rewards.split(' ')[0]);
          const bReward = Number(b.rewards.split(' ')[0]);
          return bReward - aReward;
        });
      default:
        return filtered;
    }
  };

  const filteredQuests = getFilteredQuests(quests, activeFilter, searchQuery);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Explore Quests</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search quests..."
                  className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-200 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="absolute right-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200'
                }`}
              >
                All Quests
              </button>
              <button
                onClick={() => setActiveFilter('newest')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === 'newest'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200'
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setActiveFilter('popular')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === 'popular'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200'
                }`}
              >
                Most Popular
              </button>
              <button
                onClick={() => setActiveFilter('rewards')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === 'rewards'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200'
                }`}
              >
                Highest Rewards
              </button>
            </div>
          </div>
          
          {/* Quest Grid */}
          {filteredQuests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  title={quest.title}
                  description={quest.description}
                  image={quest.image}
                  category={quest.category}
                  rewards={quest.rewards}
                  steps={quest.steps}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No quests found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
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

export default ExplorePage; 