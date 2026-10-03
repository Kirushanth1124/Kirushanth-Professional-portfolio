import { prisma } from "@/lib/prisma";
import {
  Award,
  ExternalLink,
} from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  credential: string | null;
  imageUrl: string | null;
}

export const dynamic = "force-dynamic";

export default async function Certificates() {
  let certificates: Certificate[] = [];
  let error = "";

  try {
    certificates =
      await prisma.certificate.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          issuer: true,
          issuedDate: true,
          credential: true,
          imageUrl: true,
        },
      });
  } catch (err) {
    console.error(
      "CERTIFICATES LOAD ERROR:",
      err
    );

    error = "Failed to load certificates";
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
      <div className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
            Achievements
          </p>

          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Certificates
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            Professional certifications and learning achievements.
          </p>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-cyan-400" />
        </div>

        {/* Error */}
        {error && (
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400">
              Failed to load certificates.
            </p>
          </div>
        )}

        {/* Empty */}
        {!error &&
          certificates.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No certificates found.
            </div>
          )}

        {/* Certificate Cards */}
        {!error &&
          certificates.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map(
                (certificate) => (
                  <article
                    key={certificate.id}
                    className="
                      group
                      overflow-hidden
                      rounded-3xl
                      border
                      border-black/10
                      bg-black/[0.03]
                      transition-all
                      duration-300

                      hover:border-cyan-400/40

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
                          className="h-full w-full object-cover"
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
                            transition-colors

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
                  </article>
                )
              )}
            </div>
          )}
      </div>
    </section>
  );
}