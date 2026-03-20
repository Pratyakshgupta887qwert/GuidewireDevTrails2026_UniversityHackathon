import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OTPVerification from './components/auth/OTPVerification';
import WorkerDashboardPage from './pages/WorkerDashboard';
import AdminDashboardPage from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          
          <Route 
            path="/worker-dashboard/*" 
            element={<ProtectedRoute><WorkerDashboardPage /></ProtectedRoute>} 
          />
          
          <Route 
            path="/admin-dashboard/*" 
            element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;