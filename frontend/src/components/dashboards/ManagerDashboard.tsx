import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import AnalyticsDashboard from './AnalyticsDashboard';
import { useToast } from '@/context/ToastContext';
import { LayoutList, BarChart3, History, ChevronRight } from 'lucide-react';

export default function ManagerDashboard() {
  const [view, setView] = useState<'LIST' | 'ANALYTICS'>('LIST');
  const [requests, setRequests] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [reqRes, staffRes] = await Promise.all([
        fetchWithAuth('/requests/'),
        fetchWithAuth('/staff/')
      ]);
      
      if (reqRes.ok) setRequests(await reqRes.json());
      if (staffRes.ok) setStaff(await staffRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (requestId: number, staffId: string) => {
    const res = await fetchWithAuth(`/requests/${requestId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ assigned_to: staffId || null }),
    });
    if (res.ok) {
        const updated = await res.json();
        setRequests(requests.map(r => r.id === requestId ? updated : r));
        if (selectedRequest?.id === requestId) setSelectedRequest(updated);
        showToast('Task assignment updated', 'success');
    }
  };

  const handleUpdateStatus = async (requestId: number, status: string) => {
    const res = await fetchWithAuth(`/requests/${requestId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
        const updated = await res.json();
        setRequests(requests.map(r => r.id === requestId ? updated : r));
        if (selectedRequest?.id === requestId) setSelectedRequest(updated);
        showToast(`Status updated to ${status}`, 'info');
    }
  };

  if (loading) return <p>Loading data...</p>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
        <button 
            className={view === 'LIST' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => setView('LIST')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
            <LayoutList size={18} /> Requests 
        </button>
        <button 
            className={view === 'ANALYTICS' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => setView('ANALYTICS')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
            <BarChart3 size={18} /> System Analytics
        </button>
      </div>

      {view === 'ANALYTICS' ? (
        <AnalyticsDashboard />
      ) : (
        <section style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: selectedRequest ? 2 : 1 }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2>All Maintenance Requests</h2>
              <p style={{ opacity: 0.6 }}>Manage and assign tasks to maintenance staff</p>
            </div>

            <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <th style={{ padding: '1rem' }}>Title</th>
                    <th style={{ padding: '1rem' }}>Resident</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Assigned To</th>
                    <th style={{ padding: '1rem' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                    <tr 
                        key={req.id} 
                        style={{ 
                            borderBottom: '1px solid var(--card-border)', 
                            background: selectedRequest?.id === req.id ? 'rgba(109, 93, 252, 0.1)' : 'rgba(255,255,255,0.01)',
                            cursor: 'pointer'
                        }}
                        onClick={() => setSelectedRequest(req)}
                    >
                        <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: '600' }}>{req.title}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{req.location}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>{req.created_by_name}</td>
                        <td style={{ padding: '1rem' }}>
                            <span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span>
                        </td>
                        <td style={{ padding: '1rem' }}>{req.assigned_to_name || 'Unassigned'}</td>
                        <td style={{ padding: '1rem' }}><ChevronRight size={16} opacity={0.3} /></td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>

          {selectedRequest && (
            <div style={{ flex: 1 }} className="animate-fade-in">
                <div className="glass-card" style={{ position: 'sticky', top: '100px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3>Request Detail</h3>
                        <button onClick={() => setSelectedRequest(null)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
                    </div>
                    
                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ opacity: 0.5, fontSize: '0.8rem' }}>Resident</label>
                        <p>{selectedRequest.created_by_name}</p>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ opacity: 0.5, fontSize: '0.8rem' }}>Status</label>
                        <select 
                            value={selectedRequest.status} 
                            onChange={(e) => handleUpdateStatus(selectedRequest.id, e.target.value)}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ opacity: 0.5, fontSize: '0.8rem' }}>Assign To</label>
                        <select 
                            value={selectedRequest.assigned_to || ''} 
                            onChange={(e) => handleAssign(selectedRequest.id, e.target.value)}
                        >
                            <option value="">Unassigned</option>
                            {staff.map(s => (
                            <option key={s.id} value={s.id}>{s.username}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <History size={18} /> Audit Trail
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '1px solid var(--card-border)', paddingLeft: '1rem' }}>
                            {selectedRequest.audit_logs?.map((log: any) => (
                                <div key={log.id} style={{ fontSize: '0.85rem' }}>
                                    <div style={{ color: 'var(--accent)', fontWeight: '600' }}>{log.action}</div>
                                    <div style={{ opacity: 0.7 }}>
                                        {log.previous_value && <span>{log.previous_value} → </span>}
                                        {log.new_value}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>{new Date(log.timestamp).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
