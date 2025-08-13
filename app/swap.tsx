import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
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
import { handleNumericInputChange } from '../utils/validation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Comprehensive list of popular cryptocurrencies
const COINS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: 'logo-bitcoin' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'logo-ethereum' },
  { symbol: 'USDT', name: 'Tether', icon: 'card' },
  { symbol: 'BNB', name: 'BNB', icon: 'logo-bitcoin' },
  { symbol: 'SOL', name: 'Solana', icon: 'logo-bitcoin' },
  { symbol: 'USDC', name: 'USD Coin', icon: 'card' },
  { symbol: 'ADA', name: 'Cardano', icon: 'logo-bitcoin' },
  { symbol: 'AVAX', name: 'Avalanche', icon: 'logo-bitcoin' },
  { symbol: 'DOT', name: 'Polkadot', icon: 'logo-bitcoin' },
  { symbol: 'MATIC', name: 'Polygon', icon: 'logo-bitcoin' },
  { symbol: 'LTC', name: 'Litecoin', icon: 'logo-bitcoin' },
  { symbol: 'LINK', name: 'Chainlink', icon: 'logo-bitcoin' },
  { symbol: 'UNI', name: 'Uniswap', icon: 'logo-bitcoin' },
  { symbol: 'ATOM', name: 'Cosmos', icon: 'logo-bitcoin' },
  { symbol: 'XRP', name: 'Ripple', icon: 'logo-bitcoin' },
  { symbol: 'DOGE', name: 'Dogecoin', icon: 'logo-bitcoin' },
  { symbol: 'SHIB', name: 'Shiba Inu', icon: 'logo-bitcoin' },
  { symbol: 'TRX', name: 'TRON', icon: 'logo-bitcoin' },
  { symbol: 'DAI', name: 'Dai', icon: 'card' },
  { symbol: 'BUSD', name: 'Binance USD', icon: 'card' },
];

