import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegSidebar from '../components/RegSidebar';
import RegStepper from '../components/RegStepper';
import EVDetailsForm from '../components/EVDetailsForm';

const RegisterStep3 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-[#0F172A] font-inter bg-[#FDF8EE] overflow-x-hidden">
      <RegSidebar 
        image="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000"
        title={<><span className="text-[#0F172A]">Configure Your</span><br /><span className="text-amber-500">Hardware</span><br /><span className="text-[#0F172A]">Station</span></>}
        stepTag="Vehicle Configuration"
        tagColor="text-amber-600"
        tagBg="bg-amber-50"
        tagBorder="border-amber-500/20"
        description="Register your electric vehicle to optimize charging schedules and find compatible power ports."
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col items-center pt-10 pb-20 px-6 lg:pl-[400px] lg:pr-16 lg:pt-16 min-h-screen relative z-0">
        <div className="w-full max-w-[860px] animate-fade-in">
          {/* Stepper Header */}
          <div className="mb-6">
            <RegStepper currentStep={3} />
          </div>

          {/* Form Component */}
          <div className="relative">
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none"></div>
             <EVDetailsForm onBack={() => navigate('/register/step2')} onNext={() => navigate('/register/step4')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep3;





