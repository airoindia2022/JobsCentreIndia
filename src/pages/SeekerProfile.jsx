import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Phone, FileText, Briefcase, Code, Globe, Link as LinkIcon, Save, ArrowLeft, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import '../App.css';

const SeekerProfile = () => {
  const { user, login } = useContext(AuthContext); // Use login to update context user
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    experience: '',
    skills: '', // will handle as comma separated string
    portfolio: '',
    profileImg: '',
    resumeLink: '',
    resumeFile: '',
    resumeFileName: '',
    projects: []
  });

  const [resumeUploadType, setResumeUploadType] = useState('link'); // 'link' or 'file'

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'seeker') {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const config = {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        };
        const res = await axios.get('https://back.jobscenterindia.com/api/auth/user', config);
        const u = res.data;
        
        setProfileData({
          name: u.name || '',
          phone: u.profile?.phone || '',
          experience: u.profile?.experience || '',
          skills: u.profile?.skills?.join(', ') || '',
          portfolio: u.profile?.portfolio || '',
          profileImg: u.profile?.profileImg || '',
          resumeLink: u.profile?.resumeLink || '',
          resumeFile: u.profile?.resumeFile || '',
          resumeFileName: u.profile?.resumeFileName || '',
          projects: u.profile?.projects || []
        });

        if (u.profile?.resumeFile) {
          setResumeUploadType('file');
        } else {
          setResumeUploadType('link');
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    if (type === 'resume' && file.type !== 'application/pdf') {
      alert('Only PDF files are allowed for resume');
      return;
    }

    if (type === 'profileImg' && !file.type.startsWith('image/')) {
      alert('Only image files are allowed for profile picture');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'resume') {
        setProfileData({ ...profileData, resumeFile: reader.result, resumeFileName: file.name, resumeLink: '' });
      } else if (type === 'profileImg') {
        setProfileData({ ...profileData, profileImg: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProject = () => {
    setProfileData({
      ...profileData,
      projects: [...profileData.projects, { name: '', link: '', description: '' }]
    });
  };

  const handleRemoveProject = (index) => {
    const newProjects = [...profileData.projects];
    newProjects.splice(index, 1);
    setProfileData({ ...profileData, projects: newProjects });
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...profileData.projects];
    newProjects[index][field] = value;
    setProfileData({ ...profileData, projects: newProjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') 
        }
      };

      const payload = {
        ...profileData,
        skills: profileData.skills.split(',').map(s => s.trim()).filter(s => s) // Convert to array
      };

      const res = await axios.put('https://back.jobscenterindia.com/api/auth/profile', payload, config);
      
      // Update local storage user if needed
      login(localStorage.getItem('token'), { ...user, name: res.data.name });
      
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(99,102,241,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <header style={{ padding: '1.5rem 0', background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>My Profile</h1>
          </div>
        </div>
      </header>

      <section className="section" style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {message && (
            <div style={{ padding: '1rem', marginBottom: '1.5rem', background: message.includes('success') ? '#dcfce7' : '#fee2e2', color: message.includes('success') ? '#166534' : '#991b1b', borderRadius: '0.5rem', fontWeight: 600 }}>
              {message}
            </div>
          )}

          <div className="glass-card" style={{ background: '#ffffff', borderRadius: '1.25rem', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)', padding: '2.5rem' }}>
            <form onSubmit={handleSubmit}>
              
              {/* Profile Image Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    {profileData.profileImg ? (
                      <img src={profileData.profileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={48} color="#cbd5e1" />
                    )}
                  </div>
                  <label style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                    <ImageIcon size={18} />
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profileImg')} style={{ display: 'none' }} />
                  </label>
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Profile Picture</h2>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Upload a professional photo to stand out to employers. (Max 5MB)</p>
                </div>
              </div>

              <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} color="var(--primary)" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    value={profileData.name} 
                    onChange={e => setProfileData({...profileData, name: e.target.value})} 
                    required 
                    style={{ background: '#f8fafc' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={16} color="var(--primary)" /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    value={profileData.phone} 
                    onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                    style={{ background: '#f8fafc' }}
                  />
                </div>
              </div>

              <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={16} color="var(--primary)" /> Total Experience
                  </label>
                  <input 
                    type="text" 
                    value={profileData.experience} 
                    onChange={e => setProfileData({...profileData, experience: e.target.value})} 
                    placeholder="e.g. 3 Years, Fresher, etc."
                    style={{ background: '#f8fafc' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={16} color="var(--primary)" /> Portfolio / Website Link
                  </label>
                  <input 
                    type="url" 
                    value={profileData.portfolio} 
                    onChange={e => setProfileData({...profileData, portfolio: e.target.value})} 
                    placeholder="https://yourwebsite.com"
                    style={{ background: '#f8fafc' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code size={16} color="var(--primary)" /> Skills (Comma separated)
                </label>
                <input 
                  type="text" 
                  value={profileData.skills} 
                  onChange={e => setProfileData({...profileData, skills: e.target.value})} 
                  placeholder="React, Node.js, Python, Marketing..."
                  style={{ background: '#f8fafc' }}
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} color="var(--primary)" /> Resume
                </h3>
                <div className="form-group">
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="radio" 
                        name="resumeType" 
                        checked={resumeUploadType === 'link'} 
                        onChange={() => { setResumeUploadType('link'); setProfileData({ ...profileData, resumeFile: '', resumeFileName: '' }); }}
                      />
                      Provide Link
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="radio" 
                        name="resumeType" 
                        checked={resumeUploadType === 'file'} 
                        onChange={() => { setResumeUploadType('file'); setProfileData({ ...profileData, resumeLink: '' }); }}
                      />
                      Upload PDF
                    </label>
                  </div>

                  {resumeUploadType === 'link' ? (
                    <input 
                      type="url" 
                      value={profileData.resumeLink} 
                      onChange={e => setProfileData({...profileData, resumeLink: e.target.value})} 
                      placeholder="https://drive.google.com/file/d/..."
                      style={{ background: '#f8fafc' }}
                    />
                  ) : (
                    <div className="file-upload-container" style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: '100%' }}>
                      <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload(e, 'resume')}
                        style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                      />
                      <div style={{ padding: '1rem', background: '#f8fafc', border: '2px dashed var(--border)', borderRadius: '0.5rem', textAlign: 'center' }}>
                        {profileData.resumeFileName ? (
                          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{profileData.resumeFileName}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Click or drag a PDF file to upload (Max 5MB)</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Briefcase size={20} color="var(--primary)" /> Projects
                  </h3>
                  <button type="button" onClick={handleAddProject} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Plus size={16} /> Add Project
                  </button>
                </div>
                
                {profileData.projects.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '0.5rem', border: '1px dashed var(--border)' }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>No projects added yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {profileData.projects.map((proj, index) => (
                      <div key={index} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <h4 style={{ margin: 0, fontWeight: 600 }}>Project {index + 1}</h4>
                          <button type="button" onClick={() => handleRemoveProject(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.9rem' }}>Project Name</label>
                            <input 
                              type="text" 
                              value={proj.name} 
                              onChange={(e) => handleProjectChange(index, 'name', e.target.value)} 
                              style={{ background: '#ffffff', padding: '0.5rem' }}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.9rem' }}><LinkIcon size={12} /> Link</label>
                            <input 
                              type="url" 
                              value={proj.link} 
                              onChange={(e) => handleProjectChange(index, 'link', e.target.value)} 
                              placeholder="https://..."
                              style={{ background: '#ffffff', padding: '0.5rem' }}
                            />
                          </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.9rem' }}>Description</label>
                          <textarea 
                            value={proj.description} 
                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)} 
                            rows={2}
                            style={{ background: '#ffffff', padding: '0.5rem', resize: 'vertical' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', fontSize: '1.05rem' }}
                >
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SeekerProfile;
