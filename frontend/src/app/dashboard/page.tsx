'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ManagerDashboard from '@/components/dashboards/ManagerDashboard';
import StaffDashboard from '@/components/dashboards/StaffDashboard';
import ResidentDashboard from '@/components/dashboards/ResidentDashboard';
import ThemePicker from '@/components/ThemePicker';
import NotificationCenter from '@/components/NotificationCenter';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ 
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--card-border)',
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div>
            <h3 style={{ margin: 0 }}>DispatchPro</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>Welcome back, {user.first_name}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ThemePicker />
            <NotificationCenter />
            <span className="badge badge-pending" style={{ background: 'var(--accent)', color: 'white' }}>{user.role}</span>
            <button onClick={logout} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
        </div>
      </header>

      <main>
        {user.role === 'MANAGER' && <ManagerDashboard />}
        {user.role === 'STAFF' && <StaffDashboard />}
        {user.role === 'RESIDENT' && <ResidentDashboard />}
      </main>
    </div>
  );
}
