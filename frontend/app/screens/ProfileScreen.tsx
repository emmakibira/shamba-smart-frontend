// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Shield, Leaf, CreditCard, HelpCircle, LogOut, ChevronRight, Award, TrendingUp, Users, Calendar } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscription } from '../contexts/SubscriptionContext';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  badge?: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { isPremium, upgradeToPremium, communityPostsThisMonth } = useSubscription();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: User,
      onPress: () => console.log('Account Settings'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      onPress: () => console.log('Notifications'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      onPress: () => console.log('Privacy'),
    },
    {
      id: 'subscription',
      title: 'Subscription',
      icon: CreditCard,
      badge: isPremium ? 'Premium' : 'Free',
      onPress: () => !isPremium && upgradeToPremium(),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      onPress: () => console.log('Help'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <LinearGradient colors={['#0F3D1E', '#2E7D32']} style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <View style={styles.profileInfo}>
              <Image
                source={require('../../assets/profile-avatar.png')}
                style={styles.avatar}
              />
              <Text style={styles.userName}>Farmer John</Text>
              <Text style={styles.userEmail}>john.farmer@example.com</Text>
              <View style={styles.locationBadge}>
                <Text style={styles.locationText}>📍 Punjab, India</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Award size={24} color="#2E7D32" />
              <Text style={styles.statNumber}>1,234</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#2E7D32" />
              <Text style={styles.statNumber}>₹ 2,45,000</Text>
              <Text style={styles.statLabel}>Total Profit</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={24} color="#2E7D32" />
              <Text style={styles.statNumber}>567</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statCard}>
              <Calendar size={24} color="#2E7D32" />
              <Text style={styles.statNumber}>2 Years</Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
          </View>

          {/* Subscription Banner */}
          {!isPremium && (
            <LinearGradient
              colors={['#FFD54F', '#FFC107']}
              style={styles.premiumBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.premiumContent}>
                <Leaf size={32} color="#fff" />
                <View style={styles.premiumTextContainer}>
                  <Text style={styles.premiumTitle}>Go Premium</Text>
                  <Text style={styles.premiumDescription}>Unlock unlimited posts and expert features</Text>
                </View>
                <TouchableOpacity style={styles.upgradeButton} onPress={upgradeToPremium}>
                  <Text style={styles.upgradeButtonText}>Upgrade</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          )}

          {/* Community Stats */}
          <View style={styles.communityStatsCard}>
            <Text style={styles.communityStatsTitle}>Community Activity</Text>
            <View style={styles.postLimitBar}>
              <View style={styles.postLimitHeader}>
                <Text style={styles.postLimitLabel}>Monthly Posts</Text>
                <Text style={styles.postLimitValue}>
                  {communityPostsThisMonth} / {isPremium ? '∞' : '5'}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min((communityPostsThisMonth / 5) * 100, 100)}%` }
                  ]} 
                />
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Settings</Text>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <item.icon size={22} color="#666" />
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <View style={styles.menuRight}>
                  {item.badge && (
                    <View style={[styles.badge, item.badge === 'Premium' && styles.premiumBadge]}>
                      <Text style={[styles.badgeText, item.badge === 'Premium' && styles.premiumBadgeText]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <ChevronRight size={18} color="#ccc" />
                </View>
              </TouchableOpacity>
            ))}

            {/* Toggle Items */}
            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Bell size={22} color="#666" />
                <Text style={styles.menuTitle}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#ddd', true: '#2E7D32' }}
              />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Settings size={22} color="#666" />
                <Text style={styles.menuTitle}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#ddd', true: '#2E7D32' }}
              />
            </View>

            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
              <View style={styles.menuLeft}>
                <LogOut size={22} color="#FF5252" />
                <Text style={[styles.menuTitle, styles.logoutText]}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  locationBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: -20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  premiumBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  premiumDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00',
  },
  communityStatsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  communityStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  postLimitBar: {
    gap: 8,
  },
  postLimitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postLimitLabel: {
    fontSize: 14,
    color: '#666',
  },
  postLimitValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D32',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 8,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadge: {
    backgroundColor: '#FFD54F',
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
  },
  premiumBadgeText: {
    color: '#333',
    fontWeight: '600',
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  logoutText: {
    color: '#FF5252',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    marginBottom: 10,
  },
});