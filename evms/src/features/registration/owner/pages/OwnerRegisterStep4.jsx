import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegSidebar from '../components/RegSidebar';
import RegStepper from '../components/RegStepper';
import ReviewConfirmForm from '../../provider/components/ReviewConfirmForm';

const RegisterStep4 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-[#0F172A] font-inter bg-[#FDF8EE] overflow-x-hidden">
      <RegSidebar 
        image="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000"
        title={<><span className="text-[#0F172A]">Review Your</span><br /><span className="text-[#3B82F6]">Ecosystem</span><br /><span className="text-[#0F172A]">Setup</span></>}
        stepTag="Finalization Module"
        tagColor="text-[#3B82F6]"
        tagBg="bg-blue-50"
        tagBorder="border-blue-500/20"
        description="Verify your configuration before deploying your profile to the Sri Lankan EV Network."
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col items-center pt-10 pb-20 px-6 lg:pl-[500px] lg:pr-12 lg:pt-16 min-h-screen relative z-0">
        <div className="w-full max-w-[500px] animate-fade-in">
          {/* Stepper Header */}
          <div className="mb-6">
            <RegStepper currentStep={4} />
          </div>

          {/* Form Component */}
          <div className="relative">
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-600/5 blur-[100px] pointer-events-none"></div>
             <ReviewConfirmForm onBack={() => navigate('/register/step3')} onComplete={() => console.log('Done')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep4;
