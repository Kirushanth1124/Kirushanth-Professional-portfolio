"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  ExternalLink,
} from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  credential?: string | null;
  imageUrl?: string | null;
}

export default function Certificates() {
  const [certificates, setCertificates] =
    useState<Certificate[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadCertificates() {
      try {
        const res = await fetch(
          "/api/certificates",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        if (Array.isArray(data)) {
          setCertificates(data);
        }
      } catch (error) {
        console.error(
          "CERTIFICATES LOAD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, []);

  if (loading) {
    return (
      <section
        id="certificates"
        className="
          bg-white
          px-4
          py-24
          text-gray-900
          transition-colors
          duration-300

          dark:bg-black
          dark:text-white

          sm:px-6
        "
      >
        <div className="mx-auto max-w-7xl text-center text-gray-600 dark:text-gray-400">
          Loading certificates...
        </div>
      </section>
    );
  }

  if (certificates.length === 0) {
    return null;
  }

  return (
    <section
      id="certificates"
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
      {/* Glow */}
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          viewport={{
            once: true,
          }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
            Achievements
          </p>

          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Certificates
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            Professional certifications and learning achievements.
          </p>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </motion.div>

        {/* Certificate Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map(
            (certificate, index) => (
              <motion.article
                key={certificate.id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  y: -8,
                }}
                className="
                  group
                  overflow-hidden
                  rounded-3xl
                  border
                  border-black/10
                  bg-black/[0.03]
                  backdrop-blur-xl
                  transition-all
                  duration-300

                  hover:border-cyan-400/40
                  hover:shadow-[0_18px_50px_rgba(34,211,238,0.08)]

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                {/* Image */}
                {certificate.imageUrl ? (
                  <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-black/30">
                    <img
                      src={
                        certificate.imageUrl
                      }
                      alt={
                        certificate.title
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-black/[0.02] dark:bg-white/[0.02]">
                    <Award
                      size={55}
                      className="text-cyan-500/40 dark:text-cyan-400/40"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div
                    className="
                      mb-4
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-cyan-500/20
                      bg-cyan-500/10
                      text-cyan-600

                      dark:border-cyan-400/20
                      dark:bg-cyan-400/10
                      dark:text-cyan-400
                    "
                  >
                    <Award size={22} />
                  </div>

                  <h3 className="text-xl font-bold leading-snug text-gray-900 dark:text-white">
                    {certificate.title}
                  </h3>

                  <p className="mt-3 font-medium text-cyan-600 dark:text-cyan-400">
                    {certificate.issuer}
                  </p>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    Issued{" "}
                    {certificate.issuedDate}
                  </p>

                  {certificate.credential && (
                    <a
                      href={
                        certificate.credential
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        mt-6
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-gray-700
                        transition

                        hover:text-cyan-600

                        dark:text-gray-300
                        dark:hover:text-cyan-400
                      "
                    >
                      View Credential

                      <ExternalLink
                        size={15}
                      />
                    </a>
                  )}
                </div>
              </motion.article>
            )
          )}
        </div>
      </div>
    </section>
  );
}