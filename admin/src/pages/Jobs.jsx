import React, { useState, useEffect } from 'react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://back.jobscenterindia.com/api/admin/jobs');
        const data = await response.json();
        if (data.success) {
          setJobs(data.jobs);
        } else {
          setError('Failed to fetch jobs');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="jobs-page">
      <div className="page-header">
        <h1>Manage Jobs</h1>
      </div>
      <div className="card">
        {loading ? (
          <p className="text-muted">Loading jobs...</p>
        ) : error ? (
          <p className="text-red">{error}</p>
        ) : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '12px' }}>Title</th>
                <th style={{ padding: '12px' }}>Company</th>
                <th style={{ padding: '12px' }}>Location</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Posted</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{job.title}</td>
                  <td style={{ padding: '12px' }}>{job.company}</td>
                  <td style={{ padding: '12px' }}>{job.location}</td>
                  <td style={{ padding: '12px' }}><span style={{textTransform: 'capitalize'}}>{job.status}</span></td>
                  <td style={{ padding: '12px' }}>{new Date(job.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>No jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Jobs;
