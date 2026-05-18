import React, { useState, useEffect } from 'react';
import { Search, Trash2, Users as UsersIcon, RefreshCw } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

const API = 'https://back.jobscenterindia.com/api/admin';

const Users = () => {
  const [users, setUsers]     = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState({ open: false, type: null, target: null });
  const { addToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/users`);
      const data = await res.json();
      if (data.success) { setUsers(data.users); setFiltered(data.users); }
      else addToast('Failed to fetch users', 'error');
    } catch {
      addToast('Cannot reach server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? users.filter(u =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.role?.toLowerCase().includes(q)
          )
        : users
    );
  }, [search, users]);

  const openDeleteOne  = (user) => setModal({ open: true, type: 'one',  target: user });
  const openDeleteAll  = ()     => setModal({ open: true, type: 'all',  target: null });
  const closeModal     = ()     => setModal({ open: false, type: null,  target: null });

  const handleConfirm = async () => {
    if (modal.type === 'one') {
      try {
        const res  = await fetch(`${API}/users/${modal.target._id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setUsers(prev => prev.filter(u => u._id !== modal.target._id));
          addToast(`User "${modal.target.name}" deleted`, 'success');
        } else addToast(data.message || 'Delete failed', 'error');
      } catch { addToast('Server error', 'error'); }
    } else {
      try {
        const res  = await fetch(`${API}/users`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) { setUsers([]); addToast('All users deleted', 'success'); }
        else addToast(data.message || 'Delete failed', 'error');
      } catch { addToast('Server error', 'error'); }
    }
    closeModal();
  };

  const roleColor = (role) => {
    if (role === 'admin')    return 'badge-purple';
    if (role === 'employer') return 'badge-blue';
    return 'badge-gray';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>{users.length} total registered users</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-ghost" onClick={fetchUsers} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Refresh
          </button>
          <button className="btn btn-danger" onClick={openDeleteAll} disabled={users.length === 0}>
            <Trash2 size={15} />
            Remove All Users
          </button>
        </div>
      </div>

      <div className="card">
        {/* Search bar */}
        <div className="table-controls">
          <div className="search-input-wrap">
            <Search size={15} />
            <input
              className="search-input"
              placeholder="Search by name, email or role…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading users…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <UsersIcon size={48} style={{ opacity: 0.3 }} />
            <h3>{search ? 'No results found' : 'No users yet'}</h3>
            <p>{search ? 'Try a different search term' : 'Users will appear here once registered'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="user-avatar">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td><span className={`badge ${roleColor(user.role)}`}>{user.role}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        title="Delete user"
                        onClick={() => openDeleteOne(user)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={modal.open}
        emoji={modal.type === 'all' ? '🗑️' : '❌'}
        title={modal.type === 'all' ? 'Remove ALL Users?' : `Delete "${modal.target?.name}"?`}
        message={
          modal.type === 'all'
            ? `This will permanently delete all ${users.length} users and their applications. This action cannot be undone.`
            : `This will permanently delete this user and all their applications. This action cannot be undone.`
        }
        confirmLabel={modal.type === 'all' ? 'Yes, Delete All' : 'Yes, Delete'}
        onConfirm={handleConfirm}
        onCancel={closeModal}
        danger
      />
    </div>
  );
};

export default Users;
