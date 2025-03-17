"use client";

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * Header component with responsive navigation
 * @returns Header component
 */
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-dark-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary mr-2">Quest</span>
              <span className="text-xl font-bold text-gray-800 dark:text-white">Generator</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/"
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/projects"
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            >
              Projects
            </Link>
            <Link 
              href="/about"
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Connect Wallet Button */}
          <div className="hidden md:flex">
            <button
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Connect Wallet
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center justify-center p-2 rounded-md"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg 
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close Icon */}
              <svg 
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-dark-200 shadow-lg">
          <Link 
            href="/"
            className="block text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-base font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/projects"
            className="block text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-base font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Projects
          </Link>
          <Link 
            href="/about"
            className="block text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary px-3 py-2 text-base font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <button
            className="w-full text-left bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-lg text-base font-medium transition-colors mt-3"
            onClick={() => setIsMenuOpen(false)}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 