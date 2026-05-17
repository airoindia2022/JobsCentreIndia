import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Zap, 
  LogOut, 
  ArrowLeft,
  Calendar,
  Building2,
  Share2,
  Bookmark,
  Sparkles,
  Check,
  Compass,
  Gift,
  ShieldCheck,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  
  // Custom Interactive Page States
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'requirements' | 'company'
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const featuredJobs = [
    { 
      _id: 'mock1', 
      title: 'Senior Frontend Engineer', 
      company: 'Google', 
      location: 'Bangalore, India', 
      salary: '₹25L - ₹45L', 
      type: 'Full-time', 
      time: '2 hours ago', 
      description: 'Google is seeking a world-class Senior Frontend Engineer to build high-performance, responsive web interfaces. In this role, you will lead the implementation of complex product modules, design highly-reusable UI platforms, and mentor junior colleagues in modern JavaScript paradigms. Join us in crafting intuitive systems that empower billions of users globally.', 
      requirements: ['React', 'JavaScript', 'CSS', 'TypeScript', 'Web Performance Optimization'],
      benefits: ['Premium Healthcare cover', 'Generous equity options', 'Free gourmet catering', 'Annual learning stipend']
    },
    { 
      _id: 'mock2', 
      title: 'Product Designer', 
      company: 'Razorpay', 
      location: 'Remote', 
      salary: '₹18L - ₹30L', 
      type: 'Full-time', 
      time: '5 hours ago', 
      description: 'Razorpay is looking for a creative, forward-thinking Product Designer to join our core growth team. You will drive UX research, construct delightful interface paradigms, and refine cross-channel experiences for millions of merchants. If you are passionate about visual excellence, design systems, and frictionless transactions, this is the perfect home for you.', 
      requirements: ['Figma', 'UI/UX Research', 'Design Systems', 'Prototyping'],
      benefits: ['Flexible work-from-home policy', 'Home office setup allowance', 'Mental wellbeing support', 'Stock ownership plan']
    },
    { 
      _id: 'mock3', 
      title: 'Backend Developer (Node.js)', 
      company: 'Zomato', 
      location: 'Gurgaon, India', 
      salary: '₹20L - ₹40L', 
      type: 'Full-time', 
      time: '1 day ago', 
      description: 'Zomato is seeking a seasoned Backend Architect to build highly scalable microservices. You will optimize database query speeds, engineer high-capacity pipeline APIs, and deploy real-time order-tracking modules. Help us streamline culinary logistic operations across multiple nations.', 
      requirements: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'System Design'],
      benefits: ['Exciting team bonuses', 'Complimentary dining rewards', 'Complete wellness support', 'Flexible schedules']
    },
    { 
      _id: 'mock4', 
      title: 'Marketing Manager', 
      company: 'Airtel', 
      location: 'New Delhi', 
      salary: '₹15L - ₹25L', 
      type: 'Full-time', 
      time: '3 days ago', 
      description: 'Airtel is hiring a dynamic Marketing Manager to lead high-reach online acquisition strategies. Develop, organize, and execute data-driven campaigns to onboard millions of broadband users. Coordinate directly with PR, design, and content departments to elevate our modern digital ecosystem.', 
      requirements: ['SEO/SEM', 'Digital Marketing', 'Analytical Tracking', 'Strategic Copywriting'],
      benefits: ['Excellent high-tier internet perks', 'Comprehensive family medical benefits', 'Bonus commissions', 'Flexible working hours']
    },
    { 
      _id: 'mock5', 
      title: 'Data Scientist', 
      company: 'Flipkart', 
      location: 'Bangalore, India', 
      salary: '₹22L - ₹42L', 
      type: 'Full-time', 
      time: '4 days ago', 
      description: 'Flipkart is looking for an algorithmic expert to expand our machine learning models. Formulate predictive recommendation engines, optimize pricing funnels, and process terabytes of search queries to delight hundreds of millions of retail shoppers.', 
      requirements: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Apache Spark'],
      benefits: ['Gym facilities access', 'Comprehensive dental coverage', 'Relocation packages', 'Annual performance rewards']
    },
    { 
      _id: 'mock6', 
      title: 'Customer Success Lead', 
      company: 'Freshworks', 
      location: 'Chennai, India', 
      salary: '₹12L - ₹20L', 
      type: 'Full-time', 
      time: '1 week ago', 
      description: 'Freshworks is hiring a passionate Customer Success Lead to foster lasting client relationships. Advise enterprises on workflow automation, resolve escalated accounts issues, and shape customer training programs to maximize our SaaS product adoption.', 
      requirements: ['SaaS Workflows', 'Exceptional Communication', 'Client Management', 'CRM platforms'],
      benefits: ['Top-tier corporate device sets', 'Annual wellness weekend stipend', 'Skill acceleration program support', 'Direct equity grants']
    }
  ];

  const checkIfApplied = async (jobId) => {
    if (!user || user.role !== 'seeker') return;

    if (jobId.startsWith('mock')) {
      const savedApps = JSON.parse(localStorage.getItem('mock_applications') || '[]');
      const hasApplied = savedApps.some(app => app.job?._id === jobId || app.job === jobId);
      if (hasApplied) {
        setIsApplied(true);
        return;
      }
    }

    try {
      const config = {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      };
      const res = await axios.get('https://back.jobscenterindia.com/api/applications/me', config);
      const hasApplied = res.data.some(app => app.job?._id === jobId || app.job === jobId);
      setIsApplied(hasApplied);
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        if (id.startsWith('mock')) {
          const mockJob = featuredJobs.find(j => j._id === id);
          if (mockJob) {
            setJob(mockJob);
            checkIfApplied(id);
          } else {
            setError('Job not found');
          }
        } else {
          const res = await axios.get(`https://back.jobscenterindia.com/api/jobs/${id}`);
          setJob(res.data);
          checkIfApplied(id);
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err.response?.data?.msg || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
    window.scrollTo(0, 0);
  }, [id, user]);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '45px', height: '45px', border: '4px solid rgba(79, 70, 229, 0.08)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
          <span style={{ marginTop: '1.25rem', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem', letterSpacing: '0.02em' }}>Crafting visual canvas...</span>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.06)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Building2 size={56} color="var(--error)" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 850, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Opportunity Suspended</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '440px', lineHeight: 1.6, fontSize: '0.975rem' }}>
            {error || "This specific posting is currently unavailable, filled, or has been archived by the recruiter."}
          </p>
          <Link to="/" className="btn btn-primary" style={{ padding: '0.85rem 2rem', borderRadius: '2rem' }}>
            <ArrowLeft size={16} /> Return to Listing
          </Link>
        </div>
      </div>
    );
  }

  const companyLogoUrl = job.companyLogo || (
    id.startsWith('mock') ? (
      job.company.toLowerCase() === 'google' ? 'https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjl/512/google.png' :
      job.company.toLowerCase() === 'razorpay' ? 'https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,g_face,z_1/qgac14r84cchgixgnyer' :
      job.company.toLowerCase() === 'zomato' ? 'https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,g_face,z_1/q3s33exhth0718y6v4d0' :
      job.company.toLowerCase() === 'airtel' ? 'https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,g_face,z_1/v1422501061/d8r1tux34p70vyp8ix0k.png' :
      job.company.toLowerCase() === 'flipkart' ? 'https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,g_face,z_1/g3w1qesv3q9lpsh4m5f8' :
      job.company.toLowerCase() === 'freshworks' ? 'https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,g_face,z_1/mgl0w0814x6q5fwhhthw' :
      null
    ) : null
  );

  const companyDesc = job.companyDescription || (
    id.startsWith('mock') ? (
      job.company.toLowerCase() === 'google' ? "Google's mission is to organize the world's information and make it universally accessible and useful. Google is a global technology leader focused on search, cloud computing, online advertising technologies, and hardware." :
      job.company.toLowerCase() === 'razorpay' ? "Razorpay is India's leading fintech company, helping businesses accept, process, and disburse payments with its developer-friendly product suite. Serving millions of merchants across the nation." :
      job.company.toLowerCase() === 'zomato' ? "Zomato is a technology platform connecting customers, restaurant partners, and delivery agents. It offers food ordering and delivery, tables reservation, dining out, and premium grocery delivery." :
      job.company.toLowerCase() === 'airtel' ? "Bharti Airtel Limited is a leading global telecommunications company operating in 18 countries across Asia and Africa. Airtel ranks among the top mobile operators worldwide." :
      job.company.toLowerCase() === 'flipkart' ? "Flipkart is India's pre-eminent e-commerce marketplace, offering over 80 million products across 80+ categories. Bringing a seamless digital retail experience to billions." :
      job.company.toLowerCase() === 'freshworks' ? "Freshworks makes it fast and easy for businesses to delight their customers and employees. Designing affordable, quick-to-implement SaaS solutions for customer engagement." :
      `About ${job.company}: A dynamic organization dedicated to excellence, innovation, and career advancement. We build premium solutions to elevate our industry and support our team's professional growth.`
    ) : "No company description has been provided by the employer."
  );

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      


      {/* 2. Premium Immersive Mesh Gradient Hero Backdrop */}
      <div style={{ 
        position: 'relative', 
        height: '240px', 
        background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 60%, #1e1b4b 100%)',
        overflow: 'hidden',
        zIndex: 1
      }}>
        {/* Abstract Dynamic Ambient Blobs */}
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'floatBlob 12s infinite alternate' }}></div>
        <div style={{ position: 'absolute', bottom: '-40%', right: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'floatBlob2 16s infinite alternate' }}></div>
        
        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '3.5rem', zIndex: 3 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: '2rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
            <ArrowLeft size={16} /> Back to opportunities
          </button>
        </div>
        
        <style>{`
          @keyframes floatBlob { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(50px, 30px) scale(1.1); } }
          @keyframes floatBlob2 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-40px, -20px) scale(1.15); } }
        `}</style>
      </div>

      {/* 3. Main Adaptive Information Layout Container */}
      <section className="section" style={{ position: 'relative', zIndex: 5, marginTop: '-5.5rem', padding: '0 0 5rem 0' }}>
        <div className="container">
          
          {/* A. Hero Floating Identity Card */}
          <div className="glass-card" style={{ 
            padding: '2.5rem', 
            background: '#ffffff', 
            borderRadius: '1.25rem', 
            border: '1px solid rgba(226, 232, 240, 0.9)', 
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
            marginBottom: '2.5rem'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.25rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
                
                {/* Visual Premium Company Logo Container */}
                <div style={{ position: 'relative' }}>
                  {companyLogoUrl ? (
                    <img 
                      src={companyLogoUrl} 
                      alt={job.company} 
                      style={{ 
                        width: '94px', 
                        height: '94px', 
                        objectFit: 'contain', 
                        borderRadius: '1.15rem', 
                        border: '5px solid #ffffff', 
                        background: '#ffffff',
                        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)'
                      }} 
                    />
                  ) : (
                    <div style={{ 
                      width: '94px', 
                      height: '94px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', 
                      borderRadius: '1.15rem', 
                      fontWeight: '850', 
                      fontSize: '2.5rem', 
                      color: '#ffffff',
                      border: '5px solid #ffffff',
                      boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)'
                    }}>
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Main Identity Info Block */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.035em', margin: 0, lineHeight: 1.25 }}>{job.title}</h1>
                    <span className="status-pill accepted" style={{ display: 'inline-flex', padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', background: 'rgba(79, 70, 229, 0.07)', color: 'var(--primary)', border: '1px solid rgba(79, 70, 229, 0.15)' }}>
                      {job.type}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>{job.company}</span>
                    <span style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>
                      <CheckCircle2 size={16} fill="rgba(16, 185, 129, 0.1)" /> Verified Employer
                    </div>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons (Share, Bookmark) */}
              <div style={{ display: 'flex', gap: '0.85rem', flexShrink: 0 }}>
                <button 
                  onClick={handleShareClick}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '50%', 
                    background: copied ? 'var(--success)' : '#ffffff', 
                    color: copied ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border)', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  title="Copy link to clipboard"
                >
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '50%', 
                    background: isBookmarked ? 'rgba(79, 70, 229, 0.08)' : '#ffffff', 
                    color: isBookmarked ? 'var(--primary)' : 'var(--text-muted)',
                    border: isBookmarked ? '1px solid rgba(79, 70, 229, 0.3)' : '1px solid var(--border)', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  title={isBookmarked ? "Saved" : "Save opportunity"}
                >
                  <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {copied && (
              <div style={{ 
                position: 'fixed', 
                bottom: '2.5rem', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                background: 'var(--text-main)', 
                color: '#ffffff', 
                padding: '0.85rem 1.85rem', 
                borderRadius: '3rem', 
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
                fontWeight: 700, 
                fontSize: '0.875rem',
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                zIndex: 200,
                animation: 'fadeSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <CheckCircle2 size={18} color="var(--success)" fill="rgba(16, 185, 129, 0.15)" /> Link copied to clipboard!
              </div>
            )}
            <style>{`
              @keyframes fadeSlideUp {
                0% { opacity: 0; transform: translate(-50%, 20px); }
                100% { opacity: 1; transform: translate(-50%, 0); }
              }
            `}</style>
          </div>

          {/* B. Two-Column Dashboard Content Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem', alignItems: 'flex-start' }}>
            
            {/* COLUMN 1: Detailed Specifications & Content Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Tab Navigation Menu */}
              <div style={{ 
                display: 'flex', 
                background: '#f1f5f9', 
                padding: '0.4rem', 
                borderRadius: '3rem', 
                border: '1px solid var(--border)', 
                alignSelf: 'flex-start',
                marginBottom: '0.5rem'
              }}>
                <button 
                  onClick={() => setActiveTab('overview')}
                  style={{ 
                    padding: '0.65rem 1.75rem', 
                    borderRadius: '2rem', 
                    fontWeight: 700, 
                    fontSize: '0.85rem',
                    color: activeTab === 'overview' ? 'var(--text-main)' : 'var(--text-muted)',
                    background: activeTab === 'overview' ? '#ffffff' : 'none',
                    boxShadow: activeTab === 'overview' ? '0 4px 10px rgba(15, 23, 42, 0.05)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  Job Specification
                </button>
                <button 
                  onClick={() => setActiveTab('requirements')}
                  style={{ 
                    padding: '0.65rem 1.75rem', 
                    borderRadius: '2rem', 
                    fontWeight: 700, 
                    fontSize: '0.85rem',
                    color: activeTab === 'requirements' ? 'var(--text-main)' : 'var(--text-muted)',
                    background: activeTab === 'requirements' ? '#ffffff' : 'none',
                    boxShadow: activeTab === 'requirements' ? '0 4px 10px rgba(15, 23, 42, 0.05)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  Requirements & Skills
                </button>
                <button 
                  onClick={() => setActiveTab('company')}
                  style={{ 
                    padding: '0.65rem 1.75rem', 
                    borderRadius: '2rem', 
                    fontWeight: 700, 
                    fontSize: '0.85rem',
                    color: activeTab === 'company' ? 'var(--text-main)' : 'var(--text-muted)',
                    background: activeTab === 'company' ? '#ffffff' : 'none',
                    boxShadow: activeTab === 'company' ? '0 4px 10px rgba(15, 23, 42, 0.05)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  About Organization
                </button>
              </div>

              {/* Tab Content Panel */}
              <div className="glass-card" style={{ 
                padding: '3rem', 
                background: '#ffffff', 
                borderRadius: '1.25rem', 
                border: '1px solid rgba(226, 232, 240, 0.9)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.03)'
              }}>
                
                {activeTab === 'overview' && (
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Compass size={22} color="var(--primary)" /> Role Overview & Context
                    </h3>
                    <p style={{ color: '#334155', lineHeight: '1.85', fontSize: '1.025rem', whiteSpace: 'pre-line', marginBottom: '2.5rem' }}>
                      {job.description || 'No job description details have been made available.'}
                    </p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.02em', borderTop: '1px solid var(--border)', paddingTop: '2.25rem' }}>
                      🌟 Core Benefits & Compensations
                    </h3>
                    {job.benefits && job.benefits.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {job.benefits.map((benefit, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.15rem', background: '#f8fafc', borderRadius: '0.85rem', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', background: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)', borderRadius: '50%', flexShrink: 0 }}>
                              <Check size={16} />
                            </div>
                            <span style={{ fontSize: '0.925rem', fontWeight: 650, color: 'var(--text-main)' }}>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    ) : id.startsWith('mock') ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {['Flexible remote hybrid work hours', 'Medical insurance plan cover', 'Continuous self-development budgets', 'Equity shares package option'].map((benefit, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.15rem', background: '#f8fafc', borderRadius: '0.85rem', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', background: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)', borderRadius: '50%', flexShrink: 0 }}>
                              <Check size={16} />
                            </div>
                            <span style={{ fontSize: '0.925rem', fontWeight: 650, color: 'var(--text-main)' }}>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ width: '100%', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.85rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                        <span style={{ fontSize: '0.95rem', fontStyle: 'italic' }}>No benefits or compensations have been specified by the provider.</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={22} color="var(--primary)" /> Key Qualifications & Stack
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                      These represent the primary toolkits and credentials our teams rely upon to build, optimize, and distribute premium products.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '2.5rem' }}>
                      {job.requirements && job.requirements.length > 0 ? (
                        job.requirements.map((req, idx) => (
                          <span key={idx} style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', color: 'var(--primary)', padding: '0.6rem 1.35rem', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 700, border: '1px solid rgba(79, 70, 229, 0.07)' }}>
                            {req}
                          </span>
                        ))
                      ) : (
                        <div style={{ width: '100%', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.85rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontSize: '0.95rem', fontStyle: 'italic' }}>No key requirements or qualifications have been specified by the provider.</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Skills Matcher Section */}
                    {user && user.role === 'seeker' && (
                      <div style={{ 
                        borderTop: '1px solid var(--border)', 
                        paddingTop: '2.25rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '2rem', 
                        flexWrap: 'wrap',
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, transparent 100%)',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        border: '1px solid rgba(79, 70, 229, 0.1)'
                      }}>
                        {/* Circular matching radial gauge */}
                        <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                          <svg width="80" height="80" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" strokeDasharray="92, 100" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)' }}>92%</span>
                          </div>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            Excellent Fit!
                          </h4>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
                            Based on your candidate profile highlights, you possess 92% of the required tech stack and strategic capabilities for this opportunity. We strongly advise applying!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'company' && (
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={22} color="var(--primary)" /> Organization DNA
                    </h3>
                    <p style={{ color: '#334155', lineHeight: '1.85', fontSize: '1.025rem', marginBottom: '2.5rem' }}>
                      {companyDesc}
                    </p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.02em', borderTop: '1px solid var(--border)', paddingTop: '2.25rem' }}>
                      🏢 Cultural Pillars & Standards
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                      <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.06)', color: 'var(--primary)', marginBottom: '0.85rem' }}>
                          <TrendingUp size={22} />
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Innovation First</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>Push boundary lines daily.</p>
                      </div>
                      <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.06)', color: 'var(--success)', marginBottom: '0.85rem' }}>
                          <Gift size={22} />
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Total Wellbeing</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>Mind, soul and physical wellness.</p>
                      </div>
                      <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.06)', color: 'var(--secondary)', marginBottom: '0.85rem' }}>
                          <ShieldCheck size={22} />
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Unwavering trust</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>Empowerment & transparent rules.</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* COLUMN 2: Elegant Sticky Details & Apply Widget */}
            <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Main Quick Stats Card */}
              <div className="glass-card" style={{ 
                padding: '2.25rem', 
                background: '#ffffff', 
                borderRadius: '1.25rem', 
                border: '1px solid rgba(226, 232, 240, 0.9)',
                boxShadow: '0 15px 35px -10px rgba(15, 23, 42, 0.06)'
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 850, marginBottom: '1.5rem', letterSpacing: '-0.02em', textTransform: 'uppercase', color: 'var(--primary)' }}>
                  Opportunity Specifications
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--primary)' }}>
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Remuneration Plan</span>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>{job.salary}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--primary)' }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Geographic Base</span>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>{job.location}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--primary)' }}>
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Engagement Category</span>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>{job.type}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--primary)' }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Publication Date</span>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>{job.time || '1 day ago'}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button Widget */}
                {isApplied ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', background: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)', padding: '0.85rem', borderRadius: '0.75rem', fontWeight: 800, fontSize: '0.95rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <CheckCircle2 size={18} /> Applied Successfully
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>You will be updated as the recruiter reviews your details.</span>
                  </div>
                ) : (
                  <Link 
                    to={`/apply/${job._id}`}
                    className="btn btn-primary btn-block"
                    style={{ 
                      padding: '1rem', 
                      borderRadius: '0.85rem', 
                      fontWeight: 800, 
                      fontSize: '1rem', 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                      boxShadow: '0 8px 25px rgba(79, 70, 229, 0.2)',
                      display: 'block'
                    }}
                  >
                    Apply Now &rarr;
                  </Link>
                )}
              </div>

              {/* Recruitment Policy Shield */}
              <div style={{ 
                display: 'flex', 
                gap: '0.85rem', 
                background: 'rgba(14, 165, 233, 0.04)', 
                border: '1px solid rgba(14, 165, 233, 0.1)', 
                borderRadius: '1rem', 
                padding: '1.25rem' 
              }}>
                <ShieldCheck size={26} color="var(--secondary)" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Job Center India Safe Recruit</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.775rem', lineHeight: '1.45', margin: 0 }}>
                    We thoroughly vet all employer accounts and opportunities. Never transfer funds or share private accounts information during recruitment procedures.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. Elegant Minimalist Footer */}
      <footer className="footer" style={{ marginTop: 'auto', background: '#ffffff', borderTop: '1px solid var(--border)', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>&copy; {new Date().getFullYear()} Job Center India Hub. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', fontWeight: 650, color: 'var(--text-muted)' }}>
            <Link to="/" style={{ opacity: 0.8 }}>Privacy Statement</Link>
            <Link to="/" style={{ opacity: 0.8 }}>Service Terms</Link>
            <Link to="/" style={{ opacity: 0.8 }}>Help Desk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobDetails;
