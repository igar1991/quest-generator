/**
 * Quest steps data for each quest
 * Contains detailed information about each step in a quest
 */

export interface QuestStep {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  validationFunction?: (input: string) => { isValid: boolean; message: string };
}

/**
 * Validates if a string is a valid blockchain address
 * @param address The blockchain address to validate
 * @returns Object with validation result and message
 */
export const validateAptosAddress = (
  address: string,
): { isValid: boolean; message: string } => {
  // Blockchain addresses are 0x followed by 64 hex characters
  const regex = /^0x[a-fA-F0-9]{64}$/;

  if (!address) {
    return { isValid: false, message: "Address is required" };
  }

  if (!regex.test(address)) {
    return {
      isValid: false,
      message:
        "Invalid blockchain address format. Must start with 0x followed by 64 hex characters",
    };
  }

  return { isValid: true, message: "Valid blockchain address" };
};

/**
 * Quest steps data organized by quest id
 */
export const questStepsData: Record<string, QuestStep[]> = {
  "1": [
    {
      id: "1-1",
      title: "Connect Your Wallet",
      description:
        "Connect your compatible blockchain wallet to begin the quest.",
      iconUrl: "/images/quest-icons/wallet.svg",
      isCompleted: false,
      isLocked: false,
    },
    {
      id: "1-2",
      title: "Top Up With Tokens",
      description:
        "Add tokens to your wallet. You can get tokens from exchanges like Binance, Coinbase, or OKX.",
      iconUrl: "/images/quest-icons/topup.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-3",
      title: "Swap Tokens",
      description:
        "Exchange at least 1 token for USDT using a decentralized exchange.",
      iconUrl: "/images/quest-icons/swap.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-4",
      title: "Provide Liquidity",
      description:
        "Add liquidity to a token pool on a decentralized exchange to earn trading fees.",
      iconUrl: "/images/quest-icons/liquidity.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-5",
      title: "Stake Your Tokens",
      description:
        "Stake at least 1 token on a staking platform to earn staking rewards.",
      iconUrl: "/images/quest-icons/stake.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-6",
      title: "Mint an NFT",
      description: "Create and mint your first NFT on a marketplace.",
      iconUrl: "/images/quest-icons/nft.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-7",
      title: "Register a Domain",
      description:
        "Register your own domain name with a blockchain name service.",
      iconUrl: "/images/quest-icons/domain.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-8",
      title: "Use Bridge",
      description:
        "Bridge at least 1 USDT from one blockchain to another using LayerZero or Wormhole.",
      iconUrl: "/images/quest-icons/bridge.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-9",
      title: "Complete Quest",
      description: "Finish all previous steps and claim your rewards!",
      iconUrl: "/images/quest-icons/reward.svg",
      isCompleted: false,
      isLocked: true,
    },
  ],
  // Additional quests can be added here
};
