import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Trash2, Save, AlertCircle, Upload, Download } from 'lucide-react';
import { downloadMaterialsJSON } from '../../utils/jsonExporter';

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({ isOpen, onClose }) => {
  const { globalSettings, updateGlobalSettings } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Lokalny stan formularza
  const [hourlyRate, setHourlyRate] = useState(globalSettings.hourlyRate);
  const [materials, setMaterials] = useState<Array<{ name: string; price: number }>>([]);

  // Inicjalizacja stanu lokalnego przy otwarciu
  useEffect(() => {
    if (isOpen) {
      setHourlyRate(globalSettings.hourlyRate);
      const items = Object.entries(globalSettings.baseMaterials).map(([name, price]) => ({
        name,
        price,
      }));
      setMaterials(items);
    }
  }, [isOpen, globalSettings]);

  const handleAddMaterial = () => {
    setMaterials([...materials, { name: '', price: 0 }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (index: number, field: 'name' | 'price', value: string | number) => {
    const newMaterials = [...materials];
    if (field === 'name') {
      newMaterials[index].name = value as string;
    } else {
      newMaterials[index].price = typeof value === 'string' ? parseFloat(value) || 0 : value;
    }
    setMaterials(newMaterials);
  };

  const handleSave = () => {
    const baseMaterials: Record<string, number> = {};
    materials.forEach((m) => {
      if (m.name.trim()) {
        baseMaterials[m.name.trim()] = m.price;
      }
    });

    updateGlobalSettings({
      hourlyRate,
      baseMaterials,
    });
    onClose();
  };

  const handleExportMaterials = () => {
    const baseMaterials: Record<string, number> = {};
    materials.forEach((m) => {
      if (m.name.trim()) baseMaterials[m.name.trim()] = m.price;
    });
    downloadMaterialsJSON(baseMaterials);
  };

  const handleImportMaterialsClick = () => {
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
        if (data.type === 'ARCADIA_MATERIALS_BACKUP' && data.baseMaterials) {
            // Zbudowanie starej bazy
            const currentMap: Record<string, number> = {};
            materials.forEach((m) => { if (m.name.trim()) currentMap[m.name.trim()] = m.price; });
            
            // Łączenie z nadpisaniem w razie konfliktu:
            const newMap = { ...currentMap, ...data.baseMaterials };
            
            const newMaterialsArray = Object.entries(newMap).map(([name, price]) => ({ name, price: Number(price) }));
            setMaterials(newMaterialsArray);
            alert('Baza materiałowa pomyślnie złączona. Zapisz zmiany formularza, by użyć w projekcie.');
        } else {
          alert('Nieprawidłowy plik bazy materiałowej.');
        }
      } catch (err) {
        alert('Błąd odczytu pliku JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Zmienne Globalne">
      <div className="space-y-8">
        {/* SEKCJA: ROBOCIZNA */}
        <section>
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
            <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
            Stawka Robocizny
          </h4>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Cena netto za roboczogodzinę (zł/h)</label>
              <input 
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </section>

        {/* SEKCJA: MATERIAŁY */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
              Baza Materiałowa
            </h4>
            
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <button 
                onClick={handleImportMaterialsClick}
                className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="Wczytaj i połącz z pliku .json"
              >
                <Upload size={14} />
                Import
              </button>
              <button 
                onClick={handleExportMaterials}
                className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="Zapisz bazę do pliku .json"
              >
                <Download size={14} />
                Eksport
              </button>
              <button 
                onClick={handleAddMaterial}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100 ml-2"
              >
                <Plus size={14} />
                Dodaj materiał
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {materials.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">Brak zdefiniowanych materiałów. Dodaj pierwszą pozycję.</p>
              </div>
            )}
            
            {materials.map((m, index) => (
              <div key={index} className="flex gap-3 animate-in slide-in-from-left-2 duration-200">
                <div className="flex-[3]">
                  <input 
                    type="text"
                    placeholder="Nazwa materiału (np. Styropian EPS)"
                    value={m.name}
                    onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="number"
                    placeholder="Cena"
                    value={m.price === 0 ? '' : m.price}
                    onChange={(e) => handleMaterialChange(index, 'price', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-right"
                  />
                </div>
                <button 
                  onClick={() => handleRemoveMaterial(index)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

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
            <Save size={18} />
            Zapisz zmiany
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalSettingsModal;
