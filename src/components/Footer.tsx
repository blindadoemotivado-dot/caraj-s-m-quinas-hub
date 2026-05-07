export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground mt-16">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center font-bold text-primary-foreground">
              CM
            </div>
            <div className="font-bold text-lg">Carajás Máquinas</div>
          </div>
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
        © {new Date().getFullYear()} Carajás Máquinas. Todos os direitos reservados.
      </div>
    </footer>
  );
}
