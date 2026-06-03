// src/screens/ProfileScreen.tsx
import { db } from "@/services/firebase";

import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Award,
  Bell,
  Bluetooth as BluetoothIcon,
  Calendar,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Leaf,
  LogOut,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Settings,
  Shield,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { useSubscription } from "../../contexts/SubscriptionContext";
import { useAppTheme } from "../../contexts/ThemeContext";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  badge?: string;
  badgeColor?: string;
  onPress: () => void;
}

interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  region: string;
  country: string;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout, user, appUser } = useAuth();
  const [userProfile, setUserProfile] = useState<Record<string, any>>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null,
  );
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionStatus | null>(null);

  const { isPremium, upgradeToPremium, communityPostsThisMonth } =
    useSubscription();
  const { isDarkMode, toggleDarkMode } = useAppTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Check location permission on mount
  useEffect(() => {
    checkLocationPermission();
    checkBluetoothStatus();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setLocationPermission(status);
    setLocationEnabled(status === "granted");

    if (status === "granted") {
      getCurrentLocation();
    }
  };

  const checkBluetoothStatus = async () => {
    try {
      const isEnabled = await Bluetooth.isEnabledAsync();
      setBluetoothEnabled(isEnabled);
    } catch (error) {
      console.log("Bluetooth not available:", error);
      setBluetoothEnabled(false);
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Please enable location access to get your current location.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${address.street || ""} ${address.name || ""}`.trim(),
          city: address.city || address.district || "",
          region: address.region || "",
          country: address.country || "",
        };
        setCurrentLocation(locationData);

        // Save location to user profile
        if (user?.uid) {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            location: locationData,
            lastLocationUpdate: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get current location. Please try again.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const requestLocationPermission = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);

      if (status === "granted") {
        setLocationEnabled(true);
        await getCurrentLocation();
        Alert.alert("Success", "Location access enabled!");
      } else {
        setLocationEnabled(false);
        Alert.alert(
          "Permission Denied",
          "Location access is required for farm-based recommendations. You can enable it in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      Alert.alert("Error", "Failed to request location permission");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const requestBluetoothPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const { status } = await Bluetooth.requestPermissionsAsync();
        if (status === "granted") {
          const isEnabled = await Bluetooth.enableAsync();
          setBluetoothEnabled(isEnabled);
          Alert.alert(
            "Success",
            "Bluetooth enabled for IoT sensor connectivity!",
          );
        } else {
          Alert.alert(
            "Permission Denied",
            "Bluetooth is required for connecting to IoT sensors.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ],
          );
        }
      } else {
        // iOS handling
        Alert.alert(
          "Info",
          "Please enable Bluetooth from device settings for IoT sensor connectivity.",
        );
      }
    } catch (error) {
      console.error("Error enabling Bluetooth:", error);
      Alert.alert(
        "Error",
        "Failed to enable Bluetooth. Please enable manually in settings.",
      );
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // TODO: Implement account deletion logic
              // This should delete user data from Firestore and Authentication
              Alert.alert(
                "Account Deletion",
                "This feature will be available soon. Please contact support for account deletion.",
              );
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Error", "Failed to delete account. Please try again later.");
            }
          },
        },
      ]
    );
  };

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserProfile(userData);
          if (userData.location) {
            setCurrentLocation(userData.location);
            setLocationEnabled(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [user]);

  React.useEffect(() => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Needed",
        "Please grant camera roll permissions to change profile picture",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      // TODO: Upload to Firebase Storage and update user profile
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const stats: StatItem[] = [
    {
      id: "points",
      value: "1,234",
      label: "Points Earned",
      icon: Award,
      color: "#2E7D32",
    },
    {
      id: "profit",
      value: "TSh 245K",
      label: "Total Profit",
      icon: TrendingUp,
      color: "#2E7D32",
    },
    {
      id: "followers",
      value: "567",
      label: "Followers",
      icon: Users,
      color: "#2E7D32",
    },
    {
      id: "member",
      value: "2 Years",
      label: "Member Since",
      icon: Calendar,
      color: "#2E7D32",
    },
  ];

  const menuSections = [
    {
      title: "Account",
      items: [
        {
          id: "account",
          title: "Account Settings",
          icon: User,
          onPress: () => router.push("/profile/account-settings" as any),
        },
        {
          id: "security",
          title: "Security",
          icon: Shield,
          onPress: () => router.push("/profile/security" as any),
        },
        {
          id: "privacy",
          title: "Privacy & Data",
          icon: Shield,
          onPress: () => router.push("/profile/privacy" as any),
        },
      ] as MenuItem[],
    },
    {
      title: "Location & Sensors",
      items: [
        {
          id: "location",
          title: "Farm Location",
          icon: MapPin,
          badge: locationEnabled ? "Enabled" : "Disabled",
          badgeColor: locationEnabled ? "#4CAF50" : "#F44336",
          onPress: () => setShowLocationModal(true),
        },
        {
          id: "gps",
          title: "GPS Services",
          icon: Navigation,
          badge: locationEnabled ? "Active" : "Inactive",
          badgeColor: locationEnabled ? "#4CAF50" : "#F44336",
          onPress: () => requestLocationPermission(),
        },
        {
          id: "bluetooth",
          title: "Bluetooth (IoT Sensors)",
          icon: BluetoothIcon,
          badge: bluetoothEnabled ? "Enabled" : "Disabled",
          badgeColor: bluetoothEnabled ? "#4CAF50" : "#F44336",
          onPress: () => requestBluetoothPermission(),
        },
      ] as MenuItem[],
    },
    {
      title: "Preferences",
      items: [
        {
          id: "notifications",
          title: "Notifications",
          icon: Bell,
          onPress: () => router.push("/profile/notifications" as any),
        },
        {
          id: "language",
          title: "Language",
          icon: MessageCircle,
          badge: "English",
          onPress: () => router.push("/profile/language" as any),
        },
        {
          id: "subscription",
          title: "Subscription",
          icon: CreditCard,
          badge: isPremium ? "Premium" : "Free",
          badgeColor: isPremium ? "#FFD54F" : "#E0E0E0",
          onPress: () => !isPremium && upgradeToPremium(),
        },
      ] as MenuItem[],
    },
    {
      title: "Support",
      items: [
        {
          id: "help",
          title: "Help Center",
          icon: HelpCircle,
          onPress: () => router.push("/profile/help" as any),
        },
        {
          id: "contact",
          title: "Contact Support",
          icon: Phone,
          onPress: () => router.push("/profile/contact" as any),
        },
        {
          id: "feedback",
          title: "Send Feedback",
          icon: MessageCircle,
          onPress: () => router.push("/profile/feedback" as any),
        },
        {
          id: "about",
          title: "About",
          icon: Leaf,
          onPress: () => router.push("/profile/about" as any),
        },
      ] as MenuItem[],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <LinearGradient
            colors={["#0F3D1E", "#2E7D32"]}
            style={[styles.header, { paddingTop: insets.top + 20 }]}
          >
            <View style={styles.profileInfo}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <LinearGradient
                  colors={["#FFB74D", "#FFA726"]}
                  style={styles.avatarContainer}
                >
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.avatar}
                    />
                  ) : (
                    <User size={48} color="#fff" />
                  )}
                  <View style={styles.editBadge}>
                    <Text style={styles.editBadgeText}>✎</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.userName}>
                {userProfile.displayName || appUser?.displayName || "Farmer"}
              </Text>
              <Text style={styles.userEmail}>
                @
                {userProfile.username ||
                  appUser?.email?.split("@")[0] ||
                  "farmer"}
              </Text>
              {currentLocation && (
                <TouchableOpacity
                  style={styles.locationBadge}
                  onPress={() => setShowLocationModal(true)}
                >
                  <Text style={styles.locationText}>
                    📍{" "}
                    {currentLocation.address ||
                      `${currentLocation.city}, ${currentLocation.region}`}
                  </Text>
                </TouchableOpacity>
              )}
              {isPremium && (
                <View style={styles.premiumBadgeHeader}>
                  <Star size={14} color="#FFD700" />
                  <Text style={styles.premiumBadgeHeaderText}>
                    Premium Member
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            {stats.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <stat.icon size={24} color={stat.color} />
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Community Stats Card */}
          <View style={styles.communityStatsCard}>
            <Text style={styles.communityStatsTitle}>Community Activity</Text>
            <View style={styles.postLimitBar}>
              <View style={styles.postLimitHeader}>
                <Text style={styles.postLimitLabel}>Monthly Posts</Text>
                <Text style={styles.postLimitValue}>
                  {communityPostsThisMonth} / {isPremium ? "∞" : "5"}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min((communityPostsThisMonth / 5) * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Subscription Banner */}
          {!isPremium && (
            <LinearGradient
              colors={["#FFD54F", "#FFC107"]}
              style={styles.premiumBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.premiumContent}>
                <Leaf size={32} color="#fff" />
                <View style={styles.premiumTextContainer}>
                  <Text style={styles.premiumTitle}>Go Premium</Text>
                  <Text style={styles.premiumDescription}>
                    Unlock unlimited posts and expert features
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={upgradeToPremium}
                >
                  <Text style={styles.upgradeButtonText}>Upgrade</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          )}

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>{section.title}</Text>
              {section.items.map((item) => (
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
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: item.badgeColor || "#f5f5f5" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            item.badgeColor === "#FFD54F" &&
                              styles.premiumBadgeText,
                          ]}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    )}
                    <ChevronRight size={18} color="#ccc" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Toggle Items */}
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>App Settings</Text>

            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Bell size={22} color="#666" />
                <Text style={styles.menuTitle}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#ddd", true: "#2E7D32" }}
              />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Settings size={22} color="#666" />
                <Text style={styles.menuTitle}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: "#ddd", true: "#2E7D32" }}
              />
            </View>

            <TouchableOpacity
              style={[styles.menuItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <View style={styles.menuLeft}>
                <LogOut size={22} color="#FF5252" />
                <Text style={[styles.menuTitle, styles.logoutText]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.deleteItem]}
              onPress={handleDeleteAccount}
            >
              <View style={styles.menuLeft}>
                <Shield size={22} color="#FF5252" />
                <Text style={[styles.menuTitle, styles.deleteText]}>
                  Delete Account
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </Animated.View>
      </ScrollView>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Farm Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {isLoadingLocation ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={styles.loadingText}>Getting your location...</Text>
              </View>
            ) : currentLocation ? (
              <View style={styles.locationInfo}>
                <View style={styles.locationDetail}>
                  <MapPin size={20} color="#2E7D32" />
                  <Text style={styles.locationDetailText}>
                    Latitude: {currentLocation.latitude.toFixed(6)}
                  </Text>
                </View>
                <View style={styles.locationDetail}>
                  <MapPin size={20} color="#2E7D32" />
                  <Text style={styles.locationDetailText}>
                    Longitude: {currentLocation.longitude.toFixed(6)}
                  </Text>
                </View>
                <View style={styles.locationDetail}>
                  <Navigation size={20} color="#2E7D32" />
                  <Text style={styles.locationDetailText}>
                    Address: {currentLocation.address || "N/A"}
                  </Text>
                </View>
                <View style={styles.locationDetail}>
                  <MapPin size={20} color="#2E7D32" />
                  <Text style={styles.locationDetailText}>
                    City: {currentLocation.city}
                  </Text>
                </View>
                <View style={styles.locationDetail}>
                  <MapPin size={20} color="#2E7D32" />
                  <Text style={styles.locationDetailText}>
                    Region: {currentLocation.region}
                  </Text>
                </View>
                <View style={styles.locationDetail}>
                  <MapPin size={20} color="#2E7D32" />
                  <Text style={styles.locationDetailText}>
                    Country: {currentLocation.country}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.noLocationContainer}>
                <Text style={styles.noLocationText}>
                  No location data available
                </Text>
                <Text style={styles.noLocationSubtext}>
                  Enable location services to get farm-based recommendations
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.updateLocationButton]}
                onPress={getCurrentLocation}
              >
                <Text style={styles.updateLocationText}>Update Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.enableLocationButton]}
                onPress={requestLocationPermission}
              >
                <Text style={styles.enableLocationText}>
                  {locationEnabled ? "Manage Permissions" : "Enable Location"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2E7D32",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  editBadgeText: {
    color: "#fff",
    fontSize: 14,
  },
  locationBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#fff",
  },
  premiumBadgeHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,215,0,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  premiumBadgeHeaderText: {
    fontSize: 12,
    color: "#FFD700",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginTop: -20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  communityStatsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  communityStatsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  postLimitBar: {
    gap: 8,
  },
  postLimitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postLimitLabel: {
    fontSize: 14,
    color: "#666",
  },
  postLimitValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2E7D32",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 4,
  },
  premiumBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  premiumContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  premiumDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F57C00",
  },
  menuSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 8,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: "#333",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#666",
  },
  premiumBadgeText: {
    color: "#333",
    fontWeight: "600",
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 8,
  },
  logoutText: {
    color: "#FF5252",
  },
  deleteItem: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  deleteText: {
    color: "#FF5252",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 20,
    marginBottom: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalClose: {
    fontSize: 24,
    color: "#999",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  locationInfo: {
    gap: 12,
    marginBottom: 20,
  },
  locationDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationDetailText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  noLocationContainer: {
    alignItems: "center",
    padding: 40,
  },
  noLocationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  noLocationSubtext: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  updateLocationButton: {
    backgroundColor: "#E8F5E9",
  },
  updateLocationText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  enableLocationButton: {
    backgroundColor: "#2E7D32",
  },
  enableLocationText: {
    color: "#fff",
    fontWeight: "600",
  },
});