import React from 'react';

const ProvStepper = ({ activeStep = 1 }) => {
  const steps = [
    { num: 1, label: 'Account' },
    { num: 2, label: 'Business' },
    { num: 3, label: 'Station' },
    { num: 4, label: 'Pricing' },
    { num: 5, label: 'Review' }
  ];

  const colors = {
    1: '#3B82F6',
    2: '#10B981',
    3: '#F59E0B',
    4: '#8B5CF6',
    5: '#3B82F6'
  };

  const currentColor = colors[activeStep] || '#3B82F6';

  return (
    <div className="w-full flex-col font-inter relative z-10">
      <div className="flex items-center justify-between mb-10 px-4 relative lg:px-0">
        {steps.map((s, i) => {
          const isActive = activeStep === s.num;
          const isCompleted = activeStep > s.num;

          return (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center relative z-10 group">
                {/* Visual Circle */}
                <div 
                   className={`w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center text-sm lg:text-[15px] font-extrabold border-2 transition-all duration-500 transform font-manrope ${
                      isActive
                        ? `shadow-lg scale-110` 
                        : isCompleted
                        ? 'text-[#050F1C]'
                        : 'bg-white/5 border-white/5 text-[#4E7A96]'
                   }`}
                   style={{ 
                      borderColor: (isActive || isCompleted) ? colors[s.num] : 'rgba(255,255,255,0.05)',
                      backgroundColor: isActive ? `${colors[s.num]}15` : isCompleted ? colors[s.num] : 'rgba(255,255,255,0.03)',
                      color: isActive ? colors[s.num] : isCompleted ? '#050F1C' : '#4E7A96'
                   }}
                >
                  {isCompleted ? '✓' : s.num}
                </div>

                {/* Subtitle / Title */}
                <div className={`absolute -bottom-8 w-24 text-center whitespace-nowrap transition-all duration-300 font-inter ${
                   isActive ? 'font-bold text-[10px] lg:text-[11px] opacity-100 translate-y-0' 
                   : 'text-[#4E7A96] font-semibold text-[10px] opacity-0 lg:opacity-60 -translate-y-1'
                }`} style={{ color: isActive ? colors[s.num] : '#4E7A96' }}>
                   {s.label}
                </div>
              </div>

              {/* Progress Line */}
              {i < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 lg:mx-4 relative overflow-hidden bg-white/10 rounded-full top-[1px]">
                  <div 
                    className="absolute inset-0 transition-all duration-700 ease-in-out shadow-sm"
                    style={{ 
                       width: isCompleted ? '100%' : '0%',
                       backgroundColor: colors[s.num]
                    }}
                  />
                  {isActive && <div className="absolute inset-0 animate-pulse transition-opacity" style={{ backgroundColor: `${currentColor}20` }}></div>}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Divider */}
      <div className="h-px bg-white/10 mx-2 mb-12 mt-12 hidden lg:block shadow-sm" />
    </div>
  );
};

export default ProvStepper;
