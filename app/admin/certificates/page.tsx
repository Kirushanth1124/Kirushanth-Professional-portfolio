"use client";

import { useEffect, useState } from "react";
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCcw,
  ExternalLink,
  Upload,
} from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  credential?: string | null;
  imageUrl?: string | null;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [credential, setCredential] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [editId, setEditId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  async function loadCertificates() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/certificates", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load certificates");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setCertificates(data);
      } else {
        setCertificates([]);
      }
    } catch (err) {
      console.error("CERTIFICATES LOAD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load certificates"
      );

      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCertificates();
  }, []);

  function resetForm() {
    setTitle("");
    setIssuer("");
    setIssuedDate("");
    setCredential("");
    setImageUrl("");
    setEditId(null);
  }

  function startEdit(certificate: Certificate) {
    setEditId(certificate.id);
    setTitle(certificate.title);
    setIssuer(certificate.issuer);
    setIssuedDate(certificate.issuedDate);
    setCredential(certificate.credential || "");
    setImageUrl(certificate.imageUrl || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function uploadCertificateImage(
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
          data.error || "Certificate image upload failed"
        );
      }

      if (!data.url) {
        throw new Error(
          "Upload succeeded but image URL was not returned"
        );
      }

      setImageUrl(data.url);

      alert("Certificate image uploaded successfully");
    } catch (err) {
      console.error("CERTIFICATE IMAGE UPLOAD ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Certificate image upload failed"
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

    if (uploadingImage) {
      alert("Please wait until image upload is complete");
      return;
    }

    if (!title.trim()) {
      alert("Certificate title is required");
      return;
    }

    if (!issuer.trim()) {
      alert("Issuer is required");
      return;
    }

    if (!issuedDate.trim()) {
      alert("Issued date is required");
      return;
    }

    try {
      setSaving(true);

      const endpoint = editId
        ? `/api/certificates/${editId}`
        : "/api/certificates";

      const method = editId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          issuer,
          issuedDate,
          credential,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            `Failed to ${
              editId ? "update" : "create"
            } certificate`
        );
      }

      alert(
        editId
          ? "Certificate updated successfully"
          : "Certificate added successfully"
      );

      resetForm();
      await loadCertificates();
    } catch (err) {
      console.error("CERTIFICATE SAVE ERROR:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to save certificate"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCertificate(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certificate?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/certificates/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to delete certificate"
        );
      }

      if (editId === id) {
        resetForm();
      }

      await loadCertificates();

      alert("Certificate deleted successfully");
    } catch (err) {
      console.error(
        "CERTIFICATE DELETE ERROR:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete certificate"
      );
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Admin Panel
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Certificates
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Add and manage your professional certificates.
            </p>
          </div>

          <button
            type="button"
            onClick={loadCertificates}
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
          className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8"
        >
          <h2 className="mb-6 text-xl font-bold">
            {editId
              ? "Edit Certificate"
              : "Add New Certificate"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Certificate Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Full Stack Web Development"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Issuer */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Issuer *
              </label>

              <input
                type="text"
                value={issuer}
                onChange={(e) =>
                  setIssuer(e.target.value)
                }
                placeholder="Coursera / University / Institute"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Issued Date */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Issued Date *
              </label>

              <input
                type="text"
                value={issuedDate}
                onChange={(e) =>
                  setIssuedDate(e.target.value)
                }
                placeholder="September 2026"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Credential */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Credential URL / ID
              </label>

              <input
                type="text"
                value={credential}
                onChange={(e) =>
                  setCredential(e.target.value)
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Certificate Image */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Certificate Image
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) =>
                    setImageUrl(e.target.value)
                  }
                  placeholder="Uploaded certificate image URL will appear here"
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
                    onChange={uploadCertificateImage}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG, WEBP or GIF. Maximum 10MB.
              </p>

              {imageUrl && (
                <div className="mt-5">
                  <p className="mb-2 text-xs text-gray-500">
                    Preview
                  </p>

                  <div className="max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    <img
                      src={imageUrl}
                      alt="Certificate preview"
                      className="h-auto w-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl("")
                    }
                    disabled={uploadingImage}
                    className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={15} />
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 font-bold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {editId ? (
                <Save size={18} />
              ) : (
                <Plus size={18} />
              )}

              {uploadingImage
                ? "Waiting for Image..."
                : saving
                ? "Saving..."
                : editId
                ? "Update Certificate"
                : "Add Certificate"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving || uploadingImage}
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

        {/* Certificates */}
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            Loading certificates...
          </div>
        ) : certificates.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <Award
              size={40}
              className="mx-auto mb-4 text-gray-600"
            />

            <h2 className="text-lg font-semibold">
              No certificates yet
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Add your first certificate using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                {/* Image */}
                {certificate.imageUrl ? (
                  <div className="aspect-video overflow-hidden bg-black/30">
                    <img
                      src={certificate.imageUrl}
                      alt={certificate.title}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-black/30">
                    <Award
                      size={48}
                      className="text-gray-700"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold">
                    {certificate.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-cyan-400">
                    {certificate.issuer}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Issued: {certificate.issuedDate}
                  </p>

                  {certificate.credential && (
                    <a
                      href={certificate.credential}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-2 break-all text-sm text-cyan-400 hover:underline"
                    >
                      View Credential
                      <ExternalLink size={14} />
                    </a>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(certificate)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500 hover:text-white"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteCertificate(
                          certificate.id
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}