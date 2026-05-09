import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Machine, type Category } from "@/lib/supabase";
import { PublicLayout } from "@/components/PublicLayout";
import { ArrowRight, Wrench, ShieldCheck, Headphones, Truck } from "lucide-react";
import { QuoteDialog } from "@/components/QuoteDialog";

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
      <section className="relative bg-grain text-white overflow-hidden">
        <div className="container mx-auto px-4 py-24 md:py-36 relative">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold mb-6 uppercase tracking-wider">
              <Wrench className="h-3.5 w-3.5" /> Catálogo Técnico Digital
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] mb-6">
              Máquinas pesadas que <span className="text-primary">movem</span> o seu negócio.
            </h1>
            <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl leading-relaxed">
              Soluções robustas em equipamentos para mineração, construção civil e indústria. Especificações técnicas completas e atendimento especializado.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/machines"
                className="bg-primary text-primary-foreground px-7 py-3.5 rounded-md font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/30"
              >
                Ver Máquinas <ArrowRight className="h-4 w-4" />
              </Link>
              <QuoteDialog
                trigger={
                  <button className="border-2 border-primary text-primary px-7 py-3.5 rounded-md font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all">
                    Solicitar Orçamento
                  </button>
                }
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Catálogo</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2">Categorias de máquinas</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Explore nossa linha completa por categoria.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {categories.slice(0, 6).map((c, i) => (
              <Link
                key={c.id}
                to="/machines"
                search={{ category: c.slug } as never}
                className="group relative aspect-[4/5] md:aspect-[4/3] rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D0D] flex items-center justify-center">
                  <Wrench className="h-20 w-20 text-primary/20 group-hover:text-primary/40 group-hover:scale-110 transition-all duration-500" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-black/75 backdrop-blur-sm px-5 py-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg">{c.name}</h3>
                    <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10 animate-fade-in-up">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Destaques</span>
                <h2 className="text-3xl md:text-5xl font-black mt-2">Máquinas em destaque</h2>
              </div>
              <Link to="/machines" className="text-primary font-semibold hidden sm:flex items-center gap-1 hover:gap-2 transition-all">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((m, i) => (
                <div key={m.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <MachineCard m={m} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Por que a Carajás */}
      <section className="bg-[#1a1a1a] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 animate-fade-in-up">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Diferenciais</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2">Por que a Carajás</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Qualidade Comprovada", desc: "Equipamentos das melhores marcas, com inspeção técnica criteriosa." },
              { icon: Headphones, title: "Atendimento Especializado", desc: "Equipe técnica pronta para indicar a solução ideal para sua operação." },
              { icon: Truck, title: "Entrega em Todo Brasil", desc: "Logística estruturada para entregar onde sua obra precisa." },
            ].map((f, i) => (
              <div
                key={f.title}
                className="text-center md:text-left p-6 rounded-xl border border-white/5 hover:border-primary/40 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15 mb-5">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl md:text-3xl font-black">Pronto para encontrar a máquina ideal?</h3>
            <p className="text-primary-foreground/80 mt-1">Solicite agora um orçamento personalizado.</p>
          </div>
          <QuoteDialog
            trigger={
              <button className="bg-[#0D0D0D] text-white px-7 py-3.5 rounded-md font-bold hover:bg-black transition-all">
                Solicitar Orçamento
              </button>
            }
          />
        </div>
      </section>
    </PublicLayout>
  );
}

function MachineCard({ m }: { m: Machine }) {
  return (
    <Link
      to="/machines/$id"
      params={{ id: m.id }}
      className="group block bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:border-primary hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-[4/3] bg-[#1a1a1a] overflow-hidden">
        {m.main_image_url ? (
          <img src={m.main_image_url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/30"><Wrench className="h-16 w-16" /></div>
        )}
      </div>
      <div className="p-5">
        <div className="text-xs text-primary font-bold uppercase tracking-wider">{m.brand}</div>
        <div className="font-bold text-lg mt-1 leading-tight">{m.name}</div>
        <div className="text-sm text-muted-foreground">{m.model}</div>
        <div className="mt-4 inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
          Ver detalhes <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
