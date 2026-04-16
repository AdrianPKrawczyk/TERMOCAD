import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Edit3, ChevronRight, FileText, ChevronDown, ChevronUp, Eye, Lock, Unlock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppStore } from '../../store/useAppStore';
import type { Variant, TechnologyMaterial, Technology, TechnologyLabor, TechnologyFixedCost } from '../../store/useAppStore';
import PartitionCalculator from './PartitionCalculator';
import JoineryCalculator from './JoineryCalculator';
import PVCalculator from './PVCalculator';
import ManualTable from './ManualTable';
import VariantsTable from './VariantsTable';

const TechnologyView: React.FC = () => {
  const { 
    categories, 
    selectedCategoryId, 
    selectedTechnologyId, 
    updateTechnology, 
    updateVariants,
    updateTechnologyNotes
  } = useAppStore();

  // Znajdź wybraną technologię
  const category = categories.find(c => c.id === selectedCategoryId);
  const technology = category?.technologies.find(t => t.id === selectedTechnologyId);

  const [showNotes, setShowNotes] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-przełączanie w tryb edycji jeśli notatka jest pusta
  useEffect(() => {
    if (technology && !technology.notes) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [selectedTechnologyId]);

  // Auto-rozszerzanie wysokości pola tekstowego
  useEffect(() => {
    if (textareaRef.current && showNotes && isEditing) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [technology?.notes, showNotes, isEditing]);

  if (!category || !technology) {
    return null;
  }

  const handleModeChange = (type: 'AUTO' | 'MANUAL') => {
    updateTechnology(category.id, technology.id, { calculationType: type });
  };

  const handleUpdateVariants = (variants: Variant[]) => {
    updateVariants(category.id, technology.id, variants);
  };

  const handleToggleLock = () => {
    updateTechnology(category.id, technology.id, { isLocked: !technology.isLocked });
  };

  const handleUpdateMaterials = (materials: TechnologyMaterial[]) => {
    updateTechnology(category.id, technology.id, { materials });
  };

  const handleUpdateLabor = (laborEntries: TechnologyLabor[]) => {
    updateTechnology(category.id, technology.id, { laborEntries });
  };

  const handleUpdateFixedCosts = (fixedCostEntries: TechnologyFixedCost[]) => {
    updateTechnology(category.id, technology.id, { fixedCostEntries });
  };

  const handleUpdateParameters = (updates: Partial<Technology>) => {
    updateTechnology(category.id, technology.id, updates);
  };

  const renderAutoCalculator = () => {
    switch (category.type) {
      case 'PARTITIONS':
        return (
          <PartitionCalculator 
            technology={technology}
            initialMaterials={technology.materials}
            initialLabor={technology.laborEntries || []}
            initialFixedCosts={technology.fixedCostEntries || []}
            onUpdateMaterials={handleUpdateMaterials}
            onUpdateLabor={handleUpdateLabor}
            onUpdateFixedCosts={handleUpdateFixedCosts}
            onGenerate={handleUpdateVariants}
            onUpdateParameters={handleUpdateParameters}
          />
        );
      case 'JOINERY':
        return (
          <JoineryCalculator 
            technology={technology} 
            onGenerate={handleUpdateVariants} 
            onUpdateParameters={handleUpdateParameters}
          />
        );
      case 'INSTALLATIONS':
        return (
          <PVCalculator 
            technology={technology} 
            onGenerate={handleUpdateVariants} 
            onUpdateParameters={handleUpdateParameters}
          />
        );
      default:
        return <div>Nieobsługiwany typ kategorii</div>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* NAGŁÓWEK WIDOKU */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">
            <span>{category.name}</span>
            <ChevronRight size={10} />
            <span className="text-slate-500">Technologia</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">
            {technology.name}
          </h2>
        </div>

        {/* BLOKADA I PRZEŁĄCZNIK TRYBU */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleLock}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              technology.isLocked 
              ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' 
              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title={technology.isLocked ? 'Odblokuj przeliczanie' : 'Zablokuj przed automatycznym przeliczeniem'}
          >
            {technology.isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            {technology.isLocked ? 'Zablokowano' : 'Odblokowano'}
          </button>

          <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
            <button 
              onClick={() => handleModeChange('AUTO')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                technology.calculationType === 'AUTO' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Calculator size={18} />
              Kalkulator (Auto)
            </button>
            <button 
              onClick={() => handleModeChange('MANUAL')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                technology.calculationType === 'MANUAL' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Edit3 size={18} />
              Ręczne wpisywanie
            </button>
          </div>
        </div>
      </div>

      {/* SEKCJA UWAG */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4 border-r border-slate-200 pr-4">
              <FileText size={18} className="text-slate-400" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Uwagi i Notatki</h3>
            </div>

            <div className="flex p-0.5 bg-slate-100 rounded-lg mr-2">
              <button 
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                  isEditing 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Edit3 size={12} />
                Edytuj
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                  !isEditing 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Eye size={12} />
                Podgląd
              </button>
            </div>
            
            <button 
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 transition-colors"
            >
              {showNotes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
        
        {showNotes && (
          <div className="mt-2">
            {isEditing ? (
              <textarea 
                ref={textareaRef}
                placeholder="Dodaj dodatkowe informacje... (możesz używać Markdown: # nagłówek, - lista, **pogrubienie**)"
                className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none overflow-hidden font-mono"
                value={technology.notes}
                onChange={(e) => updateTechnologyNotes(category.id, technology.id, e.target.value)}
              />
            ) : (
              <div className="markdown-content p-4 bg-slate-50 border border-slate-50 rounded-xl min-h-[100px]">
                {technology.notes ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{technology.notes}</ReactMarkdown>
                ) : (
                  <span className="italic text-slate-400 text-xs">Brak notatek do wyświetlenia. Kliknij "Edytuj", aby coś dopisać.</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* OBSZAR KONFIGURACJI / EDYCJI */}
        {technology.calculationType === 'AUTO' ? (
          <>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Calculator size={18} />
               </div>
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">Parametry Kalkulacji (Tryb AUTO)</h3>
            </div>
            {renderAutoCalculator()}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Wygenerowane warianty kosztowe</h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">Liczba pozycji: {technology.variants.length}</span>
              </div>
              <VariantsTable variants={technology.variants} />
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <Edit3 size={18} />
               </div>
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">Edycja manualna wariantów</h3>
            </div>
            <ManualTable variants={technology.variants} onUpdate={handleUpdateVariants} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnologyView;
