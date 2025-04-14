/**
 * TypeScript declarations for blockchain wallet extensions
 */

interface BlockchainAccount {
  address: string;
  publicKey?: string;
  [key: string]: string | boolean | number | undefined;
}

interface BlockchainWallet {
  connect: () => Promise<unknown>;
  disconnect?: () => Promise<void>;
  account: () => Promise<BlockchainAccount>;
  signTransaction?: (transaction: unknown) => Promise<unknown>;
  signAndSubmitTransaction?: (transaction: unknown) => Promise<unknown>;
  isConnected: () => Promise<boolean>;
  getBalance?: (address: string) => Promise<string | number>;
  getResources?: (address: string) => Promise<unknown[]>;
  [key: string]: unknown;
}

declare global {
  interface Window {
    aptos?: BlockchainWallet;
    petra?: BlockchainWallet;
    martian?: BlockchainWallet;
    pontem?: BlockchainWallet;
    fewcha?: BlockchainWallet;
    rise?: BlockchainWallet;
  }
}

export {};
