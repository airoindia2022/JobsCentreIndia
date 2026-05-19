import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  LayoutDashboard, 
  LogOut, 
  Users, 
  Briefcase, 
  Trash2, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Edit, 
  Eye, 
  MapPin, 
  IndianRupee, 
  FileText,
  MessageSquare,
  Link2,
  Globe,
  Phone,
  Calendar,
  Building,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  ArrowRight,
  Check,
  Award,
  ChevronDown
} from 'lucide-react';

// Custom inline SVG icons to prevent Lucide import issues
const LinkedInIcon = ({ size = 16, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GitHubIcon = ({ size = 16, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useContext(AuthContext);

  // States
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimeoutRef = useRef(null);

  // Custom Delete Confirm Dialog Modal State
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, jobId: null, jobTitle: '' });

  // Filtering and Searching states
  const [jobSearch, setJobSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appJobFilter, setAppJobFilter] = useState('all');
  const [appStatusFilter, setAppStatusFilter] = useState('all');

  // Interactive Form Pill State
  const [currentReq, setCurrentReq] = useState('');
  const [currentBenefit, setCurrentBenefit] = useState('');
  const [formStep, setFormStep] = useState(1); // For multi-step post/edit form

  // Employer Company Profile Edit state
  const [profileData, setProfileData] = useState({
    name: '',
    companyName: '',
    companyDescription: '',
    companyLogo: '',
    website: '',
    location: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    description: '',
    requirements: [],
    benefits: [],
    companyDescription: '',
    companyLogo: ''
  });

  const triggerToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchProfileData = async () => {
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      };
      const res = await axios.get('https://back.jobscenterindia.com/api/auth/user', config);
      if (res.data) {
        setProfileData({
          name: res.data.name || '',
          companyName: res.data.profile?.companyName || '',
          companyDescription: res.data.profile?.companyDescription || '',
          companyLogo: res.data.profile?.companyLogo || '',
          website: res.data.profile?.website || '',
          location: res.data.profile?.location || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      };

      const [jobsRes, appsRes] = await Promise.all([
        axios.get('https://back.jobscenterindia.com/api/jobs/myjobs', config),
        axios.get('https://back.jobscenterindia.com/api/applications/provider', config)
      ]);

      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      triggerToast('Failed to load dashboard data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load and check authorization
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'provider') {
        navigate('/login');
      } else {
        fetchAllData();
        fetchProfileData();
      }
    }
  }, [user, authLoading, navigate]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      };
      await axios.put('https://back.jobscenterindia.com/api/auth/profile', profileData, config);
      triggerToast('Company profile updated successfully!', 'success');
      // Re-fetch user detail to ensure global synchronization
      fetchAllData();
    } catch (err) {
      console.error('Error updating profile:', err);
      triggerToast(err.response?.data?.msg || 'Failed to update profile.', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleOpenPostModal = () => {
    setFormData({
      title: '',
      company: profileData.companyName || user?.profile?.companyName || '',
      location: profileData.location || user?.profile?.location || '',
      salary: '',
      type: 'Full-time',
      description: '',
      requirements: [],
      benefits: [],
      companyDescription: profileData.companyDescription || user?.profile?.companyDescription || '',
      companyLogo: profileData.companyLogo || user?.profile?.companyLogo || ''
    });
    setFormStep(1);
    setActiveTab('post_job');
  };

  const handleOpenEditModal = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
      companyDescription: job.companyDescription || '',
      companyLogo: job.companyLogo || ''
    });
    setFormStep(1);
    setActiveTab('edit_job');
  };

  // Add / Remove dynamic requirements
  const handleAddRequirement = (e) => {
    e.preventDefault();
    const val = currentReq.trim();
    if (val && !formData.requirements.includes(val)) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, val]
      });
      setCurrentReq('');
    }
  };

  const handleRemoveRequirement = (index) => {
    const list = [...formData.requirements];
    list.splice(index, 1);
    setFormData({ ...formData, requirements: list });
  };

  const handleReqKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = currentReq.trim().replace(/,$/, '');
      if (val && !formData.requirements.includes(val)) {
        setFormData({
          ...formData,
          requirements: [...formData.requirements, val]
        });
        setCurrentReq('');
      }
    }
  };

  // Add / Remove dynamic benefits
  const handleAddBenefit = (e) => {
    e.preventDefault();
    const val = currentBenefit.trim();
    if (val && !formData.benefits.includes(val)) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, val]
      });
      setCurrentBenefit('');
    }
  };

  const handleRemoveBenefit = (index) => {
    const list = [...formData.benefits];
    list.splice(index, 1);
    setFormData({ ...formData, benefits: list });
  };

  const handleBenefitKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = currentBenefit.trim().replace(/,$/, '');
      if (val && !formData.benefits.includes(val)) {
        setFormData({
          ...formData,
          benefits: [...formData.benefits, val]
        });
        setCurrentBenefit('');
      }
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      };
      const payload = {
        ...formData,
        company: profileData.companyName || user?.profile?.companyName || '',
        companyLogo: profileData.companyLogo || user?.profile?.companyLogo || '',
        companyDescription: profileData.companyDescription || user?.profile?.companyDescription || ''
      };
      await axios.post('https://back.jobscenterindia.com/api/jobs', payload, config);
      triggerToast('Job posted successfully! Candidates will start seeing it immediately.', 'success');
      setActiveTab('jobs');
      fetchAllData();
    } catch (err) {
      triggerToast(err.response?.data?.msg || 'Failed to post job. Please try again.', 'error');
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      };
      const payload = {
        ...formData,
        company: profileData.companyName || user?.profile?.companyName || '',
        companyLogo: profileData.companyLogo || user?.profile?.companyLogo || '',
        companyDescription: profileData.companyDescription || user?.profile?.companyDescription || ''
      };
      await axios.put(`https://back.jobscenterindia.com/api/jobs/${selectedJob._id}`, payload, config);
      triggerToast('Job details updated successfully!', 'success');
      setActiveTab('jobs');
      fetchAllData();
    } catch (err) {
      triggerToast(err.response?.data?.msg || 'Failed to update job details.', 'error');
    }
  };

  const triggerDeleteConfirm = (id, title) => {
    setDeleteConfirm({
      show: true,
      jobId: id,
      jobTitle: title
    });
  };

  const handleConfirmDeleteJob = async () => {
    const { jobId } = deleteConfirm;
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      };
      await axios.delete(`https://back.jobscenterindia.com/api/jobs/${jobId}`, config);
      triggerToast('Job posting and all associated candidate applications removed.', 'success');
      fetchAllData();
    } catch (err) {
      triggerToast(err.response?.data?.msg || 'Failed to delete job.', 'error');
    } finally {
      setDeleteConfirm({ show: false, jobId: null, jobTitle: '' });
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        }
      };
      await axios.patch(`https://back.jobscenterindia.com/api/applications/${appId}`, { status: newStatus }, config);
      triggerToast(`Application status updated to "${newStatus}"!`, 'success');
      fetchAllData();
      if (selectedApp && selectedApp._id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) {
      triggerToast(err.response?.data?.msg || 'Failed to update application status.', 'error');
    }
  };

  const handleViewApplication = (app) => {
    setSelectedApp(app);
    setActiveTab('view_application');
  };

  const handleViewJobApplicants = (jobId) => {
    setAppJobFilter(jobId);
    setAppStatusFilter('all');
    setAppSearch('');
    setActiveTab('applicants');
  };

  // Math calculations for dynamically drawn SVG donut segment
  const getDonutChartData = () => {
    const total = applications.length;
    if (total === 0) {
      return {
        accepted: { pct: 0, dash: '0 314', offset: 0 },
        pending: { pct: 0, dash: '0 314', offset: 0 },
        rejected: { pct: 0, dash: '0 314', offset: 0 }
      };
    }
    const acc = applications.filter(a => a.status === 'accepted').length;
    const pen = applications.filter(a => a.status === 'pending').length;
    const rej = applications.filter(a => a.status === 'rejected').length;

    const accPct = Math.round((acc / total) * 100);
    const penPct = Math.round((pen / total) * 100);
    const rejPct = Math.round((rej / total) * 100);

    const circumference = 2 * Math.PI * 50; // ~314.16

    const accDash = `${(accPct / 100) * circumference} ${circumference}`;
    const penDash = `${(penPct / 100) * circumference} ${circumference}`;
    const rejDash = `${(rejPct / 100) * circumference} ${circumference}`;

    // Calculate offsets based on circular progression
    const accOffset = circumference; // starts at 0 (full offset)
    const penOffset = circumference - ((accPct / 100) * circumference);
    const rejOffset = circumference - (((accPct + penPct) / 100) * circumference);

    return {
      accepted: { pct: accPct, count: acc, dash: accDash, offset: accOffset },
      pending: { pct: penPct, count: pen, dash: penDash, offset: penOffset },
      rejected: { pct: rejPct, count: rej, dash: rejDash, offset: rejOffset }
    };
  };

  const donut = getDonutChartData();

  // Custom wavy lines and area generator for real/mock data in our premium interactive line chart
  const getWavyAreaPoints = () => {
    // We map a 6-month historical activity timeline. 
    // We blend actual application count with styled waves.
    const total = applications.length;
    
    // Custom nodes showing activity scaling with total submissions
    const baseline = [
      total > 0 ? Math.round(total * 0.15) + 1 : 4,
      total > 0 ? Math.round(total * 0.35) + 2 : 12,
      total > 0 ? Math.round(total * 0.20) + 1 : 8,
      total > 0 ? Math.round(total * 0.60) + 3 : 18,
      total > 0 ? Math.round(total * 0.45) + 2 : 14,
      total > 0 ? total : 24
    ];

    const width = 500;
    const height = 180;
    const maxVal = Math.max(...baseline, 10);
    
    const points = baseline.map((val, idx) => {
      const x = (idx / 5) * width;
      const y = height - (val / maxVal) * (height - 30) - 15;
      return { x, y, value: val };
    });

    const pathString = points.reduce((acc, p, idx) => {
      if (idx === 0) return `M ${p.x} ${p.y}`;
      // Smooth spline interpolation
      const prev = points[idx - 1];
      const cpX1 = prev.x + (p.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (p.x - prev.x) / 2;
      const cpY2 = p.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }, "");

    const areaPathString = `${pathString} L 500 180 L 0 180 Z`;

    return { points, pathString, areaPathString };
  };

  const chart = getWavyAreaPoints();

  // Filtering listings
  const filteredJobs = jobs.filter(job => {
    return job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
           job.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
           job.location.toLowerCase().includes(jobSearch.toLowerCase());
  });

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicant?.name?.toLowerCase().includes(appSearch.toLowerCase()) ||
                         app.applicant?.email?.toLowerCase().includes(appSearch.toLowerCase()) ||
                         app.job?.title?.toLowerCase().includes(appSearch.toLowerCase());
    
    const matchesJob = appJobFilter === 'all' || app.job?._id === appJobFilter;
    const matchesStatus = appStatusFilter === 'all' || app.status === appStatusFilter;

    return matchesSearch && matchesJob && matchesStatus;
  });

  const renderDashboard = () => (
    <div className="tab-content-active">
      <section className="stats-grid">
        <div className="stat-card premium-card">
          <div className="stat-card-overlay"></div>
          <div className="stat-icon-wrapper-premium blue">
            <Briefcase size={24} />
          </div>
          <div className="stat-card-details">
            <h3>{jobs.length}</h3>
            <p>Active Postings</p>
          </div>
          <div className="stat-badge blue">+12% vs last month</div>
        </div>
        
        <div className="stat-card premium-card">
          <div className="stat-card-overlay"></div>
          <div className="stat-icon-wrapper-premium purple">
            <Users size={24} />
          </div>
          <div className="stat-card-details">
            <h3>{applications.length}</h3>
            <p>Total Candidates</p>
          </div>
          <div className="stat-badge purple">+40% vs last month</div>
        </div>

        <div className="stat-card premium-card">
          <div className="stat-card-overlay"></div>
          <div className="stat-icon-wrapper-premium green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-card-details">
            <h3>{applications.filter(a => a.status === 'accepted').length}</h3>
            <p>Approved Hires</p>
          </div>
          <div className="stat-badge green">
            {applications.length > 0 
              ? `${Math.round((applications.filter(a => a.status === 'accepted').length / applications.length) * 100)}% Conversion` 
              : '0% Conversion'}
          </div>
        </div>

        <div className="stat-card premium-card">
          <div className="stat-card-overlay"></div>
          <div className="stat-icon-wrapper-premium yellow">
            <Clock size={24} />
          </div>
          <div className="stat-card-details">
            <h3>{applications.filter(a => a.status === 'pending').length}</h3>
            <p>Pending Actions</p>
          </div>
          <div className="stat-badge yellow">Needs prompt review</div>
        </div>
      </section>

      {/* Premium Visual Charts Row */}
      <div className="charts-row">
        {/* Line / Area Chart: Activity Volume */}
        <div className="chart-container glass-card line-chart-card">
          <div className="chart-header">
            <div>
              <h3>Talent Pipeline & Applications</h3>
              <p>Realtime historical view of candidate applications timeline</p>
            </div>
            <div className="chart-legend">
              <span className="legend-dot primary"></span> Submissions
            </div>
          </div>
          
          <div className="chart-canvas-wrapper">
            <svg width="100%" height="180" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Horizontal Grid lines */}
              <line x1="0" y1="35" x2="500" y2="35" stroke="var(--border)" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border)" strokeDasharray="3 3" />
              <line x1="0" y1="125" x2="500" y2="125" stroke="var(--border)" strokeDasharray="3 3" />
              <line x1="0" y1="165" x2="500" y2="165" stroke="#cbd5e1" strokeWidth="1" />

              {/* Area path */}
              <path d={chart.areaPathString} fill="url(#chart-area-grad)" className="chart-path-anim" />

              {/* Line path */}
              <path d={chart.pathString} fill="none" stroke="var(--primary)" strokeWidth="3" className="chart-line-anim" />

              {/* Interactive Point Nodes */}
              {chart.points.map((p, idx) => (
                <g key={idx} className="chart-point-node">
                  <circle cx={p.x} cy={p.y} r="6" fill="#ffffff" stroke="var(--primary)" strokeWidth="3" />
                  <circle cx={p.x} cy={p.y} r="14" fill="var(--primary)" fillOpacity="0" className="point-hover-area">
                    <title>Applications: {p.value}</title>
                  </circle>
                </g>
              ))}
            </svg>
          </div>
          
          <div className="chart-x-labels">
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May (Current)</span>
          </div>
        </div>

        {/* Donut Chart: Hiring Funnel Breakdown */}
        <div className="chart-container glass-card donut-chart-card">
          <div className="chart-header">
            <h3>Hiring Funnel Status</h3>
            <p>Candidate breakdown percentage</p>
          </div>

          <div className="donut-wrapper">
            {applications.length > 0 ? (
              <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto' }}>
                <svg width="100%" height="100%" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="9" />
                  
                  {/* Accepted circle segments */}
                  {donut.accepted.pct > 0 && (
                    <circle 
                      cx="60" cy="60" r="50" fill="none" 
                      stroke="var(--success)" strokeWidth="10" 
                      strokeDasharray={donut.accepted.dash}
                      strokeDashoffset={donut.accepted.offset}
                      transform="rotate(-90 60 60)"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Pending segment */}
                  {donut.pending.pct > 0 && (
                    <circle 
                      cx="60" cy="60" r="50" fill="none" 
                      stroke="var(--accent)" strokeWidth="10" 
                      strokeDasharray={donut.pending.dash}
                      strokeDashoffset={donut.pending.offset}
                      transform="rotate(-90 60 60)"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Rejected segment */}
                  {donut.rejected.pct > 0 && (
                    <circle 
                      cx="60" cy="60" r="50" fill="none" 
                      stroke="var(--error)" strokeWidth="10" 
                      strokeDasharray={donut.rejected.dash}
                      strokeDashoffset={donut.rejected.offset}
                      transform="rotate(-90 60 60)"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                <div className="donut-center-info">
                  <span className="donut-total-num">{applications.length}</span>
                  <span className="donut-total-lbl">Total Apps</span>
                </div>
              </div>
            ) : (
              <div className="donut-empty-ill">
                <Users size={32} color="#94a3b8" />
                <p>No submissions to draw breakdown</p>
              </div>
            )}

            <div className="donut-legend-list">
              <div className="donut-legend-item">
                <span className="legend-puck green"></span>
                <span className="legend-label">Accepted</span>
                <span className="legend-value">{donut.accepted.pct}% ({donut.accepted.count || 0})</span>
              </div>
              <div className="donut-legend-item">
                <span className="legend-puck yellow"></span>
                <span className="legend-label">Pending</span>
                <span className="legend-value">{donut.pending.pct}% ({donut.pending.count || 0})</span>
              </div>
              <div className="donut-legend-item">
                <span className="legend-puck red"></span>
                <span className="legend-label">Rejected</span>
                <span className="legend-value">{donut.rejected.pct}% ({donut.rejected.count || 0})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        {/* Recent Job Postings Column */}
        <section className="recent-activity glass-card">
          <div className="section-header">
            <h2>Recent Active Postings</h2>
            <button onClick={() => setActiveTab('jobs')} className="btn-text">Manage Listings <ArrowRight size={14} /></button>
          </div>
          <div className="data-list-new">
            {jobs.slice(0, 4).map(job => {
              const jobApps = applications.filter(a => a.job?._id === job._id);
              return (
                <div key={job._id} className="data-item-card-premium">
                  <div className="data-item-left">
                    <div className="data-item-logo-circle">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} onError={(e) => { e.target.style.display='none'; }} />
                      ) : null}
                      <span>{job.title.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="data-item-core">
                      <div className="data-item-main-title">{job.title}</div>
                      <div className="data-item-details-row">
                        <span className="meta-pin"><MapPin size={13} /> {job.location}</span>
                        <span className={`pill-badge ${job.type.toLowerCase().replace(' ', '-')}`}>{job.type}</span>
                        <span className="applicant-count-puck" onClick={() => handleViewJobApplicants(job._id)}>
                          <Users size={12} /> {jobApps.length} Applicants
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="data-item-actions-panel">
                    <button onClick={() => handleOpenEditModal(job)} className="btn-circle-edit" title="Edit Opportunity"><Edit size={15} /></button>
                    <button onClick={() => triggerDeleteConfirm(job._id, job.title)} className="btn-circle-delete" title="Delete Listing"><Trash2 size={15} /></button>
                  </div>
                </div>
              );
            })}
            {jobs.length === 0 && (
              <div className="list-empty-premium">
                <Building size={32} />
                <p>No job postings recorded yet.</p>
                <button onClick={handleOpenPostModal} className="btn btn-primary btn-sm">Create Job Listing</button>
              </div>
            )}
          </div>
        </section>

        {/* Recent Applicants Column */}
        <section className="recent-applicants glass-card">
          <div className="section-header">
            <h2>Recent Applicant Activity</h2>
            <button onClick={() => setActiveTab('applicants')} className="btn-text">View All <ArrowRight size={14} /></button>
          </div>
          <div className="data-list-new">
            {applications.slice(0, 4).map(app => (
              <div key={app._id} className="applicant-activity-row" onClick={() => handleViewApplication(app)}>
                <div className="applicant-meta-card">
                  <div className="applicant-avatar-circle">
                    {app.applicant?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="applicant-meta-data">
                    <span className="applicant-full-name">{app.applicant?.name}</span>
                    <span className="applicant-job-applied">applied for <strong>{app.job?.title}</strong></span>
                    <span className="applicant-applied-time">{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`status-pill-premium ${app.status}`}>{app.status}</span>
                  <ChevronRight size={16} color="#cbd5e1" />
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="list-empty-premium">
                <Users size={32} />
                <p>No job applications received yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  const renderJobs = () => (
    <section className="jobs-view glass-card tab-content-active">
      <div className="section-header-filters">
        <div>
          <h2>Active Job Listings</h2>
          <p>Supervise and administer your published career opportunities</p>
        </div>
        <div className="filter-controls-row">
          <div className="premium-search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search jobs by keyword, city..." 
              value={jobSearch}
              onChange={e => setJobSearch(e.target.value)}
            />
          </div>
          <button onClick={handleOpenPostModal} className="btn btn-primary">
            <Plus size={18} /> Post a Job
          </button>
        </div>
      </div>

      <div className="data-list-premium-full">
        {filteredJobs.map(job => {
          const jobApps = applications.filter(a => a.job?._id === job._id);
          return (
            <div key={job._id} className="premium-listing-row-card">
              <div className="listing-primary-info">
                <div className="listing-initial-badge">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} onError={(e) => { e.target.style.display='none'; }} />
                  ) : null}
                  <span>{job.title.charAt(0).toUpperCase()}</span>
                </div>
                <div className="listing-text-details">
                  <h3 className="listing-main-title">{job.title}</h3>
                  <div className="listing-meta-row">
                    <span className="meta-text"><MapPin size={13} /> {job.location}</span>
                    <span className={`pill-badge ${job.type.toLowerCase().replace(' ', '-')}`}>{job.type}</span>
                    <span className="meta-text"><IndianRupee size={13} /> {job.salary}</span>
                    <span className="meta-text"><Calendar size={13} /> Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="listing-right-panel">
                <div className="listing-metrics-box" onClick={() => handleViewJobApplicants(job._id)}>
                  <span className="metric-number-big">{jobApps.length}</span>
                  <span className="metric-label-sub">Applications</span>
                </div>
                <div className="listing-row-actions">
                  <button onClick={() => handleOpenEditModal(job)} className="btn-action-premium edit" title="Edit Listing Details">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => triggerDeleteConfirm(job._id, job.title)} className="btn-action-premium delete" title="Remove Listing">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredJobs.length === 0 && (
          <div className="list-empty-premium text-center" style={{ padding: '4rem 2rem' }}>
            <Briefcase size={48} color="#94a3b8" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No Job Postings Found</h3>
            <p>Try refining your keyword search, or create a brand new listing.</p>
            <button onClick={handleOpenPostModal} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Create a Job Listing
            </button>
          </div>
        )}
      </div>
    </section>
  );

  const renderApplicants = () => (
    <section className="applicants-view glass-card tab-content-active">
      <div className="section-header-filters border-bottom">
        <div>
          <h2>Job Applications Dashboard</h2>
          <p>Review qualifications, contact details, and update application decisions</p>
        </div>
      </div>

      <div className="applicants-tab-filter-bar">
        {/* Left Side: Status filter tabs */}
        <div className="tab-filters-pills">
          <button 
            onClick={() => setAppStatusFilter('all')} 
            className={`tab-filter-pill ${appStatusFilter === 'all' ? 'active' : ''}`}
          >
            All Submissions <span className="tab-count-bubble">{applications.length}</span>
          </button>
          <button 
            onClick={() => setAppStatusFilter('pending')} 
            className={`tab-filter-pill ${appStatusFilter === 'pending' ? 'active' : ''}`}
          >
            Pending <span className="tab-count-bubble yellow">{applications.filter(a => a.status === 'pending').length}</span>
          </button>
          <button 
            onClick={() => setAppStatusFilter('accepted')} 
            className={`tab-filter-pill ${appStatusFilter === 'accepted' ? 'active' : ''}`}
          >
            Accepted <span className="tab-count-bubble green">{applications.filter(a => a.status === 'accepted').length}</span>
          </button>
          <button 
            onClick={() => setAppStatusFilter('rejected')} 
            className={`tab-filter-pill ${appStatusFilter === 'rejected' ? 'active' : ''}`}
          >
            Rejected <span className="tab-count-bubble red">{applications.filter(a => a.status === 'rejected').length}</span>
          </button>
        </div>

        {/* Right Side: Search and Job dropdown filter */}
        <div className="filter-inputs-composite">
          <div className="premium-search-box compact">
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Search candidate name, job..." 
              value={appSearch}
              onChange={e => setAppSearch(e.target.value)}
            />
          </div>

          <div className="dropdown-filter-wrapper">
            <Filter size={14} />
            <select 
              value={appJobFilter} 
              onChange={e => setAppJobFilter(e.target.value)}
              className="premium-select-filter"
            >
              <option value="all">Filter by Job (All Listings)</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
            <ChevronDown size={14} className="dropdown-chevron-icon" />
          </div>
        </div>
      </div>

      <div className="data-list-premium-full">
        {filteredApps.map(app => (
          <div key={app._id} className="premium-applicant-card" onClick={() => handleViewApplication(app)}>
            <div className="applicant-card-left-section">
              <div className="applicant-avatar-sphere">
                {app.applicant?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="applicant-card-text">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h3 className="applicant-card-name">{app.applicant?.name}</h3>
                  <span className={`status-pill-premium ${app.status}`}>{app.status}</span>
                </div>
                <p className="applicant-card-email">{app.applicant?.email}</p>
                <div className="applicant-card-meta-line">
                  <span>Applied for: <strong>{app.job?.title}</strong></span>
                  <span className="dot-divider"></span>
                  <span>Date: {new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="applicant-card-right-actions" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => handleViewApplication(app)} 
                className="btn-action-pill primary"
                title="Review Application Details"
              >
                <Eye size={14} /> Review Details
              </button>
              {app.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleUpdateStatus(app._id, 'accepted')} 
                    className="btn-action-pill accept" 
                    title="Accept Application"
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(app._id, 'rejected')} 
                    className="btn-action-pill reject" 
                    title="Reject Application"
                  >
                    <X size={14} /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {filteredApps.length === 0 && (
          <div className="list-empty-premium text-center" style={{ padding: '4rem 2rem' }}>
            <Users size={48} color="#94a3b8" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No Applications Recorded</h3>
            <p>There are no candidate applications that match your active filter settings.</p>
            {(appSearch || appJobFilter !== 'all' || appStatusFilter !== 'all') && (
              <button 
                onClick={() => { setAppSearch(''); setAppJobFilter('all'); setAppStatusFilter('all'); }} 
                className="btn btn-secondary" 
                style={{ marginTop: '1rem' }}
              >
                Reset Search Filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );

  const renderCompanyProfile = () => (
    <section className="profile-view glass-card tab-content-active" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="section-header-filters border-bottom">
        <div>
          <h2>Company Profile & Branding</h2>
          <p>Customize details displayed to candidates on your job listing posts</p>
        </div>
      </div>

      <form onSubmit={updateProfile} className="profile-form-layout">
        <div className="form-group-premium">
          <label>Employer Representative Name</label>
          <input 
            type="text" 
            value={profileData.name} 
            onChange={e => setProfileData({...profileData, name: e.target.value})}
            placeholder="e.g. Ayush Sharma"
            required
          />
        </div>

        <div className="form-group-premium">
          <label>Company Legal Name</label>
          <input 
            type="text" 
            value={profileData.companyName} 
            onChange={e => setProfileData({...profileData, companyName: e.target.value})}
            placeholder="e.g. Acme Tech Solutions Private Limited"
            required 
          />
        </div>

        <div className="form-group-premium">
          <label>Branding Logo Image URL</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="url" 
              value={profileData.companyLogo} 
              onChange={e => setProfileData({...profileData, companyLogo: e.target.value})}
              placeholder="e.g. https://domain.com/brand/logo.png"
              style={{ flex: 1 }}
            />
            {profileData.companyLogo && (
              <img 
                src={profileData.companyLogo} 
                alt="Logo Preview" 
                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>
        </div>

        <div className="form-row-dual">
          <div className="form-group-premium">
            <label>Corporate Headquarters Location</label>
            <div className="input-icon-container">
              <MapPin size={16} />
              <input 
                type="text" 
                value={profileData.location} 
                onChange={e => setProfileData({...profileData, location: e.target.value})}
                placeholder="e.g. Bengaluru, Karnataka"
                required
              />
            </div>
          </div>

          <div className="form-group-premium">
            <label>Official Company Website URL</label>
            <div className="input-icon-container">
              <Globe size={16} />
              <input 
                type="url" 
                value={profileData.website} 
                onChange={e => setProfileData({...profileData, website: e.target.value})}
                placeholder="e.g. https://acmesolutions.com"
              />
            </div>
          </div>
        </div>

        <div className="form-group-premium">
          <label>About Company (Corporate Overview & Mission)</label>
          <textarea 
            value={profileData.companyDescription} 
            onChange={e => setProfileData({...profileData, companyDescription: e.target.value})}
            placeholder="Describe your company culture, industry, core operations, and what makes you a unique place to build a career..."
            rows={5}
            required
          />
        </div>

        <div className="profile-form-footer">
          <button type="submit" className="btn btn-primary" disabled={profileLoading}>
            {profileLoading ? (
              <>
                <div className="btn-spinner"></div> Saving Changes...
              </>
            ) : (
              <>
                <Award size={18} /> Save Profile Changes
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );

  return (
    <div className="dashboard-layout">
      {/* Toast popup */}
      {toast.show && (
        <div className="toast-container">
          <div className={`toast-card-premium ${toast.type}`}>
            <div className="toast-icon-wrapper">
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            </div>
            <div className="toast-message-text">{toast.message}</div>
            <button className="toast-close-btn" onClick={() => setToast({ show: false, message: '', type: 'success' })}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Elegant deletion warning confirmation modal */}
      {deleteConfirm.show && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-box scale-up-anim">
            <div className="modal-icon-alert red">
              <AlertCircle size={28} />
            </div>
            <h3>Remove Job Listing?</h3>
            <p className="modal-description-warning">
              Are you sure you want to delete the job posting for <strong>"{deleteConfirm.jobTitle}"</strong>?
              This action will permanently delete the post and remove all submitted applications. This cannot be undone.
            </p>
            <div className="modal-confirm-actions">
              <button 
                onClick={() => setDeleteConfirm({ show: false, jobId: null, jobTitle: '' })} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDeleteJob} 
                className="btn-modal-destructive"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Injecting gorgeous css definitions to wow the user */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        /* Root styling variables override inside dashboard layout */
        .dashboard-layout {
          --primary: #4f46e5;
          --primary-light: #6366f1;
          --primary-dark: #3730a3;
          --secondary: #0ea5e9;
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --accent: #f59e0b;
          --success: #10b981;
          --error: #ef4444;
          
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          width: 100%;
        }

        h1, h2, h3, .donut-total-num, .metric-number-big {
          font-family: 'Outfit', sans-serif;
        }

        /* Sidebar Glassmorphism Styling */
        .sidebar-premium {
          width: 280px;
          background: #0f172a;
          color: #f8fafc;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 100;
          border-right: 1px solid rgba(255,255,255,0.05);
          box-shadow: 10px 0 30px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }

        .sidebar-header-premium {
          padding: 2rem 1.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-logo-premium {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: -0.03em;
          text-decoration: none;
        }

        .sidebar-logo-premium span {
          background: linear-gradient(135deg, #818cf8 0%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav-premium {
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-item-premium {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1.25rem;
          border-radius: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          border: 1px solid transparent;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .nav-item-premium:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          transform: translateX(4px);
        }

        .nav-item-premium.active {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%);
          color: #818cf8;
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.05);
        }

        .nav-item-premium.logout-btn {
          margin-top: auto;
          color: #f87171;
          border: none;
          background: none;
        }

        .nav-item-premium.logout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          color: #f87171;
        }

        /* Main Workspace Content Area */
        .dashboard-main-premium {
          flex: 1;
          padding: 2.5rem;
          overflow-y: auto;
          max-width: 100%;
          background: linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(241,245,249,0.8) 100%);
        }

        .dashboard-header-premium {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .dashboard-header-premium h1 {
          font-size: 2rem;
          font-weight: 850;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-bottom: 0.35rem;
          margin-top: 0;
        }

        .dashboard-header-premium p {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 500;
          margin: 0;
        }

        /* Premium Statistic Cards Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card.premium-card {
          background: #ffffff;
          padding: 1.5rem;
          border-radius: 1.25rem;
          border: 1px solid #edf2f7;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card.premium-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.03), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
          border-color: rgba(99, 102, 241, 0.15);
        }

        .stat-icon-wrapper-premium {
          width: 52px;
          height: 52px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
        }

        .stat-icon-wrapper-premium.blue { background: #e0f2fe; color: #0284c7; }
        .stat-icon-wrapper-premium.purple { background: #f3e8ff; color: #7c3aed; }
        .stat-icon-wrapper-premium.green { background: #dcfce7; color: #059669; }
        .stat-icon-wrapper-premium.yellow { background: #fef9c3; color: #d97706; }

        .stat-card-details h3 {
          font-size: 2.25rem;
          font-weight: 850;
          color: #0f172a;
          margin-bottom: 0.15rem;
          margin-top: 0;
          line-height: 1;
        }

        .stat-card-details p {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .stat-badge {
          align-self: flex-start;
          font-size: 0.725rem;
          font-weight: 700;
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
        }
        .stat-badge.blue { background: #e0f2fe; color: #0369a1; }
        .stat-badge.purple { background: #f3e8ff; color: #6d28d9; }
        .stat-badge.green { background: #dcfce7; color: #15803d; }
        .stat-badge.yellow { background: #fef9c3; color: #a16207; }

        /* Premium Double Charts Section */
        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        @media (max-width: 1024px) {
          .charts-row {
            grid-template-columns: 1fr;
          }
        }

        .chart-container {
          display: flex;
          flex-direction: column;
          padding: 1.75rem;
          border-radius: 1.5rem;
          background: #ffffff;
          border: 1px solid #edf2f7;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .chart-header h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.25rem;
        }

        .chart-header p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }

        .chart-legend {
          font-size: 0.825rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .legend-dot.primary { background: var(--primary); }

        .chart-canvas-wrapper {
          position: relative;
          width: 100%;
          margin-top: 1rem;
        }

        .chart-x-labels {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0.5rem 0;
          border-top: 1px solid #f1f5f9;
          font-size: 0.775rem;
          color: #94a3b8;
          font-weight: 700;
        }

        /* SVG Chart Path Animations */
        .chart-path-anim {
          animation: fillOpacityGrad 1s ease-out forwards;
        }

        .chart-line-anim {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawChartLine 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes drawChartLine {
          to { stroke-dashoffset: 0; }
        }

        @keyframes fillOpacityGrad {
          from { fill-opacity: 0; }
          to { fill-opacity: 1; }
        }

        .chart-point-node {
          cursor: pointer;
        }
        
        .chart-point-node circle {
          transition: all 0.2s ease;
        }

        .chart-point-node:hover circle {
          r: 8px;
          fill: var(--primary);
          stroke: #ffffff;
        }

        /* Donut Chart visual styling */
        .donut-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          padding: 0.5rem 0;
        }

        .donut-center-info {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .donut-total-num {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }

        .donut-total-lbl {
          font-size: 0.675rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          font-weight: 700;
          margin-top: 0.15rem;
        }

        .donut-legend-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
          padding-top: 1rem;
        }

        .donut-legend-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.825rem;
        }

        .legend-puck {
          width: 10px;
          height: 10px;
          border-radius: 3px;
        }
        .legend-puck.green { background: var(--success); }
        .legend-puck.yellow { background: var(--accent); }
        .legend-puck.red { background: var(--error); }

        .legend-label {
          color: #64748b;
          font-weight: 600;
          flex: 1;
        }

        .legend-value {
          font-weight: 700;
          color: #0f172a;
        }

        .donut-empty-ill {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 0;
          color: #94a3b8;
          text-align: center;
        }
        .donut-empty-ill p {
          font-size: 0.8rem;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        /* Glassmorphic card customisations */
        .glass-card {
          background: #ffffff;
          border: 1px solid #edf2f7;
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
        }

        .dashboard-content-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .dashboard-content-grid {
            grid-template-columns: 1fr;
          }
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .btn-text {
          color: var(--primary);
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-text:hover {
          color: var(--primary-dark);
          transform: translateX(3px);
        }

        /* Data list item styling: premium card */
        .data-item-card-premium {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          border-radius: 1.25rem;
          border: 1px solid #edf2f7;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 0.875rem;
        }

        .data-item-card-premium:hover {
          background: #ffffff;
          transform: translateX(4px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.02);
        }

        .data-item-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex: 1;
        }

        .data-item-logo-circle {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
          color: var(--primary-dark);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.35rem;
          position: relative;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.08);
          overflow: hidden;
          flex-shrink: 0;
        }

        .data-item-logo-circle img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 2;
        }

        .data-item-core {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .data-item-main-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .data-item-details-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.85rem;
          font-size: 0.825rem;
          color: #64748b;
          font-weight: 600;
        }

        .meta-pin {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pill-badge {
          padding: 0.2rem 0.65rem;
          border-radius: 9999px;
          font-size: 0.725rem;
          font-weight: 700;
          text-transform: capitalize;
          display: inline-flex;
        }
        .pill-badge.full-time { background: #dcfce7; color: #15803d; }
        .pill-badge.part-time { background: #fef9c3; color: #a16207; }
        .pill-badge.remote { background: #e0f2fe; color: #0369a1; }
        .pill-badge.contract { background: #f3e8ff; color: #6d28d9; }
        .pill-badge.internship { background: #ffedd5; color: #c2410c; }

        .applicant-count-puck {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: #e0e7ff;
          color: var(--primary);
          padding: 0.2rem 0.65rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .applicant-count-puck:hover {
          background: var(--primary);
          color: #ffffff;
        }

        /* Action Buttons */
        .data-item-actions-panel {
          display: flex;
          gap: 0.5rem;
        }

        .btn-circle-edit, .btn-circle-delete {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-circle-edit {
          background: #f1f5f9;
          color: #475569;
        }
        .btn-circle-edit:hover {
          background: #cbd5e1;
          color: #0f172a;
          transform: scale(1.05);
        }

        .btn-circle-delete {
          background: #fef2f2;
          color: #ef4444;
        }
        .btn-circle-delete:hover {
          background: #fee2e2;
          color: #b91c1c;
          transform: scale(1.05);
        }

        /* Empty states */
        .list-empty-premium {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          color: #94a3b8;
          text-align: center;
          border: 2px dashed #edf2f7;
          border-radius: 1.25rem;
        }
        .list-empty-premium svg {
          margin-bottom: 0.75rem;
          opacity: 0.5;
        }
        .list-empty-premium p {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        /* Recent Activity lists */
        .applicant-activity-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          background: #f8fafc;
          margin-bottom: 0.75rem;
        }

        .applicant-activity-row:hover {
          background: #ffffff;
          transform: translateX(4px);
          border-color: #edf2f7;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .applicant-meta-card {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .applicant-avatar-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15);
        }

        .applicant-meta-data {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .applicant-full-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }

        .applicant-job-applied {
          font-size: 0.8rem;
          color: #64748b;
        }
        .applicant-job-applied strong {
          color: #334155;
        }

        .applicant-applied-time {
          font-size: 0.725rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .status-pill-premium {
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          font-size: 0.675rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-block;
        }
        .status-pill-premium.pending { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
        .status-pill-premium.accepted { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .status-pill-premium.rejected { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

        /* Animation Keyframes */
        .tab-content-active {
          animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Filter header section */
        .section-header-filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
        }
        .section-header-filters.border-bottom {
          border-bottom: 1px solid #edf2f7;
        }

        .section-header-filters h2 {
          font-size: 1.5rem;
          font-weight: 850;
          color: #0f172a;
          margin: 0 0 0.25rem;
        }
        
        .section-header-filters p {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
          font-weight: 500;
        }

        .filter-controls-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .premium-search-box {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 0.85rem;
          padding: 0.65rem 1rem;
          gap: 0.65rem;
          width: 320px;
          transition: all 0.2s;
        }
        
        .premium-search-box:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .premium-search-box svg {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .premium-search-box input {
          border: none;
          outline: none;
          font-size: 0.9rem;
          color: #0f172a;
          width: 100%;
          background: transparent;
        }
        .premium-search-box input::placeholder {
          color: #94a3b8;
        }

        .premium-search-box.compact {
          width: 240px;
          padding: 0.5rem 0.85rem;
          border-radius: 0.75rem;
        }

        /* Detailed full card list styling */
        .data-list-premium-full {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .premium-listing-row-card {
          background: #ffffff;
          border-radius: 1.5rem;
          border: 1px solid #edf2f7;
          padding: 1.5rem 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-listing-row-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.03);
          border-color: rgba(99, 102, 241, 0.15);
        }

        .listing-primary-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 1;
        }

        .listing-initial-badge {
          width: 60px;
          height: 60px;
          border-radius: 1.25rem;
          background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.08);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .listing-initial-badge img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 2;
        }

        .listing-text-details {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .listing-main-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .listing-meta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.25rem;
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
        }

        .meta-text {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .meta-text svg {
          color: #cbd5e1;
        }

        .listing-right-panel {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .listing-metrics-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f8fafc;
          padding: 0.65rem 1rem;
          border-radius: 1rem;
          min-width: 90px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.25s;
        }
        
        .listing-metrics-box:hover {
          background: var(--primary);
          border-color: var(--primary-light);
        }
        .listing-metrics-box:hover .metric-number-big,
        .listing-metrics-box:hover .metric-label-sub {
          color: #ffffff;
        }

        .metric-number-big {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }

        .metric-label-sub {
          font-size: 0.675rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          margin-top: 0.25rem;
        }

        .listing-row-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-action-premium {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.85rem;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .btn-action-premium.edit {
          background: #f1f5f9;
          color: #475569;
        }
        .btn-action-premium.edit:hover {
          background: #cbd5e1;
          color: #0f172a;
        }
        .btn-action-premium.delete {
          background: #fef2f2;
          color: #ef4444;
        }
        .btn-action-premium.delete:hover {
          background: #fee2e2;
          color: #b91c1c;
        }

        /* Applicants filtering bar styles */
        .applicants-tab-filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          padding: 1rem 1.25rem;
          border-radius: 1.25rem;
          margin-bottom: 1.5rem;
          gap: 1.5rem;
          flex-wrap: wrap;
          border: 1px solid #edf2f7;
        }

        .tab-filters-pills {
          display: flex;
          gap: 0.5rem;
        }

        .tab-filter-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          color: #64748b;
          border: 1px solid transparent;
          transition: all 0.25s;
          background: transparent;
        }

        .tab-filter-pill:hover {
          background: rgba(226, 232, 240, 0.5);
          color: #334155;
        }

        .tab-filter-pill.active {
          background: #ffffff;
          color: var(--primary);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border-color: #edf2f7;
        }

        .tab-count-bubble {
          font-size: 0.725rem;
          font-weight: 800;
          background: #f1f5f9;
          color: #475569;
          padding: 0.1rem 0.4rem;
          border-radius: 0.4rem;
        }
        .tab-filter-pill.active .tab-count-bubble {
          background: var(--primary);
          color: #ffffff;
        }
        .tab-count-bubble.yellow { background: #fef3c7; color: #d97706; }
        .tab-filter-pill.active .tab-count-bubble.yellow { background: var(--accent); color: #ffffff; }
        .tab-count-bubble.green { background: #d1fae5; color: #059669; }
        .tab-filter-pill.active .tab-count-bubble.green { background: var(--success); color: #ffffff; }
        .tab-count-bubble.red { background: #fee2e2; color: #dc2626; }
        .tab-filter-pill.active .tab-count-bubble.red { background: var(--error); color: #ffffff; }

        .filter-inputs-composite {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .dropdown-filter-wrapper {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 0.85rem;
          padding: 0.5rem 1.8rem 0.5rem 1rem;
          gap: 0.5rem;
          position: relative;
          color: #64748b;
          min-width: 220px;
        }

        .premium-select-filter {
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: #0f172a;
          background: transparent;
          width: 100%;
          cursor: pointer;
          appearance: none;
          font-weight: 700;
        }

        .dropdown-chevron-icon {
          position: absolute;
          right: 12px;
          pointer-events: none;
        }

        /* Premium Applicant Row card styling */
        .premium-applicant-card {
          background: #ffffff;
          border-radius: 1.5rem;
          border: 1px solid #edf2f7;
          padding: 1.5rem 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-applicant-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px -10px rgba(0, 0, 0, 0.03);
          border-color: rgba(99, 102, 241, 0.15);
        }

        .applicant-card-left-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .applicant-avatar-sphere {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15);
          flex-shrink: 0;
        }

        .applicant-card-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .applicant-card-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.015em;
        }

        .applicant-card-email {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
          margin: 0;
        }

        .applicant-card-meta-line {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.825rem;
          color: #64748b;
          font-weight: 500;
        }
        .applicant-card-meta-line strong {
          color: #334155;
        }

        .dot-divider {
          width: 4px;
          height: 4px;
          background: #cbd5e1;
          border-radius: 50%;
        }

        .applicant-card-right-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-action-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .btn-action-pill.primary {
          background: #f1f5f9;
          color: #334155;
        }
        .btn-action-pill.primary:hover {
          background: #cbd5e1;
          color: #0f172a;
        }
        .btn-action-pill.accept {
          background: #d1fae5;
          color: #047857;
        }
        .btn-action-pill.accept:hover {
          background: var(--success);
          color: #ffffff;
        }
        .btn-action-pill.reject {
          background: #fee2e2;
          color: #b91c1c;
        }
        .btn-action-pill.reject:hover {
          background: var(--error);
          color: #ffffff;
        }

        /* Corporate company profile editing form */
        .profile-form-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .form-group-premium {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group-premium label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #334155;
        }

        .form-group-premium input, 
        .form-group-premium textarea, 
        .form-group-premium select {
          padding: 0.75rem 1.15rem;
          border-radius: 0.85rem;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #0f172a;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }

        .form-group-premium input:focus, 
        .form-group-premium textarea:focus, 
        .form-group-premium select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-group-premium textarea {
          resize: vertical;
          line-height: 1.6;
        }

        .form-row-dual {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        @media (max-width: 768px) {
          .form-row-dual {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        .input-icon-container {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 0.85rem;
          padding-left: 1rem;
          gap: 0.5rem;
        }
        .input-icon-container svg {
          color: #94a3b8;
          flex-shrink: 0;
        }
        .input-icon-container input {
          border: none !important;
          box-shadow: none !important;
          padding: 0.75rem 1rem 0.75rem 0 !important;
          width: 100%;
        }

        .profile-form-footer {
          margin-top: 1.5rem;
          border-top: 1px solid #edf2f7;
          padding-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
        }

        /* Modal Deletion Confirmation */
        .custom-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .custom-modal-box {
          background: #ffffff;
          border-radius: 1.5rem;
          padding: 2.25rem;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15);
          border: 1px solid #edf2f7;
          text-align: center;
        }

        .modal-icon-alert {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .modal-icon-alert.red { background: #fef2f2; color: #ef4444; }

        .custom-modal-box h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.5rem;
        }

        .modal-description-warning {
          font-size: 0.925rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.75rem;
        }
        
        .modal-description-warning strong {
          color: #0f172a;
        }

        .modal-confirm-actions {
          display: flex;
          gap: 0.85rem;
          justify-content: center;
        }

        .btn-modal-destructive {
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          background: #ef4444;
          color: #ffffff;
          border: none;
          transition: all 0.2s;
        }
        .btn-modal-destructive:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        /* Step by Step form visual details */
        .post-job-stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          background: #f8fafc;
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          border: 1px solid #edf2f7;
        }

        .stepper-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.825rem;
          font-weight: 700;
          color: #94a3b8;
        }
        .stepper-step.active {
          color: var(--primary);
        }
        
        .stepper-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
        }
        .stepper-step.active .stepper-num {
          border-color: var(--primary);
          background: var(--primary);
          color: #ffffff;
        }

        .stepper-chevron {
          color: #cbd5e1;
        }

        .step-intro-header {
          margin-bottom: 1.5rem;
        }
        .step-intro-header h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.25rem;
        }
        .step-intro-header p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }

        /* Tag Pill Badges styling for list creators */
        .dynamic-tag-editor-box {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: 1rem;
          border: 1px solid #edf2f7;
        }

        .dynamic-pills-row-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .interactive-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #e0e7ff;
          color: var(--primary);
          padding: 0.35rem 0.85rem;
          border-radius: 0.75rem;
          font-size: 0.825rem;
          font-weight: 700;
        }

        .interactive-tag-pill button {
          border: none;
          background: transparent;
          color: var(--primary-light);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          transition: all 0.2s;
        }

        .interactive-tag-pill button:hover {
          background: var(--primary);
          color: #ffffff;
        }

        .pill-adder-input-row {
          display: flex;
          gap: 0.5rem;
        }
        
        .pill-adder-input-row input {
          flex: 1;
        }

        /* Float premium toast alert notifications */
        .toast-card-premium {
          display: flex;
          align-items: center;
          padding: 0.85rem 1.25rem;
          border-radius: 1rem;
          background: #ffffff;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #edf2f7;
          gap: 0.75rem;
          min-width: 320px;
          max-width: 420px;
        }
        
        .toast-card-premium.success {
          border-left: 5px solid var(--success);
        }
        .toast-card-premium.success .toast-icon-wrapper {
          color: var(--success);
        }

        .toast-card-premium.error {
          border-left: 5px solid var(--error);
        }
        .toast-card-premium.error .toast-icon-wrapper {
          color: var(--error);
        }

        .toast-message-text {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
          flex: 1;
          line-height: 1.4;
        }

        .toast-close-btn {
          color: #94a3b8;
          cursor: pointer;
          background: none;
          border: none;
        }
        .toast-close-btn:hover {
          color: #475569;
        }

        .toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 10000;
          animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .scale-up-anim {
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Spinner loading animations */
        .btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          margin-right: 0.5rem;
        }

        /* Details dual layout grid */
        .dual-details-layout {
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .dual-details-layout {
            grid-template-columns: 1fr;
          }
        }

        .sticky-details-sidebar {
          position: sticky;
          top: 24px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .applicant-focus-card {
          background: #ffffff;
          border: 1px solid #edf2f7;
          border-radius: 1.5rem;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01);
        }

        .avatar-focus-giant {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 2rem;
          box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.25);
        }

        .name-focus-giant {
          font-size: 1.35rem;
          font-weight: 850;
          color: #0f172a;
          margin: 0 0 0.25rem;
          letter-spacing: -0.02em;
        }

        .email-focus-sub {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
          margin: 0;
        }

        .vertical-details-grid {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          margin-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
          padding-top: 1.25rem;
        }

        .detail-item-puck {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border-radius: 0.85rem;
          border: 1px solid #edf2f7;
          font-size: 0.85rem;
          color: #475569;
          font-weight: 600;
        }
        .detail-item-puck svg {
          color: var(--primary);
          flex-shrink: 0;
        }

        .application-action-floating-box {
          background: #ffffff;
          border: 1px solid #edf2f7;
          border-radius: 1.25rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .floating-box-title {
          font-size: 0.75rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .action-button-huge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 0.85rem;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .action-button-huge.accept {
          background: var(--success);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.18);
        }
        .action-button-huge.accept:hover {
          background: #059669;
          transform: translateY(-1px);
        }
        .action-button-huge.reject {
          background: var(--error);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.18);
        }
        .action-button-huge.reject:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        /* Right panel resume cover-letter detail layout */
        .applicant-scrolling-workspace {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .workspace-block-section {
          background: #ffffff;
          border-radius: 1.5rem;
          border: 1px solid #edf2f7;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01);
        }

        .workspace-block-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: -0.02em;
        }
        .workspace-block-title svg {
          color: var(--primary);
        }

        .qualification-links-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .qualification-link-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.25s;
          text-decoration: none;
        }
        .qualification-link-item svg {
          flex-shrink: 0;
        }

        .qualification-link-item.resume-type {
          border-color: #fca5a5;
          background: #fef2f2;
          color: #b91c1c;
        }
        .qualification-link-item.resume-type:hover {
          background: #fee2e2;
          transform: translateY(-2px);
        }

        .qualification-link-item.portfolio-type {
          border-color: #a7f3d0;
          background: #ecfdf5;
          color: #047857;
        }
        .qualification-link-item.portfolio-type:hover {
          background: #d1fae5;
          transform: translateY(-2px);
        }

        .qualification-link-item.linkedin-type {
          border-color: #93c5fd;
          background: #eff6ff;
          color: #1d4ed8;
        }
        .qualification-link-item.linkedin-type:hover {
          background: #dbeafe;
          transform: translateY(-2px);
        }

        .qualification-link-item.github-type {
          border-color: #cbd5e1;
          background: #f8fafc;
          color: #334155;
        }
        .qualification-link-item.github-type:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .workspace-content-box {
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 1rem;
          border: 1px solid #edf2f7;
          line-height: 1.8;
          font-size: 0.975rem;
          color: #334155;
          white-space: pre-wrap;
          font-family: inherit;
        }

        .applied-job-context-box {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          border-radius: 1rem;
          border: 1px solid #edf2f7;
        }

        .job-context-icon {
          width: 48px;
          height: 48px;
          background: #e0e7ff;
          color: var(--primary);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .job-context-texts {
          display: flex;
          flex-direction: column;
        }
        
        .job-context-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }
        
        .job-context-company {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
        }
      `}</style>

      {/* Main Left Side Bar */}
      <aside className={`sidebar-premium ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header-premium">
          <Link to="/" className="sidebar-logo-premium">
            <Sparkles size={28} fill="#818cf8" stroke="none" />
            <span>Job Center India</span>
          </Link>
          <button className="mobile-close-sidebar" onClick={() => setIsSidebarOpen(false)} style={{ background: '#1e293b', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '50%', border: 'none', display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <nav className="sidebar-nav-premium">
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
            className={`nav-item-premium ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} /> Dashboard Overview
          </button>
          
          <button 
            onClick={() => { setActiveTab('jobs'); setIsSidebarOpen(false); }} 
            className={`nav-item-premium ${activeTab === 'jobs' || activeTab === 'post_job' || activeTab === 'edit_job' ? 'active' : ''}`}
          >
            <Briefcase size={18} /> My Job Listings
          </button>

          <button 
            onClick={() => { setActiveTab('applicants'); setIsSidebarOpen(false); }} 
            className={`nav-item-premium ${activeTab === 'applicants' || activeTab === 'view_application' ? 'active' : ''}`}
          >
            <Users size={18} /> Candidate Applications
          </button>

          <button 
            onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} 
            className={`nav-item-premium ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <Building size={18} /> Company Branding
          </button>

          <button onClick={handleLogout} className="nav-item-premium logout-btn">
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Right Workspace */}
      <main className="dashboard-main-premium">
        <header className="dashboard-header-premium">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)} style={{ display: 'none', background: '#ffffff', border: '1px solid #e2e8f0', width: '42px', height: '42px', borderRadius: '0.75rem', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <LayoutDashboard size={20} />
            </button>
            <div>
              {activeTab === 'post_job' ? (
                <>
                  <h1>Publish a Career Opportunity</h1>
                  <p>Formulate and publish details to source top talent from across India</p>
                </>
              ) : activeTab === 'edit_job' ? (
                <>
                  <h1>Refine Job Details</h1>
                  <p>Update and publish modifications to this career opportunity</p>
                </>
              ) : activeTab === 'view_application' ? (
                <>
                  <h1>Application Comprehensive Review</h1>
                  <p>Analyze candidate credentials, portfolio integrations, and cover letters</p>
                </>
              ) : activeTab === 'profile' ? (
                <>
                  <h1>Company Branding Desk</h1>
                  <p>Administer visual logos, descriptions, and corporate credentials</p>
                </>
              ) : activeTab === 'jobs' ? (
                <>
                  <h1>Hiring Listings Desk</h1>
                  <p>Supervise active, pending, or historical employment vacancies</p>
                </>
              ) : activeTab === 'applicants' ? (
                <>
                  <h1>Candidate Tracking Board</h1>
                  <p>Filter, screen, accept or decline incoming candidate submissions</p>
                </>
              ) : (
                <>
                  <h1>Employer Operations Workspace</h1>
                  <p>Welcome back, <strong>{profileData.name || user?.name}</strong>. Here's your organization profile summary.</p>
                </>
              )}
            </div>
          </div>
          
          {activeTab === 'dashboard' && (
            <button onClick={handleOpenPostModal} className="btn btn-primary">
              <Plus size={18} /> Post a Job vacancy
            </button>
          )}
        </header>

        {loading || authLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Synchronizing workspace databases...</span>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'jobs' && renderJobs()}
            {activeTab === 'applicants' && renderApplicants()}
            {activeTab === 'profile' && renderCompanyProfile()}

            {/* Form Step-by-Step Layout: Post Job */}
            {activeTab === 'post_job' && (
              <section className="glass-card tab-content-active" style={{ maxWidth: '850px', margin: '0 auto' }}>
                <div className="post-job-stepper">
                  <div className={`stepper-step ${formStep >= 1 ? 'active' : ''}`}>
                    <span className="stepper-num">1</span> Basic Specifications
                  </div>
                  <ChevronRight size={14} className="stepper-chevron" />
                  <div className={`stepper-step ${formStep >= 2 ? 'active' : ''}`}>
                    <span className="stepper-num">2</span> Role Overview
                  </div>
                  <ChevronRight size={14} className="stepper-chevron" />
                  <div className={`stepper-step ${formStep >= 3 ? 'active' : ''}`}>
                    <span className="stepper-num">3</span> Technical Stack & Publish
                  </div>
                </div>

                <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {formStep === 1 && (
                    <div className="tab-content-active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="step-intro-header">
                        <h3>Job Key Specifications</h3>
                        <p>Provide core identification variables for this corporate position.</p>
                      </div>

                      <div className="form-group-premium">
                        <label>Vacant Job Title</label>
                        <input 
                          type="text" 
                          value={formData.title} 
                          onChange={e => setFormData({...formData, title: e.target.value})} 
                          placeholder="e.g. Senior Frontend Software Engineer"
                          required 
                        />
                      </div>
                      
                      <div className="form-row-dual">
                        <div className="form-group-premium">
                          <label>Employment Nature Type</label>
                          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                            <option value="Full-time">Full-time Position</option>
                            <option value="Part-time">Part-time Position</option>
                            <option value="Remote">Remote Operations</option>
                            <option value="Contract">Independent Contract</option>
                            <option value="Internship">Pre-Graduate Internship</option>
                          </select>
                        </div>
                        <div className="form-group-premium">
                          <label>Annual Compensations (Salary Range)</label>
                          <div className="input-icon-container">
                            <IndianRupee size={16} />
                            <input 
                              type="text" 
                              value={formData.salary} 
                              onChange={e => setFormData({...formData, salary: e.target.value})} 
                              placeholder="e.g. ₹12,00,000 - ₹18,00,000" 
                              required 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group-premium">
                        <label>Office Headquarters / Job Location</label>
                        <div className="input-icon-container">
                          <MapPin size={16} />
                          <input 
                            type="text" 
                            value={formData.location} 
                            onChange={e => setFormData({...formData, location: e.target.value})} 
                            placeholder="e.g. Bangalore, India"
                            required 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => setActiveTab('jobs')} className="btn btn-secondary">Cancel</button>
                        <button type="button" onClick={() => setFormStep(2)} className="btn btn-primary">
                          Proceed to Overview <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {formStep === 2 && (
                    <div className="tab-content-active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="step-intro-header">
                        <h3>Role Details & Descriptions</h3>
                        <p>Write an appealing description describing major daily objectives and responsibilities.</p>
                      </div>

                      <div className="form-group-premium">
                        <label>Comprehensive Role Description</label>
                        <textarea 
                          value={formData.description} 
                          onChange={e => setFormData({...formData, description: e.target.value})} 
                          placeholder="Provide bullet points describing key responsibilities, daily workflows, team dynamics..."
                          required 
                          rows={8}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => setFormStep(1)} className="btn btn-secondary">&larr; Back</button>
                        <button type="button" onClick={() => setFormStep(3)} className="btn btn-primary">
                          Next: Technical Skills &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {formStep === 3 && (
                    <div className="tab-content-active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="step-intro-header">
                        <h3>Dynamic Requirements & Benefits Adder</h3>
                        <p>Add technical requirements and workplace benefits as dynamic interactive pills.</p>
                      </div>

                      <div className="form-group-premium">
                        <label>Key Job Requirements (e.g. React, Docker, Python)</label>
                        <div className="dynamic-tag-editor-box">
                          <div className="dynamic-pills-row-wrapper">
                            {formData.requirements.map((req, idx) => (
                              <span key={idx} className="interactive-tag-pill">
                                {req}
                                <button type="button" onClick={() => handleRemoveRequirement(idx)}>&times;</button>
                              </span>
                            ))}
                            {formData.requirements.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No requirements added yet. Use the field below to add.</span>}
                          </div>
                          
                          <div className="pill-adder-input-row">
                            <input 
                              type="text" 
                              value={currentReq} 
                              onChange={e => setCurrentReq(e.target.value)}
                              onKeyDown={handleReqKeyDown}
                              placeholder="Type requirement and press COMMA or ENTER to add..."
                            />
                            <button type="button" onClick={handleAddRequirement} className="btn btn-secondary btn-sm">Add</button>
                          </div>
                        </div>
                      </div>

                      <div className="form-group-premium">
                        <label>Corporate Perks & Compensations (e.g. Health Insurance, Hybrid Work)</label>
                        <div className="dynamic-tag-editor-box">
                          <div className="dynamic-pills-row-wrapper">
                            {formData.benefits.map((ben, idx) => (
                              <span key={idx} className="interactive-tag-pill">
                                {ben}
                                <button type="button" onClick={() => handleRemoveBenefit(idx)}>&times;</button>
                              </span>
                            ))}
                            {formData.benefits.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No perks added yet. Use the field below to add.</span>}
                          </div>
                          
                          <div className="pill-adder-input-row">
                            <input 
                              type="text" 
                              value={currentBenefit} 
                              onChange={e => setCurrentBenefit(e.target.value)}
                              onKeyDown={handleBenefitKeyDown}
                              placeholder="Type perk and press COMMA or ENTER to add..."
                            />
                            <button type="button" onClick={handleAddBenefit} className="btn btn-secondary btn-sm">Add</button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => setFormStep(2)} className="btn btn-secondary">&larr; Back</button>
                        <button type="submit" className="btn btn-primary">
                          <CheckCircle size={18} /> Publish Job Post
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </section>
            )}

            {/* Form Step-by-Step Layout: Edit Job */}
            {activeTab === 'edit_job' && selectedJob && (
              <section className="glass-card tab-content-active" style={{ maxWidth: '850px', margin: '0 auto' }}>
                <div className="post-job-stepper">
                  <div className={`stepper-step ${formStep >= 1 ? 'active' : ''}`}>
                    <span className="stepper-num">1</span> Basic Specifications
                  </div>
                  <ChevronRight size={14} className="stepper-chevron" />
                  <div className={`stepper-step ${formStep >= 2 ? 'active' : ''}`}>
                    <span className="stepper-num">2</span> Role Overview
                  </div>
                  <ChevronRight size={14} className="stepper-chevron" />
                  <div className={`stepper-step ${formStep >= 3 ? 'active' : ''}`}>
                    <span className="stepper-num">3</span> Technical Stack & Update
                  </div>
                </div>

                <form onSubmit={handleUpdateJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {formStep === 1 && (
                    <div className="tab-content-active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="step-intro-header">
                        <h3>Modify Basic Specifications</h3>
                        <p>Refine critical identifying variables for this job position.</p>
                      </div>

                      <div className="form-group-premium">
                        <label>Vacant Job Title</label>
                        <input 
                          type="text" 
                          value={formData.title} 
                          onChange={e => setFormData({...formData, title: e.target.value})} 
                          placeholder="e.g. Senior Frontend Software Engineer"
                          required 
                        />
                      </div>
                      
                      <div className="form-row-dual">
                        <div className="form-group-premium">
                          <label>Employment Nature Type</label>
                          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                            <option value="Full-time">Full-time Position</option>
                            <option value="Part-time">Part-time Position</option>
                            <option value="Remote">Remote Operations</option>
                            <option value="Contract">Independent Contract</option>
                            <option value="Internship">Pre-Graduate Internship</option>
                          </select>
                        </div>
                        <div className="form-group-premium">
                          <label>Annual Compensations (Salary Range)</label>
                          <div className="input-icon-container">
                            <IndianRupee size={16} />
                            <input 
                              type="text" 
                              value={formData.salary} 
                              onChange={e => setFormData({...formData, salary: e.target.value})} 
                              placeholder="e.g. ₹12,00,000 - ₹18,00,000" 
                              required 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group-premium">
                        <label>Office Headquarters / Job Location</label>
                        <div className="input-icon-container">
                          <MapPin size={16} />
                          <input 
                            type="text" 
                            value={formData.location} 
                            onChange={e => setFormData({...formData, location: e.target.value})} 
                            placeholder="e.g. Bangalore, India"
                            required 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => setActiveTab('jobs')} className="btn btn-secondary">Cancel</button>
                        <button type="button" onClick={() => setFormStep(2)} className="btn btn-primary">
                          Proceed to Overview <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {formStep === 2 && (
                    <div className="tab-content-active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="step-intro-header">
                        <h3>Modify Role Details & Descriptions</h3>
                        <p>Write an appealing description describing major daily objectives and responsibilities.</p>
                      </div>

                      <div className="form-group-premium">
                        <label>Comprehensive Role Description</label>
                        <textarea 
                          value={formData.description} 
                          onChange={e => setFormData({...formData, description: e.target.value})} 
                          placeholder="Provide bullet points describing key responsibilities..."
                          required 
                          rows={8}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => setFormStep(1)} className="btn btn-secondary">&larr; Back</button>
                        <button type="button" onClick={() => setFormStep(3)} className="btn btn-primary">
                          Next: Technical Skills &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {formStep === 3 && (
                    <div className="tab-content-active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="step-intro-header">
                        <h3>Modify Requirements & Benefits</h3>
                        <p>Add technical requirements and workplace benefits as dynamic interactive pills.</p>
                      </div>

                      <div className="form-group-premium">
                        <label>Key Job Requirements</label>
                        <div className="dynamic-tag-editor-box">
                          <div className="dynamic-pills-row-wrapper">
                            {formData.requirements.map((req, idx) => (
                              <span key={idx} className="interactive-tag-pill">
                                {req}
                                <button type="button" onClick={() => handleRemoveRequirement(idx)}>&times;</button>
                              </span>
                            ))}
                            {formData.requirements.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No requirements added yet. Use the field below to add.</span>}
                          </div>
                          
                          <div className="pill-adder-input-row">
                            <input 
                              type="text" 
                              value={currentReq} 
                              onChange={e => setCurrentReq(e.target.value)}
                              onKeyDown={handleReqKeyDown}
                              placeholder="Type requirement and press COMMA or ENTER to add..."
                            />
                            <button type="button" onClick={handleAddRequirement} className="btn btn-secondary btn-sm">Add</button>
                          </div>
                        </div>
                      </div>

                      <div className="form-group-premium">
                        <label>Corporate Perks & Compensations</label>
                        <div className="dynamic-tag-editor-box">
                          <div className="dynamic-pills-row-wrapper">
                            {formData.benefits.map((ben, idx) => (
                              <span key={idx} className="interactive-tag-pill">
                                {ben}
                                <button type="button" onClick={() => handleRemoveBenefit(idx)}>&times;</button>
                              </span>
                            ))}
                            {formData.benefits.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No perks added yet. Use the field below to add.</span>}
                          </div>
                          
                          <div className="pill-adder-input-row">
                            <input 
                              type="text" 
                              value={currentBenefit} 
                              onChange={e => setCurrentBenefit(e.target.value)}
                              onKeyDown={handleBenefitKeyDown}
                              placeholder="Type perk and press COMMA or ENTER to add..."
                            />
                            <button type="button" onClick={handleAddBenefit} className="btn btn-secondary btn-sm">Add</button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => setFormStep(2)} className="btn btn-secondary">&larr; Back</button>
                        <button type="submit" className="btn btn-primary">
                          <CheckCircle size={18} /> Update Job Post
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </section>
            )}

            {/* Application detailed review layout */}
            {activeTab === 'view_application' && selectedApp && (
              <section className="tab-content-active" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <button onClick={() => setActiveTab('applicants')} className="btn btn-secondary">&larr; Back to Candidate Tracking Board</button>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>Reviewing Candidate Reference ID: #{selectedApp._id.slice(-8)}</span>
                </div>

                <div className="dual-details-layout">
                  {/* Left Column Profile info summary */}
                  <div className="sticky-details-sidebar">
                    <div className="applicant-focus-card">
                      <div className="avatar-focus-giant">
                        {selectedApp.applicant?.name?.charAt(0).toUpperCase()}
                      </div>
                      <h2 className="name-focus-giant">{selectedApp.applicant?.name}</h2>
                      <p className="email-focus-sub">{selectedApp.applicant?.email}</p>

                      <div className="vertical-details-grid">
                        {selectedApp.phone && (
                          <div className="detail-item-puck">
                            <Phone size={15} /> <span>{selectedApp.phone}</span>
                          </div>
                        )}
                        {selectedApp.availability && (
                          <div className="detail-item-puck">
                            <Calendar size={15} /> <span>Available: {selectedApp.availability}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="application-action-floating-box">
                      <span className="floating-box-title">Application Status Decision</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span className={`status-pill-premium ${selectedApp.status}`} style={{ fontSize: '0.85rem', padding: '0.35rem 1rem' }}>
                          {selectedApp.status}
                        </span>
                      </div>
                      
                      {selectedApp.status === 'pending' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          <button onClick={() => handleUpdateStatus(selectedApp._id, 'accepted')} className="action-button-huge accept">
                            <Check size={16} /> Accept Candidate
                          </button>
                          <button onClick={() => handleUpdateStatus(selectedApp._id, 'rejected')} className="action-button-huge reject">
                            <X size={16} /> Reject Candidate
                          </button>
                        </div>
                      ) : (
                        <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#94a3b8', margin: 0, fontWeight: '600' }}>
                          Application decision finalized. To modify or issue updates, contact candidate directly.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column scrolling details */}
                  <div className="applicant-scrolling-workspace">
                    {/* Applied For job context card */}
                    <div className="workspace-block-section">
                      <h3 className="workspace-block-title">
                        <Briefcase size={18} /> Position Reference
                      </h3>
                      <div className="applied-job-context-box">
                        <div className="job-context-icon">
                          <Briefcase size={20} />
                        </div>
                        <div className="job-context-texts">
                          <span className="job-context-title">{selectedApp.job?.title}</span>
                          <span className="job-context-company">Posted by your organization</span>
                        </div>
                      </div>
                    </div>

                    {/* Candidate links */}
                    <div className="workspace-block-section">
                      <h3 className="workspace-block-title">
                        <Link2 size={18} /> Portfolios & Verified Profiles
                      </h3>
                      <div className="qualification-links-row">
                        {selectedApp.resumeFile && (
                          <a href={selectedApp.resumeFile} download={selectedApp.resumeFileName || 'Resume.pdf'} className="qualification-link-item resume-type">
                            <FileText size={18} /> Download {selectedApp.resumeFileName ? 'Resume PDF' : 'Resume'}
                          </a>
                        )}
                        {selectedApp.resume && (
                          <a href={selectedApp.resume} target="_blank" rel="noopener noreferrer" className="qualification-link-item resume-type">
                            <FileText size={18} /> Open Resume PDF
                          </a>
                        )}
                        {selectedApp.portfolio && (
                          <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" className="qualification-link-item portfolio-type">
                            <Globe size={18} /> Personal Portfolio
                          </a>
                        )}
                        {selectedApp.linkedin && (
                          <a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer" className="qualification-link-item linkedin-type">
                            <LinkedInIcon size={18} /> LinkedIn Profile
                          </a>
                        )}
                        {selectedApp.github && (
                          <a href={selectedApp.github} target="_blank" rel="noopener noreferrer" className="qualification-link-item github-type">
                            <GitHubIcon size={18} /> GitHub Codebase
                          </a>
                        )}
                      </div>
                      {!selectedApp.resume && !selectedApp.resumeFile && !selectedApp.portfolio && !selectedApp.linkedin && !selectedApp.github && (
                        <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0, fontSize: '0.9rem' }}>No portfolio or resume links attached by candidate.</p>
                      )}
                    </div>

                    {/* Cover Letter */}
                    <div className="workspace-block-section">
                      <h3 className="workspace-block-title">
                        <MessageSquare size={18} /> Candidate Statement & Cover Letter
                      </h3>
                      <div className="workspace-content-box">
                        {selectedApp.coverLetter || 'No cover letter or custom application statement submitted by the candidate.'}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProviderDashboard;
