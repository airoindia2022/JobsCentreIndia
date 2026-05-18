import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';

const pageTitles = {
  '/':        { title: 'Dashboard',   sub: 'Welcome back, Admin' },
  '/users':   { title: 'Users',       sub: 'Manage registered users' },
  '/jobs':    { title: 'Jobs',        sub: 'Manage job listings' },
  '/settings':{ title: 'Settings',    sub: 'Configure admin preferences' },
  '/danger':  { title: 'Danger Zone', sub: 'Irreversible data operations' },
};

const Navbar = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const { title, sub } = pageTitles[pathname] || { title: 'Admin', sub: '' };

  return (
    <header className="navbar">
      <button className="btn-menu-toggle" onClick={onMenuClick} aria-label="Toggle Menu">
        <Menu size={20} />
      </button>

      <div>
        <div className="navbar-title">{title}</div>
        <div className="navbar-subtitle">{sub}</div>
      </div>

      <div className="navbar-right">
        <button
          className="btn btn-ghost btn-icon"
          title="Notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: '#ef4444', border: '1.5px solid #111827'
          }} />
        </button>

        <div className="navbar-avatar" title="Admin">A</div>
      </div>
    </header>
  );
};

export default Navbar;
