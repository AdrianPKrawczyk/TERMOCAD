import React, { useState } from 'react';
import { Play, Calculator, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Variant } from '../../store/useAppStore';

interface AutoCalculatorProps {
  onGenerate: (variants: Variant[]) => void;
}

const AutoCalculator: React.FC<AutoCalculatorProps> = ({ onGenerate }) => {
  const { globalSettings } = useAppStore();
  
  // Stan formularza lokalny
  const [thicknessStart, setThicknessStart] = useState(5);
  const [thicknessEnd, setThicknessEnd] = useState(30);
  const [thicknessStep, setThicknessStep] = useState(1);
  const [materialKey, setMaterialKey] = useState(Object.keys(globalSettings.baseMaterials)[0] || '');
  const [fixedCost, setFixedCost] = useState(120); // Domyślnie np. tynki, kleje
  const [laborCost, setLaborCost] = useState(50); // Domyślnie stała stawka robocizny per m2

  const handleGenerate = () => {
    const newVariants: Variant[] = [];
    const matPrice = globalSettings.baseMaterials[materialKey] || 0;

    for (let t = thicknessStart; t <= thicknessEnd; t += thicknessStep) {
      // WZÓR: Koszt materiału = (grubość m) * cena m3
      const materialCost = (t / 100) * matPrice;
      const totalCost = materialCost + fixedCost + laborCost;

      newVariants.push({
        id: crypto.randomUUID(),
        thickness: t,
        name: `${materialKey.split('(')[0].trim()} - ${t}cm`,
        unit: 'zł/m2',
        totalCost: Number(totalCost.toFixed(2)),
      });
    }

    onGenerate(newVariants);
  };

  const materialKeys = Object.keys(globalSettings.baseMaterials);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ZAKRES GRUBOŚCI */}
        <div className="space-y-4 md:col-span-1">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Calculator size={14} /> Zakres grubości (cm)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Od</span>
              <input 
                type="number" 
                value={thicknessStart} 
                onChange={(e) => setThicknessStart(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Do</span>
              <input 
                type="number" 
                value={thicknessEnd} 
                onChange={(e) => setThicknessEnd(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Skok</span>
              <input 
                type="number" 
                value={thicknessStep} 
                onChange={(e) => setThicknessStep(parseInt(e.target.value) || 1)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* PARAMETRY KOSZTOWE */}
        <div className="space-y-4 md:col-span-2">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
             Parametry i Materiał
           </label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Materiał bazowy (z cennika)</span>
                <select 
                  value={materialKey}
                  onChange={(e) => setMaterialKey(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                >
                  {materialKeys.map(k => (
                    <option key={k} value={k}>{k} ({globalSettings.baseMaterials[k]} zł)</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Koszty stałe (zł/m2)</span>
                  <input 
                    type="number" 
                    value={fixedCost}
                    onChange={(e) => setFixedCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Robocizna (zł/m2)</span>
                  <input 
                    type="number" 
                    value={laborCost}
                    onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        <div className="flex items-center gap-2 text-xs text-amber-600 font-medium">
          <AlertCircle size={14} />
          <span>Uwaga: Nowa lista nadpisze poprzednie dane technologii.</span>
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
  );
};

export default AutoCalculator;
