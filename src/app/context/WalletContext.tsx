"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  connectWallet,
  disconnectWallet,
  isWalletAvailable,
  detectWallet,
  WalletError,
} from "../../utils/walletUtils";

interface WalletContextType {
  address: string | null;
  walletName: string | null;
  isConnected: boolean;
  isAvailable: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  walletName: null,
  isConnected: false,
  isAvailable: false,
  isConnecting: false,
  error: null,
  connect: async () => {},
  disconnect: async () => {},
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
      if (!walletName) {
        const detected = detectWallet();
        if (detected) {
          setWalletName(detected);
        }
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
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
