"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

/**
 * Type for blog post
 */
type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  authorImage: string;
  date: string;
  readTime: string;
};

/**
 * Blog page component
 * @returns Blog page
 */
const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Dummy data for blog posts
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'The Future of Learn-to-Earn in Crypto Education',
      excerpt: 'Exploring how educational incentives are reshaping the way people learn about blockchain technology and cryptocurrency projects.',
      image: '/placeholder.jpg',
      category: 'trends',
      author: 'Alex Chen',
      authorImage: '/placeholder.jpg',
      date: '2023-11-15',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'How to Design Effective Educational Quests',
      excerpt: 'Best practices for creating engaging and informative quests that drive both learning and user acquisition.',
      image: '/placeholder.jpg',
      category: 'guides',
      author: 'Maria Rodriguez',
      authorImage: '/placeholder.jpg',
      date: '2023-10-28',
      readTime: '7 min read',
    },
    {
      id: 3,
      title: 'Case Study: How Project X Onboarded 10,000 Users with Educational Quests',
      excerpt: 'An in-depth look at how a DeFi protocol used Quest Generator to educate and onboard thousands of new users.',
      image: '/placeholder.jpg',
      category: 'case-studies',
      author: 'David Park',
      authorImage: '/placeholder.jpg',
      date: '2023-10-12',
      readTime: '8 min read',
    },
    {
      id: 4,
      title: 'The Psychology of Rewards in Educational Experiences',
      excerpt: 'Understanding how different reward structures affect motivation and learning outcomes in crypto education.',
      image: '/placeholder.jpg',
      category: 'research',
      author: 'Sarah Johnson',
      authorImage: '/placeholder.jpg',
      date: '2023-09-30',
      readTime: '6 min read',
    },
    {
      id: 5,
      title: 'Balancing Education and Marketing in Crypto Quests',
      excerpt: 'How to create quests that provide genuine educational value while still achieving marketing objectives.',
      image: '/placeholder.jpg',
      category: 'guides',
      author: 'Alex Chen',
      authorImage: '/placeholder.jpg',
      date: '2023-09-15',
      readTime: '5 min read',
    },
    {
      id: 6,
      title: 'The Role of Quests in Building Community Engagement',
      excerpt: 'Exploring how interactive educational experiences can strengthen community bonds and increase retention.',
      image: '/placeholder.jpg',
      category: 'community',
      author: 'Maria Rodriguez',
      authorImage: '/placeholder.jpg',
      date: '2023-08-22',
      readTime: '4 min read',
    },
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'trends', name: 'Trends' },
    { id: 'guides', name: 'Guides' },
    { id: 'case-studies', name: 'Case Studies' },
    { id: 'research', name: 'Research' },
    { id: 'community', name: 'Community' },
  ];

  /**
   * Filter blog posts by category
   * @returns Filtered blog posts
   */
  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Blog</h1>
          
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
          
          {/* Featured Post (first post) */}
          {filteredPosts.length > 0 && (
            <div className="mb-12">
              <Link 
                href={`/blog/${filteredPosts[0].id}`}
                className="block bg-white dark:bg-dark-200 rounded-lg shadow-sm border border-gray-200 dark:border-dark-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-64 md:h-auto bg-gray-200 dark:bg-dark-100">
                    <img 
                      src={filteredPosts[0].image} 
                      alt={filteredPosts[0].title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/800x600';
                      }} 
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium mb-4">
                        {categories.find(cat => cat.id === filteredPosts[0].category)?.name}
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{filteredPosts[0].title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">{filteredPosts[0].excerpt}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-100 overflow-hidden mr-4">
                        <img 
                          src={filteredPosts[0].authorImage} 
                          alt={filteredPosts[0].author} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/40';
                          }} 
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{filteredPosts[0].author}</p>
                        <div className="flex text-xs text-gray-500 dark:text-gray-400">
                          <span>{new Date(filteredPosts[0].date).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{filteredPosts[0].readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
          
          {/* Blog Posts Grid */}
          {filteredPosts.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.slice(1).map((post) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.id}`}
                  className="bg-white dark:bg-dark-200 rounded-lg shadow-sm border border-gray-200 dark:border-dark-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200 dark:bg-dark-100">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x200';
                      }} 
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium mb-3">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-100 overflow-hidden mr-3">
                        <img 
                          src={post.authorImage} 
                          alt={post.author} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/32';
                          }} 
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</p>
                        <div className="flex text-xs text-gray-500 dark:text-gray-400">
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No blog posts found in this category.
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
              >
                View All Posts
              </button>
            </div>
          )}
          
          {/* Newsletter Signup */}
          <div className="mt-16 bg-primary/10 dark:bg-primary/5 rounded-lg p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get the latest updates on crypto education, quest design, and platform features delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-100 bg-white dark:bg-dark-200 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage; 