"use client";

import React, { useEffect, useRef } from "react";
import { useWallet } from "../context/WalletContext";
import Button from "./ui/Button";

interface ConnectButtonProps {
  onSuccess?: (address: string) => void;
  className?: string;
}

/**
 * Button component for connecting to Aptos wallet
 * @param props Component props
 * @returns Connect button component
 */
const ConnectButton: React.FC<ConnectButtonProps> = ({
  onSuccess,
  className = "",
}) => {
  const {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    address,
    error,
    isAvailable,
  } = useWallet();

  // Use a ref to track if we've already called onSuccess to prevent loops
  const successCalled = useRef(false);

  // Handle success callback only once per connection
  useEffect(() => {
    if (isConnected && address && onSuccess && !successCalled.current) {
      successCalled.current = true;
      onSuccess(address);
    }

    // Reset the ref when disconnected
    if (!isConnected) {
      successCalled.current = false;
    }
  }, [isConnected, address, onSuccess]);

  /**
   * Handles wallet connection or disconnection
   */
  const handleConnectClick = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
      // Note: onSuccess is now called in the useEffect above
    }
  };

  // Format address for display (truncate middle)
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Generate button text based on connection state
  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    if (isConnected) return `Disconnect ${formatAddress(address || "")}`;
    if (!isAvailable) return "No Wallet Found";
    return `Connect Wallet`;
  };

  return (
    <div className="flex flex-col">
      <Button
        onClick={handleConnectClick}
        disabled={isConnecting || (!isAvailable && !isConnected)}
        variant={isConnected ? "danger" : "primary"}
        isLoading={isConnecting}
        fullWidth={true}
        className={`mb-2 ${className} text-white dark:text-white font-semibold border-2 border-primary`}
      >
        {getButtonText()}
      </Button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {!isAvailable && !isConnected && (
        <div className="mt-2 text-sm text-center">
          <a
            href="https://petra.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Install Wallet Extension
          </a>
        </div>
      )}
    </div>
  );
};

export default ConnectButton;
