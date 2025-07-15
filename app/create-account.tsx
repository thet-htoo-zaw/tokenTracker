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
import {
    AccountData,
    createNewAccount
} from "./utils/account";

export default function CreateAccountScreen() {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [generatedAccount, setGeneratedAccount] = useState<AccountData | null>(null);

  // Generate a new account using utility functions
  const generateAccount = (): AccountData => {
    return createNewAccount(accountName, password);
  };

  const validateForm = () => {
    if (!validateAccountName(accountName)) {
      Alert.alert("Error", "Account name must be between 3 and 50 characters");
      return false;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert("Error", passwordValidation.errors[0]);
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    
    try {
      // Simulate account creation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newAccount = generateAccount();
      setGeneratedAccount(newAccount);
      setShowSeedPhrase(true);
    } catch (error) {
      Alert.alert("Creation Failed", "Unable to create account. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirmSeedPhrase = () => {
    if (generatedAccount) {
      // Store account data (in a real app, use secure storage)
      global.walletData = {
        address: generatedAccount.address,
        balance: "0.0",
        tokens: [],
      };
      
      Alert.alert(
        "Account Created Successfully!",
        "Your new Ethereum account has been created. Make sure to save your seed phrase in a secure location.",
        [
          {
            text: "Continue to Dashboard",
            onPress: () => router.push("/dashboard"),
          },
        ]
      );
    }
  };

  const copySeedPhrase = () => {
    if (generatedAccount) {
      // In a real app, copy to clipboard
      Alert.alert("Copied", "Seed phrase copied to clipboard");
    }
  };

  if (showSeedPhrase && generatedAccount) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowSeedPhrase(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Backup Your Account</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Warning */}
          <View style={styles.warningCard}>
            <Ionicons name="warning" size={24} color="#f59e0b" />
            <Text style={styles.warningTitle}>Important Security Notice</Text>
            <Text style={styles.warningText}>
              Write down your seed phrase and store it securely. Anyone with access to this phrase can control your account.
            </Text>
          </View>

          {/* Seed Phrase */}
          <View style={styles.seedPhraseCard}>
            <Text style={styles.sectionTitle}>Your Seed Phrase</Text>
            <View style={styles.seedPhraseContainer}>
              {generatedAccount.seedPhrase.map((word, index) => (
                <View key={index} style={styles.seedWord}>
                  <Text style={styles.seedWordNumber}>{index + 1}.</Text>
                  <Text style={styles.seedWordText}>{word}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={copySeedPhrase}>
              <Ionicons name="copy" size={20} color="#6366f1" />
              <Text style={styles.copyButtonText}>Copy Seed Phrase</Text>
            </TouchableOpacity>
          </View>

          {/* Account Info */}
          <View style={styles.accountInfoCard}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Name:</Text>
              <Text style={styles.infoValue}>{generatedAccount.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>
                {generatedAccount.address.slice(0, 8)}...{generatedAccount.address.slice(-6)}
              </Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmSeedPhrase}
          >
            <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
            <Text style={styles.confirmButtonText}>I've Saved My Seed Phrase</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.headerTitle}>Create New Account</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Account Name */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Account Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#6366f1" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter account name"
                placeholderTextColor="#6b7280"
                value={accountName}
                onChangeText={setAccountName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#6366f1" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter password (min 8 characters)"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            {password.length > 0 && password.length < 8 && (
              <Text style={styles.errorText}>Password must be at least 8 characters</Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#6366f1" />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm your password"
                placeholderTextColor="#6b7280"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          {/* Security Notice */}
          <View style={styles.securityCard}>
            <Ionicons name="shield-checkmark" size={24} color="#10b981" />
            <Text style={styles.securityTitle}>Security Features</Text>
            <Text style={styles.securityText}>
              • Your private keys are encrypted with your password{'\n'}
              • Seed phrase backup for account recovery{'\n'}
              • Local storage for enhanced security
            </Text>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              (!accountName.trim() || password.length < 8 || password !== confirmPassword || isCreating) && 
              styles.createButtonDisabled
            ]}
            onPress={handleCreateAccount}
            disabled={!accountName.trim() || password.length < 8 || password !== confirmPassword || isCreating}
          >
            {isCreating ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="sync" size={20} color="#fff" style={styles.spinning} />
                <Text style={styles.createButtonText}>Creating Account...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="add-circle" size={20} color="#ffffff" />
                <Text style={styles.createButtonText}>Create Account</Text>
              </>
            )}
          </TouchableOpacity>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  placeholder: {
    width: 40,
  },
  inputSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
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
    marginLeft: 4,
  },
  securityCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 8,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  createButtonDisabled: {
    backgroundColor: "#4f46e5",
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinning: {
    transform: [{ rotate: "360deg" }],
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  warningCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 8,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 20,
  },
  seedPhraseCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  seedPhraseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  seedWord: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    minWidth: 100,
  },
  seedWordNumber: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 8,
  },
  seedWordText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  copyButtonText: {
    color: "#6366f1",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  accountInfoCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  infoValue: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
}); 