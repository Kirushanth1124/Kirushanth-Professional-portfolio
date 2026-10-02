"use client";

import { useEffect, useState } from "react";
import {
  Save,
  RefreshCcw,
  Image as ImageIcon,
  FileText,
  Type,
  AlignLeft,
  Upload,
  ExternalLink,
  Trash2,
} from "lucide-react";

interface SiteSettings {
  id?: string;
  siteName?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  aboutText?: string | null;
  profileImage?: string | null;
  resumeUrl?: string | null;
  updatedAt?: string;
}

export default function SiteSettingsPage() {
  const [siteName, setSiteName] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingProfile, setUploadingProfile] =
    useState(false);

  const [uploadingResume, setUploadingResume] =
    useState(false);

  const [error, setError] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/site-settings", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          "Failed to load site settings"
        );
      }

      const data: SiteSettings =
        await res.json();

      setSiteName(data.siteName || "");
      setHeroTitle(data.heroTitle || "");
      setHeroSubtitle(data.heroSubtitle || "");
      setAboutText(data.aboutText || "");
      setProfileImage(data.profileImage || "");
      setResumeUrl(data.resumeUrl || "");
    } catch (err) {
      console.error(
        "SITE SETTINGS LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load site settings"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function uploadProfileImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please choose JPG, PNG, WEBP or GIF image"
      );

      e.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image must be less than 10MB");

      e.target.value = "";
      return;
    }

    try {
      setUploadingProfile(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Profile image upload failed"
        );
      }

      if (!data.url) {
        throw new Error(
          "Profile image URL was not returned"
        );
      }

      setProfileImage(data.url);

      alert(
        "Profile image uploaded successfully"
      );
    } catch (err) {
      console.error(
        "PROFILE IMAGE UPLOAD ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Profile image upload failed"
      );
    } finally {
      setUploadingProfile(false);

      e.target.value = "";
    }
  }

  async function uploadResume(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please choose a PDF file");

      e.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Resume PDF must be less than 10MB");

      e.target.value = "";
      return;
    }

    try {
      setUploadingResume(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Resume upload failed"
        );
      }

      if (!data.url) {
        throw new Error(
          "Resume URL was not returned"
        );
      }

      setResumeUrl(data.url);

      alert("Resume uploaded successfully");
    } catch (err) {
      console.error(
        "RESUME UPLOAD ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Resume upload failed"
      );
    } finally {
      setUploadingResume(false);

      e.target.value = "";
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      uploadingProfile ||
      uploadingResume
    ) {
      alert(
        "Please wait until file upload is complete"
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = await fetch(
        "/api/site-settings",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            siteName,
            heroTitle,
            heroSubtitle,
            aboutText,
            profileImage,
            resumeUrl,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to update site settings"
        );
      }

      alert(
        "Site settings updated successfully"
      );

      await loadSettings();
    } catch (err) {
      console.error(
        "SITE SETTINGS SAVE ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update site settings"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Admin Panel
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Site Settings
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage your portfolio homepage
              information.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSettings}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:opacity-50 sm:w-auto"
          >
            <RefreshCcw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-gray-400">
            Loading site settings...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8"
          >
            <div className="grid gap-6">
              {/* Site Name */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                  <Type
                    size={16}
                    className="text-cyan-400"
                  />

                  Site Name
                </label>

                <input
                  type="text"
                  value={siteName}
                  onChange={(e) =>
                    setSiteName(
                      e.target.value
                    )
                  }
                  placeholder="Kirushanth"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              {/* Hero Title */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                  <Type
                    size={16}
                    className="text-cyan-400"
                  />

                  Hero Title
                </label>

                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) =>
                    setHeroTitle(
                      e.target.value
                    )
                  }
                  placeholder="Intern Software Engineer"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              {/* Hero Subtitle */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                  <AlignLeft
                    size={16}
                    className="text-cyan-400"
                  />

                  Hero Subtitle
                </label>

                <textarea
                  value={heroSubtitle}
                  onChange={(e) =>
                    setHeroSubtitle(
                      e.target.value
                    )
                  }
                  placeholder="Building modern software, scalable applications, and digital solutions."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              {/* About */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                  <AlignLeft
                    size={16}
                    className="text-cyan-400"
                  />

                  About Text
                </label>

                <textarea
                  value={aboutText}
                  onChange={(e) =>
                    setAboutText(
                      e.target.value
                    )
                  }
                  placeholder="Write your professional introduction..."
                  rows={7}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              {/* Profile Image */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                  <ImageIcon
                    size={16}
                    className="text-cyan-400"
                  />

                  Profile Image
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={profileImage}
                    onChange={(e) =>
                      setProfileImage(
                        e.target.value
                      )
                    }
                    placeholder="Uploaded image URL will appear here"
                    className="w-full flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
                  />

                  <label
                    className={`flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition ${
                      uploadingProfile
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-cyan-400 hover:text-black"
                    }`}
                  >
                    <Upload size={17} />

                    {uploadingProfile
                      ? "Uploading..."
                      : "Choose Image"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={
                        uploadProfileImage
                      }
                      disabled={
                        uploadingProfile
                      }
                      className="hidden"
                    />
                  </label>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG, WEBP or GIF.
                  Maximum 10MB.
                </p>

                {profileImage && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs text-gray-500">
                      Preview
                    </p>

                    <img
                      src={profileImage}
                      alt="Profile preview"
                      className="h-36 w-36 rounded-2xl border border-white/10 object-cover object-top"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setProfileImage("")
                      }
                      disabled={
                        uploadingProfile
                      }
                      className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={15} />

                      Remove Image
                    </button>
                  </div>
                )}
              </div>

              {/* Resume */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                  <FileText
                    size={16}
                    className="text-cyan-400"
                  />

                  Resume / CV
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={resumeUrl}
                    onChange={(e) =>
                      setResumeUrl(
                        e.target.value
                      )
                    }
                    placeholder="Uploaded CV URL will appear here"
                    className="w-full flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
                  />

                  <label
                    className={`flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition ${
                      uploadingResume
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-cyan-400 hover:text-black"
                    }`}
                  >
                    <Upload size={17} />

                    {uploadingResume
                      ? "Uploading..."
                      : "Choose PDF"}

                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={
                        uploadResume
                      }
                      disabled={
                        uploadingResume
                      }
                      className="hidden"
                    />
                  </label>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  PDF only. Maximum 10MB.
                </p>

                {resumeUrl && (
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-black"
                    >
                      <ExternalLink
                        size={17}
                      />

                      View Resume
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        setResumeUrl("")
                      }
                      disabled={
                        uploadingResume
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={16} />

                      Remove Resume
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={
                saving ||
                uploadingProfile ||
                uploadingResume
              }
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 font-bold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Save size={18} />

              {uploadingProfile ||
              uploadingResume
                ? "Waiting for Upload..."
                : saving
                ? "Saving..."
                : "Save Settings"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}