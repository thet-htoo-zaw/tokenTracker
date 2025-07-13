import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface TokenData {
  name: string;
  symbol: string;
  balance: string;
  contractAddress: string;
  price: number;
}

export default function TokenDetailScreen() {
  const params = useLocalSearchParams();
  const [token, setToken] = useState<TokenData | null>(null);
  const [priceChange24h, setPriceChange24h] = useState(2.5);
  const [volume24h, setVolume24h] = useState(1500000000);
  const [marketCap, setMarketCap] = useState(25000000000);

  useEffect(() => {
    if (params.token) {
      try {
        const tokenData = JSON.parse(params.token as string);
        setToken(tokenData);
      } catch (error) {
        console.error("Error parsing token data:", error);
        router.back();
      }
    }
  }, [params.token]);

  const openEtherscan = () => {
    if (token) {
      const url = `https://etherscan.io/token/${token.contractAddress}`;
      Linking.openURL(url);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K";
    }
    return num.toLocaleString();
  };

  if (!token) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const tokenValue = parseFloat(token.balance) * token.price;
  const isPositiveChange = priceChange24h >= 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.tokenInfo}>
            <View style={styles.tokenIcon}>
              <Text style={styles.tokenIconText}>{token.symbol[0]}</Text>
            </View>
            <View style={styles.tokenDetails}>
              <Text style={styles.tokenName}>{token.name}</Text>
              <Text style={styles.tokenSymbol}>{token.symbol}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Current Price</Text>
          <Text style={styles.priceValue}>${token.price.toFixed(2)}</Text>
          <View style={styles.priceChange}>
            <Ionicons 
              name={isPositiveChange ? "trending-up" : "trending-down"} 
              size={16} 
              color={isPositiveChange ? "#10b981" : "#ef4444"} 
            />
            <Text style={[
              styles.priceChangeText,
              { color: isPositiveChange ? "#10b981" : "#ef4444" }
            ]}>
              {isPositiveChange ? "+" : ""}{priceChange24h}%
            </Text>
          </View>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balanceAmount}>{token.balance} {token.symbol}</Text>
          <Text style={styles.balanceValue}>${tokenValue.toLocaleString()}</Text>
        </View>

        {/* Market Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Market Statistics</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>24h Volume</Text>
              <Text style={styles.statValue}>${formatNumber(volume24h)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>${formatNumber(marketCap)}</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>24h Change</Text>
              <Text style={[
                styles.statValue,
                { color: isPositiveChange ? "#10b981" : "#ef4444" }
              ]}>
                {isPositiveChange ? "+" : ""}{priceChange24h}%
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Contract</Text>
              <Text style={styles.statValue}>
                {token.contractAddress.slice(0, 8)}...{token.contractAddress.slice(-6)}
              </Text>
            </View>
          </View>
        </View>

        {/* Price Chart Placeholder */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Price Chart</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="analytics" size={48} color="#6366f1" />
            <Text style={styles.chartPlaceholderText}>Chart coming soon</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push("/send-token")}
          >
            <Ionicons name="send" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Send {token.symbol}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={openEtherscan}
          >
            <Ionicons name="open-outline" size={20} color="#6366f1" />
            <Text style={styles.secondaryButtonText}>View on Etherscan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  tokenInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tokenIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tokenIconText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  tokenDetails: {
    flex: 1,
  },
  tokenName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  tokenSymbol: {
    color: "#9ca3af",
    fontSize: 16,
  },
  backButton: {
    padding: 8,
  },
  priceSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  priceLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 8,
  },
  priceValue: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },
  priceChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceChangeText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 4,
  },
  balanceCard: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  balanceLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  balanceValue: {
    color: "#6366f1",
    fontSize: 18,
    fontWeight: "500",
  },
  statsSection: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  statsTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  chartSection: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  chartTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  chartPlaceholder: {
    alignItems: "center",
    paddingVertical: 40,
  },
  chartPlaceholderText: {
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 12,
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: "#6366f1",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
}); 