import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/carajas-logo.png";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Início" },
    { to: "/machines", label: "Máquinas" },
  ];
  return (
    <header className="sticky top-0 z-40 bg-navy text-navy-foreground shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Carajás Máquinas" className="h-10 w-auto" />
          <span className="hidden sm:inline font-semibold text-sm text-white/70">Máquinas</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-primary transition-colors font-medium">
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/5594991306843"
            target="_blank"
            rel="noreferrer"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:opacity-90"
          >
            Solicitar Orçamento
          </a>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="font-medium">
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/5594991306843"
            target="_blank"
            rel="noreferrer"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold text-center"
          >
            Solicitar Orçamento
          </a>
        </nav>
      )}
    </header>
  );
}
