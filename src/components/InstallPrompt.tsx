import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";
import logo from "@/assets/carajas-logo.png";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "carajas_pwa_dismissed_at";
const DISMISS_DAYS = 7;

function recentlyDismissed() {
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    if (!v) return false;
    return Date.now() - Number(v) < DISMISS_DAYS * 86400_000;
  } catch {
    return false;
  }
}

function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // @ts-expect-error iOS Safari
    window.navigator.standalone === true
  );
}

function isIOS() {
  const ua = window.navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone() || recentlyDismissed()) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS doesn't fire beforeinstallprompt — show manual hint after a brief delay
    let iosTimer: number | undefined;
    if (isIOS()) {
      iosTimer = window.setTimeout(() => setShow(true), 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setShow(false);
    setShowIosHelp(false);
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
      setShow(false);
    } else if (isIOS()) {
      setShowIosHelp(true);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-x-3 bottom-3 z-[60] md:left-auto md:right-4 md:bottom-4 md:max-w-sm rounded-xl bg-[#0D0D0D] text-white border border-white/10 shadow-2xl p-4 animate-fade-in-up"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-start gap-3">
          <img src={logo} alt="" className="h-10 w-10 rounded bg-[#0D0D0D] object-contain p-1 border border-white/10" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">Instalar Carajás Máquinas</div>
            <p className="text-[12px] text-white/70 mt-0.5 leading-snug">
              Acesso rápido direto da sua tela inicial, sem abrir o navegador.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={install}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#F5C200] text-[#0D0D0D] font-bold text-sm px-3 py-2 rounded-md hover:brightness-110 transition"
              >
                <Download className="h-4 w-4" /> Instalar App
              </button>
              <button
                onClick={dismiss}
                className="px-3 py-2 text-white/60 hover:text-white text-sm"
                aria-label="Dispensar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showIosHelp && (
        <div
          className="fixed inset-0 z-[70] bg-black/70 flex items-end md:items-center justify-center p-4 animate-fade-in"
          onClick={dismiss}
        >
          <div
            className="bg-white text-[#0D0D0D] rounded-2xl max-w-sm w-full p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-black text-lg">Adicionar à Tela Inicial</div>
              <button onClick={dismiss} className="text-black/50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-black/70 mb-4">
              No Safari, instale o app em 2 passos:
            </p>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3 items-start">
                <span className="bg-[#F5C200] text-[#0D0D0D] font-black h-6 w-6 rounded-full flex items-center justify-center shrink-0">1</span>
                <div className="flex-1">
                  Toque no botão <Share className="h-4 w-4 inline -mt-0.5" /> <strong>Compartilhar</strong> na barra do Safari.
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-[#F5C200] text-[#0D0D0D] font-black h-6 w-6 rounded-full flex items-center justify-center shrink-0">2</span>
                <div className="flex-1">
                  Escolha <strong>“Adicionar à Tela de Início”</strong> e confirme.
                </div>
              </li>
            </ol>
            <button
              onClick={dismiss}
              className="mt-5 w-full bg-[#0D0D0D] text-white font-bold py-3 rounded-md"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
