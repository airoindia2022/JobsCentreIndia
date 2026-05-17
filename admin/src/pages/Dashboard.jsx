import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
  <div className="stat-card card">
    <div className="stat-card-header">
      <div>
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
      <div className={`stat-icon-wrapper ${trendUp ? 'positive' : 'negative'}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="stat-footer">
      <span className={`trend ${trendUp ? 'text-green' : 'text-red'}`}>
        {trendUp ? '↑' : '↓'} {trend}
      </span>
      <span className="text-muted">vs last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://back.jobscenterindia.com/api/admin/stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          setError('Failed to fetch stats');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="dashboard"><div className="page-header"><h1>Loading Dashboard...</h1></div></div>;
  }

  if (error) {
    return <div className="dashboard"><div className="page-header"><h1 className="text-red">{error}</h1></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <button className="btn btn-primary">Generate Report</button>
      </div>
      
      <div className="stats-grid">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          trend="12.5%" 
          trendUp={true} 
        />
        <StatCard 
          title="Total Jobs" 
          value={stats?.totalJobs || 0} 
          icon={Briefcase} 
          trend="5.2%" 
          trendUp={true} 
        />
        <StatCard 
          title="Active Jobs" 
          value={stats?.activeJobs || 0} 
          icon={TrendingUp} 
          trend="2.4%" 
          trendUp={true} 
        />
        <StatCard 
          title="Total Applications" 
          value={stats?.totalApplications || 0} 
          icon={FileText} 
          trend="8.1%" 
          trendUp={true} 
        />
      </div>

      <div className="dashboard-content">
        <div className="card recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <p className="empty-state">No recent activity to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
