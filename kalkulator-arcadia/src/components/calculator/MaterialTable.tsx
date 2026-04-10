import React, { useState } from 'react';
import { Plus, Trash2, Check, X, PackagePlus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { TechnologyMaterial } from '../../store/useAppStore';

interface MaterialTableProps {
  materials: TechnologyMaterial[];
  onUpdate: (materials: TechnologyMaterial[]) => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({ materials, onUpdate }) => {
  const { globalSettings, addBaseMaterial } = useAppStore();
  
  // State for new material form
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(0);

  const handleAddRow = () => {
    const materialId = Object.keys(globalSettings.baseMaterials)[0] || '';
    const newMaterial: TechnologyMaterial = {
      materialId,
      usage: 1.0,
      isBase: materials.length === 0, // First one is base by default
    };
    onUpdate([...materials, newMaterial]);
  };

  const handleCreateGlobalMaterial = () => {
    if (newName.trim() && newPrice >= 0) {
      addBaseMaterial(newName.trim(), newPrice);
      setNewName('');
      setNewPrice(0);
      setIsAddingNew(false);
    }
  };

  const handleRemoveRow = (index: number) => {
    const updated = materials.filter((_, i) => i !== index);
    // Ensure one is base if we removed the base one
    if (updated.length > 0 && !updated.some(m => m.isBase)) {
      if (updated.length > 0) {
        updated[0] = { ...updated[0], isBase: true };
      }
    }
    onUpdate(updated);
  };

  const handleChange = (index: number, field: keyof TechnologyMaterial, value: any) => {
    const updated = materials.map((m, i) => {
      if (i === index) {
        if (field === 'isBase') {
          return { ...m, isBase: true };
        }
        return { ...m, [field]: value };
      }
      // If we are setting a new base, others must be false
      if (field === 'isBase' && i !== index) {
        return { ...m, isBase: false };
      }
      return m;
    });
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
          Lista Materiałów i Zużycie
        </label>
        
        <div className="flex items-center gap-2">
          {!isAddingNew ? (
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all border border-slate-200"
            >
              <PackagePlus size={14} />
              Nowy materiał w bazie
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 animate-in fade-in slide-in-from-right-2">
              <input 
                autoFocus
                type="text" 
                placeholder="Nazwa (j.)" 
                className="bg-white border border-indigo-200 rounded px-2 py-1 text-xs w-48"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Cena" 
                className="bg-white border border-indigo-200 rounded px-2 py-1 text-xs w-20"
                value={newPrice || ''}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
              />
              <button 
                onClick={handleCreateGlobalMaterial}
                className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                <Check size={14} />
              </button>
              <button 
                onClick={() => setIsAddingNew(false)}
                className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <button
            onClick={handleAddRow}
            className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-bold transition-all shadow-sm shadow-indigo-100"
          >
            <Plus size={16} />
            Dodaj do wyceny
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-16 text-center">Base</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[350px]">Materiał</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-48">Zużycie</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-40 text-right">Cena j. (baza)</th>
              <th className="px-6 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {materials.map((m, idx) => (
              <tr key={idx} className={`group transition-colors ${m.isBase ? 'bg-indigo-50/20' : 'hover:bg-slate-50/50'}`}>
                <td className="px-6 py-4 text-center">
                  <input 
                    type="radio" 
                    name="baseMaterial" 
                    checked={m.isBase} 
                    onChange={() => handleChange(idx, 'isBase', true)}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={m.materialId}
                    onChange={(e) => handleChange(idx, 'materialId', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-800 p-0 h-10 cursor-pointer"
                  >
                    {Object.keys(globalSettings.baseMaterials).map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 bg-slate-50 group-hover:bg-indigo-50/50 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-indigo-200 transition-all">
                    <input
                      type="number"
                      value={m.usage}
                      onChange={(e) => handleChange(idx, 'usage', parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-black text-indigo-700 p-0 h-7"
                    />
                    <span className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[60px]">
                      {m.materialId.includes('(') ? m.materialId.split('(')[1].split(')')[0] : 'j.'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-slate-500 font-mono">
                    {(globalSettings.baseMaterials[m.materialId] || 0).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleRemoveRow(idx)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {materials.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-300 mb-3">
               <Plus size={24} />
            </div>
            <p className="text-sm text-slate-400 font-medium">Lista materiałów jest pusta.</p>
            <p className="text-xs text-slate-300 mt-1">Kliknij "Dodaj do wyceny", aby wybrać materiały z bazy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialTable;
