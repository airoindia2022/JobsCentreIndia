import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, FileText, TrendingUp, ArrowRight, Clock } from 'lucide-react';

const API = 'https://back.jobscenterindia.com/api/admin';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className={`card stat-card ${color}`}>
    <div className="stat-top">
      <div className={`stat-icon ${color}`}>
        <Icon size={22} />
      </div>
    </div>
    <div className="stat-value">{loading ? '—' : (value ?? 0).toLocaleString()}</div>
    <div className="stat-label">{title}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState({ users: [], jobs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/stats`);
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecent(data.recentActivity || { users: [], jobs: [] });
        } else {
          setError('Failed to fetch stats');
        }
      } catch {
        setError('Cannot reach server');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div>
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12, padding: '14px 18px', marginBottom: 24,
          color: '#ef4444', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stat Grid */}
      <div className="stats-grid">
        <StatCard title="Total Users"        value={stats?.totalUsers}        icon={Users}     color="purple" loading={loading} />
        <StatCard title="Total Jobs"         value={stats?.totalJobs}         icon={Briefcase} color="blue"   loading={loading} />
        <StatCard title="Active Jobs"        value={stats?.activeJobs}        icon={TrendingUp} color="green" loading={loading} />
        <StatCard title="Total Applications" value={stats?.totalApplications} icon={FileText}  color="amber"  loading={loading} />
      </div>

      {/* Recent Activity */}
      <div className="dashboard-grid">
        {/* Recent Users */}
        <div className="card">
          <div className="recent-card-header">
            <h3>Recent Users</h3>
            <Link to="/users" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : recent.users.length === 0 ? (
            <div className="empty-state"><p>No users yet</p></div>
          ) : recent.users.map(u => (
            <div key={u._id} className="recent-row">
              <div className="user-avatar">{u.name?.charAt(0).toUpperCase()}</div>
              <div className="recent-row-info">
                <div className="name">{u.name}</div>
                <div className="sub">{u.email}</div>
              </div>
              <span className={`badge ${u.role === 'employer' ? 'badge-blue' : u.role === 'admin' ? 'badge-purple' : 'badge-gray'}`}>
                {u.role}
              </span>
              <span className="recent-row-time">
                <Clock size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                {timeAgo(u.createdAt)}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Jobs */}
        <div className="card">
          <div className="recent-card-header">
            <h3>Recent Jobs</h3>
            <Link to="/jobs" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : recent.jobs.length === 0 ? (
            <div className="empty-state"><p>No jobs yet</p></div>
          ) : recent.jobs.map(j => (
            <div key={j._id} className="recent-row">
              <div className="stat-icon blue" style={{ width: 34, height: 34, borderRadius: 8 }}>
                <Briefcase size={16} />
              </div>
              <div className="recent-row-info">
                <div className="name">{j.title}</div>
                <div className="sub">{j.company}</div>
              </div>
              <span className={`badge ${j.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                {j.status || 'active'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
