"use client";
import Link from "next/link";

const MENU_ITEMS = [
  { label: "Play Online", href: "/game" },
  { label: "Play Local", href: "/game" },
  { label: "Play Friends", href: "/game" },
  { label: "Play Bots", href: "/game" },
  { label: "Settings", href: "/settings" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#4c2424] gap-8">
      <div className="flex flex-col m-12">
        <h1 className="text-6xl text-[#edd9c2] text-center font-bold mb-20">Checkers</h1>

        {MENU_ITEMS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex h-14 mt-5 first:mt-0 items-center justify-center text-2xl rounded-xl bg-[#372828] px-4 font-bold text-[#edd8c2] transition hover:bg-[#6e4b32]"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}