import type { Category, GlobalSettings } from '../store/useAppStore';

const triggerDownload = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Zapisuje aktualny projekt jako plik JSON
 */
export const downloadProjectJSON = (globalSettings: GlobalSettings, categories: Category[]) => {
  const date = new Date().toISOString().split('T')[0];
  const data = {
    version: '0.5.0',
    type: 'ARCADIA_PROJECT_BACKUP',
    globalSettings,
    categories
  };
  triggerDownload(data, `Projekt_Arcadia_${date}.json`);
};

/**
 * Zapisuje tylko bazę materiałową jako plik JSON
 */
export const downloadMaterialsJSON = (baseMaterials: Record<string, number>) => {
  const date = new Date().toISOString().split('T')[0];
  const data = {
    version: '0.5.0',
    type: 'ARCADIA_MATERIALS_BACKUP',
    baseMaterials
  };
  triggerDownload(data, `Baza_Materialow_Arcadia_${date}.json`);
};
