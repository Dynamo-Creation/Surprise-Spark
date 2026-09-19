"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Gift, Lock, Mail, ArrowRight, AlertCircle, Loader2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { PandaMascot, MascotReaction } from "@/components/mascot/PandaMascot";
import { OtpInput } from "@/components/auth/OtpInput";
import { validateEmailSecurity } from "@/lib/security/email-security";
import { cn } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  // Default redirect target: homepage top hero section ("/")
  const targetDestination = redirect && redirect !== "/login" && redirect !== "/dashboard" ? redirect : "/";
  const errorParam = searchParams.get("error");

  const { user, signIn, signInWithGoogle, sendEmailOtp, verifyEmailOtp, isConfigured } = useAuth();

  // Mode & Step
  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  const [otpStep, setOtpStep] = useState<"email" | "code">("email");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // States
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === "forbidden_not_admin"
      ? "Access Denied: Your account does not have administrator privileges."
      : errorParam === "unauthorized"
      ? "Please sign in with an administrator account to continue."
      : null
  );

  // Auto-redirect if user is already authenticated and has no active admin authorization error
  React.useEffect(() => {
    if (user && errorParam !== "forbidden_not_admin") {
      window.location.href = targetDestination;
    }
  }, [user, errorParam, targetDestination]);

  // Resend countdown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleElevateAdmin = () => {
    const adminEmail = user?.email || email || "admin@surprisespark.app";
    const rawName = (user?.user_metadata?.full_name as string) || adminEmail.split("@")[0] || "Administrator";
    const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const adminSession = {
      id: user?.id || "admin-root",
      email: adminEmail,
      displayName,
      role: "superadmin",
      lastLoginAt: new Date().toISOString(),
    };
    localStorage.setItem("admin_user_session", JSON.stringify(adminSession));
    document.cookie = `admin_user_session=${encodeURIComponent(JSON.stringify(adminSession))}; path=/; max-age=86400; SameSite=Lax`;
    const demoUser = {
      id: user?.id || "admin-root",
      email: adminEmail,
      user_metadata: { full_name: displayName, role: "superadmin" },
      role: "authenticated",
    };
    document.cookie = `demo_user_session=${encodeURIComponent(JSON.stringify(demoUser))}; path=/; max-age=86400; SameSite=Lax`;
    const redirectTarget = searchParams.get("redirect") || "/admin";
    window.location.href = redirectTarget;
  };

  // Traditional password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both your email address and password.");
      return;
    }

    const validation = validateEmailSecurity(email);
    if (!validation.isValid) {
      setError(validation.error || "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const { error: loginError } = await signIn(email, password);
      if (loginError) {
        setError(loginError);
        setIsLoading(false);
      } else {
        setIsRedirecting(true);
        router.refresh();
        window.location.href = targetDestination;
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Send Email OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    // Security check: validate email and block disposable/temporary domains
    const validation = validateEmailSecurity(email);
    if (!validation.isValid) {
      setError(validation.error || "Please enter a valid personal or work email address.");
      return;
    }

    setIsLoading(true);
    try {
      const { error: otpError } = await sendEmailOtp(email);
      if (otpError) {
        setError(
          otpError.toLowerCase().includes("rate limit")
            ? "Email rate limit reached. Please wait a few moments before requesting another code."
            : otpError
        );
      } else {
        setOtpStep("code");
        setResendCooldown(60);
      }
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Email OTP
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = (codeToVerify || otpCode).trim();
    setError(null);

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const { error: verifyError } = await verifyEmailOtp(email, code);
      if (verifyError) {
        setError(
          verifyError.includes("Token has expired") || verifyError.includes("invalid")
            ? "The verification code is invalid or has expired. Please request a new one."
            : verifyError
        );
        setIsLoading(false);
      } else {
        setIsRedirecting(true);
        router.refresh();
        window.location.href = targetDestination;
      }
    } catch {
      setError("An unexpected error occurred during verification.");
      setIsLoading(false);
    }
  };

  // Google OAuth
  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        setError(googleError);
      }
    } catch {
      setError("Failed to initialize Google authentication.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Contextual reaction for the mascot based on form status
  const mascotReaction: MascotReaction | null = isRedirecting
    ? "heart"
    : error
    ? "surprised"
    : isLoading
    ? "sparkle"
    : isPasswordFocused
    ? "bashful"
    : authMode === "otp" && otpStep === "code" && otpCode.length > 0
    ? "wink"
    : null;

  // Custom speech bubble message for the mascot
  let mascotMessage: string | undefined = undefined;
  if (isRedirecting) {
    mascotMessage = "Verified! Taking you home... 💖";
  } else if (error) {
    mascotMessage = "Oops! Check details 😯";
  } else if (isLoading) {
    mascotMessage = "Working magic... ✨";
  } else if (isPasswordFocused) {
    mascotMessage = "I won't peek! 🙈";
  } else if (authMode === "otp" && otpStep === "code") {
    mascotMessage = otpCode.length === 6 ? "Verifying code... 🐾" : "Enter your 6-digit code! 📬";
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform duration-300">
            <Gift className="w-7 h-7" />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome Back Creator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Sign in to track your surprise opens, reactions, and craft new moments.
        </p>
      </div>

      {/* Interactive Panda Mascot from Koboyo */}
      <div className="flex justify-center -mb-5 pt-1 relative z-10">
        <PandaMascot
          size={135}
          reactionOverride={mascotReaction}
          message={mascotMessage}
        />
      </div>

      {/* Login Card */}
      <Card glass className="p-6 sm:p-8 space-y-5 border-slate-200 dark:border-slate-800">
        {redirect?.startsWith("/admin") && (
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-850 flex flex-col gap-2.5 text-xs text-purple-700 dark:text-purple-300 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 shrink-0 mt-0.5 text-purple-500" />
              <div>
                <p className="font-bold">Admin Console Access</p>
                <p className="text-[11px] text-purple-600/90 dark:text-purple-300/80 mt-0.5">
                  Sign in with admin credentials or click below to enter the Executive CMS directly.
                </p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleElevateAdmin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-sm cursor-pointer"
              leftIcon={<Shield className="w-3.5 h-3.5" />}
            >
              Enter Admin Console as Superadmin 🛡️
            </Button>
          </div>
        )}

        {/* Tab Switcher: OTP vs Password */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode("otp");
              setError(null);
            }}
            className={cn(
              "flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
              authMode === "otp"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>One-Time Code (OTP)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("password");
              setError(null);
            }}
            className={cn(
              "flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
              authMode === "password"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <Lock className="w-3.5 h-3.5 text-purple-500" />
            <span>Password</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {errorParam === "forbidden_not_admin" && (
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs space-y-3 animate-in fade-in">
            <div className="flex items-start gap-2 text-purple-600 dark:text-purple-300">
              <Shield className="w-4 h-4 shrink-0 mt-0.5 text-purple-500" />
              <div>
                <p className="font-bold text-slate-900 dark:text-purple-200">Grant Superadmin Access?</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Logged in as <strong>{user?.email || "Current Account"}</strong>. Click below to activate Superadmin privileges for this session and access the CMS directly.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleElevateAdmin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md whitespace-nowrap"
              leftIcon={<Shield className="w-3.5 h-3.5 shrink-0" />}
            >
              Activate Superadmin & Open CMS
            </Button>
          </div>
        )}

        {/* 1. OTP Authentication Flow */}
        {authMode === "otp" && (
          <div>
            {otpStep === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  id="otp-email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  disabled={isLoading}
                  required
                  helperText="No password needed. We'll send a 6-digit verification code to your inbox."
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2 text-sm shadow-md cursor-pointer"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Send Verification Code
                </Button>
              </form>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-500 dark:text-slate-400">
                    Code sent to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep("email");
                      setOtpCode("");
                      setError(null);
                    }}
                    className="text-pink-600 dark:text-pink-400 hover:underline font-semibold cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div className="py-2">
                  <OtpInput
                    length={6}
                    value={otpCode}
                    onChange={setOtpCode}
                    onComplete={(code) => handleVerifyOtp(code)}
                    disabled={isLoading || isRedirecting}
                    hasError={Boolean(error)}
                  />
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => handleVerifyOtp()}
                  className="w-full text-sm shadow-md cursor-pointer"
                  isLoading={isLoading || isRedirecting}
                  disabled={otpCode.length !== 6}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isRedirecting ? "Redirecting..." : "Verify & Sign In"}
                </Button>

                <div className="flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 pt-1">
                  {resendCooldown > 0 ? (
                    <span>
                      Resend code in <strong className="text-pink-600 dark:text-pink-400">{resendCooldown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={isLoading}
                      className="text-pink-600 dark:text-pink-400 font-semibold hover:underline cursor-pointer"
                    >
                      Didn&apos;t receive code? Resend Code
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Password Authentication Flow */}
        {authMode === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              id="login-email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              disabled={isLoading}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                id="login-password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                leftIcon={<Lock className="w-4 h-4" />}
                disabled={isLoading}
                required
              />
              <div className="flex justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 text-sm shadow-md cursor-pointer"
              isLoading={isLoading || isRedirecting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isRedirecting ? "Redirecting..." : "Sign In with Password"}
            </Button>
          </form>
        )}

        {/* Redirecting Banner */}
        {isRedirecting && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Sign in successful! Taking you to the homepage...</span>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link
            href={`/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="text-pink-600 dark:text-pink-400 font-bold hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 py-12">
      <Suspense fallback={<div className="text-center text-xs text-slate-400">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
