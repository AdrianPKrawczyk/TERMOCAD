import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { TechnologyMaterial } from '../../store/useAppStore';

interface MaterialTableProps {
  materials: TechnologyMaterial[];
  onUpdate: (materials: TechnologyMaterial[]) => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({ materials, onUpdate }) => {
  const { globalSettings } = useAppStore();

  const handleAddRow = () => {
    const materialId = Object.keys(globalSettings.baseMaterials)[0] || '';
    const newMaterial: TechnologyMaterial = {
      materialId,
      usage: 1.0,
      isBase: materials.length === 0, // First one is base by default
    };
    onUpdate([...materials, newMaterial]);
  };

  const handleRemoveRow = (index: number) => {
    const updated = materials.filter((_, i) => i !== index);
    // Ensure one is base if we removed the base one
    if (updated.length > 0 && !updated.some(m => m.isBase)) {
      updated[0].isBase = true;
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
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Lista Materiałów i Zużycie
        </label>
        <button
          onClick={handleAddRow}
          className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors border border-indigo-100"
        >
          <Plus size={14} />
          Dodaj materiał
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-12 text-center">Base</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Materiał</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32">Zużycie</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32 text-right">Cena j.</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {materials.map((m, idx) => (
              <tr key={idx} className={`hover:bg-slate-50/50 ${m.isBase ? 'bg-indigo-50/20' : ''}`}>
                <td className="px-4 py-2 text-center">
                  <input 
                    type="radio" 
                    name="baseMaterial" 
                    checked={m.isBase} 
                    onChange={() => handleChange(idx, 'isBase', true)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={m.materialId}
                    onChange={(e) => handleChange(idx, 'materialId', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-800 p-0 h-10"
                  >
                    {Object.keys(globalSettings.baseMaterials).map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1 border-b border-transparent focus-within:border-indigo-300 transition-colors">
                    <input
                      type="number"
                      value={m.usage}
                      onChange={(e) => handleChange(idx, 'usage', parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-600 font-medium p-0 h-10"
                    />
                    <span className="text-[10px] text-slate-400 italic">
                      {m.materialId.includes('(') ? m.materialId.split('(')[1].split(')')[0] : 'j.'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right text-xs text-slate-500 whitespace-nowrap">
                  {(globalSettings.baseMaterials[m.materialId] || 0).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                </td>
                <td className="px-4 py-2">
                  <button 
                    onClick={() => handleRemoveRow(idx)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {materials.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            Dodaj materiały, które składają się na 1m2 tej technologii.
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialTable;
