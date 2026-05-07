import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Machine, type Category, WHATSAPP_NUMBER } from "@/lib/supabase";
import { PublicLayout } from "@/components/PublicLayout";
import { ArrowRight, MessageCircle, Wrench } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Carajás Máquinas — Máquinas e Equipamentos Pesados" },
      { name: "description", content: "Conheça nossa linha completa de máquinas e equipamentos. Catálogo técnico, especificações e orçamentos." },
    ],
  }),
});

function Home() {
  const [featured, setFeatured] = useState<Machine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase.from("machines").select("*").eq("is_featured", true).limit(6).then(({ data }) => setFeatured(data || []));
    supabase.from("categories").select("*").order("name").then(({ data }) => setCategories(data || []));
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-navy text-navy-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,_var(--color-primary),_transparent_60%)]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6">
              <Wrench className="h-4 w-4" /> Catálogo Técnico Digital
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Conheça nossa linha completa de <span className="text-primary">máquinas e equipamentos</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">
              Soluções robustas em máquinas pesadas para mineração, construção civil e indústria. Especificações técnicas completas e atendimento especializado.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/machines" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:opacity-90">
                Ver Máquinas <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de solicitar um orçamento.")}`} target="_blank" rel="noreferrer" className="bg-white text-navy px-6 py-3 rounded-md font-semibold hover:bg-white/90">
                Solicitar Orçamento
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="border border-white/30 px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-white/10">
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Máquinas em destaque</h2>
              <p className="text-muted-foreground mt-2">Modelos selecionados do nosso catálogo</p>
            </div>
            <Link to="/machines" className="text-primary font-semibold hidden sm:flex items-center gap-1">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((m) => (
              <MachineCard key={m.id} m={m} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Categorias</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((c) => (
                <Link key={c.id} to="/machines" search={{ category: c.slug } as never} className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group">
                  <Wrench className="h-8 w-8 text-primary mb-3" />
                  <div className="font-semibold text-lg group-hover:text-primary">{c.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}

function MachineCard({ m }: { m: Machine }) {
  return (
    <Link to="/machines/$id" params={{ id: m.id }} className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl hover:border-primary transition-all">
      <div className="aspect-[4/3] bg-secondary overflow-hidden">
        {m.main_image_url ? (
          <img src={m.main_image_url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Wrench className="h-12 w-12" /></div>
        )}
      </div>
      <div className="p-5">
        <div className="text-xs text-primary font-semibold uppercase tracking-wider">{m.brand}</div>
        <div className="font-bold text-lg mt-1">{m.name}</div>
        <div className="text-sm text-muted-foreground">{m.model}</div>
        <div className="mt-4 inline-flex items-center gap-1 text-primary font-semibold text-sm">
          Ver detalhes <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
