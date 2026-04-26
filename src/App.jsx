import React from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
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
  Users
} from 'lucide-react';
import './App.css';

const JobCard = ({ title, company, location, salary, type, time, logo }) => (
  <div className="job-card">
    <div className="job-header">
      <div>
        <h3 className="job-title">{title}</h3>
        <p className="company-name">{company}</p>
      </div>
      <div className="company-logo">{logo}</div>
    </div>
    <div className="job-meta">
      <div className="job-meta-item"><MapPin size={16} /> {location}</div>
      <div className="job-meta-item"><Briefcase size={16} /> {type}</div>
      <div className="job-meta-item"><DollarSign size={16} /> {salary}</div>
      <div className="job-meta-item"><Clock size={16} /> {time}</div>
    </div>
    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
      <button className="btn btn-primary" style={{ flex: 1 }}>Apply Now</button>
      <button className="btn btn-secondary">Save</button>
    </div>
  </div>
);

const CategoryCard = ({ icon: Icon, name, count }) => (
  <div className="cat-card">
    <div className="cat-icon"><Icon size={24} /></div>
    <h3 className="cat-name">{name}</h3>
    <p className="cat-count">{count} Open Positions</p>
  </div>
);

function App() {
  const featuredJobs = [
    { title: 'Senior Frontend Engineer', company: 'Google', location: 'Bangalore, India', salary: '₹25L - ₹45L', type: 'Full-time', time: '2 hours ago', logo: 'G' },
    { title: 'Product Designer', company: 'Razorpay', location: 'Remote', salary: '₹18L - ₹30L', type: 'Full-time', time: '5 hours ago', logo: 'R' },
    { title: 'Backend Developer (Node.js)', company: 'Zomato', location: 'Gurgaon, India', salary: '₹20L - ₹40L', type: 'Full-time', time: '1 day ago', logo: 'Z' },
    { title: 'Marketing Manager', company: 'Airtel', location: 'New Delhi', salary: '₹15L - ₹25L', type: 'Full-time', time: '3 days ago', logo: 'A' },
    { title: 'Data Scientist', company: 'Flipkart', location: 'Bangalore, India', salary: '₹22L - ₹42L', type: 'Full-time', time: '4 days ago', logo: 'F' },
    { title: 'Customer Success Lead', company: 'Freshworks', location: 'Chennai, India', salary: '₹12L - ₹20L', type: 'Full-time', time: '1 week ago', logo: 'F' },
  ];

  const categories = [
    { icon: Code2, name: 'Development', count: '1,200+' },
    { icon: Palette, name: 'Design', count: '450+' },
    { icon: BarChart3, name: 'Marketing', count: '800+' },
    { icon: Headset, name: 'Customer Support', count: '600+' },
    { icon: Briefcase, name: 'Finance', count: '300+' },
    { icon: Building2, name: 'Operations', count: '500+' },
    { icon: Users, name: 'Human Resources', count: '200+' },
    { icon: Globe, name: 'Sales', count: '900+' },
  ];

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-content">
          <a href="/" className="logo">
            <Zap size={32} fill="currentColor" />
            <span>JobIndia</span>
          </a>
          <div className="nav-links">
            <a href="#" className="nav-link">Find Jobs</a>
            <a href="#" className="nav-link">Companies</a>
            <a href="#" className="nav-link">Salaries</a>
            <a href="#" className="nav-link">Post a Job</a>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn">Sign In</button>
            <button className="btn btn-primary">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <h1 className="hero-title">Find your dream job <br />in India's top companies</h1>
          <p className="hero-subtitle">
            Browse through thousands of high-paying jobs from startups to tech giants. 
            Your next career move starts here.
          </p>
          <div className="search-box">
            <div className="search-input-group">
              <Search size={20} color="#64748b" />
              <input type="text" placeholder="Job title, keywords, or company" />
            </div>
            <div className="search-input-group">
              <MapPin size={20} color="#64748b" />
              <input type="text" placeholder="City or state" />
            </div>
            <button className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', borderRadius: '0.75rem' }}>
              Search Jobs
            </button>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> No hidden fees</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Verified Employers</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> 10k+ New Jobs Weekly</span>
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Explore by Category</h2>
          <div className="grid grid-4">
            {categories.map((cat, index) => (
              <CategoryCard key={index} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="section" style={{ backgroundColor: '#f1f5f9' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Featured Jobs</h2>
              <p style={{ color: 'var(--text-muted)' }}>Hand-picked opportunities from premium partners</p>
            </div>
            <a href="#" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              View all jobs <ChevronRight size={20} />
            </a>
          </div>
          <div className="grid grid-3">
            {featuredJobs.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container" style={{ 
          background: 'var(--primary)', 
          borderRadius: '2rem', 
          padding: '4rem', 
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to take the next step?</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>
            Join 2 million+ job seekers and get matched with your ideal role today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '1rem 2.5rem' }}>
              Create Profile
            </button>
            <button className="btn" style={{ border: '1px solid white', color: 'white', padding: '1rem 2.5rem' }}>
              Upload Resume
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a href="/" className="footer-logo">JobIndia</a>
              <p style={{ lineHeight: 1.8 }}>
                The leading job portal in India connecting talent with opportunity. 
                Built for job seekers who value speed, simplicity, and quality.
              </p>
            </div>
            <div>
              <h4 className="footer-title">For Candidates</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Browse Jobs</a></li>
                <li><a href="#" className="footer-link">Job Alerts</a></li>
                <li><a href="#" className="footer-link">Career Advice</a></li>
                <li><a href="#" className="footer-link">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-title">For Employers</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Post a Job</a></li>
                <li><a href="#" className="footer-link">Search Candidates</a></li>
                <li><a href="#" className="footer-link">Hiring Solutions</a></li>
                <li><a href="#" className="footer-link">Pricing Plans</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Help Center</a></li>
                <li><a href="#" className="footer-link">Contact Us</a></li>
                <li><a href="#" className="footer-link">Privacy Policy</a></li>
                <li><a href="#" className="footer-link">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} JobIndia Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
