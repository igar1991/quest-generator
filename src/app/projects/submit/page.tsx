"use client";

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

/**
 * Project submission form page component
 * @returns Project submission form page
 */
const ProjectSubmitPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    website: '',
    category: '',
    description: '',
    contactEmail: '',
    logo: null as File | null,
    agreeToTerms: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Categories for the dropdown
  const categories = [
    'DeFi',
    'NFT',
    'Gaming',
    'Infrastructure',
    'DAO',
    'Social',
    'Wallet',
    'Exchange',
    'Other',
  ];

  /**
   * Handle input change for form fields
   * @param e Change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle checkbox change for terms agreement
   * @param e Change event
   */
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  /**
   * Handle file input change for logo upload
   * @param e Change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormState(prev => ({
        ...prev,
        logo: e.target.files![0],
      }));
    }
  };

  /**
   * Handle form submission
   * @param e Submit event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formState.name || !formState.website || !formState.category || !formState.description || !formState.contactEmail) {
      setSubmitError('Please fill in all required fields.');
      return;
    }
    
    if (!formState.agreeToTerms) {
      setSubmitError('You must agree to the terms and conditions.');
      return;
    }
    
    // Clear any previous errors
    setSubmitError('');
    
    // Simulate form submission
    setIsSubmitting(true);
    
    // In a real app, you would send the form data to your API here
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormState({
        name: '',
        website: '',
        category: '',
        description: '',
        contactEmail: '',
        logo: null,
        agreeToTerms: false,
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/projects" 
              className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Submit Your Project</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Add your project to Quest Generator and create educational quests to engage with users.
          </p>
          
          {submitSuccess ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Submission Received!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thank you for submitting your project. Our team will review your submission and get back to you soon.
              </p>
              <Link 
                href="/projects" 
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Return to Projects
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-200 rounded-lg shadow-sm border border-gray-200 dark:border-dark-100 p-6">
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  {submitError}
                </div>
              )}
              
              <div className="space-y-6">
                {/* Project Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-200 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formState.website}
                    onChange={handleInputChange}
                    placeholder="https://"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-200 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-200 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-200 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Briefly describe your project and what users can learn from your quests.
                  </p>
                </div>
                
                {/* Contact Email */}
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formState.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-200 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                {/* Logo Upload */}
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Logo
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-dark-100">
                      {formState.logo ? (
                        <img 
                          src={URL.createObjectURL(formState.logo)} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg className="h-full w-full text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </span>
                    <label
                      htmlFor="file-upload"
                      className="ml-5 bg-white dark:bg-dark-100 py-2 px-3 border border-gray-300 dark:border-dark-100 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
                    >
                      <span>Upload</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 2MB. Recommended size: 256x256px.
                  </p>
                </div>
                
                {/* Terms Agreement */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formState.agreeToTerms}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-dark-100 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeToTerms" className="font-medium text-gray-700 dark:text-gray-300">
                      I agree to the <Link href="/terms" className="text-primary hover:text-primary-dark">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:text-primary-dark">Privacy Policy</Link>
                    </label>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Project'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectSubmitPage; 