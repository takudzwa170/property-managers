'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ThemePicker from '@/components/ThemePicker';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 0, right: 0, left: 0, zIndex: 10 }}>
          <ThemePicker />
      </header>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '1rem' }}>
        <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
          <h1 style={{ textAlign: 'center' }}>DispatchPro</h1>
          <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.7 }}>Secure Login</p>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          
          {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(109, 93, 252, 0.08)', borderRadius: '12px', border: '1px solid rgba(109, 93, 252, 0.2)', fontSize: '0.8rem' }}>
            <p style={{ fontWeight: '600', marginBottom: '0.8rem', opacity: 0.8 }}>Demo Credentials</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.7, fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>👔 Manager:</span>
                    <span>manager1 / manager123</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🔧 Staff:</span>
                    <span>staff1 / staff123</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🏠 Resident:</span>
                    <span>resident1 / resident123</span>
                </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}
