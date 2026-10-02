"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCcw,
  Link as LinkIcon,
} from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
}

export default function SocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);

  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");

  const [editId, setEditId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadLinks() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/social-links", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load social links");
      }

      const data = await res.json();

      setLinks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("SOCIAL LINKS LOAD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load social links"
      );

      setLinks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLinks();
  }, []);

  function resetForm() {
    setPlatform("");
    setUrl("");
    setIcon("");
    setEditId(null);
  }

  function startEdit(link: SocialLink) {
    setEditId(link.id);
    setPlatform(link.platform);
    setUrl(link.url);
    setIcon(link.icon || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!platform.trim()) {
      alert("Platform is required");
      return;
    }

    if (!url.trim()) {
      alert("URL is required");
      return;
    }

    try {
      setSaving(true);

      const endpoint = editId
        ? `/api/social-links/${editId}`
        : "/api/social-links";

      const method = editId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
          url,
          icon,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            `Failed to ${editId ? "update" : "create"} social link`
        );
      }

      alert(
        editId
          ? "Social link updated successfully"
          : "Social link added successfully"
      );

      resetForm();
      await loadLinks();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to save social link"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteLink(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this social link?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/social-links/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to delete social link"
        );
      }

      if (editId === id) {
        resetForm();
      }

      await loadLinks();

      alert("Social link deleted successfully");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete social link"
      );
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Admin Panel
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Social Links
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage your portfolio social media links.
            </p>
          </div>

          <button
            type="button"
            onClick={loadLinks}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:opacity-50 sm:w-auto"
          >
            <RefreshCcw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8"
        >
          <h2 className="mb-6 text-xl font-bold">
            {editId
              ? "Edit Social Link"
              : "Add Social Link"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Platform *
              </label>

              <input
                type="text"
                value={platform}
                onChange={(e) =>
                  setPlatform(e.target.value)
                }
                placeholder="GitHub"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                URL *
              </label>

              <input
                type="url"
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                placeholder="https://github.com/username"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Icon Name
              </label>

              <input
                type="text"
                value={icon}
                onChange={(e) =>
                  setIcon(e.target.value)
                }
                placeholder="Optional"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 font-bold text-white transition hover:scale-[1.01] disabled:opacity-50 sm:w-auto"
            >
              {editId ? (
                <Save size={18} />
              ) : (
                <Plus size={18} />
              )}

              {saving
                ? "Saving..."
                : editId
                ? "Update Link"
                : "Add Link"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-gray-300 transition hover:bg-white/10 sm:w-auto"
              >
                <X size={18} />
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            Loading social links...
          </div>
        ) : links.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <LinkIcon
              size={36}
              className="mx-auto mb-4 text-gray-600"
            />

            <h2 className="text-lg font-semibold">
              No social links yet
            </h2>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-bold">
                  {link.platform}
                </h3>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block break-all text-sm text-cyan-400 hover:underline"
                >
                  {link.url}
                </a>

                {link.icon && (
                  <p className="mt-2 text-xs text-gray-500">
                    Icon: {link.icon}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      startEdit(link)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500 hover:text-white"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteLink(link.id)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}