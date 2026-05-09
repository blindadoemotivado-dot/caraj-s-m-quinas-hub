import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Machine, type Category } from "@/lib/supabase";
import { PublicLayout } from "@/components/PublicLayout";
import { ArrowRight, Wrench, ShieldCheck, Headphones, Truck } from "lucide-react";
import { QuoteDialog } from "@/components/QuoteDialog";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => {
    const title = "Carajás Máquinas | Empilhadeiras, Tratores e Manipuladores em Parauapebas-PA";
    const description = "Catálogo técnico de máquinas pesadas para mineração, construção civil e agronegócio. Empilhadeiras, tratores e manipuladores telescópicos. Atendemos Parauapebas e todo o Brasil.";
    const url = "https://carajasmaquinas.lovable.app";
    const image = "https://carajasmaquinas.lovable.app/icon-512.png";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: "máquinas pesadas Parauapebas, empilhadeira todo terreno, trator 70hp, manipulador telescópico, máquinas mineração Pará, FCIA, Carajás Máquinas" },
        { property: "og:title", content: "Carajás Máquinas | Equipamentos Pesados" },
        { property: "og:description", content: "Catálogo técnico de máquinas pesadas para mineração e construção civil. Parauapebas, Pará." },
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
        <div className="container mx-auto px-4 py-10 md:py-28 relative">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] md:text-xs font-semibold mb-3 md:mb-6 uppercase tracking-wider">
              <Wrench className="h-3 w-3" /> Catálogo Técnico
            </div>
            <h1 className="text-[32px] md:text-6xl font-black leading-[1.1] mb-2 md:mb-5">
              Máquinas pesadas que <span className="text-primary">movem</span> o seu negócio.
            </h1>
            <p className="text-[15px] md:text-lg text-white/65 mb-5 md:mb-8 leading-snug max-w-2xl">
              Soluções robustas em equipamentos para mineração, construção civil e indústria.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <Link
                to="/machines"
                className="bg-primary text-primary-foreground w-full sm:w-auto px-6 py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/30"
              >
                Ver Máquinas <ArrowRight className="h-4 w-4" />
              </Link>
              <QuoteDialog
                trigger={
                  <button className="border-2 border-primary text-primary w-full sm:w-auto px-6 py-3 rounded-md font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all">
                    Solicitar Orçamento
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-8 md:py-16">
          <div className="mb-5 md:mb-10 animate-fade-in-up">
            <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">Catálogo</span>
            <h2 className="text-2xl md:text-4xl font-black mt-1">Categorias</h2>
          </div>
          <div className="grid gap-3 md:gap-5 md:grid-cols-3">
            {categories.slice(0, 6).map((c, i) => (
              <Link
                key={c.id}
                to="/machines"
                search={{ category: c.slug } as never}
                className="group relative h-[140px] md:h-[200px] rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CategoryBg slug={c.slug} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 px-4 py-3 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg md:text-xl drop-shadow">{c.name}</h3>
                  <ArrowRight className="h-5 w-5 text-primary opacity-80 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="bg-secondary/50 py-8 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-5 md:mb-10 animate-fade-in-up">
              <div>
                <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">Destaques</span>
                <h2 className="text-2xl md:text-4xl font-black mt-1">Em destaque</h2>
              </div>
              <Link to="/machines" className="text-primary font-semibold text-sm hidden sm:flex items-center gap-1 hover:gap-2 transition-all">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((m, i) => (
                <div key={m.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <MachineCard m={m} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Por que a Carajás */}
      <section className="bg-[#1a1a1a] text-white py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-5 md:mb-10 animate-fade-in-up">
            <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">Diferenciais</span>
            <h2 className="text-2xl md:text-4xl font-black mt-1">Por que a Carajás</h2>
          </div>
          <div className="grid gap-3 md:gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Qualidade Comprovada", desc: "Equipamentos das melhores marcas, com inspeção técnica criteriosa." },
              { icon: Headphones, title: "Atendimento Especializado", desc: "Equipe técnica pronta para indicar a solução ideal." },
              { icon: Truck, title: "Entrega em Todo Brasil", desc: "Logística estruturada para entregar onde sua obra precisa." },
            ].map((f, i) => (
              <div
                key={f.title}
                className="flex md:block items-start gap-3 p-4 md:p-6 rounded-xl border border-white/5 hover:border-primary/40 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="inline-flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 md:mb-4">
                  <f.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold">{f.title}</h3>
                  <p className="text-white/60 text-[14px] leading-snug mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-8 md:py-14">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-xl md:text-3xl font-black leading-tight">Pronto para encontrar a máquina ideal?</h3>
            <p className="text-primary-foreground/80 text-[14px] md:text-base mt-1">Solicite agora um orçamento personalizado.</p>
          </div>
          <QuoteDialog
            trigger={
              <button className="bg-[#0D0D0D] text-white w-full md:w-auto px-6 py-3 rounded-md font-bold hover:bg-black transition-all">
                Solicitar Orçamento
              </button>
            }
          />
        </div>
      </section>
    </PublicLayout>
  );
}

const CATEGORY_IMAGES: Record<string, string> = {
  empilhadeiras: "/categories/empilhadeiras.jpg",
  empilhadeira: "/categories/empilhadeiras.jpg",
  manipuladores: "/categories/manipuladores.jpg",
  manipulador: "/categories/manipuladores.jpg",
  "manipuladores-telescopicos": "/categories/manipuladores.jpg",
  tratores: "/categories/tratores.jpg",
  trator: "/categories/tratores.jpg",
};

function CategoryBg({ slug }: { slug: string }) {
  const url = CATEGORY_IMAGES[slug];
  if (!url) {
    return <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D0D]" />;
  }
  return (
    <img
      src={url}
      alt=""
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />
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
      <div className="p-4">
        <div className="text-[10px] text-primary font-bold uppercase tracking-wider">{m.brand}</div>
        <div className="font-bold text-base mt-0.5 leading-tight">{m.name}</div>
        <div className="text-[14px] text-muted-foreground">{m.model}</div>
        <div className="mt-2.5 inline-flex items-center gap-1 text-primary font-semibold text-[14px] group-hover:gap-2 transition-all">
          Ver detalhes <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
