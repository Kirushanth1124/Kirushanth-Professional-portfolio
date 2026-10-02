"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  BriefcaseBusiness,
  Award,
  Quote,
  MessageSquare,
  Settings,
  Share2,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Code2,
  },
  {
    label: "Experience",
    href: "/admin/experience",
    icon: BriefcaseBusiness,
  },
  {
    label: "Certificates",
    href: "/admin/certificates",
    icon: Award,
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: Quote,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Site Settings",
    href: "/admin/site-settings",
    icon: Settings,
  },
  {
    label: "Social Links",
    href: "/admin/social-links",
    icon: Share2,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] =
    useState(false);

  const isLoginPage =
    pathname === "/admin/login";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmLogout) return;

    try {
      setLogoutLoading(true);

      const res = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );

      alert("Logout failed");
    } finally {
      setLogoutLoading(false);
    }
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Admin Panel
          </p>

          <h2 className="mt-1 text-lg font-bold">
            Kirushanth
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-gray-400 md:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setOpen(false)
                }
                className={`
                  flex items-center gap-3
                  rounded-xl
                  px-4 py-3
                  text-sm font-medium
                  transition-all

                  ${
                    active
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={19}
                  className="shrink-0"
                />

                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
        >
          <LogOut size={19} />

          {logoutLoading
            ? "Logging out..."
            : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-black/95 px-4 backdrop-blur-xl md:hidden">
        <p className="text-sm font-bold text-cyan-400">
          Kirushanth Admin
        </p>

        <button
          type="button"
          onClick={() =>
            setOpen((current) => !current)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-400"
        >
          {open ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </header>

      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-0
          z-50
          w-[280px]
          max-w-[85vw]
          border-r border-white/10
          bg-[#080808]
          transition-transform
          duration-300
          md:hidden

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="
          hidden
          md:fixed
          md:bottom-4
          md:left-4
          md:top-4
          md:block
          md:w-[260px]
          md:overflow-hidden
          md:rounded-3xl
          md:border
          md:border-white/10
          md:bg-[#080808]
          md:shadow-2xl
        "
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div
        className="
          min-h-screen
          pt-16
          md:pl-[292px]
          md:pt-0
        "
      >
        <div className="min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}