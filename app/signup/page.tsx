"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, User, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { PandaMascot, MascotReaction } from "@/components/mascot/PandaMascot";
import { OtpInput } from "@/components/auth/OtpInput";
import { validateEmailSecurity } from "@/lib/security/email-security";
import { cn } from "@/lib/utils";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  // Default redirect target: homepage top hero section ("/")
  const targetDestination = redirect && redirect !== "/signup" && redirect !== "/dashboard" ? redirect : "/";

  const { user, signUp, signInWithGoogle, sendEmailOtp, verifyEmailOtp } = useAuth();

  // Mode & Step
  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  const [otpStep, setOtpStep] = useState<"details" | "code">("details");

  // Form Fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  // States
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect if user is already authenticated
  React.useEffect(() => {
    if (user) {
      window.location.href = targetDestination;
    }
  }, [user, targetDestination]);

  // Resend countdown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Password-based signup
  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError("Please enter your name.");
      return;
    }

    // Security check: validate email and block disposable/temporary domains
    const validation = validateEmailSecurity(email);
    if (!validation.isValid) {
      setError(validation.error || "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }

    setIsLoading(true);
    try {
      const { error: signUpError } = await signUp(email, password, displayName.trim());
      if (signUpError) {
        setError(signUpError);
        setIsLoading(false);
      } else {
        setIsRedirecting(true);
        router.refresh();
        window.location.href = targetDestination;
      }
    } catch {
      setError("Failed to create account. Please try again.");
      setIsLoading(false);
    }
  };

  // Send Email OTP for signup
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError("Please enter your name.");
      return;
    }

    // Security check: validate email and block disposable/temporary domains
    const validation = validateEmailSecurity(email);
    if (!validation.isValid) {
      setError(validation.error || "Please enter a valid personal or work email address.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }

    setIsLoading(true);
    try {
      const { error: otpError } = await sendEmailOtp(email, displayName.trim());
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

  // Contextual reaction for the mascot
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
    mascotMessage = "Account ready! Taking you home... 💖";
  } else if (error) {
    mascotMessage = "Oops! Check details 😯";
  } else if (isLoading) {
    mascotMessage = "Crafting your account... ✨";
  } else if (isPasswordFocused) {
    mascotMessage = "I won't peek! 🙈";
  } else if (authMode === "otp" && otpStep === "code") {
    mascotMessage = otpCode.length === 6 ? "Verifying code... 🐾" : "Enter your 6-digit code! 📬";
  } else {
    mascotMessage = "Let's create magic together! 🐼";
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-7 h-7" />
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Create Creator Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Join thousands designing heartfelt interactive celebration surprises.
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

      {/* Signup Card */}
      <Card glass className="p-6 sm:p-8 space-y-5 border-slate-200 dark:border-slate-800">
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

        {/* 1. OTP Sign-up Flow */}
        {authMode === "otp" && (
          <div>
            {otpStep === "details" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  id="signup-otp-name"
                  autoComplete="name"
                  placeholder="Alex Parker"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  disabled={isLoading}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  id="signup-otp-email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  disabled={isLoading}
                  required
                  helperText="No password needed. We'll send a 6-digit verification code to your inbox."
                />

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-otp"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="rounded border-slate-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                  />
                  <label htmlFor="terms-otp" className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                    I agree to the Terms of Service & Privacy Policy
                  </label>
                </div>

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
                      setOtpStep("details");
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
                  {isRedirecting ? "Redirecting..." : "Verify & Create Account"}
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

        {/* 2. Password Sign-up Flow */}
        {authMode === "password" && (
          <form onSubmit={handlePasswordSignup} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              id="signup-name"
              autoComplete="name"
              placeholder="Alex Parker"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              disabled={isLoading}
              required
            />

            <Input
              label="Email Address"
              type="email"
              id="signup-email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              disabled={isLoading}
              required
            />

            <Input
              label="Password"
              type="password"
              id="signup-password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              leftIcon={<Lock className="w-4 h-4" />}
              disabled={isLoading}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              id="signup-confirm-password"
              autoComplete="new-password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              leftIcon={<Lock className="w-4 h-4" />}
              disabled={isLoading}
              required
            />

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded border-slate-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                I agree to the Terms of Service & Privacy Policy
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 text-sm shadow-md cursor-pointer"
              isLoading={isLoading || isRedirecting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isRedirecting ? "Redirecting..." : "Create Account with Password"}
            </Button>
          </form>
        )}

        {/* Redirecting Banner */}
        {isRedirecting && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Account created! Taking you to the homepage...</span>
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
          Already have an account?{" "}
          <Link
            href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="text-pink-600 dark:text-pink-400 font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 py-12">
      <Suspense fallback={<div className="text-center text-xs text-slate-400">Loading registration...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
