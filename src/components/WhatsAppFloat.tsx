import { MessageCircle } from "lucide-react";

export function WhatsAppFloat({ message }: { message?: string }) {
  const url = `https://wa.me/5594991306843${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-whatsapp text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
