import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Technology, Variant } from '../../store/useAppStore';
import { Calculator, Edit3, ChevronRight } from 'lucide-react';
import AutoCalculator from './AutoCalculator';
import ManualTable from './ManualTable';
import VariantsTable from './VariantsTable';

const TechnologyView: React.FC = () => {
  const { 
    categories, 
    selectedCategoryId, 
    selectedTechnologyId, 
    updateTechnology, 
    updateVariants 
  } = useAppStore();

  // Znajdź wybraną technologię
  const category = categories.find(c => c.id === selectedCategoryId);
  const technology = category?.technologies.find(t => t.id === selectedTechnologyId);

  if (!category || !technology) {
    return null;
  }

  const handleModeChange = (type: 'AUTO' | 'MANUAL') => {
    updateTechnology(category.id, technology.id, { calculationType: type });
  };

  const handleUpdateVariants = (variants: Variant[]) => {
    updateVariants(category.id, technology.id, variants);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* NAGŁÓWEK WIDOKU */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            <span>{category.name}</span>
            <ChevronRight size={12} />
            <span className="text-slate-500">Technologia</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">
            {technology.name}
          </h2>
        </div>

        {/* PRZEŁĄCZNIK TRYBU */}
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

      <div className="space-y-6">
        {/* OBSZAR KONFIGURACJI / EDYCJI */}
        {technology.calculationType === 'AUTO' ? (
          <>
            <AutoCalculator onGenerate={handleUpdateVariants} />
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Wygenerowane warianty</h3>
              <VariantsTable variants={technology.variants} />
            </div>
          </>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Edycja manualna wariantów</h3>
            <ManualTable variants={technology.variants} onUpdate={handleUpdateVariants} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnologyView;
