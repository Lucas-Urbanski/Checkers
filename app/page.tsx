"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full h-full gap-8">
      <div className="flex flex-col m-45">
        <h1 className="text-3xl text-center font-bold m-4 mb-20 text-6xl">Checkers</h1>
        <Link
        href="/game"
        className="flex h-10 text-center items-center justify-center text-2xl rounded-xl bg-white px-4 font-bold text-zinc-800 transition hover:bg-zinc-200"
        >
        Play Online
        </Link>
        <Link
        href="/game"
        className="flex h-10 text-center mt-5 items-center justify-center text-2xl rounded-xl bg-white px-4 font-bold text-zinc-800 transition hover:bg-zinc-200"
        >
        Make Private Game
        </Link>
        <Link
        href="/game"
        className="flex h-10 text-center mt-5 items-center justify-center text-2xl rounded-xl bg-white px-4 font-bold text-zinc-800 transition hover:bg-zinc-200"
        >
        Play Local
        </Link>
        <Link
        href="/game"
        className="flex h-10 text-center mt-5 items-center justify-center text-2xl rounded-xl bg-white px-4 font-bold text-zinc-800 transition hover:bg-zinc-200"
        >
        Play Against AI
        </Link>
      </div>
    </div>
  );
}