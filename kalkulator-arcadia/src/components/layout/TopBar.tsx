import React, { useState, useRef } from 'react';
import { Settings, Save, FileCode, Upload, Monitor, FolderOpen } from 'lucide-react';
import GlobalSettingsModal from '../settings/GlobalSettingsModal';
import { useAppStore } from '../../store/useAppStore';
import { generateXML, downloadXML, downloadXLibrary } from '../../utils/xmlExporter';
import { exportProjectJSON } from '../../utils/jsonExporter';
import { isElectron, loadFromDisk } from '../../services/storageService';

const TopBar: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    categories, 
    globalSettings, 
    loadProjectSnapshot, 
    currentProjectName, 
    syncWithDisk,
    isDirty
  } = useAppStore();

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

  const handleExportJSON = async () => {
    if (isElectron()) {
      await syncWithDisk();
    } else {
      exportProjectJSON(globalSettings, categories, currentProjectName);
    }
  };

  const handleImportJSONClick = async () => {
    if (isElectron()) {
      const data = await loadFromDisk();
      if (data && data.globalSettings && data.categories) {
        loadProjectSnapshot({ globalSettings: data.globalSettings, categories: data.categories });
      }
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChangeDirectory = async () => {
    if (isElectron() && window.electron?.selectDirectory) {
      const path = await window.electron.selectDirectory();
      if (path) {
        console.log('Nowy folder projektów:', path);
        // Można dodać informację do store o aktualnej ścieżce jeśli bridge to wspiera
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.type === 'ARCADIA_PROJECT_BACKUP' && data.globalSettings && data.categories) {
          if (window.confirm('Wczytanie projektu z pliku usunie obecne niezapisane dane. Czy kontynuować?')) {
            loadProjectSnapshot({ globalSettings: data.globalSettings, categories: data.categories });
          }
        } else {
          alert('Nieprawidłowy plik projektu.');
        }
      } catch (err) {
        console.error(err);
        alert('Błąd odczytu pliku JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset do kolejnych plików
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">Kalkulator ArCADia</h1>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">v0.6.0</span>
          
          {isElectron() && (
            <div className="flex items-center gap-1.5 ml-4 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 shadow-sm animate-pulse-slow">
              <Monitor size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Połączono z Hubem</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Settings size={18} />
            <span>Zmienne Globalne</span>
          </button>
          
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          
          <div className="flex bg-slate-100 p-1 rounded-xl items-center mr-2">
            <button 
              onClick={handleImportJSONClick}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
              title={isElectron() ? "Otwórz z dysku" : "Importuj JSON"}
            >
              <Upload size={16} />
              <span>Otwórz</span>
            </button>
            <button 
              onClick={handleExportJSON}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-lg transition-all ${
                isDirty ? 'text-indigo-600 bg-white shadow-sm' : 'text-slate-600 hover:text-indigo-600 hover:bg-white'
              }`}
              title={isElectron() ? "Zapisz na dysku" : "Pobierz JSON"}
            >
              <Save size={16} />
              <span>{isElectron() && isDirty ? 'Zapisz (aktywne)' : 'Zapisz Projekt'}</span>
            </button>
            
            {isElectron() && (
              <button 
                onClick={handleChangeDirectory}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all"
                title="Zmień folder zapisu"
              >
                <FolderOpen size={16} />
              </button>
            )}
          </div>
          
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
