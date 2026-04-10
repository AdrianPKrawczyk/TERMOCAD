import React from 'react';
import { LayoutGrid, Calculator, Edit3 } from 'lucide-react';

const MainContent: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Widok pusty - Placeholder */}
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center text-indigo-500 mb-2">
            <LayoutGrid size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Wybierz technologię</h2>
          <p className="text-slate-500 max-w-md">
            Wybierz kategorię z panelu po lewej stronie, a następnie konkretną technologię, 
            aby rozpocząć przeliczanie kosztów lub edycję wariantów.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-lg">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <Calculator className="text-indigo-600 mb-3" size={24} />
              <h3 className="font-semibold text-slate-800 mb-1">Tryb Automatyczny</h3>
              <p className="text-xs text-slate-500">Przeliczaj ceny na podstawie zakresu grubości i zmiennych globalnych.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <Edit3 className="text-indigo-600 mb-3" size={24} />
              <h3 className="font-semibold text-slate-800 mb-1">Tryb Ręczny</h3>
              <p className="text-xs text-slate-500">Wprowadzaj własne nazwy, jednostki i ceny dla każdego wariantu.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
