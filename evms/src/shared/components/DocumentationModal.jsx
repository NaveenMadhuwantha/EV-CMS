import React, { useState } from 'react';
import { X, Activity, Cpu, Database, Palette, Code, Shield, PlayCircle, Layers, Box, Zap, Compass, GitBranch, Share2, Settings } from 'lucide-react';

const Card = ({ title, icon, colorText = "text-[#0F172A]", hoverBorder = "hover:border-[#3B82F6]/30", children, wide = false }) => (
  <div className={`p-10 rounded-[48px] bg-white border border-[#E2E8F0] shadow-xl transition-all ${hoverBorder} ${wide ? 'md:col-span-2' : ''} relative overflow-hidden group`}>
    <h4 className={`text-xl font-black uppercase tracking-[3px] ${colorText} mb-6 flex items-center gap-4 border-b border-[#E2E8F0] pb-6 relative z-10 font-manrope`}>
      {icon} {title}
    </h4>
    <div className="text-[#64748B] text-[17px] leading-relaxed relative z-10 font-medium">
      {children}
    </div>
  </div>
);

const Header = ({ title, icon, colorText, colorBg, desc }) => (
  <div className="mb-16">
    <div className="flex items-center gap-5 mb-10">
       <div className={`w-14 h-14 rounded-2xl ${colorBg} flex items-center justify-center ${colorText} shadow-inner border border-black/5`}>
          {icon}
       </div>
       <h3 className="text-5xl font-black uppercase tracking-tighter font-manrope text-[#0F172A]">{title}</h3>
    </div>
    <p className={`text-[#64748B] border-l-4 border-[#3B82F6]/20 pl-8 text-xl font-medium leading-relaxed`}>{desc}</p>
  </div>
);

const DocumentationModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('core');
  if (!isOpen) return null;

  const tabs = [
    { id: 'core', label: 'The Engine', icon: <Cpu className="w-5 h-5" /> },
    { id: 'modules', label: 'Feature Catalog', icon: <Box className="w-5 h-5" /> },
    { id: 'logic', label: 'Logic & Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'journeys', label: 'User Journeys', icon: <PlayCircle className="w-5 h-5" /> },
    { id: 'infra', label: 'Infra & UX', icon: <Layers className="w-5 h-5" /> }
  ];

  const content = {
    core: (
      <div className="animate-fade-in pb-32">
        <Header 
          title="System Architecture" 
          icon={<Activity className="w-6 h-6"/>} colorText="text-[#10B981]" colorBg="bg-emerald-50"
          desc="VoltWay runs on a real-time serverless architecture. React + Vite powers the UI, while Firebase provides a live document database with custom optimization layers for speed."
        />
        <div className="space-y-10">
          <Card title="Data Engine (coreDb)" icon={<Database className="w-6 h-6"/>} colorText="text-emerald-600" hoverBorder="hover:border-emerald-500/30">
            <p className="mb-4">The coreDb wrapper is the system's absolute gatekeeper. It standardizes all network traffic, injecting secure timestamps and handling offline sync automatically.</p>
            <p>This ensures 100% data integrity across all global nodes, even during temporary connection drops.</p>
          </Card>
          <Card title="NoSQL Data Models" icon={<Layers className="w-6 h-6"/>} colorText="text-blue-600" hoverBorder="hover:border-blue-500/30">
            <p className="mb-4">We use a flat NoSQL model for millisecond queries without complex joins. Data is logically segmented into three core collections:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Users:</strong> Profile states, roles (Owner/Provider/Admin), and system status.</li>
              <li><strong>Stations:</strong> Geospatial node data and live hardware availability.</li>
              <li><strong>Bookings:</strong> A high-velocity ledger for all charging session lifecycles.</li>
            </ul>
          </Card>
          <Card title="Bi-Directional Streams" icon={<Zap className="w-6 h-6"/>} colorText="text-amber-600" hoverBorder="hover:border-amber-500/30">
            <p>Using Firestore onSnapshot, database updates are pushed directly to users. This triggers instant UI, alert, and map changes globally without a page refresh.</p>
          </Card>
        </div>
      </div>
    ),
    modules: (
      <div className="animate-fade-in pb-32">
        <Header 
          title="Feature Orchestration" 
          icon={<Box className="w-6 h-6"/>} colorText="text-blue-400" colorBg="bg-blue-500/10"
          desc="The platform uses strict Role-Based Segregation. This isolates core logic into three distinct territories, ensuring users only execute code specific to their account level."
        />
        <div className="space-y-10">
          <Card title="1. Owner Environment" colorText="text-emerald-600" hoverBorder="hover:border-emerald-500/30">
            <p className="mb-4">Focused on consumption and mapping. It mounts a Map Interface using Leaflet to help drivers find compatible stations based on their vehicle's battery and connector type.</p>
            <p>Drivers can track live session countdowns and manage vehicle profiles through dedicated logic modules.</p>
          </Card>
          <Card title="2. Provider Center" colorText="text-blue-600" hoverBorder="hover:border-blue-500/30">
            <p className="mb-4">Designed for business logistics. Providers use the Approval Board to manage driver requests and deployment tools to inject new hardware nodes into the network.</p>
            <p>Includes revenue tracking and station status management for industrial-scale EV node operations.</p>
          </Card>
          <Card title="3. Global Admin Room" colorText="text-purple-600" hoverBorder="hover:border-purple-500/30">
            <p className="mb-4">The highest clearance level. Admins use the User Grid to manage accounts and the Broadcast Engine to flash alerts to the entire network.</p>
            <p>Handles the Business Upgrade pipeline, approving Provider status requests and executing cascading account mutations.</p>
          </Card>
        </div>
      </div>
    ),
    logic: (
      <div className="animate-fade-in pb-32">
        <Header 
          title="Security & Logic" 
          icon={<Shield className="w-6 h-6"/>} colorText="text-purple-600" colorBg="bg-purple-50"
          desc="Advanced React context and routing guards protect the platform from unauthorized access and data corruption."
        />
        <div className="space-y-10">
          <Card title="Route Interceptors" colorText="text-[#0F172A]">
            <p className="mb-4">The Protected Route Guard verifies authentication and roles before a component renders. It blocks unauthorized navigation attempts at the execution layer.</p>
            <p>If an Owner attempts to enter the Admin suite, the system aborts the cycle and redirects them back to a safe zone.</p>
          </Card>
          <Card title="Phased Registration" colorText="text-[#0F172A]">
            <p className="mb-4">The complex Provider form uses sessionStorage for staging progress. This prevents incomplete noise from polluting the database.</p>
            <p>Data is committed to the cloud as a single atomic request only after the final 'Confirm' handshake is received.</p>
          </Card>
          <Card title="The 'Dev Switcher'" colorText="text-[#0F172A]">
            <p>A non-destructive tool for demonstrations. It spoofs UI roles in local memory to show different layouts without corrupting actual backend database records.</p>
          </Card>
        </div>
      </div>
    ),
    journeys: (
      <div className="animate-fade-in pb-32">
        <Header 
          title="Logic Scenario Tracing" 
          icon={<PlayCircle className="w-6 h-6"/>} colorText="text-emerald-600" colorBg="bg-emerald-50"
          desc="Breakdowns of how common user actions trigger end-to-end backend execution chains."
        />
        <div className="space-y-10">
          <Card title="A: Booking Workflow" colorText="text-emerald-600" hoverBorder="hover:border-emerald-500/30">
            <ul className="space-y-3">
              <li><strong>Push:</strong> Driver requests a slot. Engine locks the entry as PENDING in the global ledger.</li>
              <li><strong>Alert:</strong> Websocket pings the station Provider with a targeted push notification.</li>
              <li><strong>Action:</strong> Provider clicks 'Approve', triggering an atomic document patch across Firestore.</li>
              <li><strong>Sync:</strong> Driver's listener detects the mutation, instantly updating their UI with the confirmed booking.</li>
            </ul>
          </Card>
          <Card title="B: Business Upgrade" colorText="text-blue-600" hoverBorder="hover:border-blue-500/30">
             <ul className="space-y-3">
              <li><strong>Apply:</strong> Driver submits credentials. Data is quarantined in a holding collection for audit.</li>
              <li><strong>Audit:</strong> Admin reviews the specs and triggers a systemic account mutation.</li>
              <li><strong>Swap:</strong> The user's role flag is updated from 'owner' to 'provider' across the database.</li>
              <li><strong>Morph:</strong> Upon next login, the Auth context detects the new tier and unlocks the Provider suite.</li>
            </ul>
          </Card>
        </div>
      </div>
    ),
    infra: (
      <div className="animate-fade-in pb-32">
        <Header 
          title="Infra & Interface Mechanics" 
          icon={<Layers className="w-6 h-6"/>} colorText="text-orange-600" colorBg="bg-orange-50"
          desc="Merging high-velocity Vite architecture with visually pristine Glassmorphism aesthetics."
        />
        <div className="space-y-10">
          <Card title="Vite & Rollup Performance" colorText="text-emerald-600" hoverBorder="hover:border-emerald-500/30">
            <p>Vite ensures ultra-fast development via Hot Module Replacement. Rollup optimizes the final build, stripping unused code to ensure millisecond download times.</p>
          </Card>
          <Card title="Perceived Speed" colorText="text-orange-600" hoverBorder="hover:border-orange-500/30">
            <p>Ghostly layout skeletons pulse while data fetches, eliminating screen jumps. This 'Perceived Performance' makes the app feel instantaneous on any connection.</p>
          </Card>
          <Card title="Glassmorphism Design" colorText="text-amber-600" hoverBorder="hover:border-amber-500/30">
             <p className="mb-4">We use multi-layered alphas and back-drop blurs to create depth, directing user focus toward critical foreground data panels.</p>
             <p>Atomic Component design ensures that buttons, modals, and grids maintain 100% visual consistency throughout the platform.</p>
          </Card>
        </div>
      </div>
    )
  };  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-[1500px] h-[94vh] bg-[#FDF8EE] border border-[#E2E8F0] rounded-[64px] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.2)] flex">
        
        {/* Sidebar Tabs */}
        <aside className="w-20 lg:w-96 bg-white border-r border-[#E2E8F0] flex flex-col pt-16 shrink-0">
          <div className="px-12 mb-20 hidden lg:block">
            <div className="flex items-center gap-6 mb-6">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-blue-600 flex items-center justify-center text-white shadow-xl">
                  <Compass className="w-7 h-7" />
               </div>
               <div>
                  <h2 className="text-3xl font-black text-[#0F172A] uppercase tracking-tighter font-manrope">OS Manual</h2>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     <p className="text-[9px] text-[#94A3B8] font-extrabold uppercase tracking-[6px]">Grid System v3.2</p>
                  </div>
               </div>
            </div>
          </div>

          <nav className="flex-1 px-8 space-y-5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-center lg:justify-start gap-6 p-6 rounded-[32px] transition-all group relative overflow-hidden
                  ${activeTab === tab.id ? 'bg-[#3B82F6] text-white shadow-2xl shadow-blue-500/30' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'}
                `}
              >
                <div className={`${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform shrink-0`}>
                   {tab.icon}
                </div>
                <span className="hidden lg:block text-[11px] font-black uppercase tracking-[4px] font-manrope">{tab.label}</span>
                {activeTab === tab.id && <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/30"></div>}
              </button>
            ))}
          </nav>

          <footer className="p-12 hidden lg:block border-t border-[#E2E8F0] bg-[#F8FAFC]">
             <div className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-widest leading-relaxed mb-6 font-inter underline decoration-[#3B82F6]/20 underline-offset-8">
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
        <div className="flex-1 flex flex-col relative bg-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3B82F6]/5 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
          {/* Header */}
          <header className="px-16 py-14 flex items-center justify-between border-b border-[#E2E8F0] relative z-10 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-[28px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#3B82F6] shadow-inner group transition-all hover:bg-blue-50">
                {tabs.find(t => t.id === activeTab).icon}
              </div>
              <div>
                 <h2 className="text-4xl font-black text-[#0F172A] uppercase tracking-tighter font-manrope leading-none">
                   {tabs.find(t => t.id === activeTab).label}
                 </h2>
                 <div className="flex items-center gap-4 mt-5">
                    <span className="w-8 h-[2px] bg-[#3B82F6]/30"></span>
                    <p className="text-[10px] text-[#94A3B8] font-black uppercase tracking-[6px] font-inter italic">Point-by-Point Technical Syllabus</p>
                 </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-16 h-16 rounded-[28px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all hover:rotate-90 shadow-sm active:scale-90 group"
            >
              <X className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-16 lg:p-28 scrollbar-thin scrollbar-thumb-[#E2E8F0] scrollbar-track-transparent relative z-10">
            <div className="max-w-4xl mx-auto">
              {content[activeTab]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;
