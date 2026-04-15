'use client';

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    const res = await fetchWithAuth('/analytics/');
    if (res.ok) {
        setData(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) return <p>Loading analytics...</p>;

  const statusData = Object.entries(data.status_counts).map(([name, value]) => ({ name, value }));
  const priorityData = Object.entries(data.priority_counts).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6d5dfc', '#00e676', '#ffb74d', '#ff5252', '#90a4ae'];

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>System Intelligence</h2>
      
      <div className="dashboard-grid" style={{ padding: 0, marginBottom: '2rem' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1rem', opacity: 0.7 }}>Total Requests</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent)' }}>{data.total_requests}</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1rem', opacity: 0.7 }}>Avg Resolution</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>
            {typeof data.avg_resolution_days === 'number' ? `${data.avg_resolution_days.toFixed(1)}d` : 'N/A'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="glass-card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Requests by Status</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ background: 'var(--background)', border: '1px solid var(--card-border)' }}
                itemStyle={{ color: 'var(--accent)' }}
              />
              <Bar dataKey="value" fill="var(--accent)">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Priority Distribution</h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: 'var(--background)', border: '1px solid var(--card-border)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
