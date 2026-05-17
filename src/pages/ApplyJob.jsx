import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  FileText, 
  Send, 
  Link2, 
  Globe, 
  Phone, 
  Calendar, 
  MessageSquare,
  ArrowLeft,
  Zap,
  Lock,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const SeekerGithubIcon = ({ size = 20 }) => (
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

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [applyData, setApplyData] = useState({
    resume: '',
    resumeFile: '',
    resumeFileName: '',
    coverLetter: '',
    portfolio: '',
    linkedin: '',
    github: '',
    phone: '',
    availability: ''
  });

  const [resumeUploadType, setResumeUploadType] = useState('link'); // 'link' or 'file'

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setApplyData({ ...applyData, resumeFile: reader.result, resumeFileName: file.name, resume: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const featuredJobs = [
    { _id: 'mock1', title: 'Senior Frontend Engineer', company: 'Google', location: 'Bangalore, India', salary: '₹25L - ₹45L', type: 'Full-time', time: '2 hours ago', description: 'Google is hiring a Senior Frontend Engineer to build modern web interfaces.', requirements: ['React', 'JavaScript', 'CSS'] },
    { _id: 'mock2', title: 'Product Designer', company: 'Razorpay', location: 'Remote', salary: '₹18L - ₹30L', type: 'Full-time', time: '5 hours ago', description: 'Razorpay is looking for a Product Designer to design the future of payments.', requirements: ['Figma', 'UI/UX'] },
    { _id: 'mock3', title: 'Backend Developer (Node.js)', company: 'Zomato', location: 'Gurgaon, India', salary: '₹20L - ₹40L', type: 'Full-time', time: '1 day ago', description: 'Zomato is looking for a Backend Developer to build scalable APIs.', requirements: ['Node.js', 'Express', 'MongoDB'] },
    { _id: 'mock4', title: 'Marketing Manager', company: 'Airtel', location: 'New Delhi', salary: '₹15L - ₹25L', type: 'Full-time', time: '3 days ago', description: 'Airtel is hiring a Marketing Manager for digital campaigns.', requirements: ['SEO', 'Marketing'] },
    { _id: 'mock5', title: 'Data Scientist', company: 'Flipkart', location: 'Bangalore, India', salary: '₹22L - ₹42L', type: 'Full-time', time: '4 days ago', description: 'Flipkart is looking for a Data Scientist to build recommendation systems.', requirements: ['Python', 'Machine Learning'] },
    { _id: 'mock6', title: 'Customer Success Lead', company: 'Freshworks', location: 'Chennai, India', salary: '₹12L - ₹20L', type: 'Full-time', time: '1 week ago', description: 'Freshworks is hiring a Customer Success Lead to manage client relationships.', requirements: ['Communication', 'Support'] }
  ];

  useEffect(() => {
    // Guest check: If not logged in, redirect to login
    if (!user && !loading) {
      navigate('/login');
      return;
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        if (id.startsWith('mock')) {
          const mockJob = featuredJobs.find(j => j._id === id);
          if (mockJob) {
            setJob(mockJob);
          } else {
            setError('Job not found');
          }
        } else {
          const res = await axios.get(`https://back.jobscenterindia.com/api/jobs/${id}`);
          setJob(res.data);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.msg || 'Failed to retrieve job information');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Mock Job Submission Flow
      if (id.startsWith('mock')) {
        const mockApplications = JSON.parse(localStorage.getItem('mock_applications') || '[]');
        
        // Prevent duplicate local application
        const duplicate = mockApplications.some(app => app.job?._id === id || app.job === id);
        if (duplicate) {
          alert('You have already applied for this job!');
          navigate('/');
          return;
        }

        const newApp = {
          _id: 'mock_app_' + Math.random().toString(36).substr(2, 9),
          job: job,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        mockApplications.unshift(newApp);
        localStorage.setItem('mock_applications', JSON.stringify(mockApplications));
        
        alert('Applied successfully (Demo mode)! Since this is a pre-loaded featured job, your application is processed locally.');
        navigate('/', { state: { view: 'applications' } });
        return;
      }

      // Real Job Submission Flow
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') 
        }
      };

      await axios.post('https://back.jobscenterindia.com/api/applications', { 
        jobId: job._id,
        ...applyData
      }, config);
      
      alert('Your job application was successfully submitted!');
      navigate('/', { state: { view: 'applications' } });
    } catch (err) {
      alert(err.response?.data?.msg || 'Submission failed. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(99,102,241,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <span style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Preparing your application environment...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
          <AlertTriangle size={64} color="#f59e0b" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Application Refused</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>{error || "The job post is no longer accepting applications or does not exist."}</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Job Portal
          </Link>
        </div>
      </div>
    );
  }

  // Seeker Authorization Safeguard
  if (user && user.role !== 'seeker') {
    return (
      <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
          <Lock size={64} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 850, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Action Prohibited</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '450px', lineHeight: 1.6 }}>
            You are logged in as an <strong>Employer/Provider</strong>. Only verified Job Seekers are allowed to submit applications to job listings.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Go Back
            </button>
            <Link to="/provider-dashboard" className="btn btn-primary">
              View Employer Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>


      {/* Form Main Area */}
      <section className="section" style={{ backgroundColor: '#f8fafc', flex: 1, padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} /> Back to Details
            </button>
            <span className="status-pill accepted" style={{ display: 'inline-block', padding: '0.45rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Applying
            </span>
          </div>

          <div className="glass-card" style={{ padding: '3rem', background: '#ffffff', borderRadius: '1.25rem', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1.75rem', marginBottom: '2.25rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 850, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Application Form</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
                  Applying for <strong>{job.title}</strong> at <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{job.company}</span>
                </p>
              </div>
              <div className="company-logo" style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.1)', borderRadius: '0.85rem', fontWeight: '800', fontSize: '1.6rem', color: 'var(--primary)', flexShrink: 0 }}>
                {job.company.charAt(0)}
              </div>
            </div>

            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} color="var(--primary)" /> Resume
                </label>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="resumeType" 
                      checked={resumeUploadType === 'link'} 
                      onChange={() => { setResumeUploadType('link'); setApplyData({ ...applyData, resumeFile: '', resumeFileName: '' }); }}
                    />
                    Provide Link
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="resumeType" 
                      checked={resumeUploadType === 'file'} 
                      onChange={() => { setResumeUploadType('file'); setApplyData({ ...applyData, resume: '' }); }}
                    />
                    Upload PDF
                  </label>
                </div>

                {resumeUploadType === 'link' ? (
                  <>
                    <input 
                      type="url" 
                      value={applyData.resume} 
                      onChange={e => setApplyData({...applyData, resume: e.target.value})} 
                      placeholder="https://drive.google.com/file/d/..."
                      required 
                      style={{ background: '#f8fafc' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                      Make sure share permissions are set to "Anyone with the link can view".
                    </span>
                  </>
                ) : (
                  <>
                    <div className="file-upload-container" style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: '100%' }}>
                      <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        required
                        style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                      />
                      <div style={{ padding: '1rem', background: '#f8fafc', border: '2px dashed var(--border)', borderRadius: '0.5rem', textAlign: 'center' }}>
                        {applyData.resumeFileName ? (
                          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{applyData.resumeFileName}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Click or drag a PDF file to upload (Max 5MB)</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link2 size={16} color="var(--primary)" /> LinkedIn Profile
                  </label>
                  <input 
                    type="url" 
                    value={applyData.linkedin} 
                    onChange={e => setApplyData({...applyData, linkedin: e.target.value})} 
                    placeholder="https://linkedin.com/in/..."
                    style={{ background: '#f8fafc' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={16} color="var(--primary)" /> Portfolio / Website
                  </label>
                  <input 
                    type="url" 
                    value={applyData.portfolio} 
                    onChange={e => setApplyData({...applyData, portfolio: e.target.value})} 
                    placeholder="https://yourwebsite.com"
                    style={{ background: '#f8fafc' }}
                  />
                </div>
              </div>

              <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <SeekerGithubIcon size={16} /> GitHub Profile
                  </label>
                  <input 
                    type="url" 
                    value={applyData.github} 
                    onChange={e => setApplyData({...applyData, github: e.target.value})} 
                    placeholder="https://github.com/..."
                    style={{ background: '#f8fafc' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={16} color="var(--primary)" /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    value={applyData.phone} 
                    onChange={e => setApplyData({...applyData, phone: e.target.value})} 
                    placeholder="+91 1234567890"
                    required
                    style={{ background: '#f8fafc' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} color="var(--primary)" /> Availability / Notice Period
                </label>
                <input 
                  type="text" 
                  value={applyData.availability} 
                  onChange={e => setApplyData({...applyData, availability: e.target.value})} 
                  placeholder="e.g. Immediately available, 15 days notice, 1 month notice"
                  required
                  style={{ background: '#f8fafc' }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={16} color="var(--primary)" /> Cover Letter / Message to Hiring Team
                </label>
                <textarea 
                  value={applyData.coverLetter} 
                  onChange={e => setApplyData({...applyData, coverLetter: e.target.value})} 
                  placeholder="Briefly describe why you are the best candidate for this role..."
                  rows={5}
                  required 
                  style={{ background: '#f8fafc', resize: 'vertical' }}
                />
              </div>
              
              <div className="modal-actions" style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '0.85rem 2rem' }}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={submitLoading} 
                  style={{ padding: '0.85rem 3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {submitLoading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send size={18} /> Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" style={{ marginTop: 'auto' }}>
        <div className="container">
          <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
            <p>&copy; {new Date().getFullYear()} Job Center India Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ApplyJob;
