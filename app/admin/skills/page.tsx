"use client";

import { useEffect, useState } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  icon?: string | null;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [icon, setIcon] = useState("");

  const [editId, setEditId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSkills() {
    try {
      setPageLoading(true);
      setError("");

      const res = await fetch("/api/skills", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load skills");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setSkills(data);
      } else {
        setSkills([]);
      }
    } catch (err) {
      console.error("SKILLS LOAD ERROR:", err);
      setError("Failed to load skills");
      setSkills([]);
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  function resetForm() {
    setName("");
    setCategory("");
    setLevel("Beginner");
    setIcon("");
    setEditId(null);
  }

  function startEdit(skill: Skill) {
    setEditId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setLevel(skill.level);
    setIcon(skill.icon || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function addSkill() {
    if (!name.trim()) {
      alert("Skill name is required");
      return;
    }

    if (!category.trim()) {
      alert("Category is required");
      return;
    }

    if (!level.trim()) {
      alert("Level is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          level,
          icon,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to create skill"
        );
      }

      resetForm();
      await loadSkills();

      alert("Skill added successfully");
    } catch (err) {
      console.error("SKILL ADD ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to add skill"
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateSkill() {
    if (!editId) return;

    if (!name.trim()) {
      alert("Skill name is required");
      return;
    }

    if (!category.trim()) {
      alert("Category is required");
      return;
    }

    if (!level.trim()) {
      alert("Level is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/skills/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            category,
            level,
            icon,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to update skill"
        );
      }

      resetForm();
      await loadSkills();

      alert("Skill updated successfully");
    } catch (err) {
      console.error("SKILL UPDATE ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update skill"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (editId) {
      await updateSkill();
    } else {
      await addSkill();
    }
  }

  async function deleteSkill(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(
        `/api/skills/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to delete skill"
        );
      }

      if (editId === id) {
        resetForm();
      }

      await loadSkills();

      alert("Skill deleted successfully");
    } catch (err) {
      console.error("SKILL DELETE ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete skill"
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
            Skills Management
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Add, edit, update and delete your technical skills.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8"
        >
          <h2 className="mb-6 text-xl font-bold">
            {editId
              ? "Edit Skill"
              : "Add New Skill"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Skill Name */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Skill Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Next.js"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Category *
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                placeholder="Frontend"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Level */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Level *
              </label>

              <select
                value={level}
                onChange={(e) =>
                  setLevel(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              >
                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>

                <option value="Expert">
                  Expert
                </option>
              </select>
            </div>

            {/* Icon */}
            <div>
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

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 font-bold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading
                ? "Processing..."
                : editId
                ? "Update Skill"
                : "Add Skill"}
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
        </form>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Content */}
        {pageLoading ? (
          <div className="py-12 text-center text-gray-400">
            Loading skills...
          </div>
        ) : skills.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-400">
            No skills found.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold">
                    {skill.name}
                  </h3>

                  <span className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                    {skill.level}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  Category:{" "}
                  <span className="text-white">
                    {skill.category}
                  </span>
                </p>

                {skill.icon && (
                  <p className="mt-2 break-words text-sm text-gray-500">
                    Icon: {skill.icon}
                  </p>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      startEdit(skill)
                    }
                    className="w-full rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500 hover:text-white"
                  >
                    Edit Skill
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteSkill(skill.id)
                    }
                    className="w-full rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    Delete Skill
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