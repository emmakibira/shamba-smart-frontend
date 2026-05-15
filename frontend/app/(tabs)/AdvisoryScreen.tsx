// src/screens/AdvisoryScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import {
  Bug,
  Calendar,
  ChevronRight,
  Clock,
  Droplets,
  Filter,
  Leaf,
  Search,
  Sprout,
  Thermometer,
  TrendingDown,
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AdvisoryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  iconName:
    | "bug"
    | "droplets"
    | "wind"
    | "leaf"
    | "trending-up"
    | "zap"
    | "sprout"
    | "trending-down";
  color: string;
  bgColor: string;
  isNew?: boolean;
}

const { width } = Dimensions.get("window");

const getIcon = (iconName: string, size: number, color: string) => {
  switch (iconName) {
    case "bug":
      return <Bug size={size} color={color} />;
    case "droplets":
      return <Droplets size={size} color={color} />;
    case "wind":
      return <Wind size={size} color={color} />;
    case "leaf":
      return <Leaf size={size} color={color} />;
    case "trending-up":
      return <TrendingUp size={size} color={color} />;
    case "zap":
      return <Zap size={size} color={color} />;
    case "sprout":
      return <Sprout size={size} color={color} />;
    case "trending-down":
      return <TrendingDown size={size} color={color} />;
    default:
      return <Bug size={size} color={color} />;
  }
};

