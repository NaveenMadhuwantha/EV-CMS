import React, { useState } from 'react';
import { X, Activity, Cpu, Database, Palette, Code, Shield, PlayCircle, Layers, Box, Zap, Compass, GitBranch, Share2, Settings } from 'lucide-react';

const Card = ({ title, icon, colorText = "text-white", hoverBorder = "hover:border-white/30", children, wide = false }) => (
  <div className={`p-10 rounded-[32px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 shadow-2xl transition-all ${hoverBorder} ${wide ? 'md:col-span-2' : ''} relative overflow-hidden`}>
    <h4 className={`text-xl font-black uppercase tracking-[3px] ${colorText} mb-6 flex items-center gap-3 border-b border-white/10 pb-4 relative z-10`}>
      {icon} {title}
    </h4>
    <div className="text-[#8AAFC8] text-lg leading-relaxed relative z-10">
      {children}
    </div>
  </div>
);

const Header = ({ title, icon, colorText, colorBg, desc }) => (
  <div className="mb-12">
    <div className="flex items-center gap-4 mb-8">
       <div className={`w-12 h-12 rounded-xl ${colorBg} flex items-center justify-center ${colorText} shadow-2xl`}>
          {icon}
       </div>
       <h3 className="text-4xl font-black uppercase tracking-widest font-manrope text-white">{title}</h3>
    </div>
    <p className={`text-[#8AAFC8] border-l-4 border-white/20 pl-6 text-xl font-light`}>{desc}</p>
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
          icon={<Activity className="w-6 h-6"/>} colorText="text-[#00D4AA]" colorBg="bg-[#00D4AA]/10"
          desc="VoltWay runs on a real-time serverless architecture. React + Vite powers the UI, while Firebase provides a live document database with custom optimization layers for speed."
        />
        <div className="space-y-8">
          <Card title="Data Engine (coreDb)" icon={<Database className="w-6 h-6"/>} colorText="text-[#00D4AA]" hoverBorder="hover:border-[#00D4AA]/30">
            <p className="mb-4">The coreDb wrapper is the system's absolute gatekeeper. It standardizes all network traffic, injecting secure timestamps and handling offline sync automatically.</p>
            <p>This ensures 100% data integrity across all global nodes, even during temporary connection drops.</p>
          </Card>
          <Card title="NoSQL Data Models" icon={<Layers className="w-6 h-6"/>} colorText="text-blue-400" hoverBorder="hover:border-blue-400/30">
            <p className="mb-4">We use a flat NoSQL model for millisecond queries without complex joins. Data is logically segmented into three core collections:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Users:</strong> Profile states, roles (Owner/Provider/Admin), and system status.</li>
              <li><strong>Stations:</strong> Geospatial node data and live hardware availability.</li>
              <li><strong>Bookings:</strong> A high-velocity ledger for all charging session lifecycles.</li>
            </ul>
          </Card>
          <Card title="Bi-Directional Streams" icon={<Zap className="w-6 h-6"/>} colorText="text-amber-400" hoverBorder="hover:border-amber-400/30">
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
        <div className="space-y-8">
          <Card title="1. Owner Environment" colorText="text-emerald-400" hoverBorder="hover:border-emerald-500/30">
            <p className="mb-4">Focused on consumption and mapping. It mounts a Map Interface using Leaflet to help drivers find compatible stations based on their vehicle's battery and connector type.</p>
            <p>Drivers can track live session countdowns and manage vehicle profiles through dedicated logic modules.</p>
          </Card>
          <Card title="2. Provider Center" colorText="text-blue-400" hoverBorder="hover:border-blue-500/30">
            <p className="mb-4">Designed for business logistics. Providers use the Approval Board to manage driver requests and deployment tools to inject new hardware nodes into the network.</p>
            <p>Includes revenue tracking and station status management for industrial-scale EV node operations.</p>
          </Card>
          <Card title="3. Global Admin Room" colorText="text-purple-400" hoverBorder="hover:border-purple-500/30">
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
          icon={<Shield className="w-6 h-6"/>} colorText="text-purple-400" colorBg="bg-purple-500/10"
          desc="Advanced React context and routing guards protect the platform from unauthorized access and data corruption."
        />
        <div className="space-y-8">
          <Card title="Route Interceptors" colorText="text-white">
            <p className="mb-4">The Protected Route Guard verifies authentication and roles before a component renders. It blocks unauthorized navigation attempts at the execution layer.</p>
            <p>If an Owner attempts to enter the Admin suite, the system aborts the cycle and redirects them back to a safe zone.</p>
          </Card>
          <Card title="Phased Registration" colorText="text-white">
            <p className="mb-4">The complex Provider form uses sessionStorage for staging progress. This prevents incomplete noise from polluting the database.</p>
            <p>Data is committed to the cloud as a single atomic request only after the final 'Confirm' handshake is received.</p>
          </Card>
          <Card title="The 'Dev Switcher'" colorText="text-white">
            <p>A non-destructive tool for demonstrations. It spoofs UI roles in local memory to show different layouts without corrupting actual backend database records.</p>
          </Card>
        </div>
      </div>
    ),
    journeys: (
      <div className="animate-fade-in pb-32">
        <Header 
          title="Logic Scenario Tracing" 
          icon={<PlayCircle className="w-6 h-6"/>} colorText="text-emerald-400" colorBg="bg-emerald-500/10"
          desc="Breakdowns of how common user actions trigger end-to-end backend execution chains."
        />
        <div className="space-y-8">
          <Card title="A: Booking Workflow" colorText="text-emerald-400" hoverBorder="hover:border-emerald-500/30">
            <ul className="space-y-3">
              <li><strong>Push:</strong> Driver requests a slot. Engine locks the entry as PENDING in the global ledger.</li>
              <li><strong>Alert:</strong> Websocket pings the station Provider with a targeted push notification.</li>
              <li><strong>Action:</strong> Provider clicks 'Approve', triggering an atomic document patch across Firestore.</li>
              <li><strong>Sync:</strong> Driver's listener detects the mutation, instantly updating their UI with the confirmed booking.</li>
            </ul>
          </Card>
          <Card title="B: Business Upgrade" colorText="text-blue-400" hoverBorder="hover:border-blue-500/30">
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
          icon={<Layers className="w-6 h-6"/>} colorText="text-orange-400" colorBg="bg-orange-500/10"
          desc="Merging high-velocity Vite architecture with visually pristine Glassmorphism aesthetics."
        />
        <div className="space-y-8">
          <Card title="Vite & Rollup Performance" colorText="text-emerald-400" hoverBorder="hover:border-emerald-500/30">
            <p>Vite ensures ultra-fast development via Hot Module Replacement. Rollup optimizes the final build, stripping unused code to ensure millisecond download times.</p>
          </Card>
          <Card title="Perceived Speed" colorText="text-orange-400" hoverBorder="hover:border-orange-500/30">
            <p>Ghostly layout skeletons pulse while data fetches, eliminating screen jumps. This 'Perceived Performance' makes the app feel instantaneous on any connection.</p>
          </Card>
          <Card title="Glassmorphism Design" colorText="text-amber-400" hoverBorder="hover:border-amber-400/30">
             <p className="mb-4">We use multi-layered alphas and back-drop blurs to create depth, directing user focus toward critical foreground data panels.</p>
             <p>Atomic Component design ensures that buttons, modals, and grids maintain 100% visual consistency throughout the platform.</p>
          </Card>
        </div>
      </div>
    )
  };  return (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;
