import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { user, userProfile, signOut } = useAuth();
  const { colors } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="person-circle" size={80} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={[styles.infoItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Display Name</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{userProfile?.displayName || 'Not set'}</Text>
          </View>

          <View style={[styles.infoItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user?.email}</Text>
          </View>

          <View style={[styles.infoItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Balance</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              ${userProfile?.balance.toFixed(2) || '0.00'}
            </Text>
          </View>

          <View style={[styles.infoItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Favorites</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {userProfile?.favorites.length || 0} coins
            </Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
            <Ionicons name="settings" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
            <Ionicons name="shield-checkmark" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Security</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
            <Ionicons name="help-circle" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.signOutButton, { borderColor: colors.error }]} 
          onPress={handleSignOut}
        >
          <Ionicons name="log-out" size={20} color={colors.error} />
          <Text style={[styles.signOutButtonText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  infoSection: {
    marginBottom: 40,
  },
  infoItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionsSection: {
    marginBottom: 40,
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  signOutButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 