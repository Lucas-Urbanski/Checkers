"use client";

import { useSettings } from "@/themes/context";
import { useState } from "react";
import Link from "next/link";
import "@/styles/style.css";

export default function Settings() {
  const { settings, updateSetting, saveSettings, resetSettings } =
    useSettings();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    saveSettings();
    setSaved(true);
  }

  function handleReset() {
    resetSettings();
    setSaved(true);
  }

  return (
    <main className="title min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
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

            <div className="grid gap-5 sm:grid-cols-3">
              <ColorPicker
                title="Your Piece Color"
                value={settings.myPieceColor}
                onChange={(value) => updateSetting("myPieceColor", value)}
              />

              <ColorPicker
                title="Opponent Piece Color"
                value={settings.opponentPieceColor}
                onChange={(value) => updateSetting("opponentPieceColor", value)}
              />

              <ColorPicker
                title="Background Color"
                value={settings.backgroundColor}
                onChange={(value) => updateSetting("backgroundColor", value)}
              />
            </div>
          </div>
        </section>

        <div className=" flex items-center flex-col gap-3 mt-8 sm:flex-row">
          <button type="button" onClick={handleSave} className="button w-1/2">
            Save Settings
          </button>

          <button type="button" onClick={handleReset} className="button w-1/2">
            Reset
          </button>
        </div>

        {saved && (
          <p className="text-center text-sm font-bold text-green-600 mt-4">
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
  onChange,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className=" flex flex-col rounded-2xl border border-[#dcc5ad] gap-2 p-4">
      <label className="subtitle">{title}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-14 cursor-pointer"
        />

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input"
        />
      </div>
    </div>
  );
}
