import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface WalletData {
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

export default function DashboardScreen() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [ethPrice, setEthPrice] = useState(3200); // Mock ETH price

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = () => {
    if (global.walletData) {
      setWalletData(global.walletData);
    } else {
      // If no wallet data, go back to connect screen
      router.replace("/");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh prices
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const calculateTotalValue = () => {
    if (!walletData) return 0;
    
    const ethValue = parseFloat(walletData.balance) * ethPrice;
    const tokenValues = walletData.tokens.reduce((total, token) => {
      return total + (parseFloat(token.balance) * token.price);
    }, 0);
    
    return ethValue + tokenValues;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navigateToTokenDetail = (token: any) => {
    router.push({
      pathname: "/token-detail",
      params: { token: JSON.stringify(token) }
    });
  };

  const navigateToSendToken = () => {
    router.push("/send-token");
  };

  if (!walletData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const totalValue = calculateTotalValue();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.addressContainer}>
            <Ionicons name="wallet" size={20} color="#6366f1" />
            <Text style={styles.address}>{formatAddress(walletData.address)}</Text>
            <TouchableOpacity style={styles.copyButton}>
              <Ionicons name="copy" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Portfolio Value</Text>
          <Text style={styles.summaryValue}>${totalValue.toLocaleString()}</Text>
          <View style={styles.summaryChange}>
            <Ionicons name="trending-up" size={16} color="#10b981" />
            <Text style={styles.summaryChangeText}>+2.5% today</Text>
          </View>
        </View>

        {/* ETH Balance */}
        <View style={styles.ethCard}>
          <View style={styles.ethHeader}>
            <View style={styles.ethInfo}>
              <Ionicons name="diamond" size={24} color="#6366f1" />
              <Text style={styles.ethSymbol}>ETH</Text>
            </View>
            <Text style={styles.ethBalance}>{walletData.balance} ETH</Text>
          </View>
          <View style={styles.ethValue}>
            <Text style={styles.ethValueText}>
              ${(parseFloat(walletData.balance) * ethPrice).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Tokens Section */}
        <View style={styles.tokensSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tokens</Text>
            <TouchableOpacity onPress={navigateToSendToken} style={styles.sendButton}>
              <Ionicons name="send" size={16} color="#6366f1" />
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>

          {walletData.tokens.map((token, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tokenCard}
              onPress={() => navigateToTokenDetail(token)}
            >
              <View style={styles.tokenInfo}>
                <View style={styles.tokenIcon}>
                  <Text style={styles.tokenIconText}>{token.symbol[0]}</Text>
                </View>
                <View style={styles.tokenDetails}>
                  <Text style={styles.tokenName}>{token.name}</Text>
                  <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                </View>
              </View>
              <View style={styles.tokenValues}>
                <Text style={styles.tokenBalance}>{token.balance}</Text>
                <Text style={styles.tokenValue}>
                  ${(parseFloat(token.balance) * token.price).toLocaleString()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle" size={24} color="#6366f1" />
            <Text style={styles.actionText}>Add Token</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="swap-horizontal" size={24} color="#f59e0b" />
            <Text style={styles.actionText}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="analytics" size={24} color="#8b5cf6" />
            <Text style={styles.actionText}>Analytics</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  address: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  copyButton: {
    padding: 4,
  },
  summaryCard: {
    margin: 20,
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  summaryTitle: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 8,
  },
  summaryValue: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  summaryChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryChangeText: {
    color: "#10b981",
    fontSize: 14,
    marginLeft: 4,
  },
  ethCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 16,
  },
  ethHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ethInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  ethSymbol: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  ethBalance: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  ethValue: {
    alignItems: "flex-end",
  },
  ethValueText: {
    color: "#9ca3af",
    fontSize: 16,
  },
  tokensSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 4,
  },
  tokenCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tokenInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tokenIconText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tokenDetails: {
    flex: 1,
  },
  tokenName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  tokenSymbol: {
    color: "#9ca3af",
    fontSize: 14,
  },
  tokenValues: {
    alignItems: "flex-end",
    marginRight: 12,
  },
  tokenBalance: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  tokenValue: {
    color: "#9ca3af",
    fontSize: 14,
  },
  actionsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  actionText: {
    color: "#ffffff",
    fontSize: 12,
    marginTop: 8,
  },
}); 