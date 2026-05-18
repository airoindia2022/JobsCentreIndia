import React, { useState } from 'react';
import { AlertTriangle, Trash2, Users, Briefcase, Database } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

const API = 'https://back.jobscenterindia.com/api/admin';

const dangerItems = [
  {
    id: 'users',
    icon: <Users size={20} />,
    title: 'Remove All Users',
    desc: 'Permanently delete every registered user account and their applications.',
    label: 'Delete All Users',
    emoji: '👤',
    endpoint: `${API}/users`,
    confirm: 'This will permanently delete ALL users and their applications. This is irreversible.',
  },
  {
    id: 'jobs',
    icon: <Briefcase size={20} />,
    title: 'Remove All Jobs',
    desc: 'Permanently delete every job listing and associated applications.',
    label: 'Delete All Jobs',
    emoji: '💼',
    endpoint: `${API}/jobs`,
    confirm: 'This will permanently delete ALL job listings and their applications. This is irreversible.',
  },
  {
    id: 'all',
    icon: <Database size={20} />,
    title: 'Wipe All Data',
    desc: 'Nuclear option — permanently delete ALL users, jobs, and applications in one shot.',
    label: 'Wipe Everything',
    emoji: '☢️',
    endpoint: `${API}/all-data`,
    confirm: 'This will permanently wipe ALL data from the database — users, jobs, and applications. There is NO going back.',
  },
];

const DangerZone = () => {
  const [modal, setModal]     = useState({ open: false, item: null });
  const { addToast } = useToast();

  const openModal  = (item) => setModal({ open: true, item });
  const closeModal = ()     => setModal({ open: false, item: null });

  const handleConfirm = async () => {
    const { item } = modal;
    try {
      const res  = await fetch(item.endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) addToast(data.message || 'Operation completed', 'success');
      else              addToast(data.message || 'Operation failed', 'error');
    } catch {
      addToast('Server error — could not complete operation', 'error');
    }
    closeModal();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ color: 'var(--accent-red)' }}>Danger Zone</h1>
          <p>Irreversible data operations — proceed with extreme caution</p>
        </div>
      </div>

      {/* Warning banner */}
      <div style={{
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 28,
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <AlertTriangle size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-amber)', marginBottom: 4 }}>
            Caution — Actions below are permanent
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            These operations delete data from the database immediately and cannot be recovered.
            Make sure you have a backup before proceeding.
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <div className="danger-zone-header">
          <AlertTriangle size={18} style={{ color: 'var(--accent-red)' }} />
          <h2>Destructive Operations</h2>
        </div>

        {dangerItems.map((item, i) => (
          <div key={item.id} className="danger-item" style={i === dangerItems.length - 1 ? { borderTop: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.03)' } : {}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: 'rgba(239,68,68,0.12)', color: 'var(--accent-red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <div className="danger-item-info">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => openModal(item)}
              style={{ flexShrink: 0 }}
            >
              <Trash2 size={15} />
              {item.label}
            </button>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={modal.open}
        emoji={modal.item?.emoji}
        title={modal.item?.title}
        message={modal.item?.confirm}
        confirmLabel={modal.item?.label}
        onConfirm={handleConfirm}
        onCancel={closeModal}
        danger
      />
    </div>
  );
};

export default DangerZone;
