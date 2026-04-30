import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegSidebar from '../components/RegSidebar';
import RegStepper from '../components/RegStepper';
import AccountForm from '../components/AccountForm';

const RegisterStep1 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-[#0F172A] font-inter bg-[#FDF8EE] overflow-x-hidden">
      {/* SIDEBAR / HEADER */}
      <RegSidebar 
        title={<><span className="text-[#0F172A]">Power Up Your</span><br /><span className="text-[#3B82F6]">EV Journey</span><br /><span className="text-[#0F172A]">Today</span></>}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col items-center pt-10 pb-20 px-6 lg:pl-[400px] lg:pr-16 lg:pt-16 min-h-screen relative z-0">
        <div className="w-full max-w-[860px] animate-fade-in">
          {/* Stepper Header */}
          <div className="mb-6">
            <RegStepper currentStep={1} />
          </div>

          {/* Form Component */}
          <div className="relative">
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none"></div>
             <AccountForm onNext={() => navigate('/register/step2')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep1;