export default function SwapScreen() {
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromCoin, setFromCoin] = useState('BTC');
  const [toCoin, setToCoin] = useState('ETH');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.authContainer}>
          <Ionicons name="swap-horizontal" size={Math.min(64, screenWidth * 0.15)} color={colors.warning} />
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

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      // Simulate realistic swap flow
      const steps = [
        'Validating swap parameters...',
        'Checking liquidity...',
        'Calculating exchange rate...',
        'Executing swap...',
        'Confirming transaction...',
        'Updating balances...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(steps[i]);
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
      }

      // Generate a realistic transaction ID
      const transactionId = `SW${Date.now().toString().slice(-8)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      Alert.alert(
        '🔄 Swap Successful!',
        `Successfully swapped ${fromAmount} ${fromCoin} for ${toAmount} ${toCoin}\n\nTransaction ID: ${transactionId}\n\nYour ${toCoin} has been added to your portfolio.`,
        [
          {
            text: 'View Portfolio',
            onPress: () => router.push('/' as any)
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during the swap');
    } finally {
      setLoading(false);
      setProcessingStep('');
    }
  };

  // Check if swap button should be disabled
  const isSwapDisabled = !fromAmount || parseFloat(fromAmount) <= 0 || !toAmount || parseFloat(toAmount) <= 0 || loading;

  const swapCoins = () => {
    const tempCoin = fromCoin;
    const tempAmount = fromAmount;
    setFromCoin(toCoin);
    setToCoin(tempCoin);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const selectCoin = (symbol: string, isFrom: boolean) => {
    if (isFrom) {
      setFromCoin(symbol);
      setShowFromDropdown(false);
    } else {
      setToCoin(symbol);
      setShowToDropdown(false);
    }
  };

  const renderCoinItem = ({ item }: { item: typeof COINS[0] }) => (
    <TouchableOpacity
      style={[styles.dropdownItem, { backgroundColor: colors.cardSecondary }]}
      onPress={() => selectCoin(item.symbol, showFromDropdown)}
    >
      <View style={styles.coinItemContent}>
        <Ionicons name={item.icon as any} size={20} color={colors.primary} />
        <View style={styles.coinItemText}>
          <Text style={[styles.coinItemSymbol, { color: colors.text }]}>{item.symbol}</Text>
          <Text style={[styles.coinItemName, { color: colors.textSecondary }]}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Swap Crypto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>From</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.amountInput, { 
                backgroundColor: colors.cardSecondary,
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={fromAmount}
              onChangeText={(text) => handleNumericInputChange(text, setFromAmount)}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
            />
            <TouchableOpacity 
              style={[styles.coinButton, { backgroundColor: colors.cardSecondary }]}
              onPress={() => setShowFromDropdown(true)}
            >
              <Text style={[styles.coinButtonText, { color: colors.text }]}>{fromCoin}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.swapButtonContainer}>
          <TouchableOpacity 
            style={[styles.swapButton, { backgroundColor: colors.warning }]} 
            onPress={swapCoins}
            disabled={loading}
          >
            <Ionicons name="swap-vertical" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>To</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.amountInput, { 
                backgroundColor: colors.cardSecondary,
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={toAmount}
              onChangeText={(text) => handleNumericInputChange(text, setToAmount)}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
            />
            <TouchableOpacity 
              style={[styles.coinButton, { backgroundColor: colors.cardSecondary }]}
              onPress={() => setShowToDropdown(true)}
            >
              <Text style={[styles.coinButtonText, { color: colors.text }]}>{toCoin}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Swap Details</Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Exchange Rate:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>1 {fromCoin} = 15.2 {toCoin}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Network Fee:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>$0.50</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Slippage:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>0.5%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Minimum Received:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {toAmount ? (parseFloat(toAmount) * 0.995).toFixed(4) : '0.0000'} {toCoin}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.swapActionButton, 
            { backgroundColor: colors.warning },
            isSwapDisabled && { backgroundColor: colors.textTertiary, opacity: 0.5 }
          ]} 
          onPress={handleSwap}
          disabled={isSwapDisabled}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="sync" size={20} color={colors.text} style={styles.spinningIcon} />
              <View style={styles.loadingTextContainer}>
                <Text style={[styles.swapActionButtonText, { color: colors.text }]}>Processing...</Text>
                {processingStep ? (
                  <Text style={[styles.processingStep, { color: colors.textSecondary }]}>
                    {processingStep}
                  </Text>
                ) : null}
              </View>
            </View>
          ) : (
            <>
              <Ionicons name="swap-horizontal" size={20} color={colors.text} />
              <Text style={[styles.swapActionButtonText, { color: colors.text }]}>Swap {fromCoin} for {toCoin}</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* From Coin Dropdown */}
      <Modal
        visible={showFromDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFromDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowFromDropdown(false)}
        >
          <View style={[styles.dropdownContainer, { backgroundColor: colors.card }]}>
            <View style={styles.dropdownHeader}>
              <Text style={[styles.dropdownTitle, { color: colors.text }]}>Select Coin</Text>
              <TouchableOpacity onPress={() => setShowFromDropdown(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COINS}
              renderItem={renderCoinItem}
              keyExtractor={(item) => item.symbol}
              showsVerticalScrollIndicator={false}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* To Coin Dropdown */}
      <Modal
        visible={showToDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowToDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowToDropdown(false)}
        >
          <View style={[styles.dropdownContainer, { backgroundColor: colors.card }]}>
            <View style={styles.dropdownHeader}>
              <Text style={[styles.dropdownTitle, { color: colors.text }]}>Select Coin</Text>
              <TouchableOpacity onPress={() => setShowToDropdown(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COINS}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.dropdownItem, { backgroundColor: colors.cardSecondary }]}
                  onPress={() => selectCoin(item.symbol, false)}
                >
                  <View style={styles.coinItemContent}>
                    <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                    <View style={styles.coinItemText}>
                      <Text style={[styles.coinItemSymbol, { color: colors.text }]}>{item.symbol}</Text>
                      <Text style={[styles.coinItemName, { color: colors.textSecondary }]}>{item.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.symbol}
              showsVerticalScrollIndicator={false}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.max(12, screenWidth * 0.03),
  },
  amountInput: {
    flex: 1,
    borderRadius: 8,
    padding: Math.max(16, screenHeight * 0.02),
    fontSize: Math.max(18, screenWidth * 0.045),
    borderWidth: 1,
  },
  coinButton: {
    borderRadius: 8,
    paddingVertical: Math.max(16, screenHeight * 0.02),
    paddingHorizontal: Math.max(12, screenWidth * 0.03),
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'center',
  },
  coinButtonText: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
    marginRight: 4,
  },
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: Math.max(10, screenHeight * 0.012),
  },
  swapButton: {
    width: Math.max(40, screenWidth * 0.1),
    height: Math.max(40, screenWidth * 0.1),
    borderRadius: Math.max(20, screenWidth * 0.05),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: Math.max(14, screenWidth * 0.035),
  },
  detailValue: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: '500',
  },
  swapActionButton: {
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
  swapActionButtonText: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingTextContainer: {
    flex: 1,
  },
  processingStep: {
    fontSize: Math.max(12, screenWidth * 0.03),
    marginTop: 2,
  },
  spinningIcon: {
    transform: [{ rotate: '360deg' }],
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownContainer: {
    width: '80%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Math.max(16, screenWidth * 0.04),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownTitle: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: '600',
  },
  dropdownList: {
    maxHeight: screenHeight * 0.4, // Adjust as needed
  },
  dropdownItem: {
    padding: Math.max(12, screenWidth * 0.03),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  coinItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.max(12, screenWidth * 0.03),
  },
  coinItemText: {
    flex: 1,
  },
  coinItemSymbol: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: '600',
  },
  coinItemName: {
    fontSize: Math.max(14, screenWidth * 0.035),
  },
}); 