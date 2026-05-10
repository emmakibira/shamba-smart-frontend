// src/screens/AdvisoryScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, Calendar, Clock, ChevronRight, TrendingUp, Droplets, Thermometer } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AdvisoryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: any;
  isNew?: boolean;
}

export default function AdvisoryScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const scrollY = useRef(new Animated.Value(0)).current;

  const categories = ['All', 'Crops', 'Pests', 'Weather', 'Soil', 'Market'];

  const advisoryData: AdvisoryItem[] = [
    {
      id: '1',
      title: 'Early Blight in Tomatoes: Prevention Tips',
      category: 'Pests',
      date: '2 days ago',
      readTime: '5 min read',
      image: require('../assets/advisory1.png'),
      isNew: true,
    },
    {
      id: '2',
      title: 'Optimal Irrigation Schedule for Summer Crops',
      category: 'Crops',
      date: '5 days ago',
      readTime: '8 min read',
      image: require('../assets/advisory2.png'),
    },
    {
      id: '3',
      title: 'Weather Alert: Heavy Rainfall Expected',
      category: 'Weather',
      date: '1 day ago',
      readTime: '3 min read',
      image: require('../assets/advisory3.png'),
      isNew: true,
    },
    {
      id: '4',
      title: 'Soil Health Management: Organic Methods',
      category: 'Soil',
      date: '1 week ago',
      readTime: '10 min read',
      image: require('../assets/advisory4.png'),
    },
    {
      id: '5',
      title: 'Market Trends: Crop Prices This Season',
      category: 'Market',
      date: '3 days ago',
      readTime: '6 min read',
      image: require('../assets/advisory5.png'),
    },
  ];

  const filteredAdvisories = advisoryData.filter(
    item => selectedCategory === 'All' || item.category === selectedCategory
  ).filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: 'clamp',
  });

  const handleAdvisoryPress = (advisory: AdvisoryItem) => {
    // Navigate to advisory detail
    console.log('Open advisory:', advisory.title);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight, paddingTop: insets.top + 10 }]}>
        <LinearGradient colors={['#0F3D1E', '#2E7D32']} style={styles.headerGradient}>
          <Text style={styles.headerTitle}>Expert Advisory</Text>
          <Text style={styles.headerSubtitle}>AI-powered farming insights</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
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
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* AI Recommendation Card */}
          <LinearGradient
            colors={['#1B5E20', '#43A047']}
            style={styles.aiCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.aiCardContent}>
              <View>
                <Text style={styles.aiLabel}>AI RECOMMENDATION</Text>
                <Text style={styles.aiTitle}>Based on your region's weather patterns</Text>
                <Text style={styles.aiDescription}>
                  Consider planting drought-resistant seeds this season
                </Text>
                <TouchableOpacity style={styles.aiButton}>
                  <Text style={styles.aiButtonText}>View Details</Text>
                  <ChevronRight size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <Image
                source={require('../../assets/ai-assistant.png')}
                style={styles.aiImage}
              />
            </View>
          </LinearGradient>

          {/* Advisory List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Insights</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {filteredAdvisories.map((advisory, index) => (
            <Animated.View
              key={advisory.id}
              style={[
                styles.advisoryCard,
                {
                  transform: [{ scale: 1 }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.advisoryContent}
                onPress={() => handleAdvisoryPress(advisory)}
                activeOpacity={0.7}
              >
                <Image source={advisory.image} style={styles.advisoryImage} />
                <View style={styles.advisoryInfo}>
                  <View style={styles.advisoryHeader}>
                    <Text style={styles.advisoryCategory}>{advisory.category}</Text>
                    {advisory.isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newText}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.advisoryTitle}>{advisory.title}</Text>
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
          ))}

          {/* Weather Forecast Card */}
          <View style={styles.weatherForecastCard}>
            <Text style={styles.forecastTitle}>7-Day Weather Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <View key={day} style={styles.forecastDay}>
                  <Text style={styles.forecastDayName}>{day}</Text>
                  <Thermometer size={24} color="#F57C00" />
                  <Text style={styles.forecastTemp}>{25 + index}°C</Text>
                  <Text style={styles.forecastCondition}>Cloudy</Text>
                </View>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
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
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: '#2E7D32',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  aiCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  aiCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    width: 200,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  aiButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginRight: 4,
  },
  aiImage: {
    width: 80,
    height: 80,
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
  advisoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  advisoryContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  advisoryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  advisoryInfo: {
    flex: 1,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  advisoryCategory: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  newBadge: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  advisoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  advisoryMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  weatherForecastCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  forecastScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  forecastDay: {
    alignItems: 'center',
    marginRight: 20,
  },
  forecastDayName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  forecastCondition: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});