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
 * Validates if a string is a valid Aptos address
 * @param address The Aptos address to validate
 * @returns Object with validation result and message
 */
export const validateAptosAddress = (
  address: string,
): { isValid: boolean; message: string } => {
  // Aptos addresses are 0x followed by 64 hex characters
  const regex = /^0x[a-fA-F0-9]{64}$/;

  if (!address) {
    return { isValid: false, message: "Address is required" };
  }

  if (!regex.test(address)) {
    return {
      isValid: false,
      message:
        "Invalid Aptos address format. Must start with 0x followed by 64 hex characters",
    };
  }

  return { isValid: true, message: "Valid Aptos address" };
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
        "Connect your Petra, Martian, or other Aptos-compatible wallet to begin the quest.",
      iconUrl: "/images/quest-icons/wallet.svg",
      isCompleted: false,
      isLocked: false,
    },
    {
      id: "1-2",
      title: "Verify Aptos Address",
      description:
        "Enter your Aptos wallet address to verify ownership and complete this step.",
      iconUrl: "/images/quest-icons/verify.svg",
      isCompleted: false,
      isLocked: true,
      validationFunction: validateAptosAddress,
    },
    {
      id: "1-3",
      title: "Top Up With 10 APT",
      description:
        "Add 10 APT to your wallet. You can get APT from exchanges like Binance, Coinbase, or OKX.",
      iconUrl: "/images/quest-icons/topup.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-4",
      title: "Swap APT to USDT",
      description:
        "Exchange at least 1 APT for 10 USDT using Pontem Network or Liquid Swap on Aptos.",
      iconUrl: "/images/quest-icons/swap.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-5",
      title: "Provide Liquidity",
      description:
        "Add liquidity to an APT-USDT pool on a decentralized exchange to earn trading fees.",
      iconUrl: "/images/quest-icons/liquidity.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-6",
      title: "Stake Your APT",
      description:
        "Stake at least 1 APT on a staking platform like Tortuga Finance to earn staking rewards.",
      iconUrl: "/images/quest-icons/stake.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-7",
      title: "Mint an NFT",
      description:
        "Create and mint your first NFT on Topaz or BlueMove marketplace on Aptos.",
      iconUrl: "/images/quest-icons/nft.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-8",
      title: "Register a .apt Domain",
      description:
        "Register your own .apt domain name with Aptos Name Service (ANS).",
      iconUrl: "/images/quest-icons/domain.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-9",
      title: "Use Bridge",
      description:
        "Bridge at least 1 USDT from Aptos to another blockchain using LayerZero or Wormhole.",
      iconUrl: "/images/quest-icons/bridge.svg",
      isCompleted: false,
      isLocked: true,
    },
    {
      id: "1-10",
      title: "Complete Quest",
      description: "Finish all previous steps and claim your rewards!",
      iconUrl: "/images/quest-icons/reward.svg",
      isCompleted: false,
      isLocked: true,
    },
  ],
  // Additional quests can be added here
};
