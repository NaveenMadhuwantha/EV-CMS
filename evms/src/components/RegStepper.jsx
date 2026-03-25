import React from 'react';

const RegStepper = ({ currentStep = 1 }) => {
  const steps = [
    { num: 1, title: 'Account', subtitle: 'Login Details' },
    { num: 2, title: 'Personal', subtitle: 'Profile Info' },
    { num: 3, title: 'Vehicle', subtitle: 'EV Details' },
    { num: 4, title: 'Confirm', subtitle: 'Review' },
  ];

  return (
    <div className="flex items-center w-full no-scrollbar relative font-dm">
      {steps.map((step, i) => (
        <React.Fragment key={step.num}>
          <div className="flex items-center gap-3 shrink-0">
            {/* Number Circle */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
              currentStep === step.num
                ? 'border-[#00D4AA] bg-[#00D4AA]/10 text-[#00D4AA] shadow-[0_0_15px_rgba(0,212,170,0.2)]'
                : currentStep > step.num
                ? 'border-[#00D4AA] bg-gradient-to-br from-[#00D4AA] to-[#00A882] text-[#050F1C]'
                : 'bg-white/5 border-white/10 text-gray-500'
            }`}>
              {currentStep > step.num ? '✓' : step.num}
            </div>

            {/* Labels - Hidden on tiny mobile, shown as title only on small mobile */}
            <div className="hidden xs:block">
              <div className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${currentStep >= step.num ? 'text-[#00D4AA]' : 'text-gray-500'}`}>
                {step.title}
              </div>
              <div className={`text-[11px] hidden md:block transition-colors ${currentStep >= step.num ? 'text-gray-400' : 'text-gray-600'}`}>
                {step.subtitle}
              </div>
            </div>
          </div>

          {/* Line Connectors */}
          {i < steps.length - 1 && (
            <div className={`h-[2px] flex-1 mx-3 min-w-[12px] rounded-full transition-all duration-500 ${currentStep > step.num ? 'bg-[#00D4AA]' : 'bg-white/5'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};


export default RegStepper;
