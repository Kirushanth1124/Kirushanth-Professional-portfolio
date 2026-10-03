"use client";

import { useEffect, useMemo, useState } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  icon?: string | null;
}

type GroupedSkills = Record<string, Skill[]>;

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchSkills() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/skills", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch skills: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Skills API did not return an array"
          );
        }

        if (active) {
          setSkills(data);
        }
      } catch (err) {
        console.error(
          "Failed to load skills:",
          err
        );

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load skills"
          );

          setSkills([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchSkills();

    return () => {
      active = false;
    };
  }, []);

  const groupedSkills = useMemo(() => {
    return skills.reduce<GroupedSkills>(
      (acc, skill) => {
        const category =
          skill.category?.trim() || "Other";

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(skill);

        return acc;
      },
      {}
    );
  }, [skills]);

  return (
    <section
      id="skills"
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
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
            Technologies I Use
          </p>

          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            My Skills
          </h2>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-cyan-400" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-20 text-center text-gray-600 dark:text-gray-400">
            Loading Skills...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-20 text-center">
            <p className="text-red-500 dark:text-red-400">
              Failed to load skills.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          skills.length === 0 && (
            <div className="mt-20 text-center text-gray-600 dark:text-gray-400">
              No skills found.
            </div>
          )}

        {/* Skills */}
        {!loading &&
          !error &&
          skills.length > 0 && (
            <div className="mt-20 space-y-10">
              {Object.entries(groupedSkills).map(
                ([category, categorySkills]) => (
                  <div
                    key={category}
                    className="
                      rounded-3xl
                      border
                      border-black/10
                      bg-black/[0.03]
                      p-6
                      transition-all
                      duration-300

                      dark:border-white/10
                      dark:bg-white/5

                      sm:p-8
                    "
                  >
                    <h3 className="mb-6 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                      {category}
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {categorySkills.map(
                        (skill) => (
                          <div
                            key={skill.id}
                            className="
                              rounded-2xl
                              border
                              border-black/10
                              bg-white
                              p-5
                              shadow-sm
                              transition-all
                              duration-300

                              hover:-translate-y-1
                              hover:border-cyan-400/40
                              hover:shadow-[0_12px_30px_rgba(34,211,238,0.08)]

                              dark:border-white/10
                              dark:bg-black/20
                              dark:hover:border-cyan-400/30
                            "
                          >
                            <div className="flex items-center justify-between gap-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {skill.name ||
                                  "Unnamed Skill"}
                              </h4>

                              <span
                                className="
                                  shrink-0
                                  rounded-full
                                  border
                                  border-cyan-500/30
                                  bg-cyan-500/10
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold
                                  text-cyan-600

                                  dark:border-cyan-400/30
                                  dark:bg-cyan-400/10
                                  dark:text-cyan-400
                                "
                              >
                                {skill.level ||
                                  "N/A"}
                              </span>
                            </div>

                            {skill.icon && (
                              <p className="mt-3 break-words text-sm text-gray-600 dark:text-gray-400">
                                {skill.icon}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </section>
  );
}