import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Mail,
  Menu,
  Users,
  ChevronLeft,
  ChevronRight,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname.endsWith("/login");
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("cfsmcca_admin_sidebar");
    if (saved === "collapsed") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("cfsmcca_admin_sidebar", next ? "collapsed" : "expanded");
      }
      return next;
    });
  };

  const navItems = useMemo(
    () => [
      { label: "Messages", to: "/admin/messages", icon: Mail },
      { label: "Registrations", to: "/admin/registrations", icon: Users },
      { label: "News", to: "/admin/news", icon: Newspaper }
    ],
    []
  );

  if (isLogin) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container section-compact">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card transition-transform md:static md:h-screen md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-20" : "md:w-64"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="logo-circle bg-background overflow-hidden">
              <img
                src="/photos/LOGO.jpeg"
                alt="CFSMCCA logo"
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className={cn("min-w-0", collapsed && "md:hidden")}>
              <p className="text-sm font-semibold">CFSMCCA Admin</p>
              <p className="text-xs text-muted-foreground">Administration Portal</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-muted",
                    isActive && "bg-muted text-foreground"
                  )
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span className={cn("truncate", collapsed && "md:hidden")}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-border px-4 py-4">
          <Button asChild size="sm" variant="outline" className={cn(collapsed && "md:w-10 md:px-0")}>
            <Link to="/">
              <span className={cn(collapsed && "md:hidden")}>Back to site</span>
              <span className={cn("hidden", collapsed && "md:inline")}>←</span>
            </Link>
          </Button>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col md:ml-0">
        <div className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <p className="text-sm font-semibold">CFSMCCA Admin</p>
            <span className="w-9" />
          </div>
        </div>
        <main className="flex-1 px-6 py-6 md:px-10">
          <div className="w-full min-w-0 max-w-none">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
