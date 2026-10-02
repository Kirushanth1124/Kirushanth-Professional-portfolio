"use client";

import { useEffect, useState } from "react";

interface Experience {
  id: string;
  year: string;
  title: string;
  company: string;
  location?: string | null;
  description: string;
}

export default function ExperienceAdmin() {
  const [list, setList] = useState<Experience[]>([]);

  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<string | null>(null);

  async function loadExperiences() {
    try {
      setFetching(true);
      setError("");

      const res = await fetch("/api/experience", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load experiences");
      }

      const data = await res.json();

      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("EXPERIENCE LOAD ERROR:", err);

      setError("Failed to load experiences");
      setList([]);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadExperiences();
  }, []);

  function resetForm() {
    setYear("");
    setTitle("");
    setCompany("");
    setLocation("");
    setDescription("");
    setEditId(null);
  }

  function validateForm() {
    if (!year.trim()) {
      alert("Year is required");
      return false;
    }

    if (!title.trim()) {
      alert("Title is required");
      return false;
    }

    if (!company.trim()) {
      alert("Company is required");
      return false;
    }

    if (!description.trim()) {
      alert("Description is required");
      return false;
    }

    return true;
  }

  async function addExperience() {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          year,
          title,
          company,
          location,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to add experience"
        );
      }

      resetForm();

      await loadExperiences();

      alert("Experience added successfully");
    } catch (err) {
      console.error("EXPERIENCE ADD ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to add experience"
      );
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item: Experience) {
    setEditId(item.id);
    setYear(item.year);
    setTitle(item.title);
    setCompany(item.company);
    setLocation(item.location || "");
    setDescription(item.description);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function updateExperience() {
    if (!editId) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/experience/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            year,
            title,
            company,
            location,
            description,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to update experience"
        );
      }

      resetForm();

      await loadExperiences();

      alert("Experience updated successfully");
    } catch (err) {
      console.error("EXPERIENCE UPDATE ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update experience"
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteExperience(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(
        `/api/experience/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to delete experience"
        );
      }

      await loadExperiences();

      alert("Experience deleted successfully");
    } catch (err) {
      console.error("EXPERIENCE DELETE ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete experience"
      );
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Admin Panel
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Experience Management
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Add, edit and delete your work experience.
          </p>
        </div>

        {/* Form */}
        <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8">
          <h2 className="mb-6 text-xl font-bold">
            {editId
              ? "Edit Experience"
              : "Add New Experience"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Year */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Year *
              </label>

              <input
                type="text"
                placeholder="2026 - Present"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Job Title *
              </label>

              <input
                type="text"
                placeholder="Intern Software Engineer"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Company */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Company *
              </label>

              <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Location
              </label>

              <input
                type="text"
                placeholder="Jaffna, Sri Lanka"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Description *
              </label>

              <textarea
                placeholder="Describe your work, responsibilities and achievements..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={6}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={
                editId
                  ? updateExperience
                  : addExperience
              }
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 font-bold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading
                ? "Processing..."
                : editId
                ? "Update Experience"
                : "Add Experience"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-gray-300 transition hover:bg-white/10 sm:w-auto"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* List */}
        {fetching ? (
          <div className="py-12 text-center text-gray-400">
            Loading experiences...
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-400">
            No experience found.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {list.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-1 font-medium text-cyan-400">
                      {item.company}
                    </p>
                  </div>

                  <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {item.year}
                  </span>
                </div>

                {item.location && (
                  <p className="mt-3 text-sm text-gray-500">
                    📍 {item.location}
                  </p>
                )}

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-400">
                  {item.description}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      startEdit(item)
                    }
                    className="w-full rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500 hover:text-white sm:w-auto"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteExperience(item.id)
                    }
                    className="w-full rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white sm:w-auto"
                  >
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