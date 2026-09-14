"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { UserProfile } from "@/types/user";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  const supabase = createClient();

  // Fetch or construct profile
  const fetchProfile = useCallback(async (userId: string, userEmail?: string, userName?: string) => {
    if (isConfigured) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          email: userEmail || "",
          fullName: data.display_name,
          avatarUrl: data.avatar_url || undefined,
          createdAt: data.created_at,
        });
        return;
      }
    }

    // Default or mock profile
    setProfile({
      id: userId,
      email: userEmail || "creator@surprisespark.app",
      fullName: userName || "Surprise Creator",
      avatarUrl: undefined,
      createdAt: new Date().toISOString(),
    });
  }, [isConfigured, supabase]);

  // Initial session load
  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      setIsLoading(true);
      try {
        if (isConfigured) {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (mounted) {
            if (session?.user) {
              setUser(session.user);
              await fetchProfile(session.user.id, session.user.email, session.user.user_metadata?.full_name);
            } else {
              // Fallback to local demo session if present
              const savedDemo = localStorage.getItem("demo_user_session");
              if (savedDemo) {
                try {
                  const demoData = JSON.parse(savedDemo);
                  const mockUser = {
                    id: demoData.id || "demo-user-1",
                    email: demoData.email || "creator@surprisespark.app",
                    user_metadata: { full_name: demoData.fullName || "Alex Parker" },
                    app_metadata: {},
                    aud: "authenticated",
                    created_at: new Date().toISOString(),
                  } as User;

                  setUser(mockUser);
                  setProfile({
                    id: mockUser.id,
                    email: mockUser.email || "",
                    fullName: demoData.fullName || "Alex Parker",
                    avatarUrl: undefined,
                    createdAt: new Date().toISOString(),
                  });
                } catch {
                  setUser(null);
                  setProfile(null);
                }
              } else {
                setUser(null);
                setProfile(null);
              }
            }
          }
        } else {
          // Local demo session check via localStorage/cookie
          const savedDemo = localStorage.getItem("demo_user_session");
          if (savedDemo && mounted) {
            try {
              const demoData = JSON.parse(savedDemo);
              const mockUser = {
                id: demoData.id || "demo-user-1",
                email: demoData.email || "creator@surprisespark.app",
                user_metadata: { full_name: demoData.fullName || "Alex Parker" },
                app_metadata: {},
                aud: "authenticated",
                created_at: new Date().toISOString(),
              } as User;

              setUser(mockUser);
              setProfile({
                id: mockUser.id,
                email: mockUser.email || "",
                fullName: demoData.fullName || "Alex Parker",
                avatarUrl: undefined,
                createdAt: new Date().toISOString(),
              });
            } catch {
              setUser(null);
              setProfile(null);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadSession();

    // Listen for auth state changes if Supabase is configured
    if (isConfigured) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email, session.user.user_metadata?.full_name);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, [isConfigured, fetchProfile, supabase]);

  // Sign Up
  const signUp = async (email: string, password: string, displayName: string) => {
    if (isConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
        },
      });

      if (error) return { error: error.message };
      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, email, displayName);
      }
      return { error: null };
    }

    // Local dev mode fallback
    const mockId = "demo-user-" + Date.now();
    const demoPayload = { id: mockId, email, fullName: displayName };
    localStorage.setItem("demo_user_session", JSON.stringify(demoPayload));
    document.cookie = `demo_user_session=${encodeURIComponent(JSON.stringify(demoPayload))}; path=/; max-age=86400`;

    const mockUser = {
      id: mockId,
      email,
      user_metadata: { full_name: displayName },
      app_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as User;

    setUser(mockUser);
    setProfile({
      id: mockId,
      email,
      fullName: displayName,
      createdAt: new Date().toISOString(),
    });

    return { error: null };
  };

  // Sign In
  const signIn = async (email: string, password: string) => {
    if (isConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };
      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, email, data.user.user_metadata?.full_name);
      }
      return { error: null };
    }

    // Local dev mode fallback
    const displayName = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    const mockId = "demo-user-1";
    const isAdmin = email.toLowerCase().includes("admin");
    const role = isAdmin ? "superadmin" : "user";
    const demoPayload = { id: mockId, email, fullName: formattedName, role };
    localStorage.setItem("demo_user_session", JSON.stringify(demoPayload));
    document.cookie = `demo_user_session=${encodeURIComponent(JSON.stringify(demoPayload))}; path=/; max-age=86400`;

    if (isAdmin) {
      const adminSession = {
        id: mockId,
        email,
        displayName: formattedName,
        role: "superadmin",
        lastLoginAt: new Date().toISOString(),
      };
      localStorage.setItem("admin_user_session", JSON.stringify(adminSession));
      document.cookie = `admin_user_session=${encodeURIComponent(JSON.stringify(adminSession))}; path=/; max-age=86400`;
    }

    const mockUser = {
      id: mockId,
      email,
      user_metadata: { full_name: formattedName },
      app_metadata: { role },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as User;

    setUser(mockUser);
    setProfile({
      id: mockId,
      email,
      fullName: formattedName,
      createdAt: new Date().toISOString(),
    });

    return { error: null };
  };

  // Sign Out
  const signOut = async () => {
    if (isConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) return { error: error.message };
    }

    // Clear local storage and demo cookie
    localStorage.removeItem("demo_user_session");
    localStorage.removeItem("admin_user_session");
    document.cookie = "demo_user_session=; path=/; max-age=0";
    document.cookie = "admin_user_session=; path=/; max-age=0";
    setUser(null);
    setProfile(null);
    return { error: null };
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    if (isConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) return { error: error.message };
      return { error: null };
    }

    // Local dev mode simulation
    return { error: null };
  };

  // Update Profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return { error: "No active user profile" };

    if (isConfigured && user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: updates.fullName || profile.fullName,
          avatar_url: updates.avatarUrl || profile.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) return { error: error.message };
    }

    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);

    if (!isConfigured) {
      localStorage.setItem("demo_user_session", JSON.stringify(updatedProfile));
      document.cookie = `demo_user_session=${encodeURIComponent(JSON.stringify(updatedProfile))}; path=/; max-age=86400`;
    }

    return { error: null };
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    if (isConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    }

    // Local fallback message
    return { error: "Google OAuth requires Supabase project configuration in .env.local" };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isConfigured,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
