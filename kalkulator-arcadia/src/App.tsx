import { useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import { useAppStore } from './store/useAppStore';
import { loadFromDisk, isElectron } from './services/storageService';

function App() {
  const loadProjectSnapshot = useAppStore((state) => state.loadProjectSnapshot);

  useEffect(() => {
    // Funkcja inicjalizująca dane
    const initData = async () => {
      if (isElectron()) {
        const data = await loadFromDisk();
        if (data && data.categories) {
          loadProjectSnapshot(data);
          console.log('[App] Dane wczytane z Electrona');
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