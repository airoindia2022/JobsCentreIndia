import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('https://back.jobscenterindia.com/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      // Verify the user is an admin
      if (user && user.role === 'admin') {
        localStorage.setItem('token', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        addToast('Welcome back, Admin!', 'success');
        navigate('/');
      } else {
        setError('Access Denied: You do not have administrator privileges.');
        addToast('Access Denied: Admin role required', 'error');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || 'Invalid credentials or server unreachable.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-backdrop-glow" />
      <div className="login-container">
        <div className="glass-card login-card">
          <div className="login-header">
            <div className="brand-logo">
              <Shield size={28} color="#fff" />
            </div>
            <h2>Job Center India</h2>
            <p>Admin Portal Gateway</p>
          </div>

          {error && (
            <div className="login-error-alert">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Admin Email</label>
              <div className="login-input-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="login-input"
                  placeholder="admin@jobscenterindia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 28 }}>
              <label className="form-label">Password</label>
              <div className="login-input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner-sm" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Console
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
