import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { CheckCircle2, Clock, MapPin, Info } from 'lucide-react';

export default function StaffDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchTasks = async () => {
    const res = await fetchWithAuth('/requests/');
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusUpdate = async (taskId: number, status: string) => {
    const res = await fetchWithAuth(`/requests/${taskId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      showToast(`Task status updated to ${status}`, 'success');
      fetchTasks();
    } else {
      showToast('Failed to update task status', 'error');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading assigned tasks...</div>;

  return (
    <section>
      <div style={{ marginBottom: '2rem' }}>
        <h2>My Assigned Tasks</h2>
        <p style={{ opacity: 0.6 }}>Manage your workload and update task progression</p>
      </div>

      {tasks.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', py: '4rem', opacity: 0.5 }}>
            <p>No tasks currently assigned to you.</p>
        </div>
      ) : (
        <div className="dashboard-grid" style={{ padding: 0 }}>
          {tasks.map(task => (
            <div key={task.id} className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>{task.title}</h4>
                <p style={{ fontSize: '0.95rem', opacity: 0.7, marginBottom: '1.5rem', lineHeight: '1.5' }}>{task.description}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
                        <MapPin size={16} color="var(--accent)" />
                        <span>{task.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
                        <Clock size={16} color="var(--accent)" />
                        <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
                {task.status === 'COMPLETED' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: '600', justifyContent: 'center' }}>
                        <CheckCircle2 size={20} /> Task Completed
                    </div>
                ) : (
                    <>
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.5, display: 'block', marginBottom: '0.8rem' }}>Update Progression</label>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button 
                            className={task.status === 'IN_PROGRESS' ? 'btn-primary' : 'btn-secondary'} 
                            style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                            onClick={() => handleStatusUpdate(task.id, 'IN_PROGRESS')}
                            disabled={task.status === 'IN_PROGRESS'}
                        >
                            <Clock size={16} /> In Progress
                        </button>
                        <button 
                            className="btn-primary" 
                            style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'var(--success)', boxShadow: 'none' }}
                            onClick={() => handleStatusUpdate(task.id, 'COMPLETED')}
                        >
                            <CheckCircle2 size={16} /> Complete
                        </button>
                        </div>
                    </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
