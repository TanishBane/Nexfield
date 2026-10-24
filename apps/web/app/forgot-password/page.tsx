'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button, Card, CardHeader, CardContent, StatusIndicator } from '@nexfield/ui';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const isConfigured = isSupabaseConfigured();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    if (!isConfigured) {
      setErrorMsg(
        'Supabase authentication is not configured in this environment. Please configure NEXT_PUBLIC_SUPABASE_URL.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      setSuccessMsg(
        `A password recovery link has been dispatched to ${email.trim()}. Please check your inbox and follow the instructions.`
      );
      setIsLoading(false);
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
            Agronomist Account Recovery & Access Restoration
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <StatusIndicator
              status={isConfigured ? 'online' : 'fixture'}
              label={isConfigured ? 'Supabase Auth Online' : 'Auth Unconfigured'}
              pulse={isConfigured}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-[#1E2E25] bg-[#0E1511] shadow-xl">
          <CardHeader className="pb-3 text-center">
            <h2 className="text-lg font-bold text-[#FAF8F2]">Reset Your Password</h2>
            <p className="text-xs text-[#7B9587] leading-relaxed">
              Enter your registered work email. We will generate and send an encrypted single-use recovery link.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-950/50 border border-red-800/60 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successMsg ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 p-3.5 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="leading-relaxed">{successMsg}</span>
                </div>
                <Link href="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-[#223B2B] text-[#D7B678] hover:bg-[#15241B]"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#8EA698]" htmlFor="recovery-email">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A7365]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="recovery-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="agronomist@farm.ag"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#090E0B] border border-[#22352A] text-sm text-[#F1F6F3] placeholder-[#4B6154] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#D7B678] hover:bg-[#C9A665] text-[#0A0F0D] font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Sending Link...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Password Reset Link
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="text-xs text-[#8EA698] hover:text-[#D7B678] transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Remember your password? Sign in
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-[11px] text-[#556D60] flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/70" />
            PKCE Verified Single-Use Cryptographic Recovery Tokens
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-[#768F81] font-mono">
          Loading Password Recovery...
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
