"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Honeypot field for bot protection
  const [website, setWebsite] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to send message"
        );
      }

      setSuccess(true);

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setWebsite("");
    } catch (err) {
      console.error("CONTACT ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      value: "jk.dhanush22@gmail.com",
      link: "mailto:jk.dhanush22@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "0723 250 281",
      link: "tel:+94723250281",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Maskeliya, Sri Lanka",
      link: "#",
    },
  ];

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
    focus:border-cyan-500

    disabled:cursor-not-allowed
    disabled:opacity-50

    dark:border-white/10
    dark:bg-black/20
    dark:text-white
    dark:placeholder:text-gray-600
    dark:focus:border-cyan-400
  `;

  return (
    <section
      id="contact"
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
        lg:px-8
      "
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-[110px]" />

      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-purple-500/10 blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 sm:text-sm">
            Get In Touch
          </p>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Contact Me
          </h2>

          <div className="mx-auto mt-4 h-[2px] w-20 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base sm:leading-7">
            Have a project, opportunity, or idea?
            Feel free to get in touch.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {contactItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.a
                key={item.title}
                href={item.link}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
                className="
                  rounded-3xl
                  border
                  border-black/10
                  bg-black/[0.03]
                  p-5
                  backdrop-blur-xl
                  transition-all
                  duration-300

                  hover:border-cyan-400/40
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.10)]

                  dark:border-white/10
                  dark:bg-white/5
                  dark:hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]
                "
              >
                <Icon
                  className="mx-auto mb-3 text-cyan-600 dark:text-cyan-400"
                  size={26}
                />

                <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                  {item.title}
                </h3>

                <p className="mt-2 break-words text-sm text-gray-600 dark:text-gray-400">
                  {item.value}
                </p>
              </motion.a>
            );
          })}
        </div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="
            relative
            mt-8
            space-y-4
            rounded-3xl
            border
            border-black/10
            bg-black/[0.03]
            p-5
            text-left
            backdrop-blur-xl
            transition-colors
            duration-300

            dark:border-white/10
            dark:bg-white/5

            sm:p-7
          "
        >
          {/* Honeypot - hidden from real users */}
          <div
            aria-hidden="true"
            className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="contact-website">
              Website
            </label>

            <input
              id="contact-website"
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

          <div className="grid gap-4 md:grid-cols-2">
            {/* Name */}
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Name
              </label>

              <input
                id="contact-name"
                type="text"
                required
                maxLength={100}
                disabled={loading}
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your Name"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Email
              </label>

              <input
                id="contact-email"
                type="email"
                required
                maxLength={200}
                disabled={loading}
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Your Email"
                className={inputClass}
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="contact-subject"
              className="mb-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Subject
            </label>

            <input
              id="contact-subject"
              type="text"
              maxLength={200}
              disabled={loading}
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              placeholder="Subject"
              className={inputClass}
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="contact-message"
              className="mb-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Message
            </label>

            <textarea
              id="contact-message"
              required
              rows={5}
              maxLength={5000}
              disabled={loading}
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Your Message"
              className={`${inputClass} resize-none`}
            />

            <p className="mt-2 text-right text-xs text-gray-500 dark:text-gray-600">
              {message.length}/5000
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
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
              py-3
              font-semibold
              text-white
              transition

              hover:scale-[1.01]

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Send size={18} />

            {loading
              ? "Sending..."
              : "Send Message"}
          </button>

          {/* Success */}
          {success && (
            <p className="text-center text-sm text-green-700 dark:text-green-400">
              ✅ Message sent successfully.
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </motion.form>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <a
            href="mailto:jk.dhanush22@gmail.com"
            className="
              rounded-full
              border
              border-black/10
              bg-black/5
              px-6
              py-3
              text-sm
              font-semibold
              text-gray-800
              transition

              hover:border-cyan-400
              hover:text-cyan-600

              dark:border-white/10
              dark:bg-white/5
              dark:text-white
              dark:hover:text-cyan-400
            "
          >
            Send Email
          </a>

          <a
            href="https://wa.me/94751232830"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition hover:scale-105"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}