import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Define wallet data interface
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

// Extend global interface
declare global {
  var walletData: WalletData | undefined;
}

export default function ConnectWalletScreen() {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, we'll use dummy data
      const mockWalletData: WalletData = {
        address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        balance: "2.5",
        tokens: [
          {
            name: "USD Coin",
            symbol: "USDC",
            balance: "1000.00",
            contractAddress: "0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C",
            price: 1.00,
          },
          {
            name: "Tether",
            symbol: "USDT",
            balance: "500.00",
            contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            price: 1.00,
          },
          {
            name: "Chainlink",
            symbol: "LINK",
            balance: "25.50",
            contractAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
            price: 15.23,
          },
        ],
      };

      // Store wallet data (in a real app, use AsyncStorage)
      global.walletData = mockWalletData;
      
      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      Alert.alert("Connection Failed", "Unable to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="wallet" size={80} color="#6366f1" />
          <Text style={styles.title}>Token Tracker</Text>
          <Text style={styles.subtitle}>
            Connect your Ethereum wallet to track your portfolio
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={24} color="#10b981" />
            <Text style={styles.featureText}>Secure Wallet Connection</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="trending-up" size={24} color="#f59e0b" />
            <Text style={styles.featureText}>Real-time Price Tracking</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="pie-chart" size={24} color="#8b5cf6" />
            <Text style={styles.featureText}>Portfolio Analytics</Text>
          </View>
        </View>

        {/* Connect Button */}
        <TouchableOpacity
          style={[styles.connectButton, isConnecting && styles.connectingButton]}
          onPress={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="sync" size={20} color="#fff" style={styles.spinning} />
              <Text style={styles.connectButtonText}>Connecting...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="wallet" size={20} color="#fff" />
              <Text style={styles.connectButtonText}>Connect Wallet</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by WalletConnect & CoinGecko
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 24,
  },
  features: {
    marginBottom: 60,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#ffffff",
    marginLeft: 12,
  },
  connectButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  connectingButton: {
    backgroundColor: "#4f46e5",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinning: {
    transform: [{ rotate: "360deg" }],
  },
  connectButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
