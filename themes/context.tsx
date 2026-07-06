"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { CheckerSettings, DEFAULT_SETTINGS } from "@/types/settings";

type SettingsContextValue = {
  settings: CheckerSettings;
  updateSetting: <K extends keyof CheckerSettings>(
    key: K,
    value: CheckerSettings[K],
  ) => void;
  saveSettings: () => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CheckerSettings>(() => {
    try {
      const saved = localStorage.getItem("checkerSettings");
      return saved
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    document.body.style.backgroundColor = settings.backgroundColor;
  }, [settings.backgroundColor]);

  function updateSetting<K extends keyof CheckerSettings>(
    key: K,
    value: CheckerSettings[K],
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function saveSettings() {
    localStorage.setItem("checkerSettings", JSON.stringify(settings));
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem("checkerSettings", JSON.stringify(DEFAULT_SETTINGS));
  }

  return (
    <SettingsContext.Provider
      value={{ settings, updateSetting, saveSettings, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
