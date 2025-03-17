/**
 * Utility functions for interacting with Aptos wallet extensions
 */

/**
 * Interface for wallet information
 */
interface WalletInfo {
  address: string;
  publicKey?: string;
  isConnected: boolean;
}

/**
 * Error thrown when wallet interaction fails
 */
export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletError";
  }
}

/**
 * Checks if any Aptos wallet extensions are available in the browser
 * @returns Boolean indicating if wallet extension is available
 */
export const isWalletAvailable = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!(
    window.aptos ||
    window.petra ||
    window.martian ||
    window.pontem ||
    window.fewcha ||
    window.rise
  );
};

/**
 * Attempts to detect which wallet is installed
 * @returns The name of the detected wallet or null if none found
 */
export const detectWallet = (): string | null => {
  if (typeof window === "undefined") return null;

  if (window.petra) return "Petra";
  if (window.martian) return "Martian";
  if (window.pontem) return "Pontem";
  if (window.fewcha) return "Fewcha";
  if (window.rise) return "Rise";
  if (window.aptos) return "Aptos";

  return null;
};

/**
 * Connects to an Aptos wallet and returns the address
 * @returns The wallet info including address and connection status
 * @throws WalletError if connection fails or no wallet is found
 */
export const connectWallet = async (): Promise<WalletInfo> => {
  try {
    if (typeof window === "undefined") {
      throw new WalletError("Cannot connect to wallet in server environment");
    }

    // Try to find an available wallet
    const wallet =
      window.petra ||
      window.martian ||
      window.pontem ||
      window.fewcha ||
      window.rise ||
      window.aptos;

    if (!wallet) {
      throw new WalletError(
        "No Aptos wallet extension found. Please install Petra, Martian, or another Aptos wallet.",
      );
    }

    // Connect to the wallet
    await wallet.connect();

    // Get account information
    const account = await wallet.account();

    if (!account || !account.address) {
      throw new WalletError("Failed to get wallet address");
    }

    return {
      address: account.address,
      publicKey: account.publicKey,
      isConnected: true,
    };
  } catch (error) {
    if (error instanceof WalletError) {
      throw error;
    }

    throw new WalletError(
      error instanceof Error
        ? error.message
        : "Unknown error connecting to wallet",
    );
  }
};

/**
 * Disconnects from the currently connected wallet
 * @returns A boolean indicating whether the disconnect was successful
 */
export const disconnectWallet = async (): Promise<boolean> => {
  try {
    if (typeof window === "undefined") return false;

    const wallet =
      window.petra ||
      window.martian ||
      window.pontem ||
      window.fewcha ||
      window.rise ||
      window.aptos;

    if (!wallet) return false;

    // Check if disconnect method exists
    if (typeof wallet.disconnect === "function") {
      await wallet.disconnect();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error disconnecting wallet:", error);
    return false;
  }
};
