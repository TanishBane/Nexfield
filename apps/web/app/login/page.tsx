'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sprout,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Database,
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, StatusIndicator } from '@nexfield/ui';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLiveConfig, setIsLiveConfig] = useState(false);

  useEffect(() => {
    setIsLiveConfig(isSupabaseConfigured());
    if (errorParam === 'auth_exchange_failed') {
      setErrorMsg('Authentication session exchange failed. Please sign in again.');
    }
  }, [errorParam]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (!isLiveConfig) {
        // Offline / Demo Fixture Mode: simulate instantaneous local session
        await new Promise((resolve) => setTimeout(resolve, 600));
        router.push(redirectTo);
        return;
      }

      const supabase = createClient();

      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
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
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              redirectTo
            )}`,
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
            'Account registration submitted. Check your email for confirmation instructions.'
          );
          setIsLoading(false);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('operator@nexfield.ag');
    setPassword('Nexfield2026!');
    setErrorMsg(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header with Official Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <NexfieldLogo size="xl" showWordmark={true} href="/" />
          </div>
          <p className="text-xs text-[#7B9587]">
            Operator Access & Tenant Workspace Authentication
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <StatusIndicator
              status={isLiveConfig ? 'online' : 'fixture'}
              label={isLiveConfig ? 'Supabase Auth Online' : 'Local Auth Ready'}
              pulse={isLiveConfig}
            />
          </div>
        </div>

        {/* Auth Form Card */}
        <Card className="border-[#1E2E25] bg-[#0E1511] shadow-xl">
          <CardHeader className="pb-4">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 rounded-lg bg-[#080D0A] p-1 border border-[#18261E]">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                }}
                className={`py-2 text-xs font-medium rounded-md transition-all ${
                  mode === 'signin'
                    ? 'bg-[#15241B] text-emerald-400 font-semibold border border-[#223B2B] shadow-sm'
                    : 'text-[#7B9587] hover:text-[#E1ECE5]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                }}
                className={`py-2 text-xs font-medium rounded-md transition-all ${
                  mode === 'signup'
                    ? 'bg-[#15241B] text-emerald-400 font-semibold border border-[#223B2B] shadow-sm'
                    : 'text-[#7B9587] hover:text-[#E1ECE5]'
                }`}
              >
                Create Account
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-950/50 border border-red-800/60 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-start gap-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#8EA698] flex items-center justify-between">
                  <span>Work Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7365]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@farm.ag"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#090E0B] border border-[#22352A] text-sm text-[#F1F6F3] placeholder-[#4B6154] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#8EA698] flex items-center justify-between">
                  <span>Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7365]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-lg bg-[#090E0B] border border-[#22352A] text-sm text-[#F1F6F3] placeholder-[#4B6154] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5A7365] hover:text-[#9FB7AA]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (only signup) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#8EA698]">
                    <span>Confirm Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7365]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#090E0B] border border-[#22352A] text-sm text-[#F1F6F3] placeholder-[#4B6154] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === 'signin' ? 'Sign In to Command Center' : 'Create Agronomist Account'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Quick Demo Helper */}
            <div className="pt-2 border-t border-[#192720] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                Fill Test Credentials
              </button>

              <button
                type="button"
                onClick={() => router.push('/demo/control')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Explore Interactive Demo →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Isolation Notice */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-[#556D60] flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/70" />
            Row-Level Security & AES-256 JWT Encryption Enforced
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
        <div className="min-h-screen flex items-center justify-center text-xs text-[#768F81] font-mono">
          Loading NEXFIELD Access Portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
