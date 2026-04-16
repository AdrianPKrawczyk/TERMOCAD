/**
 * storageService.ts
 * Serwis odpowiedzialny za abstrakcję zapisu danych (Electron vs Browser).
 */

const EXTENSION = '.termocad';

export const isElectron = (): boolean => {
  return !!window.electron;
};

/**
 * Zapisuje projekt na dysku (Electron) lub loguje ostrzeżenie w przeglądarce.
 */
export const saveToDisk = async (data: any, fileName: string): Promise<boolean> => {
  if (isElectron()) {
    try {
      // Electron automatycznie obsłuży backup w procesie głównym lub możemy to zasymulować tutaj
      // jeśli bridge na to pozwala. Dla uproszczenia zakładamy, że bridge.saveProject
      // wykonuje bezpieczny zapis.
      
      const fullFileName = fileName.endsWith(EXTENSION) ? fileName : `${fileName}${EXTENSION}`;
      const result = await window.electron!.saveProject(data, fullFileName);
      
      if (result.success) {
        console.log(`[Storage] Projekt zapisany pomyślnie: ${result.path}`);
        return true;
      } else {
        console.error(`[Storage] Błąd zapisu: ${result.error}`);
        return false;
      }
    } catch (error) {
      console.error('[Storage] Wyjątek podczas zapisu:', error);
      return false;
    }
  } else {
    console.warn('[Storage] Zapytano o zapis na dysk w środowisku przeglądarki. Użyj exportu manualnego.');
    return false;
  }
};

/**
 * Wczytuje projekt z dysku (Electron).
 */
export const loadFromDisk = async (): Promise<any | null> => {
  if (isElectron()) {
    try {
      const result = await window.electron!.loadProject();
      if (result) {
        console.log(`[Storage] Projekt wczytany: ${result.fileName}`);
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('[Storage] Błąd podczas wczytywania:', error);
      return null;
    }
  } else {
    console.warn('[Storage] Próba odczytu z dysku w przeglądarce.');
    return null;
  }
};

/**
 * Pobiera listę projektów (opcjonalnie dla Hubu).
 */
export const getProjectsList = async (): Promise<string[]> => {
  if (isElectron()) {
    return await window.electron!.listProjects();
  }
  return [];
};
