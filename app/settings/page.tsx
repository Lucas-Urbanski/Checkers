"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const defaultSettings = {
  playerName: "",
  aiDifficulty: "Normal",
  playerSide: "Random",
  showHints: true,
  soundEffects: true,
  animations: true,
  onlineMatchmaking: true,
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("checkerSettings");

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  function updateSetting(key: string, value: string | boolean) {
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
    <main className="min-h-screen bg-[#f5efe6] px-6 py-10 text-[#2b1f18]">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">Settings</h1>
            <p className="mt-2 text-sm font-medium text-[#6f5848]">
              Customize your checkers experience.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-[#855f42] px-5 py-3 text-sm font-bold text-[#edd9c2] transition hover:bg-[#6f4d34]"
          >
            Back Home
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-3xl border border-[#dcc5ad] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black">Game Preferences</h2>
            <p className="mt-1 text-sm text-[#6f5848]">
              These settings will be used for local games, online matches, and
              AI matches.
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

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[#855f42]">
                  AI Difficulty
                </label>

                <div className="grid gap-3 sm:grid-cols-3">
                  {["Easy", "Normal", "Hard"].map((difficulty) => (
                    <button
                      key={difficulty}
                      type="button"
                      onClick={() => updateSetting("aiDifficulty", difficulty)}
                      className={
                        settings.aiDifficulty === difficulty
                          ? "rounded-2xl border border-[#855f42] bg-[#855f42] px-4 py-3 text-sm font-bold text-[#edd9c2]"
                          : "rounded-2xl border border-[#dcc5ad] bg-[#fffaf5] px-4 py-3 text-sm font-bold text-[#2b1f18] transition hover:bg-[#edd9c2]"
                      }
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[#855f42]">
                  Player Side
                </label>

                <div className="grid gap-3 sm:grid-cols-3">
                  {["Random", "Light", "Dark"].map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() => updateSetting("playerSide", side)}
                      className={
                        settings.playerSide === side
                          ? "rounded-2xl border border-[#855f42] bg-[#855f42] px-4 py-3 text-sm font-bold text-[#edd9c2]"
                          : "rounded-2xl border border-[#dcc5ad] bg-[#fffaf5] px-4 py-3 text-sm font-bold text-[#2b1f18] transition hover:bg-[#edd9c2]"
                      }
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => updateSetting("showHints", !settings.showHints)}
                  className="rounded-2xl border border-[#dcc5ad] bg-[#fffaf5] p-4 text-left transition hover:bg-[#edd9c2]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black">Show Move Hints</p>
                      <p className="mt-1 text-xs text-[#6f5848]">
                        Highlight possible moves.
                      </p>
                    </div>
                    <p className="text-sm font-black">
                      {settings.showHints ? "On" : "Off"}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateSetting("soundEffects", !settings.soundEffects)
                  }
                  className="rounded-2xl border border-[#dcc5ad] bg-[#fffaf5] p-4 text-left transition hover:bg-[#edd9c2]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black">Sound Effects</p>
                      <p className="mt-1 text-xs text-[#6f5848]">
                        Play sounds during moves.
                      </p>
                    </div>
                    <p className="text-sm font-black">
                      {settings.soundEffects ? "On" : "Off"}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateSetting("animations", !settings.animations)
                  }
                  className="rounded-2xl border border-[#dcc5ad] bg-[#fffaf5] p-4 text-left transition hover:bg-[#edd9c2]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black">Animations</p>
                      <p className="mt-1 text-xs text-[#6f5848]">
                        Use smooth checker movement.
                      </p>
                    </div>
                    <p className="text-sm font-black">
                      {settings.animations ? "On" : "Off"}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateSetting(
                      "onlineMatchmaking",
                      !settings.onlineMatchmaking,
                    )
                  }
                  className="rounded-2xl border border-[#dcc5ad] bg-[#fffaf5] p-4 text-left transition hover:bg-[#edd9c2]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black">Online Matchmaking</p>
                      <p className="mt-1 text-xs text-[#6f5848]">
                        Allow random online matches later.
                      </p>
                    </div>
                    <p className="text-sm font-black">
                      {settings.onlineMatchmaking ? "On" : "Off"}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-[#dcc5ad] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Board Preview</h2>
              <p className="mt-1 text-sm text-[#6f5848]">
                Using your selected checkerboard colors.
              </p>

              <div className="mt-6 grid aspect-square grid-cols-4 overflow-hidden rounded-2xl border-4 border-[#855f42]">
                {Array.from({ length: 16 }).map((_, index) => {
                  const row = Math.floor(index / 4);
                  const column = index % 4;
                  const darkSquare = (row + column) % 2 !== 0;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-center"
                      style={{
                        backgroundColor: darkSquare ? "#855f42" : "#edd9c2",
                      }}
                    >
                      {darkSquare && index % 3 === 0 && (
                        <div className="h-8 w-8 rounded-full border-2 border-[#2b1f18] bg-[#3a2a21]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-[#dcc5ad] bg-[#2b1f18] p-6 text-[#edd9c2] shadow-sm">
              <h2 className="text-xl font-black">Current Setup</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-[#edd9c2]/20 pb-2">
                  <span className="font-bold">Name</span>
                  <span>{settings.playerName || "Guest"}</span>
                </div>

                <div className="flex justify-between border-b border-[#edd9c2]/20 pb-2">
                  <span className="font-bold">AI</span>
                  <span>{settings.aiDifficulty}</span>
                </div>

                <div className="flex justify-between border-b border-[#edd9c2]/20 pb-2">
                  <span className="font-bold">Side</span>
                  <span>{settings.playerSide}</span>
                </div>

                <div className="flex justify-between border-b border-[#edd9c2]/20 pb-2">
                  <span className="font-bold">Hints</span>
                  <span>{settings.showHints ? "On" : "Off"}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>

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