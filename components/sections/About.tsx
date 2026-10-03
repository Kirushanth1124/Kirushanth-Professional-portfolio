import { prisma } from "@/lib/prisma";
import {
  Code2,
  Database,
  BrainCircuit,
  BriefcaseBusiness,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function About() {
  let siteName = "Kirushanth";
  let aboutText =
    "I am an Intern Software Engineer from Sri Lanka currently working at Inspire Associate. I focus on building full-stack web applications, software solutions, and practical digital products. My goal is to turn real-world problems into modern, scalable, and user-friendly software solutions.";
  let profileImage = "/Kirushanth.png";

  try {
    const settings = await prisma.siteSettings.findFirst({
      select: {
        siteName: true,
        aboutText: true,
        profileImage: true,
      },
    });

    if (settings) {
      siteName =
        settings.siteName?.trim() || siteName;

      aboutText =
        settings.aboutText?.trim() || aboutText;

      profileImage =
        settings.profileImage?.trim() || profileImage;
    }
  } catch (err) {
    console.error(
      "ABOUT SETTINGS LOAD ERROR:",
      err
    );
  }

  const cardClass = `
    rounded-3xl
    border
    border-black/10
    bg-black/[0.03]
    p-6
    transition-all
    duration-300

    hover:border-cyan-400/40

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
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center sm:mb-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
            Get To Know Me
          </p>

          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            About Me
          </h2>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-cyan-400" />
        </div>

        {/* Main Grid */}
        <div className="grid items-center gap-14 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-20 xl:gap-24">
          {/* Image Side */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-[270px] sm:w-[310px] lg:w-[360px]">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-cyan-500/10 blur-2xl" />

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

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <img
                  src={profileImage}
                  alt={siteName}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="min-w-0">
            <h3 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {siteName}
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
          </div>
        </div>

        {/* Skill Cards */}
        <div className="mt-20 grid gap-6 sm:mt-24 md:grid-cols-2 xl:grid-cols-4">
          <div className={cardClass}>
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
          </div>

          <div className={cardClass}>
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
          </div>

          <div className={cardClass}>
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
          </div>

          <div className={cardClass}>
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
          </div>
        </div>
      </div>
    </section>
  );
}