import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#0a0a0a',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: "Connect Wallet",
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="dashboard" 
          options={{ 
            title: "Portfolio Dashboard",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="token-detail" 
          options={{ 
            title: "Token Details",
            headerBackTitle: "Back"
          }} 
        />
        <Stack.Screen 
          name="send-token" 
          options={{ 
            title: "Send Token",
            headerBackTitle: "Back"
          }} 
        />
      </Stack>
    </>
  );
}
