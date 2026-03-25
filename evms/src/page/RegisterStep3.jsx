import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegSidebar from '../components/RegSidebar';
import RegStepper from '../components/RegStepper';
import EVDetailsForm from '../components/EVDetailsForm';

const RegisterStep3 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-[#F0F6FF] font-dm bg-[#050F1C]">
      {/* LEFT PANEL */}
      <RegSidebar 
        image="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=80"
        stepTag="Vehicle Verification"
        tagColor="text-[#F59E0B]"
        tagBg="bg-[#F59E0B]/10"
        tagBorder="border-[#F59E0B]/25"
        title={<><span className="text-white">Vehicle</span><br /><span className="text-[#F59E0B]">Details</span><br /><span className="text-white">Required</span></>}
        description="Providing accurate vehicle information helps us match you with the right chargers and calculate charging costs effectively."
        opacity="opacity-30"
      />

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[500px]">
          <div className="mb-10">
            <RegStepper currentStep={3} />
          </div>
          <EVDetailsForm onBack={() => navigate('/register/step2')} onNext={() => navigate('/register/step4')} />
        </div>
      </div>
    </div>
  );
};

export default RegisterStep3;
