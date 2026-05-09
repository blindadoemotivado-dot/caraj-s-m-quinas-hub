import logo from "@/assets/carajas-logo.png";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground mt-16">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <img src={logo} alt="Carajás Máquinas" className="h-12 w-auto mb-3" />
          <p className="text-sm text-white/70">
            Catálogo técnico digital e plataforma comercial de máquinas e equipamentos pesados.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-primary">Contato</h4>
          <p className="text-sm text-white/70">WhatsApp: (94) 99130-6843</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-primary">Atendimento</h4>
          <p className="text-sm text-white/70">Segunda a Sábado<br />08h às 18h</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © 2026 FCIA. Todos os direitos reservados.
      </div>
    </footer>
  );
}
