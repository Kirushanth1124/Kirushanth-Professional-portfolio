const skills = [
  "Full Stack Dev",
  "AI / ML",
  "React & Next.js",
  "Node.js",
  "Cloud & DevOps",
];

export default function SkillChips() {
  return (
    <div className="mx-auto mb-8 flex max-w-3xl flex-wrap justify-center gap-3">
      {skills.map((skill) => (
        <span
          key={skill}
          className="
            rounded-full
            border
            border-cyan-500/30
            bg-cyan-500/10
            px-4
            py-2
            text-xs
            font-semibold
            text-cyan-700
            transition-all
            duration-300

            hover:-translate-y-1
            hover:border-cyan-500/50
            hover:bg-cyan-500/15
            hover:shadow-[0_8px_25px_rgba(6,182,212,0.12)]

            dark:border-cyan-400/20
            dark:bg-cyan-500/5
            dark:text-cyan-300
            dark:hover:border-cyan-400/40
            dark:hover:bg-cyan-400/10
          "
        >
          {skill}
        </span>
      ))}
    </div>
  );
}