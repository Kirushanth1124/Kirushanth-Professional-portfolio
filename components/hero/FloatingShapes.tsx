"use client";

export default function FloatingShapes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Top Left Square */}
      <div
        className="
          absolute
          left-[6%]
          top-[12%]
          h-24
          w-24
          rounded-[22px]
          border
          border-cyan-500/15
          bg-cyan-500/[0.03]

          sm:h-32
          sm:w-32
          md:h-36
          md:w-36

          dark:border-cyan-500/10
          dark:bg-transparent
        "
      />

      {/* Top Right Circle */}
      <div
        className="
          absolute
          right-[8%]
          top-[20%]
          h-16
          w-16
          rounded-full
          border
          border-indigo-500/15
          bg-indigo-500/[0.03]

          sm:h-20
          sm:w-20
          md:h-24
          md:w-24

          dark:border-indigo-500/10
          dark:bg-transparent
        "
      />

      {/* Bottom Right Diamond */}
      <div
        className="
          absolute
          bottom-[22%]
          right-[12%]
          h-12
          w-12
          rotate-45
          border
          border-purple-500/15
          bg-purple-500/[0.03]

          sm:h-14
          sm:w-14
          md:h-16
          md:w-16

          dark:border-purple-500/10
          dark:bg-transparent
        "
      />

      {/* Bottom Left Circle */}
      <div
        className="
          absolute
          bottom-[30%]
          left-[5%]
          h-20
          w-20
          rounded-full
          border
          border-cyan-500/15
          bg-cyan-500/[0.03]

          sm:h-24
          sm:w-24
          md:h-28
          md:w-28

          dark:border-cyan-500/10
          dark:bg-transparent
        "
      />
    </div>
  );
}