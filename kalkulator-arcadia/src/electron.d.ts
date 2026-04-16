export interface ElectronBridge {
  saveProject: (data: any, fileName: string) => Promise<{ success: boolean; path: string; error?: string }>;
  loadProject: () => Promise<{ data: any; fileName: string; path: string } | null>;
  listProjects: () => Promise<string[]>;
  getAppConfig: () => Promise<{ defaultPath: string }>;
  selectDirectory: () => Promise<string | null>;
}

declare global {
  interface Window {
    electron?: ElectronBridge;
  }
}
