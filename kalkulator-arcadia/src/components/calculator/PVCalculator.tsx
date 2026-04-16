import React, { useState } from 'react';
import { Play, Sun, AlertCircle } from 'lucide-react';
import type { Variant, Technology } from '../../store/useAppStore';
import { generatePVVariants } from '../../utils/calculations';

interface PVCalculatorProps {
  technology: Technology;
  onGenerate: (variants: Variant[]) => void;
  onUpdateParameters: (params: Partial<Technology>) => void;
}

const PVCalculator: React.FC<PVCalculatorProps> = ({ technology, onGenerate, onUpdateParameters }) => {
  const [effStart, setEffStart] = useState(technology.effStart ?? 18);
  const [effEnd, setEffEnd] = useState(technology.effEnd ?? 25);
  const [effStep, setEffStep] = useState(technology.effStep ?? 1);
  const [basePrice, setBasePrice] = useState(technology.effBasePrice ?? 6000);
  const [fixedCost, setFixedCost] = useState(technology.fixedCost ?? 0);
  const [stepExtra, setStepExtra] = useState(technology.effStepExtra ?? 200);
  const [unit, setUnit] = useState(technology.unit ?? 'zł/kWp');

  // Sync
  React.useEffect(() => {
    setEffStart(technology.effStart ?? 18);
    setEffEnd(technology.effEnd ?? 25);
    setEffStep(technology.effStep ?? 1);
    setBasePrice(technology.effBasePrice ?? 6000);
    setFixedCost(technology.fixedCost ?? 0);
    setStepExtra(technology.effStepExtra ?? 200);
  }, [technology.id]);

  // Auto-save
  React.useEffect(() => {
    onUpdateParameters({
      effStart, effEnd, effStep, effBasePrice: basePrice, fixedCost, effStepExtra: stepExtra, unit
    });
  }, [effStart, effEnd, effStep, basePrice, fixedCost, stepExtra, unit]);

  const handleGenerate = () => {
    const newVariants = generatePVVariants(technology);
    onGenerate(newVariants);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ZAKRES SPRAWNOŚCI */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Sun size={14} /> Zakres Sprawności Paneli (%)
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1 font-bold">Start (%)</span>
              <input 
                type="number" 
                value={effStart} 
                onChange={(e) => setEffStart(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1 font-bold">Koniec (%)</span>
              <input 
                type="number" 
                value={effEnd} 
                onChange={(e) => setEffEnd(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1 font-bold">Skok (%)</span>
              <input 
                type="number" 
                value={effStep} 
                onChange={(e) => setEffStep(parseFloat(e.target.value) || 1)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* PARAMETRY CENOWE */}
        <div className="space-y-4">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
             Konfiguracja Cennika PV
           </label>
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <span className="text-[10px] text-slate-400 block mb-1 font-bold">Cena bazowa (zł)</span>
                <input 
                  type="number" 
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-indigo-600"
                />
              </div>
              <div className="col-span-1">
                <span className="text-[10px] text-slate-400 block mb-1 font-bold">Dopłata za +skok (zł)</span>
                <input 
                  type="number" 
                  value={stepExtra}
                  onChange={(e) => setStepExtra(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-indigo-600"
                />
              </div>
              <div className="col-span-1">
                <span className="text-[10px] text-slate-400 block mb-1 font-bold">Koszty stałe (zł)</span>
                <input 
                  type="number" 
                  value={fixedCost}
                  onChange={(e) => setFixedCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-indigo-600"
                />
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 block mb-1 font-bold">Jednostka</span>
                <input 
                  type="text" 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 font-medium"
                />
              </div>
           </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        <div className="flex items-center gap-2 text-xs text-amber-600 font-bold">
          <AlertCircle size={14} />
          <span>{technology.isLocked ? 'Uwaga: Technologia ZABLOKOWANA. Odblokuj, aby wygenerować.' : 'Uwaga: Nowa lista nadpisze poprzednie dane dla PV.'}</span>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={technology.isLocked}
          className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl shadow-lg transition-all transform active:scale-95 text-sm ${
            technology.isLocked 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
          }`}
        >
          <Play size={18} fill="currentColor" />
          Generuj warianty instalacji PV
        </button>
      </div>
    </div>
  );
};

export default PVCalculator;
