import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProvSidebar from '../components/ProvSidebar';
import ProvStepper from '../components/ProvStepper';
import ProvAccountForm from '../components/ProvAccountForm';

const ProviderRegisterStep1 = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    // navigate('/provider/register/step2');
    console.log("Navigate to Provider Step 2");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0A0F1E] text-white selection:bg-[#3B82F6]/30">
      <ProvSidebar />
      
      <div className="flex-1 overflow-y-auto px-6 py-12 flex justify-center items-start lg:items-center">
        <div className="w-full max-w-[500px]">
          <ProvStepper activeStep={1} />
          <ProvAccountForm onNext={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default ProviderRegisterStep1;
