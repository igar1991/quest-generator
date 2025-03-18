/**
 * Mock data for quests in the Aptos ecosystem
 */
export const questsData = [
  {
    id: "1",
    title: "Get Started with Aptos Move",
    description:
      "Learn the basics of Move programming language and create your first smart contract on Aptos.",
    imageUrl: "/images/quests/aptos-move.jpg",
    projectName: "Aptos Foundation",
    reward: 5,
    difficulty: "Easy" as const,
    estimatedTime: "30 min",
    tasks: [
      {
        id: "1-1",
        type: "quiz",
        title: "Understand Move Basics",
        description: "Test your knowledge about the Move programming language",
        question: "What is Move primarily designed for?",
        options: [
          "General-purpose programming",
          "Web development",
          "Digital asset management and smart contracts",
          "Machine learning",
        ],
        correctAnswer: "Digital asset management and smart contracts",
      },
      {
        id: "1-2",
        type: "quiz",
        title: "Aptos Architecture",
        description: "Learn about the Aptos blockchain architecture",
        question: "Which of the following is NOT a key component of Aptos?",
        options: ["Move VM", "Solidity Runtime", "Block-STM", "BFT Consensus"],
        correctAnswer: "Solidity Runtime",
      },
      {
        id: "1-3",
        type: "connect-wallet",
        title: "Connect Your Wallet",
        description:
          "Connect your Aptos wallet to start interacting with the blockchain",
      },
      {
        id: "1-4",
        type: "quiz",
        title: "Smart Contract Security",
        description:
          "Test your knowledge about smart contract security principles",
        question: "Which security feature is built into the Move language?",
        options: [
          "Automatic memory management",
          "Resource types that prevent copying or implicit destruction",
          "Just-in-time compilation",
          "Dynamic typing",
        ],
        correctAnswer:
          "Resource types that prevent copying or implicit destruction",
      },
    ],
  },
  {
    id: "2",
    title: "Swap Tokens on Pontem",
    description:
      "Learn how to use Pontem DEX to swap tokens on the Aptos blockchain with competitive rates and low fees.",
    imageUrl: "/images/quests/pontem.jpg",
    projectName: "Pontem Network",
    reward: 3,
    difficulty: "Easy" as const,
    estimatedTime: "15 min",
    tasks: [
      {
        id: "2-1",
        type: "connect-wallet",
        title: "Connect to Pontem",
        description: "Connect your wallet to the Pontem DEX interface",
      },
      {
        id: "2-2",
        type: "quiz",
        title: "Understanding Liquidity Pools",
        description: "Learn about how liquidity pools work on Pontem",
        question: "What is the primary purpose of a liquidity pool in a DEX?",
        options: [
          "To store user credentials",
          "To facilitate token swaps without traditional order books",
          "To mine new tokens",
          "To verify user identities",
        ],
        correctAnswer:
          "To facilitate token swaps without traditional order books",
      },
      {
        id: "2-3",
        type: "check-balance",
        title: "Add APT to Your Wallet",
        description: "Add at least 0.01 APT to your wallet to continue",
        requiredAmount: "0.01",
      },
    ],
  },
  {
    id: "3",
    title: "Aptos Blockchain Quiz Challenge",
    description:
      "Test your knowledge about the Aptos blockchain technology and ecosystem through a series of educational quizzes.",
    imageUrl: "/images/quests/topaz.jpg",
    projectName: "Aptos Education",
    reward: 4,
    difficulty: "Medium" as const,
    estimatedTime: "25 min",
    tasks: [
      {
        id: "3-1",
        type: "quiz",
        title: "Aptos Fundamentals",
        description: "Test your knowledge of Aptos blockchain fundamentals",
        question: "What consensus mechanism does Aptos use?",
        options: [
          "Proof of Work",
          "Proof of Stake",
          "Proof of History",
          "Byzantine Fault Tolerance (BFT)",
        ],
        correctAnswer: "Byzantine Fault Tolerance (BFT)",
      },
      {
        id: "3-2",
        type: "quiz",
        title: "Move VM",
        description: "Understanding the Move Virtual Machine",
        question: "Where was the Move language originally developed?",
        options: [
          "Ethereum Foundation",
          "Facebook's Libra/Diem project",
          "Solana Labs",
          "Binance",
        ],
        correctAnswer: "Facebook's Libra/Diem project",
      },
      {
        id: "3-3",
        type: "quiz",
        title: "Aptos Tokenomics",
        description: "Learn about the APT token and its economics",
        question: "What is the primary utility of the APT token?",
        options: [
          "Governance only",
          "Transaction fees only",
          "Staking only",
          "All of the above",
        ],
        correctAnswer: "All of the above",
      },
      {
        id: "3-4",
        type: "quiz",
        title: "Aptos Development",
        description: "Learn about developing on Aptos",
        question:
          "Which programming language is primarily used for Aptos smart contract development?",
        options: ["JavaScript", "Solidity", "Move", "Rust"],
        correctAnswer: "Move",
      },
      {
        id: "3-5",
        type: "quiz",
        title: "Aptos Ecosystem",
        description: "Explore the growing Aptos ecosystem",
        question: "Which of the following is NOT an Aptos wallet?",
        options: ["Petra", "Martian", "Phantom", "Pontem"],
        correctAnswer: "Phantom",
      },
    ],
  },
  {
    id: "4",
    title: "Provide Liquidity on Liquid Swap",
    description:
      "Learn how to provide liquidity to Liquid Swap pools and earn passive income through trading fees.",
    imageUrl: "/images/quests/liquidswap.jpg",
    projectName: "Liquid Swap",
    reward: 7,
    difficulty: "Medium" as const,
    estimatedTime: "40 min",
    tasks: [
      {
        id: "4-1",
        type: "connect-wallet",
        title: "Connect Your Wallet",
        description: "Connect your wallet to the Liquid Swap platform",
      },
      {
        id: "4-2",
        type: "quiz",
        title: "Understanding Impermanent Loss",
        description: "Learn about the risks of providing liquidity",
        question: "What is impermanent loss in liquidity provision?",
        options: [
          "Loss of funds due to smart contract bugs",
          "The difference in value between holding assets vs providing liquidity when prices change",
          "Transaction fees paid to validators",
          "Loss of interest that could have been earned elsewhere",
        ],
        correctAnswer:
          "The difference in value between holding assets vs providing liquidity when prices change",
      },
      {
        id: "4-3",
        type: "check-balance",
        title: "Add Liquidity Tokens",
        description:
          "Add at least 0.05 APT to your wallet to practice liquidity provision",
        requiredAmount: "0.05",
      },
      {
        id: "4-4",
        type: "quiz",
        title: "LP Tokens",
        description: "Understanding Liquidity Provider tokens",
        question: "What do LP tokens represent?",
        options: [
          "Governance rights in the protocol",
          "Your share of the liquidity pool",
          "A loan from the protocol",
          "Rewards earned from transaction fees",
        ],
        correctAnswer: "Your share of the liquidity pool",
      },
    ],
  },
  {
    id: "5",
    title: "Build a Dapp with Petra Wallet",
    description:
      "Create a decentralized application that integrates with the Petra wallet for Aptos blockchain transactions.",
    imageUrl: "/images/quests/petra.jpg",
    projectName: "Petra Wallet",
    reward: 10,
    difficulty: "Hard" as const,
    estimatedTime: "60 min",
    tasks: [
      {
        id: "5-1",
        type: "connect-wallet",
        title: "Connect Petra Wallet",
        description:
          "Connect your Petra wallet to begin the development process",
      },
      {
        id: "5-2",
        type: "quiz",
        title: "Wallet Integration Basics",
        description: "Learn the fundamentals of wallet integration",
        question: "Which API does Petra wallet implement?",
        options: [
          "Web3.js",
          "ethers.js",
          "Wallet Standard",
          "None of the above",
        ],
        correctAnswer: "Wallet Standard",
      },
      {
        id: "5-3",
        type: "quiz",
        title: "Transaction Building",
        description: "Understanding how to build transactions with Petra",
        question:
          "Which of the following is NOT a step in sending a transaction via Petra?",
        options: [
          "Creating a transaction payload",
          "Running on-chain simulation",
          "Mining APT tokens",
          "Signing the transaction",
        ],
        correctAnswer: "Mining APT tokens",
      },
      {
        id: "5-4",
        type: "check-balance",
        title: "Fund Your Development Wallet",
        description:
          "Add at least 0.1 APT to your wallet for development testing",
        requiredAmount: "0.1",
      },
      {
        id: "5-5",
        type: "quiz",
        title: "Dapp Security Best Practices",
        description: "Learn about security considerations when building dapps",
        question: "Which is a best practice for dapp security?",
        options: [
          "Store private keys in local storage",
          "Always verify transaction payloads before signing",
          "Use client-side validation only",
          "Share API keys in frontend code",
        ],
        correctAnswer: "Always verify transaction payloads before signing",
      },
      {
        id: "5-6",
        type: "quiz",
        title: "User Experience Design",
        description: "Understanding UX principles for blockchain applications",
        question: "Why is progressive disclosure important in blockchain UX?",
        options: [
          "It helps hide the developer's code from users",
          "It reduces the complexity users face while maintaining functionality",
          "It improves transaction speed",
          "It's required by wallet providers",
        ],
        correctAnswer:
          "It reduces the complexity users face while maintaining functionality",
      },
    ],
  },
  {
    id: "6",
    title: "Stake APT with Tortuga Finance",
    description:
      "Learn how to stake your APT tokens using Tortuga Finance to earn staking rewards while maintaining liquidity.",
    imageUrl: "/images/quests/tortuga.jpg",
    projectName: "Tortuga Finance",
    reward: 6,
    difficulty: "Medium" as const,
    estimatedTime: "20 min",
    tasks: [
      {
        id: "6-1",
        type: "connect-wallet",
        title: "Connect to Tortuga",
        description: "Connect your wallet to the Tortuga Finance platform",
      },
      {
        id: "6-2",
        type: "quiz",
        title: "Liquid Staking Basics",
        description: "Understanding the concept of liquid staking",
        question:
          "What is the main advantage of liquid staking over traditional staking?",
        options: [
          "Higher rewards",
          "Lower risk",
          "Maintain liquidity while earning staking rewards",
          "Faster transactions",
        ],
        correctAnswer: "Maintain liquidity while earning staking rewards",
      },
      {
        id: "6-3",
        type: "check-balance",
        title: "Prepare for Staking",
        description: "Add at least 0.2 APT to your wallet for staking practice",
        requiredAmount: "0.2",
      },
      {
        id: "6-4",
        type: "quiz",
        title: "Staking Rewards",
        description: "Learn how staking rewards are calculated and distributed",
        question:
          "How are staking rewards typically distributed in liquid staking protocols?",
        options: [
          "Through increasing the value of staked tokens",
          "Daily airdrops to stakers' wallets",
          "Monthly manual claims",
          "Quarterly governance votes",
        ],
        correctAnswer: "Through increasing the value of staked tokens",
      },
    ],
  },
  {
    id: "7",
    title: "Aptos DeFi Fundamentals",
    description:
      "Learn the core concepts of decentralized finance on the Aptos blockchain through interactive quizzes.",
    imageUrl: "/images/quests/ans.jpg",
    projectName: "Aptos DeFi Alliance",
    reward: 3,
    difficulty: "Easy" as const,
    estimatedTime: "15 min",
    tasks: [
      {
        id: "7-1",
        type: "quiz",
        title: "DeFi Basics",
        description: "Understand the fundamental concepts of DeFi",
        question: "What does DeFi stand for?",
        options: [
          "Decentralized Financing",
          "Distributed Finance",
          "Decentralized Finance",
          "Digital Finance",
        ],
        correctAnswer: "Decentralized Finance",
      },
      {
        id: "7-2",
        type: "quiz",
        title: "Lending and Borrowing",
        description: "Learn about DeFi lending protocols",
        question:
          "What typically happens when a borrower's collateral falls below the required threshold?",
        options: [
          "The protocol sends them a warning email",
          "Their collateral gets liquidated",
          "They receive more time to add collateral",
          "Their account gets permanently banned",
        ],
        correctAnswer: "Their collateral gets liquidated",
      },
      {
        id: "7-3",
        type: "quiz",
        title: "Decentralized Exchanges",
        description: "Understanding how DEXs work on Aptos",
        question:
          "What is the primary difference between an AMM and an order book exchange?",
        options: [
          "AMMs use smart contracts while order books use centralized servers",
          "AMMs use liquidity pools for pricing while order books match buyers and sellers directly",
          "AMMs are faster than order book exchanges",
          "Order books are only used for derivatives trading",
        ],
        correctAnswer:
          "AMMs use liquidity pools for pricing while order books match buyers and sellers directly",
      },
    ],
  },
  {
    id: "8",
    title: "Trade on Econia DEX",
    description:
      "Learn how to use Econia, a high-performance central limit order book DEX on Aptos.",
    imageUrl: "/images/quests/econia.jpg",
    projectName: "Econia",
    reward: 8,
    difficulty: "Hard" as const,
    estimatedTime: "45 min",
  },
  {
    id: "9",
    title: "Deploy a Smart Contract with BlueMove",
    description:
      "Create and deploy a custom smart contract for NFTs using the BlueMove platform on Aptos.",
    imageUrl: "/images/quests/bluemove.jpg",
    projectName: "BlueMove",
    reward: 9,
    difficulty: "Hard" as const,
    estimatedTime: "50 min",
  },
  {
    id: "10",
    title: "Yield Farming with Ditto Finance",
    description:
      "Learn advanced yield farming strategies using Ditto Finance protocols on the Aptos blockchain.",
    imageUrl: "/images/quests/ditto.jpg",
    projectName: "Ditto Finance",
    reward: 7,
    difficulty: "Medium" as const,
    estimatedTime: "35 min",
  },
];
