"use client";

import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * Type for project object
 */
type Project = {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode; // Using React element for abstract icon
  category: string;
  questCount: number;
  users: number;
  website: string;
};

/**
 * Abstract Icon component
 * @param props - Component props
 * @returns Abstract icon
 */
const AbstractIcon: React.FC<{
  color: string;
  secondaryColor: string;
  shape: "circle" | "square" | "hexagon" | "triangle" | "diamond";
  pattern: "dots" | "lines" | "waves" | "grid" | "solid";
}> = ({ color, secondaryColor, shape, pattern }) => {
  // SVG element based on shape
  const renderShape = () => {
    switch (shape) {
      case "circle":
        return <circle cx="24" cy="24" r="20" fill={color} />;
      case "square":
        return <rect x="4" y="4" width="40" height="40" rx="6" fill={color} />;
      case "hexagon":
        return (
          <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" fill={color} />
        );
      case "triangle":
        return <polygon points="24,4 44,44 4,44" fill={color} />;
      case "diamond":
        return <polygon points="24,4 44,24 24,44 4,24" fill={color} />;
      default:
        return <circle cx="24" cy="24" r="20" fill={color} />;
    }
  };

  // Pattern overlay
  const renderPattern = () => {
    switch (pattern) {
      case "dots":
        return (
          <g fill={secondaryColor}>
            <circle cx="16" cy="16" r="2" />
            <circle cx="24" cy="16" r="2" />
            <circle cx="32" cy="16" r="2" />
            <circle cx="16" cy="24" r="2" />
            <circle cx="24" cy="24" r="2" />
            <circle cx="32" cy="24" r="2" />
            <circle cx="16" cy="32" r="2" />
            <circle cx="24" cy="32" r="2" />
            <circle cx="32" cy="32" r="2" />
          </g>
        );
      case "lines":
        return (
          <g stroke={secondaryColor} strokeWidth="2">
            <line x1="12" y1="12" x2="36" y2="36" />
            <line x1="12" y1="20" x2="28" y2="36" />
            <line x1="20" y1="12" x2="36" y2="28" />
          </g>
        );
      case "waves":
        return (
          <path
            d="M8,20 C12,16 16,24 20,20 C24,16 28,24 32,20 C36,16 40,24 44,20"
            stroke={secondaryColor}
            strokeWidth="2"
            fill="none"
          />
        );
      case "grid":
        return (
          <g stroke={secondaryColor} strokeWidth="1">
            <line x1="16" y1="8" x2="16" y2="40" />
            <line x1="24" y1="8" x2="24" y2="40" />
            <line x1="32" y1="8" x2="32" y2="40" />
            <line x1="8" y1="16" x2="40" y2="16" />
            <line x1="8" y1="24" x2="40" y2="24" />
            <line x1="8" y1="32" x2="40" y2="32" />
          </g>
        );
      case "solid":
      default:
        return null;
    }
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderShape()}
      {renderPattern()}
    </svg>
  );
};

/**
 * Projects page component
 * @returns Projects page
 */
