// src/screens/MarketScreen.tsx
import { CROP_LABELS } from "@/constants/crops";
import { getLatestMarketReport } from "@/services/marketDataService";
import type { MarketWeekReport } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronRight,
  Clock,
  Filter,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Commodity {
  id: string;
  name: string;
  price: number;
  change: number;
  unit: string;
  isTrendingUp: boolean;
  demand: "High" | "Medium" | "Low";
  volume: string;
}

interface MarketNews {
  id: string;
  title: string;
  summary: string;
  date: string;
  isImportant: boolean;
}

function reportToCommodities(report: MarketWeekReport): Commodity[] {
  return report.national
    .filter((row) => row.priceThisWeek != null)
    .map((row) => {
      const labels = CROP_LABELS[row.crop];
      const change = row.changePercent ?? 0;
      return {
        id: row.crop,
        name: labels.en,
        price: row.priceThisWeek!,
        change,
        unit: labels.unit,
        isTrendingUp: change >= 0,
        demand:
          Math.abs(change) >= 5
            ? "High"
            : Math.abs(change) >= 2
              ? "Medium"
              : ("Low" as const),
        volume: labels.sw,
      };
    });
}

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [report, setReport] = useState<MarketWeekReport | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getLatestMarketReport().then(setReport);
  }, []);

  const commodities = useMemo(
    () => (report ? reportToCommodities(report) : []),
    [report],
  );

  const marketNews: MarketNews[] = useMemo(() => {
    if (!report) return [];
    return [
      {
        id: "1",
        title: `Wizara ya Kilimo — ${report.weekLabel}`,
        summary: `National wholesale averages (TZS/kg). Source: ${report.sourcePdf}`,
        date: new Date(report.uploadedAt).toLocaleDateString(),
        isImportant: true,
      },
      {
        id: "2",
        title: "Mtama, ulezi na mchele — bei zimepungua",
        summary:
          "Weekly summary: sorghum, cassava flour and rice down vs prior week; maize, beans, millet and potatoes unchanged.",
        date: report.weekLabel,
        isImportant: false,
      },
    ];
  }, [report]);

  const filteredCommodities = commodities.filter((commodity) =>
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 100],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.9, 0.8],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          { height: headerHeight, paddingTop: 0, opacity: headerOpacity },
        ]}
      >
        <LinearGradient
          colors={["#0F3D1E", "#2E7D32"]}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Market Prices</Text>
          <Text style={styles.headerSubtitle}>
            {report
              ? `MoA Tanzania · ${report.weekLabel}`
              : "Ministry of Agriculture weekly report"}
          </Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search commodities..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
          {/* Market Summary Card */}
          <LinearGradient
            colors={["#1B5E20", "#43A047"]}
            style={styles.summaryCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Market Summary</Text>
              <Text style={styles.summaryDate}>Today, 10:30 AM</Text>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>↑ 2.4%</Text>
                <Text style={styles.summaryStatLabel}>Overall Index</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>TSh 42.5M</Text>
                <Text style={styles.summaryStatLabel}>Total Volume</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>15</Text>
                <Text style={styles.summaryStatLabel}>Active Markets</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Best Price Alert */}
          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Star size={20} color="#FFD700" fill="#FFD700" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Best Price Today</Text>
              <Text style={styles.alertText}>
                Mchele at TSh 2,300/kg in Dodoma Market
              </Text>
            </View>
            <ChevronRight size={20} color="#2E7D32" />
          </View>

          {/* Commodities List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Commodity Prices</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {filteredCommodities.map((commodity, index) => (
            <Animated.View
              key={commodity.id}
              style={[
                styles.commodityCard,
                {
                  transform: [{ scale: 1 }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.commodityContent}
                activeOpacity={0.7}
              >
                <View style={styles.commodityInfo}>
                  <Text style={styles.commodityName}>{commodity.name}</Text>
                  <Text style={styles.commodityUnit}>{commodity.unit}</Text>
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.commodityPrice}>
                    TSh {commodity.price.toLocaleString()}
                  </Text>
                  <View
                    style={[
                      styles.changeBadge,
                      commodity.isTrendingUp
                        ? styles.positiveChange
                        : styles.negativeChange,
                    ]}
                  >
                    {commodity.isTrendingUp ? (
                      <TrendingUp size={12} color="#4CAF50" />
                    ) : (
                      <TrendingDown size={12} color="#FF5252" />
                    )}
                    <Text
                      style={[
                        styles.changeText,
                        commodity.isTrendingUp
                          ? styles.positiveText
                          : styles.negativeText,
                      ]}
                    >
                      {commodity.change > 0 ? "+" : ""}
                      {commodity.change}%
                    </Text>
                  </View>
                </View>
                <View style={styles.demandBadge}>
                  <Text
                    style={[
                      styles.demandText,
                      commodity.demand === "High"
                        ? styles.highDemand
                        : commodity.demand === "Medium"
                          ? styles.mediumDemand
                          : styles.lowDemand,
                    ]}
                  >
                    {commodity.demand} Demand
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {/* Market News Section */}
          <View style={styles.newsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Market News</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>More News</Text>
              </TouchableOpacity>
            </View>
            {marketNews.map((news, index) => (
              <TouchableOpacity
                key={news.id}
                style={styles.newsCard}
                activeOpacity={0.7}
              >
                {news.isImportant && (
                  <View style={styles.importantBadge}>
                    <Text style={styles.importantText}>IMPORTANT</Text>
                  </View>
                )}
                <Text style={styles.newsTitle}>{news.title}</Text>
                <Text style={styles.newsSummary}>{news.summary}</Text>
                <View style={styles.newsMeta}>
                  <Clock size={12} color="#999" />
                  <Text style={styles.newsDate}>{news.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Trend Chart Placeholder */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Price Trends - Last 30 Days</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>
                Price chart visualization
              </Text>
            </View>
          </View>
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
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 200,
    paddingHorizontal: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  summaryDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryStat: {
    flex: 1,
    alignItems: "center",
  },
  summaryStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  summaryStatLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 12,
    color: "#F57C00",
    fontWeight: "600",
  },
  alertText: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
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
    fontSize: 14,
    color: "#2E7D32",
  },
  commodityCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  commodityContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commodityInfo: {
    flex: 1,
  },
  commodityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  commodityUnit: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  priceInfo: {
    alignItems: "flex-end",
    marginRight: 12,
  },
  commodityPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  positiveChange: {
    backgroundColor: "#E8F5E9",
  },
  negativeChange: {
    backgroundColor: "#FFEBEE",
  },
  changeText: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 2,
  },
  positiveText: {
    color: "#4CAF50",
  },
  negativeText: {
    color: "#FF5252",
  },
  demandBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  demandText: {
    fontSize: 11,
    fontWeight: "600",
  },
  highDemand: {
    color: "#4CAF50",
  },
  mediumDemand: {
    color: "#FF9800",
  },
  lowDemand: {
    color: "#F44336",
  },
  newsSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  importantBadge: {
    backgroundColor: "#FF5252",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  importantText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  newsSummary: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  newsMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  newsDate: {
    fontSize: 11,
    color: "#999",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  chartPlaceholderText: {
    color: "#999",
  },
});
