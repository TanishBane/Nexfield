'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  Cpu,
  Sprout,
  HelpCircle,
} from 'lucide-react';
import { Button, StatusIndicator } from '@nexfield/ui';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';

/**
 * Official Google Multi-color G Icon for OAuth
 */
function GoogleIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
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
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/control';
  const errorParam = searchParams.get('error');

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLiveConfig, setIsLiveConfig] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsLiveConfig(configured);

    if (errorParam === 'auth_exchange_failed') {
      setErrorMsg('Authentication token exchange failed or session expired. Please sign in again.');
    } else if (errorParam === 'supabase_unconfigured') {
      setErrorMsg('Supabase authentication is not configured in this environment. Live sign-in requires credentials.');
    }
  }, [errorParam]);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isLiveConfig) {
      setErrorMsg(
        'Google OAuth requires configured Supabase credentials (NEXT_PUBLIC_SUPABASE_URL). Please configure environment variables or use the Interactive Demo.'
      );
      return;
    }

    setIsGoogleLoading(true);

    try {
      const supabase = createClient();
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        redirectTo
      )}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setIsGoogleLoading(false);
      }
      // If successful, the browser will redirect automatically to Google OAuth consent
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google OAuth failed to initialize.';
      setErrorMsg(msg);
      setIsGoogleLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your work email address and password.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (!isLiveConfig) {
      setErrorMsg(
        'Supabase authentication is not configured in this environment. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable live user accounts.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }

        router.push(redirectTo);
        router.refresh();
      } else {
        const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          redirectTo
        )}`;

        const { error, data } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: callbackUrl,
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }

        if (data.session) {
          // Auto confirmed
          router.push(redirectTo);
          router.refresh();
        } else {
          setSuccessMsg(
            'Account registration successful! A confirmation email has been dispatched. Please verify your email before logging in.'
          );
          setIsLoading(false);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during authentication.';
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#080D0A] text-[#FAF8F2]">
      {/* =========================================================================
          LEFT COLUMN: Cinematic Brand & Agronomic Intelligence Showcase (Desktop)
          ========================================================================= */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden border-r border-[#1B2921] bg-gradient-to-b from-[#0B1410] via-[#09100D] to-[#070C09]">
        {/* Ambient Glow & Subtle Grid */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#2D6546]/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#D7B678]/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Top: Logo & System Indicator */}
        <div className="relative z-10 space-y-2">
          <NexfieldLogo size="lg" showWordmark={true} href="/" />
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#14231A] border border-[#2D6546]/40 text-[11px] font-medium text-[#D7B678]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Agricultural Intelligence Operating System
            </span>
          </div>
        </div>

        {/* Center: Editorial Manifesto & Value Pillars */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="space-y-4">
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-[#FAF8F2] leading-tight">
              Your land.{' '}
              <span className="font-serif italic font-normal text-[#D7B678]">Your insights.</span>
              <br />
              Your future.
            </h1>
            <p className="text-sm text-[#8EA698] leading-relaxed">
              Observe field telemetry, predict yield outcomes, simulate biophysical microclimates,
              and optimize farm economics in a unified enterprise workspace.
            </p>
          </div>

          {/* Core Feature Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1813]/80 border border-[#1C2C22]">
              <div className="w-8 h-8 rounded-lg bg-[#182B20] border border-[#2B4A37] flex items-center justify-center shrink-0">
                <Cpu className="h-4 w-4 text-[#D7B678]" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-[#FAF8F2]">
                  FieldSight Computer Vision
                </h2>
                <p className="text-[11px] text-[#789384]">
                  94.2% diagnostic accuracy across 14 crop pathogen classes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1813]/80 border border-[#1C2C22]">
              <div className="w-8 h-8 rounded-lg bg-[#182B20] border border-[#2B4A37] flex items-center justify-center shrink-0">
                <Activity className="h-4 w-4 text-[#D7B678]" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-[#FAF8F2]">
                  FAO-56 Biophysical Twin
                </h2>
                <p className="text-[11px] text-[#789384]">
                  Microclimate evapotranspiration simulation and precision water dispatch.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1813]/80 border border-[#1C2C22]">
              <div className="w-8 h-8 rounded-lg bg-[#182B20] border border-[#2B4A37] flex items-center justify-center shrink-0">
                <Layers className="h-4 w-4 text-[#D7B678]" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-[#FAF8F2]">
                  Mandi Arbitrage & Ops
                </h2>
                <p className="text-[11px] text-[#789384]">
                  Real-time APMC price intelligence with multi-factor freight modeling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Security Verification */}
        <div className="relative z-10 pt-6 border-t border-[#17251E] flex items-center justify-between text-[11px] text-[#60796C]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/80" />
            Supabase Auth · AES-256 JWT Encryption
          </span>
          <span className="font-mono">ADAPPT 5.0</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT COLUMN: Authentication Card & Interaction Portal
          ========================================================================= */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile-only Branding Header */}
          <div className="lg:hidden text-center space-y-2 mb-2">
            <div className="flex justify-center">
              <NexfieldLogo size="lg" showWordmark={true} href="/" />
            </div>
            <p className="text-xs text-[#8EA698]">
              Agricultural Intelligence Operating System
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-[#FAF8F2]">
              {mode === 'signin' ? 'Sign in to NEXFIELD' : 'Create Agronomist Account'}
            </h2>
            <StatusIndicator
              status={isLiveConfig ? 'online' : 'fixture'}
              label={isLiveConfig ? 'Auth Online' : 'Local / Dev'}
              pulse={isLiveConfig}
            />
          </div>

          {/* Unconfigured Alert Notice */}
          {!isLiveConfig && (
            <div className="p-3.5 rounded-xl bg-[#141C16] border border-[#D7B678]/40 text-xs text-[#E1ECE5] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#D7B678]">
                <HelpCircle className="h-4 w-4 shrink-0" />
                <span>Supabase Credentials Not Detected</span>
              </div>
              <p className="text-[#9BB1A4] leading-relaxed">
                Live accounts and Google OAuth require configured Supabase environment variables.
                To experience NEXFIELD without authentication setup, explore our interactive demo.
              </p>
              <div className="pt-1">
                <Link
                  href="/demo/control"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D7B678] hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Launch Interactive Demo Workspace →
                </Link>
              </div>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 rounded-xl bg-[#0D1410] p-1 border border-[#1A2820]">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-[#163B2A] text-[#FAF8F2] shadow-sm border border-[#2D6546]/60'
                  : 'text-[#7B9587] hover:text-[#FAF8F2]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-[#163B2A] text-[#FAF8F2] shadow-sm border border-[#2D6546]/60'
                  : 'text-[#7B9587] hover:text-[#FAF8F2]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Authentication Container */}
          <div className="p-6 rounded-2xl bg-[#0E1511] border border-[#1E2E25] shadow-xl space-y-5">
            {/* Error Message Banner */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-950/50 border border-red-800/60 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Success Message Banner */}
            {successMsg && (
              <div className="flex items-start gap-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 p-3.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#121B16] border border-[#22352A] hover:bg-[#18261F] hover:border-[#3D5C4A] text-sm font-semibold text-[#FAF8F2] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isGoogleLoading ? (
                <span className="h-4 w-4 border-2 border-[#D7B678] border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon className="h-4 w-4" />
              )}
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#1B2921]" />
              <span className="bg-[#0E1511] px-3 text-[11px] font-medium text-[#647F71] uppercase tracking-wider">
                or continue with email
              </span>
            </div>

            {/* Email + Password Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#8EA698]" htmlFor="login-email">
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7365]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agronomist@farm.ag"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#090E0B] border border-[#22352A] text-sm text-[#F1F6F3] placeholder-[#4B6154] focus:outline-none focus:border-[#D7B678] focus:ring-1 focus:ring-[#D7B678] transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#8EA698]" htmlFor="login-password">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#D7B678] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7365]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#090E0B] border border-[#22352A] text-sm text-[#F1F6F3] placeholder-[#4B6154] focus:outline-none focus:border-[#D7B678] focus:ring-1 focus:ring-[#D7B678] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5A7365] hover:text-[#9FB7AA]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (signup only) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#8EA698]" htmlFor="login-confirm-password">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7365]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="login-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#090E0B] border border-[#22352A] text-sm text-[#F1F6F3] placeholder-[#4B6154] focus:outline-none focus:border-[#D7B678] focus:ring-1 focus:ring-[#D7B678] transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-[#163B2A] hover:bg-[#1D4A35] text-[#FAF8F2] border border-[#D7B678]/50 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === 'signin' ? 'Sign In to Command Center' : 'Create Agronomist Account'}
                    <ArrowRight className="h-4 w-4 text-[#D7B678]" />
                  </span>
                )}
              </Button>
            </form>

            {/* Interactive Demo Callout */}
            <div className="pt-3 border-t border-[#18261E] text-center">
              <Link
                href="/demo/control"
                className="inline-flex items-center gap-1.5 text-xs text-[#D7B678] hover:text-[#FAF8F2] transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                <span>Want to test first? Explore Interactive Demo →</span>
              </Link>
            </div>
          </div>

          {/* Privacy & Terms Notice */}
          <p className="text-center text-[11px] text-[#60796C]">
            By continuing, you agree to NEXFIELD&apos;s{' '}
            <Link href="/about" className="underline hover:text-[#D7B678]">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/about" className="underline hover:text-[#D7B678]">
              Agronomic Data Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-[#768F81] font-mono bg-[#080D0A]">
          Loading NEXFIELD Access Portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
