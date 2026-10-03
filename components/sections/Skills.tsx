import { prisma } from "@/lib/prisma";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  icon: string | null;
}

type GroupedSkills = Record<string, Skill[]>;

export const dynamic = "force-dynamic";

export default async function Skills() {
  let skills: Skill[] = [];
  let error = "";

  try {
    skills = await prisma.skill.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
        category: true,
        level: true,
        icon: true,
      },
    });
  } catch (err) {
    console.error("SKILLS LOAD ERROR:", err);
    error = "Failed to load skills";
  }

  const groupedSkills = skills.reduce<GroupedSkills>(
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

        {/* Error */}
        {error && (
          <div className="mt-20 text-center">
            <p className="text-red-500 dark:text-red-400">
              Failed to load skills.
            </p>
          </div>
        )}

        {/* Empty */}
        {!error && skills.length === 0 && (
          <div className="mt-20 text-center text-gray-600 dark:text-gray-400">
            No skills found.
          </div>
        )}

        {/* Skills */}
        {!error && skills.length > 0 && (
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

                            hover:border-cyan-400/40

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