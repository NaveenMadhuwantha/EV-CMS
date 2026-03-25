import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegSidebar from '../components/RegSidebar';
import RegStepper from '../components/RegStepper';
import PersonalInfoForm from '../components/PersonalInfoForm';

const RegisterStep2 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-[#F0F6FF] font-dm bg-[#050F1C] overflow-x-hidden">
      <RegSidebar 
        image="https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&q=80&w=1000"
        title={<><span className="text-white">Profile</span><br /><span className="text-blue-400">Identity Node</span><br /><span className="text-white">Setup</span></>}
        stepTag="Owner Identification"
        tagColor="text-blue-400"
        tagBg="bg-blue-400/10"
        tagBorder="border-blue-400/20"
        description="We use your personal details to ensure account security and provide accurate local charging recommendations."
      />

      <div className="flex-1 flex flex-col items-center pt-10 pb-20 px-6 lg:pl-[500px] lg:pr-12 lg:pt-16 min-h-screen relative z-0">
        <div className="w-full max-w-[500px] animate-fade-in">
          <div className="mb-12">
            <RegStepper currentStep={2} />
          </div>
          <div className="relative">
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none"></div>
             <PersonalInfoForm onBack={() => navigate('/register')} onNext={() => navigate('/register/step3')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep2;
