// app.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SubscriptionProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </SubscriptionProvider>
  );
}