import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthContextType {
  hasCompletedOnboarding: boolean;
  isLoggedIn: boolean;
  completeOnboarding: () => void;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ONBOARDING_KEY = "@onboarding_completed";
const LOGIN_KEY = "@user_logged_in";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const [onboardingCompleted, userLoggedIn] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_KEY),
        AsyncStorage.getItem(LOGIN_KEY),
      ]);

      setHasCompletedOnboarding(onboardingCompleted === "true");
      setIsLoggedIn(userLoggedIn === "true");
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error("Error saving onboarding state:", error);
    }
  };

  const login = async () => {
    try {
      await AsyncStorage.setItem(LOGIN_KEY, "true");
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error saving login state:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([LOGIN_KEY]);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value = {
    hasCompletedOnboarding,
    isLoggedIn,
    completeOnboarding,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
