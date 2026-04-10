import React, { useState } from 'react';
import { Play, Calculator, AlertCircle } from 'lucide-react';
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
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KONFIGURACJA MATERIAŁÓW */}
          <div className="space-y-4">
            <MaterialTable 
              materials={initialMaterials} 
              onUpdate={onUpdateMaterials} 
            />
          </div>

          {/* PARAMETRY ZAKRESU I KOSZTY */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <Calculator size={14} /> Zakres grubości izolacji (cm)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">Od (cm)</span>
                  <input 
                    type="number" 
                    value={thicknessStart} 
                    onChange={(e) => setThicknessStart(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">Do (cm)</span>
                  <input 
                    type="number" 
                    value={thicknessEnd} 
                    onChange={(e) => setThicknessEnd(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">Skok (cm)</span>
                  <input 
                    type="number" 
                    value={thicknessStep} 
                    onChange={(e) => setThicknessStep(parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-bold">Dodatkowe koszty stałe (zł/m2)</span>
                <input 
                  type="number" 
                  value={fixedCost}
                  onChange={(e) => setFixedCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="np. rusztowania"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-bold">Robocizna (zł/m2)</span>
                <input 
                  type="number" 
                  value={laborCost}
                  onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <div className="flex items-center gap-2 text-xs text-amber-600 font-medium font-bold">
            <AlertCircle size={14} />
            <span>Uwaga: Nowa lista nadpisze poprzednie dane dla przegrody.</span>
          </div>
          
          <button 
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 text-sm"
          >
            <Play size={18} fill="currentColor" />
            Generuj tabelę wariantów
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartitionCalculator;
