import React, { useState } from 'react';
import { Play, Sun, AlertCircle } from 'lucide-react';
import type { Variant } from '../../store/useAppStore';

interface PVCalculatorProps {
  onGenerate: (variants: Variant[]) => void;
}

const PVCalculator: React.FC<PVCalculatorProps> = ({ onGenerate }) => {
  const [effStart, setEffStart] = useState(18);
  const [effEnd, setEffEnd] = useState(25);
  const [effStep, setEffStep] = useState(1);
  const [basePrice, setBasePrice] = useState(6000); // Cena za kWp
  const [stepExtra, setStepExtra] = useState(200);
  const [unit, setUnit] = useState('zł/kWp');

  const handleGenerate = () => {
    const newVariants: Variant[] = [];
    const delta = 0.00001;

    for (let eff = effStart; eff <= effEnd + delta; eff += effStep) {
      // WZÓR: Cena = Cena_bazowa + ( (Sprawnosc_aktualna - Sprawnosc_poczatkowa) / Skok ) * Doplata_za_skok
      const stepsCount = Math.round((eff - effStart) / effStep);
      const totalCost = basePrice + (stepsCount * stepExtra);

      newVariants.push({
        id: crypto.randomUUID(),
        efficiency: Math.round(eff * 100) / 100,
        name: `Instalacja PV - sprawność ${eff.toFixed(1)}%`,
        unit: unit,
        totalCost: Number(totalCost.toFixed(2)),
      });
    }

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
        <div className="flex items-center gap-2 text-xs text-amber-600 font-medium font-bold">
          <AlertCircle size={14} />
          <span>Uwaga: Nowa lista nadpisze poprzednie dane dla PV.</span>
        </div>
        
        <button 
          onClick={handleGenerate}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 text-sm"
        >
          <Play size={18} fill="currentColor" />
          Generuj warianty instalacji PV
        </button>
      </div>
    </div>
  );
};

export default PVCalculator;
