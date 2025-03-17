"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Terms of Service page component
 * @returns Terms of Service page
 */
const TermsOfService: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing or using Quest Generator, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily access the materials on Quest Generator&apos;s website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
              under this license you may not:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on Quest Generator&apos;s website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Disclaimer</h2>
            <p className="mb-4">
              The materials on Quest Generator&apos;s website are provided on an &apos;as is&apos; basis. 
              Quest Generator makes no warranties, expressed or implied, and hereby disclaims and negates 
              all other warranties including, without limitation, implied warranties or conditions of merchantability, 
              fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Limitations</h2>
            <p className="mb-4">
              In no event shall Quest Generator or its suppliers be liable for any damages 
              (including, without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use the materials on Quest Generator&apos;s website, 
              even if Quest Generator or a Quest Generator authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Accuracy of Materials</h2>
            <p className="mb-4">
              The materials appearing on Quest Generator&apos;s website could include technical, typographical, or photographic errors. 
              Quest Generator does not warrant that any of the materials on its website are accurate, complete or current. 
              Quest Generator may make changes to the materials contained on its website at any time without notice.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Links</h2>
            <p className="mb-4">
              Quest Generator has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. 
              The inclusion of any link does not imply endorsement by Quest Generator of the site. 
              Use of any such linked website is at the user&apos;s own risk.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Modifications</h2>
            <p className="mb-4">
              Quest Generator may revise these terms of service for its website at any time without notice. 
              By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Governing Law</h2>
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably 
              submit to the exclusive jurisdiction of the courts in that location.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">9. Cryptocurrency and Blockchain</h2>
            <p className="mb-4">
              Quest Generator involves interaction with blockchain technology and cryptocurrency. Users acknowledge the risks 
              associated with these technologies, including price volatility, regulatory uncertainty, and technical vulnerabilities. 
              Users are responsible for the security of their own wallets and private keys.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:terms@quest-generator.com" className="text-primary hover:text-primary-dark">
                terms@quest-generator.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService; 