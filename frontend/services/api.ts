import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance } from "axios";

// API Configuration - can be set via environment variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.100.81:8000/api";
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

class ApiService {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem("@access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshToken = await AsyncStorage.getItem("@refresh_token");
          if (refreshToken) {
            try {
              const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                refresh: refreshToken,
              });
              await AsyncStorage.setItem("@access_token", response.data.access);
              return this.client(error.config);
            } catch (refreshError) {
              // Refresh failed, user needs to login again
              await AsyncStorage.removeItem("@access_token");
              await AsyncStorage.removeItem("@refresh_token");
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== AUTH ENDPOINTS ====================
  async register(userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    latitude: number;
    longitude: number;
    location_address?: string;
    farm_size: number;
    primary_crops: string[];
    soil_type?: string;
  }) {
    try {
      const response = await this.client.post("/auth/register/", userData);
      if (response.data.access) {
        await AsyncStorage.setItem("@access_token", response.data.access);
        await AsyncStorage.setItem("@refresh_token", response.data.refresh);
        await AsyncStorage.setItem("@user_data", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async loginWithFirebaseToken(firebaseToken: string) {
    try {
      const response = await this.client.post("/auth/login/", {
        firebase_token: firebaseToken,
      });
      if (response.data.access) {
        await AsyncStorage.setItem("@access_token", response.data.access);
        await AsyncStorage.setItem("@refresh_token", response.data.refresh);
        await AsyncStorage.setItem("@user_data", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await this.client.get("/auth/profile/");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await AsyncStorage.removeItem("@access_token");
    await AsyncStorage.removeItem("@refresh_token");
    await AsyncStorage.removeItem("@user_data");
  }

  // ==================== USERS ENDPOINTS ====================
  async getProfileDetails() {
    try {
      const response = await this.client.get("/users/profile/");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData: any) {
    try {
      const response = await this.client.put("/users/profile/", {
        profile: profileData,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==================== COMMUNITY ENDPOINTS ====================
  async getPosts(page = 1) {
    try {
      const response = await this.client.get("/community/posts/", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createPost(formData: FormData) {
    try {
      const response = await this.client.post("/community/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async likePost(postId: number) {
    try {
      const response = await this.client.post(`/community/posts/${postId}/like/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPostComments(postId: number) {
    try {
      const response = await this.client.get(`/community/posts/${postId}/comments/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addComment(postId: number, content: string) {
    try {
      const response = await this.client.post(`/community/posts/${postId}/comments/`, {
        content,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==================== PAYMENTS ENDPOINTS ====================
  async createPaymentIntent(plan: "monthly" | "annual") {
    try {
      const response = await this.client.post("/payments/create-payment-intent/", {
        plan,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionStatus() {
    try {
      const response = await this.client.get("/payments/subscription-status/");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async cancelSubscription() {
    try {
      const response = await this.client.post("/payments/cancel-subscription/");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==================== AI SERVICE ENDPOINTS ====================
  async chatWithAssistant(message: string) {
    try {
      const response = await this.client.post("/ai/chat/", { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getChatHistory() {
    try {
      const response = await this.client.get("/ai/chat-history/");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async detectDisease(formData: FormData) {
    try {
      const response = await this.client.post("/ai/detect-disease/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDiseaseHistory() {
    try {
      const response = await this.client.get("/ai/disease-history/");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async predictYield(cropType: string, temperature: number, rainfall: number, soilNitrogen: number) {
    try {
      const response = await this.client.post("/ai/predict-yield/", {
        crop_type: cropType,
        temperature,
        rainfall,
        soil_nitrogen: soilNitrogen,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getYieldHistory() {
    try {
      const response = await this.client.get("/ai/yield-history/");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==================== FARM DATA ENDPOINTS ====================
  async getCommodityPrices(commodityName?: string) {
    try {
      const response = await this.client.get("/farm/commodity-prices/", {
        params: commodityName ? { commodity_name: commodityName } : {},
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getWeatherAdvisory() {
    try {
      const response = await this.client.get("/farm/weather-advisory/");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getNearbyMarkets(radius = 50) {
    try {
      const response = await this.client.get("/farm/nearby-markets/", {
        params: { radius },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCropRecommendations() {
    try {
      const response = await this.client.get("/farm/crop-recommendations/");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==================== FARM DATA MANAGEMENT ====================
  async getFarmData() {
    try {
      const response = await this.client.get("/users/farm-data/");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createFarmData(farmData: any) {
    try {
      const response = await this.client.post("/users/farm-data/", farmData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const apiService = new ApiService();
export { STRIPE_PUBLISHABLE_KEY };
      }
      throw new Error(response.data.message || "Login failed");
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.client.post(API_ENDPOINTS.AUTH.LOGOUT);
      await AsyncStorage.removeItem("@user_token");
      await AsyncStorage.removeItem("@user_data");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Dashboard Endpoints
  async getDashboardOverview() {
    try {
      const response = await this.client.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getWeather() {
    try {
      const response = await this.client.get(API_ENDPOINTS.DASHBOARD.WEATHER);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Crops Endpoints
  async getCrops() {
    try {
      const response = await this.client.get(API_ENDPOINTS.CROPS.LIST);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRecommendations() {
    try {
      const response = await this.client.get(
        API_ENDPOINTS.CROPS.RECOMMENDATIONS,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // User Profile
  async getProfile() {
    try {
      const response = await this.client.get(API_ENDPOINTS.USERS.PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(data: any) {
    try {
      const response = await this.client.put(API_ENDPOINTS.USERS.PROFILE, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiService();
