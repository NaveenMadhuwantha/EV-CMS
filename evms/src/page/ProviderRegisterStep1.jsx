import React from 'react';
import ProvSidebar from '../components/ProvSidebar';
import ProvStepper from '../components/ProvStepper';
import ProvAccountForm from '../components/ProvAccountForm';

const ProviderRegisterStep1 = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050F1C] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <ProvSidebar activeStep={1} />
      
      <div className="flex-1 flex flex-col items-center pt-10 pb-20 px-6 lg:pl-[500px] lg:pr-12 lg:pt-16 min-h-screen relative z-0">
        <div className="w-full max-w-[500px] animate-fade-in text-left">
          <ProvStepper activeStep={1} />
          <div className="relative">
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none"></div>
             <ProvAccountForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegisterStep1;
