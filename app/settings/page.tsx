"use client";

import Link from "next/link";
import { useState } from "react";

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
  backgroundColor: "#f5efe6",
  showHints: true,
  soundEffects: true,
  animations: true,
  onlineMatchmaking: true,
};

function loadSettings(): CheckerSettings {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  try {
    const savedSettings = localStorage.getItem("checkerSettings");

    if (!savedSettings) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...JSON.parse(savedSettings),
    };
  } catch {
    return defaultSettings;
  }
}

export default function Settings() {
  const [settings, setSettings] = useState<CheckerSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  function updateSetting<K extends keyof CheckerSettings>(
    key: K,
    value: CheckerSettings[K],
  ) {
    setSaved(false);

    setSettings((previousSettings) => ({
      ...previousSettings,
      [key]: value,
    }));
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
      className="min-h-screen px-6 py-10 text-[#2b1f18]"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">Settings</h1>
            <p className="mt-2 text-sm font-medium text-[#6f5848]">
              Customize your player colors and game preferences.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-[#855f42] px-5 py-3 text-sm font-bold text-[#edd9c2] transition hover:bg-[#6f4d34]"
          >
            Back
          </Link>
        </header>

        <section className="rounded-3xl border border-[#dcc5ad] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black">Player Preferences</h2>
          <p className="mt-1 text-sm text-[#6f5848]">
            Piece colors can be shown to other players later. Background color
            is only for your own screen.
          </p>

          <div className="mt-8 space-y-7">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[#855f42]">
                Player Name
              </label>
              <input
                value={settings.playerName}
                onChange={(event) =>
                  updateSetting("playerName", event.target.value)
                }
                placeholder="Enter your name"
                className="w-full rounded-2xl border border-[#dcc5ad] bg-[#fffaf5] px-5 py-4 text-sm font-medium outline-none transition focus:border-[#855f42] focus:bg-white"
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

            <div className="grid gap-4 sm:grid-cols-2">
              <ToggleButton
                title="Show Move Hints"
                description="Highlight possible moves."
                checked={settings.showHints}
                onClick={() => updateSetting("showHints", !settings.showHints)}
              />

              <ToggleButton
                title="Sound Effects"
                description="Play sounds during moves."
                checked={settings.soundEffects}
                onClick={() =>
                  updateSetting("soundEffects", !settings.soundEffects)
                }
              />

              <ToggleButton
                title="Animations"
                description="Use smooth checker movement."
                checked={settings.animations}
                onClick={() =>
                  updateSetting("animations", !settings.animations)
                }
              />

              <ToggleButton
                title="Online Matchmaking"
                description="Allow random online matches later."
                checked={settings.onlineMatchmaking}
                onClick={() =>
                  updateSetting(
                    "onlineMatchmaking",
                    !settings.onlineMatchmaking,
                  )
                }
              />
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={saveSettings}
            className="flex-1 rounded-2xl bg-[#855f42] px-6 py-4 font-black text-[#edd9c2] shadow-lg shadow-[#855f42]/20 transition hover:bg-[#6f4d34]"
          >
            Save Settings
          </button>

          <button
            type="button"
            onClick={resetSettings}
            className="rounded-2xl border border-[#dcc5ad] bg-white px-6 py-4 font-black text-[#855f42] transition hover:bg-[#edd9c2]"
          >
            Reset
          </button>
        </div>

        {saved && (
          <p className="mt-4 text-center text-sm font-bold text-green-700">
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
    <div className="rounded-2xl border border-[#dcc5ad] bg-[#fffaf5] p-4">
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