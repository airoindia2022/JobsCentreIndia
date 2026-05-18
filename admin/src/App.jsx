import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Jobs from './pages/Jobs';
import Settings from './pages/Settings';
import DangerZone from './pages/DangerZone';
import Login from './pages/Login';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index         element={<Dashboard />} />
            <Route path="users"    element={<Users />} />
            <Route path="jobs"     element={<Jobs />} />
            <Route path="settings" element={<Settings />} />
            <Route path="danger"   element={<DangerZone />} />
          </Route>
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
