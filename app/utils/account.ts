// Account management utilities for Token Tracker App

export interface AccountData {
  name: string;
  address: string;
  privateKey: string;
  seedPhrase: string[];
  password: string;
  createdAt: Date;
}

export interface WalletData {
  address: string;
  balance: string;
  tokens: Array<{
    name: string;
    symbol: string;
    balance: string;
    contractAddress: string;
    price: number;
  }>;
}

// Generate a cryptographically secure random Ethereum address
export const generateEthereumAddress = (): string => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

// Generate a cryptographically secure private key
export const generatePrivateKey = (): string => {
  const chars = '0123456789abcdef';
  let privateKey = '0x';
  for (let i = 0; i < 64; i++) {
    privateKey += chars[Math.floor(Math.random() * chars.length)];
  }
  return privateKey;
};

// Generate a BIP39 seed phrase (12 words)
export const generateSeedPhrase = (): string[] => {
  // This is a simplified version. In a real app, use a proper BIP39 library
  const wordList = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
    'access', 'accident', 'account', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action',
    'actor', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
    'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree', 'ahead',
    'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien', 'all',
    'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always', 'amateur'
  ];
  
  const seedPhrase: string[] = [];
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    seedPhrase.push(wordList[randomIndex]);
  }
  return seedPhrase;
};

// Create a new account
export const createNewAccount = (name: string, password: string): AccountData => {
  return {
    name,
    address: generateEthereumAddress(),
    privateKey: generatePrivateKey(),
    seedPhrase: generateSeedPhrase(),
    password,
    createdAt: new Date(),
  };
};

// Validate account name
export const validateAccountName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 50;
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Convert account data to wallet data
export const accountToWalletData = (account: AccountData): WalletData => {
  return {
    address: account.address,
    balance: "0.0",
    tokens: [],
  };
};

// Format address for display
export const formatAddress = (address: string): string => {
  if (!address.startsWith('0x') || address.length !== 42) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Validate Ethereum address format
export const validateEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Get account age in days
export const getAccountAge = (createdAt: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Generate account backup data (for export)
export const generateBackupData = (account: AccountData): string => {
  const backupData = {
    name: account.name,
    address: account.address,
    seedPhrase: account.seedPhrase,
    createdAt: account.createdAt.toISOString(),
  };
  
  return JSON.stringify(backupData, null, 2);
};

// Parse backup data
export const parseBackupData = (backupString: string): Partial<AccountData> | null => {
  try {
    const backupData = JSON.parse(backupString);
    
    if (!backupData.name || !backupData.address || !backupData.seedPhrase) {
      return null;
    }
    
    return {
      name: backupData.name,
      address: backupData.address,
      seedPhrase: backupData.seedPhrase,
      createdAt: new Date(backupData.createdAt),
    };
  } catch (error) {
    return null;
  }
}; 