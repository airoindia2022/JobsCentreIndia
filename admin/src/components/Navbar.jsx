import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search across dashboard..." />
      </div>
      <div className="nav-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <span className="user-name">Adminstrator</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
