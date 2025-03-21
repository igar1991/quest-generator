"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  connectWallet,
  disconnectWallet,
  isWalletAvailable,
  detectWallet,
  getWalletBalance,
  WalletError,
} from "../../utils/walletUtils";

interface WalletContextType {
  address: string | null;
  walletName: string | null;
  isConnected: boolean;
  isAvailable: boolean;
  isConnecting: boolean;
  error: string | null;
  balance: number | undefined;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  walletName: null,
  isConnected: false,
  isAvailable: false,
  isConnecting: false,
  error: null,
  balance: undefined,
  connect: async () => {},
  disconnect: async () => {},
  refreshBalance: async () => {},
});

/**
 * Hook to use the wallet context
 * @returns Wallet context values and functions
 */
export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the app and provides wallet functionality
 * @param props Props with children components
 * @returns Context provider component
 */
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  // Check if wallet is available on client
  useEffect(() => {
    const checkWalletAvailability = () => {
      setIsAvailable(isWalletAvailable());
      const detected = detectWallet();
      if (detected) {
        setWalletName(detected);
      }
    };

    checkWalletAvailability();
  }, []);

  /**
   * Refresh the wallet balance
   */
  const refreshBalance = useCallback(async (): Promise<void> => {
    if (!(isConnected && address)) {
      setBalance(undefined);
      return;
    }

    try {
      const walletBalance = await getWalletBalance();
      setBalance(walletBalance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setBalance(undefined);
    }
  }, [isConnected, address]);

  // Refresh balance whenever address changes
  useEffect(() => {
    if (address !== undefined && address !== null && address !== "") {
      refreshBalance();
    }
  }, [address, refreshBalance]);

  // Detect wallet if available but not connected
  useEffect(() => {
    if (isAvailable && !isConnected && walletName === null) {
      const detected = detectWallet();
      if (detected !== null && detected !== undefined && detected !== "") {
        setWalletName(detected);
      }
    }
  }, [isAvailable, isConnected, walletName]);

  /**
   * Connect to wallet and get account info
   */
  const connect = async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);

    try {
      const walletInfo = await connectWallet();
      setAddress(walletInfo.address);
      setIsConnected(walletInfo.isConnected);

      // Update wallet name if not already set
      if (walletName === null) {
        const detected = detectWallet();
        if (detected !== null) {
          setWalletName(detected);
        }
      }

      // Get initial balance
      if (
        walletInfo.address !== undefined &&
        walletInfo.address !== null &&
        walletInfo.address.length > 0
      ) {
        await refreshBalance();
      }
    } catch (error) {
      let message = "Failed to connect to wallet";

      if (error instanceof WalletError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      setError(message);
      setIsConnected(false);
      setAddress(null);
      setBalance(undefined);
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnect from wallet
   */
  const disconnect = async (): Promise<void> => {
    try {
      await disconnectWallet();
      setIsConnected(false);
      setAddress(null);
      setBalance(undefined);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        walletName,
        isConnected,
        isAvailable,
        isConnecting,
        error,
        balance,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
