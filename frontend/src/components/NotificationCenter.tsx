'use client';

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { Bell, Check } from 'lucide-react';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const res = await fetchWithAuth('/notifications/');
    if (res.ok) {
      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: number) => {
    await fetchWithAuth(`/notifications/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read: true }),
    });
    fetchNotifications();
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="btn-secondary" 
        style={{ padding: '0.5rem', borderRadius: '50%', position: 'relative' }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', 
            top: -5, 
            right: -5, 
            background: 'var(--error)', 
            color: 'white', 
            borderRadius: '50%', 
            width: '18px', 
            height: '18px', 
            fontSize: '0.7rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="glass-card" style={{ 
          position: 'absolute', 
          right: 0, 
          top: '120%', 
          width: '300px', 
          maxHeight: '400px', 
          overflowY: 'auto', 
          zIndex: 1000,
          padding: '1rem' 
        }}>
          <h4 style={{ marginBottom: '1rem' }}>Notifications</h4>
          {notifications.length === 0 ? (
            <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>No notifications</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {notifications.map(n => (
                <li key={n.id} style={{ 
                  padding: '1rem 0', 
                  borderBottom: '1px solid var(--card-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  opacity: n.is_read ? 0.6 : 1
                }}>
                  <div>
                    <p style={{ fontSize: '0.85rem' }}>{n.message}</p>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{new Date(n.created_at).toLocaleTimeString()}</span>
                  </div>
                  {!n.is_read && (
                    <button onClick={() => markAsRead(n.id)} style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer' }}>
                      <Check size={16} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
