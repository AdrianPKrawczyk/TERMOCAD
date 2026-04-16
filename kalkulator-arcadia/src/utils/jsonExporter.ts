import type { Category, GlobalSettings } from '../store/useAppStore';
import { isElectron, saveToDisk } from '../services/storageService';

/**
 * Przygotowuje czysty obiekt danych projektu
 */
export const prepareProjectData = (globalSettings: GlobalSettings, categories: Category[]) => {
  return {
    version: '0.6.0',
    type: 'ARCADIA_PROJECT_BACKUP',
    globalSettings,
    categories
  };
};

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
 * Zapisuje aktualny projekt (pobieranie lub Electron disk save)
 */
export const exportProjectJSON = async (globalSettings: GlobalSettings, categories: Category[], projectName: string) => {
  const data = prepareProjectData(globalSettings, categories);
  const date = new Date().toISOString().split('T')[0];
  const fileName = `${projectName}_${date}.termocad`;

  if (isElectron()) {
    await saveToDisk(data, fileName);
  } else {
    triggerDownload(data, fileName);
  }
};

/**
 * Zapisuje zmienne globalne (Materiały, Robocizna, Koszty stałe)
 */
export const exportGlobalsJSON = (globalSettings: GlobalSettings) => {
  const date = new Date().toISOString().split('T')[0];
  const data = {
    version: '0.6.0',
    type: 'ARCADIA_GLOBALS_BACKUP',
    globalSettings
  };
  triggerDownload(data, `Baza_Cennikowa_Arcadia_${date}.json`);
};
