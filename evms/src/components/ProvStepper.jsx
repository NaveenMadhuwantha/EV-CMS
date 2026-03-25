import React from 'react';

const ProvStepper = ({ activeStep }) => {
  const steps = [
    { num: 1, label: 'Account', sub: 'Credentials' },
    { num: 2, label: 'Business', sub: 'Company Info' },
    { num: 3, label: 'Station', sub: 'Details' },
    { num: 4, label: 'Pricing', sub: '& Schedule' },
    { num: 5, label: 'Confirm', sub: 'Review' }
  ];

  return (
    <div className="flex items-center mb-10 w-full overflow-x-auto no-scrollbar pb-2">
      {steps.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div 
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                activeStep > s.num 
                  ? 'border-[#3B82F6] bg-[#3B82F6] text-white shadow-[0_0_14px_rgba(59,130,246,0.35)]' 
                  : activeStep === s.num
                  ? (activeStep === 4 ? 'border-[#A78BFA] bg-[#A78BFA]/12 text-[#A78BFA] shadow-[0_0_14px_rgba(167,139,250,0.25)]'
                    : activeStep === 3 ? 'border-[#FBBF24] bg-[#FBBF24]/12 text-[#FBBF24] shadow-[0_0_14px_rgba(251,191,36,0.25)]'
                    : activeStep === 2 ? 'border-[#34D399] bg-[#34D399]/12 text-[#34D399] shadow-[0_0_14px_rgba(52,211,153,0.25)]'
                    : 'border-[#3B82F6] bg-[#3B82F6]/12 text-[#3B82F6] shadow-[0_0_14px_rgba(59,130,246,0.25)]')
                  : 'bg-white/4 border-white/10 text-[#475569]'
              }`}
            >
              {activeStep > s.num ? '✓' : s.num}
            </div>
            <div className="hidden sm:block">
              <div 
                className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  activeStep > s.num ? 'text-[#3B82F6]' 
                  : activeStep === s.num ? (activeStep === 4 ? 'text-[#A78BFA]' : activeStep === 3 ? 'text-[#FBBF24]' : activeStep === 2 ? 'text-[#34D399]' : 'text-[#3B82F6]')
                  : 'text-[#475569]'
                }`}
              >
                {s.label}
              </div>
              <div 
                className={`text-[11px] whitespace-nowrap transition-colors ${
                  activeStep > s.num ? 'text-[#60A5FA]' : activeStep === s.num ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}
              >
                {activeStep > s.num ? 'Done' : s.sub}
              </div>
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-[2px] flex-1 min-w-[20px] mx-2 rounded-full transition-colors duration-500 ${
              activeStep > s.num ? 'bg-[#3B82F6] shadow-[0_0_6px_rgba(59,130,246,0.4)]' : 'bg-white/5'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProvStepper;
