"use client";

import Link from "next/link";
import { useState } from "react";
import Board, { type BoardTheme } from "@/components/board";
import { DEFAULT_BOARD } from "@/components/game";
import { DEFAULT_SETTINGS, type CheckerSettings } from "@/types/settings";
import { useSettings } from "@/themes/context";
import "@/styles/style.css";

const MIN_COLOR_DISTANCE = 95;

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
  const {
    settings,
    updateSetting,
    saveSettings: saveStoredSettings,
    resetSettings: resetStoredSettings,
  } = useSettings();

  const [saved, setSaved] = useState(false);

  const isCyberpunk = settings.theme === "cyberpunk";

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
    !isCyberpunk &&
    (hasInvalidColor || pieceColorsAreTooSimilar || tileColorsAreTooSimilar);

  const boardTheme: BoardTheme = {
    myPieceColor: settings.myPieceColor,
    opponentPieceColor: settings.opponentPieceColor,
    lightTileColor: settings.lightTileColor,
    darkTileColor: settings.darkTileColor,
  };

  function handleUpdateSetting<K extends keyof CheckerSettings>(
    key: K,
    value: CheckerSettings[K],
  ) {
    setSaved(false);
    updateSetting(key, value);
  }

  function handleSaveSettings() {
    if (hasColorError) {
      setSaved(false);
      return;
    }

    saveStoredSettings();
    setSaved(true);
  }

  function handleResetSettings() {
    resetStoredSettings();
    setSaved(true);
  }

  return (
    <main className="title min-h-screen px-6 py-10 transition-colors duration-500">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <h1
            className={`text-4xl font-black ${isCyberpunk ? "text-[#00f2fe]" : "title"}`}
          >
            Settings
          </h1>

          <Link href="/" className="button">
            Back
          </Link>
        </header>

        <section className="card rounded-3xl p-8 shadow-sm bg-white">
          <h2 className="title">Player Preferences</h2>

          <div className="mt-8 space-y-7">
            <div className="space-y-2">
              <label className="label">Player Name</label>
              <input
                value={settings.playerName}
                onChange={(event) =>
                  handleUpdateSetting("playerName", event.target.value)
                }
                placeholder="Enter your name"
                className="input w-full rounded-xl border border-gray-300 p-3"
              />
            </div>

            <div className="space-y-3">
              <label className="label">Themes</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleUpdateSetting("theme", "default")}
                  className={`flex-1 rounded-xl border-2 p-4 font-bold transition-all ${
                    !isCyberpunk
                      ? "border-[#855f42] bg-[#fdfaf7] text-[#855f42]"
                      : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                  }`}
                >
                  Classic Wood
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateSetting("theme", "cyberpunk")}
                  className={`flex-1 rounded-xl border-2 p-4 font-bold transition-all ${
                    isCyberpunk
                      ? "border-[#00f2fe] bg-[#001f2d] text-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                      : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                  }`}
                >
                  Cyberpunk
                </button>
              </div>
            </div>

            <section
              className={`rounded-3xl border border-[#dcc5ad]  ${isCyberpunk ? "bg-[#001f2d]" : "bg-slate-100"} p-5 text-[#2b1f18]`}
            >
              <div
                className={
                  !isCyberpunk
                    ? "grid lg:grid-cols-[0.8fr_1.2fr] lg:items-center"
                    : ""
                }
              >
                <div>
                  {!isCyberpunk && (
                    <div className="mb-4 space-y-4">
                      {" "}
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#855f42]">
                        Board Colors
                      </h3>
                      <>
                        <ColorPicker
                          title="Your Pieces"
                          value={settings.myPieceColor}
                          fallbackValue={DEFAULT_SETTINGS.myPieceColor}
                          onChange={(value) =>
                            handleUpdateSetting("myPieceColor", value)
                          }
                        />

                        <ColorPicker
                          title="Opponent Pieces"
                          value={settings.opponentPieceColor}
                          fallbackValue={DEFAULT_SETTINGS.opponentPieceColor}
                          onChange={(value) =>
                            handleUpdateSetting("opponentPieceColor", value)
                          }
                        />

                        <ColorPicker
                          title="Tile Color 1"
                          value={settings.lightTileColor}
                          fallbackValue={DEFAULT_SETTINGS.lightTileColor}
                          onChange={(value) =>
                            handleUpdateSetting("lightTileColor", value)
                          }
                        />

                        <ColorPicker
                          title="Tile Color 2"
                          value={settings.darkTileColor}
                          fallbackValue={DEFAULT_SETTINGS.darkTileColor}
                          onChange={(value) =>
                            handleUpdateSetting("darkTileColor", value)
                          }
                        />
                      </>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <Board
                    board={DEFAULT_BOARD}
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
                {hasInvalidColor && <p>Use valid hex colors, like #f0d9b5.</p>}
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

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={hasColorError}
            className={`button w-1/2 ${
              hasColorError ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            Save Settings
          </button>

          <button
            type="button"
            onClick={handleResetSettings}
            className="button w-1/2"
          >
            Reset
          </button>
        </div>

        {saved && (
          <p className="mt-4 text-center text-sm font-bold text-green-400">
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
          className="input w-full rounded-xl border border-gray-300 p-2 text-gray-700"
        />
      </div>
    </div>
  );
}