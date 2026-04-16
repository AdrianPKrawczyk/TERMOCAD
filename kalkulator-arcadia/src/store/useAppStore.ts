import { create } from 'zustand';
import { isElectron, saveToDisk } from '../services/storageService';

// --- Interfejsy ---

export type CategoryType = 'PARTITIONS' | 'JOINERY' | 'INSTALLATIONS';

export interface GlobalSettings {
  hourlyRate: number; // np. 45 zł/h
  baseMaterials: Record<string, number>; // np. { "EPS_036": 245, "Klej": 42.5 }
  baseLabor: Record<string, number>; // np. { "Kładzenie tynku": 35 }
  baseFixedCosts: Record<string, number>; // np. { "Rusztowania": 1500 }
}

export interface Variant {
  id: string;
  thickness?: number; // dla przegród (cm)
  uValue?: number; // dla okien
  efficiency?: number; // dla PV (%)
  name: string;
  unit: string;
  totalCost: number;
}

export interface TechnologyMaterial {
  materialId: string;
  usage: number;
  isBase: boolean;
}

export interface TechnologyLabor {
  laborId: string;
  usage: number; // zazwyczaj 1.0 (np. sztuk / jednostek przeliczeniowych) lub proporcjonalnie
}

export interface TechnologyFixedCost {
  costId: string;
  usage: number; // szt. lub inne przeliczniki
}

export interface Technology {
  id: string;
  name: string;
  calculationType: 'AUTO' | 'MANUAL';
  notes: string;
  
  // Konfiguracja dla Przegród (PARTITIONS)
  materials: TechnologyMaterial[];
  laborEntries?: TechnologyLabor[];
  fixedCostEntries?: TechnologyFixedCost[];
  
  thicknessStart?: number;
  thicknessEnd?: number;
  thicknessStep?: number;
  fixedCost?: number;
  laborCost?: number;
  t1Active?: boolean;
  t1Value?: number;
  t1Mult?: number;
  t2Active?: boolean;
  t2Value?: number;
  t2Mult?: number;

  // Konfiguracja dla Okien (JOINERY)
  uStart?: number;
  uEnd?: number;
  uStep?: number;
  uBasePrice?: number;
  uStepExtra?: number;

  // Konfiguracja dla PV (INSTALLATIONS)
  effStart?: number;
  effEnd?: number;
  effStep?: number;
  effBasePrice?: number;
  effStepExtra?: number;

  variants: Variant[];
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  technologies: Technology[];
}

interface AppState {
  globalSettings: GlobalSettings;
  categories: Category[];
  selectedCategoryId: string | null;
  selectedTechnologyId: string | null;
  currentProjectName: string;
  isDirty: boolean; // czy są niezapisane zmiany
  
  // Akcje - Nawigacja
  setSelection: (categoryId: string | null, technologyId: string | null) => void;

  // Akcje - Ustawienia Globalne
  updateGlobalSettings: (settings: GlobalSettings) => void;
  addBaseMaterial: (name: string, price: number) => void;
  addBaseLabor: (name: string, price: number) => void;
  addBaseFixedCost: (name: string, price: number) => void;
  
  // Akcje - Kategorie
  addCategory: (name: string, type: CategoryType) => void;
  renameCategory: (id: string, newName: string) => void;
  reorderCategory: (index: number, direction: -1 | 1) => void;
  removeCategory: (id: string) => void;
  
  // Akcje - Technologie
  addTechnology: (categoryId: string, name: string) => void;
  renameTechnology: (categoryId: string, techId: string, newName: string) => void;
  reorderTechnology: (categoryId: string, index: number, direction: -1 | 1) => void;
  updateTechnology: (categoryId: string, techId: string, updates: Partial<Technology>) => void;
  updateTechnologyNotes: (categoryId: string, techId: string, notes: string) => void;
  removeTechnology: (categoryId: string, techId: string) => void;
  duplicateTechnology: (categoryId: string, techId: string) => void;
  updateVariants: (categoryId: string, techId: string, variants: Variant[]) => void;
  
  // Akcje - Import Projektu/Zmiennych
  loadProjectSnapshot: (snapshot: { globalSettings: GlobalSettings; categories: Category[] }, fileName?: string) => void;
  mergeGlobalVariables: (globals: Partial<GlobalSettings>) => void;
  
  // Akcje - Electron/System
  syncWithDisk: () => Promise<void>;
  setProjectName: (name: string) => void;
}

// --- Initial State ---

