"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type CheckerSettings, DEFAULT_SETTINGS } from "@/types/settings";

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
  const [settings, setSettings] = useState<CheckerSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("checkerSettings");
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      }
    } catch {}
  }, []);

  useEffect(() => {
    const isCyberpunk = settings.theme === "cyberpunk";
    const defaultBg = settings.backgroundColor || "#4c2424";

    document.body.style.backgroundColor = isCyberpunk ? "#001f2d" : defaultBg;
    
    document.body.style.transition = "background-color 0.5s ease";
  }, [settings.theme, settings.backgroundColor]);

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
    const resetSettingsValues: CheckerSettings = {
      ...DEFAULT_SETTINGS,
      playerName: settings.playerName,
    };

    setSettings(resetSettingsValues);
    localStorage.setItem(
      "checkerSettings",
      JSON.stringify(resetSettingsValues),
    );
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

  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return ctx;
}