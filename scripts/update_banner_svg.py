import base64
import io
import os
from PIL import Image

logo_path = 'apps/web/public/branding/nexfield-logo.jpg'
if os.path.exists(logo_path):
    img = Image.open(logo_path).resize((300, 300), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=95)
    b64_logo = base64.b64encode(buf.getvalue()).decode('ascii')
else:
    b64_logo = ''

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 280" width="100%" height="auto">
  <defs>
    <!-- Deep Forest Green & Wheat Palette Gradients -->
    <linearGradient id="forestBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1711"/>
      <stop offset="45%" stop-color="#142F22"/>
      <stop offset="100%" stop-color="#0E1E16"/>
    </linearGradient>

    <linearGradient id="wheatAura" x1="100%" y1="50%" x2="50%" y2="50%">
      <stop offset="0%" stop-color="#D7B678" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#D7B678" stop-opacity="0"/>
    </linearGradient>

    <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D7B678" stop-opacity="0.5"/>
      <stop offset="50%" stop-color="#FAF8F2" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#D7B678" stop-opacity="0.2"/>
    </linearGradient>

    <!-- Logo Rounded Clip Path -->
    <clipPath id="logoClip">
      <rect x="-68" y="-68" width="136" height="136" rx="26" ry="26"/>
    </clipPath>
  </defs>

  <!-- Background Canvas -->
  <rect width="1200" height="280" rx="16" fill="url(#forestBg)"/>

  <!-- Subtle Warm Glow on Right Edge -->
  <rect width="500" height="280" x="700" y="0" rx="16" fill="url(#wheatAura)"/>

  <!-- Outer Border Frame -->
  <rect width="1198" height="278" x="1" y="1" rx="15" fill="none" stroke="#D7B678" stroke-width="1" stroke-opacity="0.25"/>

  <!-- Elegant Vector Line-Art Wheat Stalk Silhouette (Right Side) -->
  <g transform="translate(1040, 260) rotate(-14)" opacity="0.35">
    <!-- Main Stalk Stem -->
    <path d="M 0 0 Q -10 -110 -30 -220" fill="none" stroke="#D7B678" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Bottom Pair -->
    <g transform="translate(-5, -60)">
      <!-- Left Kernel -->
      <path d="M 0 0 C -18 -8 -22 -22 -14 -32 C -6 -24 -2 -10 0 0 Z" fill="#D7B678" fill-opacity="0.6"/>
      <path d="M -14 -32 L -28 -58" stroke="#D7B678" stroke-width="1.2" stroke-linecap="round"/>
      <!-- Right Kernel -->
      <path d="M 0 0 C 18 -8 22 -22 14 -32 C 6 -24 2 -10 0 0 Z" fill="#D7B678" fill-opacity="0.6"/>
      <path d="M 14 -32 L 28 -58" stroke="#D7B678" stroke-width="1.2" stroke-linecap="round"/>
    </g>

    <!-- Mid Pair 1 -->
    <g transform="translate(-11, -105)">
      <path d="M 0 0 C -18 -8 -22 -22 -14 -32 C -6 -24 -2 -10 0 0 Z" fill="#D7B678" fill-opacity="0.7"/>
      <path d="M -14 -32 L -30 -62" stroke="#D7B678" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M 0 0 C 18 -8 22 -22 14 -32 C 6 -24 2 -10 0 0 Z" fill="#D7B678" fill-opacity="0.7"/>
      <path d="M 14 -32 L 30 -62" stroke="#D7B678" stroke-width="1.2" stroke-linecap="round"/>
    </g>

    <!-- Mid Pair 2 -->
    <g transform="translate(-18, -150)">
      <path d="M 0 0 C -17 -7 -20 -20 -13 -29 C -5 -22 -2 -9 0 0 Z" fill="#D7B678" fill-opacity="0.8"/>
      <path d="M -13 -29 L -28 -56" stroke="#D7B678" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M 0 0 C 17 -7 20 -20 13 -29 C 5 -22 2 -9 0 0 Z" fill="#D7B678" fill-opacity="0.8"/>
      <path d="M 13 -29 L 28 -56" stroke="#D7B678" stroke-width="1.2" stroke-linecap="round"/>
    </g>

    <!-- Upper Pair -->
    <g transform="translate(-24, -190)">
      <path d="M 0 0 C -15 -6 -18 -18 -11 -26 C -4 -19 -1 -8 0 0 Z" fill="#D7B678" fill-opacity="0.85"/>
      <path d="M -11 -26 L -24 -50" stroke="#D7B678" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M 0 0 C 15 -6 18 -18 11 -26 C 4 -19 1 -8 0 0 Z" fill="#D7B678" fill-opacity="0.85"/>
      <path d="M 11 -26 L 24 -50" stroke="#D7B678" stroke-width="1.2" stroke-linecap="round"/>
    </g>

    <!-- Top Awn Tip -->
    <g transform="translate(-30, -220)">
      <path d="M 0 0 C -8 -10 0 -24 0 -30 C 0 -24 8 -10 0 0 Z" fill="#D7B678" fill-opacity="0.9"/>
      <path d="M 0 -30 L 0 -65" stroke="#D7B678" stroke-width="1.4" stroke-linecap="round"/>
    </g>
  </g>

  <!-- Left: Official NEXFIELD Emblem Card -->
  <g transform="translate(145, 140)">
    <!-- Ambient Gold/Forest Halo -->
    <circle cx="0" cy="0" r="80" fill="#163B2A" fill-opacity="0.4"/>
    <!-- Outer Card Border -->
    <rect x="-72" y="-72" width="144" height="144" rx="28" ry="28" fill="#12241A" stroke="#D7B678" stroke-width="1.5" stroke-opacity="0.45"/>
    
    <!-- Embedded Master Logo with Rounded Clip -->
    <g clip-path="url(#logoClip)">
      <image href="data:image/jpeg;base64,{b64_logo}" x="-68" y="-68" width="136" height="136" preserveAspectRatio="xMidYMid slice"/>
    </g>
  </g>

  <!-- Center/Right: Typographic Presentation -->
  <g transform="translate(255, 66)">
    <!-- Program / Identity Pill -->
    <rect x="0" y="0" width="260" height="26" rx="13" fill="#163B2A" stroke="#D7B678" stroke-width="1" stroke-opacity="0.4"/>
    <circle cx="14" cy="13" r="3.5" fill="#D7B678"/>
    <text x="26" y="17" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#F2E5C9" letter-spacing="0.6">ADAPPT 5.0 • DOMAIN 2: AGRI-AI</text>

    <!-- Main Title: NEXFIELD -->
    <text x="0" y="74" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#FAF8F2" letter-spacing="1.5">NEXFIELD</text>

    <!-- Platform Positioning -->
    <text x="0" y="108" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="500" fill="#E2D9C8" letter-spacing="0.3">The Agricultural Intelligence Operating System</text>

    <!-- Operational Tagline / Five Pillars -->
    <text x="0" y="138" font-family="'JetBrains Mono', 'SF Mono', Consolas, monospace" font-size="12" font-weight="600" fill="#D7B678" letter-spacing="1.2">OBSERVE · PREDICT · SIMULATE · OPTIMIZE · GROW</text>
  </g>
</svg>
'''

out_path = 'docs/assets/branding/nexfield-banner.svg'
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f'Successfully updated {out_path} with Wheat & Forest Green editorial identity (1200x280).')
