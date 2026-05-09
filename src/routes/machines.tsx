import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase, type Machine, type Category } from "@/lib/supabase";
import { PublicLayout } from "@/components/PublicLayout";
import { Search, Wrench, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/machines")({
  component: MachinesPage,
  validateSearch: (s: Record<string, unknown>) => ({ category: (s.category as string) || "" }),
  head: () => {
    const title = "Catálogo de Máquinas Pesadas | Carajás Máquinas — Parauapebas-PA";
    const description = "Catálogo completo de empilhadeiras, tratores e manipuladores telescópicos. Equipamentos para mineração, construção civil e agronegócio.";
    const url = "https://carajasmaquinas.lovable.app/machines";
    const image = "https://carajasmaquinas.lovable.app/icon-512.png";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function MachinesPage() {
  const { category } = Route.useSearch();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>(category || "");

  useEffect(() => {
    supabase.from("machines").select("*, category:categories(*)").order("created_at", { ascending: false }).then(({ data }) => setMachines(data as Machine[] || []));
    supabase.from("categories").select("*").order("name").then(({ data }) => setCategories(data || []));
  }, []);

  const filtered = useMemo(() => {
    return machines.filter((m) => {
      const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || (m.brand || "").toLowerCase().includes(search.toLowerCase());
      const matchCat = !selectedCat || m.category?.slug === selectedCat;
      return matchSearch && matchCat;
    });
  }, [machines, search, selectedCat]);

  return (
    <PublicLayout>
      <div className="bg-navy text-navy-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold">Catálogo de Máquinas</h1>
          <p className="text-white/70 mt-2">Encontre o equipamento ideal para seu projeto</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou marca..."
              className="w-full pl-10 pr-4 py-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-4 py-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">Nenhuma máquina encontrada.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <Link key={m.id} to="/machines/$id" params={{ id: m.id }} className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl hover:border-primary transition-all">
                <div className="aspect-[4/3] bg-secondary overflow-hidden">
                  {m.main_image_url ? (
                    <img src={m.main_image_url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Wrench className="h-12 w-12" /></div>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs text-primary font-semibold uppercase tracking-wider">{m.brand} {m.category?.name && `• ${m.category.name}`}</div>
                  <div className="font-bold text-lg mt-1">{m.name}</div>
                  <div className="text-sm text-muted-foreground">{m.model}</div>
                  <div className="mt-4 inline-flex items-center gap-1 text-primary font-semibold text-sm">
                    Ver detalhes <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
