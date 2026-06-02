import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../services/firebase";

interface AuthContextType {
  hasCompletedOnboarding: boolean;
  isLoggedIn: boolean;
  user: User | null;
  completeOnboarding: () => void;
  login: () => void; // Kept for legacy compatibility if needed
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ONBOARDING_KEY = "@onboarding_completed";
const LOGIN_KEY = "@user_logged_in"; // Legacy

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check onboarding state from device storage
    checkOnboardingState();

    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      setUser(firebaseUser);
      setIsLoggedIn(!!firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkOnboardingState = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(onboardingCompleted === "true");
    } catch (error) {
      console.error("Error checking onboarding state:", error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    } catch (error) {
      console.error("Error saving onboarding state:", error);
    } finally {
      setHasCompletedOnboarding(true);
    }
  };

  const login = async () => {
    try {
      await AsyncStorage.setItem(LOGIN_KEY, "true");
    } catch (error) {
      console.error("Error saving login state:", error);
    } finally {
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.multiRemove([LOGIN_KEY]);
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const value = {
    hasCompletedOnboarding,
    isLoggedIn,
    user,
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