export default function AdvisoryScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const categories = ["All", "Crops", "Pests", "Weather", "Soil", "Market"];

  const advisoryData: AdvisoryItem[] = [
    {
      id: "1",
      title: "Early Blight in Tomatoes: Prevention Tips",
      category: "Pests",
      date: "2 days ago",
      readTime: "5 min read",
      iconName: "bug",
      color: "#D32F2F",
      bgColor: "#FFCDD2",
      isNew: true,
    },
    {
      id: "2",
      title: "Optimal Irrigation Schedule for Summer Crops",
      category: "Crops",
      date: "5 days ago",
      readTime: "8 min read",
      iconName: "droplets",
      color: "#1976D2",
      bgColor: "#BBDEFB",
    },
    {
      id: "3",
      title: "Weather Alert: Heavy Rainfall Expected",
      category: "Weather",
      date: "1 day ago",
      readTime: "3 min read",
      iconName: "wind",
      color: "#0288D1",
      bgColor: "#B3E5FC",
      isNew: true,
    },
    {
      id: "4",
      title: "Soil Health Management: Organic Methods",
      category: "Soil",
      date: "1 week ago",
      readTime: "10 min read",
      iconName: "leaf",
      color: "#7B1FA2",
      bgColor: "#E1BEE7",
    },
    {
      id: "5",
      title: "Market Trends: Crop Prices This Season",
      category: "Market",
      date: "3 days ago",
      readTime: "6 min read",
      iconName: "trending-up",
      color: "#F57C00",
      bgColor: "#FFE0B2",
    },
    {
      id: "6",
      title: "Nitrogen Fertilizer Optimization Guide",
      category: "Soil",
      date: "4 days ago",
      readTime: "7 min read",
      iconName: "zap",
      color: "#C0CA33",
      bgColor: "#F1F8E9",
    },
    {
      id: "7",
      title: "Sustainable Crop Rotation Strategies",
      category: "Crops",
      date: "6 days ago",
      readTime: "9 min read",
      iconName: "sprout",
      color: "#388E3C",
      bgColor: "#C8E6C9",
    },
    {
      id: "8",
      title: "Price Drop Alert: Adjust Your Strategy",
      category: "Market",
      date: "1 hour ago",
      readTime: "4 min read",
      iconName: "trending-down",
      color: "#D32F2F",
      bgColor: "#FFCDD2",
    },
  ];

  const filteredAdvisories = advisoryData
    .filter(
      (item) =>
        selectedCategory === "All" || item.category === selectedCategory,
    )
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: "clamp",
  });

  const handleAdvisoryPress = (advisory: AdvisoryItem) => {
    console.log("Open advisory:", advisory.title);
  };

  const renderAdvisoryCard = (advisory: AdvisoryItem, index: number) => {
    const itemAnimValue = new Animated.Value(0);

    useEffect(() => {
      Animated.spring(itemAnimValue, {
        toValue: 1,
        delay: index * 50,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        key={advisory.id}
        style={[
          styles.advisoryCard,
          {
            opacity: itemAnimValue,
            transform: [
              {
                translateY: itemAnimValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.advisoryContent}
          onPress={() => handleAdvisoryPress(advisory)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[advisory.color, advisory.color + "CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.advisoryIconContainer}
          >
            {getIcon(advisory.iconName, 28, "#fff")}
          </LinearGradient>

          <View style={styles.advisoryInfo}>
            <View style={styles.advisoryHeader}>
              <Text style={styles.advisoryCategory}>{advisory.category}</Text>
              {advisory.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newText}>NEW</Text>
                </View>
              )}
            </View>
            <Text style={styles.advisoryTitle} numberOfLines={2}>
              {advisory.title}
            </Text>
            <View style={styles.advisoryMeta}>
              <View style={styles.metaItem}>
                <Calendar size={12} color="#999" />
                <Text style={styles.metaText}>{advisory.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Clock size={12} color="#999" />
                <Text style={styles.metaText}>{advisory.readTime}</Text>
              </View>
            </View>
          </View>
          <ChevronRight size={20} color="#ccc" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          { height: headerHeight, paddingTop: insets.top + 10 },
        ]}
      >
        <LinearGradient
          colors={["#0F3D1E", "#2E7D32"]}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Expert Advisory</Text>
          <Text style={styles.headerSubtitle}>AI-powered farming insights</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search advisories..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <Filter size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((category, index) => (
              <Animated.View
                key={category}
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50 - index * 5, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>

          {/* AI Recommendation Card */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <LinearGradient
              colors={["#1B5E20", "#43A047"]}
              style={styles.aiCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.aiCardContent}>
                <View style={styles.aiCardText}>
                  <Text style={styles.aiLabel}>AI RECOMMENDATION</Text>
                  <Text style={styles.aiTitle}>
                    Based on your region's weather patterns
                  </Text>
                  <Text style={styles.aiDescription}>
                    Consider planting drought-resistant seeds this season to
                    maximize yield
                  </Text>
                  <TouchableOpacity style={styles.aiButton} activeOpacity={0.8}>
                    <Text style={styles.aiButtonText}>View Details</Text>
                    <ChevronRight size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <LinearGradient
                  colors={["#FFB74D", "#FFA726"]}
                  style={styles.aiIconContainer}
                >
                  <Sprout size={48} color="#fff" />
                </LinearGradient>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Advisory List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Insights</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={styles.viewAllText}>
                View All ({filteredAdvisories.length})
              </Text>
            </TouchableOpacity>
          </View>

          {filteredAdvisories.length > 0 ? (
            filteredAdvisories.map((advisory, index) =>
              renderAdvisoryCard(advisory, index),
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Search size={64} color="#DDD" />
              <Text style={styles.emptyTitle}>No advisories found</Text>
              <Text style={styles.emptyText}>
                Try searching with different keywords or select another category
              </Text>
            </View>
          )}

          {/* Weather Forecast Card */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View style={styles.weatherForecastCard}>
              <View style={styles.forecastHeader}>
                <Text style={styles.forecastTitle}>7-Day Weather Forecast</Text>
                <Thermometer size={20} color="#2E7D32" />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.forecastScroll}
              >
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => (
                    <View key={day} style={styles.forecastDay}>
                      <Text style={styles.forecastDayName}>{day}</Text>
                      <LinearGradient
                        colors={["#FFB74D", "#FFA726"]}
                        style={styles.forecastIconContainer}
                      >
                        <Thermometer size={20} color="#fff" />
                      </LinearGradient>
                      <Text style={styles.forecastTemp}>{25 + index}°C</Text>
                      <Text style={styles.forecastCondition}>
                        {index % 2 === 0 ? "Clear" : "Cloudy"}
                      </Text>
                    </View>
                  ),
                )}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 140,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
  },
  categoryChipActive: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  aiCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  aiCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aiCardText: {
    flex: 1,
  },
  aiLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.5,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 8,
    lineHeight: 20,
  },
  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    width: 160,
  },
  aiButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginRight: 4,
    flex: 1,
  },
  aiIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "600",
  },
  advisoryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  advisoryContent: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
  },
  advisoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  advisoryInfo: {
    flex: 1,
  },
  advisoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  advisoryCategory: {
    fontSize: 11,
    color: "#2E7D32",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  newBadge: {
    backgroundColor: "#FF5252",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  advisoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },
  advisoryMeta: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#CCC",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  weatherForecastCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  forecastHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  forecastScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  forecastDay: {
    alignItems: "center",
    marginRight: 18,
  },
  forecastDayName: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    fontWeight: "600",
  },
  forecastIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  forecastTemp: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  forecastCondition: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
  },
});
