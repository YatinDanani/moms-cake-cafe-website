"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { business, navLinks } from "@/lib/content";
import { MenuIcon, CloseIcon } from "./Icons";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-cocoa/10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="" width={48} height={48} className="h-12 w-12 rounded-full" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold text-coffee">
              {business.shortName}
            </span>
            <span className="font-display text-lg text-cocoa">Café</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-cocoa/80 hover:text-coffee transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/custom-cakes"
            className="inline-flex items-center rounded-full bg-coffee px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-dark transition-colors"
          >
            Order a cake
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 -mr-2 text-cocoa"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-cocoa/10 bg-cream px-5 sm:px-8 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-cocoa/85"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/custom-cakes"
            onClick={() => setOpen(false)}
            className="inline-flex justify-center rounded-full bg-coffee px-5 py-2.5 text-sm font-semibold text-cream"
          >
            Order a cake
          </Link>
        </nav>
      )}
    </header>
  );
}
