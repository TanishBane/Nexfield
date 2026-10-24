'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
import { Button, Card, CardHeader, CardContent, StatusIndicator } from '@nexfield/ui';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';

function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    async function checkRecoverySession() {
      if (!isConfigured) {
        setIsVerifyingSession(false);
        setHasValidSession(false);
        setErrorMsg('Supabase authentication is not configured in this environment.');
        return;
      }

      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          setHasValidSession(false);
          setErrorMsg('No active password recovery session detected or the recovery link has expired. Please request a new recovery link.');
        } else {
          setHasValidSession(true);
        }
      } catch (err) {
        setHasValidSession(false);
        setErrorMsg('Failed to verify recovery session. Please request a new link.');
      } finally {
        setIsVerifyingSession(false);
      }
    }

    checkRecoverySession();
  }, [isConfigured]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long for enterprise security.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      setSuccessMsg('Your password has been successfully updated. Redirecting to Command Center...');
      setIsLoading(false);

      setTimeout(() => {
        router.push('/control');
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <NexfieldLogo size="xl" showWordmark={true} href="/" />
          </div>
          <p className="text-xs text-[#7B9587]">
            Operator Credential Security & Password Update
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-[#1E2E25] bg-[#0E1511] shadow-xl">
          <CardHeader className="pb-3 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-[#163B2A] border border-[#2D6546] flex items-center justify-center mb-2">
              <KeyRound className="h-5 w-5 text-[#D7B678]" />
            </div>
            <h2 className="text-lg font-bold text-[#FAF8F2]">Set New Password</h2>
            <p className="text-xs text-[#7B9587]">
              Choose a strong, unique password for your agronomist account.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {isVerifyingSession ? (
              <div className="py-8 text-center text-xs text-[#7B9587] flex flex-col items-center gap-2">
                <span className="h-5 w-5 border-2 border-[#D7B678] border-t-transparent rounded-full animate-spin" />
                <span>Verifying secure recovery token...</span>
              </div>
            ) : !hasValidSession ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 p-3.5 text-xs text-amber-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
                <Link href="/forgot-password" className="block">
                  <Button className="w-full bg-[#D7B678] hover:bg-[#C9A665] text-[#0A0F0D] font-bold">
                    Request New Recovery Link
                  </Button>
                </Link>
                <Link href="/login" className="block text-center text-xs text-[#8EA698] hover:text-[#FAF8F2]">
                  Return to Sign In
                </Link>
              </div>
            ) : (
              <>
                {errorMsg && (
                  <div className="flex items-start gap-2.5 rounded-lg bg-red-950/50 border border-red-800/60 p-3 text-xs text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                    <span className="leading-relaxed">{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="flex items-start gap-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 p-3.5 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span className="leading-relaxed">{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#8EA698]" htmlFor="new-password">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7365]">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#090E0B] border border-[#22352A] text-sm text-[#F1F6F3] placeholder-[#4B6154] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5A7365] hover:text-[#9FB7AA]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#5A7365]">Minimum 8 characters with numbers or symbols.</p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#8EA698]" htmlFor="confirm-password">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7365]">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#090E0B] border border-[#22352A] text-sm text-[#F1F6F3] placeholder-[#4B6154] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#163B2A] hover:bg-[#1D4A35] text-[#FAF8F2] border border-[#D7B678]/50 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating Security Credentials...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Update Password & Enter
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-[11px] text-[#556D60] flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/70" />
            Supabase Cryptographic Key Derivation (Argon2 / bcrypt)
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-[#768F81] font-mono">
          Loading Security Key Manager...
        </div>
      }
    >
      <UpdatePasswordForm />
    </Suspense>
  );
}
