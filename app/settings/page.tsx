"use client";

import Link from "next/link";
import { useState } from "react";
import "@/styles/settings.css";

type CheckerSettings = {
  playerName: string;
  myPieceColor: string;
  opponentPieceColor: string;
  backgroundColor: string;
  showHints: boolean;
  soundEffects: boolean;
  animations: boolean;
  onlineMatchmaking: boolean;
};

const defaultSettings: CheckerSettings = {
  playerName: "",
  myPieceColor: "#f7e7ce",
  opponentPieceColor: "#4a2e1b",
  backgroundColor: "#4c2424",
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
    <main
      className="title min-h-screen px-6 py-10 "
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-black">Settings</h1>

          <Link
            href="/"
            className="button"
          >
            Back
          </Link>
        </header>

        <section className="card rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-black">Player Preferences</h2>
          <div className="mt-8 space-y-7">
            <div className="space-y-2">
              <label className="label">
                Player Name
              </label>
              <input
                value={settings.playerName}
                onChange={(event) =>
                  updateSetting("playerName", event.target.value)
                }
                placeholder="Enter your name"
                className="input"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <ColorPicker
                title="Your Piece Color"
                description="This color represents your checkers."
                value={settings.myPieceColor}
                onChange={(value) => updateSetting("myPieceColor", value)}
              />

              <ColorPicker
                title="Second Piece Color"
                description="Used for local games, AI, or the opponent fallback."
                value={settings.opponentPieceColor}
                onChange={(value) => updateSetting("opponentPieceColor", value)}
              />

              <ColorPicker
                title="Background Color"
                description="Only changes your own screen background."
                value={settings.backgroundColor}
                onChange={(value) => updateSetting("backgroundColor", value)}
              />
            </div>

           
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={saveSettings}
            className="button w-1/2"
          >
            Save Settings
          </button>

          <button
            type="button"
            onClick={resetSettings}
            className="button w-1/2"
          >
            Reset
          </button>
        </div>

        {saved && (
          <p className="mt-4 text-center text-sm font-bold text-green-600">
            Settings saved successfully.
          </p>
        )}
      </div>
    </main>
  );
}

function ColorPicker({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#dcc5ad] bg-slate-100 p-4">
      <label className="text-xs font-black uppercase tracking-widest text-[#855f42]">
        {title}
      </label>

      <p className="mt-2 min-h-10 text-xs text-[#6f5848]">{description}</p>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-14 cursor-pointer rounded-xl border border-[#dcc5ad] bg-white p-1"
        />

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-[#dcc5ad] bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[#855f42]"
        />
      </div>
    </div>
  );
}

function ToggleButton({
  title,
  description,
  checked,
  onClick,
}: {
  title: string;
  description: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-[#dcc5ad] bg-[#fffaf5] p-4 text-left transition hover:bg-[#edd9c2]"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black">{title}</p>
          <p className="mt-1 text-xs text-[#6f5848]">{description}</p>
        </div>

        <p className="text-sm font-black">{checked ? "On" : "Off"}</p>
      </div>
    </button>
  );
}
