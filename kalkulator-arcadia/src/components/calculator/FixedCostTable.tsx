import React, { useState } from 'react';
import { Plus, Trash2, Check, X, Briefcase } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { TechnologyFixedCost } from '../../store/useAppStore';

interface FixedCostTableProps {
  fixedCostEntries: TechnologyFixedCost[];
  onUpdate: (fixedCosts: TechnologyFixedCost[]) => void;
}

const FixedCostTable: React.FC<FixedCostTableProps> = ({ fixedCostEntries, onUpdate }) => {
  const { globalSettings, addBaseFixedCost } = useAppStore();
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(0);

  const handleAddRow = () => {
    const costId = Object.keys(globalSettings.baseFixedCosts || {})[0] || '';
    const newCost: TechnologyFixedCost = {
      costId,
      usage: 1.0,
    };
    onUpdate([...fixedCostEntries, newCost]);
  };

  const handleCreateGlobalFixedCost = () => {
    if (newName.trim() && newPrice >= 0) {
      addBaseFixedCost(newName.trim(), newPrice);
      setNewName('');
      setNewPrice(0);
      setIsAddingNew(false);
    }
  };

  const handleRemoveRow = (index: number) => {
    const updated = fixedCostEntries.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleChange = (index: number, field: keyof TechnologyFixedCost, value: any) => {
    const updated = fixedCostEntries.map((f, i) => {
      if (i === index) {
        return { ...f, [field]: value };
      }
      return f;
    });
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mt-4 border-t border-slate-200 pt-6">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
          <Briefcase size={16} className="text-indigo-600"/>
          Lista Kosztów Stałych (z bazy)
        </label>
        
        <div className="flex items-center gap-2">
          {!isAddingNew ? (
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all border border-slate-200"
            >
              <Plus size={14} />
              Nowa poz. w bazie
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 animate-in fade-in slide-in-from-right-2">
              <input 
                autoFocus
                type="text" 
                placeholder="Nazwa kosztu" 
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
                onClick={handleCreateGlobalFixedCost}
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
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[350px]">Koszt stały</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-48">Mnożnik (ilość)</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-40 text-right">Cena j.</th>
              <th className="px-6 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fixedCostEntries.map((f, idx) => (
              <tr key={idx} className="group transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <select
                    value={f.costId}
                    onChange={(e) => handleChange(idx, 'costId', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-800 p-0 h-10 cursor-pointer"
                  >
                    {Object.keys(globalSettings.baseFixedCosts || {}).map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 bg-slate-50 group-hover:bg-indigo-50/50 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-indigo-200 transition-all">
                    <input
                      type="number"
                      value={f.usage}
                      onChange={(e) => handleChange(idx, 'usage', parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-black text-indigo-700 p-0 h-7"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-slate-500 font-mono">
                    {(globalSettings.baseFixedCosts[f.costId] || 0).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
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
        
        {fixedCostEntries.length === 0 && (
          <div className="p-8 text-center text-slate-400 bg-slate-50">
             <p className="text-xs font-medium">Lista kosztów stałych z bazy jest pusta.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedCostTable;
