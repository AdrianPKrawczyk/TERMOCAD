import { useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import { useAppStore } from './store/useAppStore';
import { loadLastProjectFromDisk, isElectron } from './services/storageService';

function App() {
  const loadProjectSnapshot = useAppStore((state) => state.loadProjectSnapshot);

  useEffect(() => {
    // Funkcja inicjalizująca dane
    const initData = async () => {
      if (isElectron()) {
        // Próbujemy wczytać ostatni plik bez pytania użytkownika
        const result = await loadLastProjectFromDisk();
        if (result && result.data) {
          // Wyciągamy samą nazwę pliku ze ścieżki
          const fileName = result.filePath.split(/[\\/]/).pop();
          loadProjectSnapshot(result.data, fileName);
          console.log(`[App] Ostatni projekt wczytany automatycznie: ${fileName}`);
        }
      } else {
        // Fallback dla przeglądarki (np. z LocalStorage)
        const saved = localStorage.getItem('termocad_backup');
        if (saved) {
          loadProjectSnapshot(JSON.parse(saved));
          console.log('[App] Dane wczytane z LocalStorage');
        }
      }
    };

    initData();
  }, [loadProjectSnapshot]);

  return <AppLayout />;
}

export default App;