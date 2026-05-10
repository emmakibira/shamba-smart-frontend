// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, FileText, Users, TrendingUp, User } from 'lucide-react-native';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AdvisoryScreen from '../screens/AdvisoryScreen';
import CommunityScreen from '../screens/CommunityScreen';
import MarketScreen from '../screens/MarketScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SmsScreen from '../screens/SmsScreen';
import AdminDashboard from '../screens/AdminDashboard';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            activeOpacity={0.7}
            style={[props.style, { alignItems: 'center' }]}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <Home size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && <View style={styles.tabIndicator} />}
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabLabel, { color }]}>{focused ? 'Home' : 'Home'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Advisory"
        component={AdvisoryScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <FileText size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && <View style={styles.tabIndicator} />}
            </View>
          ),
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>Advisory</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <Users size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && <View style={styles.tabIndicator} />}
            </View>
          ),
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>Community</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <TrendingUp size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && <View style={styles.tabIndicator} />}
            </View>
          ),
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>Market</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.tabIconContainer}>
              <User size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && <View style={styles.tabIndicator} />}
            </View>
          ),
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>Profile</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Sms" component={SmsScreen} />
      <Stack.Screen name="Admin" component={AdminDashboard} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 61, 30, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIndicator: {
    position: 'absolute',
    top: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#43A047',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
});