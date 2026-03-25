import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  // බටන් එක click කළාම Role එක set කරලා process එක open කරන function එක
  const handleRegisterClick = (role) => {
    if (role === 'EV Owner') {
      navigate('/register');
    } else if (role === 'Provider') {
      navigate('/provider/register');
    }
  };

  return (
    <div className="min-h-screen bg-[#050F1C] text-white flex flex-col font-dm overflow-x-hidden">
      
      {/* 1. Header */}
      <header className="w-full p-8 lg:px-16 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#00D4AA,#4FFFB0)', boxShadow: '0 0 20px rgba(0,212,170,0.3)' }}>
            ⚡
          </div>
          <div>
            <div className="font-syne text-lg font-extrabold text-white">VoltWay</div>
            <div className="text-[10px] text-[#4E7A96] uppercase tracking-widest leading-none">Charge Management</div>
          </div>
        </div>

        
        <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Network</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <button onClick={() => navigate('/signin')} className="px-8 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">Sign In</button>
        </nav>
      </header>

      {/* 2. Main Hero Section */}
      <main className="flex-grow flex items-center px-6 lg:px-16 py-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

          
          {/* Left Side: Image & Info */}
          <div className="flex flex-col items-center gap-10 w-full">
            <div className="relative w-full max-w-[650px]">
              <div className="rounded-[48px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] aspect-[16/10] bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000" 
                  alt="EV Charging" 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>

              {/* Active Fleet Badge */}
              <div className="absolute top-8 right-8 bg-[#0d1425]/95 backdrop-blur-xl border border-white/10 p-4 pr-8 rounded-[24px] flex items-center gap-4 shadow-2xl scale-110">
                <div className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                  <span className="text-white text-xl">👤</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-[2px]">Active Fleet</p>
                  <p className="text-xl font-bold">12,842 Units</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-10 lg:gap-14">
              {[
                { icon: '⚡', label: 'Instant Power' },
                { icon: '🌿', label: '100% Green' },
                { icon: '🔋', label: 'Smart Grid' }
              ].map((tag, i) => (
                <div key={i} className="flex items-center gap-3 text-[12px] font-bold text-gray-400 uppercase tracking-[2px]">
                  <span className="text-[#00E5D4] text-lg">{tag.icon}</span> {tag.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Titles & Wider Buttons */}
          <div className="flex flex-col items-center lg:items-start space-y-12">
            <div className="space-y-6">
              <div className="inline-block px-5 py-2 bg-[#00E5D4]/10 border border-[#00E5D4]/20 rounded-full text-center lg:text-left">
                <p className="text-[11px] font-black text-[#00E5D4] uppercase tracking-[5px]">The future of energy</p>
              </div>
              
              <h1 className="font-syne text-6xl md:text-7xl xl:text-8xl font-extrabold leading-[1] tracking-tight text-center lg:text-left text-white">
                Empower <br/> your <br/>
                <span className="bg-gradient-to-r from-[#00D4AA] to-[#A3E635] bg-clip-text text-transparent">Journey.</span>
              </h1>
            </div>

            {/* Register Buttons - handleRegisterClick function එක මෙතනට සම්බන්ධ කර ඇත */}
            <div className="space-y-5 w-full max-w-md lg:max-w-lg">
              <button 
                onClick={() => handleRegisterClick('EV Owner')}
                className="w-full flex items-center justify-between px-10 py-6 bg-[#00E5D4] text-black font-black text-lg rounded-full hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-cyan-500/20 group"
              >
                <span className="flex items-center gap-4">⚡ Register as EV Owner</span>
                <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
              </button>
              
              <button 
                onClick={() => handleRegisterClick('Provider')}
                className="w-full flex items-center justify-between px-10 py-6 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-full hover:bg-white/10 active:scale-95 transition-all group"
              >
                <span className="flex items-center gap-4">⛽ Register as Provider</span>
                <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-md lg:max-w-lg text-sm text-gray-500 font-semibold gap-6 px-4">
              <p>Already managed? <span onClick={() => navigate('/signin')} className="text-[#00E5D4] cursor-pointer hover:underline font-bold">Log in here</span></p>
              <span className="cursor-pointer hover:text-white transition-colors">Forgot password?</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Register Process Component removed as we now route to /register */}

    </div>
  );
};

export default Login;