import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  LogOut
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Job Center India Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/users" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Users size={20} />
              <span>Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/jobs" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Briefcase size={20} />
              <span>Jobs</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/settings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
