import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './page/Loging.jsx';
import SignIn from './page/SignIn.jsx';
import RegisterStep1 from './page/RegisterStep1.jsx';
import RegisterStep2 from './page/RegisterStep2.jsx';
import RegisterStep3 from './page/RegisterStep3.jsx';
import RegisterStep4 from './page/RegisterStep4.jsx';
import ProviderRegisterStep1 from './page/ProviderRegisterStep1.jsx';
import ProviderRegisterStep2 from './page/ProviderRegisterStep2.jsx';
import ProviderRegisterStep3 from './page/ProviderRegisterStep3.jsx';
import ProviderRegisterStep4 from './page/ProviderRegisterStep4.jsx';
import ProviderRegisterStep5 from './page/ProviderRegisterStep5.jsx';
import Profile from './page/Profile.jsx';
import AdminDashboard from './page/admin/Dashboard.jsx';
import OwnerDashboard from './page/owner/OwnerDashboard.jsx';
import ProviderDashboard from './page/provider/ProviderDashboard.jsx';
import { Analytics, StationMap, Stations, BookSlot, UserManagement, Transactions, Commission } from './page/admin/AdminPages.jsx';
import Explore from './page/Explore.jsx';
import { useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;
  
  return children;
};

const DashboardHub = () => {
  const { role } = useAuth();
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'provider') return <Navigate to="/provider/dashboard" replace />;
  if (role === 'owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  const { user } = useAuth();
  
  return (
    <Router>
      <div className="min-h-screen bg-[#050F1C]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/register" element={<RegisterStep1 />} />
          <Route path="/register/step2" element={<RegisterStep2 />} />
          <Route path="/register/step3" element={<RegisterStep3 />} />
          <Route path="/register/step4" element={<RegisterStep4 />} />
          <Route path="/provider/register" element={<ProviderRegisterStep1 />} />
          <Route path="/provider/register/step2" element={<ProviderRegisterStep2 />} />
          <Route path="/provider/register/step3" element={<ProviderRegisterStep3 />} />
          <Route path="/provider/register/step4" element={<ProviderRegisterStep4 />} />
          <Route path="/provider/register/step5" element={<ProviderRegisterStep5 />} />

          {/* Protected Main Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardHub /></ProtectedRoute>} />
          <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/provider/dashboard" element={<ProtectedRoute allowedRoles={['provider']}><ProviderDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin & Higher Level Routes */}
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin', 'provider']}><Analytics /></ProtectedRoute>} />
          <Route path="/admin/map" element={<ProtectedRoute><StationMap /></ProtectedRoute>} />
          <Route path="/admin/stations" element={<ProtectedRoute allowedRoles={['admin', 'provider']}><Stations /></ProtectedRoute>} />
          <Route path="/admin/booking" element={<ProtectedRoute><BookSlot /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['admin', 'provider']}><Transactions /></ProtectedRoute>} />
          <Route path="/admin/commission" element={<ProtectedRoute allowedRoles={['admin', 'provider']}><Commission /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;