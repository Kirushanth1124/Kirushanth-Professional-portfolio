"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  User,
  Clock3,
  CheckCircle2,
  RefreshCcw,
  Trash2,
  MailOpen,
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/messages", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load messages");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Messages API did not return an array"
        );
      }

      setMessages(data);
    } catch (err) {
      console.error("MESSAGE LOAD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load messages"
      );

      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function toggleRead(message: Message) {
    try {
      setActionLoading(message.id);

      const res = await fetch(
        `/api/messages/${message.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isRead: !message.isRead,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to update message"
        );
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? {
                ...item,
                isRead: !item.isRead,
              }
            : item
        )
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update message"
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteMessage(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);

      const res = await fetch(
        `/api/messages/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to delete message"
        );
      }

      setMessages((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete message"
      );
    } finally {
      setActionLoading(null);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Admin Panel
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Messages
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              View and manage messages submitted through your contact form.
            </p>
          </div>

          <button
            type="button"
            onClick={loadMessages}
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

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-gray-400">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <Mail
              size={36}
              className="mx-auto mb-4 text-gray-600"
            />

            <h2 className="text-lg font-semibold text-white">
              No messages yet
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Contact form messages will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`rounded-3xl border p-5 backdrop-blur-xl sm:p-6 ${
                  item.isRead
                    ? "border-white/10 bg-white/5"
                    : "border-yellow-400/20 bg-yellow-400/5"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <User
                        size={18}
                        className="shrink-0 text-cyan-400"
                      />

                      <h2 className="truncate text-lg font-bold">
                        {item.name}
                      </h2>
                    </div>

                    <a
                      href={`mailto:${item.email}`}
                      className="mt-2 block break-all text-sm text-cyan-400 hover:underline"
                    >
                      {item.email}
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {item.isRead ? (
                      <span className="flex items-center gap-1 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-400">
                        <CheckCircle2 size={13} />
                        Read
                      </span>
                    ) : (
                      <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
                        New
                      </span>
                    )}

                    <span className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-400">
                      <Clock3 size={13} />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Subject
                  </p>

                  <p className="mt-2 font-medium text-white">
                    {item.subject?.trim()
                      ? item.subject
                      : "No subject"}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-300">
                    {item.message}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => toggleRead(item)}
                    disabled={actionLoading === item.id}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-black disabled:opacity-50 sm:w-auto"
                  >
                    <MailOpen size={17} />

                    {item.isRead
                      ? "Mark as Unread"
                      : "Mark as Read"}
                  </button>

                  <a
                    href={`mailto:${item.email}?subject=Re: ${
                      item.subject || "Portfolio Enquiry"
                    }`}
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:scale-[1.01] sm:w-auto"
                  >
                    Reply by Email
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      deleteMessage(item.id)
                    }
                    disabled={actionLoading === item.id}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-50 sm:w-auto"
                  >
                    <Trash2 size={17} />

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