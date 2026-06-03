import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { AppUser, UserRole } from "@/types";
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
  await setDoc(ref, { ...fallback, createdAt: new Date().toISOString() }, { merge: true });
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

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
          sessionManager.start();
        } catch {
          setAppUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? "",
            displayName: firebaseUser.displayName ?? "",
            role: "farmer",
          });
        }
      } else {
        setAppUser(null);
        sessionManager.stop();
      }
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

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
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
    sessionManager.resetActivity();
  };

  const logout = async () => {
    try {
      await signOut(auth);
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
