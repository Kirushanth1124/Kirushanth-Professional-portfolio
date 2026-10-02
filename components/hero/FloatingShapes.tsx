"use client";

import { motion } from "framer-motion";

export default function FloatingShapes() {
  return (
    <>
      {/* Top Left Square */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [12, 20, 12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-[6%]
          top-[12%]
          h-40
          w-40
          rounded-[28px]
          border
          border-cyan-500/20
          bg-cyan-500/[0.02]

          dark:border-cyan-500/10
          dark:bg-transparent
        "
      />

      {/* Top Right Circle */}
      <motion.div
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          right-[8%]
          top-[20%]
          h-24
          w-24
          rounded-full
          border
          border-indigo-500/20
          bg-indigo-500/[0.02]

          dark:border-indigo-500/10
          dark:bg-transparent
        "
      />

      {/* Bottom Right Diamond */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [45, 60, 45],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-[22%]
          right-[12%]
          h-16
          w-16
          border
          border-purple-500/20
          bg-purple-500/[0.02]

          dark:border-purple-500/10
          dark:bg-transparent
        "
      />

      {/* Bottom Left Circle */}
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          bottom-[30%]
          left-[5%]
          h-32
          w-32
          rounded-full
          border
          border-cyan-500/20
          bg-cyan-500/[0.02]

          dark:border-cyan-500/10
          dark:bg-transparent
        "
      />
    </>
  );
}