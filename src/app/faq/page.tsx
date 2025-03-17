"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Type for FAQ item
 */
type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

/**
 * FAQ page component
 * @returns FAQ page
 */
const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  // FAQ data
  const faqItems: FAQItem[] = [
    {
      question: 'What is Quest Generator?',
      answer: 'Quest Generator is a platform for creating educational crypto quests that reward users for learning about and using new projects. It helps users learn through interactive tasks while earning rewards.',
      category: 'general',
    },
    {
      question: 'How do I create a quest?',
      answer: 'To create a quest, you need to sign up for an account, navigate to the creator dashboard, and click on "Create New Quest". From there, you can define steps, set up rewards, and publish your quest for users to discover.',
      category: 'creators',
    },
    {
      question: 'How do rewards work?',
      answer: 'Rewards are typically distributed in the form of tokens or NFTs upon successful completion of a quest. Quest creators set up the reward parameters, and our system handles verification and distribution automatically.',
      category: 'rewards',
    },
    {
      question: 'Can I participate in quests without a crypto wallet?',
      answer: 'While you can browse and learn from quests without a wallet, you&apos;ll need a compatible crypto wallet to receive rewards. We support most major wallets including MetaMask, Phantom, and others.',
      category: 'users',
    },
    {
      question: 'How are quest completions verified?',
      answer: 'Quest Generator uses various verification methods depending on the quest type, including on-chain transaction verification, API integrations, and quiz completions. Creators can choose the appropriate verification method for each step.',
      category: 'technical',
    },
    {
      question: 'Is Quest Generator free to use?',
      answer: 'Basic quest creation and participation is free. Premium features for creators, such as advanced analytics and customization options, may require a subscription or fee. All fees are clearly displayed before you commit.',
      category: 'general',
    },
    {
      question: 'Which blockchains are supported?',
      answer: 'Quest Generator currently supports Ethereum, Solana, Aptos, and several other major blockchains. We&apos;re continuously adding support for more chains based on community demand.',
      category: 'technical',
    },
    {
      question: 'How do I track my progress?',
      answer: 'Your quest progress is automatically tracked in your user dashboard. You can see which steps you&apos;ve completed, pending verifications, and rewards earned across all quests you&apos;ve participated in.',
      category: 'users',
    },
    {
      question: 'Can I embed quests on my own website?',
      answer: 'Yes, we offer embedding options for creators who want to host quests on their own websites. You can use our SDK or iframe solutions to seamlessly integrate quests into your existing web presence.',
      category: 'creators',
    },
    {
      question: 'How are rewards funded?',
      answer: 'Quest creators are responsible for funding the rewards for their quests. They can deposit tokens into a secure escrow that automatically distributes rewards upon verified completion.',
      category: 'rewards',
    },
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'general', name: 'General' },
    { id: 'users', name: 'For Users' },
    { id: 'creators', name: 'For Creators' },
    { id: 'rewards', name: 'Rewards' },
    { id: 'technical', name: 'Technical' },
  ];

  /**
   * Toggle FAQ item expansion
   * @param index Index of FAQ item to toggle
   */
  const toggleItem = (index: number) => {
    setExpandedItems((prev) => 
      prev.includes(index) 
        ? prev.filter((i) => i !== index) 
        : [...prev, index]
    );
  };

  /**
   * Filter FAQ items by category
   * @returns Filtered FAQ items
   */
  const filteredItems = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h1>
          
          {/* Category Tabs */}
          <div className="mb-8 overflow-x-auto">
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
          
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div 
                key={index} 
                className="border border-gray-200 dark:border-dark-100 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="flex justify-between items-center w-full px-6 py-4 text-left bg-white dark:bg-dark-200 hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform ${expandedItems.includes(index) ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedItems.includes(index) && (
                  <div className="px-6 py-4 bg-gray-50 dark:bg-dark-100">
                    <p className="text-gray-700 dark:text-gray-300">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Contact Section */}
          <div className="mt-12 bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Still have questions?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you couldn&apos;t find the answer to your question, feel free to contact our support team.
            </p>
            <a 
              href="mailto:support@quest-generator.com" 
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage; 