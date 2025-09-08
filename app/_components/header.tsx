"use client";

import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { MenuIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-secondary dark:bg-secondary/20">
      <nav aria-label="Primary" className="w-full">
        <ul className="flex h-14 items-center justify-between px-4">
          <li>
            <section className="flex items-center gap-3">
              <MenuIcon aria-label="Open menu" />
              <Link href="/" aria-label="Go to homepage" className="text-base font-semibold tracking-tight">
                Acme
              </Link>
            </section>
          </li>
          <li>
            <section className="flex items-center">
              <ThemeSwitcher />
            </section>
          </li>
        </ul>
      </nav>
    </header>
  );
}


