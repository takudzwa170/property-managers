import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { Plus, History, MapPin, Clock, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function ResidentDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchRequests = async () => {
    const res = await fetchWithAuth('/requests/');
    if (res.ok) {
      const data = await res.json();
      setRequests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchWithAuth('/requests/', {
      method: 'POST',
      body: JSON.stringify({ title, description, location, priority }),
    });
    if (res.ok) {
      setTitle('');
      setDescription('');
      setLocation('');
      setShowForm(false);
      showToast('Maintenance request submitted successfully', 'success');
      fetchRequests();
    } else {
      showToast('Failed to submit request. Please try again.', 'error');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
            <h2>My Maintenance Requests</h2>
            <p style={{ opacity: 0.6 }}>Create and track your maintenance tickets</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {showForm ? 'Cancel' : <><Plus size={18} /> New Request</>}
        </button>
      </div>

      {showForm && (
        <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h3>Create New Request</h3>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Provide details about the issue to help our staff resolve it quickly.</p>
          <form onSubmit={handleSubmit}>
            <input placeholder="Short Title (e.g. Leaking Faucet)" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea placeholder="Detailed Description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} />
            <input placeholder="Location (e.g. Unit 402, Master Bath)" value={location} onChange={e => setLocation(e.target.value)} required />
            
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>Priority Level</label>
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="LOW">Low - Not urgent</option>
                    <option value="MEDIUM">Medium - Normal response</option>
                    <option value="HIGH">High - Urgent attention</option>
                    <option value="URGENT">Urgent - Emergency</option>
                </select>
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Request</button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
            <Info size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No requests found. Create one to get started!</p>
        </div>
      ) : (
        <div className="dashboard-grid" style={{ padding: 0 }}>
          {requests.map(req => (
            <div key={req.id} className={`glass-card animate-fade-in ${expandedId === req.id ? 'expanded' : ''}`} style={{ cursor: 'pointer' }} onClick={() => toggleExpand(req.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
                <span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span>
                <span className={`badge badge-${req.priority.toLowerCase()}`}>{req.priority}</span>
              </div>
              
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{req.title}</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1.2rem' }}>{req.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} /> {req.location}
                </div>
                {expandedId === req.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {expandedId === req.id && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                    <div style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                        <div style={{ opacity: 0.5, marginBottom: '0.2rem' }}>Assigned To</div>
                        <div style={{ fontWeight: '600' }}>{req.assigned_to_name || 'Waiting for assignment'}</div>
                    </div>
                    <div style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                        <div style={{ opacity: 0.5, marginBottom: '0.2rem' }}>Submitted</div>
                        <div style={{ fontWeight: '600' }}>{new Date(req.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <History size={16} /> Activity Timeline
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '1px solid var(--card-border)', paddingLeft: '1rem' }}>
                    {req.audit_logs?.map((log: any) => (
                        <div key={log.id} style={{ fontSize: '0.8rem' }}>
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
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
