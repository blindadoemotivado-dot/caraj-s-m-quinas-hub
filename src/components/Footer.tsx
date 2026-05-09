import { Link } from "@tanstack/react-router";
import { MessageCircle, Clock, MapPin } from "lucide-react";
import logo from "@/assets/carajas-logo.png";

export function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white mt-20 border-t border-white/5">
      <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src={logo} alt="Carajás Máquinas" className="h-12 w-auto mb-4" />
          <p className="text-sm text-white/60 leading-relaxed">
            Catálogo técnico digital e plataforma comercial de máquinas e equipamentos pesados.
          </p>
          <p className="text-xs text-white/40 mt-4 font-semibold tracking-wider">FCIA</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-primary text-sm uppercase tracking-wider">Navegação</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
            <li><Link to="/machines" className="hover:text-primary transition-colors">Máquinas</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-primary text-sm uppercase tracking-wider">Contato</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <a href="https://wa.me/5594991306843" className="hover:text-primary">WhatsApp: (94) 99130-6843</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Pará, Brasil</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-primary text-sm uppercase tracking-wider">Atendimento</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-primary mt-0.5" />
              <span>Segunda a Sábado<br />08h às 18h</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © 2026 FCIA. Todos os direitos reservados.
      </div>
    </footer>
  );
}
