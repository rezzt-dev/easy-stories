// CONFIG.JS
// Temas mejorados y nuevos temas. Cada tema define colores y comportamientos visuales del canvas.
window.STYLES = {
  'minimal-white': {
    kind: 'solid',
    background: '#ffffff',
    cardBg: 'rgba(255,255,255,0.86)',
    cardBorder: 'rgba(0,0,0,0.08)',
    cardShadow: 'rgba(0,0,0,0.10)',
    accent: '#10b981',
    accent2: '#0ea5e9',
    textColor: '#111827',
    subtitleColor: '#4b5563',
    customTextColor: '#111827',
    overlayGlow: 'rgba(16,185,129,0.06)',
    pattern: 'none',
    noPattern: true,
    badgeBg: 'rgba(16,185,129,0.10)',
    badgeText: '#065f46',
    progressBg: 'rgba(17,24,39,0.10)',
    progressFill: '#10b981'
  },
  'minimal-black': {
    kind: 'solid',
    background: '#000000',
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(255,255,255,0.18)',
    cardShadow: 'rgba(0,0,0,0.6)',
    accent: '#10b981',
    accent2: '#22d3ee',
    textColor: '#FFFFFF',
    subtitleColor: '#b5b5b5',
    customTextColor: '#ededed',
    overlayGlow: 'rgba(34,211,238,0.12)',
    pattern: 'bars',
    badgeBg: 'rgba(34,211,238,0.12)',
    badgeText: '#99f6e4',
    progressBg: 'rgba(255,255,255,0.16)',
    progressFill: '#22d3ee'
  },
  'macos-white': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#1f2937' },
      { pos: 0.5, color: '#111827' },
      { pos: 1, color: '#0b0f14' }
    ],
    cardBg: 'rgba(255,255,255,0.10)',
    cardBorder: 'rgba(255,255,255,0.22)',
    cardShadow: 'rgba(0,0,0,0.45)',
    accent: '#0ea5e9',
    accent2: '#22d3ee',
    textColor: '#f3f4f6',
    subtitleColor: '#cbd5e1',
    customTextColor: '#e2e8f0',
    overlayGlow: 'rgba(14,165,233,0.14)',
    pattern: 'bokeh',
    badgeBg: 'rgba(14,165,233,0.16)',
    badgeText: '#bae6fd',
    progressBg: 'rgba(255,255,255,0.14)',
    progressFill: '#0ea5e9'
  },
  'macos-black': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#0a0a0a' },
      { pos: 0.6, color: '#121212' },
      { pos: 1, color: '#1a1a1a' }
    ],
    cardBg: 'rgba(255,255,255,0.08)',
    cardBorder: 'rgba(255,255,255,0.16)',
    cardShadow: 'rgba(0,0,0,0.55)',
    accent: '#a78bfa',
    accent2: '#22d3ee',
    textColor: '#ffffff',
    subtitleColor: '#c7c7c7',
    customTextColor: '#e9e9e9',
    overlayGlow: 'rgba(167,139,250,0.14)',
    pattern: 'softGrid',
    badgeBg: 'rgba(167,139,250,0.16)',
    badgeText: '#ddd6fe',
    progressBg: 'rgba(255,255,255,0.16)',
    progressFill: '#a78bfa'
  },
  'rainbow': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#667eea' },
      { pos: 0.25, color: '#764ba2' },
      { pos: 0.5, color: '#f093fb' },
      { pos: 0.75, color: '#4facfe' },
      { pos: 1, color: '#00f2fe' }
    ],
    cardBg: 'rgba(0,0,0,0.35)',
    cardBorder: 'rgba(255,255,255,0.25)',
    cardShadow: 'rgba(0,0,0,0.6)',
    accent: '#ffffff',
    accent2: '#00f2fe',
    textColor: '#ffffff',
    subtitleColor: '#f0f0f0',
    customTextColor: '#ffffff',
    overlayGlow: 'rgba(255,255,255,0.12)',
    pattern: 'bokeh',
    badgeBg: 'rgba(255,255,255,0.18)',
    badgeText: '#ffffff',
    progressBg: 'rgba(255,255,255,0.25)',
    progressFill: '#ffffff'
  },
  'catppuccin': {
    kind: 'solid',
    background: '#1e1e2e',
    cardBg: 'rgba(30,30,46,0.8)',
    cardBorder: 'rgba(205,214,244,0.18)',
    cardShadow: 'rgba(0,0,0,0.45)',
    accent: '#cba6f7',
    accent2: '#94e2d5',
    textColor: '#cdd6f4',
    subtitleColor: '#bac2de',
    customTextColor: '#f5e0dc',
    overlayGlow: 'rgba(203,166,247,0.14)',
    pattern: 'softGrid',
    badgeBg: 'rgba(148,226,213,0.16)',
    badgeText: '#cdd6f4',
    progressBg: 'rgba(205,214,244,0.18)',
    progressFill: '#cba6f7'
  },
  'glass': {
    kind: 'glass',
    background: '#0b0f14',
    glassTop: 'rgba(255,255,255,0.12)',
    glassBottom: 'rgba(255,255,255,0.06)',
    cardBg: 'rgba(255,255,255,0.10)',
    cardBorder: 'rgba(255,255,255,0.22)',
    cardShadow: 'rgba(0,0,0,0.55)',
    accent: '#22d3ee',
    accent2: '#10b981',
    textColor: '#FFFFFF',
    subtitleColor: '#d1d5db',
    customTextColor: '#f9fafb',
    overlayGlow: 'rgba(34,211,238,0.14)',
    pattern: 'softGrid',
    badgeBg: 'rgba(34,211,238,0.16)',
    badgeText: '#a5f3fc',
    progressBg: 'rgba(255,255,255,0.16)',
    progressFill: '#22d3ee'
  },
  'neon-night': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#0f0c29' },
      { pos: 0.5, color: '#302b63' },
      { pos: 1, color: '#24243e' }
    ],
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(255,255,255,0.22)',
    cardShadow: 'rgba(0,0,0,0.6)',
    accent: '#22d3ee',
    accent2: '#a78bfa',
    textColor: '#f8fafc',
    subtitleColor: '#cbd5e1',
    customTextColor: '#e2e8f0',
    overlayGlow: 'rgba(167,139,250,0.18)',
    pattern: 'neonGrid',
    badgeBg: 'rgba(167,139,250,0.2)',
    badgeText: '#ddd6fe',
    progressBg: 'rgba(255,255,255,0.16)',
    progressFill: '#22d3ee'
  },
  'sunset-blur': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#ff9966' },
      { pos: 1, color: '#ff5e62' }
    ],
    cardBg: 'rgba(0,0,0,0.35)',
    cardBorder: 'rgba(255,255,255,0.25)',
    cardShadow: 'rgba(0,0,0,0.55)',
    accent: '#ffffff',
    accent2: '#ffe4e6',
    textColor: '#ffffff',
    subtitleColor: '#fde68a',
    customTextColor: '#ffffff',
    overlayGlow: 'rgba(255,255,255,0.12)',
    pattern: 'bokeh',
    badgeBg: 'rgba(255,255,255,0.2)',
    badgeText: '#ffffff',
    progressBg: 'rgba(255,255,255,0.25)',
    progressFill: '#ffffff'
  },
  'pure-light': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#f9fafb' },
      { pos: 1, color: '#eef2ff' }
    ],
    cardBg: 'rgba(255,255,255,0.92)',
    cardBorder: 'rgba(0,0,0,0.08)',
    cardShadow: 'rgba(0,0,0,0.12)',
    accent: '#2563eb',
    accent2: '#10b981',
    textColor: '#0f172a',
    subtitleColor: '#475569',
    customTextColor: '#0f172a',
    overlayGlow: 'rgba(37,99,235,0.08)',
    pattern: 'none',
    noPattern: true,
    badgeBg: 'rgba(37,99,235,0.10)',
    badgeText: '#1e3a8a',
    progressBg: 'rgba(15,23,42,0.12)',
    progressFill: '#2563eb'
  },
  'macos-light': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#ffffff' },
      { pos: 1, color: '#f5f5f7' }
    ],
    cardBg: 'rgba(255,255,255,0.95)',
    cardBorder: 'rgba(0,0,0,0.06)',
    cardShadow: 'rgba(0,0,0,0.10)',
    accent: '#0ea5e9',
    accent2: '#22d3ee',
    textColor: '#1d1d1f',
    subtitleColor: '#6b7280',
    customTextColor: '#1d1d1f',
    overlayGlow: 'rgba(14,165,233,0.09)',
    pattern: 'none',
    noPattern: true,
    badgeBg: 'rgba(14,165,233,0.12)',
    badgeText: '#075985',
    progressBg: 'rgba(0,0,0,0.10)',
    progressFill: '#0ea5e9'
  },
  'ocean-breeze': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#667eea' },
      { pos: 1, color: '#764ba2' }
    ],
    cardBg: 'rgba(255,255,255,0.08)',
    cardBorder: 'rgba(255,255,255,0.20)',
    cardShadow: 'rgba(0,0,0,0.50)',
    accent: '#60a5fa',
    accent2: '#a78bfa',
    textColor: '#ffffff',
    subtitleColor: '#e0e7ff',
    customTextColor: '#f3f4f6',
    overlayGlow: 'rgba(96,165,250,0.16)',
    pattern: 'softGrid',
    badgeBg: 'rgba(96,165,250,0.18)',
    badgeText: '#dbeafe',
    progressBg: 'rgba(255,255,255,0.18)',
    progressFill: '#60a5fa'
  },
  'forest-green': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#134e4a' },
      { pos: 1, color: '#064e3b' }
    ],
    cardBg: 'rgba(255,255,255,0.09)',
    cardBorder: 'rgba(255,255,255,0.20)',
    cardShadow: 'rgba(0,0,0,0.55)',
    accent: '#10b981',
    accent2: '#34d399',
    textColor: '#ecfdf5',
    subtitleColor: '#d1fae5',
    customTextColor: '#f0fdf4',
    overlayGlow: 'rgba(16,185,129,0.16)',
    pattern: 'bars',
    badgeBg: 'rgba(16,185,129,0.18)',
    badgeText: '#d1fae5',
    progressBg: 'rgba(255,255,255,0.18)',
    progressFill: '#10b981'
  },
  'midnight-purple': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#1e1b4b' },
      { pos: 1, color: '#312e81' }
    ],
    cardBg: 'rgba(255,255,255,0.07)',
    cardBorder: 'rgba(255,255,255,0.18)',
    cardShadow: 'rgba(0,0,0,0.60)',
    accent: '#a78bfa',
    accent2: '#c4b5fd',
    textColor: '#f5f3ff',
    subtitleColor: '#ddd6fe',
    customTextColor: '#ede9fe',
    overlayGlow: 'rgba(167,139,250,0.18)',
    pattern: 'neonGrid',
    badgeBg: 'rgba(167,139,250,0.20)',
    badgeText: '#e9d5ff',
    progressBg: 'rgba(255,255,255,0.16)',
    progressFill: '#a78bfa'
  },
  'cherry-blossom': {
    kind: 'gradient',
    gradientStops: [
      { pos: 0, color: '#fce7f3' },
      { pos: 1, color: '#fbcfe8' }
    ],
    cardBg: 'rgba(255,255,255,0.90)',
    cardBorder: 'rgba(0,0,0,0.06)',
    cardShadow: 'rgba(0,0,0,0.08)',
    accent: '#ec4899',
    accent2: '#f472b6',
    textColor: '#831843',
    subtitleColor: '#9f1239',
    customTextColor: '#881337',
    overlayGlow: 'rgba(236,72,153,0.10)',
    pattern: 'none',
    noPattern: true,
    badgeBg: 'rgba(236,72,153,0.12)',
    badgeText: '#9f1239',
    progressBg: 'rgba(131,24,67,0.12)',
    progressFill: '#ec4899'
  }
};

window.CANVAS_CONFIG = {
  width: 1080,
  height: 1920,
  padding: 80,
  card: {
    x: 140,
    y: 620,
    width: 800,
    height: 680,
    radius: 36,
    borderWidth: 2
  },
  cover: {
    size: 220,
    radius: 24
  },
  avatar: {
    size: 64,
    radius: 32
  },
  progress: {
    width: 620,
    height: 10,
    radius: 6
  }
};