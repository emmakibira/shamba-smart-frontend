import { Drawer } from "expo-router/drawer";
import React from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import CustomDrawerContent from "@/components/CustomDrawerContent";

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true, // Show header with hamburger icon
        headerTintColor: themeColors.tint,
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
        },
        drawerActiveTintColor: '#2E7D32',
        drawerInactiveTintColor: colorScheme === 'dark' ? '#cccccc' : '#333333',
        drawerActiveBackgroundColor: '#E8F5E9',
        drawerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#ffffff',
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="DashboardScreen"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <IconSymbol size={size} name="house.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AdvisoryScreen"
        options={{
          title: "Advisory",
          drawerIcon: ({ color, size }) => (
            <IconSymbol size={size} name="lightbulb.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CommunityScreen"
        options={{
          title: "Community",
          drawerIcon: ({ color, size }) => (
            <IconSymbol size={size} name="person.2.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="MarketScreen"
        options={{
          title: "Market",
          drawerIcon: ({ color, size }) => (
            <IconSymbol size={size} name="bag.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileScreen"
        options={{
          title: "Profile",
          drawerIcon: ({ color, size }) => (
            <IconSymbol size={size} name="person.fill" color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
