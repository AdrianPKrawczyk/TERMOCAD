import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Technology, Variant, TechnologyMaterial } from '../../store/useAppStore';
import { Calculator, Edit3, ChevronRight, FileText, Info } from 'lucide-react';
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

  if (!category || !technology) {
    return null;
  }

  const handleModeChange = (type: 'AUTO' | 'MANUAL') => {
    updateTechnology(category.id, technology.id, { calculationType: type });
  };

  const handleUpdateVariants = (variants: Variant[]) => {
    updateVariants(category.id, technology.id, variants);
  };

  const handleUpdateMaterials = (materials: TechnologyMaterial[]) => {
    updateTechnology(category.id, technology.id, { materials });
  };

  const renderAutoCalculator = () => {
    switch (category.type) {
      case 'PARTITIONS':
        return (
          <PartitionCalculator 
            initialMaterials={technology.materials}
            onUpdateMaterials={handleUpdateMaterials}
            onGenerate={handleUpdateVariants} 
          />
        );
      case 'JOINERY':
        return <JoineryCalculator onGenerate={handleUpdateVariants} />;
      case 'INSTALLATIONS':
        return <PVCalculator onGenerate={handleUpdateVariants} />;
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

      {/* SEKCJA UWAG */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={18} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Uwagi i Notatki</h3>
        </div>
        <textarea 
          placeholder="Dodaj dodatkowe informacje o technologii, linki do materiałów producenta lub wytyczne wykonawcze..."
          className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-y"
          value={technology.notes}
          onChange={(e) => updateTechnologyNotes(category.id, technology.id, e.target.value)}
        />
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
