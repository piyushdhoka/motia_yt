"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

// Helper functions for authentication
export const signInWithGoogle = async () => {
  try {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut();
    window.location.href = "/";
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Session persistence utilities
export const persistSession = (session: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_session", JSON.stringify(session));
  }
};

export const getPersistedSession = () => {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("auth_session");
    return session ? JSON.parse(session) : null;
  }
  return null;
};

export const clearPersistedSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_session");
  }
};