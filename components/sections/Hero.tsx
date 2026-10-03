"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";

import ParticleBackground from "@/components/hero/ParticleBackground";
import FloatingShapes from "@/components/hero/FloatingShapes";
import SkillChips from "@/components/hero/SkillChips";
import ScrollIndicator from "@/components/hero/ScrollIndicator";

interface SiteSettings {
  siteName?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  profileImage?: string | null;
  resumeUrl?: string | null;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
}

async function downloadCv(url: string) {
  try {
    const separator = url.includes("?") ? "&" : "?";
    const freshUrl = `${url}${separator}t=${Date.now()}`;

    const response = await fetch(freshUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to download CV");
    }

    const blob = await response.blob();
    const blobUrl =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = blobUrl;
    link.download = "Kirushanth-CV.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(
      "CV DOWNLOAD ERROR:",
      error
    );
  }
}

export default function Hero() {
  const [settings, setSettings] =
    useState<SiteSettings>({
      siteName: "Kirushanth",
      heroTitle:
        "Intern Software Engineer",
      heroSubtitle:
        "Intern Software Engineer focused on building modern web applications, scalable software solutions, and practical digital products.",
      profileImage: "",
      resumeUrl: "",
    });

  const [socialLinks, setSocialLinks] =
    useState<SocialLink[]>([]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const settingsRes = await fetch(
          "/api/site-settings",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (
          active &&
          settingsRes.ok
        ) {
          const data =
            await settingsRes.json();

          setSettings((prev) => ({
            siteName:
              data.siteName ||
              prev.siteName,

            heroTitle:
              data.heroTitle ||
              prev.heroTitle,

            heroSubtitle:
              data.heroSubtitle ||
              prev.heroSubtitle,

            profileImage:
              data.profileImage ||
              prev.profileImage,

            resumeUrl:
              data.resumeUrl ||
              prev.resumeUrl,
          }));
        }
      } catch (error) {
        console.error(
          "SITE SETTINGS LOAD ERROR:",
          error
        );
      }

      try {
        const socialRes = await fetch(
          "/api/social-links",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (
          active &&
          socialRes.ok
        ) {
          const data =
            await socialRes.json();

          if (Array.isArray(data)) {
            setSocialLinks(data);
          }
        }
      } catch (error) {
        console.error(
          "SOCIAL LINKS LOAD ERROR:",
          error
        );
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const socialClass = `
    flex
    h-12
    w-12
    items-center
    justify-center
    rounded-full
    border
    border-black/10
    bg-black/5
    text-gray-600
    transition-colors
    duration-300

    hover:border-cyan-400/50
    hover:text-cyan-500

    dark:border-white/10
    dark:bg-white/5
    dark:text-gray-400
    dark:hover:border-cyan-400/40
    dark:hover:text-cyan-400
  `;

  const name =
    settings.siteName?.trim() ||
    "Kirushanth";

  const heroTitle =
    settings.heroTitle?.trim() ||
    "Intern Software Engineer";

  const heroSubtitle =
    settings.heroSubtitle?.trim() ||
    "Intern Software Engineer focused on building modern web applications, scalable software solutions, and practical digital products.";

  function getSocialIcon(
    platform: string
  ) {
    const normalized =
      platform.toLowerCase().trim();

    if (
      normalized === "github" ||
      normalized.includes("github")
    ) {
      return <FaGithub size={22} />;
    }

    if (
      normalized === "linkedin" ||
      normalized.includes("linkedin")
    ) {
      return <FaLinkedin size={22} />;
    }

    if (
      normalized === "x" ||
      normalized === "twitter" ||
      normalized.includes("twitter")
    ) {
      return <FaXTwitter size={22} />;
    }

    if (
      normalized.includes("facebook")
    ) {
      return <FaFacebook size={22} />;
    }

    if (
      normalized.includes("instagram")
    ) {
      return <FaInstagram size={22} />;
    }

    if (
      normalized.includes("youtube")
    ) {
      return <FaYoutube size={22} />;
    }

    return <ArrowRight size={20} />;
  }

  return (
    <section
      id="hero"
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-white
        px-4
        pb-20
        pt-32
        text-gray-900
        transition-colors
        duration-300

        dark:bg-[#050505]
        dark:text-white

        sm:px-6
        sm:pt-36
      "
    >
      {/* Decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none"
      >
        <ParticleBackground />
        <FloatingShapes />
      </div>

      {/* Main content is always visible */}
      <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
        {/* Badge */}
        <div
          className="
            mx-auto
            mb-8
            w-fit
            rounded-full
            border
            border-cyan-500/30
            bg-cyan-500/5
            px-4
            py-2
            text-xs
            font-medium
            text-cyan-600

            dark:text-cyan-400

            sm:px-5
            sm:text-sm
          "
        >
          🟢 Available for New Opportunities
        </div>

        {/* Profile Image */}
        {settings.profileImage && (
          <div
            className="
              mx-auto
              mb-7
              h-28
              w-28
              overflow-hidden
              rounded-full
              border
              border-cyan-500/30
              bg-black/5
              p-1

              dark:border-cyan-400/30
              dark:bg-white/5

              sm:h-32
              sm:w-32
            "
          >
            <img
              src={settings.profileImage}
              alt={`${name} profile`}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        )}

        {/* Intro */}
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.3em]
            text-gray-600

            dark:text-gray-500

            sm:text-sm
            md:text-base
          "
        >
          Hello, I&apos;m
        </p>

        {/* Name */}
        <h1
          className="
            mt-5
            break-words
            text-5xl
            font-extrabold
            leading-none
            tracking-tight

            sm:text-6xl
            md:text-8xl
          "
        >
          <span className="text-cyan-500 dark:text-cyan-400">
            {name}
          </span>
        </h1>

        {/* Static role - old Safari safe */}
        <div
          className="
            mt-8
            min-h-12
            text-lg
            font-light
            text-gray-700

            dark:text-gray-300

            sm:text-xl
            md:text-3xl
          "
        >
          {heroTitle}
        </div>

        {/* Divider */}
        <div className="mx-auto mt-6 h-[2px] w-24 rounded-full bg-cyan-400" />

        {/* Skills */}
        <div>
          <SkillChips />
        </div>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-8
            max-w-2xl
            px-2
            text-base
            leading-relaxed
            text-gray-600

            dark:text-gray-400

            sm:text-lg
          "
        >
          {heroSubtitle}
        </p>

        {/* Buttons */}
        <div
          className="
            mt-10
            flex
            flex-col
            items-center
            justify-center
            gap-4

            sm:flex-row
            sm:flex-wrap
            sm:gap-5
          "
        >
          <a
            href="#projects"
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-cyan-500
              px-8
              py-4
              font-bold
              text-white
              transition-colors

              hover:bg-cyan-600

              sm:w-auto
            "
          >
            View My Work

            <ArrowRight className="h-5 w-5" />
          </a>

          <a
            href="#contact"
            className="
              w-full
              rounded-full
              border
              border-black/10
              bg-black/5
              px-8
              py-4
              font-bold
              text-gray-900
              transition-colors

              hover:bg-black/10

              dark:border-white/10
              dark:bg-white/5
              dark:text-white
              dark:hover:bg-white/10

              sm:w-auto
            "
          >
            Get In Touch
          </a>

          {settings.resumeUrl && (
            <button
              type="button"
              onClick={() =>
                downloadCv(
                  settings.resumeUrl!
                )
              }
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-cyan-500/30
                bg-cyan-500/5
                px-8
                py-4
                font-bold
                text-cyan-600
                transition-colors

                hover:bg-cyan-500/10

                dark:border-cyan-400/20
                dark:bg-cyan-400/5
                dark:text-cyan-400
                dark:hover:bg-cyan-400/10

                sm:w-auto
              "
            >
              <Download size={18} />
              Download CV
            </button>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
            {socialLinks.map(
              (social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    social.platform
                  }
                  title={social.platform}
                  className={socialClass}
                >
                  {getSocialIcon(
                    social.platform
                  )}
                </a>
              )
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-10 left-1/2 h-px w-full -translate-x-1/2 bg-cyan-500/20" />

      <ScrollIndicator />
    </section>
  );
}