"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Privacy Policy page component
 * @returns Privacy Policy page
 */
const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Quest Generator. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you how we look after your personal data when you visit our website
              and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. The Data We Collect</h2>
            <p className="mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Identity Data: includes username or similar identifier</li>
              <li>Contact Data: includes email address</li>
              <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting and location, 
                browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website</li>
              <li>Usage Data: includes information about how you use our website and services</li>
              <li>Blockchain Data: includes wallet addresses and transaction data</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
            <p className="mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>To register you as a new user</li>
              <li>To provide and improve our services</li>
              <li>To manage our relationship with you</li>
              <li>To administer and protect our business and website</li>
              <li>To track your progress in quests and verify completion</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p className="mb-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
              used or accessed in an unauthorized way, altered or disclosed. We also limit access to your personal data to 
              those employees, agents, contractors and other third parties who have a business need to know.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Legal Rights</h2>
            <p className="mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
              <br />
              <a href="mailto:privacy@quest-generator.com" className="text-primary hover:text-primary-dark">
                privacy@quest-generator.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy; 