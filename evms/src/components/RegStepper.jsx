import React from 'react';

const RegStepper = ({ currentStep = 1, totalSteps = 4, stepTitles = ['Account', 'Personal', 'Vehicle', 'Confirm'] }) => {
  return (
    <div className="w-full flex-col font-dm relative z-10">
      <div className="flex items-center justify-between mb-8 px-2 relative px-4 lg:px-0">
        {stepTitles.map((title, i) => {
          const stepNum = i + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <React.Fragment key={stepNum}>
              <div className="flex flex-col items-center relative z-10 group">
                {/* Visual Circle */}
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center text-sm lg:text-base font-black border-2 transition-all duration-500 transform ${
                  isActive
                    ? 'border-[#00D4AA] bg-[#00D4AA]/10 text-[#00D4AA] shadow-[0_0_30px_rgba(0,212,170,0.3)] scale-110'
                    : isCompleted
                    ? 'border-[#00D4AA] bg-gradient-to-br from-[#00D4AA] to-[#00A882] text-[#050F1C]'
                    : 'bg-white/5 border-white/10 text-[#4E7A96] group-hover:bg-white/10 group-hover:border-white/20 transition-all cursor-default'
                }`}>
                  {isCompleted ? '✓' : stepNum}
                </div>

                {/* Subtitle / Title (Responsive Desktop) */}
                <div className={`absolute -bottom-7 w-20 text-center whitespace-nowrap transition-all duration-300 ${
                   isActive ? 'text-[#00D4AA] font-bold text-[10px] lg:text-[11px] opacity-100 translate-y-0' 
                   : 'text-[#4E7A96] font-semibold text-[10px] opacity-0 lg:opacity-60 -translate-y-1'
                }`}>
                   {title}
                </div>
              </div>

              {/* Progress Line */}
              {i < totalSteps - 1 && (
                <div className="flex-1 h-0.5 mx-2 lg:mx-4 relative overflow-hidden bg-white/10 rounded-full top-[1px]">
                  <div 
                    className="absolute inset-0 bg-[#00D4AA] transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(0,212,170,0.5)]"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                  {/* Subtle Background line glow when active step passes through */}
                  {isActive && <div className="absolute inset-0 bg-[#00D4AA]/30 animate-pulse transition-opacity"></div>}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Divider */}
      <div className="h-px bg-white/5 mx-2 mb-10 mt-12 hidden lg:block" />
    </div>
  );
};

export default RegStepper;
