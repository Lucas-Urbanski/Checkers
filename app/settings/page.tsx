"use client";

import Link from "next/link";
import { useState } from "react";
import "@/styles/settings.css";

type CheckerSettings = {
  playerName: string;
  playerSide: string;
  showHints: boolean;
  soundEffects: boolean;
  animations: boolean;
  onlineMatchmaking: boolean;
};

const defaultSettings: CheckerSettings = {
  playerName: "",
  playerSide: "Random",
  showHints: true,
  soundEffects: true,
  animations: true,
  onlineMatchmaking: true,
};

function loadSettings(): CheckerSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const saved = localStorage.getItem("checkerSettings");
    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

const TOGGLES: {
  key: keyof Pick<
    CheckerSettings,
    "showHints" | "soundEffects" | "animations" | "onlineMatchmaking"
  >;
  label: string;
  desc: string;
}[] = [
  {
    key: "showHints",
    label: "Show Move Hints",
    desc: "Highlight possible moves.",
  },
  {
    key: "soundEffects",
    label: "Sound Effects",
    desc: "Play sounds during moves.",
  },
  {
    key: "animations",
    label: "Animations",
    desc: "Use smooth checker movement.",
  },
  {
    key: "onlineMatchmaking",
    label: "Online Matchmaking",
    desc: "Allow random online matches later.",
  },
];

export default function Settings() {
  const [settings, setSettings] = useState<CheckerSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  function updateSetting<K extends keyof CheckerSettings>(
    key: K,
    value: CheckerSettings[K],
  ) {
    setSaved(false);
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function saveSettings() {
    localStorage.setItem("checkerSettings", JSON.stringify(settings));
    setSaved(true);
  }

  function resetSettings() {
    setSettings(defaultSettings);
    localStorage.setItem("checkerSettings", JSON.stringify(defaultSettings));
    setSaved(true);
  }

  return (
    <main className="m-4 sm:m-6 md:m-8 lg:m-10">
      <header className="flex justify-between">
        <div className="mb-4">
          <h1 className="title">Settings</h1>
        </div>
        <Link href="/" className="button">
          Back
        </Link>
      </header>

      <section className="card flex flex-col gap-6">
        <h2 className="cardTitle">Game Preferences</h2>
        <div className="fieldGroup">
          <label className="label">Player Name</label>
          <input
            value={settings.playerName}
            onChange={(e) => updateSetting("playerName", e.target.value)}
            placeholder="Enter your name"
            className="input"
          />
        </div>

        <div className="fieldGroup">
          <label className="label">Player Side</label>
          <div className="sideGrid">
            {["Random", "Light", "Dark"].map((side) => (
              <button
                key={side}
                type="button"
                onClick={() => updateSetting("playerSide", side)}
                className={
                  settings.playerSide === side
                    ? "rounded-2xl border border-[#855f42] bg-[#855f42] px-4 py-3 mr-2 text-sm font-bold text-[#edd9c2]"
                    : "rounded-2xl border border-[#dcc5ad] bg-[#fffaf5] px-4 py-3 mr-2 text-sm font-bold text-[#2b1f18] transition hover:bg-[#edd9c2]"
                }
              >
                {side}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {TOGGLES.map(({ key, label, desc }) => (
            <button
              key={key}
              type="button"
              onClick={() => updateSetting(key, !settings[key])}
              className={`rounded-2xl border p-4 text-left transition ${
                settings[key]
                  ? "border-[#dcc5ad] hover:bg-[#edd9c2] hover:text-black"
                  : "border-[#855f42] bg-[#edd9c2] text-black"
              }`}
            >
              <div className="flex flex-col justify-between ">
                <div>
                  <p className="label">{label}</p>
                  <p className="cardSubtitle">{desc}</p>
                </div>
                <p className="label">{settings[key] ? "On" : "Off"}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="flex mt-6 gap-4">
        <button type="button" onClick={saveSettings} className="button">
          Save Settings
        </button>
        <button type="button" onClick={resetSettings} className="button">
          Reset
        </button>
      </div>

      {saved && (
        <p className="text-green-400 m-2 ">Settings saved successfully.</p>
      )}
    </main>
  );
}
