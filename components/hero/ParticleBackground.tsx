"use client";

export default function ParticleBackground() {
  return (
    <>
      {/* Light Mode Grid */}
      <div
        className="
          absolute
          inset-0
          opacity-40
          dark:hidden
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Dark Mode Grid */}
      <div
        className="
          absolute
          inset-0
          hidden
          opacity-20
          dark:block
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,189,248,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Center Glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/[0.08]
          blur-[120px]

          dark:h-[700px]
          dark:w-[700px]
          dark:bg-cyan-500/10
        "
      />

      {/* Top Right Orb */}
      <div
        className="
          absolute
          -right-20
          -top-20
          h-[350px]
          w-[350px]
          rounded-full
          bg-purple-500/[0.07]
          blur-[120px]

          dark:h-[400px]
          dark:w-[400px]
          dark:bg-purple-500/10
        "
      />

      {/* Bottom Left Orb */}
      <div
        className="
          absolute
          -bottom-20
          -left-20
          h-[300px]
          w-[300px]
          rounded-full
          bg-cyan-500/[0.07]
          blur-[120px]

          dark:h-[350px]
          dark:w-[350px]
          dark:bg-cyan-500/10
        "
      />

      {/* Bottom Right Orb */}
      <div
        className="
          absolute
          bottom-[20%]
          right-[10%]
          h-[220px]
          w-[220px]
          rounded-full
          bg-pink-500/[0.06]
          blur-[100px]

          dark:h-[250px]
          dark:w-[250px]
          dark:bg-pink-500/10
        "
      />
    </>
  );
}