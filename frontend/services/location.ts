import * as Location from "expo-location";

export class LocationService {
  /**
   * Request location permissions
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting location permissions:", error);
      return false;
    }
  }

  /**
   * Get current location
   */
  static async getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Try to get address from coordinates
      let address = "";
      try {
        const addressResult = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (addressResult.length > 0) {
          const addr = addressResult[0];
          address =
            `${addr.name || ""}, ${addr.district || ""}, ${addr.region || ""}, ${
              addr.country || ""
            }`
              .replace(/,\s*,/g, ",")
              .trim();
        }
      } catch (error) {
        console.warn("Could not reverse geocode location:", error);
      }

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address || undefined,
      };
    } catch (error) {
      console.error("Error getting current location:", error);
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Watch location changes (for real-time updates)
   */
  static watchLocation(
    callback: (location: Location.LocationObject) => void,
    errorCallback?: (error: Error) => void,
  ): Location.LocationSubscription | null {
    try {
      return Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 100, // Update when moved 100m
        },
        callback,
      ).then((subscription) => subscription);
    } catch (error) {
      if (errorCallback) {
        errorCallback(error as Error);
      }
      return null;
    }
  }
}
