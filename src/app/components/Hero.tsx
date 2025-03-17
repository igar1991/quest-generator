"use client";

import React from 'react';
import Link from 'next/link';

/**
 * Hero section component for the main page
 * @returns Hero component
 */
const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-dark-300 dark:to-dark-200 overflow-hidden">
      <div className="absolute inset-0">
        <svg
          className="absolute left-full transform -translate-y-1/4 -translate-x-1/3 lg:-translate-x-1/2 opacity-20 dark:opacity-10"
          width="404"
          height="784"
          fill="none"
          viewBox="0 0 404 784"
        >
          <defs>
            <pattern
              id="grid-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" className="text-primary opacity-50" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="784" fill="url(#grid-pattern)" />
        </svg>
        <svg
          className="absolute right-full bottom-0 transform translate-x-1/3 lg:translate-x-1/2 opacity-20 dark:opacity-10"
          width="404"
          height="784"
          fill="none"
          viewBox="0 0 404 784"
        >
          <defs>
            <pattern
              id="grid-pattern-2"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" className="text-aptos opacity-50" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="784" fill="url(#grid-pattern-2)" />
        </svg>
      </div>
      
      <div className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Learn <span className="text-primary">Aptos</span> by</span>
              <span className="block mt-1">Completing <span className="text-aptos">Quests</span></span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore educational quests that reward you with tokens for learning about and using new projects in the Aptos ecosystem.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/projects"
                className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg text-lg font-extrabold tracking-wide transition-colors shadow-lg"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}
              >
                Browse Projects
              </Link>
              <Link
                href="/create"
                className="w-full sm:w-auto bg-white dark:bg-dark-100 hover:bg-gray-50 dark:hover:bg-dark-200 text-gray-800 dark:text-white px-6 py-3 rounded-lg text-base font-medium border border-gray-200 dark:border-dark-200 transition-colors"
              >
                Create a Quest
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary dark:bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">Learn by doing</span>
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary dark:bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">Earn rewards</span>
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary dark:bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">Trusted projects</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 