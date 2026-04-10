import React from 'react';
import { Layers, Plus, ChevronRight, Folder } from 'lucide-react';

const Sidebar: React.FC = () => {
  // Przykładowe placeholdery kategorii
  const categories = [
    { id: '1', name: 'Ściany zewnętrzne' },
    { id: '2', name: 'Dachy i stropodachy' },
    { id: '3', name: 'Podłogi na gruncie' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4 border-b border-slate-800">
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
          <Plus size={18} />
          <span className="font-medium">Dodaj kategorię</span>
        </button>
      </div>

      <nav className="flex-1 py-4">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Kategorie
        </div>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-800 hover:text-white transition-colors group">
                <div className="flex items-center gap-3">
                  <Folder size={18} className="text-indigo-400" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400" />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 bg-slate-950/50 mt-auto">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-slate-800/50 border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            TM
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">TERMO-CAD</span>
            <span className="text-[10px] text-slate-500">Kalkulator XML</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
