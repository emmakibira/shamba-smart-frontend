import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance } from "axios";
import { auth } from "./firebase";

// API Configuration
export const API_BASE_URL = "https://shamba-smart-backend.onrender.com/api";

console.log("API URL:", API_BASE_URL);

class ApiService {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ==================== JWT AUTH INTERCEPTOR ====================
    this.client.interceptors.request.use(
      async (config) => {
        config.headers = config.headers ?? {};

        const accessToken = await AsyncStorage.getItem("access_token");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  // ==================== AUTH ====================
  async loginWithFirebaseToken(firebaseToken: string) {
    try {
      const response = await this.client.post("/auth/login/", {
        firebase_token: firebaseToken,
      });

      const data = response.data;
      if (data.access) {
        await AsyncStorage.setItem("access_token", data.access);
      }
      if (data.refresh) {
        await AsyncStorage.setItem("refresh_token", data.refresh);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async clearAuthTokens() {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
  }

  async registerUser(registrationData: {
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
    soil_type: string;
  }) {
    try {
      const response = await this.client.post(
        "/auth/register/",
        registrationData,
      );
      const data = response.data;
      if (data.access) {
        await AsyncStorage.setItem("access_token", data.access);
      }
      if (data.refresh) {
        await AsyncStorage.setItem("refresh_token", data.refresh);
      }
      return data;
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
    // Firebase logout should be handled in auth layer
    await auth.signOut();
  }

  // ==================== USERS ====================
  async getProfileDetails() {
    const response = await this.client.get("/users/profile/");
    return response.data;
  }

  async getDashboardOverview() {
    const response = await this.client.get("/dashboard/overview/");
    return response.data;
  }

  async updateProfile(profileData: any) {
    const response = await this.client.put("/users/profile/", {
      profile: profileData,
    });
    return response.data;
  }

  // ==================== COMMUNITY ====================
  async getPosts(page = 1) {
    const response = await this.client.get("/community/posts/", {
      params: { page },
    });
    return response.data;
  }

  async createPost(formData: FormData) {
    const response = await this.client.post("/community/posts/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async likePost(postId: number) {
    const response = await this.client.post(`/community/posts/${postId}/like/`);
    return response.data;
  }

  async getPostComments(postId: number) {
    const response = await this.client.get(
      `/community/posts/${postId}/comments/`,
    );
    return response.data;
  }

  async addComment(postId: number, content: string) {
    const response = await this.client.post(
      `/community/posts/${postId}/comments/`,
      { content },
    );
    return response.data;
  }

  // ==================== PAYMENTS ====================
  async createPaymentIntent(plan: "monthly" | "annual") {
    const response = await this.client.post(
      "/payments/create-payment-intent/",
      { plan },
    );
    return response.data;
  }

  async getSubscriptionStatus() {
    const response = await this.client.get("/payments/subscription-status/");
    return response.data;
  }

  async cancelSubscription() {
    const response = await this.client.post("/payments/cancel-subscription/");
    return response.data;
  }

  // ==================== AI ====================
  async chatWithAssistant(message: string) {
    const response = await this.client.post("/ai/chat/", { message });
    return response.data;
  }

  async getChatHistory() {
    const response = await this.client.get("/ai/chat-history/");
    return response.data;
  }

  async detectDisease(formData: FormData) {
    const response = await this.client.post("/ai/detect-disease/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async getDiseaseHistory() {
    const response = await this.client.get("/ai/disease-history/");
    return response.data;
  }

  async predictYield(
    cropType: string,
    temperature: number,
    rainfall: number,
    soilNitrogen: number,
  ) {
    const response = await this.client.post("/ai/predict-yield/", {
      crop_type: cropType,
      temperature,
      rainfall,
      soil_nitrogen: soilNitrogen,
    });
    return response.data;
  }

  async getYieldHistory() {
    const response = await this.client.get("/ai/yield-history/");
    return response.data;
  }

  // ==================== FARM ====================
  async getLatestMarketReport() {
    const response = await this.client.get("/farm/market-report/");
    return response.data;
  }

  async getCommodityPrices(commodityName?: string) {
    const response = await this.client.get("/farm/commodity-prices/", {
      params: commodityName ? { commodity_name: commodityName } : {},
    });
    return response.data;
  }

  async getWeatherAdvisory() {
    const response = await this.client.get("/farm/weather-advisory/");
    return response.data;
  }

  async getNearbyMarkets(radius = 50) {
    const response = await this.client.get("/farm/nearby-markets/", {
      params: { radius },
    });
    return response.data;
  }

  async getCropRecommendations() {
    const response = await this.client.get("/farm/crop-recommendations/");
    return response.data;
  }

  async getFarmData() {
    const response = await this.client.get("/users/farm-data/");
    return response.data;
  }

  async createFarmData(farmData: any) {
    const response = await this.client.post("/users/farm-data/", farmData);
    return response.data;
  }
}

export default new ApiService();
