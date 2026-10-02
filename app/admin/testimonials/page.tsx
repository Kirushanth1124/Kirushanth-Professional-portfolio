"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Star,
  Upload,
  Plus,
  Save,
  X,
  RefreshCcw,
  Quote,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string | null;
  review: string;
  imageUrl?: string | null;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  createdAt?: string;
}

type FilterType =
  | "all"
  | "pending"
  | "approved"
  | "rejected";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>([]);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [review, setReview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] =
    useState<
      "pending" | "approved" | "rejected"
    >("pending");

  const [featured, setFeatured] =
    useState(false);

  const [editId, setEditId] =
    useState<string | null>(null);

  const [filter, setFilter] =
    useState<FilterType>("all");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadTestimonials() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "/api/testimonials?admin=true",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to load testimonials"
        );
      }

      if (Array.isArray(data)) {
        setTestimonials(data);
      } else {
        setTestimonials([]);
      }
    } catch (err) {
      console.error(
        "TESTIMONIAL LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load testimonials"
      );

      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  function resetForm() {
    setName("");
    setRole("");
    setCompany("");
    setReview("");
    setImageUrl("");
    setStatus("pending");
    setFeatured(false);
    setEditId(null);
  }

  function startEdit(
    testimonial: Testimonial
  ) {
    setEditId(testimonial.id);
    setName(testimonial.name);
    setRole(testimonial.role);
    setCompany(
      testimonial.company || ""
    );
    setReview(testimonial.review);
    setImageUrl(
      testimonial.imageUrl || ""
    );
    setStatus(testimonial.status);
    setFeatured(
      Boolean(testimonial.featured)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function uploadTestimonialImage(
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

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Image must be less than 10MB"
      );

      e.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const formData =
        new FormData();

      formData.append("file", file);

      const res = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Image upload failed"
        );
      }

      if (!data.url) {
        throw new Error(
          "Image URL was not returned"
        );
      }

      setImageUrl(data.url);

      alert(
        "Image uploaded successfully"
      );
    } catch (err) {
      console.error(
        "TESTIMONIAL IMAGE UPLOAD ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Image upload failed"
      );
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (!role.trim()) {
      alert("Role is required");
      return;
    }

    if (!review.trim()) {
      alert("Review is required");
      return;
    }

    if (uploadingImage) {
      alert(
        "Please wait until image upload is complete"
      );
      return;
    }

    try {
      setSaving(true);

      if (editId) {
        const res = await fetch(
          `/api/testimonials/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              role,
              company,
              review,
              imageUrl,
              status,
              featured,
            }),
          }
        );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ||
              "Failed to update testimonial"
          );
        }

        alert(
          "Testimonial updated successfully"
        );
      } else {
        const res = await fetch(
          "/api/testimonials",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              role,
              company,
              review,
              imageUrl,
            }),
          }
        );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ||
              "Failed to add testimonial"
          );
        }

        alert(
          "Testimonial added as pending"
        );
      }

      resetForm();
      await loadTestimonials();
    } catch (err) {
      console.error(
        "TESTIMONIAL SAVE ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to save testimonial"
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(
    id: string,
    newStatus:
      | "pending"
      | "approved"
      | "rejected"
  ) {
    try {
      const res = await fetch(
        `/api/testimonials/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to update status"
        );
      }

      await loadTestimonials();
    } catch (err) {
      console.error(
        "TESTIMONIAL STATUS ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update status"
      );
    }
  }

  async function toggleFeatured(
    testimonial: Testimonial
  ) {
    try {
      const res = await fetch(
        `/api/testimonials/${testimonial.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            featured:
              !testimonial.featured,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to update featured status"
        );
      }

      await loadTestimonials();
    } catch (err) {
      console.error(
        "FEATURED UPDATE ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update testimonial"
      );
    }
  }

  async function deleteTestimonial(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this testimonial?"
      );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/testimonials/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to delete testimonial"
        );
      }

      if (editId === id) {
        resetForm();
      }

      await loadTestimonials();

      alert(
        "Testimonial deleted successfully"
      );
    } catch (err) {
      console.error(
        "TESTIMONIAL DELETE ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete testimonial"
      );
    }
  }

  const filteredTestimonials =
    useMemo(() => {
      if (filter === "all") {
        return testimonials;
      }

      return testimonials.filter(
        (item) =>
          item.status === filter
      );
    }, [testimonials, filter]);

  const pendingCount =
    testimonials.filter(
      (item) =>
        item.status === "pending"
    ).length;

  const approvedCount =
    testimonials.filter(
      (item) =>
        item.status === "approved"
    ).length;

  const rejectedCount =
    testimonials.filter(
      (item) =>
        item.status === "rejected"
    ).length;

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Admin Panel
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Testimonials
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Review, approve, reject and manage client testimonials.
            </p>
          </div>

          <button
            type="button"
            onClick={loadTestimonials}
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

        {/* Counts */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-gray-400">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold">
              {testimonials.length}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <p className="text-sm text-yellow-300">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
            <p className="text-sm text-green-300">
              Approved
            </p>

            <p className="mt-2 text-3xl font-bold">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-sm text-red-300">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-bold">
              {rejectedCount}
            </p>
          </div>
        </div>

        {/* Add / Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8"
        >
          <h2 className="mb-6 text-xl font-bold">
            {editId
              ? "Edit Testimonial"
              : "Add Testimonial Manually"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Client name"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Role *
              </label>

              <input
                type="text"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                placeholder="Founder / Manager / Client"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Company
              </label>

              <input
                type="text"
                value={company}
                onChange={(e) =>
                  setCompany(
                    e.target.value
                  )
                }
                placeholder="Company name"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Review *
              </label>

              <textarea
                value={review}
                onChange={(e) =>
                  setReview(
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Write testimonial..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Client Image
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) =>
                    setImageUrl(
                      e.target.value
                    )
                  }
                  placeholder="Uploaded image URL will appear here"
                  className="w-full flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
                />

                <label
                  className={`flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition ${
                    uploadingImage
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-cyan-400 hover:text-black"
                  }`}
                >
                  <Upload size={17} />

                  {uploadingImage
                    ? "Uploading..."
                    : "Choose Image"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={
                      uploadTestimonialImage
                    }
                    disabled={
                      uploadingImage
                    }
                    className="hidden"
                  />
                </label>
              </div>

              {imageUrl && (
                <div className="mt-4">
                  <img
                    src={imageUrl}
                    alt="Testimonial preview"
                    className="h-24 w-24 rounded-full border border-white/10 object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl("")
                    }
                    className="mt-3 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {editId && (
              <>
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target
                          .value as
                          | "pending"
                          | "approved"
                          | "rejected"
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-cyan-400"
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex cursor-pointer items-center gap-3 pb-3">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) =>
                        setFeatured(
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 accent-cyan-400"
                    />

                    <span className="text-sm text-gray-300">
                      Featured
                    </span>
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={
                saving ||
                uploadingImage
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 font-bold text-white disabled:opacity-50 sm:w-auto"
            >
              {editId ? (
                <Save size={18} />
              ) : (
                <Plus size={18} />
              )}

              {saving
                ? "Saving..."
                : editId
                ? "Update Testimonial"
                : "Add Testimonial"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-gray-300 sm:w-auto"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              "all",
              "pending",
              "approved",
              "rejected",
            ] as FilterType[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setFilter(item)
              }
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                filter === item
                  ? "bg-cyan-400 text-black"
                  : "border border-white/10 bg-white/5 text-gray-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-gray-400">
            Loading testimonials...
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <Quote
              size={40}
              className="mx-auto mb-4 text-gray-600"
            />

            <p className="text-gray-400">
              No testimonials found.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTestimonials.map(
              (testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    {testimonial.imageUrl ? (
                      <img
                        src={
                          testimonial.imageUrl
                        }
                        alt={
                          testimonial.name
                        }
                        className="h-14 w-14 shrink-0 rounded-full border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                        {testimonial.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">
                          {
                            testimonial.name
                          }
                        </h3>

                        {testimonial.featured && (
                          <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-300">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-cyan-400">
                        {
                          testimonial.role
                        }
                        {testimonial.company
                          ? ` · ${testimonial.company}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-400">
                    {testimonial.review}
                  </p>

                  <div className="mt-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        testimonial.status ===
                        "approved"
                          ? "bg-green-500/10 text-green-400"
                          : testimonial.status ===
                            "rejected"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-300"
                      }`}
                    >
                      {
                        testimonial.status
                      }
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {testimonial.status !==
                      "approved" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            testimonial.id,
                            "approved"
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-green-500/10 px-3 py-2 text-sm font-semibold text-green-400 hover:bg-green-500 hover:text-white"
                      >
                        <CheckCircle2
                          size={16}
                        />
                        Approve
                      </button>
                    )}

                    {testimonial.status !==
                      "rejected" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(
                            testimonial.id,
                            "rejected"
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <XCircle
                          size={16}
                        />
                        Reject
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        startEdit(
                          testimonial
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-500 hover:text-white"
                    >
                      <Pencil
                        size={16}
                      />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleFeatured(
                          testimonial
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500/10 px-3 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-500 hover:text-black"
                    >
                      <Star
                        size={16}
                      />
                      {testimonial.featured
                        ? "Unfeature"
                        : "Feature"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteTestimonial(
                          testimonial.id
                        )
                      }
                      className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2
                        size={16}
                      />
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}