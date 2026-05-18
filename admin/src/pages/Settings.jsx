import React from 'react';
import { Shield, Globe, Bell } from 'lucide-react';

const Settings = () => (
  <div>
    <div className="page-header">
      <div>
        <h1>Settings</h1>
        <p>Admin panel configuration</p>
      </div>
    </div>

    {/* General */}
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="recent-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Globe size={18} style={{ color: 'var(--accent-light)' }} />
          <h3>General</h3>
        </div>
      </div>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
            Application Name
          </label>
          <input
            className="search-input"
            defaultValue="Job Center India"
            style={{ maxWidth: 360 }}
            readOnly
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
            API Base URL
          </label>
          <input
            className="search-input"
            defaultValue="https://back.jobscenterindia.com"
            style={{ maxWidth: 360 }}
            readOnly
          />
        </div>
      </div>
    </div>

    {/* Security */}
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="recent-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={18} style={{ color: 'var(--accent-light)' }} />
          <h3>Security</h3>
        </div>
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{
          background: 'rgba(99,102,241,0.08)', border: '1px solid var(--border-accent)',
          borderRadius: 10, padding: '14px 18px', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6
        }}>
          🔐 Admin authentication is managed server-side via your backend configuration.
          To change admin credentials, update your environment variables and redeploy the server.
        </div>
      </div>
    </div>

    {/* About */}
    <div className="card">
      <div className="recent-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={18} style={{ color: 'var(--accent-light)' }} />
          <h3>About</h3>
        </div>
      </div>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['Platform',  'Job Center India'],
          ['Version',   '1.0.0'],
          ['Built with','React + Vite'],
          ['Backend',   'Node.js + Express + MongoDB'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 16, fontSize: 13.5 }}>
            <span style={{ color: 'var(--text-muted)', width: 120, flexShrink: 0 }}>{k}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Settings;
