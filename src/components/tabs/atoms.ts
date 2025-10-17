import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import i18n from "@/i18n/config";

export type Editor = {
  name: string;
  filename: string;
  content: string;
};

export const editorsAtom = atom<Editor[]>([]);

export type Language = "en" | "de";

export type Settings = {
  showAdditionalTabs?: boolean;
  language?: Language;
  autoDownload?: boolean;
};

// Use atomWithStorage to persist settings in localStorage
export const settingsAtom = atomWithStorage<Settings>(
  "bankconverter-settings",
  {
    showAdditionalTabs: false,
    autoDownload: true,
    language: "de",
  },
);

// Derived atom to handle language changes
export const languageAtom = atom(
  (get) => get(settingsAtom).language || "en",
  (get, set, newLanguage: Language) => {
    const currentSettings = get(settingsAtom);
    set(settingsAtom, { ...currentSettings, language: newLanguage });
    // Update i18n language
    i18n.changeLanguage(newLanguage);
  },
);

// Initialize language from settings on app start
export const initializeLanguageAtom = atom(null, (get, _set) => {
  const settings = get(settingsAtom);
  const language = settings.language || "en";
  i18n.changeLanguage(language);
});

// Track which files have been auto-downloaded to prevent multiple downloads
export const autoDownloadedFilesAtom = atom<Set<string>>(new Set<string>());
