import React from 'react';
import type { Variant } from '../../store/useAppStore';

interface VariantsTableProps {
  variants: Variant[];
}

const VariantsTable: React.FC<VariantsTableProps> = ({ variants }) => {
  if (variants.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
        Brak dodanych wariantów. Użyj kalkulatora lub dodaj je ręcznie.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Grubość</th>
            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nazwa wariantu</th>
            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Jednostka</th>
            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Cena całkowita</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {variants.map((v) => (
            <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                {v.thickness ? `${v.thickness} cm` : '-'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-800 font-bold">{v.name}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{v.unit}</td>
              <td className="px-6 py-4 text-sm text-indigo-600 font-bold text-right">
                {v.totalCost.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariantsTable;
