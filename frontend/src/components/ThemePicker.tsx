'use client';

import { useState } from 'react';
import { useTheme, THEMES, ThemeId } from '@/context/ThemeContext';

export default function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        title="Change theme"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          padding: '0.5rem 0.9rem',
          cursor: 'pointer',
          color: 'var(--foreground)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)',
        }}
      >
        <span style={{ fontSize: '1rem' }}>{theme.emoji}</span>
        <span style={{ opacity: 0.8 }}>{theme.name}</span>
        <svg style={{ opacity: 0.5, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="glass-card animate-fade-in"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 0.75rem)',
            width: '260px',
            zIndex: 9999,
            padding: '1rem',
          }}
          onMouseLeave={() => setOpen(false)}
        >
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, marginBottom: '0.8rem' }}>
            Choose Theme
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id as ThemeId); setOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: theme.id === t.id ? '1px solid var(--accent)' : '1px solid transparent',
                  background: theme.id === t.id ? 'var(--card-bg)' : 'transparent',
                  cursor: 'pointer',
                  color: 'var(--foreground)',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Color swatch */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: t.vars['--gradient-accent'],
                  flexShrink: 0,
                  boxShadow: theme.id === t.id ? `0 0 12px ${t.vars['--accent-glow']}` : 'none',
                  transition: 'box-shadow 0.2s',
                }} />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.88rem' }}>{t.emoji} {t.name}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.5 }}>{t.description}</div>
                </div>
                {theme.id === t.id && (
                  <div style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '0.8rem' }}>✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
