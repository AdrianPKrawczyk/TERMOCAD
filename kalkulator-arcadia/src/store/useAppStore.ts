import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Interfejsy ---

export type CategoryType = 'PARTITIONS' | 'JOINERY' | 'INSTALLATIONS';

export interface GlobalSettings {
  hourlyRate: number; // np. 45 zł/h
  baseMaterials: Record<string, number>; // np. { "EPS_036": 245, "Klej": 42.5 }
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

export interface Technology {
  id: string;
  name: string;
  calculationType: 'AUTO' | 'MANUAL';
  notes: string;
  
  // Konfiguracja dla Przegród (PARTITIONS)
  materials: TechnologyMaterial[];
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
  
  // Akcje - Nawigacja
  setSelection: (categoryId: string | null, technologyId: string | null) => void;

  // Akcje - Ustawienia Globalne
  updateGlobalSettings: (settings: GlobalSettings) => void;
  addBaseMaterial: (name: string, price: number) => void;
  
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
  updateVariants: (categoryId: string, techId: string, variants: Variant[]) => void;
  
  // Akcje - Import Projektu/Zmiennych
  loadProjectSnapshot: (snapshot: { globalSettings: GlobalSettings; categories: Category[] }) => void;
  mergeBaseMaterials: (materialsMap: Record<string, number>) => void;
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
};

// --- Store ---

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      globalSettings: defaultGlobalSettings,
      categories: [],
      selectedCategoryId: null,
      selectedTechnologyId: null,

      setSelection: (categoryId, technologyId) =>
        set({ selectedCategoryId: categoryId, selectedTechnologyId: technologyId }),

      loadProjectSnapshot: (snapshot) =>
        set({
          globalSettings: snapshot.globalSettings,
          categories: snapshot.categories,
          selectedCategoryId: null,
          selectedTechnologyId: null,
        }),

      updateGlobalSettings: (settings) => 
        set({ globalSettings: settings }),

      addBaseMaterial: (name, price) =>
        set((state) => ({
          globalSettings: {
            ...state.globalSettings,
            baseMaterials: {
              ...state.globalSettings.baseMaterials,
              [name]: price,
            },
          },
        })),

      mergeBaseMaterials: (materialsMap) =>
        set((state) => ({
          globalSettings: {
            ...state.globalSettings,
            baseMaterials: {
              ...state.globalSettings.baseMaterials,
              ...materialsMap,
            },
          },
        })),

      addCategory: (name, type) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { id: crypto.randomUUID(), name, type, technologies: [] },
          ],
        })),

      renameCategory: (id, newName) =>
        set((state) => ({
          categories: state.categories.map(c => c.id === id ? { ...c, name: newName } : c)
        })),

      reorderCategory: (index, direction) =>
        set((state) => {
          const newCategories = [...state.categories];
          const targetIndex = index + direction;
          if (targetIndex < 0 || targetIndex >= newCategories.length) return state;
          [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];
          return { categories: newCategories };
        }),

      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          selectedCategoryId: state.selectedCategoryId === id ? null : state.selectedCategoryId,
          selectedTechnologyId: state.selectedCategoryId === id ? null : state.selectedTechnologyId,
        })),

      addTechnology: (categoryId, name) =>
        set((state) => ({
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
                      variants: [],
                    },
                  ],
                }
              : cat
          ),
        })),

      renameTechnology: (categoryId, id, newName) =>
        set((state) => ({
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
          categories: state.categories.map((cat) =>
            cat.id === categoryId
              ? { ...cat, technologies: cat.technologies.map(t => t.id === techId ? { ...t, notes } : t) }
              : cat
          )
        })),

      removeTechnology: (categoryId, techId) =>
        set((state) => ({
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

      updateVariants: (categoryId, techId, variants) =>
        set((state) => ({
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
    }),
    {
      name: 'kalkulator-arcadia-storage-v4', // Zmiana klucza wymusza reset stanu dla v0.4.0
    }
  )
);
