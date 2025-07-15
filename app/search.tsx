import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Coin } from '../types';
import { fetchTopCoins } from '../utils/api';

export default function SearchScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoins();
  }, []);

  useEffect(() => {
    filterCoins();
  }, [searchQuery, coins]);

  const loadCoins = async () => {
    try {
      const coinsData = await fetchTopCoins();
      setCoins(coinsData);
    } catch (error) {
      console.error('Failed to load coins:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCoins = () => {
    if (!searchQuery.trim()) {
      setFilteredCoins(coins);
      return;
    }

    const filtered = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCoins(filtered);
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

  const renderCoinItem = ({ item }: { item: Coin }) => (
    <TouchableOpacity
      style={[styles.coinItem, { borderBottomColor: colors.border }]}
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
              color: item.price_change_percentage_24h >= 0 ? colors.success : colors.error,
            },
          ]}
        >
          {formatPercentage(item.price_change_percentage_24h)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {searchQuery ? 'No Results Found' : 'Search Cryptocurrencies'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchQuery 
          ? `No cryptocurrencies found matching "${searchQuery}"`
          : 'Search by name or symbol to find cryptocurrencies'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Search</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.cardSecondary }]}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search cryptocurrencies..."
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading cryptocurrencies...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCoins}
          renderItem={renderCoinItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  coinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
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
    fontSize: 16,
    fontWeight: '500',
  },
  coinSymbol: {
    fontSize: 14,
  },
  coinPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 