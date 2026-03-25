import React from 'react';
import ProvSidebar from '../components/ProvSidebar';
import ProvStepper from '../components/ProvStepper';
import ProvBusinessForm from '../components/ProvBusinessForm';

const ProviderRegisterStep2 = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0A0F1E] text-white selection:bg-[#34D399]/30">
      <ProvSidebar activeStep={2} />
      <div className="flex-1 overflow-y-auto px-6 py-12 flex justify-center items-start lg:items-center">
        <div className="w-full max-w-[500px] fade-up">
          <ProvStepper activeStep={2} />
          <ProvBusinessForm />
        </div>
      </div>
    </div>
  );
};

export default ProviderRegisterStep2;
