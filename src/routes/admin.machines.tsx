import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase, type Machine, type Category } from "@/lib/supabase";
import { Plus, Trash2, Pencil, Star } from "lucide-react";

export const Route = createFileRoute("/admin/machines")({
  component: MachinesAdmin,
});

type Form = Partial<Machine>;

function MachinesAdmin() {
  const [items, setItems] = useState<Machine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Form | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("machines").select("*, category:categories(*)").order("created_at", { ascending: false });
    setItems((data as Machine[]) || []);
  }
  useEffect(() => {
    load();
    supabase.from("categories").select("*").order("name").then(({ data }) => setCategories(data || []));
  }, []);

  function newItem() { setEditing({ name: "", is_featured: false }); setImgFile(null); setPdfFile(null); setGalleryFiles(null); }
  function edit(m: Machine) { setEditing(m); setImgFile(null); setPdfFile(null); setGalleryFiles(null); }

  async function uploadFile(bucket: string, file: File) {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload: Form = { ...editing };
      delete (payload as Record<string, unknown>).category;
      if (imgFile) payload.main_image_url = await uploadFile("machine-images", imgFile);
      if (pdfFile) payload.pdf_url = await uploadFile("machine-pdfs", pdfFile);
      if (galleryFiles && galleryFiles.length) {
        const urls: string[] = [];
        for (const f of Array.from(galleryFiles)) urls.push(await uploadFile("machine-images", f));
        payload.gallery_urls = [...(editing.gallery_urls || []), ...urls];
      }
      if (editing.id) {
        const { id, created_at, updated_at, view_count, download_count, ...up } = payload as Machine;
        void created_at; void updated_at; void view_count; void download_count;
        await supabase.from("machines").update(up).eq("id", id);
      } else {
        await supabase.from("machines").insert(payload);
      }
      setEditing(null);
      load();
    } catch (err) {
      alert("Erro ao salvar: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Excluir máquina?")) return;
    await supabase.from("machines").delete().eq("id", id);
    load();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Máquinas</h1>
        <button onClick={newItem} className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Nova</button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="text-left bg-secondary">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Marca / Modelo</th>
              <th className="p-3">Categoria</th>
              <th className="p-3 text-right">Views</th>
              <th className="p-3 text-right">Downloads</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="p-3 font-medium flex items-center gap-2">{m.is_featured && <Star className="h-3 w-3 text-primary fill-primary" />}{m.name}</td>
                <td className="p-3">{m.brand} {m.model}</td>
                <td className="p-3">{m.category?.name || "—"}</td>
                <td className="p-3 text-right">{m.view_count}</td>
                <td className="p-3 text-right">{m.download_count}</td>
                <td className="p-3 text-right">
                  <button onClick={() => edit(m)} className="p-2 hover:bg-secondary rounded"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(m.id)} className="p-2 hover:bg-secondary rounded text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Nenhuma máquina cadastrada.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => !saving && setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-card rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">{editing.id ? "Editar" : "Nova"} máquina</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nome *"><input required value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" /></Field>
              <Field label="Categoria">
                <select value={editing.category_id || ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className="input">
                  <option value="">—</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Marca"><input value={editing.brand || ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} className="input" /></Field>
              <Field label="Modelo"><input value={editing.model || ""} onChange={(e) => setEditing({ ...editing, model: e.target.value })} className="input" /></Field>
              <Field label="Ano"><input type="number" value={editing.year || ""} onChange={(e) => setEditing({ ...editing, year: e.target.value ? Number(e.target.value) : null })} className="input" /></Field>
              <Field label="Potência"><input value={editing.power || ""} onChange={(e) => setEditing({ ...editing, power: e.target.value })} className="input" /></Field>
              <Field label="Peso"><input value={editing.weight || ""} onChange={(e) => setEditing({ ...editing, weight: e.target.value })} className="input" /></Field>
              <Field label="Capacidade"><input value={editing.capacity || ""} onChange={(e) => setEditing({ ...editing, capacity: e.target.value })} className="input" /></Field>
            </div>
            <Field label="Descrição"><textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input" /></Field>
            <Field label="Aplicações"><textarea rows={3} value={editing.applications || ""} onChange={(e) => setEditing({ ...editing, applications: e.target.value })} className="input" /></Field>

            <Field label="Imagem principal">
              {editing.main_image_url && <img src={editing.main_image_url} alt="" className="h-20 w-20 object-cover rounded mb-2" />}
              <input type="file" accept="image/*" onChange={(e) => setImgFile(e.target.files?.[0] || null)} />
            </Field>
            <Field label="Galeria (múltiplas imagens)">
              <input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(e.target.files)} />
            </Field>
            <Field label="PDF (ficha técnica)">
              {editing.pdf_url && <a href={editing.pdf_url} target="_blank" rel="noreferrer" className="text-primary text-sm block mb-1">PDF atual</a>}
              <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
            </Field>

            <label className="flex items-center gap-2 my-4">
              <input type="checkbox" checked={!!editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} />
              <span className="text-sm font-medium">Destacar na home</span>
            </label>

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditing(null)} disabled={saving} className="px-4 py-2 rounded-md border border-border">Cancelar</button>
              <button disabled={saving} className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold disabled:opacity-50">{saving ? "Salvando..." : "Salvar"}</button>
            </div>
          </form>
        </div>
      )}

      <style>{`.input { margin-top: 0.25rem; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--input); border-radius: 0.375rem; background: var(--background); }`}</style>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mt-3">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
