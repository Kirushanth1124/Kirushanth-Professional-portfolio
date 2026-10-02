"use client";

import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  featured?: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setPageLoading(true);
      setError("");

      const res = await fetch("/api/projects", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("PROJECT LOAD ERROR:", err);
      setError("Failed to load projects");
      setProjects([]);
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setTechStack("");
    setGithubUrl("");
    setLiveUrl("");
    setImageUrl("");
    setFeatured(false);
    setEditId(null);
  }

  function startEdit(project: Project) {
    setEditId(project.id);

    setTitle(project.title);
    setDescription(project.description);
    setTechStack(project.techStack || "");
    setGithubUrl(project.githubUrl || "");
    setLiveUrl(project.liveUrl || "");
    setImageUrl(project.imageUrl || "");
    setFeatured(Boolean(project.featured));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function uploadProjectImage(
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
      alert("Please choose JPG, PNG, WEBP or GIF image");
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
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Image upload failed"
        );
      }

      if (!data.url) {
        throw new Error(
          "Upload succeeded but image URL was not returned"
        );
      }

      setImageUrl(data.url);

      alert("Project image uploaded successfully");
    } catch (err) {
      console.error(
        "PROJECT IMAGE UPLOAD ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Image upload failed"
      );
    } finally {
      setUploadingImage(false);

      // Allows selecting the same file again
      e.target.value = "";
    }
  }

  async function addProject() {
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          techStack,
          githubUrl,
          liveUrl,
          imageUrl,
          featured,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to create project"
        );
      }

      resetForm();
      await loadProjects();

      alert("Project added successfully");
    } catch (err) {
      console.error("PROJECT ADD ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to add project"
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateProject() {
    if (!editId) return;

    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/projects/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            techStack,
            githubUrl,
            liveUrl,
            imageUrl,
            featured,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to update project"
        );
      }

      resetForm();
      await loadProjects();

      alert("Project updated successfully");
    } catch (err) {
      console.error(
        "PROJECT UPDATE ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update project"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (uploadingImage) {
      alert(
        "Please wait until the image upload is complete"
      );
      return;
    }

    if (editId) {
      await updateProject();
    } else {
      await addProject();
    }
  }

  async function deleteProject(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/projects/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to delete project"
        );
      }

      if (editId === id) {
        resetForm();
      }

      await loadProjects();

      alert("Project deleted successfully");
    } catch (err) {
      console.error(
        "PROJECT DELETE ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete project"
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
            Project Management
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Add, edit, update and delete portfolio projects.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8"
        >
          <h2 className="mb-6 text-xl font-bold">
            {editId
              ? "Edit Project"
              : "Add New Project"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Project Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Portfolio Website"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Description *
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Project description"
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Tech Stack */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Tech Stack
              </label>

              <input
                type="text"
                value={techStack}
                onChange={(e) =>
                  setTechStack(e.target.value)
                }
                placeholder="Next.js, TypeScript, Prisma, Tailwind CSS"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                GitHub URL
              </label>

              <input
                type="url"
                value={githubUrl}
                onChange={(e) =>
                  setGithubUrl(e.target.value)
                }
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Live URL */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Live URL
              </label>

              <input
                type="url"
                value={liveUrl}
                onChange={(e) =>
                  setLiveUrl(e.target.value)
                }
                placeholder="https://example.com"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Project Image Upload */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Project Image
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) =>
                    setImageUrl(e.target.value)
                  }
                  placeholder="Uploaded image URL will appear here"
                  className="w-full flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
                />

                <label
                  className={`flex items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition ${
                    uploadingImage
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-cyan-400 hover:text-black"
                  }`}
                >
                  {uploadingImage
                    ? "Uploading..."
                    : "Choose Image"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={uploadProjectImage}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG, WEBP or GIF. Maximum 10MB.
              </p>

              {/* Image Preview */}
              {imageUrl && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium text-gray-500">
                    Image Preview
                  </p>

                  <div className="max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    <img
                      src={imageUrl}
                      alt="Project preview"
                      className="aspect-video w-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl("")
                    }
                    disabled={uploadingImage}
                    className="mt-3 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Featured */}
            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) =>
                    setFeatured(e.target.checked)
                  }
                  className="h-4 w-4 accent-cyan-400"
                />

                <span className="text-sm text-gray-300">
                  Featured Project
                </span>
              </label>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={
                loading ||
                uploadingImage
              }
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 font-bold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {uploadingImage
                ? "Waiting for Image..."
                : loading
                ? "Processing..."
                : editId
                ? "Update Project"
                : "Add Project"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={
                  loading ||
                  uploadingImage
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-gray-300 transition hover:bg-white/10 disabled:opacity-50 sm:w-auto"
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

        {/* Loading */}
        {pageLoading ? (
          <div className="py-12 text-center text-gray-400">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-400">
            No projects found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-left">
                      Image
                    </th>

                    <th className="p-4 text-left">
                      Title
                    </th>

                    <th className="p-4 text-left">
                      Description
                    </th>

                    <th className="p-4 text-left">
                      Tech Stack
                    </th>

                    <th className="p-4 text-left">
                      Featured
                    </th>

                    <th className="p-4 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-t border-white/10"
                    >
                      <td className="p-4">
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="h-16 w-24 rounded-lg border border-white/10 object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-gray-600">
                            No Image
                          </div>
                        )}
                      </td>

                      <td className="p-4 font-semibold">
                        {project.title}
                      </td>

                      <td className="max-w-sm p-4 text-sm text-gray-400">
                        {project.description}
                      </td>

                      <td className="p-4 text-sm text-gray-400">
                        {project.techStack || "-"}
                      </td>

                      <td className="p-4">
                        {project.featured ? (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                            Yes
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-500/10 px-3 py-1 text-xs text-gray-400">
                            No
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              startEdit(project)
                            }
                            className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500 hover:text-white"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteProject(
                                project.id
                              )
                            }
                            className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  {project.imageUrl && (
                    <div className="aspect-video overflow-hidden bg-black/30">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-bold">
                        {project.title}
                      </h3>

                      {project.featured && (
                        <span className="shrink-0 rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      {project.description}
                    </p>

                    {project.techStack && (
                      <p className="mt-3 break-words text-sm text-cyan-400">
                        {project.techStack}
                      </p>
                    )}

                    {(project.githubUrl ||
                      project.liveUrl) && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-300 hover:text-cyan-400"
                          >
                            GitHub
                          </a>
                        )}

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-cyan-400 hover:underline"
                          >
                            Live Project
                          </a>
                        )}
                      </div>
                    )}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(project)
                        }
                        className="w-full rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500 hover:text-white"
                      >
                        Edit Project
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProject(
                            project.id
                          )
                        }
                        className="w-full rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                      >
                        Delete Project
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}