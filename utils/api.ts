import axios from 'axios';
import { Coin, CoinDetail, GlobalMarketData, MarketChart, SearchResult } from '../types';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: COINGECKO_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch top 50 coins by market cap
export const fetchTopCoins = async (): Promise<Coin[]> => {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false,
        locale: 'en',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top coins:', error);
    throw new Error('Failed to fetch coins');
  }
};

// Fetch coin details by ID
export const fetchCoinDetail = async (coinId: string): Promise<CoinDetail> => {
  try {
    const response = await api.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching coin detail:', error);
    throw new Error('Failed to fetch coin details');
  }
};

// Fetch market chart data
export const fetchMarketChart = async (
  coinId: string,
  days: number = 7,
  currency: string = 'usd'
): Promise<MarketChart> => {
  try {
    const response = await api.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: currency,
        days: days,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market chart:', error);
    throw new Error('Failed to fetch market chart');
  }
};

// Fetch global market data
export const fetchGlobalMarketData = async (): Promise<GlobalMarketData> => {
  try {
    const response = await api.get('/global');
    return response.data;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw new Error('Failed to fetch global market data');
  }
};

// Search coins, exchanges, categories, and NFTs
export const searchCrypto = async (query: string): Promise<SearchResult> => {
  try {
    const response = await api.get('/search', {
      params: {
        query: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching crypto:', error);
    throw new Error('Failed to search');
  }
};

// Get current price for specific coins
export const getCurrentPrice = async (
  coinIds: string[],
  currency: string = 'usd'
): Promise<{ [key: string]: { [key: string]: number } }> => {
  try {
    const response = await api.get('/simple/price', {
      params: {
        ids: coinIds.join(','),
        vs_currencies: currency,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current price:', error);
    throw new Error('Failed to fetch current price');
  }
};

// Get trending coins
export const getTrendingCoins = async (): Promise<Coin[]> => {
  try {
    const response = await api.get('/search/trending');
    return response.data.coins.map((coin: any) => ({
      id: coin.item.id,
      symbol: coin.item.symbol,
      name: coin.item.name,
      image: coin.item.small,
      current_price: coin.item.price_btc,
      market_cap: 0,
      market_cap_rank: 0,
      fully_diluted_valuation: 0,
      total_volume: 0,
      high_24h: 0,
      low_24h: 0,
      price_change_24h: 0,
      price_change_percentage_24h: 0,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: 0,
      circulating_supply: 0,
      total_supply: 0,
      max_supply: 0,
      ath: 0,
      ath_change_percentage: 0,
      ath_date: '',
      atl: 0,
      atl_change_percentage: 0,
      atl_date: '',
      roi: null,
      last_updated: '',
    }));
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw new Error('Failed to fetch trending coins');
  }
};

// Get supported vs currencies
export const getSupportedCurrencies = async (): Promise<string[]> => {
  try {
    const response = await api.get('/simple/supported_vs_currencies');
    return response.data;
  } catch (error) {
    console.error('Error fetching supported currencies:', error);
    return ['usd', 'eur', 'btc', 'eth'];
  }
};

// Calculate exchange rate between two coins
export const calculateExchangeRate = async (
  fromCoin: string,
  toCoin: string
): Promise<number> => {
  try {
    const [fromPrice, toPrice] = await Promise.all([
      getCurrentPrice([fromCoin]),
      getCurrentPrice([toCoin]),
    ]);
    
    const fromPriceUSD = fromPrice[fromCoin]?.usd || 0;
    const toPriceUSD = toPrice[toCoin]?.usd || 0;
    
    if (toPriceUSD === 0) return 0;
    
    return fromPriceUSD / toPriceUSD;
  } catch (error) {
    console.error('Error calculating exchange rate:', error);
    throw new Error('Failed to calculate exchange rate');
  }
};

export default api; 