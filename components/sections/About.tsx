"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  BrainCircuit,
  BriefcaseBusiness,
} from "lucide-react";

interface SiteSettings {
  siteName?: string | null;
  aboutText?: string | null;
  profileImage?: string | null;
}

export default function About() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Kirushanth",
    aboutText:
      "I am an Intern Software Engineer from Sri Lanka currently working at Inspire Associate. I focus on building full-stack web applications, software solutions, and practical digital products. My goal is to turn real-world problems into modern, scalable, and user-friendly software solutions.",
    profileImage: "/Kirushanth.png",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/site-settings", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        setSettings((prev) => ({
          siteName: data.siteName || prev.siteName,
          aboutText: data.aboutText || prev.aboutText,
          profileImage: data.profileImage || prev.profileImage,
        }));
      } catch (error) {
        console.error("ABOUT SETTINGS LOAD ERROR:", error);
      }
    }

    loadSettings();
  }, []);

  const name =
    settings.siteName?.trim() || "Kirushanth";

  const aboutText =
    settings.aboutText?.trim() ||
    "I am an Intern Software Engineer focused on building modern software solutions.";

  const profileImage =
    settings.profileImage?.trim() || "/Kirushanth.png";

  const cardClass = `
    rounded-3xl
    border border-black/10
    bg-black/[0.03]
    p-6
    backdrop-blur-xl
    transition-all duration-300

    hover:-translate-y-2
    hover:border-cyan-400/40
    hover:shadow-[0_20px_50px_rgba(34,211,238,0.08)]

    dark:border-white/10
    dark:bg-white/5
    dark:hover:border-cyan-400/40

    sm:p-8
  `;

  return (
    <section
      id="about"
      className="
        relative
        overflow-hidden
        bg-white
        px-4
        py-24
        text-gray-900
        transition-colors
        duration-300

        dark:bg-black
        dark:text-white

        sm:px-6
        sm:py-28
      "
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          viewport={{
            once: true,
          }}
          className="mb-16 text-center sm:mb-20"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
            Get To Know Me
          </p>

          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            About Me
          </h2>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </motion.div>

        {/* Main Grid */}
        <div className="grid items-center gap-14 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-20 xl:gap-24">
          {/* Image Side */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-[270px] sm:w-[310px] lg:w-[360px]">
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-2xl" />

              {/* Image */}
              <div
                className="
                  relative
                  aspect-[4/5]
                  w-full
                  overflow-hidden
                  rounded-3xl
                  border
                  border-black/10
                  bg-black/[0.03]
                  backdrop-blur-xl

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <img
                  src={profileImage}
                  alt={name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="min-w-0"
          >
            <h3 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {name}
            </h3>

            <p className="whitespace-pre-line text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg">
              {aboutText}
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div
                className="
                  rounded-2xl
                  border
                  border-black/10
                  bg-black/[0.03]
                  p-5
                  backdrop-blur-xl

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <h4 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                  2+
                </h4>

                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Years Experience
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-black/10
                  bg-black/[0.03]
                  p-5
                  backdrop-blur-xl

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <h4 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                  4+
                </h4>

                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Projects Completed
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skill Cards */}
        <div className="mt-20 grid gap-6 sm:mt-24 md:grid-cols-2 xl:grid-cols-4">
          <motion.div
            whileHover={{ y: -8 }}
            className={cardClass}
          >
            <Code2
              className="mb-5 text-cyan-600 dark:text-cyan-400"
              size={35}
            />

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Frontend
            </h3>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              React, Next.js, Angular, Tailwind CSS
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className={cardClass}
          >
            <BriefcaseBusiness
              className="mb-5 text-cyan-600 dark:text-cyan-400"
              size={35}
            />

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Backend
            </h3>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              ASP.NET, Node.js, C#, Python
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className={cardClass}
          >
            <Database
              className="mb-5 text-cyan-600 dark:text-cyan-400"
              size={35}
            />

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Database
            </h3>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              PostgreSQL, SQL Server, SQLite, MongoDB
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className={cardClass}
          >
            <BrainCircuit
              className="mb-5 text-cyan-600 dark:text-cyan-400"
              size={35}
            />

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              AI & ML
            </h3>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              AI Tools, Machine Learning, Automation
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}