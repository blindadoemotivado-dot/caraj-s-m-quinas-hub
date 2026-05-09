import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export function PublicLayout({ children, whatsappMessage }: { children: React.ReactNode; whatsappMessage?: string }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat message={whatsappMessage} />
    </div>
  );
}
