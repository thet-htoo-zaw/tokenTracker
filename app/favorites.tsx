import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { Coin } from '../types';
import { fetchTopCoins } from '../utils/api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FavoritesScreen() {
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const { favorites, removeFromFavorites, loading: favoritesLoading } = useFavorites();
  const [favoriteCoins, setFavoriteCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated, favorites]);

  const loadFavorites = async () => {
    try {
      const allCoins = await fetchTopCoins();
      const coins = allCoins.filter(coin => favorites.includes(coin.id));
      setFavoriteCoins(coins);
    } catch (error) {
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (coinId: string) => {
    try {
      await removeFromFavorites(coinId);
      Alert.alert('Removed', 'Coin removed from favorites');
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from favorites');
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

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.authContainer}>
          <Ionicons name="heart" size={Math.min(64, screenWidth * 0.15)} color={colors.error} />
          <Text style={[styles.authTitle, { color: colors.text }]}>Authentication Required</Text>
          <Text style={[styles.authSubtitle, { color: colors.textSecondary }]}>Please sign in to view your favorites</Text>
          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/login' as any)}
          >
            <Text style={[styles.authButtonText, { color: colors.text }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderFavoriteItem = ({ item }: { item: Coin }) => (
    <TouchableOpacity
      style={[styles.favoriteItem, { backgroundColor: colors.card, borderColor: colors.border }]}
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
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromFavorites(item.id)}
      >
        <Ionicons name="heart-dislike" size={20} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Favorites</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading || favoritesLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading favorites...</Text>
        </View>
      ) : favoriteCoins.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={Math.min(64, screenWidth * 0.15)} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favorites Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Add coins to your favorites to track them here
          </Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.browseButtonText, { color: colors.text }]}>Browse Coins</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favoriteCoins}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  authSubtitle: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  authButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  coinSymbol: {
    color: '#9ca3af',
    fontSize: 14,
  },
  coinPrice: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  priceText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  listContainer: {
    paddingBottom: 20, // Add some padding at the bottom for the browse button
  },
}); 