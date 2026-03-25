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


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050F1C]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<RegisterStep1 />} />
          <Route path="/register/step2" element={<RegisterStep2 />} />
          <Route path="/register/step3" element={<RegisterStep3 />} />
          <Route path="/register/step4" element={<RegisterStep4 />} />
          <Route path="/provider/register" element={<ProviderRegisterStep1 />} />
          <Route path="/provider/register/step2" element={<ProviderRegisterStep2 />} />
          <Route path="/provider/register/step3" element={<ProviderRegisterStep3 />} />
          <Route path="/provider/register/step4" element={<ProviderRegisterStep4 />} />
          <Route path="/provider/register/step5" element={<ProviderRegisterStep5 />} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;