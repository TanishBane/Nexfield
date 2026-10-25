import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { cn } from './utils';
import { DEMO_PROVENANCE_LABEL } from './demo-provenance';
import { StatusIndicator } from './status-indicator';

describe('StatusIndicator', () => {
  it('shows the synthetic fixture provenance banner label in demo mode', () => {
    const html = renderToStaticMarkup(React.createElement(StatusIndicator, { status: 'fixture' }));
    expect(html).toContain(DEMO_PROVENANCE_LABEL);
  });

  it('does not describe the public demo as live telemetry', () => {
    const html = renderToStaticMarkup(React.createElement(StatusIndicator, { status: 'online' }));
    expect(html).not.toContain('Live Telemetry Active');
    expect(html).toContain(DEMO_PROVENANCE_LABEL);
  });

  it('uses the canonical public demo provenance label everywhere', () => {
    expect(DEMO_PROVENANCE_LABEL).toBe('Development Mode: Synthetic Agronomic Fixtures');
  });
});

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('should merge tailwind classes properly', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle arrays and objects', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
    expect(cn({ class1: true, class2: false })).toBe('class1');
  });

  it('should handle a mix of inputs', () => {
    expect(cn('p-4', ['text-red-500', 'bg-blue-500'], { 'p-8': true })).toBe('text-red-500 bg-blue-500 p-8');
  });
});
