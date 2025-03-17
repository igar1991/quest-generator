"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

/**
 * Type for project object
 */
type Project = {
  id: number;
  name: string;
  description: string;
  logo: string;
  category: string;
  questCount: number;
  users: number;
  website: string;
};

/**
 * Projects page component
 * @returns Projects page
 */
const ProjectsPage: React.FC = () => {
  // Dummy data for projects - in a real app, this would come from an API
  const projects: Project[] = [
    {
      id: 1,
      name: 'AptoSwap',
      description: 'Decentralized exchange built on the Aptos blockchain with auto-compounding yield farms.',
      logo: '/placeholder.jpg',
      category: 'DeFi',
      questCount: 3,
      users: 1243,
      website: 'https://example.com',
    },
    {
      id: 2,
      name: 'Pixel Worlds',
      description: 'NFT-based metaverse game where players can build, trade and explore virtual lands.',
      logo: '/placeholder.jpg',
      category: 'Gaming',
      questCount: 5,
      users: 3567,
      website: 'https://example.com',
    },
    {
      id: 3,
      name: 'TrustVault',
      description: 'Multi-signature wallet solution with enhanced security features and social recovery.',
      logo: '/placeholder.jpg',
      category: 'Security',
      questCount: 2,
      users: 876,
      website: 'https://example.com',
    },
    {
      id: 4,
      name: 'DataChain',
      description: 'Decentralized data marketplace for secure data sharing and monetization.',
      logo: '/placeholder.jpg',
      category: 'Infrastructure',
      questCount: 4,
      users: 1120,
      website: 'https://example.com',
    },
    {
      id: 5,
      name: 'GovernanceDAO',
      description: 'Tools for creating and managing decentralized autonomous organizations.',
      logo: '/placeholder.jpg',
      category: 'Governance',
      questCount: 3,
      users: 743,
      website: 'https://example.com',
    },
    {
      id: 6,
      name: 'EcoFund',
      description: 'Climate-focused fundraising platform using blockchain for transparency.',
      logo: '/placeholder.jpg',
      category: 'Social Impact',
      questCount: 2,
      users: 428,
      website: 'https://example.com',
    },
  ];

  const categories = Array.from(new Set(projects.map(project => project.category)));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Discover projects creating educational quests
              </p>
            </div>
            <Link 
              href="/projects/submit" 
              className="mt-4 md:mt-0 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Submit Project
            </Link>
          </div>

          {/* Categories Filter */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white">
                All Projects
              </button>
              {categories.map((category) => (
                <button 
                  key={category}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200 whitespace-nowrap"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white dark:bg-dark-200 rounded-lg shadow-sm border border-gray-200 dark:border-dark-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-dark-100 overflow-hidden mr-4">
                      <img 
                        src={project.logo} 
                        alt={project.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/150';
                        }} 
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                      <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200 rounded">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{project.questCount} Quests</span>
                    <span>{project.users.toLocaleString()} Users</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/projects/${project.id}`} 
                      className="flex-1 text-center px-4 py-2 bg-primary text-white rounded font-medium hover:bg-primary-dark transition-colors"
                    >
                      View Quests
                    </Link>
                    <a 
                      href={project.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-gray-300 dark:border-dark-100 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors"
                    >
                      Website
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage; 