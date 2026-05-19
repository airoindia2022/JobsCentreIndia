import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (location.pathname === '/provider-dashboard') {
    return null;
  }

  const handleApplicationsClick = (e) => {
    e.preventDefault();
    navigate('/', { state: { view: 'applications' } });
    setIsMenuOpen(false);
  };

  const handleJobsClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      navigate('/', { state: { view: 'jobs' } });
      setTimeout(() => {
        const el = document.getElementById('jobs-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate('/', { state: { view: 'jobs' } });
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <Zap size={32} fill="currentColor" />
          <span>Job Center India</span>
        </Link>
        
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {user && user.role === 'seeker' && (
            <>
              <a href="#" className="nav-link" onClick={handleJobsClick}>Find Jobs</a>
              <button 
                onClick={handleApplicationsClick} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
              >
                My Applications
              </button>
              <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
            </>
          )}

          {user && user.role === 'provider' && (
            <Link to="/provider-dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Employer Dashboard</Link>
          )}



          {user ? (
            <div className="mobile-auth-btns">
              <button onClick={handleLogout} className="btn btn-secondary btn-block"><LogOut size={16} /> Logout</button>
            </div>
          ) : (
            <div className="mobile-auth-btns">
              <Link to="/login" className="btn btn-secondary btn-block" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-block" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>

        <div className="desktop-auth-btns" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {user ? (
            <>
              {user.role === 'seeker' ? (
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <div 
                    className="user-profile-badge" 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      background: user.profile?.profileImg ? `url(${user.profile.profileImg}) center/cover` : 'var(--primary)', 
                      color: user.profile?.profileImg ? 'transparent' : 'white', 
                      borderRadius: '50%', 
                      fontWeight: 'bold', 
                      fontSize: '1.1rem', 
                      cursor: 'pointer' 
                    }}
                    title={`${user.name} (${user.role === 'seeker' ? 'Candidate' : 'Employer'})`}
                  >
                    {user.profile?.profileImg ? '' : user.name?.charAt(0).toUpperCase()}
                  </div>
                </Link>
              ) : (
                <div 
                  className="user-profile-badge" 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: user.profile?.companyLogo ? `url(${user.profile.companyLogo}) center/cover` : 'var(--primary)', 
                    color: user.profile?.companyLogo ? 'transparent' : 'white', 
                    borderRadius: '50%', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem' 
                  }}
                  title={`${user.name} (${user.role === 'seeker' ? 'Candidate' : 'Employer'})`}
                >
                  {user.profile?.companyLogo ? '' : user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
