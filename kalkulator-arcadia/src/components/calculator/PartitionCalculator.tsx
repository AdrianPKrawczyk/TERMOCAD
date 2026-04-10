import React, { useState } from 'react';
import { Play, AlertCircle, Settings2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Variant, TechnologyMaterial } from '../../store/useAppStore';
import MaterialTable from './MaterialTable';

interface PartitionCalculatorProps {
  onGenerate: (variants: Variant[]) => void;
  initialMaterials?: TechnologyMaterial[];
  onUpdateMaterials: (materials: TechnologyMaterial[]) => void;
}

const PartitionCalculator: React.FC<PartitionCalculatorProps> = ({ 
  onGenerate, 
  initialMaterials = [], 
  onUpdateMaterials 
}) => {
  const { globalSettings } = useAppStore();
  
  // Stan formularza lokalny dla zakresu grubości
  const [thicknessStart, setThicknessStart] = useState(5);
  const [thicknessEnd, setThicknessEnd] = useState(30);
  const [thicknessStep, setThicknessStep] = useState(1);
  const [fixedCost, setFixedCost] = useState(0); 
  const [laborCost, setLaborCost] = useState(50); 

  const handleGenerate = () => {
    const newVariants: Variant[] = [];
    
    // Znajdź materiał bazowy
    const baseMatInfo = initialMaterials.find(m => m.isBase);
    if (!baseMatInfo) {
      alert('Musisz zaznaczyć jeden materiał jako BAZOWY (skalowany z grubością).');
      return;
    }

    const basePrice = globalSettings.baseMaterials[baseMatInfo.materialId] || 0;
    
    // Oblicz koszt stały z pozostałych materiałów
    const otherMaterialsCost = initialMaterials
      .filter(m => !m.isBase)
      .reduce((sum, m) => {
        const price = globalSettings.baseMaterials[m.materialId] || 0;
        return sum + (price * m.usage);
      }, 0);

    for (let t = thicknessStart; t <= thicknessEnd; t += thicknessStep) {
      // WZÓR: 
      // Koszt bazowy = (grubość m) * cena m3 * zużycie (zazwyczaj 1.0)
      const materialCostBase = (t / 100) * basePrice * baseMatInfo.usage;
      
      const totalCost = materialCostBase + otherMaterialsCost + fixedCost + laborCost;

      newVariants.push({
        id: crypto.randomUUID(),
        thickness: t,
        name: `${baseMatInfo.materialId.split('(')[0].trim()} - ${t}cm`,
        unit: 'zł/m2',
        totalCost: Number(totalCost.toFixed(2)),
      });
    }

    onGenerate(newVariants);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col gap-10">
          
          {/* SEKCJA 1: PARAMETRY ZAKRESU (TERAZ NA GÓRZE) */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
               <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <Settings2 size={20} />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Parametry Zakresu Kalkulacji</h3>
                  <p className="text-xs text-slate-500 font-medium">Zdefiniuj zakres grubości izolacji oraz koszty robocizny.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="space-y-1.5 lg:col-span-1">
                <span className="text-[11px] text-slate-400 block font-black uppercase tracking-widest ml-1">Od (cm)</span>
                <input 
                  type="number" 
                  value={thicknessStart} 
                  onChange={(e) => setThicknessStart(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div className="space-y-1.5 lg:col-span-1">
                <span className="text-[11px] text-slate-400 block font-black uppercase tracking-widest ml-1">Do (cm)</span>
                <input 
                  type="number" 
                  value={thicknessEnd} 
                  onChange={(e) => setThicknessEnd(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div className="space-y-1.5 lg:col-span-1">
                <span className="text-[11px] text-slate-400 block font-black uppercase tracking-widest ml-1">Skok (cm)</span>
                <input 
                  type="number" 
                  value={thicknessStep} 
                  onChange={(e) => setThicknessStep(parseInt(e.target.value) || 1)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div className="space-y-1.5 lg:col-span-1">
                <span className="text-[11px] text-slate-400 block font-black uppercase tracking-widest ml-1">Stałe (zł/m2)</span>
                <input 
                  type="number" 
                  value={fixedCost}
                  onChange={(e) => setFixedCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="np. rusztowania"
                />
              </div>
              <div className="space-y-1.5 lg:col-span-1">
                <span className="text-[11px] text-slate-400 block font-black uppercase tracking-widest ml-1">Robocizna (zł/m2)</span>
                <input 
                  type="number" 
                  value={laborCost}
                  onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* SEKCJA 2: KONFIGURACJA MATERIAŁÓW (POD SPODEM) */}
          <div className="space-y-4">
            <MaterialTable 
              materials={initialMaterials} 
              onUpdate={onUpdateMaterials} 
            />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-8">
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
            <AlertCircle size={16} className="text-amber-500" />
            <span className="text-xs text-amber-700 font-bold uppercase tracking-tight">Uwaga: Generowanie zastąpi istniejące warianty.</span>
          </div>
          
          <button 
            onClick={handleGenerate}
            className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 transition-all transform active:scale-95 text-base"
          >
            <Play size={20} fill="currentColor" />
            Generuj tabelę wariantów
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartitionCalculator;
