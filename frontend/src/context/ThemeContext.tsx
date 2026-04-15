'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'midnight' | 'aurora' | 'obsidian' | 'rose' | 'ocean';

interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  description: string;
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: 'midnight',
    name: 'Midnight Purple',
    emoji: '🌌',
    description: 'Deep space vibes',
    vars: {
      '--background': '#0a0a0c',
      '--background-2': '#0f0f14',
      '--foreground': '#f0f0f5',
      '--foreground-muted': 'rgba(240,240,245,0.55)',
      '--card-bg': 'rgba(255,255,255,0.030)',
      '--card-border': 'rgba(255,255,255,0.08)',
      '--accent': '#6d5dfc',
      '--accent-2': '#a78bfa',
      '--accent-glow': 'rgba(109,93,252,0.4)',
      '--success': '#00e676',
      '--warning': '#ffb74d',
      '--error': '#ff5252',
      '--pending': '#90a4ae',
      '--in-progress': '#64b5f6',
      '--completed': '#81c784',
      '--gradient-hero': 'linear-gradient(135deg, #0a0a0c 0%, #1a0a2e 50%, #0d0015 100%)',
      '--gradient-accent': 'linear-gradient(90deg, #6d5dfc, #a78bfa)',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    emoji: '🌿',
    description: 'Northern lights palette',
    vars: {
      '--background': '#020f0a',
      '--background-2': '#041a10',
      '--foreground': '#e8f5e9',
      '--foreground-muted': 'rgba(232,245,233,0.55)',
      '--card-bg': 'rgba(0,230,118,0.04)',
      '--card-border': 'rgba(0,230,118,0.12)',
      '--accent': '#00c853',
      '--accent-2': '#69f0ae',
      '--accent-glow': 'rgba(0,200,83,0.35)',
      '--success': '#00e676',
      '--warning': '#ffca28',
      '--error': '#ef5350',
      '--pending': '#80cbc4',
      '--in-progress': '#4dd0e1',
      '--completed': '#69f0ae',
      '--gradient-hero': 'linear-gradient(135deg, #020f0a 0%, #041a10 50%, #020f0a 100%)',
      '--gradient-accent': 'linear-gradient(90deg, #00c853, #69f0ae)',
    },
  },
  {
    id: 'obsidian',
    name: 'Obsidian Gold',
    emoji: '✨',
    description: 'Luxury dark premium',
    vars: {
      '--background': '#080808',
      '--background-2': '#111111',
      '--foreground': '#f5f0e8',
      '--foreground-muted': 'rgba(245,240,232,0.55)',
      '--card-bg': 'rgba(255,215,0,0.03)',
      '--card-border': 'rgba(255,215,0,0.10)',
      '--accent': '#d4a017',
      '--accent-2': '#ffd700',
      '--accent-glow': 'rgba(212,160,23,0.35)',
      '--success': '#66bb6a',
      '--warning': '#ffd54f',
      '--error': '#ef5350',
      '--pending': '#9e9e9e',
      '--in-progress': '#ffd700',
      '--completed': '#66bb6a',
      '--gradient-hero': 'linear-gradient(135deg, #080808 0%, #1a1500 50%, #080808 100%)',
      '--gradient-accent': 'linear-gradient(90deg, #d4a017, #ffd700)',
    },
  },
  {
    id: 'rose',
    name: 'Rose Noir',
    emoji: '🌹',
    description: 'Elegant dark crimson',
    vars: {
      '--background': '#0d0508',
      '--background-2': '#180b10',
      '--foreground': '#fce4ec',
      '--foreground-muted': 'rgba(252,228,236,0.55)',
      '--card-bg': 'rgba(233,30,99,0.04)',
      '--card-border': 'rgba(233,30,99,0.12)',
      '--accent': '#e91e63',
      '--accent-2': '#f48fb1',
      '--accent-glow': 'rgba(233,30,99,0.35)',
      '--success': '#66bb6a',
      '--warning': '#ffb74d',
      '--error': '#ef5350',
      '--pending': '#ce93d8',
      '--in-progress': '#f48fb1',
      '--completed': '#a5d6a7',
      '--gradient-hero': 'linear-gradient(135deg, #0d0508 0%, #1a0a0f 50%, #0d0508 100%)',
      '--gradient-accent': 'linear-gradient(90deg, #e91e63, #f48fb1)',
    },
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    emoji: '🌊',
    description: 'Cool blue depths',
    vars: {
      '--background': '#020b18',
      '--background-2': '#031428',
      '--foreground': '#e3f2fd',
      '--foreground-muted': 'rgba(227,242,253,0.55)',
      '--card-bg': 'rgba(33,150,243,0.05)',
      '--card-border': 'rgba(33,150,243,0.12)',
      '--accent': '#0288d1',
      '--accent-2': '#4fc3f7',
      '--accent-glow': 'rgba(2,136,209,0.35)',
      '--success': '#4caf50',
      '--warning': '#ff9800',
      '--error': '#f44336',
      '--pending': '#90a4ae',
      '--in-progress': '#4fc3f7',
      '--completed': '#81c784',
      '--gradient-hero': 'linear-gradient(135deg, #020b18 0%, #031428 50%, #020b18 100%)',
      '--gradient-accent': 'linear-gradient(90deg, #0288d1, #4fc3f7)',
    },
  },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (id: ThemeId) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('midnight');

  useEffect(() => {
    const saved = localStorage.getItem('dispatchpro-theme') as ThemeId;
    if (saved && THEMES.find(t => t.id === saved)) setThemeId(saved);
  }, []);

  const theme = THEMES.find(t => t.id === themeId)!;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    localStorage.setItem('dispatchpro-theme', themeId);
  }, [themeId, theme]);

  const setTheme = (id: ThemeId) => setThemeId(id);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
