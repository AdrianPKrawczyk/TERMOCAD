import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Variant } from '../../store/useAppStore';

interface ManualTableProps {
  variants: Variant[];
  onUpdate: (variants: Variant[]) => void;
}

const ManualTable: React.FC<ManualTableProps> = ({ variants, onUpdate }) => {
  const handleAddRow = () => {
    const newVariant: Variant = {
      id: crypto.randomUUID(),
      name: '',
      unit: 'zł/m2',
      totalCost: 0,
    };
    onUpdate([...variants, newVariant]);
  };

  const handleRemoveRow = (id: string) => {
    onUpdate(variants.filter((v) => v.id !== id));
  };

  const handleChange = (id: string, field: keyof Variant, value: string | number) => {
    onUpdate(
      variants.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nazwa wariantu</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Jednostka</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-32 text-right">Cena (zł)</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 italic-placeholder">
            {variants.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/30">
                <td className="px-6 py-2">
                  <input
                    type="text"
                    value={v.name}
                    placeholder="np. Tynk perlitowy 2cm"
                    onChange={(e) => handleChange(v.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-800 placeholder:text-slate-300 h-10"
                  />
                </td>
                <td className="px-6 py-2">
                  <input
                    type="text"
                    value={v.unit}
                    onChange={(e) => handleChange(v.id, 'unit', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-500 h-10"
                  />
                </td>
                <td className="px-6 py-2 text-right">
                  <input
                    type="number"
                    value={v.totalCost === 0 ? '' : v.totalCost}
                    onChange={(e) => handleChange(v.id, 'totalCost', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-indigo-600 font-bold text-right h-10"
                  />
                </td>
                <td className="px-4 py-2">
                  <button 
                    onClick={() => handleRemoveRow(v.id)}
                    className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {variants.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm italic">
            Tabela jest pusta. Dodaj pierwszą pozycję przyciskiem poniżej.
          </div>
        )}
      </div>

      <button
        onClick={handleAddRow}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all border border-slate-200"
      >
        <Plus size={18} />
        Dodaj pozycję ręcznie
      </button>
    </div>
  );
};

export default ManualTable;
