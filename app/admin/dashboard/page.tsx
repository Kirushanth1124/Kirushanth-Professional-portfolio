"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FolderKanban,
  Award,
  MessageSquare,
  Code2,
  BriefcaseBusiness,
  Settings,
  Share2,
  Quote,
} from "lucide-react";

interface DashboardStats {
  projects: number;
  skills: number;
  messages: number;
  certificates: number;
  experience: number;
  testimonials: number;
}

export default function DashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats>({
      projects: 0,
      skills: 0,
      messages: 0,
      certificates: 0,
      experience: 0,
      testimonials: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const results =
          await Promise.allSettled([
            fetch("/api/projects", {
              cache: "no-store",
            }),

            fetch("/api/skills", {
              cache: "no-store",
            }),

            fetch("/api/messages", {
              cache: "no-store",
            }),

            fetch("/api/certificates", {
              cache: "no-store",
            }),

            fetch("/api/experience", {
              cache: "no-store",
            }),

            fetch("/api/testimonials", {
              cache: "no-store",
            }),
          ]);

        async function getCount(
          result: PromiseSettledResult<Response>
        ) {
          if (
            result.status !== "fulfilled" ||
            !result.value.ok
          ) {
            return 0;
          }

          const data =
            await result.value.json();

          return Array.isArray(data)
            ? data.length
            : 0;
        }

        const [
          projects,
          skills,
          messages,
          certificates,
          experience,
          testimonials,
        ] = await Promise.all(
          results.map((result) =>
            getCount(result)
          )
        );

        setStats({
          projects,
          skills,
          messages,
          certificates,
          experience,
          testimonials,
        });
      } catch (err) {
        console.error(
          "DASHBOARD STATS ERROR:",
          err
        );

        setError(
          "Some dashboard statistics could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const dashboardCards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      href: "/admin/projects",
    },

    {
      title: "Skills",
      value: stats.skills,
      icon: Code2,
      href: "/admin/skills",
    },

    {
      title: "Experience",
      value: stats.experience,
      icon: BriefcaseBusiness,
      href: "/admin/experience",
    },

    {
      title: "Certificates",
      value: stats.certificates,
      icon: Award,
      href: "/admin/certificates",
    },

    {
      title: "Testimonials",
      value: stats.testimonials,
      icon: Quote,
      href: "/admin/testimonials",
    },

    {
      title: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      href: "/admin/messages",
    },
  ];

  const managementCards = [
    {
      title: "Site Settings",
      description:
        "Manage your name, hero content, profile image, about text and resume.",
      icon: Settings,
      href: "/admin/site-settings",
    },

    {
      title: "Social Links",
      description:
        "Manage GitHub, LinkedIn and other social media links.",
      icon: Share2,
      href: "/admin/social-links",
    },
  ];

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8 xl:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Heading */}
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400 sm:text-sm sm:tracking-[0.25em]">
            Admin Panel
          </p>

          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Welcome back Kirushanth 👋
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-300">
            {error}
          </div>
        )}

        {/* Main Management Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 2xl:grid-cols-6">
          {dashboardCards.map(
            (item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.07] sm:rounded-3xl sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400 sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Icon size={22} />
                    </div>

                    <span className="min-w-0 text-2xl font-bold text-white sm:text-3xl">
                      {loading
                        ? "..."
                        : item.value}
                    </span>
                  </div>

                  <h2 className="mt-4 break-words text-base font-semibold transition-colors group-hover:text-cyan-400 sm:mt-5 sm:text-lg">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Manage{" "}
                    {item.title.toLowerCase()}
                  </p>
                </Link>
              );
            }
          )}
        </div>

        {/* Website Management */}
        <div className="mt-10 sm:mt-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400 sm:text-sm sm:tracking-[0.2em]">
              Website Management
            </p>

            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              Settings & Links
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {managementCards.map(
              (item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.07] sm:rounded-3xl sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-400 sm:h-12 sm:w-12 sm:rounded-2xl">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words text-base font-bold transition-colors group-hover:text-cyan-400 sm:text-lg">
                          {item.title}
                        </h3>

                        <p className="mt-2 break-words text-sm leading-6 text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </div>
    </main>
  );
}