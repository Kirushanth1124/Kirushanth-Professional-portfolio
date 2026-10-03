"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  featured?: boolean;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/projects", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch projects: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Projects API did not return an array"
          );
        }

        if (active) {
          setProjects(data);
        }
      } catch (err) {
        console.error(
          "Failed to load projects:",
          err
        );

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load projects"
          );

          setProjects([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="projects"
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
            My Work
          </p>

          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Featured Projects
          </h2>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-cyan-400" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-20 text-center text-gray-600 dark:text-gray-400">
            Loading Projects...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-20 text-center">
            <p className="text-red-500 dark:text-red-400">
              Failed to load projects.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="mt-20 text-center text-gray-600 dark:text-gray-400">
              No projects found.
            </div>
          )}

        {/* Projects */}
        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="mt-20 grid gap-8 md:grid-cols-2">
              {projects.map(
                (project, index) => (
                  <div
                    key={project.id}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-3xl
                      border
                      border-black/10
                      bg-black/[0.03]
                      p-6
                      transition-all
                      duration-300

                      hover:-translate-y-2
                      hover:border-cyan-400/40
                      hover:shadow-[0_18px_50px_rgba(34,211,238,0.08)]

                      dark:border-white/10
                      dark:bg-white/5

                      sm:p-8
                    "
                  >
                    {/* Number */}
                    <span className="mb-4 block text-5xl font-extrabold text-black/5 dark:text-white/5">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
                      {project.title ||
                        "Untitled Project"}
                    </h3>

                    {/* Description */}
                    <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
                      {project.description ||
                        "No description provided."}
                    </p>

                    {/* Tech Stack */}
                    {project.techStack && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {project.techStack
                          .split(",")
                          .filter(
                            (tech) =>
                              tech.trim().length >
                              0
                          )
                          .map(
                            (
                              tech,
                              techIndex
                            ) => (
                              <span
                                key={`${project.id}-${techIndex}`}
                                className="
                                  rounded-full
                                  border
                                  border-black/10
                                  bg-black/5
                                  px-4
                                  py-1.5
                                  text-sm
                                  text-gray-700

                                  dark:border-white/10
                                  dark:bg-white/5
                                  dark:text-gray-300
                                "
                              >
                                {tech.trim()}
                              </span>
                            )
                          )}
                      </div>
                    )}

                    {/* Buttons */}
                    {(project.githubUrl ||
                      project.liveUrl) && (
                      <div className="mt-8 flex flex-wrap gap-4">
                        {project.githubUrl && (
                          <a
                            href={
                              project.githubUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              flex
                              items-center
                              gap-2
                              rounded-full
                              border
                              border-black/10
                              bg-black/5
                              px-5
                              py-2.5
                              text-sm
                              text-gray-800
                              transition-colors

                              hover:border-cyan-400/40
                              hover:text-cyan-600

                              dark:border-white/10
                              dark:bg-white/5
                              dark:text-gray-200
                              dark:hover:text-cyan-400
                            "
                          >
                            <FaGithub
                              size={18}
                            />

                            GitHub
                          </a>
                        )}

                        {project.liveUrl && (
                          <a
                            href={
                              project.liveUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              flex
                              items-center
                              gap-2
                              rounded-full
                              bg-cyan-500
                              px-5
                              py-2.5
                              text-sm
                              font-medium
                              text-white
                              transition-colors

                              hover:bg-cyan-600
                            "
                          >
                            Live Demo

                            <ArrowUpRight
                              size={18}
                            />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </section>
  );
}