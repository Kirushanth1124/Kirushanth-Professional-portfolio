"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ExperienceItem {
  id: string;
  year: string;
  title: string;
  company: string;
  location?: string | null;
  description: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExperiences() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/experience", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch experiences: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Experience API did not return an array"
          );
        }

        setExperiences(data);
      } catch (err) {
        console.error(
          "Failed to load experiences:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load experiences"
        );

        setExperiences([]);
      } finally {
        setLoading(false);
      }
    }

    fetchExperiences();
  }, []);

  return (
    <section
      id="experience"
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

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
            Career Journey
          </p>

          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Experience
          </h2>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="mt-20 text-center text-gray-600 dark:text-gray-400">
            Loading Experience...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-20 text-center">
            <p className="text-red-500 dark:text-red-400">
              Failed to load experience.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          experiences.length === 0 && (
            <div className="mt-20 text-center text-gray-600 dark:text-gray-400">
              No experience data found.
            </div>
          )}

        {/* Timeline */}
        {!loading &&
          !error &&
          experiences.length > 0 && (
            <div className="relative mt-20 border-l border-black/10 pl-8 dark:border-white/10 sm:pl-10">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{
                    opacity: 0,
                    x: -40,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.6,
                  }}
                  whileHover={{
                    x: 5,
                  }}
                  className="relative mb-10 sm:mb-12"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[34px] top-2 sm:-left-[42px]">
                    <div className="relative flex h-5 w-5 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-40" />

                      <span className="relative h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="
                      rounded-3xl
                      border
                      border-black/10
                      bg-black/[0.03]
                      p-5
                      backdrop-blur-xl
                      transition-all
                      duration-300

                      hover:border-cyan-400/40
                      hover:shadow-[0_0_30px_rgba(34,211,238,0.10)]

                      dark:border-white/10
                      dark:bg-white/5
                      dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]

                      sm:p-6
                    "
                  >
                    {/* Year */}
                    <span
                      className="
                        inline-block
                        rounded-full
                        border
                        border-cyan-500/30
                        bg-cyan-500/10
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-cyan-700

                        dark:border-cyan-400/30
                        dark:bg-cyan-400/10
                        dark:text-cyan-300
                      "
                    >
                      {exp.year || "Present"}
                    </span>

                    {/* Title */}
                    <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
                      {exp.title ||
                        "Untitled Experience"}
                    </h3>

                    {/* Company */}
                    <p className="mt-1 text-sm font-medium text-cyan-600 dark:text-cyan-400">
                      {exp.company ||
                        "Company not specified"}
                    </p>

                    {/* Location */}
                    {exp.location && (
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        📍 {exp.location}
                      </p>
                    )}

                    {/* Description */}
                    <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
                      {exp.description ||
                        "No description provided."}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
      </div>
    </section>
  );
}