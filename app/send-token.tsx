import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SendTokenScreen() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("ETH");
  const [isLoading, setIsLoading] = useState(false);
  const [gasEstimate, setGasEstimate] = useState("0.005");

  const validateAddress = (address: string) => {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const validateAmount = (amount: string) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  };

  const handleSend = async () => {
    if (!validateAddress(recipientAddress)) {
      Alert.alert("Invalid Address", "Please enter a valid Ethereum address.");
      return;
    }

    if (!validateAmount(amount)) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      Alert.alert(
        "Transaction Successful",
        `Successfully sent ${amount} ${token} to ${recipientAddress.slice(0, 8)}...${recipientAddress.slice(-6)}`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Transaction Failed", "Unable to send transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const maxAmount = token === "ETH" ? "2.5" : "1000.00";

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Send {token}</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Token Selection */}
          <View style={styles.tokenSelector}>
            <Text style={styles.sectionTitle}>Select Token</Text>
            <View style={styles.tokenOptions}>
              <TouchableOpacity 
                style={[styles.tokenOption, token === "ETH" && styles.selectedToken]}
                onPress={() => setToken("ETH")}
              >
                <Ionicons name="diamond" size={20} color="#6366f1" />
                <Text style={[styles.tokenOptionText, token === "ETH" && styles.selectedTokenText]}>
                  ETH
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tokenOption, token === "USDC" && styles.selectedToken]}
                onPress={() => setToken("USDC")}
              >
                <View style={styles.tokenIcon}>
                  <Text style={styles.tokenIconText}>U</Text>
                </View>
                <Text style={[styles.tokenOptionText, token === "USDC" && styles.selectedTokenText]}>
                  USDC
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tokenOption, token === "LINK" && styles.selectedToken]}
                onPress={() => setToken("LINK")}
              >
                <View style={styles.tokenIcon}>
                  <Text style={styles.tokenIconText}>L</Text>
                </View>
                <Text style={[styles.tokenOptionText, token === "LINK" && styles.selectedTokenText]}>
                  LINK
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recipient Address */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Recipient Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#6366f1" />
              <TextInput
                style={styles.textInput}
                placeholder="0x..."
                placeholderTextColor="#6b7280"
                value={recipientAddress}
                onChangeText={setRecipientAddress}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {recipientAddress.length > 0 && !validateAddress(recipientAddress) && (
              <Text style={styles.errorText}>Invalid Ethereum address</Text>
            )}
          </View>

          {/* Amount */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Amount</Text>
            <View style={styles.amountContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="wallet" size={20} color="#6366f1" />
                <TextInput
                  style={styles.textInput}
                  placeholder="0.0"
                  placeholderTextColor="#6b7280"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
              </View>
              <TouchableOpacity 
                style={styles.maxButton}
                onPress={() => setAmount(maxAmount)}
              >
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceText}>
              Balance: {maxAmount} {token}
            </Text>
          </View>

          {/* Transaction Details */}
          <View style={styles.transactionDetails}>
            <Text style={styles.sectionTitle}>Transaction Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Network Fee (Gas)</Text>
              <Text style={styles.detailValue}>{gasEstimate} ETH</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total</Text>
              <Text style={styles.detailValue}>
                {amount ? `${parseFloat(amount) + parseFloat(gasEstimate)} ${token}` : `0 ${token}`}
              </Text>
            </View>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!validateAddress(recipientAddress) || !validateAmount(amount) || isLoading) && 
              styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!validateAddress(recipientAddress) || !validateAmount(amount) || isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="sync" size={20} color="#fff" style={styles.spinning} />
                <Text style={styles.sendButtonText}>Processing...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="send" size={20} color="#ffffff" />
                <Text style={styles.sendButtonText}>Send {token}</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Security Note */}
          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark" size={16} color="#10b981" />
            <Text style={styles.securityText}>
              Your transaction is secured by your wallet
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  tokenSelector: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  tokenOptions: {
    flexDirection: "row",
    gap: 12,
  },
  tokenOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedToken: {
    borderColor: "#6366f1",
    backgroundColor: "#6366f1",
  },
  tokenOptionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  selectedTokenText: {
    color: "#ffffff",
  },
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
  },
  tokenIconText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  textInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 12,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 8,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  maxButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  maxButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  balanceText: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 8,
  },
  transactionDetails: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  detailLabel: {
    color: "#9ca3af",
    fontSize: 14,
  },
  detailValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  sendButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sendButtonDisabled: {
    backgroundColor: "#4b5563",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinning: {
    transform: [{ rotate: "360deg" }],
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  securityText: {
    color: "#9ca3af",
    fontSize: 14,
    marginLeft: 8,
  },
}); 