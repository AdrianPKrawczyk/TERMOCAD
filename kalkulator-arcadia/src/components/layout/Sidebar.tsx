import React from 'react';
import { Plus, ChevronRight, Folder, FileText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const Sidebar: React.FC = () => {
  const { 
    categories, 
    addCategory, 
    addTechnology, 
    selectedTechnologyId, 
    setSelection 
  } = useAppStore();

  const handleAddCategory = () => {
    const name = prompt('Podaj nazwę nowej kategorii:');
    if (name) addCategory(name);
  };

  const handleAddTech = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const name = prompt('Podaj nazwę nowej technologii:');
    if (name) addTechnology(catId, name);
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-[calc(100vh-64px)] overflow-y-auto shrink-0 border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <button 
          onClick={handleAddCategory}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-indigo-900/20 font-bold text-sm"
        >
          <Plus size={18} />
          <span>Dodaj kategorię</span>
        </button>
      </div>

      <nav className="flex-1 py-4">
        <div className="px-6 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Struktura Projektu
        </div>
        
        {categories.length === 0 && (
          <div className="px-6 py-4 text-xs text-slate-600 italic">
            Brak kategorii. Dodaj pierwszą, aby zacząć.
          </div>
        )}

        <ul className="space-y-4">
          {categories.map((cat) => (
            <li key={cat.id} className="group">
              <div className="flex items-center justify-between px-6 py-2 text-slate-400 group-hover:text-slate-200 transition-colors">
                <div className="flex items-center gap-2">
                  <Folder size={16} className="text-indigo-500" />
                  <span className="text-xs font-black uppercase tracking-wider">{cat.name}</span>
                </div>
                <button 
                  onClick={(e) => handleAddTech(cat.id, e)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <ul className="mt-1 space-y-0.5">
                {cat.technologies.map((tech) => (
                  <li key={tech.id}>
                    <button 
                      onClick={() => setSelection(cat.id, tech.id)}
                      className={`w-full flex items-center gap-3 pl-10 pr-6 py-2 text-sm transition-all border-r-2 ${
                        selectedTechnologyId === tech.id 
                        ? 'bg-indigo-500/10 text-white border-indigo-500 font-bold' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border-transparent'
                      }`}
                    >
                      <FileText size={16} className={selectedTechnologyId === tech.id ? 'text-indigo-400' : 'text-slate-600'} />
                      <span className="truncate">{tech.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 bg-slate-950/50 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-inner">
            TC
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-tight">TERMO-CAD</span>
            <span className="text-[10px] text-slate-500 font-medium">Kalkulator XML</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
