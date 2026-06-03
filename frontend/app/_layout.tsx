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
import { LanguageProvider } from "../contexts/LanguageContext";
import { SessionProvider } from "../contexts/SessionContext";

import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function RootLayoutNav() {
  const { hasCompletedOnboarding, isLoggedIn, loading, role } = useAuth();
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
    } else if (role === "admin" && currentRoute !== "admin") {
      router.replace("/admin/AdminDashboardScreen" as never);
    } else if (role === "extension_officer" && currentRoute !== "officer") {
      router.replace("/officer/OfficerDashboardScreen" as never);
    } else if (!isAuthRoute && currentRoute !== "modal") {
      router.replace("/(drawer)/DashboardScreen");
    }
  }, [loading, hasCompletedOnboarding, isLoggedIn, role, segments]);

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
        <Stack.Screen name="officer" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
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
          <LanguageProvider>
            <SessionProvider>
              <RootLayoutNav />
            </SessionProvider>
          </LanguageProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
