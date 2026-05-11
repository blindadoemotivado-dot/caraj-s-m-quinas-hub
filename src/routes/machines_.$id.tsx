import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Machine } from "@/lib/supabase";
import { PublicLayout } from "@/components/PublicLayout";
import { Download, MessageCircle, ChevronLeft, Wrench } from "lucide-react";
import { QuoteDialog } from "@/components/QuoteDialog";

export const Route = createFileRoute("/machines_/$id")({
  component: MachineDetail,
  head: ({ params }) => {
    const url = `https://carajasmaquinas.lovable.app/machines/${params.id}`;
    return {
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function MachineDetail() {
  const { id } = Route.useParams();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("machines")
      .select("*, category:categories(*)")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        const m = data as Machine | null;
        if (!m) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setMachine(m);
        setActiveImg(m.main_image_url ?? null);
        setLoading(false);
        supabase
          .from("machines")
          .update({ view_count: (m.view_count || 0) + 1 })
          .eq("id", m.id)
          .then(() => {});
        document.title = `${m.name} — Carajás Máquinas`;
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDownload = async () => {
    if (!machine?.pdf_url) return;
    await supabase
      .from("machines")
      .update({ download_count: (machine.download_count || 0) + 1 })
      .eq("id", machine.id);
    window.open(machine.pdf_url, "_blank");
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="bg-[#0D0D0D] text-white min-h-screen">
          <div className="container mx-auto px-4 py-6">
            <div className="h-5 w-40 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="container mx-auto px-4 pb-12 grid gap-10 lg:grid-cols-2">
            <div className="aspect-[4/3] bg-white/5 rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-white/10 rounded animate-pulse" />
              <div className="h-5 w-1/2 bg-white/10 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-3 mt-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 bg-white/5 rounded-md animate-pulse" />
                ))}
              </div>
              <div className="h-24 bg-white/5 rounded animate-pulse mt-6" />
              <div className="h-12 w-48 bg-white/10 rounded animate-pulse mt-6" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (notFound || !machine) {
    return (
      <PublicLayout>
        <div className="bg-[#0D0D0D] text-white min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-2xl font-bold mb-2">Máquina não encontrada</h1>
            <p className="text-[#CCCCCC] mb-6">
              A máquina que você procura não existe ou foi removida do catálogo.
            </p>
            <Link
              to="/machines"
              className="inline-flex items-center gap-2 bg-[#F5C200] text-black px-6 py-3 rounded-md font-semibold hover:brightness-110 transition"
            >
              <ChevronLeft className="h-4 w-4" /> Voltar ao Catálogo
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const waMsg = `Olá! Tenho interesse na máquina: ${machine.name}`;
  const gallery = [machine.main_image_url, ...(machine.gallery_urls || [])].filter(
    Boolean,
  ) as string[];

  const specs = [
    ["Marca", machine.brand],
    ["Modelo", machine.model],
    ["Categoria", machine.category?.name],
    ["Ano", machine.year],
    ["Potência", machine.power],
    ["Peso", machine.weight],
    ["Capacidade", machine.capacity],
  ].filter(([, v]) => v);

  return (
    <PublicLayout whatsappMessage={waMsg}>
      <div className="bg-[#0D0D0D] text-white min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/machines"
            className="inline-flex items-center gap-1 text-[#CCCCCC] hover:text-[#F5C200] transition text-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Voltar ao Catálogo
          </Link>
        </div>
        <div className="container mx-auto px-4 pb-16 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="aspect-[4/3] bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#333]">
              {activeImg ? (
                <img
                  src={activeImg}
                  alt={machine.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#555]">
                  <Wrench className="h-20 w-20" />
                </div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {gallery.map((g) => (
                  <button
                    key={g}
                    onClick={() => setActiveImg(g)}
                    className={`aspect-square rounded overflow-hidden border-2 transition ${
                      activeImg === g ? "border-[#F5C200]" : "border-[#333] hover:border-[#555]"
                    }`}
                  >
                    <img src={g} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {machine.category?.name && (
              <span className="inline-block bg-[#F5C200] text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                {machine.category.name}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mt-3 text-white">{machine.name}</h1>
            {(machine.brand || machine.model) && (
              <div className="text-lg text-[#CCCCCC] mt-1">
                {machine.brand}
                {machine.brand && machine.model ? " • " : ""}
                {machine.model}
              </div>
            )}

            {specs.length > 0 && (
              <div className="mt-6">
                <h2 className="font-bold text-lg mb-3 text-white">Especificações Técnicas</h2>
                <div className="rounded-md border border-[#333] overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {specs.map(([k, v], i) => (
                        <tr
                          key={k as string}
                          className={i % 2 === 0 ? "bg-[#1A1A1A]" : "bg-[#141414]"}
                        >
                          <td className="px-4 py-2.5 text-[#CCCCCC] w-1/3 border-r border-[#333]">
                            {k}
                          </td>
                          <td className="px-4 py-2.5 text-white font-medium">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {machine.description && (
              <div className="mt-6">
                <h2 className="font-bold text-lg mb-2 text-white">Descrição</h2>
                <p className="text-[#CCCCCC] whitespace-pre-line leading-relaxed">
                  {machine.description}
                </p>
              </div>
            )}

            {machine.applications && (
              <div className="mt-6">
                <h2 className="font-bold text-lg mb-2 text-white">Aplicações</h2>
                <p className="text-[#CCCCCC] whitespace-pre-line leading-relaxed">
                  {machine.applications}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <QuoteDialog
                defaultMachineId={machine.id}
                trigger={
                  <button className="bg-[#F5C200] text-black px-6 py-3.5 rounded-md font-bold flex items-center gap-2 hover:brightness-110 transition shadow-lg shadow-[#F5C200]/20">
                    <MessageCircle className="h-5 w-5" /> Solicitar Orçamento
                  </button>
                }
              />
              {machine.pdf_url && (
                <button
                  onClick={handleDownload}
                  className="bg-[#1A1A1A] border border-[#333] text-white px-6 py-3.5 rounded-md font-semibold flex items-center gap-2 hover:border-[#F5C200] hover:text-[#F5C200] transition"
                >
                  <Download className="h-5 w-5" /> Baixar Ficha Técnica PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
