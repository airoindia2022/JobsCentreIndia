import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, Briefcase, DollarSign, Clock, LayoutDashboard, LogOut, User, X, FileText, Send, Link2, Globe, Phone, Calendar, MessageSquare, CheckCircle } from 'lucide-react';

const Github = ({ size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

import { Link } from 'react-router-dom';

const SeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [profileData, setProfileData] = useState({
    name: '',
    contact: '',
    experience: '',
    skills: '',
    bio: '',
    resume: '',
    profileImg: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const { user, logout } = useContext(AuthContext);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('https://back.jobscenterindia.com/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const config = {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      };
      const res = await axios.get('https://back.jobscenterindia.com/api/applications/me', config);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      const res = await axios.get('https://back.jobscenterindia.com/api/auth/user', config);
      const data = res.data;
      setProfileData({
        name: data.name || '',
        contact: data.profile?.contact || '',
        experience: data.profile?.experience || '',
        skills: data.profile?.skills ? data.profile.skills.join(', ') : '',
        bio: data.profile?.bio || '',
        resume: data.profile?.resume || '',
        profileImg: data.profile?.profileImg || ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      const payload = {
        ...profileData,
        skills: profileData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      await axios.put('https://back.jobscenterindia.com/api/auth/profile', payload, config);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({...profileData, [field]: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <span>Job Center India</span>
          </Link>
          <button className="mobile-close-sidebar" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <FileText size={20} /> My Applications
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} /> My Profile
          </button>
          <button onClick={logout} className="nav-item logout-btn"><LogOut size={20} /> Logout</button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <LayoutDashboard size={24} />
            </button>
            <div>
              <h1>Welcome, {user?.name}</h1>
              <p>Find your next big opportunity today</p>
            </div>
          </div>
          <div className="user-profile-badge" style={{ backgroundImage: profileData.profileImg ? `url(${profileData.profileImg})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', color: profileData.profileImg ? 'transparent' : 'white' }}>
            {profileData.profileImg ? '' : user?.name?.charAt(0)}
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <section className="search-bar-dashboard">
              <div className="search-input-group">
                <Search size={20} />
                <input type="text" placeholder="Job title or keywords" />
              </div>
              <button className="btn btn-primary">Search</button>
            </section>

            <section className="data-list-new">
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Finding jobs for you...</span>
                </div>
              ) : jobs.length > 0 ? (
                jobs.map(job => (
                  <div key={job._id} className="data-item-card glass-card">
                    <div className="data-item-icon">{job.company.charAt(0)}</div>
                    <div className="data-item-content">
                      <div className="data-item-title">{job.title}</div>
                      <div className="company" style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.25rem' }}>{job.company}</div>
                      <div className="data-item-meta">
                        <span><MapPin size={14} /> {job.location}</span>
                        <span><Briefcase size={14} /> {job.type}</span>
                        <span><DollarSign size={14} /> {job.salary}</span>
                      </div>
                    </div>
                    <div className="data-item-actions">
                      <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">View Details</Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="list-empty">
                  <Briefcase size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                  <p>No jobs available at the moment. Check back later!</p>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'applications' && (
          <section className="data-list-new">
            <h2 style={{ marginBottom: '1.5rem' }}>My Applications</h2>
            {applications.length > 0 ? (
              applications.map(app => (
                <div key={app._id} className="data-item-card glass-card">
                  <div className="data-item-icon">{app.job?.company?.charAt(0)}</div>
                  <div className="data-item-content">
                    <div className="data-item-title">{app.job?.title}</div>
                    <div className="company" style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.25rem' }}>{app.job?.company}</div>
                    <div className="data-item-meta">
                      <span><Clock size={14} /> Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                      <span className={`status-pill ${app.status}`}>{app.status}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="list-empty">
                <FileText size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                <p>You haven't applied for any jobs yet.</p>
                <button onClick={() => setActiveTab('dashboard')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</button>
              </div>
            )}
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="data-list-new">
            <h2 style={{ marginBottom: '1.5rem' }}>My Profile</h2>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <form onSubmit={handleProfileSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name} 
                      onChange={e => setProfileData({...profileData, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Contact Number</label>
                    <input 
                      type="tel" 
                      value={profileData.contact} 
                      onChange={e => setProfileData({...profileData, contact: e.target.value})} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Experience (e.g. 3 Years, Fresher)</label>
                    <input 
                      type="text" 
                      value={profileData.experience} 
                      onChange={e => setProfileData({...profileData, experience: e.target.value})} 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Skills (comma separated)</label>
                    <input 
                      type="text" 
                      value={profileData.skills} 
                      onChange={e => setProfileData({...profileData, skills: e.target.value})} 
                      placeholder="React, Node.js, Design"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Bio / About Me</label>
                  <textarea 
                    value={profileData.bio} 
                    onChange={e => setProfileData({...profileData, bio: e.target.value})} 
                    rows="4"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Profile Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profileImg')} 
                    />
                    {profileData.profileImg && <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)' }}>Image uploaded</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Resume (PDF)</label>
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(e, 'resume')} 
                    />
                    {profileData.resume && <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)' }}>Resume uploaded</div>}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                  {profileLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SeekerDashboard;
