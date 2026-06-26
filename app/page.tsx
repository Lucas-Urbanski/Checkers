"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8">
      <h1 className="text-3xl font-bold m-4">Checkers</h1>
      <Link
        href="/settings"
        className="flex h-10 items-center justify-center rounded-xl bg-white px-4 font-bold text-zinc-800 transition hover:bg-zinc-200"
      >
        Start Game
      </Link>
    </div>
  );
}