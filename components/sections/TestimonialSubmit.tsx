"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function TestimonialSubmit() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [review, setReview] = useState("");

  // Honeypot field for bot protection
  const [website, setWebsite] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (
      !name.trim() ||
      !role.trim() ||
      !review.trim()
    ) {
      setError(
        "Please fill in your name, role and testimonial."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/testimonials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            role,
            company,
            review,
            website,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to submit testimonial"
        );
      }

      setSuccess(
        "Thank you! Your testimonial has been submitted for review."
      );

      setName("");
      setRole("");
      setCompany("");
      setReview("");
      setWebsite("");
    } catch (err) {
      console.error(
        "TESTIMONIAL SUBMIT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass = `
    w-full
    rounded-xl
    border
    border-black/10
    bg-white
    px-4
    py-3
    text-gray-900
    outline-none
    transition

    placeholder:text-gray-400
    focus:border-cyan-500/60

    disabled:opacity-50

    dark:border-white/10
    dark:bg-black/30
    dark:text-white
    dark:placeholder:text-gray-600
    dark:focus:border-cyan-400/60
  `;

  return (
    <section
      id="testimonial-submit"
      className="
        relative
        overflow-hidden
        bg-white
        px-4
        py-12
        text-gray-900
        transition-colors
        duration-300

        dark:bg-black
        dark:text-white

        sm:px-6
        sm:py-16
      "
    >
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-7 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 sm:text-sm">
            Share Your Experience
          </p>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Leave a Testimonial
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base sm:leading-7">
            Worked with me before? Share your experience.
            Your testimonial will be reviewed before it
            appears on the website.
          </p>

          <div className="mx-auto mt-4 h-[2px] w-20 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="
            relative
            rounded-3xl
            border
            border-black/10
            bg-black/[0.03]
            p-5
            shadow-xl
            backdrop-blur-xl
            transition-colors
            duration-300

            dark:border-white/10
            dark:bg-white/5
            dark:shadow-2xl

            sm:p-7
          "
        >
          {/* Honeypot - hidden from real users */}
          <div
            aria-hidden="true"
            className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="testimonial-website">
              Website
            </label>

            <input
              id="testimonial-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) =>
                setWebsite(e.target.value)
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {/* Name */}
            <div>
              <label
                htmlFor="testimonial-name"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Name *
              </label>

              <input
                id="testimonial-name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your name"
                disabled={loading}
                maxLength={100}
                className={inputClass}
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="testimonial-role"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Role *
              </label>

              <input
                id="testimonial-role"
                type="text"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                placeholder="Client, Developer, Manager..."
                disabled={loading}
                maxLength={120}
                className={inputClass}
              />
            </div>

            {/* Company */}
            <div className="sm:col-span-2">
              <label
                htmlFor="testimonial-company"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Company / Organization
                <span className="ml-1 text-gray-500">
                  (Optional)
                </span>
              </label>

              <input
                id="testimonial-company"
                type="text"
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
                placeholder="Company or organization"
                disabled={loading}
                maxLength={150}
                className={inputClass}
              />
            </div>

            {/* Review */}
            <div className="sm:col-span-2">
              <label
                htmlFor="testimonial-review"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Testimonial *
              </label>

              <textarea
                id="testimonial-review"
                value={review}
                onChange={(e) =>
                  setReview(e.target.value)
                }
                rows={5}
                maxLength={1000}
                placeholder="Tell me about your experience working with me..."
                disabled={loading}
                className={`${inputClass} resize-none`}
              />

              <p className="mt-2 text-right text-xs text-gray-500 dark:text-gray-600">
                {review.length}/1000
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />

              <span>{success}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-5
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-cyan-400
              via-blue-500
              to-purple-500
              px-6
              py-3.5
              font-bold
              text-white
              transition

              hover:scale-[1.01]

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Testimonial
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-gray-500">
            Testimonials are reviewed before being published.
          </p>
        </form>
      </div>
    </section>
  );
}