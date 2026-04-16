import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  FileText, 
  Pencil, 
  X,
  Home,
  Square,
  Sun,
  Trash2,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { CategoryType } from '../../store/useAppStore';

const Sidebar: React.FC = () => {
  const { 
    categories, 
    addCategory, 
    addTechnology, 
    renameCategory, 
    renameTechnology,
    reorderCategory,
    reorderTechnology,
    removeCategory,
    removeTechnology,
    duplicateTechnology,
    selectedTechnologyId, 
    setSelection,
    recalculateCategoryTechnologies
  } = useAppStore();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<CategoryType>('PARTITIONS');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  
  // State for adding technology inline
  const [addingTechTo, setAddingTechTo] = useState<string | null>(null);
  const [newTechValue, setNewTechValue] = useState('');

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

  const handleRemoveCategory = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Wykasowanie kategorii "${name}" nieodwracalnie usunie wszystkie zawarte w niej technologie.\nCzy kontynuować?`)) {
      removeCategory(id);
    }
  };

  const handleRemoveTechnology = (catId: string, techId: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Czy na pewno chcesz usunąć technologię "${name}"?`)) {
      removeTechnology(catId, techId);
    }
  };

  const handleDuplicateTechnology = (catId: string, techId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateTechnology(catId, techId);
  };

  const handleCreateTech = (catId: string) => {
    if (newTechValue.trim()) {
      addTechnology(catId, newTechValue.trim());
      setNewTechValue('');
      setAddingTechTo(null);
    }
  };

  const getCategoryIcon = (type: CategoryType) => {
    switch (type) {
      case 'PARTITIONS': return <Home size={16} className="text-indigo-500" />;
      case 'JOINERY': return <Square size={16} className="text-emerald-500" />;
      case 'INSTALLATIONS': return <Sun size={16} className="text-amber-500" />;
    }
  };

  return (
    <aside className="w-[500px] bg-slate-900 text-slate-300 flex flex-col h-[calc(100vh-64px)] overflow-y-auto shrink-0 border-r border-slate-800">
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
          {categories.map((cat, catIdx) => (
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
                    <span className="text-xs font-black uppercase tracking-wider">{cat.name}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {/* Reorder Buttons */}
                  <div className="flex items-center mr-1 border-r border-slate-800 pr-1">
                    <button 
                      disabled={catIdx === 0}
                      onClick={(e) => { e.stopPropagation(); reorderCategory(catIdx, -1); }}
                      className={`p-1 hover:text-white ${catIdx === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-500'}`}
                    >
                      <ChevronUp size={12}/>
                    </button>
                    <button 
                      disabled={catIdx === categories.length - 1}
                      onClick={(e) => { e.stopPropagation(); reorderCategory(catIdx, 1); }}
                      className={`p-1 hover:text-white ${catIdx === categories.length - 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-500'}`}
                    >
                      <ChevronDown size={12}/>
                    </button>
                  </div>
                  
                  {editingId !== cat.id && (
                    <button onClick={(e) => startEditing(cat.id, cat.name, e)} className="p-1 hover:text-indigo-400"><Pencil size={12}/></button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm('Przeliczyć wszystkie technologie w tej kategorii? (Z pominięciem zablokowanych)')) recalculateCategoryTechnologies(cat.id); }} 
                    className="p-1 hover:text-white"
                    title="Przelicz kategorię"
                  >
                    <RefreshCw size={12}/>
                  </button>
                  <button onClick={(e) => handleRemoveCategory(cat.id, cat.name, e)} className="p-1 hover:text-red-400 text-slate-500"><Trash2 size={12}/></button>
                  <button onClick={(e) => { e.stopPropagation(); setAddingTechTo(cat.id); setNewTechValue(''); }} className="p-1 hover:text-white bg-slate-800 rounded ml-1"><Plus size={12}/></button>
                </div>
              </div>
              
              <ul className="mt-1 space-y-0.5">
                {cat.technologies.map((tech, techIdx) => (
                  <li key={tech.id} className="group/tech">
                    <div className="relative">
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
                          <span className="flex-1 text-left">{tech.name}</span>
                        )}
                        
                        {/* Status/Action area in tech item */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover/tech:opacity-100 transition-opacity">
                           <div className="flex items-center mr-1 border-r border-slate-700 pr-1">
                              <button 
                                disabled={techIdx === 0}
                                onClick={(e) => { e.stopPropagation(); reorderTechnology(cat.id, techIdx, -1); }}
                                className={`p-0.5 hover:text-white ${techIdx === 0 ? 'text-slate-800 cursor-not-allowed' : 'text-slate-500'}`}
                              >
                                <ChevronUp size={10}/>
                              </button>
                              <button 
                                disabled={techIdx === cat.technologies.length - 1}
                                onClick={(e) => { e.stopPropagation(); reorderTechnology(cat.id, techIdx, 1); }}
                                className={`p-0.5 hover:text-white ${techIdx === cat.technologies.length - 1 ? 'text-slate-800 cursor-not-allowed' : 'text-slate-500'}`}
                              >
                                <ChevronDown size={10}/>
                              </button>
                            </div>

                          {editingId !== tech.id && (
                            <>
                              <button 
                                onClick={(e) => startEditing(tech.id, tech.name, e)}
                                className="p-1 text-slate-500 hover:text-indigo-300"
                                title="Edytuj nazwę"
                              >
                                <Pencil size={12}/>
                              </button>
                              <button 
                                onClick={(e) => handleDuplicateTechnology(cat.id, tech.id, e)}
                                className="p-1 text-slate-500 hover:text-emerald-400"
                                title="Duplikuj technologię"
                              >
                                <Copy size={12}/>
                              </button>
                              <button 
                                onClick={(e) => handleRemoveTechnology(cat.id, tech.id, tech.name, e)}
                                className="p-1 text-slate-500 hover:text-red-400"
                                title="Usuń"
                              >
                                <Trash2 size={12}/>
                              </button>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </li>
                ))}
                
                {/* Inline input for new technology */}
                {addingTechTo === cat.id && (
                  <li className="px-6 pl-10 py-2 animate-in slide-in-from-left-2 duration-200">
                    <div className="flex items-center gap-2">
                      <input 
                        autoFocus
                        className="flex-1 bg-slate-800 border border-indigo-500 rounded px-2 py-1 text-xs text-white outline-none"
                        placeholder="Nazwa technologii..."
                        value={newTechValue}
                        onChange={(e) => setNewTechValue(e.target.value)}
                        onBlur={() => !newTechValue && setAddingTechTo(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateTech(cat.id);
                          if (e.key === 'Escape') setAddingTechTo(null);
                        }}
                      />
                      <button onClick={() => setAddingTechTo(null)} className="text-slate-500 hover:text-white"><X size={14}/></button>
                    </div>
                  </li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 bg-slate-950/50 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-900/40">
            TC
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-200 truncate tracking-tight">TERMO-CAD</h4>
            <p className="text-[10px] text-slate-500 truncate">Calculator 0.6.0</p>
          </div>
          <button className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors">
            <Settings size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
