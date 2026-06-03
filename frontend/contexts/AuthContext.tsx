import apiService from "@/services/api";
import type { AppUser, UserRole } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../services/firebase";
import { sessionManager } from "../services/sessionManager";

interface AuthContextType {
  hasCompletedOnboarding: boolean;
  isLoggedIn: boolean;
  user: User | null;
  appUser: AppUser | null;
  role: UserRole | null;
  completeOnboarding: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isFarmer: boolean;
  isOfficer: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

export interface RegisterParams {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  regionId?: string;
  farmDetails?: Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ONBOARDING_KEY = "@onboarding_completed";

async function loadAppUser(firebaseUser: User): Promise<AppUser> {
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? "",
      displayName: data.displayName ?? firebaseUser.displayName ?? "",
      role: (data.role as UserRole) ?? "farmer",
      regionId: data.regionId,
      phone: data.phone,
      permissions: data.permissions,
    };
  }
  const fallback: AppUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    displayName: firebaseUser.displayName ?? "Farmer",
    role: "farmer",
  };
  await setDoc(
    ref,
    { ...fallback, createdAt: new Date().toISOString() },
    { merge: true },
  );
  return fallback;
}

const ACCESS_TOKEN_KEY = "@access_token";
const REFRESH_TOKEN_KEY = "@refresh_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const storeTokens = async (accessToken: string, refreshToken?: string) => {
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (error) {
      console.error("Error storing auth tokens:", error);
    }
  };

  const clearTokens = async () => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error clearing auth tokens:", error);
    }
  };

  const syncBackendAuth = useCallback(async (firebaseUser: User) => {
    try {
      const firebaseToken = await firebaseUser.getIdToken(true);
      const authResponse =
        await apiService.loginWithFirebaseToken(firebaseToken);
      if (authResponse.access) {
        await storeTokens(authResponse.access, authResponse.refresh);
      }
    } catch (error) {
      console.error("Backend auth sync failed:", error);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const profile = await loadAppUser(user);
    setAppUser(profile);
  }, [user]);

  useEffect(() => {
    checkOnboardingState();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoggedIn(!!firebaseUser);
      if (firebaseUser) {
        try {
          const profile = await loadAppUser(firebaseUser);
          setAppUser(profile);
          await syncBackendAuth(firebaseUser);
          sessionManager.start();
        } catch (error) {
          console.error(
            "Error loading app user or syncing backend auth:",
            error,
          );
          setAppUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? "",
            displayName: firebaseUser.displayName ?? "",
            role: "farmer",
          });
        }
      } else {
        setAppUser(null);
        await clearTokens();
        sessionManager.stop();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncBackendAuth]);

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

  const login = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await syncBackendAuth(credential.user);
    sessionManager.resetActivity();
  };

  const register = async (params: RegisterParams) => {
    const cred = await createUserWithEmailAndPassword(
      auth,
      params.email,
      params.password,
    );

    await setDoc(doc(db, "users", cred.user.uid), {
      displayName: params.displayName,
      email: params.email,
      phone: params.phone ?? "",
      role: params.role,
      regionId: params.regionId ?? null,
      farmDetails: params.farmDetails ?? null,
      createdAt: new Date().toISOString(),
    });

    const [firstName, ...rest] = params.displayName.trim().split(" ");
    const lastName = rest.join(" ");

    await apiService.registerUser({
      email: params.email,
      password: params.password,
      first_name: firstName,
      last_name: lastName,
      phone_number: params.phone ?? "",
      latitude: 0,
      longitude: 0,
      location_address: "",
      farm_size: 0,
      primary_crops: [],
      soil_type: "loam",
    });

    sessionManager.resetActivity();
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await clearTokens();
      sessionManager.stop();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      setAppUser(null);
    }
  };

  const role = appUser?.role ?? null;

  const value: AuthContextType = {
    hasCompletedOnboarding,
    isLoggedIn,
    user,
    appUser,
    role,
    completeOnboarding,
    login,
    register,
    logout,
    loading,
    isFarmer: role === "farmer",
    isOfficer: role === "extension_officer",
    isAdmin: role === "admin",
    refreshProfile,
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
