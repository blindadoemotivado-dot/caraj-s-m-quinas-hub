import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase, type Machine } from "@/lib/supabase";
import { Package, Tags, Download, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({ machines: 0, categories: 0, downloads: 0, views: 0 });
  const [topMachines, setTopMachines] = useState<Machine[]>([]);

  useEffect(() => {
    (async () => {
      const [m, c] = await Promise.all([
        supabase.from("machines").select("view_count, download_count"),
        supabase.from("categories").select("id"),
      ]);
      const machines = (m.data || []) as { view_count: number; download_count: number }[];
      setStats({
        machines: machines.length,
        categories: (c.data || []).length,
        downloads: machines.reduce((s, x) => s + (x.download_count || 0), 0),
        views: machines.reduce((s, x) => s + (x.view_count || 0), 0),
      });
      const { data: top } = await supabase.from("machines").select("*").order("view_count", { ascending: false }).limit(5);
      setTopMachines((top as Machine[]) || []);
    })();
  }, []);

  const cards = [
    { label: "Máquinas", value: stats.machines, icon: Package },
    { label: "Categorias", value: stats.categories, icon: Tags },
    { label: "Downloads", value: stats.downloads, icon: Download },
    { label: "Visualizações", value: stats.views, icon: Eye },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{c.label}</div>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold mt-2">{c.value}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-bold text-lg mb-4">Máquinas mais visualizadas</h2>
        {topMachines.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma máquina cadastrada ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground border-b border-border">
              <tr>
                <th className="py-2">Nome</th>
                <th className="py-2">Marca</th>
                <th className="py-2 text-right">Views</th>
                <th className="py-2 text-right">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {topMachines.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium">{m.name}</td>
                  <td className="py-3">{m.brand}</td>
                  <td className="py-3 text-right">{m.view_count}</td>
                  <td className="py-3 text-right">{m.download_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
