import type { Technology, GlobalSettings, Variant } from '../store/useAppStore';

/**
 * Przelicza warianty dla Przegród (PARTITIONS)
 */
export const generatePartitionVariants = (tech: Technology, globals: GlobalSettings): Variant[] => {
  const newVariants: Variant[] = [];
  
  const thicknessStart = tech.thicknessStart ?? 5;
  const thicknessEnd = tech.thicknessEnd ?? 30;
  const thicknessStep = tech.thicknessStep ?? 1;
  const fixedCost = tech.fixedCost ?? 0;
  const laborCost = tech.laborCost ?? 50;
  
  const t1Active = tech.t1Active ?? false;
  const t1Value = tech.t1Value ?? 3;
  const t1Mult = tech.t1Mult ?? 2.0;
  
  const t2Active = tech.t2Active ?? false;
  const t2Value = tech.t2Value ?? 6;
  const t2Mult = tech.t2Mult ?? 3.0;

  // Znajdź materiał bazowy
  const baseMatInfo = tech.materials.find(m => m.isBase);
  if (!baseMatInfo) return [];

  const basePrice = globals.baseMaterials[baseMatInfo.materialId] || 0;
  
  // Oblicz koszt stały z pozostałych materiałów
  const otherMaterialsCost = tech.materials
    .filter(m => !m.isBase)
    .reduce((sum, m) => {
      const price = globals.baseMaterials[m.materialId] || 0;
      return sum + (price * m.usage);
    }, 0);

  // Oblicz statyczną robociznę z listy (bez progów grubości)
  const listLaborCost = (tech.laborEntries || []).reduce((sum, l) => {
    const price = globals.baseLabor[l.laborId] || 0;
    return sum + (price * l.usage);
  }, 0);

  // Oblicz koszty stałe z listy
  const listFixedCosts = (tech.fixedCostEntries || []).reduce((sum, f) => {
    const price = globals.baseFixedCosts[f.costId] || 0;
    return sum + (price * f.usage);
  }, 0);

  for (let t = thicknessStart; t <= thicknessEnd; t += thicknessStep) {
    const materialCostBase = (t / 100) * basePrice * baseMatInfo.usage;
    let currentLaborCost = laborCost + listLaborCost;
    
    if (t2Active && t > t2Value) {
      currentLaborCost *= t2Mult;
    } else if (t1Active && t > t1Value) {
      currentLaborCost *= t1Mult;
    }

    const totalCost = materialCostBase + otherMaterialsCost + fixedCost + listFixedCosts + currentLaborCost;

    newVariants.push({
      id: crypto.randomUUID(),
      thickness: t,
      name: `${baseMatInfo.materialId.split('(')[0].trim()} - ${t}cm`,
      unit: 'zł/m2',
      totalCost: Number(totalCost.toFixed(2)),
    });
  }

  return newVariants;
};

/**
 * Przelicza warianty dla Stolarki (JOINERY)
 */
export const generateJoineryVariants = (tech: Technology): Variant[] => {
  const newVariants: Variant[] = [];
  
  const uStart = tech.uStart ?? 1.1;
  const uEnd = tech.uEnd ?? 0.6;
  const uStep = tech.uStep ?? 0.1;
  const basePrice = tech.uBasePrice ?? 800; // uBasePrice zamiast uStart w Joinery? Sprawdźmy interfejs
  const fixedCost = tech.fixedCost ?? 0;
  const stepExtra = tech.uStepExtra ?? 50;

  const delta = 0.00001;
  const unit = tech.unit || 'szt.';
  
  for (let u = uStart; u >= uEnd - delta; u -= uStep) {
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

  return newVariants;
};

/**
 * Przelicza warianty dla Instalacji PV (INSTALLATIONS)
 */
export const generatePVVariants = (tech: Technology): Variant[] => {
  const newVariants: Variant[] = [];
  
  const effStart = tech.effStart ?? 18;
  const effEnd = tech.effEnd ?? 25;
  const effStep = tech.effStep ?? 1;
  const basePrice = tech.effBasePrice ?? 6000;
  const fixedCost = tech.fixedCost ?? 0;
  const stepExtra = tech.effStepExtra ?? 200;

  const delta = 0.00001;
  const unit = tech.unit || 'zł/kWp';
  
  for (let eff = effStart; eff <= effEnd + delta; eff += effStep) {
    const stepsCount = Math.round((eff - effStart) / effStep);
    const totalCost = basePrice + (stepsCount * stepExtra) + fixedCost;

    newVariants.push({
      id: crypto.randomUUID(),
      efficiency: Math.round(eff * 100) / 100,
      name: `Instalacja PV - sprawność ${eff.toFixed(1)}%`,
      unit: unit,
      totalCost: Number(totalCost.toFixed(2)),
    });
  }

  return newVariants;
};
