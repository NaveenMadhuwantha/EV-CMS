import React, { useState } from 'react';
import { X, Book, Zap, Shield, Layout, Settings, Activity, Cpu, Database, Palette, Code, Map, UserCheck, ChevronRight, Info, Terminal, GitBranch, Share2, Compass, Box, Layers, PlayCircle } from 'lucide-react';

const DocumentationModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('core');

  if (!isOpen) return null;

  const tabs = [
    { id: 'core', label: 'The Engine', icon: <Cpu className="w-4 h-4" /> },
    { id: 'modules', label: 'Feature Catalog', icon: <Box className="w-4 h-4" /> },
    { id: 'logic', label: 'Logic & Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'journeys', label: 'User Journeys', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'infra', label: 'Infra & UX', icon: <Layers className="w-4 h-4" /> }
  ];

  const content = {
    core: (
      <div className="space-y-12 animate-fade-in text-white/90 pb-20">
        <section>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA]">
                <Activity className="w-5 h-5" />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-widest font-manrope">System Bootstrap Mechanism</h3>
          </div>
          <p className="text-[#8AAFC8] leading-relaxed mb-8 border-l-2 border-white/5 pl-6 font-medium opacity-80">The VoltWay system is built on a <strong>Handshake-First Architecture</strong>. Before any UI is rendered, the system verifies its environment integrity through three layers of initialization.</p>
          
          <div className="space-y-6">
            <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 shadow-inner">
               <h4 className="text-[11px] font-black uppercase tracking-[4px] text-[#00D4AA] mb-6">Execution Chain (main.jsx)</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                     <span className="text-[10px] font-black text-white/40 uppercase">Phase 1</span>
                     <h5 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Strict Initialization</h5>
                     <p className="text-[11px] text-[#4E7A96] leading-relaxed">Vite compiles the JSX into ultra-fast browser instructions using <code>StrictMode</code> to detect legacy cycles.</p>
                  </div>
                  <div className="space-y-4">
                     <span className="text-[10px] font-black text-white/40 uppercase">Phase 2</span>
                     <h5 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Context Injection</h5>
                     <p className="text-[11px] text-[#4E7A96] leading-relaxed"><code>AuthProvider</code> creates a global singleton state. This ensures user data is synced *before* App routing begins.</p>
                  </div>
                  <div className="space-y-4">
                     <span className="text-[10px] font-black text-white/40 uppercase">Phase 3</span>
                     <h5 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Route Handshaking</h5>
                     <p className="text-[11px] text-[#4E7A96] leading-relaxed"><code>App.jsx</code> maps paths to components, but locks them behind <code>ProtectedRoute</code> guards.</p>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </div>
    ),
    modules: (
      <div className="space-y-12 animate-fade-in text-white/90 pb-20">
        <section>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Box className="w-5 h-5" />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-widest font-manrope">Feature Catalog: Granular Breakdown</h3>
          </div>
          <p className="text-[#8AAFC8] leading-relaxed mb-8 border-l-2 border-white/5 pl-6 italic opacity-70">"Feature Folders: Each folder is a self-contained business unit."</p>
          
          <div className="space-y-8">
            {/* Auth Feature */}
            <div className="p-8 rounded-[36px] bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all group">
               <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-black text-white uppercase tracking-widest">1. Auth Feature (`features/auth`)</h4>
                  <Shield className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
               </div>
               <p className="text-sm text-[#8AAFC8] leading-relaxed mb-6">The gateway feature. Manages <code>LoginPage</code>, <code>SignInPage</code>, and the <code>AuthContext</code>. It uses the <strong>Token-Profile-Sync Pattern</strong>: verifying the Firebase JWT token and immediately fetching the linked role-profile from Firestore.</p>
               <div className="flex gap-4">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black uppercase text-[#4E7A96]">Firebase Auth</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black uppercase text-[#4E7A96]">JWT Handling</span>
               </div>
            </div>

            {/* Admin Feature */}
            <div className="p-8 rounded-[36px] bg-white/[0.02] border border-white/5 hover:border-[#00D4AA]/20 transition-all group">
               <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-black text-white uppercase tracking-widest">2. Admin Core (`features/admin`)</h4>
                  <Activity className="w-5 h-5 text-[#00D4AA] group-hover:rotate-12 transition-transform" />
               </div>
               <p className="text-sm text-[#8AAFC8] leading-relaxed mb-6">The system's control center. It contains the <code>AdminDashboardPage</code> and atomic pages for <code>Analytics</code>, <code>UserManagement</code>, and <code>StationMaps</code>. <strong>Technique:</strong> It uses <strong>Component Compounding</strong> to share UI patterns without code duplication.</p>
               <div className="flex gap-4">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black uppercase text-[#4E7A96]">Real-time Analytics</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black uppercase text-[#4E7A96]">Node Mapping</span>
               </div>
            </div>

            {/* Registration Feature */}
            <div className="p-8 rounded-[36px] bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all group">
               <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-black text-white uppercase tracking-widest">3. Registration Grid (`features/registration`)</h4>
                  <UserCheck className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
               </div>
               <p className="text-sm text-[#8AAFC8] leading-relaxed mb-6">Divided into <code>owner</code> and <code>provider</code> sub-units. This handles the complex onboarding flows. <strong>Logic:</strong> Uses a <strong>State Pipeline</strong> where each step is a separate Route, yet they all feed into a single Firestore `writeBatch` at Step 5.</p>
            </div>
          </div>
        </section>
      </div>
    ),
    logic: (
      <div className="space-y-12 animate-fade-in text-white/90 pb-20">
        <section>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA]">
                <Shield className="w-5 h-5" />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-widest font-manrope">Deep Logic & Security Guard</h3>
          </div>
          
          <div className="space-y-8">
             <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5">
                <h4 className="text-[11px] font-black uppercase tracking-[4px] text-white/40 mb-6 font-manrope">The Protected Route Interceptor:</h4>
                <div className="bg-black/40 p-10 rounded-3xl font-mono text-[11px] leading-relaxed text-blue-300 border border-white/5">
                   const activeRole = devRole || role; <br /><br />
                   if (!devRole && !user) return &lt;Navigate to="/" replace /&gt;; <br />
                   if (allowedRoles && !allowedRoles.includes(activeRole)) return &lt;Navigate to="/dashboard" /&gt;;
                </div>
                <p className="mt-8 text-sm text-[#4E7A96] leading-relaxed">This logic ensures that even if a user knows the URL for the Admin Panel, the system checks their role in <strong>Synchronous Real-time</strong>. If the role doesn't match, they are physically bounced back to their allowed dashboard.</p>
             </div>
          </div>
        </section>
      </div>
    ),
    journeys: (
      <div className="space-y-12 animate-fade-in text-white/90 pb-20">
        <section>
           <h3 className="text-2xl font-black uppercase tracking-widest font-manrope mb-10 border-l-4 border-emerald-500 pl-6">End-to-End User Journeys</h3>
           <div className="space-y-6">
              <div className="p-8 rounded-[36px] bg-emerald-500/[0.03] border border-emerald-500/10">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Journey A: EV Owner Onboarding</h4>
                 <p className="text-xs text-[#8AAFC8] leading-relaxed opacity-70 mb-6">Landing Page &rarr; Selection: Owner &rarr; Register Pt 1 (Info) &rarr; Pt 2 (Account) &rarr; Pt 3 (Vehicle) &rarr; Dashboard.</p>
                 <div className="p-4 rounded-xl bg-black/20 text-[10px] text-emerald-400 font-mono">
                    System Logic: Firestore ID creation &rarr; Profile Sync &rarr; EV-Node Registration
                 </div>
              </div>

              <div className="p-8 rounded-[36px] bg-blue-500/[0.03] border border-blue-500/10">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Journey B: Provider Station Registration</h4>
                 <p className="text-xs text-[#8AAFC8] leading-relaxed opacity-70 mb-6">SignIn &rarr; Provider Flow &rarr; Biz Logic &rarr; Station Mapping &rarr; Pricing Logic &rarr; Review &rarr; GRID ACTIVE.</p>
                 <div className="p-4 rounded-xl bg-black/20 text-[10px] text-blue-400 font-mono">
                    System Logic: Business License Verification &rarr; Geolocation Snap &rarr; Station Live Broadcast
                 </div>
              </div>
           </div>
        </section>
      </div>
    ),
    infra: (
      <div className="space-y-12 animate-fade-in text-white/90 pb-20">
         <section>
            <h3 className="text-2xl font-black uppercase tracking-widest font-manrope mb-10 border-l-4 border-purple-500 pl-6">Infrastructure & UX Psychology</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h5 className="text-xs font-black text-white uppercase tracking-widest">Glassmorphism Hierarchy</h5>
                  <p className="text-[12px] text-[#4E7A96] leading-relaxed">Levels of blur: Header (3xl), Modals (2xl), Cards (xl). This creates a hierarchy of focus. Higher blur = Higher critical importance for the user.</p>
               </div>
               <div className="space-y-6">
                  <h5 className="text-xs font-black text-white uppercase tracking-widest">The Shadow Session</h5>
                  <p className="text-[12px] text-[#4E7A96] leading-relaxed">The <strong>Dev Switcher</strong> uses <code>sessionStorage</code> to maintain role persistent. This allows "Zero-Impact Coding" — testing roles without ever writing "test data" to the real database.</p>
               </div>
            </div>
         </section>
      </div>
    )
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[#050c14]/94 backdrop-blur-3xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-[1500px] h-[94vh] bg-[#0a1628]/98 border border-white/10 rounded-[50px] overflow-hidden shadow-[0_0_180px_rgba(0,0,0,1)] flex border-white/5">
        
        {/* Sidebar Tabs */}
        <aside className="w-20 lg:w-88 bg-white/[0.01] border-r border-white/5 flex flex-col pt-16 shrink-0">
          <div className="px-12 mb-20 hidden lg:block">
            <div className="flex items-center gap-5 mb-6">
               <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-[#00D4AA] to-blue-600 flex items-center justify-center text-[#050c14] shadow-2xl">
                  <Compass className="w-6 h-6" />
               </div>
               <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-manrope">OS Manual</h2>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     <p className="text-[9px] text-[#4E7A96] font-extrabold uppercase tracking-[6px] opacity-50">Grid System v3.2</p>
                  </div>
               </div>
            </div>
          </div>

          <nav className="flex-1 px-6 space-y-5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-center lg:justify-start gap-6 p-6 rounded-[32px] transition-all group relative overflow-hidden
                  ${activeTab === tab.id ? 'bg-[#00D4AA] text-[#050c14] shadow-2xl shadow-[#00D4AA]/20' : 'text-[#4E7A96] hover:bg-white/5 hover:text-white'}
                `}
              >
                <div className={`${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform shrink-0`}>
                   {tab.icon}
                </div>
                <span className="hidden lg:block text-[11px] font-black uppercase tracking-[4px] font-manrope">{tab.label}</span>
                {activeTab === tab.id && <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/20"></div>}
              </button>
            ))}
          </nav>

          <footer className="p-12 hidden lg:block border-t border-white/5">
             <div className="text-[9px] text-[#4E7A96] font-bold uppercase tracking-widest opacity-40 leading-relaxed mb-6 font-inter underline decoration-[#00D4AA]/20 underline-offset-8">
                Official Engineering <br /> Syllabus for Sri Lankan <br /> EV Infrastructure
             </div>
             <div className="flex items-center gap-6">
                <GitBranch className="w-4 h-4 text-emerald-500 opacity-60" />
                <Share2 className="w-4 h-4 text-blue-500 opacity-60" />
                <Settings className="w-4 h-4 text-purple-500 opacity-60" />
             </div>
          </footer>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00D4AA]/5 blur-[120px] pointer-events-none"></div>

          {/* Header */}
          <header className="px-16 py-14 flex items-center justify-between border-b border-white/5 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center text-[#00D4AA] shadow-2xl group transition-all hover:bg-[#00D4AA]/10">
                {tabs.find(t => t.id === activeTab).icon}
              </div>
              <div>
                 <h2 className="text-4xl font-black text-white uppercase tracking-widest font-manrope leading-none">
                   {tabs.find(t => t.id === activeTab).label}
                 </h2>
                 <div className="flex items-center gap-4 mt-5">
                    <span className="w-8 h-[2px] bg-[#00D4AA]/40"></span>
                    <p className="text-[10px] text-[#4E7A96] font-bold uppercase tracking-[6px] opacity-60 font-inter italic">Point-by-Point Technical Syllabus</p>
                 </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-16 h-16 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:rotate-90 shadow-2xl active:scale-90 group"
            >
              <X className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-16 lg:p-28 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent relative z-10">
            <div className="max-w-4xl mx-auto">
              {content[activeTab]}
            </div>

            {/* Final Study Summary Footer */}
            <div className="mt-40 pt-20 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="flex items-center gap-10">
                  <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-[#00D4AA] to-blue-600 flex items-center justify-center text-white shadow-2xl">
                     <Book className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                     <h5 className="text-[14px] font-black text-white uppercase tracking-widest font-manrope">Documentation Certification</h5>
                     <p className="text-[11px] text-[#4E7A96] font-bold uppercase tracking-[4px] opacity-50">Deep Study verified for grid version 3.2</p>
                  </div>
               </div>
               <div className="px-10 py-5 rounded-full bg-white/[0.03] border border-white/5 flex items-center gap-8">
                  <div className="flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[10px] text-white font-black uppercase tracking-widest">Logic: Verified</span>
                  </div>
                  <div className="w-px h-4 bg-white/10"></div>
                  <div className="flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                     <span className="text-[10px] text-white font-black uppercase tracking-widest">Arch: Verified</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;
