import React, { useState } from 'react';
import { Settings, Save, FileCode } from 'lucide-react';
import GlobalSettingsModal from '../settings/GlobalSettingsModal';
import { useAppStore } from '../../store/useAppStore';
import { generateXML, downloadXML, downloadXLibrary } from '../../utils/xmlExporter';

const TopBar: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { categories } = useAppStore();

  const handleExportXML = () => {
    const xml = generateXML(categories);
    const date = new Date().toISOString().split('T')[0];
    downloadXML(xml, `cennik_arcadia_${date}.xml`);
  };

  const handleExportXLibrary = async () => {
    const xml = generateXML(categories);
    const date = new Date().toISOString().split('T')[0];
    await downloadXLibrary(xml, `cennik_arcadia_${date}.xlibrary`);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-800">Kalkulator ArCADia</h1>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">v0.5.0</span>
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
          
          <button 
            onClick={handleExportXML}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg shadow-md transition-all transform active:scale-95 text-sm"
          >
            <FileCode size={18} />
            <span>Eksportuj (.xml)</span>
          </button>

          <button 
            onClick={handleExportXLibrary}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 transition-all transform active:scale-95 text-sm"
          >
            <FileCode size={18} />
            <span>Eksportuj do .xlibrary</span>
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
