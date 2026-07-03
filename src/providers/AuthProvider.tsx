"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { authService } from "@/services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthActionInProgress = useRef(false);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data);
      return response.data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (isAuthActionInProgress.current) {
        setLoading(false);
        return;
      }
      if (fbUser) {
        await fetchProfile();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const register = async ({ name, email, password, phone }) => {
    isAuthActionInProgress.current = true;
    try {
      const auth = getFirebaseAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      const response = await authService.register({ name, phone });
      setUser(response.data);
      return response.data;
    } finally {
      isAuthActionInProgress.current = false;
    }
  };

  const login = async ({ email, password }) => {
    isAuthActionInProgress.current = true;
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchProfile();
      if (!profile) {
        throw new Error("Account not registered. Please sign up first.");
      }
      return profile;
    } finally {
      isAuthActionInProgress.current = false;
    }
  };

  const loginWithGoogle = async () => {
    isAuthActionInProgress.current = true;
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      try {
        const profile = await fetchProfile();
        if (profile) return profile;
      } catch {
        // User not in MongoDB yet
      }

      const response = await authService.register({
        name: result.user.displayName || "User",
      });
      setUser(response.data);
      return response.data;
    } finally {
      isAuthActionInProgress.current = false;
    }
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    setUser(null);
  };

  const resetPassword = async (email) => {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    firebaseUser,
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    refreshProfile: fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
