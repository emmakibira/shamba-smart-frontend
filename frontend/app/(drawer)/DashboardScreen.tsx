// src/screens/DashboardScreen.tsx
import apiService from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import {
    Bell,
    Droplets,
    Leaf,
    Sprout,
    Sun,
    Thermometer,
    TrendingUp,
    Wind,
    Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

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
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const getDashIcon = (iconName: string, size: number, color: string) => {
  switch (iconName) {
    case "sprout":
      return <Sprout size={size} color={color} />;
    case "leaf":
      return <Leaf size={size} color={color} />;
    case "zap":
      return <Zap size={size} color={color} />;
    default:
      return <Sprout size={size} color={color} />;
  }
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(50)).current;
  const slideAnim2 = useRef(new Animated.Value(50)).current;
  const slideAnim3 = useRef(new Animated.Value(50)).current;
  const slideAnim4 = useRef(new Animated.Value(50)).current;

  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    rainfall: 15,
    condition: "Partly Cloudy",
  });

  const [cropRecommendations, setCropRecommendations] = useState<
    CropRecommendation[]
  >([
    {
      id: "1",
      name: "Rice",
      profit: "+32%",
      season: "Kharif",
      icon: <Sprout size={32} color="#2E7D32" />,
      color: "#2E7D32",
      bgColor: "#C8E6C9",
    },
    {
      id: "2",
      name: "Wheat",
      profit: "+28%",
      season: "Rabi",
      icon: <Leaf size={32} color="#8D6E63" />,
      color: "#8D6E63",
      bgColor: "#D7CCC8",
    },
    {
      id: "3",
      name: "Corn",
      profit: "+25%",
      season: "Summer",
      icon: <Zap size={32} color="#F57C00" />,
      color: "#F57C00",
      bgColor: "#FFE0B2",
    },
  ]);

  useEffect(() => {
    fetchDashboardData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.stagger(150, [
        Animated.spring(slideAnim1, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim2, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim3, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim4, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiService.getDashboardOverview();
      if (response.weather) {
        setWeatherData({
          temperature: response.weather.temperature,
          humidity: response.weather.humidity,
          windSpeed: response.weather.wind_speed,
          rainfall: response.weather.rainfall,
          condition: response.weather.condition,
        });
      }
      if (response.recommendations && response.recommendations.length > 0) {
        const formattedRecs = response.recommendations.map((rec: any) => ({
          id: rec.id?.toString(),
          name: rec.crop_name,
          profit: rec.profit_margin,
          season: rec.season,
          icon: getDashIcon(rec.icon, 32, rec.color),
          color: rec.color,
          bgColor: rec.bgColor,
        }));
        setCropRecommendations(formattedRecs);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Use default data if API fails
    }
  };



  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f8f9fa" }}
      >
        <View
          style={[
            styles.header,
            {
              paddingTop:0,
            },
          ]}
        >
          <LinearGradient
            colors={["#0F3D1E", "#2E7D32"]}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Good Morning,</Text>
                <Text style={styles.userName}>Farmer John</Text>
              </View>
              <TouchableOpacity
                style={styles.notificationButton}
                activeOpacity={0.7}
              >
                <Bell size={24} color="#fff" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View
          style={[
            styles.content,
            { marginTop: 10, paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Weather Card */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim1 }],
            }}
          >
            <LinearGradient
              colors={["#1B5E20", "#2E7D32"]}
              style={styles.weatherCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.weatherHeader}>
                <Text style={styles.weatherTitle}>Current Weather</Text>
                <Text style={styles.weatherCondition}>
                  {weatherData.condition}
                </Text>
              </View>

              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>
                  {weatherData.temperature}°C
                </Text>
                <View style={styles.weatherIconContainer}>
                  <Sun size={56} color="#FFD700" />
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
                  <Text style={styles.statValue}>
                    {weatherData.windSpeed} km/h
                  </Text>
                  <Text style={styles.statLabel}>Wind Speed</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Thermometer size={20} color="#81C784" />
                  <Text style={styles.statValue}>
                    {weatherData.rainfall} mm
                  </Text>
                  <Text style={styles.statLabel}>Rainfall</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View 
            style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim2 }] }]}
          >
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity
                style={styles.quickActionButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#4CAF50", "#2E7D32"]}
                  style={styles.quickActionGradient}
                >
                  <Leaf size={24} color="#fff" />
                  <Text style={styles.quickActionText}>Scan Crop</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#2196F3", "#1976D2"]}
                  style={styles.quickActionGradient}
                >
                  <TrendingUp size={24} color="#fff" />
                  <Text style={styles.quickActionText}>Market Prices</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FF9800", "#F57C00"]}
                  style={styles.quickActionGradient}
                >
                  <Sun size={24} color="#fff" />
                  <Text style={styles.quickActionText}>Weather Alert</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Crop Health Status */}
          <Animated.View 
            style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim3 }] }]}
          >
            <Text style={styles.sectionTitle}>Crop Health Status</Text>
            <View style={styles.healthCard}>
              <View style={styles.healthBarContainer}>
                <View style={styles.healthLabel}>
                  <Text style={styles.cropName}>Tomatoes</Text>
                  <Text style={styles.healthPercentage}>85%</Text>
                </View>
                <View style={styles.healthBar}>
                  <Animated.View
                    style={[
                      styles.healthFill,
                      { width: "85%", backgroundColor: "#E53935" },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.healthBarContainer}>
                <View style={styles.healthLabel}>
                  <Text style={styles.cropName}>Peppers</Text>
                  <Text style={styles.healthPercentage}>72%</Text>
                </View>
                <View style={styles.healthBar}>
                  <View
                    style={[
                      styles.healthFill,
                      { width: "72%", backgroundColor: "#F57C00" },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.healthBarContainer}>
                <View style={styles.healthLabel}>
                  <Text style={styles.cropName}>Corn</Text>
                  <Text style={styles.healthPercentage}>93%</Text>
                </View>
                <View style={styles.healthBar}>
                  <View
                    style={[
                      styles.healthFill,
                      { width: "93%", backgroundColor: "#2E7D32" },
                    ]}
                  />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* AI Crop Recommendations */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Recommendations</Text>
              <TouchableOpacity activeOpacity={0.6}>
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
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: slideAnim4.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30 + index * 5, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={["#f8f9fa", "#fff"]}
                    style={styles.recommendationGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.cropIconContainer}>{crop.icon}</View>
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
    backgroundColor: "#f8f9fa",
  },
  header: {},
  headerGradient: {
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FF5252",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    paddingHorizontal: 20,
    zIndex: 10,
  },
  weatherCard: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  weatherCondition: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  temperatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  temperature: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#fff",
  },
  weatherIconContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 35,
  },
  weatherStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  seeAllText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "600",
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  healthCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  healthBarContainer: {
    marginBottom: 20,
  },
  healthLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cropName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  healthPercentage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  healthBar: {
    height: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    overflow: "hidden",
  },
  healthFill: {
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 5,
  },
  recommendationsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  recommendationCard: {
    width: width * 0.42,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  recommendationGradient: {
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  cropIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
  },
  cropNameLarge: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  profitBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 8,
  },
  profitText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
    marginLeft: 6,
  },
  seasonText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
