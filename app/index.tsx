import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Coin, GlobalMarketData } from '../types';
import { fetchGlobalMarketData, fetchTopCoins } from '../utils/api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, isAuthenticated, signOut, loading: authLoading } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  console.log('HomeScreen render:', { isAuthenticated, user: user?.email });

  const loadData = async () => {
    try {
      const [coinsData, globalData] = await Promise.all([
        fetchTopCoins(),
        fetchGlobalMarketData(),
      ]);
      setCoins(coinsData);
      setGlobalData(globalData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (percentage: number): string => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const handleAuthenticatedAction = (action: string, route: string) => {
    console.log('handleAuthenticatedAction called:', { action, route, isAuthenticated });
    
    if (!isAuthenticated) {
      // Redirect to sign-in page instead of showing alert
      router.push('/login' as any);
    } else {
      console.log('Navigating to:', route);
      router.push(route as any);
    }
  };

  const handleSearch = () => {
    router.push('/search' as any);
  };

  const renderCoinItem = ({ item }: { item: Coin }) => (
    <TouchableOpacity
      style={[styles.coinItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/coin/${item.id}` as any)}
    >
      <View style={styles.coinInfo}>
        <Image source={{ uri: item.image }} style={styles.coinImage} />
        <View style={styles.coinDetails}>
          <Text style={[styles.coinName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.coinSymbol, { color: colors.textSecondary }]}>{item.symbol.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.coinPrice}>
        <Text style={[styles.priceText, { color: colors.text }]}>{formatNumber(item.current_price)}</Text>
        <Text
          style={[
            styles.percentageText,
            {
              color: item.price_change_percentage_24h >= 0 ? colors.positive : colors.negative,
            },
          ]}
        >
          {formatPercentage(item.price_change_percentage_24h)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderGlobalStats = () => {
    if (!globalData) return null;

    return (
      <View style={[styles.globalStats, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.globalStatsHeader}>
          <Ionicons name="trending-up" size={24} color={colors.primary} />
          <Text style={[styles.globalStatsTitle, { color: colors.text }]}>Market Overview</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="diamond" size={20} color={colors.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Market Cap</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatNumber(globalData.data.total_market_cap.usd)}
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="bar-chart" size={20} color={colors.warning} />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h Volume</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatNumber(globalData.data.total_volume.usd)}
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="logo-bitcoin" size={20} color={colors.success} />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>BTC Dominance</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {globalData.data.market_cap_percentage.btc.toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="wallet" size={20} color={colors.error} />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Coins</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {globalData.data.active_cryptocurrencies.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            {isAuthenticated ? 'Welcome back!' : 'Welcome to Crypto Tracker!'}
          </Text>
          <Text style={[styles.userName, { color: colors.textSecondary }]}>
            {isAuthenticated ? (user?.displayName || user?.email) : 'Sign in to access trading features'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Ionicons 
              name={isDark ? "sunny" : "moon"} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
          {isAuthenticated && (
            <>
              <TouchableOpacity onPress={() => router.push('/profile' as any)} style={styles.profileButton}>
                <Ionicons name="person-circle" size={32} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
                <Ionicons name="log-out" size={24} color={colors.error} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      
      {isAuthenticated && (
        <View style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Available Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>$1,000.00</Text>
        </View>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => {
            console.log('Buy button pressed');
            handleAuthenticatedAction('buy', '/buy');
          }}
        >
          <Ionicons name="add-circle" size={24} color={colors.success} />
          <Text style={[styles.actionText, { color: colors.text }]}>Buy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => {
            console.log('Swap button pressed');
            handleAuthenticatedAction('swap', '/swap');
          }}
        >
          <Ionicons name="swap-horizontal" size={24} color={colors.warning} />
          <Text style={[styles.actionText, { color: colors.text }]}>Swap</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => {
            console.log('Favorites button pressed');
            handleAuthenticatedAction('view favorites', '/favorites');
          }}
        >
          <Ionicons name="heart" size={24} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.text }]}>Favorites</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => {
            console.log('Search button pressed');
            handleSearch();
          }}
        >
          <Ionicons name="search" size={24} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Search</Text>
        </TouchableOpacity>
      </View>

      {!isAuthenticated && (
        <View style={styles.signInContainer}>
          <TouchableOpacity 
            onPress={() => router.push('/login' as any)} 
            style={[styles.signInButton, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.signInButtonText, { color: colors.text }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading market data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={coins}
        renderItem={renderCoinItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderGlobalStats()}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Cryptocurrencies</Text>
            </View>
          </>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
  },
  header: {
    padding: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '400',
  },
  userName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeButton: {
    padding: 8,
  },
  profileButton: {
    padding: 8,
  },
  logoutButton: {
    padding: 8,
  },
  signInButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signInButtonSubtext: {
    color: '#c7d2fe',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
    includeFontPadding: false,
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  balanceLabel: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  globalStats: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  globalStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  globalStatsTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
  coinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  coinDetails: {
    flex: 1,
  },
  coinName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  coinSymbol: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  coinPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signInContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
  },
});
