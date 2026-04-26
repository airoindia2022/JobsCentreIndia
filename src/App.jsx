import React, { useState } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Clock, ChevronRight, Menu, X, Bell, User } from 'lucide-react';
import './App.css';

const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Bangalore, Karnataka",
    salary: "₹18L - ₹25L a year",
    type: "Full-time",
    posted: "2 days ago",
    description: "We are looking for a Senior Frontend Developer with 5+ years of experience in React and modern CSS. You will lead the UI development of our flagship product.",
    requirements: [
      "Expertise in React, Redux, and TypeScript",
      "Strong understanding of CSS-in-JS and Responsive Design",
      "Experience with testing frameworks like Jest/Cypress",
      "Ability to mentor junior developers"
    ],
    benefits: ["Health Insurance", "WFH Options", "Performance Bonus"]
  },
  {
    id: 2,
    title: "Product Designer (UI/UX)",
    company: "Creatix Studio",
    location: "Mumbai, Maharashtra",
    salary: "₹12L - ₹18L a year",
    type: "Remote",
    posted: "Just now",
    description: "Join our creative team to build beautiful and functional user experiences. You should have a strong portfolio showcasing user-centric designs.",
    requirements: [
      "Proficiency in Figma and Adobe Suite",
      "Understanding of Design Systems",
      "Portfolio demonstrating web and mobile apps",
      "Excellent communication skills"
    ],
    benefits: ["Flexible Hours", "Learning Stipend", "Stock Options"]
  },
  {
    id: 3,
    title: "Backend Engineer (Node.js)",
    company: "DataFlow Systems",
    location: "Hyderabad, Telangana",
    salary: "₹15L - ₹22L a year",
    type: "Full-time",
    posted: "5 hours ago",
    description: "Build scalable APIs and microservices for high-traffic applications. Experience with MongoDB and AWS is highly preferred.",
    requirements: [
      "Strong proficiency in Node.js and Express",
      "Experience with NoSQL databases (MongoDB)",
      "Understanding of RESTful APIs and GraphQL",
      "Familiarity with AWS services"
    ],
    benefits: ["Relocation Bonus", "Modern Office", "Gym Membership"]
  },
  {
    id: 4,
    title: "Marketing Manager",
    company: "GrowthEdge Inc.",
    location: "Delhi, NCR",
    salary: "₹10L - ₹15L a year",
    type: "Hybrid",
    posted: "1 day ago",
    description: "Lead our digital marketing campaigns and drive user acquisition. You will be responsible for SEO, SEM, and Social Media strategies.",
    requirements: [
      "3+ years in Digital Marketing",
      "Data-driven mindset",
      "Experience with Google Ads and Meta Ads",
      "Creative writing skills"
    ],
    benefits: ["Annual Trips", "Health Perks", "Workshops"]
  }
];

function App() {
  const [selectedJob, setSelectedJob] = useState(MOCK_JOBS[0]);
  const [searchWhat, setSearchWhat] = useState('');
  const [searchWhere, setSearchWhere] = useState('');

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <h1 style={{ color: 'var(--primary)', fontSize: '24px', fontWeight: '800' }}>JobCentre</h1>
            <div className="nav-links flex gap-2" style={{ marginLeft: '32px' }}>
              <a href="#">Find Jobs</a>
              <a href="#">Company Reviews</a>
              <a href="#">Salaries</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-outline">Post a Job</button>
            <div className="flex items-center gap-2" style={{ marginLeft: '12px' }}>
              <Bell size={20} color="var(--text-muted)" />
              <User size={24} color="var(--text-muted)" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <section className="hero">
        <div className="container">
          <div className="search-container">
            <div className="search-input-group">
              <span style={{ color: 'var(--text-muted)', fontWeight: '700', marginRight: '8px' }}>What</span>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Job title, keywords, or company" 
                value={searchWhat}
                onChange={(e) => setSearchWhat(e.target.value)}
              />
            </div>
            <div className="search-input-group">
              <span style={{ color: 'var(--text-muted)', fontWeight: '700', marginRight: '8px' }}>Where</span>
              <MapPin size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="City, state, or zip code" 
                value={searchWhere}
                onChange={(e) => setSearchWhere(e.target.value)}
              />
            </div>
            <button className="btn-primary" style={{ margin: '4px', borderRadius: '4px' }}>Find Jobs</button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Post your resume</span> - It only takes a few seconds
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container">
        <div className="job-feed">
          {/* Job List */}
          <div className="job-list">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Job Feed</h2>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Sorted by relevance</span>
            </div>
            
            {MOCK_JOBS.map((job) => (
              <div 
                key={job.id} 
                className={`job-card ${selectedJob.id === job.id ? 'active' : ''}`}
                onClick={() => setSelectedJob(job)}
              >
                <h3 className="job-title">{job.title}</h3>
                <div className="company-name">{job.company}</div>
                <div className="location" style={{ fontSize: '14px', marginTop: '4px' }}>{job.location}</div>
                <div className="job-meta">
                  <span className="salary">{job.salary}</span>
                  <span className="flex items-center gap-2"><Briefcase size={14} /> {job.type}</span>
                </div>
                <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  {job.description.substring(0, 100)}...
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Posted {job.posted}</span>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>

          {/* Job Details Sidebar */}
          <div className="job-details">
            <div className="details-header">
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{selectedJob.title}</h2>
              <div style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '4px' }}>{selectedJob.company}</div>
              <div style={{ color: 'var(--text-main)', marginBottom: '16px' }}>{selectedJob.location}</div>
              
              <div className="flex gap-4 mb-4">
                <button className="btn-primary apply-btn">Apply Now</button>
                <button className="btn-outline" style={{ border: '1px solid var(--border)', color: 'var(--text-main)' }}>Save Job</button>
              </div>
              
              <div className="flex items-center gap-4" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><DollarSign size={16} /> {selectedJob.salary}</span>
                <span className="flex items-center gap-1"><Clock size={16} /> {selectedJob.posted}</span>
              </div>
            </div>

            <div className="job-desc-content">
              <h3 className="section-title">Job Details</h3>
              <p>{selectedJob.description}</p>
              
              <h3 className="section-title" style={{ marginTop: '24px' }}>Full Job Description</h3>
              <p>We are seeking a talented and motivated <strong>{selectedJob.title}</strong> to join our growing team. As a key member of our engineering department, you will play a vital role in shaping the future of our technology stack.</p>
              
              <h3 className="section-title" style={{ marginTop: '24px' }}>Requirements</h3>
              <ul>
                {selectedJob.requirements.map((req, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{req}</li>
                ))}
              </ul>

              <h3 className="section-title" style={{ marginTop: '24px' }}>Benefits</h3>
              <ul>
                {selectedJob.benefits.map((benefit, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{benefit}</li>
                ))}
              </ul>

              <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Hiring Lab | Career Advice | Browse Jobs | Salaries | Indeed Events | Work at Indeed | Countries | About | Help Center
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  © 2026 JobCentre - Cookies, Privacy and Terms
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Simplified for Professional Look) */}
      <footer style={{ marginTop: '64px', borderTop: '1px solid var(--border)', padding: '32px 0', background: 'white' }}>
        <div className="container flex justify-between items-center">
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            © 2026 JobCentre. All rights reserved.
          </div>
          <div className="flex gap-4" style={{ fontSize: '14px' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
