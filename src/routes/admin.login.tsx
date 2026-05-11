import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    nav({ to: "/admin/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <form onSubmit={submit} className="bg-card border border-border rounded-lg shadow-xl p-8 w-full max-w-md">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Voltar ao site</Link>
        <h1 className="text-2xl font-bold mt-4">Acesso Administrativo</h1>
        <p className="text-muted-foreground text-sm mb-6">Carajás Máquinas</p>

        {err && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4">{err}</div>}

        <label className="block mb-3">
          <span className="text-sm font-medium">E-mail</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background" />
        </label>
        <label className="block mb-6">
          <span className="text-sm font-medium">Senha</span>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-20 border border-input rounded-md bg-background"
            />
            {password && (
              <button
                type="button"
                onClick={() => setPassword("")}
                aria-label="Limpar senha"
                className="absolute right-10 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#F5C200]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#F5C200]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <button disabled={loading} className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-semibold hover:opacity-90 disabled:opacity-50">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
