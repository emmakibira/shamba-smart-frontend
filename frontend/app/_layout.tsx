import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { SubscriptionProvider } from "../contexts/SubscriptionContext";

import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function RootLayoutNav() {
  const { hasCompletedOnboarding, isLoggedIn, loading } = useAuth();
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const currentRoute = segments[0];
    const isAuthRoute = currentRoute === '(drawer)';

    if (!hasCompletedOnboarding) {
      if (currentRoute !== 'OnboardingScreen') {
        router.replace('/OnboardingScreen');
      }
    } else if (!isLoggedIn) {
      if (currentRoute !== 'LoginScreen' && currentRoute !== 'RegistrationScreen') {
        router.replace('/LoginScreen');
      }
    } else if (!isAuthRoute && currentRoute !== 'modal') {
      // If logged in and completed onboarding, go to the main app area
      router.replace('/(drawer)/MarketScreen');
    }
  }, [loading, hasCompletedOnboarding, isLoggedIn, segments]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0F3D1E",
        }}
      >
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnboardingScreen" />
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="RegistrationScreen" />
        <Stack.Screen name="(drawer)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SubscriptionProvider>
          <RootLayoutNav />
        </SubscriptionProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
