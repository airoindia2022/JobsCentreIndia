import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Clock, 
  ChevronRight, 
  Globe, 
  Zap, 
  BarChart3, 
  Code2, 
  Headset, 
  Palette,
  CheckCircle2,
  Building2,
  Users,
  Menu,
  X,
  LogOut,
  User,
  FileText,
  Send,
  Link2,
  Phone,
  Calendar,
  MessageSquare,
  GraduationCap,
  Scale,
  Heart,
  Newspaper
} from 'lucide-react';
import './App.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderDashboard from './pages/ProviderDashboard';
import JobDetails from './pages/JobDetails';
import ApplyJob from './pages/ApplyJob';
import SeekerProfile from './pages/SeekerProfile';
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


const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Active Home Section view ('jobs', 'applications')
  const [activeSection, setActiveSection] = useState('jobs');
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.view) {
      setActiveSection(location.state.view);
    }
  }, [location]);

  const featuredJobs = [
    { _id: 'mock1', title: 'Senior Frontend Engineer', company: 'Google', location: 'Bangalore, India', salary: '₹25L - ₹45L', type: 'Full-time', time: '2 hours ago', description: 'Google is hiring a Senior Frontend Engineer to build modern web interfaces.', requirements: ['React', 'JavaScript', 'CSS'] },
    { _id: 'mock2', title: 'Product Designer', company: 'Razorpay', location: 'Remote', salary: '₹18L - ₹30L', type: 'Full-time', time: '5 hours ago', description: 'Razorpay is looking for a Product Designer to design the future of payments.', requirements: ['Figma', 'UI/UX'] },
    { _id: 'mock3', title: 'Backend Developer (Node.js)', company: 'Zomato', location: 'Gurgaon, India', salary: '₹20L - ₹40L', type: 'Full-time', time: '1 day ago', description: 'Zomato is looking for a Backend Developer to build scalable APIs.', requirements: ['Node.js', 'Express', 'MongoDB'] },
    { _id: 'mock4', title: 'Marketing Manager', company: 'Airtel', location: 'New Delhi', salary: '₹15L - ₹25L', type: 'Full-time', time: '3 days ago', description: 'Airtel is hiring a Marketing Manager for digital campaigns.', requirements: ['SEO', 'Marketing'] },
    { _id: 'mock5', title: 'Data Scientist', company: 'Flipkart', location: 'Bangalore, India', salary: '₹22L - ₹42L', type: 'Full-time', time: '4 days ago', description: 'Flipkart is looking for a Data Scientist to build recommendation systems.', requirements: ['Python', 'Machine Learning'] },
    { _id: 'mock6', title: 'Customer Success Lead', company: 'Freshworks', location: 'Chennai, India', salary: '₹12L - ₹20L', type: 'Full-time', time: '1 week ago', description: 'Freshworks is hiring a Customer Success Lead to manage client relationships.', requirements: ['Communication', 'Support'] }
  ];


  const fetchJobs = async () => {
    try {
      const res = await axios.get('https://back.jobscenterindia.com/api/jobs');
      if (res.data && res.data.length > 0) {
        setJobs(res.data);
        setFilteredJobs(res.data);
      } else {
        setJobs(featuredJobs);
        setFilteredJobs(featuredJobs);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobs(featuredJobs);
      setFilteredJobs(featuredJobs);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    if (!user || user.role !== 'seeker') return;
    try {
      const config = {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      };
      const res = await axios.get('https://back.jobscenterindia.com/api/applications/me', config);
      const mockApps = JSON.parse(localStorage.getItem('mock_applications') || '[]');
      setApplications([...mockApps, ...res.data]);
    } catch (err) {
      console.error('Error fetching applications:', err);
      const mockApps = JSON.parse(localStorage.getItem('mock_applications') || '[]');
      setApplications(mockApps);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  useEffect(() => {
    if (user && user.role === 'seeker') {
      fetchMyApplications();
    } else {
      setApplications([]);
    }
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filtered = jobs.filter(job => {
      const matchesKeyword = !searchKeyword || 
        job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.company.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (job.description && job.description.toLowerCase().includes(searchKeyword.toLowerCase()));
      const matchesLocation = !searchLocation || 
        job.location.toLowerCase().includes(searchLocation.toLowerCase());
      return matchesKeyword && matchesLocation;
    });
    setFilteredJobs(filtered);
    
    const jobsSection = document.getElementById('jobs-section');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">


      {activeSection === 'jobs' && (
        <>
          {/* Hero Section */}
          <header className="hero">
            <div className="container">
              <h1 className="hero-title">Find your dream job <br />in India's top companies</h1>
              <p className="hero-subtitle">
                Browse through thousands of high-paying jobs from startups to tech giants. 
                Your next career move starts here.
              </p>
              <form onSubmit={handleSearchSubmit} className="search-box">
                <div className="search-input-group">
                  <Search size={20} color="#64748b" />
                  <input 
                    type="text" 
                    placeholder="Job title, keywords, or company" 
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                  />
                </div>
                <div className="search-input-group">
                  <MapPin size={20} color="#64748b" />
                  <input 
                    type="text" 
                    placeholder="City or state" 
                    value={searchLocation}
                    onChange={e => setSearchLocation(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary search-btn">
                  Search Jobs
                </button>
              </form>
              <div className="hero-features">
                <span className="feature-item"><CheckCircle2 size={16} color="#10b981" /> No hidden fees</span>
                <span className="feature-item"><CheckCircle2 size={16} color="#10b981" /> Verified Employers</span>
                <span className="feature-item"><CheckCircle2 size={16} color="#10b981" /> 10k+ New Jobs Weekly</span>
              </div>
            </div>
          </header>


          {/* Dynamic Jobs Listing Section */}
          <section id="jobs-section" className="section" style={{ backgroundColor: '#f1f5f9' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <div>
                  <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
                    {searchKeyword || searchLocation ? 'Search Results' : 'Available Jobs'}
                  </h2>
                  <p style={{ color: 'var(--text-muted)' }}>
                    {searchKeyword || searchLocation ? `Found ${filteredJobs.length} matching jobs` : 'Premium opportunities matching your skills'}
                  </p>
                </div>
                {(searchKeyword || searchLocation) && (
                  <button 
                    onClick={() => { setSearchKeyword(''); setSearchLocation(''); setFilteredJobs(jobs); }} 
                    className="btn btn-secondary btn-sm"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {loading ? (
                <div className="loading-spinner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0' }}>
                  <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(99,102,241,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <span style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Finding premium jobs...</span>
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="grid grid-3">
                  {filteredJobs.map((job) => (
                    <div key={job._id} className="job-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div className="job-header">
                        <div>
                          <h3 className="job-title" style={{ margin: 0, fontSize: '1.25rem' }}>{job.title}</h3>
                          <p className="company-name" style={{ margin: '0.25rem 0 0', color: 'var(--primary)', fontWeight: 600 }}>{job.company}</p>
                        </div>
                        <div className="company-logo" style={{ 
                          width: '48px', 
                          height: '48px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          background: job.companyLogo ? `url(${job.companyLogo}) center/cover` : 'rgba(99,102,241,0.1)', 
                          borderRadius: '0.5rem', 
                          fontWeight: 'bold', 
                          color: job.companyLogo ? 'transparent' : 'var(--primary)' 
                        }}>
                          {job.companyLogo ? '' : job.company.charAt(0)}
                        </div>
                      </div>
                      <div className="job-meta" style={{ margin: '1rem 0' }}>
                        <div className="job-meta-item"><MapPin size={16} /> {job.location}</div>
                        <div className="job-meta-item"><Briefcase size={16} /> {job.type}</div>
                        <div className="job-meta-item"><IndianRupee size={16} /> {job.salary}</div>
                      </div>
                      {job.description && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {job.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                        <Link 
                          to={`/job/${job._id}`}
                          className="btn btn-primary" 
                          style={{ flex: 1, textAlign: 'center' }}
                        >
                          View Details &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="list-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem' }}>
                  <Briefcase size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>No matching jobs found. Try general keywords or different locations.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}



      {activeSection === 'applications' && (
        <section className="section" style={{ backgroundColor: '#f8fafc', minHeight: '70vh', padding: '4rem 0' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>My Job Applications</h2>
              <button onClick={() => setActiveSection('jobs')} className="btn btn-primary">
                Browse Available Jobs
              </button>
            </div>

            <div className="glass-card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div className="data-list-new" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {applications.length > 0 ? (
                  applications.map(app => (
                    <div key={app._id} className="data-item-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div className="company-logo" style={{ 
                          width: '48px', 
                          height: '48px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          background: app.job?.companyLogo ? `url(${app.job.companyLogo}) center/cover` : 'rgba(99, 102, 241, 0.1)', 
                          borderRadius: '0.75rem', 
                          fontWeight: 'bold', 
                          color: app.job?.companyLogo ? 'transparent' : 'var(--primary)' 
                        }}>
                          {app.job?.companyLogo ? '' : (app.job?.company?.charAt(0) || 'J')}
                        </div>
                        <div>
                          <h3 className="job-title" style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{app.job?.title || 'Job Opportunity'}</h3>
                          <p className="company-name" style={{ margin: '0.25rem 0 0', color: 'var(--primary)', fontWeight: 600 }}>{app.job?.company || 'Company'}</p>
                          <div className="job-meta" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`status-pill ${app.status}`} style={{ display: 'inline-block', padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="list-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1.5rem' }}>
                    <FileText size={48} color="#cbd5e1" style={{ marginBottom: '1.25rem' }} />
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>You haven't applied to any jobs yet.</p>
                    <button onClick={() => setActiveSection('jobs')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Browse Available Jobs</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link to="/" className="footer-logo">Job Center India</Link>
              <p style={{ lineHeight: 1.8 }}>
                The leading job portal in India connecting talent with opportunity. 
                Built for job seekers who value speed, simplicity, and quality.
              </p>
            </div>
            <div>
              <h4 className="footer-title">For Candidates</h4>
              <ul className="footer-links">
                <li><a href="#jobs-section" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveSection('jobs'); setTimeout(() => { const el = document.getElementById('jobs-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); }}>Browse Jobs</a></li>
                <li><Link to="#" className="footer-link">Job Alerts</Link></li>
                <li><Link to="#" className="footer-link">Career Advice</Link></li>
                <li><Link to="#" className="footer-link">Resume Builder</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-title">For Employers</h4>
              <ul className="footer-links">
                <li><Link to="/register" className="footer-link">Post a Job</Link></li>
                <li><Link to="#" className="footer-link">Search Candidates</Link></li>
                <li><Link to="#" className="footer-link">Hiring Solutions</Link></li>
                <li><Link to="#" className="footer-link">Pricing Plans</Link></li>
              </ul>
            </div>
            {/* Our Ecosystem */}
            <div className="footer-ecosystem">
              <h4 className="footer-title">Our Ecosystem</h4>
              <ul className="footer-ecosystem-list">
                <li>
                  <a href="https://airoindia.net" target="_blank" rel="noopener noreferrer" className="footer-ecosystem-link">
                    <span className="footer-eco-icon"><GraduationCap size={16} /></span>
                    <span>Academics</span>
                    <span className="footer-eco-arrow">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.integritylegalcentre.in/" target="_blank" rel="noopener noreferrer" className="footer-ecosystem-link">
                    <span className="footer-eco-icon"><Scale size={16} /></span>
                    <span>Legal</span>
                    <span className="footer-eco-arrow">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://shubhvivah.org.in/" target="_blank" rel="noopener noreferrer" className="footer-ecosystem-link">
                    <span className="footer-eco-icon"><Heart size={16} /></span>
                    <span>Matrimony</span>
                    <span className="footer-eco-arrow">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://bazaarindia.org/" target="_blank" rel="noopener noreferrer" className="footer-ecosystem-link">
                    <span className="footer-eco-icon"><Briefcase size={16} /></span>
                    <span>Business</span>
                    <span className="footer-eco-arrow">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.navnirmanwelfaresociety.in/" target="_blank" rel="noopener noreferrer" className="footer-ecosystem-link">
                    <span className="footer-eco-icon"><Globe size={16} /></span>
                    <span>NGO</span>
                    <span className="footer-eco-arrow">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.hindustanradiance.co.in/" target="_blank" rel="noopener noreferrer" className="footer-ecosystem-link">
                    <span className="footer-eco-icon"><Newspaper size={16} /></span>
                    <span>News</span>
                    <span className="footer-eco-arrow">↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Job Center India Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/apply/:id" element={<ApplyJob />} />
          <Route path="/profile" element={<SeekerProfile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
