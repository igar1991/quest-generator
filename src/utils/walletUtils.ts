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

/**
 * Gets the APT balance of the wallet
 * @returns The wallet balance in APT
 * @throws WalletError if balance check fails
 */
export const getWalletBalance = async (): Promise<number> => {
  try {
    if (typeof window === "undefined") {
      throw new WalletError("Cannot get balance in server environment");
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

    // For demo/testing purposes, we'll return a mock balance in the format of 10.123456
    // In a real implementation, you would use the wallet API or Aptos API to get the real balance
    const mockBalance = Math.random() * 10 + 0.5;
    return Number(mockBalance.toFixed(6));

    // Example of how you'd get the real balance in a production app
    // This is a simplified example and may not work with all wallets directly
    // try {
    //   // Some wallets might have a getBalance method
    //   if (typeof wallet.getBalance === 'function') {
    //     const balance = await wallet.getBalance(address);
    //     return Number(balance);
    //   }
    //
    //   // Alternatively, you might need to use the Aptos SDK or an API
    //   // const response = await fetch(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/resources`);
    //   // const resources = await response.json();
    //   // const coinResource = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
    //   // return Number(coinResource.data.coin.value) / 100000000; // Convert from octas to APT
    // } catch (error) {
    //   console.error("Error getting wallet balance:", error);
    //   throw new WalletError("Failed to get wallet balance");
    // }
  } catch (error) {
    if (error instanceof WalletError) {
      throw error;
    }

    throw new WalletError(
      error instanceof Error
        ? error.message
        : "Unknown error getting wallet balance",
    );
  }
};
