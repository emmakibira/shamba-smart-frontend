// src/screens/DashboardScreen.tsx
import { WeatherService } from "../../services/weatherService";
import apiService from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  Cloud,
  Droplets,
  Leaf,
  Sprout,
  Sun,
  Thermometer,
  TrendingUp,
  Wind,
  Zap,
  Battery,
  MapPin,
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
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { translate } from "../../constants/translations";
import SensorService, { SensorDevice } from "../../services/sensors";

const { width } = Dimensions.get("window");

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  condition: string;
}

interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
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
  const { appUser } = useAuth();
  const { language } = useLanguage();
  const t = (key: Parameters<typeof translate>[0]) => translate(key, language);

  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(50)).current;
  const slideAnim2 = useRef(new Animated.Value(50)).current;
  const slideAnim3 = useRef(new Animated.Value(50)).current;
  const slideAnim4 = useRef(new Animated.Value(50)).current;
  const slideAnim5 = useRef(new Animated.Value(50)).current;

  const [sensors, setSensors] = useState<SensorDevice[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 0,
    humidity: 0,
    windSpeed: 0,
    rainfall: 0,
    condition: "Loading...",
  });

  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [userLocation, setUserLocation] = useState({
    latitude: -6.369028,
    longitude: 34.888822,
    address: "",
    region: "",
    country: "",
  });

  const [cropRecommendations, setCropRecommendations] = useState<
    CropRecommendation[]
  >([
    {
      id: "1",
      name: "Rice",
      profit: "+32%",
      season: "Summer",
      icon: <Sprout size={32} color="#2E7D32" />,
      color: "#2E7D32",
      bgColor: "#C8E6C9",
    },
    {
      id: "2",
      name: "Wheat",
      profit: "+28%",
      season: "Autumn",
      icon: <Leaf size={32} color="#8D6E63" />,
      color: "#8D6E63",
      bgColor: "#D7CCC8",
    },
    {
      id: "3",
      name: "Corn",
      profit: "+25%",
      season: "Spring",
      icon: <Zap size={32} color="#F57C00" />,
      color: "#F57C00",
      bgColor: "#FFE0B2",
    },
  ]);

  useEffect(() => {
    // Extract user location from appUser data
    extractUserLocation();
    
    // Fetch weather using user's location
    fetchWeatherFromOpenMeteo();
    
    // Try to fetch from backend, but don't block weather display
    fetchDashboardData().catch(err => {
      console.log('Backend not available, using local data only');
    });
    
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
        Animated.spring(slideAnim5, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [appUser]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Extract location from Firestore user document
  const extractUserLocation = () => {
    if (appUser?.location) {
      const location = appUser.location;
      setUserLocation({
        latitude: location.latitude || -6.369028,
        longitude: location.longitude || 34.888822,
        address: location.address || "",
        region: location.region || "",
        country: location.country || "",
      });
      console.log('📍 User location extracted:', location);
    } else if (appUser?.latitude && appUser?.longitude) {
      // Fallback if location is directly on user object
      setUserLocation({
        latitude: appUser.latitude,
        longitude: appUser.longitude,
        address: appUser.address || "",
        region: appUser.region || "",
        country: appUser.country || "",
      });
    }
  };

  const fetchWeatherFromOpenMeteo = async () => {
    try {
      console.log('🌤️ Fetching weather for location:', userLocation);
      
      const weatherResponse = await WeatherService.getFarmWeather(
        userLocation.latitude,
        userLocation.longitude
      );
      
      setWeatherData({
        temperature: weatherResponse.temperature,
        humidity: weatherResponse.humidity,
        windSpeed: weatherResponse.windSpeed,
        rainfall: weatherResponse.rainfall,
        condition: weatherResponse.condition,
      });

      if (weatherResponse.dailyForecast) {
        setDailyForecast(weatherResponse.dailyForecast);
      }

      console.log('✅ Weather updated from Open-Meteo:', weatherResponse.condition);
    } catch (error) {
      console.error("Error fetching weather from Open-Meteo:", error);
      setWeatherData({
        temperature: 25,
        humidity: 65,
        windSpeed: 12,
        rainfall: 0,
        condition: "Partly Cloudy",
      });
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await apiService.getDashboardOverview();

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
    }

    try {
      const sensorsData = await SensorService.getSensors();
      setSensors(sensorsData);
    } catch (sensorErr) {
      console.error("Error fetching sensors for dashboard:", sensorErr);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    let greetingText = "";
    
    if (hour < 12) {
      greetingText = t("greet.morning");
    } else if (hour < 17) {
      greetingText = t("greet.afternoon");
    } else {
      greetingText = t("greet.evening");
    }
    
    return greetingText;
  };

  // Updated to match Firestore document structure
  const getUserDisplayName = () => {
    // From your Firestore data, user has 'name' field
    if (appUser?.name && appUser.name.trim() !== "") {
      return appUser.name;
    }
    
    // Check for display name (might be added later)
    if (appUser?.displayName && appUser.displayName.trim() !== "") {
      return appUser.displayName;
    }
    
    // Check for first name
    if (appUser?.firstName) {
      return appUser.firstName;
    }
    
    // Use email username part (from your data: "emmakibira001@gmail.com")
    if (appUser?.email) {
      return appUser.email.split("@")[0];
    }
    
    // Use phone number (from your data: "0655151889")
    if (appUser?.phone) {
      return appUser.phone;
    }
    
    if (appUser?.phoneNumber) {
      return appUser.phoneNumber;
    }
    
    // Fallback based on role
    if (appUser?.role === "extension_officer") {
      return t("role.officer");
    }
    
    if (appUser?.role === "admin") {
      return t("role.admin");
    }
    
    return t("role.farmer");
  };

  // Get the user's role title
  const getUserRoleTitle = () => {
    if (appUser?.role === "extension_officer") {
      return t("role.officer");
    }
    if (appUser?.role === "admin") {
      return t("role.admin");
    }
    return t("role.farmer");
  };

  // Get user's location string
  const getUserLocationString = () => {
    const parts = [];
    if (userLocation.address) parts.push(userLocation.address);
    if (userLocation.region) parts.push(userLocation.region);
    if (userLocation.country) parts.push(userLocation.country);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  // Get user's farm name or location
  const getFarmName = () => {
    if (appUser?.farmName) {
      return appUser.farmName;
    }
    if (appUser?.farm?.name) {
      return appUser.farm.name;
    }
    // Fallback to location
    return getUserLocationString();
  };

  const getWeatherIcon = () => {
    const condition = weatherData.condition.toLowerCase();

    if (condition.includes("rain")) {
      return <Droplets size={56} color="#81C784" />;
    }

    if (condition.includes("cloud")) {
      return <Cloud size={56} color="#FFFFFF" />;
    }

    if (condition.includes("fog")) {
      return <Cloud size={56} color="#B0BEC5" />;
    }

    if (condition.includes("snow")) {
      return <Cloud size={56} color="#FFFFFF" />;
    }

    if (condition.includes("thunderstorm")) {
      return <Cloud size={56} color="#FFD700" />;
    }

    return <Sun size={56} color="#FFD700" />;
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f8f9fa" }}>
       
        <View
          style={[
            styles.header,
            {
              paddingTop: 0,
            },
          ]}
        >
          <LinearGradient
            colors={["#0F3D1E", "#2E7D32"]}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>
                  {getGreeting()}, {getUserRoleTitle()}!
                </Text>
                <Text style={styles.userName}>{getUserDisplayName()}</Text>
                {getFarmName() && (
                  <View style={styles.locationContainer}>
                    <MapPin size={12} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.farmName}>
                      {getFarmName()}
                    </Text>
                  </View>
                )}
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
                <View>
                  <Text style={styles.weatherTitle}>{t("dash.currentWeather")}</Text>
                  {(userLocation.region || userLocation.country) && (
                    <View style={styles.weatherLocationContainer}>
                      <MapPin size={12} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.weatherLocation}>
                        {userLocation.region}, {userLocation.country}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.weatherCondition}>
                  {weatherData.condition}
                </Text>
              </View>

              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>
                  {weatherData.temperature}°C
                </Text>
                <View style={styles.weatherIconContainer}>
                  {getWeatherIcon()}
                </View>
              </View>

              <View style={styles.weatherStats}>
                <View style={styles.statItem}>
                  <Droplets size={20} color="#81C784" />
                  <Text style={styles.statValue}>{weatherData.humidity}%</Text>
                  <Text style={styles.statLabel}>{t("dash.humidity")}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Wind size={20} color="#81C784" />
                  <Text style={styles.statValue}>
                    {weatherData.windSpeed} km/h
                  </Text>
                  <Text style={styles.statLabel}>{t("dash.windSpeed")}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Thermometer size={20} color="#81C784" />
                  <Text style={styles.statValue}>
                    {weatherData.rainfall} mm
                  </Text>
                  <Text style={styles.statLabel}>{t("dash.rainfall")}</Text>
                </View>
              </View>

              {/* Daily Forecast Section */}
              {dailyForecast.length > 0 && (
                <View style={styles.dailyForecastContainer}>
                  <Text style={styles.forecastTitle}>7-Day Forecast</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.forecastScroll}
                  >
                    {dailyForecast.map((day: DailyForecast, index: number) => (
                      <View key={index} style={styles.forecastDay}>
                        <Text style={styles.forecastDate}>{day.date}</Text>
                        <Text style={styles.forecastTemp}>{day.maxTemp}°</Text>
                        <Text style={styles.forecastMinTemp}>{day.minTemp}°</Text>
                        <Text style={styles.forecastCondition}>
                          {day.condition.length > 10 
                            ? day.condition.substring(0, 10) + '...' 
                            : day.condition}
                        </Text>
                        {day.precipitation > 0 && (
                          <View style={styles.rainIndicator}>
                            <Droplets size={12} color="#81D4FA" />
                            <Text style={styles.rainText}>{day.precipitation}mm</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </LinearGradient>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View
            style={[
              styles.section,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim2 }] },
            ]}
          >
            <Text style={styles.sectionTitle}>{t("dash.quickActions")}</Text>
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
                  <Text style={styles.quickActionText}>{t("dash.scanCrop")}</Text>
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
                  <Text style={styles.quickActionText}>{t("dash.marketPrices")}</Text>
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
                  <Text style={styles.quickActionText}>{t("dash.weatherAlert")}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Sensors Section */}
          <Animated.View
            style={[
              styles.section,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim5 }] },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t("dash.mySensors")}</Text>
              <TouchableOpacity activeOpacity={0.6}>
                <Text style={styles.seeAllText}>{t("dash.seeAll")}</Text>
              </TouchableOpacity>
            </View>
            {sensors.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sensorsScroll}
              >
                {sensors.map((sensor) => (
                  <View key={sensor.id} style={styles.sensorCard}>
                    <View style={styles.sensorCardHeader}>
                      <View style={styles.sensorTypeIconContainer}>
                        {sensor.sensor_type === "soil_moisture" ? (
                          <Droplets size={20} color="#2E7D32" />
                        ) : sensor.sensor_type === "temperature" ? (
                          <Thermometer size={20} color="#F57C00" />
                        ) : (
                          <Sprout size={20} color="#1565C0" />
                        )}
                      </View>
                      <View style={styles.batteryContainer}>
                        <Battery size={14} color="#666" />
                        <Text style={styles.batteryText}>{sensor.battery_level}%</Text>
                      </View>
                    </View>
                    <Text style={styles.sensorName} numberOfLines={1}>{sensor.name}</Text>
                    <Text style={styles.sensorLocation}>{sensor.location_name}</Text>
                    <View style={styles.sensorReadingContainer}>
                      <Text style={styles.sensorReadingValue}>
                        {sensor.latest_reading?.value !== undefined
                          ? `${sensor.latest_reading.value}`
                          : "--"}
                      </Text>
                      <Text style={styles.sensorReadingUnit}>{sensor.unit}</Text>
                    </View>
                    <View style={styles.sensorStatusBadge}>
                      <View style={[styles.statusDot, { backgroundColor: sensor.status === "active" ? "#4CAF50" : "#9E9E9E" }]} />
                      <Text style={styles.statusText}>{sensor.status.toUpperCase()}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptySensorsContainer}>
                <Text style={styles.emptySensorsText}>{t("dash.noSensors")}</Text>
              </View>
            )}
          </Animated.View>

          {/* Crop Health Status */}
          <Animated.View
            style={[
              styles.section,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim3 }] },
            ]}
          >
            <Text style={styles.sectionTitle}>{t("dash.cropHealth")}</Text>
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
              <Text style={styles.sectionTitle}>{t("dash.aiRecs")}</Text>
              <TouchableOpacity activeOpacity={0.6}>
                <Text style={styles.seeAllText}>{t("dash.seeAll")}</Text>
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
                    colors={[crop.bgColor || "#E8F5E9", "#FFFFFF"]}
                    style={styles.recommendationGradient}
                  >
                    <View style={styles.cropIconContainer}>{crop.icon}</View>
                    <Text style={styles.cropNameLarge}>{crop.name}</Text>
                    <View style={styles.profitBadge}>
                      <TrendingUp size={14} color="#2E7D32" />
                      <Text style={styles.profitText}>{crop.profit}</Text>
                    </View>
                    <Text style={styles.seasonText}>{t("dash.season")} {crop.season}</Text>
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  farmName: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
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
    alignItems: "flex-start",
    marginBottom: 20,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  weatherLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  weatherLocation: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
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
  // Daily Forecast Styles
  dailyForecastContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  forecastTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  forecastScroll: {
    marginHorizontal: -8,
  },
  forecastDay: {
    alignItems: 'center',
    marginRight: 24,
    minWidth: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 10,
  },
  forecastDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    fontWeight: '500',
  },
  forecastTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  forecastMinTemp: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  forecastCondition: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 4,
  },
  rainIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rainText: {
    fontSize: 10,
    color: '#81D4FA',
    fontWeight: '600',
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
  sensorsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  sensorCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sensorTypeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  batteryText: {
    fontSize: 10,
    color: "#666",
  },
  sensorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  sensorLocation: {
    fontSize: 10,
    color: "#999",
    marginBottom: 8,
  },
  sensorReadingContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  sensorReadingValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  sensorReadingUnit: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  sensorStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    color: "#666",
  },
  emptySensorsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  emptySensorsText: {
    fontSize: 14,
    color: "#999",
  },
});