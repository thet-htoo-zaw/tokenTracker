import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function BuyScreen() {
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const [amount, setAmount] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('BTC');

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.authContainer}>
          <Ionicons name="lock-closed" size={Math.min(64, screenWidth * 0.15)} color={colors.primary} />
          <Text style={[styles.authTitle, { color: colors.text }]}>Authentication Required</Text>
          <Text style={[styles.authSubtitle, { color: colors.textSecondary }]}>Please sign in to access trading features</Text>
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

  const handleBuy = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    Alert.alert('Success', `Order placed to buy $${amount} worth of ${selectedCoin}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Buy Crypto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Select Coin</Text>
          <View style={styles.coinSelector}>
            {['BTC', 'ETH', 'USDT', 'BNB'].map((coin) => (
              <TouchableOpacity
                key={coin}
                style={[
                  styles.coinOption,
                  { backgroundColor: colors.cardSecondary },
                  selectedCoin === coin && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedCoin(coin)}
              >
                <Text style={[
                  styles.coinText,
                  { color: colors.textSecondary },
                  selectedCoin === coin && { color: colors.text },
                ]}>
                  {coin}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Amount (USD)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.cardSecondary,
              color: colors.text,
              borderColor: colors.border 
            }]}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount in USD"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Amount:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>${amount || '0.00'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Coin:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedCoin}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Fee:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>$2.99</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              ${amount ? (parseFloat(amount) + 2.99).toFixed(2) : '0.00'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.buyButton, { backgroundColor: colors.success }]} 
          onPress={handleBuy}
        >
          <Ionicons name="card" size={20} color={colors.text} />
          <Text style={[styles.buyButtonText, { color: colors.text }]}>Buy {selectedCoin}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Math.max(20, screenWidth * 0.05),
  },
  authTitle: {
    fontSize: Math.max(24, screenWidth * 0.06),
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: Math.max(16, screenWidth * 0.04),
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  authButton: {
    paddingVertical: Math.max(12, screenHeight * 0.015),
    paddingHorizontal: Math.max(24, screenWidth * 0.06),
    borderRadius: 8,
    minWidth: 120,
  },
  authButtonText: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Math.max(20, screenWidth * 0.05),
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Math.max(20, screenWidth * 0.05),
  },
  card: {
    borderRadius: 12,
    padding: Math.max(20, screenWidth * 0.05),
    marginBottom: Math.max(20, screenHeight * 0.025),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
    marginBottom: 16,
  },
  coinSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Math.max(8, screenWidth * 0.02),
  },
  coinOption: {
    paddingVertical: Math.max(12, screenHeight * 0.015),
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  coinText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  input: {
    borderRadius: 8,
    padding: Math.max(16, screenHeight * 0.02),
    fontSize: Math.max(16, screenWidth * 0.04),
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: Math.max(14, screenWidth * 0.035),
  },
  summaryValue: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
  },
  totalValue: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(16, screenHeight * 0.02),
    borderRadius: 12,
    marginTop: Math.max(10, screenHeight * 0.012),
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buyButtonText: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
  },
}); 