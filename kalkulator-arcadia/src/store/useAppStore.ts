import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Interfejsy ---

export interface GlobalSettings {
  hourlyRate: number; // np. 45 zł/h
  baseMaterials: Record<string, number>; // np. { "EPS_036": 245, "Klej": 42.5 }
}

export interface Variant {
  id: string;
  thickness?: number; // np. 15 (cm)
  name: string; // np. "Fasada 0,036 - 15cm"
  unit: string; // np. "zł/m2"
  totalCost: number; // Wyliczona cena
}

export interface Technology {
  id: string;
  name: string;
  calculationType: 'AUTO' | 'MANUAL';
  thicknessStart?: number;
  thicknessEnd?: number;
  thicknessStep?: number;
  formulaConfig?: {
    materialBaseId: string; // Referencja do klucza w baseMaterials
    fixedCost: number; // np. tynk, siatka
    laborCostPattern: 'fixed' | 'linear';
  };
  variants: Variant[];
}

export interface Category {
  id: string;
  name: string;
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
  
  // Akcje - Kategorie
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  
  // Akcje - Technologie
  addTechnology: (categoryId: string, name: string) => void;
  updateTechnology: (categoryId: string, techId: string, updates: Partial<Technology>) => void;
  removeTechnology: (categoryId: string, techId: string) => void;
  updateVariants: (categoryId: string, techId: string, variants: Variant[]) => void;
}

// --- Initial State ---

const defaultGlobalSettings: GlobalSettings = {
  hourlyRate: 50,
  baseMaterials: {
    'Styropian EPS 80 (m3)': 240,
    'Klej do styropianu (kg)': 1.8,
    'Siatka zbrojąca (m2)': 4.5,
    'Tynk silikonowy (kg)': 12.0,
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

      updateGlobalSettings: (settings) => 
        set({ globalSettings: settings }),

      addCategory: (name) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { id: crypto.randomUUID(), name, technologies: [] },
          ],
        })),

      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
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
                      calculationType: 'MANUAL',
                      variants: [],
                    },
                  ],
                }
              : cat
          ),
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
          // Jeśli usuwana technologia była zaznaczona, czyścimy wybór
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
      name: 'kalkulator-arcadia-storage', // klucz w localStorage
    }
  )
);
