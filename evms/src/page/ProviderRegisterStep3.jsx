import React from 'react';
import ProvSidebar from '../components/ProvSidebar';
import ProvStepper from '../components/ProvStepper';
import ProvStationForm from '../components/ProvStationForm';

const ProviderRegisterStep3 = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0A0F1E] text-white selection:bg-[#3B82F6]/30">
      <ProvSidebar />
      <div className="flex-1 overflow-y-auto px-6 py-12 flex justify-center items-start lg:items-center">
        <div className="w-full max-w-[500px]">
          <ProvStepper activeStep={3} />
          <ProvStationForm />
        </div>
      </div>
    </div>
  );
};

export default ProviderRegisterStep3;
