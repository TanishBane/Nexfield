import base64
import io
from PIL import Image

img = Image.open('apps/web/public/branding/nexfield-logo.jpg').resize((320, 320), Image.Resampling.LANCZOS)
buf = io.BytesIO()
img.save(buf, format='JPEG', quality=95)
b64_logo = base64.b64encode(buf.getvalue()).decode('ascii')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 320" width="100%" height="auto">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080D0B"/>
      <stop offset="50%" stop-color="#0E1612"/>
      <stop offset="100%" stop-color="#070A09"/>
    </linearGradient>

    <!-- Subtle Glow Filter -->
    <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <!-- Pattern Grid -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#14231A" stroke-width="0.8" stroke-opacity="0.4"/>
      <circle cx="0" cy="0" r="1.5" fill="#10B981" fill-opacity="0.2"/>
    </pattern>

    <!-- Logo Rounded Clip Path -->
    <clipPath id="logoClip">
      <rect x="-76" y="-76" width="152" height="152" rx="28" ry="28"/>
    </clipPath>
  </defs>

  <!-- Background Canvas -->
  <rect width="1200" height="320" rx="16" fill="url(#bgGrad)"/>
  <rect width="1200" height="320" rx="16" fill="url(#grid)"/>

  <!-- Border Frame -->
  <rect width="1198" height="318" x="1" y="1" rx="15" fill="none" stroke="#1E2E25" stroke-width="1.5"/>

  <!-- Ambient Glow Behind Logo -->
  <circle cx="165" cy="160" r="95" fill="#10B981" fill-opacity="0.16" filter="url(#emeraldGlow)"/>

  <!-- Left: Official NEXFIELD Master Logo Card -->
  <g transform="translate(165, 160)">
    <!-- Outer Card Glow Ring -->
    <rect x="-82" y="-82" width="164" height="164" rx="32" ry="32" fill="none" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.4"/>
    <!-- Card Base Shadow -->
    <rect x="-78" y="-78" width="156" height="156" rx="30" ry="30" fill="#111914" stroke="#264030" stroke-width="2"/>

    <!-- Embedded Master Logo with Rounded Clip -->
    <g clip-path="url(#logoClip)">
      <image href="data:image/jpeg;base64,{b64_logo}" x="-76" y="-76" width="152" height="152" preserveAspectRatio="xMidYMid slice"/>
    </g>
  </g>

  <!-- Right: Title, Hierarchy and Subtitle -->
  <g transform="translate(295, 82)">
    <!-- Badge Pill -->
    <rect x="0" y="0" width="228" height="26" rx="13" fill="#0E1A13" stroke="#223C2B" stroke-width="1"/>
    <circle cx="14" cy="13" r="4" fill="#10B981"/>
    <text x="26" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="600" fill="#34D399" letter-spacing="0.5">ADAPPT 5.0 • DOMAIN 2</text>

    <!-- Main Title -->
    <text x="0" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="54" font-weight="900" fill="#F1F6F3" letter-spacing="1.5">NEXFIELD</text>

    <!-- Subtitle / Platform Name -->
    <text x="0" y="116" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="18" font-weight="500" fill="#9FB7A9" letter-spacing="0.4">The Agricultural Intelligence Operating System</text>

    <!-- Mission Tagline -->
    <text x="0" y="150" font-family="'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" font-size="13" font-weight="500" fill="#6EE7B7" letter-spacing="0.8">OBSERVE • PREDICT • SIMULATE • OPTIMIZE • GROW</text>
  </g>

  <!-- Corner Status Indicator -->
  <g transform="translate(1025, 36)">
    <rect x="0" y="0" width="138" height="28" rx="6" fill="#101A14" stroke="#1D3325" stroke-width="1"/>
    <circle cx="16" cy="14" r="4" fill="#10B981"/>
    <text x="28" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#A7F3D0">PRODUCTION v2.4</text>
  </g>
</svg>
'''

with open('docs/assets/branding/nexfield-banner.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print('Updated docs/assets/branding/nexfield-banner.svg with official master logo')
