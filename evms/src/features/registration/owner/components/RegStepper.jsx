import React from 'react';

const RegStepper = ({ currentStep = 1, totalSteps = 4, stepTitles = ['Account', 'Personal', 'Vehicle', 'Confirm'] }) => {
  return (
    <div className="w-full flex flex-col font-inter relative z-10">
      <div className="flex items-center justify-between mb-8 relative px-4 lg:px-0">
        {stepTitles.map((title, i) => {
          const stepNum = i + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <React.Fragment key={stepNum}>
              <div className="flex flex-col items-center relative z-10 group">
                {/* Visual Circle */}
                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-lg lg:text-xl font-extrabold border-2 transition-all duration-500 transform font-manrope ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 text-[#3B82F6] shadow-lg scale-110'
                    : isCompleted
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] group-hover:bg-white/10 transition-all cursor-default'
                }`}>
                  {isCompleted ? '✓' : stepNum}
                </div>

                {/* Subtitle / Title */}
                <div className={`absolute -bottom-10 w-24 text-center whitespace-nowrap transition-all duration-300 font-inter ${
                   isActive ? 'text-[#3B82F6] font-bold text-[14px] lg:text-[15px] opacity-100 translate-y-0' 
                   : 'text-[#64748B] font-semibold text-[13px] opacity-0 lg:opacity-60 -translate-y-1'
                }`}>
                   {title}
                </div>
              </div>

              {/* Progress Line */}
              {i < totalSteps - 1 && (
                <div className="flex-1 h-[2px] mx-2 lg:mx-4 relative overflow-hidden bg-white/10 rounded-full top-[1px]">
                  <div 
                    className="absolute inset-0 bg-blue-600 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                  {isActive && <div className="absolute inset-0 bg-blue-600/20 animate-pulse transition-opacity"></div>}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Divider */}
      <div className="h-px bg-[#F8FAFC] mx-2 mb-6 mt-6 hidden lg:block" />
    </div>
  );
};

export default RegStepper;





