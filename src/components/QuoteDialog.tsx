import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase, type Machine, WHATSAPP_NUMBER } from "@/lib/supabase";
import { MessageCircle } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo").max(100),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Informe um WhatsApp válido")
    .max(20)
    .regex(/^[0-9()+\-\s]+$/, "Use apenas números e ( ) + -"),
  machineId: z.string().min(1, "Selecione uma máquina"),
  message: z.string().trim().max(1000).optional(),
});

type Props = {
  trigger: React.ReactNode;
  defaultMachineId?: string;
};

export function QuoteDialog({ trigger, defaultMachineId }: Props) {
  const [open, setOpen] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [machineId, setMachineId] = useState(defaultMachineId ?? "");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    supabase
      .from("machines")
      .select("id,name,brand,model")
      .order("name")
      .then(({ data }) => setMachines((data as Machine[]) || []));
  }, [open]);

  useEffect(() => {
    if (defaultMachineId) setMachineId(defaultMachineId);
  }, [defaultMachineId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, whatsapp, machineId, message });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fe[i.path[0] as string] = i.message;
      });
      setErrors(fe);
      return;
    }
    setErrors({});
    const machine = machines.find((m) => m.id === machineId);
    const machineLabel = machine
      ? `${machine.name}${machine.brand ? " - " + machine.brand : ""}${machine.model ? " " + machine.model : ""}`
      : "";
    const text =
      `Olá! Gostaria de solicitar um orçamento.\n\n` +
      `*Nome:* ${parsed.data.name}\n` +
      `*WhatsApp:* ${parsed.data.whatsapp}\n` +
      `*Máquina:* ${machineLabel}` +
      (parsed.data.message ? `\n*Mensagem:* ${parsed.data.message}` : "");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#0D0D0D] text-white border-[#333] [&_label]:text-[#CCCCCC] [&_input]:bg-[#1A1A1A] [&_input]:border-[#333] [&_input]:text-white [&_textarea]:bg-[#1A1A1A] [&_textarea]:border-[#333] [&_textarea]:text-white [&_button[role=combobox]]:bg-[#1A1A1A] [&_button[role=combobox]]:border-[#333] [&_button[role=combobox]]:text-white">
        <DialogHeader>
          <DialogTitle>Solicitar Orçamento</DialogTitle>
          <DialogDescription className="text-[#CCCCCC]">
            Preencha os dados abaixo e enviaremos seu pedido pelo WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="q-name">Nome completo</Label>
            <Input id="q-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-wa">WhatsApp</Label>
            <Input
              id="q-wa"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(94) 99999-9999"
              maxLength={20}
            />
            {errors.whatsapp && <p className="text-xs text-destructive">{errors.whatsapp}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Selecionar Máquina</Label>
            <Select value={machineId} onValueChange={setMachineId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma máquina" />
              </SelectTrigger>
              <SelectContent>
                {machines.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                    {m.brand ? ` - ${m.brand}` : ""}
                    {m.model ? ` ${m.model}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.machineId && <p className="text-xs text-destructive">{errors.machineId}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-msg">Mensagem (opcional)</Label>
            <Textarea
              id="q-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              rows={3}
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full gap-2">
              <MessageCircle className="h-4 w-4" /> Enviar Orçamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
