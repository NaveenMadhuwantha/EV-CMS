import React, { useState } from 'react';
import RegSidebar from '../components/RegSidebar';
import RegStepper from '../components/RegStepper';
import ReviewConfirmForm from '../components/ReviewConfirmForm';

const RegisterStep4 = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen text-[#F0F6FF] font-dm bg-[#050F1C]">
      {/* LEFT PANEL - Hidden on success */}
      {!isSuccess && (
        <RegSidebar 
          image="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=900&q=80"
          stepTag="Final Step"
          tagColor="text-[#8B5CF6]"
          tagBg="bg-[#8B5CF6]/10"
          tagBorder="border-[#8B5CF6]/25"
          title={<><span className="text-white">Almost</span><br /><span className="text-[#8B5CF6]">There!</span><br /><span className="text-white">Review All</span></>}
          description="Take a moment to review all your information before completing registration. You can go back to edit any section."
          opacity="opacity-25"
        />
      )}

      {/* RIGHT PANEL - Full width on success */}
      <div className={`flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto ${isSuccess ? 'w-full px-4' : ''}`}>
        <div className={`w-full ${isSuccess ? 'max-w-none' : 'max-w-[500px]'}`}>
          {!isSuccess && (
            <div className="mb-10">
              <RegStepper currentStep={4} />
            </div>
          )}
          <ReviewConfirmForm onComplete={() => setIsSuccess(true)} />
        </div>
      </div>
    </div>
  );
};



export default RegisterStep4;
