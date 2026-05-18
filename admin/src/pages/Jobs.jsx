import React, { useState, useEffect } from 'react';
import { Search, Trash2, Briefcase, RefreshCw } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

const API = 'https://back.jobscenterindia.com/api/admin';

const Jobs = () => {
  const [jobs, setJobs]       = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState({ open: false, type: null, target: null });
  const { addToast } = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/jobs`);
      const data = await res.json();
      if (data.success) { setJobs(data.jobs); setFiltered(data.jobs); }
      else addToast('Failed to fetch jobs', 'error');
    } catch {
      addToast('Cannot reach server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? jobs.filter(j =>
            j.title?.toLowerCase().includes(q)    ||
            j.company?.toLowerCase().includes(q)  ||
            j.location?.toLowerCase().includes(q) ||
            j.status?.toLowerCase().includes(q)
          )
        : jobs
    );
  }, [search, jobs]);

  const openDeleteOne  = (job) => setModal({ open: true, type: 'one',  target: job });
  const openDeleteAll  = ()    => setModal({ open: true, type: 'all',  target: null });
  const closeModal     = ()    => setModal({ open: false, type: null,  target: null });

  const handleConfirm = async () => {
    if (modal.type === 'one') {
      try {
        const res  = await fetch(`${API}/jobs/${modal.target._id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setJobs(prev => prev.filter(j => j._id !== modal.target._id));
          addToast(`Job "${modal.target.title}" deleted`, 'success');
        } else addToast(data.message || 'Delete failed', 'error');
      } catch { addToast('Server error', 'error'); }
    } else {
      try {
        const res  = await fetch(`${API}/jobs`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) { setJobs([]); addToast('All jobs deleted', 'success'); }
        else addToast(data.message || 'Delete failed', 'error');
      } catch { addToast('Server error', 'error'); }
    }
    closeModal();
  };

  const statusColor = (status) => {
    if (status === 'active')   return 'badge-green';
    if (status === 'closed')   return 'badge-red';
    if (status === 'paused')   return 'badge-amber';
    return 'badge-gray';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Jobs</h1>
          <p>{jobs.length} total job listings</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-ghost" onClick={fetchJobs} disabled={loading}>
            <RefreshCw size={15} />
            Refresh
          </button>
          <button className="btn btn-danger" onClick={openDeleteAll} disabled={jobs.length === 0}>
            <Trash2 size={15} />
            Remove All Jobs
          </button>
        </div>
      </div>

      <div className="card">
        {/* Search */}
        <div className="table-controls">
          <div className="search-input-wrap">
            <Search size={15} />
            <input
              className="search-input"
              placeholder="Search by title, company, location or status…"
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
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading jobs…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={48} style={{ opacity: 0.3 }} />
            <h3>{search ? 'No results found' : 'No jobs yet'}</h3>
            <p>{search ? 'Try a different search term' : 'Jobs will appear here once posted'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(job => (
                  <tr key={job._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="stat-icon blue" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }}>
                          <Briefcase size={15} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{job.title}</div>
                          {job.salary && (
                            <div style={{ fontSize: 11, color: 'var(--accent-green)' }}>
                              ₹{job.salary}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.company}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.location || '—'}</td>
                    <td>
                      {job.jobType
                        ? <span className="badge badge-blue">{job.jobType}</span>
                        : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td>
                      <span className={`badge ${statusColor(job.status)}`}>
                        {job.status || 'active'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        title="Delete job"
                        onClick={() => openDeleteOne(job)}
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

      <ConfirmModal
        isOpen={modal.open}
        emoji={modal.type === 'all' ? '🗑️' : '❌'}
        title={modal.type === 'all' ? 'Remove ALL Jobs?' : `Delete "${modal.target?.title}"?`}
        message={
          modal.type === 'all'
            ? `This will permanently delete all ${jobs.length} jobs and their applications. This action cannot be undone.`
            : `This will permanently delete this job listing and all related applications. This action cannot be undone.`
        }
        confirmLabel={modal.type === 'all' ? 'Yes, Delete All' : 'Yes, Delete'}
        onConfirm={handleConfirm}
        onCancel={closeModal}
        danger
      />
    </div>
  );
};

export default Jobs;
