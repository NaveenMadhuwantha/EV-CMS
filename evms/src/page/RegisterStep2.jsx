import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegSidebar from '../components/RegSidebar';
import RegStepper from '../components/RegStepper';
import PersonalInfoForm from '../components/PersonalInfoForm';

const RegisterStep2 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-[#F0F6FF] font-dm bg-[#050F1C]">
      {/* LEFT PANEL */}
      <RegSidebar 
        image="https://images.unsplash.com/photo-1510172951991-856a654063f9?w=900&q=80"
        stepTag="Developer Access"
        tagColor="text-[#38BDF8]"
        tagBg="bg-[#38BDF8]/10"
        tagBorder="border-[#38BDF8]/25"
        title={<><span className="text-white">Profile</span><br /><span className="text-[#38BDF8]">Identity</span><br /><span className="text-white">Verified</span></>}
        description="We use your personal details to ensure account security and provide accurate local charging recommendations."
        opacity="opacity-30"
      />

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[500px]">
          <div className="mb-10">
            <RegStepper currentStep={2} />
          </div>
          <PersonalInfoForm onBack={() => navigate('/register')} onNext={() => navigate('/register/step3')} />
        </div>
      </div>
    </div>
  );
};


export default RegisterStep2;
