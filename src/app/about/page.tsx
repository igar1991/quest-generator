"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * About Us page component
 * @returns About Us page
 */
const AboutUs: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">About Quest Generator</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-6 text-lg">
              Quest Generator is a platform for creating educational crypto quests that reward users for learning about and using new projects.
            </p>

            <div className="bg-gray-50 dark:bg-dark-100 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="mb-0">
                To make crypto education interactive, accessible, and rewarding, helping projects find users and users discover valuable projects.
              </p>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 dark:border-dark-100 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">For Learners</h3>
                <p>
                  Provide interactive, step-by-step quests that teach practical crypto skills while earning rewards.
                </p>
              </div>
              <div className="border border-gray-200 dark:border-dark-100 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">For Projects</h3>
                <p>
                  Offer a platform to create educational onboarding experiences that connect projects with engaged users.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Our Values</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex">
                <span className="mr-2 text-primary">•</span>
                <div>
                  <strong>Education First:</strong> We believe learning should be accessible and engaging.
                </div>
              </li>
              <li className="flex">
                <span className="mr-2 text-primary">•</span>
                <div>
                  <strong>Practical Experience:</strong> Learning by doing creates deeper understanding.
                </div>
              </li>
              <li className="flex">
                <span className="mr-2 text-primary">•</span>
                <div>
                  <strong>Community Focused:</strong> We foster connections between projects and users.
                </div>
              </li>
              <li className="flex">
                <span className="mr-2 text-primary">•</span>
                <div>
                  <strong>Incentive Alignment:</strong> Rewards make learning more engaging and valuable.
                </div>
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">Our Team</h2>
            <p className="mb-6">
              Quest Generator was founded by a team of crypto enthusiasts and educators who recognized the need for better onboarding experiences in the ecosystem.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-dark-100 mx-auto mb-4"></div>
                <h3 className="font-medium">Ihar Charnyshou</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
