import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegSidebar from '../components/RegSidebar';

import RegStepper from '../components/RegStepper';
import AccountForm from '../components/AccountForm';

const RegisterStep1 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-[#F0F6FF] font-dm bg-[#050F1C]">
      {/* LEFT PANEL */}
      <RegSidebar 
        title={<><span className="text-white">Power Up Your</span><br /><span className="text-[#00D4AA]">EV Journey</span><br /><span className="text-white">Today</span></>}
      />

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          <div className="mb-10">
            <RegStepper currentStep={1} />
          </div>
          <AccountForm onNext={() => navigate('/register/step2')} />
        </div>
      </div>
    </div>
  );
};

export default RegisterStep1;