const ProjectsPage: React.FC = () => {
  // State for filtered projects and selected category
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Aptos ecosystem projects with abstract icons - wrapped in useMemo to prevent dependency changes
  const projects = useMemo(
    () => [
      {
        id: 1,
        name: "Aave",
        description: "The world's largest liquidity protocol.",
        icon: (
          <AbstractIcon
            color="#7C3AED"
            secondaryColor="#ffffff"
            shape="hexagon"
            pattern="dots"
          />
        ),
        category: "DeFi",
        questCount: 7,
        users: 8540,
        website: "https://aave.com",
      },
      {
        id: 2,
        name: "Merkle Trade",
        description: "The first-ever gamified omnichain perpetual DEX",
        icon: (
          <AbstractIcon
            color="#059669"
            secondaryColor="#ECFDF5"
            shape="square"
            pattern="lines"
          />
        ),
        category: "DeFi",
        questCount: 5,
        users: 6290,
        website: "https://merkle.trade",
      },
      {
        id: 3,
        name: "PACT",
        description:
          "The permissioned blockchain protocol for loan origination & securitization.",
        icon: (
          <AbstractIcon
            color="#3B82F6"
            secondaryColor="#EFF6FF"
            shape="circle"
            pattern="grid"
          />
        ),
        category: "DeFi",
        questCount: 4,
        users: 3478,
        website: "https://pact.fi",
      },
      {
        id: 4,
        name: "Ethena",
        description:
          "Issues USDe, the third largest crypto dollar with $6b+ in TVL",
        icon: (
          <AbstractIcon
            color="#0891B2"
            secondaryColor="#E0F2FE"
            shape="diamond"
            pattern="dots"
          />
        ),
        category: "Stablecoins",
        questCount: 6,
        users: 12350,
        website: "https://ethena.fi",
      },
      {
        id: 5,
        name: "Tether",
        description: "Stablecoin pioneer and market leader, launched in 2014.",
        icon: (
          <AbstractIcon
            color="#10B981"
            secondaryColor="#D1FAE5"
            shape="circle"
            pattern="solid"
          />
        ),
        category: "Stablecoins",
        questCount: 2,
        users: 15720,
        website: "https://tether.to",
      },
      {
        id: 6,
        name: "Pyth Network",
        description: "Largest first-party oracle network",
        icon: (
          <AbstractIcon
            color="#8B5CF6"
            secondaryColor="#EDE9FE"
            shape="triangle"
            pattern="waves"
          />
        ),
        category: "Oracles",
        questCount: 5,
        users: 4820,
        website: "https://pyth.network",
      },
      {
        id: 7,
        name: "Aptos Connect",
        description:
          "Keyless wallet with social login and no downloads required.",
        icon: (
          <AbstractIcon
            color="#F59E0B"
            secondaryColor="#FEF3C7"
            shape="hexagon"
            pattern="solid"
          />
        ),
        category: "Wallets",
        questCount: 3,
        users: 7650,
        website: "https://aptoslabs.com/connect",
      },
      {
        id: 8,
        name: "Petra Wallet",
        description: "A web3 wallet to explore Aptos by Aptos Labs",
        icon: (
          <AbstractIcon
            color="#EC4899"
            secondaryColor="#FCE7F3"
            shape="square"
            pattern="dots"
          />
        ),
        category: "Wallets",
        questCount: 8,
        users: 9240,
        website: "https://petra.app",
      },
      {
        id: 9,
        name: "Nansen",
        description:
          "Enriches onchain data with wallet labels for smarter investing.",
        icon: (
          <AbstractIcon
            color="#6366F1"
            secondaryColor="#E0E7FF"
            shape="diamond"
            pattern="grid"
          />
        ),
        category: "Analytics",
        questCount: 4,
        users: 5830,
        website: "https://nansen.ai",
      },
      {
        id: 10,
        name: "LayerZero",
        description: "Omnichain interoperability protocol",
        icon: (
          <AbstractIcon
            color="#2563EB"
            secondaryColor="#DBEAFE"
            shape="circle"
            pattern="lines"
          />
        ),
        category: "Bridges",
        questCount: 6,
        users: 8970,
        website: "https://layerzero.network",
      },
      {
        id: 11,
        name: "Wormhole Bridge",
        description:
          "Enables builders to expand to 20+ blockchains with one integration",
        icon: (
          <AbstractIcon
            color="#4F46E5"
            secondaryColor="#E0E7FF"
            shape="hexagon"
            pattern="waves"
          />
        ),
        category: "Bridges",
        questCount: 7,
        users: 10250,
        website: "https://wormhole.com",
      },
      {
        id: 12,
        name: "Stargate Finance",
        description: "The composable liquidity layer for omnichain DeFi.",
        icon: (
          <AbstractIcon
            color="#8B5CF6"
            secondaryColor="#EDE9FE"
            shape="square"
            pattern="grid"
          />
        ),
        category: "Bridges",
        questCount: 5,
        users: 7830,
        website: "https://stargate.finance",
      },
      {
        id: 13,
        name: "Rarible",
        description:
          "NFT company designed to lead builders, brands and creators to success.",
        icon: (
          <AbstractIcon
            color="#EF4444"
            secondaryColor="#FEE2E2"
            shape="triangle"
            pattern="dots"
          />
        ),
        category: "Marketplaces",
        questCount: 9,
        users: 14720,
        website: "https://rarible.com",
      },
      {
        id: 14,
        name: "KGeN",
        description: "Building the distribution layer of Web3 & AI.",
        icon: (
          <AbstractIcon
            color="#0EA5E9"
            secondaryColor="#F0F9FF"
            shape="diamond"
            pattern="lines"
          />
        ),
        category: "Gaming",
        questCount: 11,
        users: 13490,
        website: "https://kgen.online",
      },
      {
        id: 15,
        name: "READYgg",
        description:
          "Full tech stack, SDK, plug-ins for Unity, Unreal and other engines.",
        icon: (
          <AbstractIcon
            color="#F97316"
            secondaryColor="#FFF7ED"
            shape="circle"
            pattern="waves"
          />
        ),
        category: "Gaming",
        questCount: 8,
        users: 9720,
        website: "https://ready.gg",
      },
      {
        id: 16,
        name: "Aptos Art Museum",
        description: "The first metaverse art gallery in the Aptos ecosystem",
        icon: (
          <AbstractIcon
            color="#EC4899"
            secondaryColor="#FCE7F3"
            shape="hexagon"
            pattern="grid"
          />
        ),
        category: "NFT Tooling",
        questCount: 4,
        users: 6350,
        website: "https://aptosartmuseum.com",
      },
      {
        id: 17,
        name: "MoveBit",
        description: "Security audit and building the standard in Move.",
        icon: (
          <AbstractIcon
            color="#0D9488"
            secondaryColor="#CCFBF1"
            shape="square"
            pattern="dots"
          />
        ),
        category: "Security",
        questCount: 3,
        users: 5120,
        website: "https://movebit.xyz",
      },
      {
        id: 18,
        name: "Aptos Assistant",
        description: "AI-powered companion for the Aptos network.",
        icon: (
          <AbstractIcon
            color="#A855F7"
            secondaryColor="#F3E8FF"
            shape="triangle"
            pattern="lines"
          />
        ),
        category: "AI",
        questCount: 2,
        users: 7890,
        website: "https://assistant.aptosfoundation.org",
      },
      {
        id: 19,
        name: "Aptos Explorer",
        description: "Blockchain explorer by Aptos Labs",
        icon: (
          <AbstractIcon
            color="#6366F1"
            secondaryColor="#E0E7FF"
            shape="diamond"
            pattern="waves"
          />
        ),
        category: "Explorers",
        questCount: 1,
        users: 11430,
        website: "https://explorer.aptoslabs.com",
      },
      {
        id: 20,
        name: "PancakeSwap",
        description: "Multichain on BNB Chain, ETH & Aptos",
        icon: (
          <AbstractIcon
            color="#D946EF"
            secondaryColor="#FAE8FF"
            shape="circle"
            pattern="grid"
          />
        ),
        category: "DeFi",
        questCount: 10,
        users: 19870,
        website: "https://pancakeswap.finance",
      },
    ],
    [],
  );

  // Extract unique categories and sort them
  const categories = [
    "All",
    ...Array.from(new Set(projects.map((project) => project.category))).sort(),
  ];

  /**
   * Filter projects when category changes
   */
  useEffect(() => {
    const filtered =
      selectedCategory === "All"
        ? projects
        : projects.filter((project) => project.category === selectedCategory);

    setFilteredProjects(filtered);

    // Add animation delay
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => {
      setIsLoaded(false);
    };
  }, [selectedCategory, projects]);

  /**
   * Handle category selection
   * @param category - Selected category
   */
  const handleCategorySelect = (category: string) => {
    setIsLoaded(false);
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Aptos Ecosystem Projects
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Discover top projects building on the Aptos blockchain
              </p>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="mb-10 -mx-2 px-2 py-1">
            <div className="flex overflow-x-auto scrollbar-hide pb-4 snap-x space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-5 py-3 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 snap-start transition-all transform hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-primary text-black dark:text-white shadow-md"
                      : "bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-100 dark:border-dark-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden mr-4 relative bg-gray-50 dark:bg-dark-100 shadow-inner p-1">
                      {project.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {project.name}
                      </h3>
                      <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-dark-100 text-gray-800 dark:text-gray-200 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-5 line-clamp-2 h-12">
                    {project.description}
                  </p>

                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-5 border-t border-b border-gray-100 dark:border-dark-100 py-3">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.328.996.002 1.069c0 .358.186.687.465.874l8.61 5.533a1 1 0 001.079 0l8.61-5.533a.977.977 0 00.464-.874V6.808l-8.61-4.728z"></path>
                      </svg>
                      <span>{project.questCount} Quests</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                      </svg>
                      <span>{project.users.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md border border-blue-700"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                No projects found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Add global styles for scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
