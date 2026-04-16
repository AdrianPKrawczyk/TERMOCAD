import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Trash2, Save, AlertCircle, Upload, Download, Layers, Wrench, Briefcase, RefreshCw } from 'lucide-react';
import { exportGlobalsJSON } from '../../utils/jsonExporter';

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'MATERIALS' | 'LABOR' | 'FIXED_COSTS';

const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({ isOpen, onClose }) => {
  const { globalSettings, updateGlobalSettings, recalculateAllTechnologies } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<TabType>('MATERIALS');

  // Lokalny stan formularza
  const [hourlyRate, setHourlyRate] = useState(globalSettings.hourlyRate);
  const [materials, setMaterials] = useState<Array<{ name: string; price: number }>>([]);
  const [labor, setLabor] = useState<Array<{ name: string; price: number }>>([]);
  const [fixedCosts, setFixedCosts] = useState<Array<{ name: string; price: number }>>([]);

  // Inicjalizacja stanu lokalnego przy otwarciu
  useEffect(() => {
    if (isOpen) {
      setHourlyRate(globalSettings.hourlyRate);
      
      setMaterials(Object.entries(globalSettings.baseMaterials || {}).map(([name, price]) => ({ name, price })));
      setLabor(Object.entries(globalSettings.baseLabor || {}).map(([name, price]) => ({ name, price })));
      setFixedCosts(Object.entries(globalSettings.baseFixedCosts || {}).map(([name, price]) => ({ name, price })));
      
      setActiveTab('MATERIALS'); // reset tab on open
    }
  }, [isOpen, globalSettings]);

  const handleAddItem = (type: TabType) => {
    if (type === 'MATERIALS') setMaterials([...materials, { name: '', price: 0 }]);
    else if (type === 'LABOR') setLabor([...labor, { name: '', price: 0 }]);
    else if (type === 'FIXED_COSTS') setFixedCosts([...fixedCosts, { name: '', price: 0 }]);
  };

  const handleRemoveItem = (type: TabType, index: number) => {
    if (type === 'MATERIALS') setMaterials(materials.filter((_, i) => i !== index));
    else if (type === 'LABOR') setLabor(labor.filter((_, i) => i !== index));
    else if (type === 'FIXED_COSTS') setFixedCosts(fixedCosts.filter((_, i) => i !== index));
  };

  const handleItemChange = (type: TabType, index: number, field: 'name' | 'price', value: string | number) => {
    const list = type === 'MATERIALS' ? [...materials] : type === 'LABOR' ? [...labor] : [...fixedCosts];
    
    if (field === 'name') {
      list[index].name = value as string;
    } else {
      list[index].price = typeof value === 'string' ? parseFloat(value) || 0 : value;
    }

    if (type === 'MATERIALS') setMaterials(list);
    else if (type === 'LABOR') setLabor(list);
    else if (type === 'FIXED_COSTS') setFixedCosts(list);
  };

  const handleSave = () => {
    const baseMaterials: Record<string, number> = {};
    const baseLabor: Record<string, number> = {};
    const baseFixedCosts: Record<string, number> = {};

    materials.forEach((m) => { if (m.name.trim()) baseMaterials[m.name.trim()] = m.price; });
    labor.forEach((l) => { if (l.name.trim()) baseLabor[l.name.trim()] = l.price; });
    fixedCosts.forEach((f) => { if (f.name.trim()) baseFixedCosts[f.name.trim()] = f.price; });

    updateGlobalSettings({
      hourlyRate,
      baseMaterials,
      baseLabor,
      baseFixedCosts
    });
    onClose();
  };

  const handleExportClick = () => {
    const baseMaterials: Record<string, number> = {};
    const baseLabor: Record<string, number> = {};
    const baseFixedCosts: Record<string, number> = {};

    materials.forEach((m) => { if (m.name.trim()) baseMaterials[m.name.trim()] = m.price; });
    labor.forEach((l) => { if (l.name.trim()) baseLabor[l.name.trim()] = l.price; });
    fixedCosts.forEach((f) => { if (f.name.trim()) baseFixedCosts[f.name.trim()] = f.price; });

    exportGlobalsJSON({
      hourlyRate,
      baseMaterials,
      baseLabor,
      baseFixedCosts
    });
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        let loadedGlobals = {};
        
        // Wsparcie dla nowego formatu
        if (data.type === 'ARCADIA_GLOBALS_BACKUP' && data.globalSettings) {
           loadedGlobals = data.globalSettings;
        } 
        // Backward compatibility support dla samego pliku z bazą materiałową
        else if (data.type === 'ARCADIA_MATERIALS_BACKUP' && data.baseMaterials) {
           loadedGlobals = { baseMaterials: data.baseMaterials };
        } else {
           alert('Nieprawidłowy plik ustawień globalnych.');
           return;
        }

        // Złączenie z aktualnym stanem z modala (aby użytkownik nie stracił tego, co wpisał)
        const currentMaterials: Record<string, number> = {};
        const currentLabor: Record<string, number> = {};
        const currentFixedCosts: Record<string, number> = {};
        
        materials.forEach((m) => { if (m.name.trim()) currentMaterials[m.name.trim()] = m.price; });
        labor.forEach((l) => { if (l.name.trim()) currentLabor[l.name.trim()] = l.price; });
        fixedCosts.forEach((f) => { if (f.name.trim()) currentFixedCosts[f.name.trim()] = f.price; });

        const mergedSettings = {
           baseMaterials: { ...currentMaterials, ...((loadedGlobals as any).baseMaterials || {}) },
           baseLabor: { ...currentLabor, ...((loadedGlobals as any).baseLabor || {}) },
           baseFixedCosts: { ...currentFixedCosts, ...((loadedGlobals as any).baseFixedCosts || {}) }
        };

        setMaterials(Object.entries(mergedSettings.baseMaterials).map(([name, price]) => ({ name, price: Number(price) })));
        setLabor(Object.entries(mergedSettings.baseLabor).map(([name, price]) => ({ name, price: Number(price) })));
        setFixedCosts(Object.entries(mergedSettings.baseFixedCosts).map(([name, price]) => ({ name, price: Number(price) })));

        if ((loadedGlobals as any).hourlyRate !== undefined) {
           setHourlyRate((loadedGlobals as any).hourlyRate);
        }

        alert('Ustawienia odczytane pomyślnie. Zapisz formularz, by ich użyć w projekcie.');
        
      } catch (err) {
        alert('Błąd odczytu pliku JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getActiveList = () => {
    if (activeTab === 'MATERIALS') return materials;
    if (activeTab === 'LABOR') return labor;
    return fixedCosts;
  };

  const activeList = getActiveList();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Zmienne Globalne">
      <div className="space-y-6">
        
        {/* HEADER: ZAKŁADKI & EXPORT/IMPORT */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
            <button 
              onClick={() => setActiveTab('MATERIALS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'MATERIALS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               <Layers size={14} /> Materiały
            </button>
            <button 
              onClick={() => setActiveTab('LABOR')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'LABOR' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               <Wrench size={14} /> Robocizna
            </button>
            <button 
              onClick={() => setActiveTab('FIXED_COSTS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'FIXED_COSTS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               <Briefcase size={14} /> Koszty Stałe
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button 
              onClick={handleImportClick}
              className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Wczytaj i połącz z pliku .json"
            >
              <Upload size={14} /> Import
            </button>
            <button 
              onClick={handleExportClick}
              className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Eksportuj wszystko do pliku .json"
            >
              <Download size={14} /> Eksport
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button 
              onClick={() => { if(confirm('Przeliczyć WSZYSTKIE technologie w projekcie? (Z pominięciem zablokowanych)')) recalculateAllTechnologies(); }}
              className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-black text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-amber-200"
              title="Przelicz wszystkie warianty we wszystkich kategoriach"
            >
              <RefreshCw size={14} /> Przelicz wszystko
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="min-h-[300px]">
          {activeTab === 'LABOR' && (
            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4 animate-in fade-in duration-200">
               <div className="flex-1">
                 <label className="block text-xs font-medium text-slate-500 mb-1">Ogólna stawka netto za roboczogodzinę (zł/h)</label>
                 <input 
                   type="number"
                   value={hourlyRate}
                   onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                   className="w-full sm:max-w-[200px] bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                 />
               </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4 mt-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
              {activeTab === 'MATERIALS' ? 'Baza Materiałowa' : activeTab === 'LABOR' ? 'Lista Pozycji Robocizny' : 'Lista Kosztów Stałych'}
            </h4>
            
            <button 
              onClick={() => handleAddItem(activeTab)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100"
            >
              <Plus size={14} /> Dodaj pozycję
            </button>
          </div>

          <div className="space-y-3">
            {activeList.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">Brak zdefiniowanych pozycji. Dodaj pierwszą.</p>
              </div>
            )}
            
            {activeList.map((item, index) => (
              <div key={index} className="flex gap-3 animate-in slide-in-from-left-2 duration-200">
                <div className="flex-[3]">
                  <input 
                    type="text"
                    placeholder="Nazwa (np. Tynkowanie ciśnieniowe)"
                    value={item.name}
                    onChange={(e) => handleItemChange(activeTab, index, 'name', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="number"
                    placeholder="Cena/Stawka"
                    value={item.price === 0 ? '' : item.price}
                    onChange={(e) => handleItemChange(activeTab, index, 'price', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-right font-medium"
                  />
                </div>
                <button 
                  onClick={() => handleRemoveItem(activeTab, index)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* STOPKA MODALA */}
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Anuluj
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
          >
            <Save size={18} /> Zapisz zmiany
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalSettingsModal;
