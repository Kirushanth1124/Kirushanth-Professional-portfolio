"use client";

import { useState } from "react";
import {
  Menu,
  X,
} from "lucide-react";

import ThemeToggle from "@/components/ui/ThemeToggle";

const links = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "certificates", label: "Certificates" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav
        className="
          fixed
          left-1/2
          top-4
          z-50
          w-[calc(100%-2rem)]
          max-w-7xl
          -translate-x-1/2

          sm:top-5
        "
      >
        <div
          className="
            relative
            flex
            w-full
            items-center
            rounded-full
            border
            border-black/10
            bg-white/95
            px-4
            py-3
            shadow-lg

            dark:border-white/10
            dark:bg-black/95

            sm:px-6
          "
        >
          {/* Logo */}
          <a
            href="#hero"
            className="
              relative
              z-10
              shrink-0

              md:absolute
              md:left-6
            "
          >
            <span className="text-sm font-bold tracking-wide text-cyan-600 dark:text-cyan-400 sm:text-base">
              Kirushanth
            </span>

            <div className="absolute -bottom-1 left-0 h-[2px] w-full bg-cyan-400 opacity-60" />
          </a>

          {/* Desktop Menu */}
          <div className="mx-auto hidden items-center justify-center gap-1 md:flex lg:gap-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="
                  relative
                  rounded-full
                  px-2.5
                  py-2
                  text-sm
                  text-gray-700
                  transition-colors

                  hover:bg-black/5
                  hover:text-cyan-600

                  dark:text-gray-300
                  dark:hover:bg-white/5
                  dark:hover:text-cyan-400

                  lg:px-3
                  lg:text-[15px]

                  xl:px-4
                  xl:text-base
                "
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Theme Toggle */}
          <div
            className="
              absolute
              right-5
              hidden
              md:flex
              md:items-center
              lg:right-6
            "
          >
            <ThemeToggle />
          </div>

          {/* Mobile Actions */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() =>
                setOpen((current) => !current)
              }
              aria-label={
                open
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={open}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-black/10
                bg-black/5
                text-cyan-600

                dark:border-white/10
                dark:bg-white/5
                dark:text-cyan-400
              "
            >
              {open ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {open && (
        <div
          className="
            fixed
            left-4
            right-4
            top-20
            z-40
            max-h-[75vh]
            overflow-y-auto
            rounded-3xl
            border
            border-black/10
            bg-white
            p-4
            shadow-2xl

            dark:border-white/10
            dark:bg-black

            sm:left-6
            sm:right-6
            sm:top-24

            md:hidden
          "
        >
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  text-gray-700

                  hover:bg-black/5
                  hover:text-cyan-600

                  dark:text-gray-300
                  dark:hover:bg-white/5
                  dark:hover:text-cyan-400
                "
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}