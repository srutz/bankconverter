import { atom } from "jotai";

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
};

export const settingsAtom = atom<Settings>({
  showAdditionalTabs: false,
  language: "en",
});
