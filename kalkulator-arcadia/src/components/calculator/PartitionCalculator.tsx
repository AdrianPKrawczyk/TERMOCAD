import React, { useState } from 'react';
import { Play, AlertCircle, Settings2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Variant, TechnologyMaterial, Technology, TechnologyLabor, TechnologyFixedCost } from '../../store/useAppStore';
import MaterialTable from './MaterialTable';
import LaborTable from './LaborTable';
import FixedCostTable from './FixedCostTable';
import { generatePartitionVariants } from '../../utils/calculations';

interface PartitionCalculatorProps {
  technology: Technology;
  onGenerate: (variants: Variant[]) => void;
  initialMaterials?: TechnologyMaterial[];
  initialLabor?: TechnologyLabor[];
  initialFixedCosts?: TechnologyFixedCost[];
  onUpdateMaterials: (materials: TechnologyMaterial[]) => void;
  onUpdateLabor: (labor: TechnologyLabor[]) => void;
  onUpdateFixedCosts: (fixedCosts: TechnologyFixedCost[]) => void;
  onUpdateParameters: (params: Partial<Technology>) => void;
}

const PartitionCalculator: React.FC<PartitionCalculatorProps> = ({ 
  technology,
  onGenerate, 
  initialMaterials = [], 
  initialLabor = [],
  initialFixedCosts = [],
  onUpdateMaterials,
  onUpdateLabor,
  onUpdateFixedCosts,
  onUpdateParameters
}) => {
  const { globalSettings } = useAppStore();
  
  // Stan formularza lokalny dla zakresu grubości (z domyślnymi wartościami)
  const [thicknessStart, setThicknessStart] = useState(technology.thicknessStart ?? 5);
  const [thicknessEnd, setThicknessEnd] = useState(technology.thicknessEnd ?? 30);
  const [thicknessStep, setThicknessStep] = useState(technology.thicknessStep ?? 1);
  const [fixedCost, setFixedCost] = useState(technology.fixedCost ?? 0); 
  const [laborCost, setLaborCost] = useState(technology.laborCost ?? 50); 
  
  // Progi robocizny skokowej
  const [t1Active, setT1Active] = useState(technology.t1Active ?? false);
  const [t1Value, setT1Value] = useState(technology.t1Value ?? 3);
  const [t1Mult, setT1Mult] = useState(technology.t1Mult ?? 2.0);
  
  const [t2Active, setT2Active] = useState(technology.t2Active ?? false);
  const [t2Value, setT2Value] = useState(technology.t2Value ?? 6);
  const [t2Mult, setT2Mult] = useState(technology.t2Mult ?? 3.0);

  // Synchronizacja z Zustand przy otwarciu nowej technologii
  React.useEffect(() => {
    setThicknessStart(technology.thicknessStart ?? 5);
    setThicknessEnd(technology.thicknessEnd ?? 30);
    setThicknessStep(technology.thicknessStep ?? 1);
    setFixedCost(technology.fixedCost ?? 0);
    setLaborCost(technology.laborCost ?? 50);
    setT1Active(technology.t1Active ?? false);
    setT1Value(technology.t1Value ?? 3);
    setT1Mult(technology.t1Mult ?? 2.0);
    setT2Active(technology.t2Active ?? false);
    setT2Value(technology.t2Value ?? 6);
    setT2Mult(technology.t2Mult ?? 3.0);
  }, [technology.id]);

  // Automatyczny zapis w tle do globalnego stanu przy zmianach formularza
  React.useEffect(() => {
    onUpdateParameters({
      thicknessStart,
      thicknessEnd,
      thicknessStep,
      fixedCost,
      laborCost,
      t1Active,
      t1Value,
      t1Mult,
      t2Active,
      t2Value,
      t2Mult
    });
  }, [thicknessStart, thicknessEnd, thicknessStep, fixedCost, laborCost, t1Active, t1Value, t1Mult, t2Active, t2Value, t2Mult]);

  const handleGenerate = () => {
    const newVariants = generatePartitionVariants(technology, globalSettings);
    if (newVariants.length === 0) {
      alert('Musisz zaznaczyć jeden materiał jako BAZOWY (skalowany z grubością).');
      return;
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

            {/* SEKCJA 1B: SKOKOWE PROGI ROBOCIZNY */}
            <div className="bg-slate-100/50 rounded-2xl p-5 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                Mnożniki skokowe robocizny (Opcjonalne)
              </h4>
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* PRÓG 1 */}
                <div className={`flex-1 flex flex-col gap-3 p-4 rounded-xl border transition-all ${t1Active ? 'bg-white border-indigo-200 shadow-sm' : 'bg-transparent border-slate-200'}`}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={t1Active} 
                      onChange={(e) => setT1Active(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-800">Próg 1</span>
                  </label>
                  
                  {t1Active && (
                    <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-200">
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Grubość (cm) &gt;</span>
                        <input 
                          type="number" 
                          value={t1Value} 
                          onChange={(e) => setT1Value(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Mnożnik (x)</span>
                        <input 
                          type="number" 
                          step="0.1"
                          value={t1Mult} 
                          onChange={(e) => setT1Mult(parseFloat(e.target.value) || 1)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* PRÓG 2 */}
                <div className={`flex-1 flex flex-col gap-3 p-4 rounded-xl border transition-all ${t2Active ? 'bg-white border-indigo-200 shadow-sm' : 'bg-transparent border-slate-200'}`}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={t2Active} 
                      onChange={(e) => setT2Active(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-800">Próg 2</span>
                  </label>
                  
                  {t2Active && (
                    <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-200">
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Grubość (cm) &gt;</span>
                        <input 
                          type="number" 
                          value={t2Value} 
                          onChange={(e) => setT2Value(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Mnożnik (x)</span>
                        <input 
                          type="number" 
                          step="0.1"
                          value={t2Mult} 
                          onChange={(e) => setT2Mult(parseFloat(e.target.value) || 1)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          </div>
          
          <hr className="border-slate-200" />

          {/* SEKCJA 2: KONFIGURACJA MATERIAŁÓW I KOSZTÓW (POD SPODEM) */}
          <div className="space-y-4">
            <MaterialTable 
              materials={initialMaterials} 
              onUpdate={onUpdateMaterials} 
            />
            <LaborTable
              laborEntries={initialLabor}
              onUpdate={onUpdateLabor}
            />
            <FixedCostTable
              fixedCostEntries={initialFixedCosts}
              onUpdate={onUpdateFixedCosts}
            />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-8">
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
            <AlertCircle size={16} className="text-amber-500" />
            <span className="text-xs text-amber-700 font-bold uppercase tracking-tight">
              {technology.isLocked ? 'Uwaga: Technologia jest ZABLOKOWANA. Odblokuj, aby wygenerować.' : 'Uwaga: Generowanie zastąpi istniejące warianty.'}
            </span>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={technology.isLocked}
            className={`flex items-center gap-3 px-10 py-4 font-black rounded-2xl shadow-xl transition-all transform active:scale-95 text-base ${
              technology.isLocked 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
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
