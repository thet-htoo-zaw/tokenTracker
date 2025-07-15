import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';
import { CoinDetail, MarketChart } from '../../types';
import { fetchCoinDetail, fetchMarketChart } from '../../utils/api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CoinDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<MarketChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCoinData = async () => {
    if (!id) return;
    
    try {
      const [coinData, chartData] = await Promise.all([
        fetchCoinDetail(id),
        fetchMarketChart(id, 7),
      ]);
      setCoin(coinData);
      setChartData(chartData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load coin data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCoinData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadCoinData();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!id) return;
    
    try {
      if (isFavorite(id)) {
        await removeFromFavorites(id);
        Alert.alert('Removed', 'Coin removed from favorites');
      } else {
        await addToFavorites(id);
        Alert.alert('Added', 'Coin added to favorites');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading coin data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!coin) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Coin not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.coinInfo}>
            <Image source={{ uri: coin.image.large }} style={styles.coinImage} />
            <View style={styles.coinDetails}>
              <Text style={[styles.coinName, { color: colors.text }]}>{coin.name}</Text>
              <Text style={[styles.coinSymbol, { color: colors.textSecondary }]}>{coin.symbol.toUpperCase()}</Text>
              <Text style={[styles.coinRank, { color: colors.primary }]}>Rank #{coin.market_cap_rank}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleFavoriteToggle} style={styles.favoriteButton}>
            <Ionicons
              name={isFavorite(id) ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite(id) ? colors.error : colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Current Price</Text>
          <Text style={[styles.priceValue, { color: colors.text }]}>
            ${coin.market_data.current_price.usd.toLocaleString()}
          </Text>
          <View style={styles.priceChange}>
            <Ionicons
              name={
                coin.market_data.price_change_percentage_24h >= 0
                  ? 'trending-up'
                  : 'trending-down'
              }
              size={16}
              color={
                coin.market_data.price_change_percentage_24h >= 0
                  ? colors.positive
                  : colors.negative
              }
            />
            <Text
              style={[
                styles.priceChangeText,
                {
                  color:
                    coin.market_data.price_change_percentage_24h >= 0
                      ? colors.positive
                      : colors.negative,
                },
              ]}
            >
              {formatPercentage(coin.market_data.price_change_percentage_24h)}
            </Text>
          </View>
        </View>

        {/* Market Stats */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Market Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { backgroundColor: colors.card }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Market Cap</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatNumber(coin.market_data.market_cap.usd)}
              </Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: colors.card }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h Volume</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatNumber(coin.market_data.total_volume.usd)}
              </Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: colors.card }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Circulating Supply</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {coin.market_data.circulating_supply.toLocaleString()}
              </Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: colors.card }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Supply</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {coin.market_data.total_supply?.toLocaleString() || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {coin.description.en && (
          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About {coin.name}</Text>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {coin.description.en}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
            <Ionicons name="add-circle" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Buy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.primary }]}>
            <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Swap</Text>
          </TouchableOpacity>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Chart (7 Days)</Text>
          <View style={[styles.chartPlaceholder, { backgroundColor: colors.card }]}>
            <Ionicons name="analytics" size={48} color={colors.primary} />
            <Text style={[styles.chartPlaceholderText, { color: colors.textSecondary }]}>Chart coming soon</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  coinDetails: {
    flex: 1,
  },
  coinName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  coinSymbol: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '500',
  },
  coinRank: {
    color: '#6366f1',
    fontSize: 14,
    marginTop: 2,
  },
  favoriteButton: {
    padding: 8,
  },
  priceSection: {
    padding: 20,
    alignItems: 'center',
  },
  priceLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
  priceValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceChangeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionSection: {
    padding: 20,
  },
  descriptionText: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
  },
  actionsSection: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  chartSection: {
    padding: 20,
  },
  chartPlaceholder: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  chartPlaceholderText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
  },
}); 