"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * Documentation page component
 * @returns Documentation page
 */
const DocumentationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  // Documentation sections
  const sections = [
    { id: "getting-started", title: "Getting Started" },
    { id: "creating-quests", title: "Creating Quests" },
    { id: "rewards", title: "Setting Up Rewards" },
    { id: "verification", title: "Verification Methods" },
    { id: "api", title: "API Reference" },
    { id: "sdk", title: "SDK Integration" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Documentation
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="sticky top-8 bg-white dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-dark-100 p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contents
                </h2>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === section.id
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-100"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white dark:bg-dark-200 rounded-lg border border-gray-200 dark:border-dark-100 p-6">
                {activeSection === "getting-started" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Getting Started
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      Welcome to Quest Generator! This guide will help you get
                      started with creating and managing educational crypto
                      quests.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      What are Quests?
                    </h3>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      Quests are interactive learning experiences that guide
                      users through specific tasks related to crypto projects.
                      Each quest consists of a series of steps that users
                      complete to earn rewards.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Prerequisites
                    </h3>
                    <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                      <li>A crypto wallet (MetaMask, Phantom, etc.)</li>
                      <li>Basic understanding of blockchain concepts</li>
                      <li>Project details if you&apos;re creating quests</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Quick Start
                    </h3>
                    <ol className="list-decimal pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                      <li>Create an account or connect your wallet</li>
                      <li>Browse available quests or create your own</li>
                      <li>Complete quest steps to earn rewards</li>
                      <li>Track your progress in your dashboard</li>
                    </ol>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                      <h4 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
                        Tip
                      </h4>
                      <p className="text-blue-700 dark:text-blue-400">
                        Start with beginner quests if you&apos;re new to crypto,
                        or check out our tutorials section for guided
                        walkthroughs.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === "creating-quests" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Creating Quests
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      Learn how to create engaging educational quests for your
                      project.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      Quest Structure
                    </h3>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      A well-designed quest typically includes:
                    </p>
                    <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                      <li>Clear objectives and learning outcomes</li>
                      <li>Step-by-step instructions</li>
                      <li>Verification methods for each step</li>
                      <li>Appropriate rewards for completion</li>
                    </ul>

                    {/* More content would go here */}
                  </div>
                )}

                {activeSection === "rewards" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Setting Up Rewards
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      Learn how to configure rewards for your quests.
                    </p>

                    {/* Rewards content would go here */}
                  </div>
                )}

                {activeSection === "verification" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Verification Methods
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      Different ways to verify quest completion.
                    </p>

                    {/* Verification content would go here */}
                  </div>
                )}

                {activeSection === "api" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      API Reference
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      Comprehensive documentation for the Quest Generator API.
                    </p>

                    {/* API content would go here */}
                  </div>
                )}

                {activeSection === "sdk" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      SDK Integration
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      How to integrate Quest Generator into your application.
                    </p>

                    {/* SDK content would go here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentationPage;
