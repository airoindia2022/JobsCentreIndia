import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, User, Mail, Lock, Briefcase, UserCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
    companyName: '',
    companyDescription: '',
    website: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await register(formData);
      if (user.role === 'seeker') {
        navigate('/');
      } else {
        navigate('/provider-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual register-v">
        <div className="visual-content">
          <Link to="/" className="logo light">
            <Zap size={40} fill="currentColor" />
            <span>Job Center India</span>
          </Link>
          <div className="visual-text">
            <h1>Start your journey <br />with us today.</h1>
            <p>Create an account and unlock access to premium features designed to accelerate your growth.</p>
          </div>
          <div className="v-features">
            <div className="v-feature">
              <Zap size={20} />
              <span>Instant Job Alerts</span>
            </div>
            <div className="v-feature">
              <User size={20} />
              <span>Smart Resume Builder</span>
            </div>
            <div className="v-feature">
              <Briefcase size={20} />
              <span>Direct Employer Chat</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="glass-card">
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Join the future of hiring in India</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="role-selection">
                <div 
                  className={`role-card ${formData.role === 'seeker' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('seeker')}
                >
                  <UserCircle size={24} />
                  <span>Job Seeker</span>
                </div>
                <div 
                  className={`role-card ${formData.role === 'provider' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('provider')}
                >
                  <Briefcase size={24} />
                  <span>Employer</span>
                </div>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={20} className="input-icon" />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Enter your full name"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={20} className="input-icon" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="name@example.com"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={20} className="input-icon" />
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="Create a strong password"
                    required 
                  />
                </div>
              </div>

              {formData.role === 'provider' && (
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>🏢 Company Details</h3>
                  
                  <div className="form-group">
                    <label>Company Name</label>
                    <div className="input-with-icon">
                      <Briefcase size={20} className="input-icon" />
                      <input 
                        type="text" 
                        name="companyName"
                        value={formData.companyName} 
                        onChange={handleChange} 
                        placeholder="e.g. Acme Corporation"
                        required={formData.role === 'provider'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Company Website</label>
                    <div className="input-with-icon">
                      <Briefcase size={20} className="input-icon" style={{ opacity: 0.7 }} />
                      <input 
                        type="url" 
                        name="website"
                        value={formData.website} 
                        onChange={handleChange} 
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Headquarters Location</label>
                    <div className="input-with-icon">
                      <Briefcase size={20} className="input-icon" style={{ opacity: 0.7 }} />
                      <input 
                        type="text" 
                        name="location"
                        value={formData.location} 
                        onChange={handleChange} 
                        placeholder="e.g. Bangalore, India"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Company Description</label>
                    <textarea 
                      name="companyDescription"
                      value={formData.companyDescription} 
                      onChange={handleChange} 
                      placeholder="Brief description about your company's mission and culture..."
                      rows={3}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem 1rem', 
                        borderRadius: '0.75rem', 
                        border: '1px solid var(--border)', 
                        background: 'var(--white)',
                        color: 'var(--text-main)',
                        fontFamily: 'inherit',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                      }}
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-page {
          display: flex;
          min-height: 100vh;
          background: var(--bg-main);
        }
        
        .auth-visual {
          flex: 1.2;
          background: linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: white;
        }

        .visual-content {
          max-width: 600px;
        }

        .visual-text h1 {
          font-size: 4rem;
          font-weight: 800;
          margin: 3rem 0 1.5rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .visual-text p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        .v-features {
          display: grid;
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .v-feature {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .v-feature svg {
          color: var(--primary-light);
        }

        .auth-form-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .auth-form-container {
          width: 100%;
          max-width: 480px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .auth-header h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .role-selection {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .role-card {
          padding: 1rem;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-muted);
          box-shadow: var(--shadow-sm);
        }

        .role-card:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: var(--text-main);
        }

        .role-card.active {
          background: #f0f2ff;
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
        }

        .input-with-icon input {
          padding-left: 3rem;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--error);
          padding: 1rem;
          border-radius: 0.75rem;
          margin-bottom: 2rem;
          text-align: center;
          font-size: 0.875rem;
        }

        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          color: var(--text-muted);
        }

        .auth-footer a {
          color: var(--primary-light);
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .auth-visual {
            display: none;
          }
        }
      ` }} />
    </div>
  );
};

export default Register;

