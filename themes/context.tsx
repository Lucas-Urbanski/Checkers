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

function loadSettings(): CheckerSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const saved = localStorage.getItem("checkerSettings");

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CheckerSettings>(loadSettings);

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
    const resetSettingsValues: CheckerSettings = {
      ...DEFAULT_SETTINGS,
      playerName: settings.playerName,
    };

    setSettings(resetSettingsValues);
    localStorage.setItem("checkerSettings", JSON.stringify(resetSettingsValues));
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