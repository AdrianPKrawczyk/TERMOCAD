import React from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Pasek górny (TopBar) - stała wysokość */}
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Panel boczny (Sidebar) - stała szerokość */}
        <Sidebar />
        
        {/* Obszar roboczy (MainContent) - wypełnia resztę */}
        <MainContent />
      </div>
    </div>
  );
};

export default AppLayout;
