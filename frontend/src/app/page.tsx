'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <h1 style={{ fontSize: '3rem' }}>DispatchPro</h1>
        <p style={{ opacity: 0.6 }}>Initializing secure connection...</p>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '3px solid var(--card-border)', 
          borderTopColor: 'var(--accent)', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style dangerouslySetInnerHTML={{ __html: `
            @keyframes spin { 
                to { transform: rotate(360deg); } 
            }
        `}} />
    </div>
  );
}