const defaultGlobalSettings: GlobalSettings = {
  hourlyRate: 50,
  baseMaterials: {
    'Styropian EPS 80 (m3)': 240,
    'Klej do styropianu (kg)': 1.8,
    'Siatka zbrojąca (m2)': 4.5,
    'Tynk silikonowy (kg)': 12.0,
    'Okno PVC (szt)': 800,
    'Panel PV 400W (szt)': 600,
  },
  baseLabor: {
    'Montaż rusztowań (m2)': 15.0,
    'Układanie styropianu (m2)': 35.0,
  },
  baseFixedCosts: {
    'Zabezpieczenie placu budowy (kpl)': 500,
    'Wywóz gruzu (kontener)': 800,
  }
};

// --- Store ---

export const useAppStore = create<AppState>()((set, get) => ({
  globalSettings: defaultGlobalSettings,
  categories: [],
  selectedCategoryId: null,
  selectedTechnologyId: null,
  currentProjectName: 'Nowy Projekt',
  isDirty: false,

  setSelection: (categoryId, technologyId) =>
    set({ selectedCategoryId: categoryId, selectedTechnologyId: technologyId }),

  loadProjectSnapshot: (snapshot, fileName) => {
    // Backward compatibility: fill missing arrays with defaults
    const patchedCategories = snapshot.categories.map(cat => ({
      ...cat,
      technologies: cat.technologies.map(tech => ({
        ...tech,
        laborEntries: tech.laborEntries || [],
        fixedCostEntries: tech.fixedCostEntries || []
      }))
    }));

    const patchedGlobals = {
      ...defaultGlobalSettings,
      ...snapshot.globalSettings,
      baseMaterials: snapshot.globalSettings.baseMaterials || {},
      baseLabor: snapshot.globalSettings.baseLabor || {},
      baseFixedCosts: snapshot.globalSettings.baseFixedCosts || {}
    };

    set({
      globalSettings: patchedGlobals,
      categories: patchedCategories,
      selectedCategoryId: null,
      selectedTechnologyId: null,
      currentProjectName: fileName || get().currentProjectName,
      isDirty: false,
    });
  },

  updateGlobalSettings: (settings) => 
    set({ globalSettings: settings, isDirty: true }),

  addBaseMaterial: (name, price) =>
    set((state) => ({
      isDirty: true,
      globalSettings: {
        ...state.globalSettings,
        baseMaterials: {
          ...state.globalSettings.baseMaterials,
          [name]: price,
        },
      },
    })),

  addBaseLabor: (name, price) =>
    set((state) => ({
      isDirty: true,
      globalSettings: {
        ...state.globalSettings,
        baseLabor: {
          ...state.globalSettings.baseLabor,
          [name]: price,
        },
      },
    })),

  addBaseFixedCost: (name, price) =>
    set((state) => ({
      isDirty: true,
      globalSettings: {
        ...state.globalSettings,
        baseFixedCosts: {
          ...state.globalSettings.baseFixedCosts,
          [name]: price,
        },
      },
    })),

  mergeGlobalVariables: (globals) =>
    set((state) => ({
      isDirty: true,
      globalSettings: {
        ...state.globalSettings,
        baseMaterials: {
          ...state.globalSettings.baseMaterials,
          ...(globals.baseMaterials || {}),
        },
        baseLabor: {
          ...state.globalSettings.baseLabor,
          ...(globals.baseLabor || {}),
        },
        baseFixedCosts: {
          ...state.globalSettings.baseFixedCosts,
          ...(globals.baseFixedCosts || {}),
        },
        hourlyRate: globals.hourlyRate !== undefined ? globals.hourlyRate : state.globalSettings.hourlyRate
      },
    })),

  addCategory: (name, type) =>
    set((state) => ({
      isDirty: true,
      categories: [
        ...state.categories,
        { id: crypto.randomUUID(), name, type, technologies: [] },
      ],
    })),

  renameCategory: (id, newName) =>
    set((state) => ({
      isDirty: true,
      categories: state.categories.map(c => c.id === id ? { ...c, name: newName } : c)
    })),

  reorderCategory: (index, direction) =>
    set((state) => {
      const newCategories = [...state.categories];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newCategories.length) return state;
      [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];
      return { categories: newCategories, isDirty: true };
    }),

  removeCategory: (id) =>
    set((state) => ({
      isDirty: true,
      categories: state.categories.filter((c) => c.id !== id),
      selectedCategoryId: state.selectedCategoryId === id ? null : state.selectedCategoryId,
      selectedTechnologyId: state.selectedCategoryId === id ? null : state.selectedTechnologyId,
    })),

  addTechnology: (categoryId, name) =>
    set((state) => ({
      isDirty: true,
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              technologies: [
                ...cat.technologies,
                {
                  id: crypto.randomUUID(),
                  name,
                  notes: '',
                  calculationType: 'MANUAL',
                  materials: [],
                  laborEntries: [],
                  fixedCostEntries: [],
                  variants: [],
                },
              ],
            }
          : cat
      ),
    })),

  renameTechnology: (categoryId, id, newName) =>
    set((state) => ({
      isDirty: true,
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              technologies: cat.technologies.map((t) =>
                t.id === id ? { ...t, name: newName } : t
              ),
            }
          : cat
      ),
    })),

  reorderTechnology: (categoryId, index, direction) =>
    set((state) => ({
      isDirty: true,
      categories: state.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const newTechs = [...cat.technologies];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newTechs.length) return cat;
        [newTechs[index], newTechs[targetIndex]] = [newTechs[targetIndex], newTechs[index]];
        return { ...cat, technologies: newTechs };
      }),
    })),

  updateTechnology: (categoryId, techId, updates) =>
    set((state) => ({
      isDirty: true,
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              technologies: cat.technologies.map((tech) =>
                tech.id === techId ? { ...tech, ...updates } : tech
              ),
            }
          : cat
      ),
    })),

  updateTechnologyNotes: (categoryId, techId, notes) =>
    set((state) => ({
      isDirty: true,
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, technologies: cat.technologies.map(t => t.id === techId ? { ...t, notes } : t) }
          : cat
      )
    })),

  removeTechnology: (categoryId, techId) =>
    set((state) => ({
      isDirty: true,
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              technologies: cat.technologies.filter((tech) => tech.id !== techId),
            }
          : cat
      ),
      selectedTechnologyId: state.selectedTechnologyId === techId ? null : state.selectedTechnologyId,
    })),

  duplicateTechnology: (categoryId, techId) =>
    set((state) => ({
      isDirty: true,
      categories: state.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        
        const sourceTech = cat.technologies.find(t => t.id === techId);
        if (!sourceTech) return cat;

        const duplicatedTech: Technology = {
          ...sourceTech,
          id: crypto.randomUUID(),
          name: `${sourceTech.name} (Kopia)`,
          // Deep clone for arrays
          materials: sourceTech.materials.map(m => ({ ...m })),
          laborEntries: (sourceTech.laborEntries || []).map(l => ({ ...l })),
          fixedCostEntries: (sourceTech.fixedCostEntries || []).map(f => ({ ...f })),
          variants: sourceTech.variants.map(v => ({ ...v, id: crypto.randomUUID() }))
        };

        const sourceIndex = cat.technologies.findIndex(t => t.id === techId);
        const newTechnologies = [...cat.technologies];
        newTechnologies.splice(sourceIndex + 1, 0, duplicatedTech);

        return { ...cat, technologies: newTechnologies };
      })
    })),

  updateVariants: (categoryId, techId, variants) =>
    set((state) => ({
      isDirty: true,
      categories: state.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              technologies: cat.technologies.map((tech) =>
                tech.id === techId ? { ...tech, variants } : tech
              ),
            }
          : cat
      ),
    })),

  setProjectName: (name) => set({ currentProjectName: name }),

  syncWithDisk: async () => {
    const { globalSettings, categories, currentProjectName, isDirty } = get();
    if (!isDirty) return;

    const dataToSave = {
      version: '0.6.0',
      type: 'ARCADIA_PROJECT_BACKUP',
      globalSettings,
      categories
    };

    const success = await saveToDisk(dataToSave, currentProjectName);
    if (success) {
      set({ isDirty: false });
    }
  },
}));

// --- Mechanizm Auto-save (Debounce) ---
let saveTimeout: ReturnType<typeof setTimeout>;

useAppStore.subscribe((state) => {
  if (state.isDirty) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      if (isElectron()) {
        await useAppStore.getState().syncWithDisk();
      } else {
        // Zapis do LocalStorage jako fallback dla przeglądarki
        const dataToSave = {
          globalSettings: state.globalSettings,
          categories: state.categories
        };
        localStorage.setItem('termocad_backup', JSON.stringify(dataToSave));
        useAppStore.setState({ isDirty: false });
        console.log('[Storage] Auto-zapis do LocalStorage');
      }
    }, 2000);
  }
});
