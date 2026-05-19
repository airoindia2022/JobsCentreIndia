import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'seeker') {
        navigate('/');
      } else {
        navigate('/provider-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="visual-content">
          <Link to="/" className="logo light">
            <Zap size={40} fill="currentColor" />
            <span>Job Center India</span>
          </Link>
          <div className="visual-text">
            <h1>Elevate your career <br />to new heights.</h1>
            <p>Join India's most advanced job ecosystem. Connect with top employers and discover opportunities that match your potential.</p>
          </div>
          <div className="visual-stats">
            <div className="v-stat">
              <span className="v-num">50k+</span>
              <span className="v-label">Active Jobs</span>
            </div>
            <div className="v-stat">
              <span className="v-num">12k+</span>
              <span className="v-label">Companies</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="glass-card">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your professional profile</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={20} className="input-icon" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@example.com"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ marginBottom: 0 }}>Password</label>
                  <Link to="#" className="forgot-password">Forgot password?</Link>
                </div>
                <div className="input-with-icon">
                  <Lock size={20} className="input-icon" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="auth-footer">
              New to Job Center India? <Link to="/register">Create an account</Link>
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
          background: linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200');
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

        .visual-stats {
          display: flex;
          gap: 3rem;
          margin-top: 4rem;
        }

        .v-num {
          display: block;
          font-size: 2rem;
          font-weight: 700;
        }

        .v-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .auth-form-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
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

        .forgot-password {
          font-size: 0.875rem;
          color: var(--primary-light);
          font-weight: 500;
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

        @media (max-width: 1024px) {
          .auth-visual {
            display: none;
          }
        }
      ` }} />
    </div>
  );
};

export default Login;

