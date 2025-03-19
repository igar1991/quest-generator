"use client";

import React, { useEffect, useRef } from "react";
import { useWallet } from "../context/WalletContext";
import Button, { buttonStyles } from "./ui/Button";

interface ConnectButtonProps {
  onSuccess?: (address: string) => void;
  className?: string;
  showWalletStatus?: boolean;
}

/**
 * Button component for connecting to Aptos wallet
 * @param props Component props
 * @returns Connect button component
 */
const ConnectButton: React.FC<ConnectButtonProps> = ({
  onSuccess,
  className = "",
  showWalletStatus = true,
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
    if (
      isConnected &&
      address !== null &&
      address !== "" &&
      onSuccess &&
      !successCalled.current
    ) {
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

  /**
   * Handles wallet connection or disconnection button click
   * Non-async wrapper for the onClick handler
   */
  const handleConnectClickWrapper = () => {
    void handleConnectClick();
  };

  // Format address for display (truncate middle)
  const formatAddress = (addr: string) => {
    if (addr === null || addr === undefined || addr === "") return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Generate button text based on connection state
  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    if (isConnected)
      return `Disconnect ${formatAddress(address !== null ? address : "")}`;
    if (!isAvailable && showWalletStatus) return "No Wallet Found";
    return `Connect Wallet`;
  };

  return (
    <div className="flex flex-col">
      <Button
        onClick={handleConnectClickWrapper}
        disabled={isConnecting || (!isAvailable && !isConnected)}
        variant={isConnected ? "danger" : "primary"}
        isLoading={isConnecting}
        fullWidth={true}
        className={`${buttonStyles.questAction} ${className}`}
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        }
      >
        {getButtonText()}
      </Button>

      {error !== null && error !== "" && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {!isAvailable && !isConnected && showWalletStatus === true && (
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
