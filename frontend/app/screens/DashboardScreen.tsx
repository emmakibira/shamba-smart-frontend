// src/screens/DashboardScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Droplets, Thermometer, Wind, Sun, TrendingUp, Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  condition: string;
}

interface CropRecommendation {
  id: string;
  name: string;
  profit: string;
  season: string;
  image: any;
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const weatherData: WeatherData = {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    rainfall: 15,
    condition: 'Partly Cloudy',
  };

  const cropRecommendations: CropRecommendation[] = [
    { id: '1', name: 'Rice', profit: '+32%', season: 'Kharif', image: require('../../assets/rice.png') },
    { id: '2', name: 'Wheat', profit: '+28%', season: 'Rabi', image: require('../../assets/wheat.png') },
    { id: '3', name: 'Corn', profit: '+25%', season: 'Summer', image: require('../../assets/corn.png') },
  ];

  useEffect(() => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.8, 0.6],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity, paddingTop: insets.top + 10 }]}>
        <LinearGradient
          colors={['#0F3D1E', '#2E7D32']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good Morning,</Text>
              <Text style={styles.userName}>Farmer John</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={[styles.content, { paddingBottom: insets.bottom + 80 }]}>
          {/* Weather Card */}
          <LinearGradient
            colors={['#1B5E20', '#2E7D32']}
            style={styles.weatherCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.weatherHeader}>
              <Text style={styles.weatherTitle}>Current Weather</Text>
              <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
            </View>
            
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
              <View style={styles.weatherIconContainer}>
                <Sun size={48} color="#FFD700" />
              </View>
            </View>

            <View style={styles.weatherStats}>
              <View style={styles.statItem}>
                <Droplets size={20} color="#81C784" />
                <Text style={styles.statValue}>{weatherData.humidity}%</Text>
                <Text style={styles.statLabel}>Humidity</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Wind size={20} color="#81C784" />
                <Text style={styles.statValue}>{weatherData.windSpeed} km/h</Text>
                <Text style={styles.statLabel}>Wind Speed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Thermometer size={20} color="#81C784" />
                <Text style={styles.statValue}>{weatherData.rainfall} mm</Text>
                <Text style={styles.statLabel}>Rainfall</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Crop Health Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crop Health Status</Text>
            <View style={styles.healthCard}>
              <View style={styles.healthBarContainer}>
                <View style={styles.healthLabel}>
                  <Text style={styles.cropName}>Tomatoes</Text>
                  <Text style={styles.healthPercentage}>85%</Text>
                </View>
                <View style={styles.healthBar}>
                  <Animated.View style={[styles.healthFill, { width: '85%' }]} />
                </View>
              </View>
              <View style={styles.healthBarContainer}>
                <View style={styles.healthLabel}>
                  <Text style={styles.cropName}>Peppers</Text>
                  <Text style={styles.healthPercentage}>72%</Text>
                </View>
                <View style={styles.healthBar}>
                  <View style={[styles.healthFill, { width: '72%' }]} />
                </View>
              </View>
              <View style={styles.healthBarContainer}>
                <View style={styles.healthLabel}>
                  <Text style={styles.cropName}>Corn</Text>
                  <Text style={styles.healthPercentage}>93%</Text>
                </View>
                <View style={styles.healthBar}>
                  <View style={[styles.healthFill, { width: '93%' }]} />
                </View>
              </View>
            </View>
          </View>

          {/* AI Crop Recommendations */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Recommendations</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendationsScroll}
            >
              {cropRecommendations.map((crop, index) => (
                <Animated.View
                  key={crop.id}
                  style={[
                    styles.recommendationCard,
                    {
                      transform: [{ scale: 1 }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#f5f5f5', '#fff']}
                    style={styles.recommendationGradient}
                  >
                    <Image source={crop.image} style={styles.cropImage} />
                    <Text style={styles.cropNameLarge}>{crop.name}</Text>
                    <View style={styles.profitBadge}>
                      <TrendingUp size={14} color="#2E7D32" />
                      <Text style={styles.profitText}>{crop.profit}</Text>
                    </View>
                    <Text style={styles.seasonText}>{crop.season} Season</Text>
                  </LinearGradient>
                </Animated.View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 14,
    
  color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 140,
    paddingHorizontal: 16,
  },
  weatherCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  weatherCondition: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  temperatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  healthCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  healthBarContainer: {
    marginBottom: 16,
  },
  healthLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cropName: {
    fontSize: 14,
    color: '#666',
  },
  healthPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  healthBar: {
    height: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  healthFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
  recommendationsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  recommendationCard: {
    width: width * 0.4,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationGradient: {
    padding: 16,
    alignItems: 'center',
  },
  cropImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  cropNameLarge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  profitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  profitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 4,
  },
  seasonText: {
    fontSize: 12,
    color: '#999',
  },
});