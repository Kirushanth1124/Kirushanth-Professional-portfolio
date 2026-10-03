import { prisma } from "@/lib/prisma";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  review: string;
  imageUrl: string | null;
  featured: boolean;
  status: string;
}

export const dynamic = "force-dynamic";

export default async function Testimonials() {
  let testimonials: Testimonial[] = [];
  let error = "";

  try {
    testimonials = await prisma.testimonial.findMany({
      where: {
        status: "approved",
      },
      orderBy: [
        {
          featured: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        name: true,
        role: true,
        company: true,
        review: true,
        imageUrl: true,
        featured: true,
        status: true,
      },
    });
  } catch (err) {
    console.error(
      "TESTIMONIALS LOAD ERROR:",
      err
    );

    error = "Failed to load testimonials";
  }

  return (
    <section
      id="testimonials"
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
      <div className="pointer-events-none absolute left-0 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-14 text-center sm:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
            Testimonials
          </p>

          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            What People Say
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            Feedback from clients and people I have worked with.
          </p>

          <div className="mx-auto mt-5 h-[2px] w-24 bg-cyan-400" />
        </div>

        {/* Error */}
        {error && (
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400">
              Failed to load testimonials.
            </p>
          </div>
        )}

        {/* Empty */}
        {!error &&
          testimonials.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No testimonials found.
            </div>
          )}

        {/* Cards */}
        {!error &&
          testimonials.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {testimonials.map(
                (testimonial) => (
                  <article
                    key={testimonial.id}
                    className="
                      relative
                      overflow-hidden
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

                      sm:p-7
                    "
                  >
                    {/* Featured */}
                    {testimonial.featured && (
                      <div className="absolute right-4 top-4">
                        <span
                          className="
                            flex
                            items-center
                            gap-1
                            rounded-full
                            border
                            border-yellow-500/30
                            bg-yellow-500/10
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-yellow-700

                            dark:border-yellow-400/20
                            dark:bg-yellow-400/10
                            dark:text-yellow-300
                          "
                        >
                          <Star
                            size={12}
                            fill="currentColor"
                          />

                          Featured
                        </span>
                      </div>
                    )}

                    {/* Quote Icon */}
                    <div
                      className="
                        mb-6
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-cyan-500/20
                        bg-cyan-500/10
                        text-cyan-600

                        dark:border-cyan-400/20
                        dark:bg-cyan-400/10
                        dark:text-cyan-400
                      "
                    >
                      <Quote size={22} />
                    </div>

                    {/* Review */}
                    <p className="whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-gray-300 sm:text-base">
                      “{testimonial.review}”
                    </p>

                    {/* Person */}
                    <div className="mt-7 flex items-center gap-4 border-t border-black/10 pt-5 dark:border-white/10">
                      {testimonial.imageUrl ? (
                        <img
                          src={
                            testimonial.imageUrl
                          }
                          alt={
                            testimonial.name
                          }
                          className="
                            h-12
                            w-12
                            shrink-0
                            rounded-full
                            border
                            border-black/10
                            object-cover

                            dark:border-white/10
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-cyan-500/20
                            bg-cyan-500/10
                            font-bold
                            text-cyan-600

                            dark:border-cyan-400/20
                            dark:bg-cyan-400/10
                            dark:text-cyan-400
                          "
                        >
                          {testimonial.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h3>

                        <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}

                          {testimonial.company
                            ? ` · ${testimonial.company}`
                            : ""}
                        </p>
                      </div>
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