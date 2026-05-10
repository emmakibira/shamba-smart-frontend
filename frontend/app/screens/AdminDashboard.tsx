// src/screens/AdminDashboard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, TrendingUp, DollarSign, Activity, Settings, Bell, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
}

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const stats: StatCard[] = [
    { title: 'Total Users', value: '12,345', change: 12.5, icon: Users, color: '#2E7D32' },
    { title: 'Active Farms', value: '8,234', change: 8.2, icon: Activity, color: '#1976D2' },
    { title: 'Revenue', value: '₹45.2L', change: 23.1, icon: DollarSign, color: '#F57C00' },
    { title: 'Growth', value: '+24%', change: 24, icon: TrendingUp, color: '#9C27B0' },
  ];

  const recentActivities = [
    { id: '1', user: 'Rajesh Kumar', action: 'Joined the platform', time: '2 min ago' },
    { id: '2', user: 'Priya Sharma', action: 'Upgraded to Premium', time: '15 min ago' },
    { id: '3', user: 'Amit Patel', action: 'Posted in Community', time: '1 hour ago' },
    { id: '4', user: 'Suresh Singh', action: 'Requested advisory', time: '3 hours ago' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F3D1E', '#2E7D32'] as [string, string]} style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
          </View>
          <TouchableOpacity style={styles.notificationIcon}>
            <Bell size={24} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Animated.View
                key={stat.title}
                style={[
                  styles.statCard,
                  {
                    transform: [{ scale: 1 }],
                  },
                ]}
              >
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <View style={[styles.changeBadge, stat.change > 0 ? styles.positiveChange : styles.negativeChange]}>
                  <Text style={styles.changeText}>
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient colors={['#2E7D32', '#43A047'] as [string, string]} style={styles.actionGradient}>
                  <Users size={32} color="#fff" />
                  <Text style={styles.actionText}>Manage Users</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient colors={['#1976D2', '#42A5F5'] as [string, string]} style={styles.actionGradient}>
                  <Activity size={32} color="#fff" />
                  <Text style={styles.actionText}>Analytics</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient colors={['#F57C00', '#FF9800'] as [string, string]} style={styles.actionGradient}>
                  <DollarSign size={32} color="#fff" />
                  <Text style={styles.actionText}>Payments</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient colors={['#9C27B0', '#CE93D8'] as [string, string]} style={styles.actionGradient}>
                  <Settings size={32} color="#fff" />
                  <Text style={styles.actionText}>Settings</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityAvatar}>
                  <Text style={styles.activityAvatarText}>{activity.user[0]}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityUser}>{activity.user}</Text>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <ChevronRight size={16} color="#ccc" />
              </View>
            ))}
          </View>

          {/* Chart Placeholder */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>User Growth Overview</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>Analytics Chart</Text>
            </View>
          </View>
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
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  changeBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  positiveChange: {
    backgroundColor: '#E8F5E9',
  },
  negativeChange: {
    backgroundColor: '#FFEBEE',
  },
  changeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  activityContent: {
    flex: 1,
  },
  activityUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activityAction: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    color: '#999',
  },
});