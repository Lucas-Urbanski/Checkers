"use client";
import Link from "next/link";
import "@/styles/style.css"

const MENU_ITEMS = [
  { label: "Play Online", href: "/game" },
  { label: "Play Local", href: "/game" },
  { label: "Play Friends", href: "/game" },
  { label: "Play Bots", href: "/game" },
  { label: "Settings", href: "/settings" },
];

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col gap-6">
        <h1 className="text-6xl text-[#edd9c2] text-center font-bold mb-5">Checkers</h1>

        {MENU_ITEMS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="button flex justify-center"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}