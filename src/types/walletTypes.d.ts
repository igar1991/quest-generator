/**
 * TypeScript declarations for Aptos wallet extensions
 */

interface AptosAccount {
  address: string;
  publicKey?: string;
  [key: string]: string | boolean | number | undefined;
}

interface AptosWallet {
  connect: () => Promise<unknown>;
  disconnect?: () => Promise<void>;
  account: () => Promise<AptosAccount>;
  signTransaction?: (transaction: unknown) => Promise<unknown>;
  signAndSubmitTransaction?: (transaction: unknown) => Promise<unknown>;
  isConnected: () => Promise<boolean>;
  [key: string]: unknown;
}

declare global {
  interface Window {
    aptos?: AptosWallet;
    petra?: AptosWallet;
    martian?: AptosWallet;
    pontem?: AptosWallet;
    fewcha?: AptosWallet;
    rise?: AptosWallet;
  }
}

export {};
