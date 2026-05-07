import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Package, Tags, LogOut, ExternalLink } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/admin/login" });
  }, [loading, user, nav]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/machines", label: "Máquinas", icon: Package },
    { to: "/admin/categories", label: "Categorias", icon: Tags },
  ];

  async function logout() {
    await supabase.auth.signOut();
    nav({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-secondary">
      <aside className="md:w-64 bg-navy text-navy-foreground md:min-h-screen">
        <div className="p-6 border-b border-white/10">
          <div className="font-bold text-lg">Carajás <span className="text-primary">Admin</span></div>
        </div>
        <nav className="p-3 flex md:flex-col gap-1 overflow-x-auto">
          {links.map((l) => {
            const Icon = l.icon;
            const active = loc.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-3 py-2 rounded-md whitespace-nowrap ${active ? "bg-primary text-primary-foreground" : "hover:bg-white/5"}`}>
                <Icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 md:absolute md:bottom-0 md:w-64 md:border-t md:border-white/10">
          <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 text-sm">
            <ExternalLink className="h-4 w-4" /> Ver site
          </a>
          <button onClick={logout} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 text-sm">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
