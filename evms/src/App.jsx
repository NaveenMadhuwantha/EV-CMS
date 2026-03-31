import React, { useEffect } from 'react';
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
import { Analytics, StationMap, Stations, BookSlot, UserManagement, Transactions, Commission, ServiceProviders } from './page/admin/AdminPages.jsx';
import Explore from './page/Explore.jsx';
import { useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  // DEV SWITCHER LOGIC
  const params = new URLSearchParams(window.location.search);
  const devRole = params.get('devRole');
  const activeRole = devRole || role;

  if (loading) return null;
  // If devRole is set, completely bypass real user check so user can see UI
  if (!devRole && !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(activeRole) && activeRole !== 'all') return <Navigate to="/dashboard" replace />;

  return children;
};

const DevSwitcher = () => (
  <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-500 to-orange-500 text-black px-6 py-2 flex justify-between items-center text-[11px] font-black uppercase tracking-widest font-inter shadow-xl">
    <div>👷 DEV VISUAL MODE (NO LOGIN REQUIRED)</div>
    <div className="flex gap-4">
      <a href="/admin/dashboard?devRole=admin" className="hover:text-white transition-colors">👁 View as Admin</a>
      <a href="/provider/dashboard?devRole=provider" className="hover:text-white transition-colors">👁 View as Provider</a>
      <a href="/owner/dashboard?devRole=owner" className="hover:text-white transition-colors">👁 View as Owner</a>
      <a href="/login?devRole=clear" className="ml-4 pl-4 border-l border-black/20 hover:text-white transition-colors">✕ Exit Config</a>
    </div>
  </div>
);

const DashboardStation = () => {
  const { role } = useAuth();
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'provider') return <Navigate to="/provider/dashboard" replace />;
  if (role === 'owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

const DevRedirect = ({ role, path }) => {
  sessionStorage.setItem('devRole', role);
  window.location.href = `${path}?devRole=${role}`;
  return null;
};

function App() {
  const { user } = useAuth();
  useEffect(() => {
    console.log("hello");
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#050F1C]">
        <DevSwitcher />
        <Routes>
          {/* Dedicated Dev Links to prevent chat UI from stripping query parameters */}
          <Route path="/dev/all" element={<DevRedirect role="all" path="/admin/dashboard" />} />
          <Route path="/dev/admin" element={<DevRedirect role="admin" path="/admin/dashboard" />} />
          <Route path="/dev/provider" element={<DevRedirect role="provider" path="/provider/dashboard" />} />
          <Route path="/dev/owner" element={<DevRedirect role="owner" path="/owner/dashboard" />} />

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
          <Route path="/dashboard" element={<ProtectedRoute><DashboardStation /></ProtectedRoute>} />
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
          <Route path="/admin/providers" element={<ProtectedRoute allowedRoles={['admin']}><ServiceProviders /></ProtectedRoute>} />
          <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['admin', 'provider']}><Transactions /></ProtectedRoute>} />
          <Route path="/admin/commission" element={<ProtectedRoute allowedRoles={['admin', 'provider']}><Commission /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;