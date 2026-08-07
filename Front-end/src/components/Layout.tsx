import React, { useState } from 'react';
import Sidebar from './SideBar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Estado de la Sidebar (true = desplegada, false = colapsada)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-dark-bg text-gris-calido flex overflow-x-hidden">
      
      {/* SIDEBAR QUE SE ENCOGE O DESLIZA */}
      <div 
        className={`
          transition-all duration-300 ease-in-out z-40 shrink-0
          ${isSidebarOpen ? 'w-64' : 'w-0 md:w-20'}
          overflow-hidden
        `}
      >
        <Sidebar isCollapsed={!isSidebarOpen} />
      </div>

      {/* ÁREA DE CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

    </div>
  );
}