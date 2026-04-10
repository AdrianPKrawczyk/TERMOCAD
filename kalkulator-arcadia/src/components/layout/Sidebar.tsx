import React, { useState } from 'react';
import { Plus, Folder, FileText, Check, X, Pencil, Home, Sun, Square } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { CategoryType } from '../../store/useAppStore';

const Sidebar: React.FC = () => {
  const { 
    categories, 
    addCategory, 
    renameCategory,
    addTechnology, 
    renameTechnology,
    selectedTechnologyId, 
    setSelection 
  } = useAppStore();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<CategoryType>('PARTITIONS');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCreateCategory = () => {
    if (newCatName.trim()) {
      addCategory(newCatName.trim(), newCatType);
      setNewCatName('');
      setIsAddingCategory(false);
    }
  };

  const startEditing = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(currentName);
  };

  const saveRename = (id: string, type: 'cat' | 'tech', catId?: string) => {
    if (type === 'cat') {
      renameCategory(id, editValue);
    } else if (catId) {
      renameTechnology(catId, id, editValue);
    }
    setEditingId(null);
  };

  const getCategoryIcon = (type: CategoryType) => {
    switch (type) {
      case 'PARTITIONS': return <Home size={16} className="text-indigo-500" />;
      case 'JOINERY': return <Square size={16} className="text-emerald-500" />;
      case 'INSTALLATIONS': return <Sun size={16} className="text-amber-500" />;
    }
  };

  const handleAddTech = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const name = prompt('Podaj nazwę nowej technologii:');
    if (name) addTechnology(catId, name);
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-[calc(100vh-64px)] overflow-y-auto shrink-0 border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 space-y-2">
        {!isAddingCategory ? (
          <button 
            onClick={() => setIsAddingCategory(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-indigo-900/20 font-bold text-sm"
          >
            <Plus size={18} />
            <span>Dodaj kategorię</span>
          </button>
        ) : (
          <div className="p-3 bg-slate-800 rounded-lg space-y-3 border border-slate-700 animate-in fade-in zoom-in duration-200">
            <input 
              autoFocus
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
              placeholder="Nazwa kategorii..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
              value={newCatType}
              onChange={(e) => setNewCatType(e.target.value as CategoryType)}
            >
              <option value="PARTITIONS">Przegrody</option>
              <option value="JOINERY">Okna i Drzwi</option>
              <option value="INSTALLATIONS">PV / Instalacje</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleCreateCategory} className="flex-1 bg-indigo-600 py-1 rounded text-white text-xs font-bold">Zapisz</button>
              <button onClick={() => setIsAddingCategory(false)} className="px-2 py-1 bg-slate-700 rounded text-white text-xs"><X size={14}/></button>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4">
        <div className="px-6 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Struktura Projektu
        </div>
        
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li key={cat.id} className="group">
              <div className="flex items-center justify-between px-6 py-2 text-slate-400 group-hover:text-slate-200 transition-colors">
                <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                  {getCategoryIcon(cat.type)}
                  {editingId === cat.id ? (
                    <input 
                      autoFocus
                      className="bg-slate-800 text-xs px-1 rounded w-full border border-indigo-500 text-white outline-none"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveRename(cat.id, 'cat')}
                      onKeyDown={(e) => e.key === 'Enter' && saveRename(cat.id, 'cat')}
                    />
                  ) : (
                    <span className="text-xs font-black uppercase tracking-wider truncate">{cat.name}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {editingId !== cat.id && (
                    <button onClick={(e) => startEditing(cat.id, cat.name, e)} className="p-1 hover:text-indigo-400"><Pencil size={12}/></button>
                  )}
                  <button onClick={(e) => handleAddTech(cat.id, e)} className="p-1 hover:text-white bg-slate-800 rounded"><Plus size={12}/></button>
                </div>
              </div>
              
              <ul className="mt-1 space-y-0.5">
                {cat.technologies.map((tech) => (
                  <li key={tech.id} className="group/tech">
                    <button 
                      onClick={() => setSelection(cat.id, tech.id)}
                      className={`w-full flex items-center gap-3 pl-10 pr-6 py-2 text-sm transition-all border-r-2 ${
                        selectedTechnologyId === tech.id 
                        ? 'bg-indigo-500/10 text-white border-indigo-500 font-bold' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border-transparent'
                      }`}
                    >
                      <FileText size={16} className={selectedTechnologyId === tech.id ? 'text-indigo-400' : 'text-slate-600'} />
                      {editingId === tech.id ? (
                        <input 
                          autoFocus
                          className="bg-slate-700 text-xs px-1 rounded w-full border border-indigo-500 text-white outline-none font-normal"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => saveRename(tech.id, 'tech', cat.id)}
                          onKeyDown={(e) => e.key === 'Enter' && saveRename(tech.id, 'tech', cat.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="truncate flex-1">{tech.name}</span>
                      )}
                      {editingId !== tech.id && selectedTechnologyId === tech.id && (
                        <button 
                          onClick={(e) => startEditing(tech.id, tech.name, e)}
                          className="opacity-0 group-hover/tech:opacity-100 p-1 text-slate-500 hover:text-indigo-300"
                        >
                          <Pencil size={12}/>
                        </button>
                      )}
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
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">Calculator 0.4.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
