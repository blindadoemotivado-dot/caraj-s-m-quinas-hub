import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/carajas-logo.png";
import { QuoteDialog } from "@/components/QuoteDialog";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Início" },
    { to: "/machines", label: "Máquinas" },
  ];
  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0D] text-white shadow-[0_2px_20px_rgba(0,0,0,0.4)] border-b border-white/5">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Carajás Máquinas" className="h-9 md:h-11 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-white/80 hover:text-primary transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
          <QuoteDialog
            trigger={
              <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-semibold text-sm hover:brightness-110 transition-all shadow-md shadow-primary/20">
                Solicitar Orçamento
              </button>
            }
          />
        </nav>
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-white/10 bg-[#0D0D0D] px-4 py-4 flex flex-col gap-3 animate-fade-in">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="font-medium text-white/90 py-2"
            >
              {l.label}
            </Link>
          ))}
          <QuoteDialog
            trigger={
              <button className="bg-primary text-primary-foreground px-4 py-3 rounded-md font-semibold text-center mt-2">
                Solicitar Orçamento
              </button>
            }
          />
        </nav>
      )}
    </header>
  );
}
