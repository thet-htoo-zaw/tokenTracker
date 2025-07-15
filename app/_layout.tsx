import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function StackNavigator() {
  const { colors, isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: "Crypto Tracker",
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: "Sign In",
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="signup" 
          options={{ 
            title: "Create Account",
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="coin/[id]" 
          options={{ 
            title: "Coin Details",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="buy" 
          options={{ 
            title: "Buy Crypto",
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="swap" 
          options={{ 
            title: "Swap Crypto",
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="favorites" 
          options={{ 
            title: "Favorites",
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="search" 
          options={{ 
            title: "Search",
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="alerts" 
          options={{ 
            title: "Price Alerts",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="history" 
          options={{ 
            title: "Transaction History",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ 
            title: "Profile",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="create-account" 
          options={{ 
            title: "Create Account",
            headerBackTitle: "Back"
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <StackNavigator />
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
