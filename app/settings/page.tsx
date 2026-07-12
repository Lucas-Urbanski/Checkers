"use client";

import Link from "next/link";
import { useState } from "react";
import Board, {
  type BoardState,
  type BoardTheme,
} from "@/app/components/board";
import "@/styles/settings.css";

type CheckerSettings = {
  playerName: string;
  myPieceColor: string;
  opponentPieceColor: string;
  lightTileColor: string;
  darkTileColor: string;
  backgroundColor: string;
};

const PAGE_BACKGROUND = "#4c2424";
const MIN_COLOR_DISTANCE = 95;

const defaultSettings: CheckerSettings = {
  playerName: "",
  myPieceColor: "#f7e7ce",
  opponentPieceColor: "#4a2e1b",
  lightTileColor: "#f0d9b5",
  darkTileColor: "#b58863",
  backgroundColor: PAGE_BACKGROUND,
};

const PREVIEW_BOARD: BoardState = [
  [null, "dark", null, "dark", null, "dark", null, "dark"],
  ["dark", null, "dark", null, "dark", null, "dark", null],
  [null, "dark", null, "dark", null, "dark", null, "dark"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["light", null, "light", null, "light", null, "light", null],
  [null, "light", null, "light", null, "light", null, "light"],
  ["light", null, "light", null, "light", null, "light", null],
];

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

function isHexColor(color: string) {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

function hexToRgb(color: string) {
  if (!isHexColor(color)) return null;

  return {
    red: parseInt(color.slice(1, 3), 16),
    green: parseInt(color.slice(3, 5), 16),
    blue: parseInt(color.slice(5, 7), 16),
  };
}

function getColorDistance(firstColor: string, secondColor: string) {
  const first = hexToRgb(firstColor);
  const second = hexToRgb(secondColor);

  if (!first || !second) return 0;

  return Math.sqrt(
    (first.red - second.red) ** 2 +
      (first.green - second.green) ** 2 +
      (first.blue - second.blue) ** 2,
  );
}

export default function Settings() {
  const [settings, setSettings] = useState<CheckerSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  const hasInvalidColor =
    !isHexColor(settings.myPieceColor) ||
    !isHexColor(settings.opponentPieceColor) ||
    !isHexColor(settings.lightTileColor) ||
    !isHexColor(settings.darkTileColor);

  const pieceColorsAreTooSimilar =
    getColorDistance(settings.myPieceColor, settings.opponentPieceColor) <
    MIN_COLOR_DISTANCE;

  const tileColorsAreTooSimilar =
    getColorDistance(settings.lightTileColor, settings.darkTileColor) <
    MIN_COLOR_DISTANCE;

  const hasColorError =
    hasInvalidColor || pieceColorsAreTooSimilar || tileColorsAreTooSimilar;

  const boardTheme: BoardTheme = {
    myPieceColor: settings.myPieceColor,
    opponentPieceColor: settings.opponentPieceColor,
    lightTileColor: settings.lightTileColor,
    darkTileColor: settings.darkTileColor,
  };

  function updateSetting<K extends keyof CheckerSettings>(
    key: K,
    value: CheckerSettings[K],
  ) {
    setSaved(false);
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function saveSettings() {
    if (hasColorError) {
      setSaved(false);
      return;
    }

    localStorage.setItem("checkerSettings", JSON.stringify(settings));
    setSaved(true);
  }

  function resetSettings() {
    const resetSettingsValues: CheckerSettings = {
      ...defaultSettings,
      playerName: settings.playerName,
    };

    setSettings(resetSettingsValues);
    localStorage.setItem("checkerSettings", JSON.stringify(resetSettingsValues));
    setSaved(true);
  }

  return (
    <main
      className="title min-h-screen px-6 py-10"
      style={{ backgroundColor: settings.backgroundColor || PAGE_BACKGROUND }}
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-black">Settings</h1>

          <Link href="/" className="button">
            Back
          </Link>
        </header>

        <section className="card rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-black">Player Preferences</h2>

          <div className="mt-8 space-y-7">
            <div className="space-y-2">
              <label className="label">Player Name</label>
              <input
                value={settings.playerName}
                onChange={(event) =>
                  updateSetting("playerName", event.target.value)
                }
                placeholder="Enter your name"
                className="input"
              />
            </div>

            <section className="rounded-3xl border border-[#dcc5ad] bg-slate-100 p-5 text-[#2b1f18]">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#855f42]">
                    Board Colors
                  </h3>

                  <div className="mt-5 space-y-4">
                    <ColorPicker
                      title="Your Pieces"
                      value={settings.myPieceColor}
                      fallbackValue={defaultSettings.myPieceColor}
                      onChange={(value) => updateSetting("myPieceColor", value)}
                    />

                    <ColorPicker
                      title="Opponent Pieces"
                      value={settings.opponentPieceColor}
                      fallbackValue={defaultSettings.opponentPieceColor}
                      onChange={(value) =>
                        updateSetting("opponentPieceColor", value)
                      }
                    />

                    <ColorPicker
                      title="Tile Color 1"
                      value={settings.lightTileColor}
                      fallbackValue={defaultSettings.lightTileColor}
                      onChange={(value) => updateSetting("lightTileColor", value)}
                    />

                    <ColorPicker
                      title="Tile Color 2"
                      value={settings.darkTileColor}
                      fallbackValue={defaultSettings.darkTileColor}
                      onChange={(value) => updateSetting("darkTileColor", value)}
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Board
                    board={PREVIEW_BOARD}
                    selected={null}
                    validMoves={[]}
                    onSquareClick={() => undefined}
                    theme={boardTheme}
                    sizeClassName="h-[320px] w-[320px] sm:h-[420px] sm:w-[420px]"
                  />
                </div>
              </div>
            </section>

            {hasColorError && (
              <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-bold text-red-800">
                {hasInvalidColor}
                {pieceColorsAreTooSimilar && (
                  <p>Your two piece colors are too similar.</p>
                )}
                {tileColorsAreTooSimilar && (
                  <p>Your two tile colors are too similar.</p>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={saveSettings}
            disabled={hasColorError}
            className={`button w-1/2 ${
              hasColorError ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            Save Settings
          </button>

          <button type="button" onClick={resetSettings} className="button w-1/2">
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
  value,
  fallbackValue,
  onChange,
}: {
  title: string;
  value: string;
  fallbackValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
      <label className="text-xs font-black uppercase tracking-widest text-[#855f42]">
        {title}
      </label>

      <div className="flex items-center gap-3">
        <input
          type="color"
          value={isHexColor(value) ? value : fallbackValue}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-12 cursor-pointer rounded-xl border border-[#dcc5ad] bg-white p-1"
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