"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, User, Mail, ArrowRight, AlertCircle, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { PandaMascot, MascotReaction } from "@/components/mascot/PandaMascot";
import { OtpInput } from "@/components/auth/OtpInput";
import { validateEmailSecurity } from "@/lib/security/email-security";
import { getSafeRedirectUrl } from "@/lib/security/sanitizer";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  // Default redirect target: homepage top hero section ("/") with open-redirect defense
  const targetDestination = getSafeRedirectUrl(redirect, "/");

  const { user, signInWithGoogle, sendEmailOtp, verifyEmailOtp } = useAuth();

  // OTP step
  const [otpStep, setOtpStep] = useState<"details" | "code">("details");

  // Form Fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  // States
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

  // Send Email OTP for signup — Gmail only
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError("Please enter your name.");
      return;
    }

    // Security check: only @gmail.com is allowed
    const validation = validateEmailSecurity(email);
    if (!validation.isValid) {
      setError(validation.error || "Only @gmail.com addresses are supported.");
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
      const { error: googleError } = await signInWithGoogle(targetDestination);
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
    : otpStep === "code" && otpCode.length > 0
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
  } else if (otpStep === "code") {
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
          Join with your Google account and start designing heartfelt interactive surprises.
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
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── PRIMARY: Google OAuth Button ── */}
        <button
          type="button"
          id="google-signup-btn"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border-2 border-pink-200 dark:border-pink-800/60 bg-gradient-to-r from-pink-50 via-white to-purple-50 dark:from-pink-950/30 dark:via-slate-900 dark:to-purple-950/30 hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-950/50 dark:hover:to-purple-950/50 text-sm font-bold text-slate-800 dark:text-white transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
              Or use Gmail verification code
            </span>
          </div>
        </div>

        {/* ── SECONDARY: Gmail OTP Flow ── */}
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
                label="Gmail Address"
                type="email"
                id="signup-otp-email"
                autoComplete="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                disabled={isLoading}
                required
                helperText="Only @gmail.com addresses are supported."
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

        {/* Redirecting Banner */}
        {isRedirecting && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Account created! Taking you to the homepage...</span>
          </div>
        )}

        {/* Gmail-only info banner */}
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 flex items-start gap-2 text-[11px] text-blue-600 dark:text-blue-400">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>For your security, only Google accounts (@gmail.com) are supported. Temporary and disposable email providers are not accepted.</span>
        </div>

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
