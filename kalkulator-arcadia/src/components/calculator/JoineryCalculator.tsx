import React, { useState } from 'react';
import { Play, Square, AlertCircle, Info } from 'lucide-react';
import type { Variant } from '../../store/useAppStore';

interface JoineryCalculatorProps {
  onGenerate: (variants: Variant[]) => void;
}

const JoineryCalculator: React.FC<JoineryCalculatorProps> = ({ onGenerate }) => {
  const [uStart, setUStart] = useState(1.1);
  const [uEnd, setUEnd] = useState(0.6);
  const [uStep, setUStep] = useState(0.1);
  const [basePrice, setBasePrice] = useState(800);
  const [fixedCost, setFixedCost] = useState(0); // Koszt montażu / stały
  const [stepExtra, setStepExtra] = useState(50);
  const [unit, setUnit] = useState('szt.');

  const handleGenerate = () => {
    const newVariants: Variant[] = [];
    
    // Obsługa malejącego parametru U
    // Używamy małej delty do porównań zmiennoprzecinkowych
    const delta = 0.00001;
    
    for (let u = uStart; u >= uEnd - delta; u -= uStep) {
      // WZÓR: Cena = Cena_bazowa + ( (U_poczatkowe - U_aktualne) / Skok ) * Doplata_za_skok + Koszt_staly
      const stepsCount = Math.round((uStart - u) / uStep);
      const totalCost = basePrice + (stepsCount * stepExtra) + fixedCost;

      newVariants.push({
        id: crypto.randomUUID(),
        uValue: Math.round(u * 100) / 100,
        name: `Okno/Drzwi U=${u.toFixed(2)} W/m2K`,
        unit: unit,
        totalCost: Number(totalCost.toFixed(2)),
      });
    }

    onGenerate(newVariants);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ZAKRES WSPÓŁCZYNNIKA U */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Square size={14} /> Zakres współczynnika U (W/m2K)
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1 font-bold">U początkowe</span>
              <input 
                type="number" step="0.05"
                value={uStart} 
                onChange={(e) => setUStart(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1 font-bold">U końcowe</span>
              <input 
                type="number" step="0.05"
                value={uEnd} 
                onChange={(e) => setUEnd(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1 font-bold">Skok U</span>
              <input 
                type="number" step="0.01"
                value={uStep} 
                onChange={(e) => setUStep(parseFloat(e.target.value) || 0.1)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700"
              />
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
             <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
             <p className="text-[10px] text-amber-700 leading-relaxed italic font-medium">
               Uwaga: W oknach parametry są generowane malejąco (np. od 1.1 do 0.6). 
               Im mniejszy współczynnik U, tym cieplejsze i zazwyczaj droższe rozwiązanie.
             </p>
          </div>
        </div>

        {/* PARAMETRY CENOWE */}
        <div className="space-y-4">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
             Konfiguracja Cennika
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
                <span className="text-[10px] text-slate-400 block mb-1 font-bold">Dopłata za skok (zł)</span>
                <input 
                  type="number" 
                  value={stepExtra}
                  onChange={(e) => setStepExtra(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-indigo-600"
                />
              </div>
              <div className="col-span-1">
                <span className="text-[10px] text-slate-400 block mb-1 font-bold">Stałe (montaż) (zł)</span>
                <input 
                  type="number" 
                  value={fixedCost}
                  onChange={(e) => setFixedCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-indigo-600"
                />
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 block mb-1 font-bold">Jednostka miary</span>
                <input 
                  type="text" 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600"
                  placeholder="np. szt. lub m2"
                />
              </div>
           </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
        <div className="flex items-center gap-2 text-xs text-amber-600 font-medium font-bold">
          <AlertCircle size={14} />
          <span>Generowanie nadpisze listę wariantów dla tej technologii.</span>
        </div>
        
        <button 
          onClick={handleGenerate}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 text-sm"
        >
          <Play size={18} fill="currentColor" />
          Generuj warianty stolarki
        </button>
      </div>
    </div>
  );
};

export default JoineryCalculator;
