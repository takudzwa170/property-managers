'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ 
        position: 'fixed', 
        bottom: '2rem', 
        right: '2rem', 
        zIndex: 9999, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem' 
      }}>
        {toasts.map(toast => (
          <div key={toast.id} className="glass-card animate-fade-in" style={{ 
            padding: '1rem 1.5rem', 
            minWidth: '250px',
            background: toast.type === 'success' ? 'color-mix(in srgb, var(--success) 15%, transparent)' : 
                       toast.type === 'error' ? 'color-mix(in srgb, var(--error) 15%, transparent)' : 
                       'color-mix(in srgb, var(--accent) 15%, transparent)',
            borderColor: toast.type === 'success' ? 'var(--success)' : 
                         toast.type === 'error' ? 'var(--error)' : 
                         'var(--accent)',
            backdropFilter: 'blur(20px)',
            color: 'var(--foreground)',
            borderRadius: '12px',
            fontSize: '0.9rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            borderLeftWidth: '4px'
          }}>
            <span style={{ fontSize: '1.2rem', color: toast.type === 'success' ? 'var(--success)' : toast.type === 'error' ? 'var(--error)' : 'var(--accent)' }}>
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '⚠' : 'ℹ'}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
