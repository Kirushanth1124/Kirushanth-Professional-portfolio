"use client";

import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  const cardClass = `
    group
    rounded-3xl
    border
    border-black/10
    bg-black/[0.03]
    p-5
    backdrop-blur-xl
    transition-all
    duration-300

    hover:-translate-y-1
    hover:shadow-[0_14px_35px_rgba(34,211,238,0.08)]

    dark:border-white/10
    dark:bg-white/5

    sm:p-6
  `;

  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-black/10
        bg-white
        py-16
        text-gray-900
        transition-colors
        duration-300

        dark:border-white/10
        dark:bg-black
        dark:text-white

        sm:py-20
      "
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[120px] sm:h-72 sm:w-72" />

      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[120px] sm:h-72 sm:w-72" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        {/* Name */}
        <motion.h3
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="text-3xl font-extrabold tracking-wide text-cyan-600 dark:text-cyan-400 sm:text-4xl"
        >
          Kirushanth
        </motion.h3>

        {/* Tagline */}
        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base"
        >
          Intern Software Engineer • Full Stack Developer
          <br className="hidden sm:block" />

          <span className="sm:ml-1">
            Building modern and scalable digital experiences.
          </span>
        </motion.p>

        {/* Social Cards */}
        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3">
          {/* Email */}
          <motion.a
            href="mailto:jk.dhanush22@gmail.com"
            whileHover={{
              y: -6,
            }}
            className={`${cardClass} hover:border-cyan-400/40`}
          >
            <Mail className="mx-auto mb-3 text-cyan-600 dark:text-cyan-400" />

            <h4 className="font-semibold text-gray-900 dark:text-white">
              Email
            </h4>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Let&apos;s talk projects
            </p>

            <ArrowUpRight className="mx-auto mt-4 text-gray-500 opacity-50 transition group-hover:opacity-100 dark:text-gray-400" />
          </motion.a>

          {/* GitHub */}
          <motion.a
            href="https://github.com/Kirushanth1124"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              y: -6,
            }}
            className={`${cardClass} hover:border-purple-400/40`}
          >
            <FaGithub className="mx-auto mb-3 text-purple-600 dark:text-purple-400" />

            <h4 className="font-semibold text-gray-900 dark:text-white">
              GitHub
            </h4>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View my code
            </p>

            <ArrowUpRight className="mx-auto mt-4 text-gray-500 opacity-50 transition group-hover:opacity-100 dark:text-gray-400" />
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/94723252802"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              y: -6,
            }}
            className={`${cardClass} hover:border-green-400/40`}
          >
            <MessageCircle className="mx-auto mb-3 text-green-600 dark:text-green-400" />

            <h4 className="font-semibold text-gray-900 dark:text-white">
              WhatsApp
            </h4>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Quick chat
            </p>

            <ArrowUpRight className="mx-auto mt-4 text-gray-500 opacity-50 transition group-hover:opacity-100 dark:text-gray-400" />
          </motion.a>
        </div>

        {/* Divider */}
        <div className="mx-auto mt-12 h-[1px] w-full max-w-3xl bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent sm:mt-14" />

        {/* Bottom Text */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          className="mt-8 space-y-2 px-2 text-xs leading-6 text-gray-500 sm:text-sm"
        >
          <p>
            © 2026{" "}
            <span className="text-cyan-600 dark:text-cyan-400">
              Kirushanth
            </span>
            . All rights reserved.
          </p>

          <p>
            Built with{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              Next.js
            </span>{" "}
            •{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              Tailwind CSS
            </span>{" "}
            •{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              Framer Motion
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}