"use client";

import { useEffect, useState } from "react";
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
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 30);

      const scrollPosition =
        window.scrollY + 160;

      let currentSection = "hero";

      links.forEach((link) => {
        const section =
          document.getElementById(link.id);

        if (!section) return;

        const top =
          section.offsetTop;

        const height =
          section.offsetHeight;

        if (
          scrollPosition >= top &&
          scrollPosition < top + height
        ) {
          currentSection =
            link.id;
        }
      });

      setActive(currentSection);
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  function scrollToSection(
    id: string
  ) {
    const element =
      document.getElementById(id);

    if (!element) {
      setOpen(false);
      return;
    }

    const navbarOffset = 110;

    const elementPosition =
      element.getBoundingClientRect()
        .top + window.scrollY;

    window.scrollTo({
      top:
        elementPosition -
        navbarOffset,
      behavior: "smooth",
    });

    setActive(id);
    setOpen(false);
  }

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
          className={`
            relative
            flex
            w-full
            items-center
            rounded-full
            border
            px-4
            py-3
            transition-all
            duration-300

            sm:px-6

            ${
              scrolled
                ? `
                    border-black/10
                    bg-white/95
                    shadow-lg

                    dark:border-white/10
                    dark:bg-black/95
                    dark:shadow-2xl
                  `
                : `
                    border-black/10
                    bg-white/90

                    dark:border-white/10
                    dark:bg-black/90
                  `
            }
          `}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() =>
              scrollToSection("hero")
            }
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
          </button>

          {/* Desktop Menu */}
          <div className="mx-auto hidden items-center justify-center gap-1 md:flex lg:gap-2">
            {links.map((link) => {
              const isActive =
                active === link.id;

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() =>
                    scrollToSection(
                      link.id
                    )
                  }
                  className={`
                    relative
                    rounded-full
                    px-2.5
                    py-2
                    text-sm
                    transition-colors

                    lg:px-3
                    lg:text-[15px]

                    xl:px-4
                    xl:text-base

                    ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                        : "text-gray-700 hover:bg-black/5 hover:text-cyan-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-cyan-400"
                    }
                  `}
                >
                  {link.label}
                </button>
              );
            })}
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
                setOpen(
                  (current) =>
                    !current
                )
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
                transition-colors

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
              <button
                key={link.id}
                type="button"
                onClick={() =>
                  scrollToSection(
                    link.id
                  )
                }
                className={`
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  transition-colors

                  ${
                    active ===
                    link.id
                      ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                      : "text-gray-700 hover:bg-black/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                  }
                `}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}