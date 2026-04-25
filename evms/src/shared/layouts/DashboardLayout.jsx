import React from 'react';
import UnifiedSidebar from '../components/UnifiedSidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-[#050c14] text-[#e2eaf8] font-inter selection:bg-[#00d2b4]/30 overflow-x-hidden flex">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden z-0">
        <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[500px] bg-[#00d2b4]/5 blur-[140px]" />
        <div className="absolute bottom-0 left-[300px] w-[500px] h-[500px] bg-[#0094ff]/3 blur-[140px]" />
      </div>

      <UnifiedSidebar />
      <main className="ml-[280px] flex-1 min-h-screen relative z-10 flex flex-col">
        <Topbar title={title} />
        <div className="p-8 lg:p-12 animate-fade-up flex-1">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
