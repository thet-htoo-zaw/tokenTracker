// API and Web3 utilities for Token Tracker App

export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
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

// CoinGecko API Base URL
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Ethereum mainnet contract addresses for popular tokens
const TOKEN_ADDRESSES = {
  USDC: '0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  COMP: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
};

// Fetch token prices from CoinGecko
export const fetchTokenPrices = async (contractAddresses: string[]): Promise<TokenPrice[]> => {
  try {
    const addresses = contractAddresses.join(',');
    const url = `${COINGECKO_BASE_URL}/simple/token_price/ethereum?contract_addresses=${addresses}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the response to our TokenPrice interface
    const tokenPrices: TokenPrice[] = [];
    
    for (const [address, priceData] of Object.entries(data)) {
      const priceInfo = priceData as any;
      tokenPrices.push({
        symbol: getTokenSymbol(address),
        price: priceInfo.usd || 0,
        change24h: priceInfo.usd_24h_change || 0,
        volume24h: priceInfo.usd_24h_vol || 0,
        marketCap: priceInfo.usd_market_cap || 0,
      });
    }
    
    return tokenPrices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    // Return mock data if API fails
    return getMockTokenPrices(contractAddresses);
  }
};

// Fetch ETH price
export const fetchEthPrice = async (): Promise<number> => {
  try {
    const url = `${COINGECKO_BASE_URL}/simple/price?ids=ethereum&vs_currencies=usd`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.ethereum?.usd || 3200; // Default fallback price
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    return 3200; // Mock price
  }
};

// Get token symbol from contract address
const getTokenSymbol = (address: string): string => {
  const addressMap: { [key: string]: string } = {
    [TOKEN_ADDRESSES.USDC]: 'USDC',
    [TOKEN_ADDRESSES.USDT]: 'USDT',
    [TOKEN_ADDRESSES.LINK]: 'LINK',
    [TOKEN_ADDRESSES.DAI]: 'DAI',
    [TOKEN_ADDRESSES.UNI]: 'UNI',
    [TOKEN_ADDRESSES.AAVE]: 'AAVE',
    [TOKEN_ADDRESSES.COMP]: 'COMP',
    [TOKEN_ADDRESSES.MKR]: 'MKR',
  };
  
  return addressMap[address.toLowerCase()] || 'UNKNOWN';
};

// Mock token prices for development/testing
const getMockTokenPrices = (contractAddresses: string[]): TokenPrice[] => {
  const mockPrices: { [key: string]: TokenPrice } = {
    [TOKEN_ADDRESSES.USDC]: {
      symbol: 'USDC',
      price: 1.00,
      change24h: 0.1,
      volume24h: 5000000000,
      marketCap: 25000000000,
    },
    [TOKEN_ADDRESSES.USDT]: {
      symbol: 'USDT',
      price: 1.00,
      change24h: -0.05,
      volume24h: 8000000000,
      marketCap: 80000000000,
    },
    [TOKEN_ADDRESSES.LINK]: {
      symbol: 'LINK',
      price: 15.23,
      change24h: 2.5,
      volume24h: 1500000000,
      marketCap: 8500000000,
    },
    [TOKEN_ADDRESSES.DAI]: {
      symbol: 'DAI',
      price: 1.00,
      change24h: 0.02,
      volume24h: 300000000,
      marketCap: 5000000000,
    },
    [TOKEN_ADDRESSES.UNI]: {
      symbol: 'UNI',
      price: 8.45,
      change24h: -1.2,
      volume24h: 800000000,
      marketCap: 5000000000,
    },
    [TOKEN_ADDRESSES.AAVE]: {
      symbol: 'AAVE',
      price: 120.50,
      change24h: 5.8,
      volume24h: 400000000,
      marketCap: 1800000000,
    },
    [TOKEN_ADDRESSES.COMP]: {
      symbol: 'COMP',
      price: 45.20,
      change24h: -2.1,
      volume24h: 200000000,
      marketCap: 300000000,
    },
    [TOKEN_ADDRESSES.MKR]: {
      symbol: 'MKR',
      price: 2800.00,
      change24h: 1.5,
      volume24h: 150000000,
      marketCap: 2800000000,
    },
  };
  
  return contractAddresses
    .map(address => mockPrices[address.toLowerCase()])
    .filter(Boolean);
};

// Validate Ethereum address
export const validateEthAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Format address for display
export const formatAddress = (address: string): string => {
  if (!validateEthAddress(address)) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format number with appropriate suffix
export const formatNumber = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  return num.toLocaleString();
};

// Calculate portfolio value
export const calculatePortfolioValue = (
  ethBalance: string,
  ethPrice: number,
  tokens: Array<{ balance: string; price: number }>
): number => {
  const ethValue = parseFloat(ethBalance) * ethPrice;
  const tokenValues = tokens.reduce((total, token) => {
    return total + (parseFloat(token.balance) * token.price);
  }, 0);
  
  return ethValue + tokenValues;
};

// Web3 Provider setup (placeholder for WalletConnect integration)
export const setupWeb3Provider = async () => {
  // This would be implemented with WalletConnect
  // For now, return a mock provider
  return {
    isConnected: true,
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    balance: '2.5',
    signTransaction: async (transaction: any) => {
      // Mock transaction signing
      return { hash: '0x' + Math.random().toString(16).substr(2, 64) };
    },
  };
};

// Get token balance from contract (placeholder for ethers.js integration)
export const getTokenBalance = async (
  contractAddress: string,
  walletAddress: string
): Promise<string> => {
  // This would use ethers.js to call the ERC20 balanceOf function
  // For now, return mock data
  const mockBalances: { [key: string]: string } = {
    [TOKEN_ADDRESSES.USDC]: '1000.00',
    [TOKEN_ADDRESSES.USDT]: '500.00',
    [TOKEN_ADDRESSES.LINK]: '25.50',
    [TOKEN_ADDRESSES.DAI]: '750.00',
    [TOKEN_ADDRESSES.UNI]: '15.25',
    [TOKEN_ADDRESSES.AAVE]: '2.50',
    [TOKEN_ADDRESSES.COMP]: '8.75',
    [TOKEN_ADDRESSES.MKR]: '0.25',
  };
  
  return mockBalances[contractAddress.toLowerCase()] || '0.00';
}; 