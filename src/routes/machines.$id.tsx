import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Machine, WHATSAPP_NUMBER } from "@/lib/supabase";
import { PublicLayout } from "@/components/PublicLayout";
import { Download, MessageCircle, ChevronLeft, Wrench } from "lucide-react";
import { QuoteDialog } from "@/components/QuoteDialog";

export const Route = createFileRoute("/machines/$id")({
  component: MachineDetail,
});

function MachineDetail() {
  const { id } = Route.useParams();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.from("machines").select("*, category:categories(*)").eq("id", id).maybeSingle().then(({ data }) => {
      if (!mounted) return;
      const m = data as Machine | null;
      setMachine(m);
      setActiveImg(m?.main_image_url ?? null);
      setLoading(false);
      if (m) {
        // increment view count
        supabase.from("machines").update({ view_count: (m.view_count || 0) + 1 }).eq("id", m.id).then(() => {});
        document.title = `${m.name} — Carajás Máquinas`;
      }
    });
    return () => { mounted = false; };
  }, [id]);

  const handleDownload = async () => {
    if (!machine?.pdf_url) return;
    await supabase.from("machines").update({ download_count: (machine.download_count || 0) + 1 }).eq("id", machine.id);
    window.open(machine.pdf_url, "_blank");
  };

  if (loading) return <PublicLayout><div className="container mx-auto px-4 py-20 text-center">Carregando...</div></PublicLayout>;
  if (!machine) return <PublicLayout><div className="container mx-auto px-4 py-20 text-center">Máquina não encontrada. <Link to="/machines" className="text-primary">Voltar</Link></div></PublicLayout>;

  const waMsg = `Olá! Tenho interesse na máquina: ${machine.name}`;
  const gallery = [machine.main_image_url, ...(machine.gallery_urls || [])].filter(Boolean) as string[];

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
      <div className="container mx-auto px-4 py-6">
        <Link to="/machines" className="inline-flex items-center text-muted-foreground hover:text-primary text-sm">
          <ChevronLeft className="h-4 w-4" /> Voltar ao catálogo
        </Link>
      </div>
      <div className="container mx-auto px-4 pb-12 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-[4/3] bg-secondary rounded-lg overflow-hidden border border-border">
            {activeImg ? (
              <img src={activeImg} alt={machine.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Wrench className="h-16 w-16" /></div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {gallery.map((g) => (
                <button key={g} onClick={() => setActiveImg(g)} className={`aspect-square rounded border overflow-hidden ${activeImg === g ? "border-primary border-2" : "border-border"}`}>
                  <img src={g} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {machine.brand && <div className="text-primary text-sm font-semibold uppercase tracking-wider">{machine.brand}</div>}
          <h1 className="text-3xl md:text-4xl font-bold mt-1">{machine.name}</h1>
          {machine.model && <div className="text-lg text-muted-foreground mt-1">Modelo: {machine.model}</div>}

          <div className="mt-6 grid grid-cols-2 gap-3">
            {specs.map(([k, v]) => (
              <div key={k as string} className="bg-secondary rounded-md p-3">
                <div className="text-xs text-muted-foreground uppercase">{k}</div>
                <div className="font-semibold">{v}</div>
              </div>
            ))}
          </div>

          {machine.description && (
            <div className="mt-6">
              <h2 className="font-bold text-lg mb-2">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-line">{machine.description}</p>
            </div>
          )}

          {machine.applications && (
            <div className="mt-6">
              <h2 className="font-bold text-lg mb-2">Aplicações</h2>
              <p className="text-muted-foreground whitespace-pre-line">{machine.applications}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <QuoteDialog
              defaultMachineId={machine.id}
              trigger={
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:opacity-90">
                  <MessageCircle className="h-4 w-4" /> Solicitar Orçamento
                </button>
              }
            />
            {machine.pdf_url && (
              <button onClick={handleDownload} className="bg-navy text-navy-foreground px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:opacity-90">
                <Download className="h-4 w-4" /> Baixar Ficha Técnica (PDF)
              </button>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
