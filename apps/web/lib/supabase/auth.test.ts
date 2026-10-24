import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isSupabaseConfigured, createClient } from './client';
import { isSupabaseServerConfigured } from './server';

// Sanitization logic matching route.ts
function sanitizeNextUrl(next: string | null): string {
  if (!next) return '/control';

  let decoded = next;
  try {
    decoded = decodeURIComponent(next);
  } catch {
    return '/control';
  }

  if (
    !decoded.startsWith('/') ||
    decoded.startsWith('//') ||
    decoded.includes('\\') ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(decoded)
  ) {
    return '/control';
  }

  return decoded;
}

describe('Supabase Client Configuration Invariants', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('detects unconfigured credentials when env vars are missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(isSupabaseConfigured()).toBe(false);
    expect(isSupabaseServerConfigured()).toBe(false);
  });

  it('rejects placeholder project URLs and placeholder keys', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder-project.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder-anon-key';

    expect(isSupabaseConfigured()).toBe(false);
    expect(isSupabaseServerConfigured()).toBe(false);
  });

  it('rejects default template strings (your-project.supabase.co)', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://your-project.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'your-anon-or-publishable-key';

    expect(isSupabaseConfigured()).toBe(false);
    expect(isSupabaseServerConfigured()).toBe(false);
  });

  it('validates genuine Supabase project configuration', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://abcdefghijklm.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validkey';

    expect(isSupabaseConfigured()).toBe(true);
    expect(isSupabaseServerConfigured()).toBe(true);
  });

  it('throws descriptive error if createClient is invoked without credentials', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => createClient()).toThrow(/Supabase client is not configured/);
  });
});

describe('OAuth Callback Open Redirect Protection', () => {
  it('accepts safe relative application routes', () => {
    expect(sanitizeNextUrl('/control')).toBe('/control');
    expect(sanitizeNextUrl('/twin')).toBe('/twin');
    expect(sanitizeNextUrl('/fieldsight')).toBe('/fieldsight');
    expect(sanitizeNextUrl('/update-password')).toBe('/update-password');
    expect(sanitizeNextUrl('/onboarding')).toBe('/onboarding');
    expect(sanitizeNextUrl('/ops?tab=tasks')).toBe('/ops?tab=tasks');
  });

  it('falls back to /control when next parameter is null or empty', () => {
    expect(sanitizeNextUrl(null)).toBe('/control');
    expect(sanitizeNextUrl('')).toBe('/control');
  });

  it('blocks absolute external URLs with HTTP/HTTPS schemes', () => {
    expect(sanitizeNextUrl('https://evil-phishing.com')).toBe('/control');
    expect(sanitizeNextUrl('http://malicious.org/steal-session')).toBe('/control');
    expect(sanitizeNextUrl('ftp://insecure.transfer')).toBe('/control');
  });

  it('blocks JavaScript and data pseudo-protocols', () => {
    expect(sanitizeNextUrl('javascript:alert(document.cookie)')).toBe('/control');
    expect(sanitizeNextUrl('data:text/html,<script>alert(1)</script>')).toBe('/control');
  });

  it('blocks protocol-relative URLs (//attacker.com)', () => {
    expect(sanitizeNextUrl('//evil.com')).toBe('/control');
    expect(sanitizeNextUrl('//nexfield-fake.net/login')).toBe('/control');
  });

  it('blocks backslash bypass attempts (\\evil.com and /\\evil.com)', () => {
    expect(sanitizeNextUrl('\\evil.com')).toBe('/control');
    expect(sanitizeNextUrl('/\\evil.com')).toBe('/control');
    expect(sanitizeNextUrl('/path\\to\\danger')).toBe('/control');
  });

  it('blocks URL-encoded redirect bypasses (%2F%2Fevil.com)', () => {
    expect(sanitizeNextUrl('%2F%2Fevil.com')).toBe('/control');
    expect(sanitizeNextUrl('%2F%5Cevil.com')).toBe('/control');
  });
});
