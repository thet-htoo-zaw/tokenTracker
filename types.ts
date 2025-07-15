// CoinGecko API Types
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: { usd: number };
    atl: { usd: number };
    price_change_percentage_24h: number;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
}

export interface MarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface GlobalMarketData {
  data: {
    active_cryptocurrencies: number;
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number };
    market_cap_change_percentage_24h_usd: number;
  };
}

// User Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  balance: number;
  favorites: string[];
}

// Transaction Types
export interface Transaction {
  id: string;
  type: 'buy' | 'swap';
  fromCoin: string;
  toCoin: string;
  fromAmount: number;
  toAmount: number;
  price: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface BuyTransaction extends Transaction {
  type: 'buy';
  paymentMethod: 'stripe' | 'wallet';
  stripePaymentId?: string;
}

export interface SwapTransaction extends Transaction {
  type: 'swap';
  exchangeRate: number;
}

// Alert Types
export interface PriceAlert {
  id: string;
  coinId: string;
  coinSymbol: string;
  coinName: string;
  targetPrice: number;
  isAbove: boolean; // true if alert when price goes above target
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

// Search Types
export interface SearchResult {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
  }>;
  exchanges: Array<{
    id: string;
    name: string;
    market_type: string;
    thumb: string;
    large: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
  }>;
  nfts: Array<{
    id: string;
    name: string;
    symbol: string;
    thumb: string;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  CoinDetail: { coinId: string };
  Buy: { coinId?: string };
  Swap: undefined;
  Favorites: undefined;
  Search: undefined;
  Alerts: undefined;
  History: undefined;
  Profile: undefined;
}; 