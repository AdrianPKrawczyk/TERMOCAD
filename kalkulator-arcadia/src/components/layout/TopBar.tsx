import React, { useState } from 'react';
import { Settings, Save, FileOutput } from 'lucide-react';
import GlobalSettingsModal from '../settings/GlobalSettingsModal';

const TopBar: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-800">Kalkulator ArCADia</h1>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">v0.3.0</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Settings size={18} />
            <span>Zmienne Globalne</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Save size={18} />
            <span>Zapisz Projekt</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all transform active:scale-95">
            <FileOutput size={18} />
            <span>Eksportuj do XML</span>
          </button>
        </div>
      </header>

      <GlobalSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default TopBar;
