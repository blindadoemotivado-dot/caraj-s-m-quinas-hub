import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase, type Category } from "@/lib/supabase";
import { Plus, Trash2, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesAdmin,
});

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function CategoriesAdmin() {
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function load() {
    const { data } = await supabase.from("categories").select("*").order("name");
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ id: "", name: "", slug: "", created_at: "" });
    setName(""); setSlug("");
  }
  function startEdit(c: Category) {
    setEditing(c); setName(c.name); setSlug(c.slug);
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const payload = { name, slug: slug || slugify(name) };
    if (editing.id) await supabase.from("categories").update(payload).eq("id", editing.id);
    else await supabase.from("categories").insert(payload);
    setEditing(null); load();
  }
  async function remove(id: string) {
    if (!confirm("Excluir categoria?")) return;
    await supabase.from("categories").delete().eq("id", id);
    load();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <button onClick={startNew} className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Nova</button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left bg-secondary">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Slug</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.slug}</td>
                <td className="p-3 text-right">
                  <button onClick={() => startEdit(c)} className="p-2 hover:bg-secondary rounded"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(c.id)} className="p-2 hover:bg-secondary rounded text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">Nenhuma categoria.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-card rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing.id ? "Editar" : "Nova"} categoria</h2>
            <label className="block mb-3">
              <span className="text-sm font-medium">Nome</span>
              <input required value={name} onChange={(e) => { setName(e.target.value); if (!editing.id) setSlug(slugify(e.target.value)); }} className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background" />
            </label>
            <label className="block mb-6">
              <span className="text-sm font-medium">Slug</span>
              <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background" />
            </label>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-md border border-border">Cancelar</button>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
