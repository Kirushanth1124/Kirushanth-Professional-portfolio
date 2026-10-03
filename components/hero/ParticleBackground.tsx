"use client";

export default function ParticleBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Simple Grid */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Soft Center Glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-64
          w-64
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/10

          sm:h-80
          sm:w-80
        "
      />

      {/* Top Right Glow */}
      <div
        className="
          absolute
          -right-20
          -top-20
          h-52
          w-52
          rounded-full
          bg-purple-500/10

          sm:h-64
          sm:w-64
        "
      />

      {/* Bottom Left Glow */}
      <div
        className="
          absolute
          -bottom-20
          -left-20
          h-48
          w-48
          rounded-full
          bg-cyan-500/10

          sm:h-60
          sm:w-60
        "
      />
    </div>
  );
}