// src/app/profile/privacy.tsx (or src/screens/Profile/PrivacyScreen.tsx)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Eye, Database, MapPin, Lock, Trash2, Download } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [shareLocation, setShareLocation] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // Check location permission
    const { status } = await Location.getForegroundPermissionsAsync();
    setLocationPermission(status);
    setLocationEnabled(status === 'granted');
  };

  const handleBack = () => {
    router.back();
  };

  const manageLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status);
    if (status === 'granted') {
      setLocationEnabled(true);
      Alert.alert('Success', 'Location access enabled for farm recommendations');
    } else {
      setLocationEnabled(false);
      Alert.alert(
        'Permission Denied', 
        'Location access is required for farm-based features. Please enable in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
    }
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download Data',
      'Your data export is being prepared. You will receive an email with the download link shortly.',
      [{ text: 'OK' }]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache? This will remove temporary files.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // Implement cache clearing logic
            Alert.alert('Success', 'Cache cleared successfully');
          }
        }
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your app data including preferences, saved locations, and cached files. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Implement data deletion logic
            Alert.alert('Success', 'All data has been deleted');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Shield size={24} color="#2E7D32" />
          <Text style={styles.infoText}>
            Your privacy is important to us. We collect data to improve your farming experience.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MapPin size={22} color="#666" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Share Location</Text>
                <Text style={styles.settingDescription}>
                  Allow app to access your location for farm recommendations
                </Text>
              </View>
            </View>
            <Switch
              value={shareLocation}
              onValueChange={setShareLocation}
              trackColor={{ false: '#ddd', true: '#2E7D32' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Database size={22} color="#666" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Share Analytics</Text>
                <Text style={styles.settingDescription}>
                  Help improve the app by sharing usage data
                </Text>
              </View>
            </View>
            <Switch
              value={shareAnalytics}
              onValueChange={setShareAnalytics}
              trackColor={{ false: '#ddd', true: '#2E7D32' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Eye size={22} color="#666" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Personalized Ads</Text>
                <Text style={styles.settingDescription}>
                  Receive personalized advertisements based on your activity
                </Text>
              </View>
            </View>
            <Switch
              value={personalizedAds}
              onValueChange={setPersonalizedAds}
              trackColor={{ false: '#ddd', true: '#2E7D32' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          
          <TouchableOpacity style={styles.permissionItem} onPress={manageLocationPermission}>
            <View style={styles.permissionLeft}>
              <MapPin size={22} color="#666" />
              <View>
                <Text style={styles.settingTitle}>Location Access</Text>
                <Text style={[styles.permissionStatus, locationEnabled && styles.statusEnabled]}>
                  {locationEnabled ? '✓ Enabled' : '✗ Disabled'}
                </Text>
              </View>
            </View>
            <Text style={styles.manageText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.dataItem} onPress={handleDownloadData}>
            <View style={styles.dataItemLeft}>
              <Download size={20} color="#2E7D32" />
              <View>
                <Text style={styles.dataTitle}>Download My Data</Text>
                <Text style={styles.dataDescription}>
                  Get a copy of all your data in JSON format
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dataItem} onPress={handleClearCache}>
            <View style={styles.dataItemLeft}>
              <Trash2 size={20} color="#F57C00" />
              <View>
                <Text style={styles.dataTitle}>Clear Cache</Text>
                <Text style={styles.dataDescription}>
                  Remove temporary files and free up space
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dataItem} onPress={handleDeleteAllData}>
            <View style={styles.dataItemLeft}>
              <Trash2 size={20} color="#F44336" />
              <View>
                <Text style={[styles.dataTitle, styles.deleteTitle]}>Delete All Data</Text>
                <Text style={styles.dataDescription}>
                  Permanently delete all your app data
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <TouchableOpacity style={styles.securityItem}>
            <View style={styles.securityItemLeft}>
              <Lock size={20} color="#666" />
              <View>
                <Text style={styles.securityTitle}>Change Password</Text>
                <Text style={styles.securityDescription}>
                  Update your account password
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.securityItem}>
            <View style={styles.securityItemLeft}>
              <Shield size={20} color="#666" />
              <View>
                <Text style={styles.securityTitle}>Two-Factor Authentication</Text>
                <Text style={styles.securityDescription}>
                  Add an extra layer of security
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalTitle}>Privacy Policy</Text>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalTitle}>Terms of Service</Text>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalTitle}>Cookie Policy</Text>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last updated: December 2024
          </Text>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  permissionLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  permissionStatus: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
  statusEnabled: {
    color: '#4CAF50',
  },
  manageText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataItemLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  dataTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  deleteTitle: {
    color: '#F44336',
  },
  dataDescription: {
    fontSize: 12,
    color: '#999',
  },
  chevron: {
    fontSize: 18,
    color: '#ccc',
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  securityItemLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 12,
    color: '#999',
  },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  legalTitle: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});