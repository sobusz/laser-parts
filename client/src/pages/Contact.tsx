import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import { CONTACT_INTRO } from "@shared/legacy-copy";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const sendMessage = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSent(true);
      setForm({ name: "", email: "", phone: "", companyName: "", subject: "", message: "" });
    },
    onError: (err) => toast.error(err.message ?? "Błąd podczas wysyłania wiadomości"),
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Imię i nazwisko jest wymagane";
    if (!form.email) e.email = "E-mail jest wymagany";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Nieprawidłowy adres e-mail";
    if (!form.message || form.message.length < 10) e.message = "Wiadomość musi mieć co najmniej 10 znaków";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    sendMessage.mutate(form);
  }

  return (
    <PublicLayout>
      <PageHeader
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Kontakt" }]}
        title="Kontakt"
        description={CONTACT_INTRO}
      />

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-6" id="dane">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-secondary text-white flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Telefon</p>
                <a href="tel:+48691732408" className="block text-sm font-medium hover:text-primary">+48 691 732 408 (Anna)</a>
                <a href="tel:+48501676186" className="block text-sm font-medium hover:text-primary">+48 501 676 186 (Jacek)</a>
                <a href="tel:+48601225592" className="block text-sm font-medium hover:text-primary">+48 601 225 592 (Tomasz)</a>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-secondary text-white flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">E-mail</p>
                <a href="mailto:laser-parts@laser-parts.pl" className="block text-sm font-medium hover:text-primary">laser-parts@laser-parts.pl</a>
                <a href="mailto:zamowienia@laser-parts.pl" className="block text-sm font-medium hover:text-primary">zamowienia@laser-parts.pl</a>
              </div>
            </div>
            {[
              { icon: Building2, label: "Siedziba", value: "ul. Dworcowa 20/22\n87-630 Skępe" },
              { icon: MapPin, label: "Magazyn", value: "ul. Bławatna 10M\n55-095 Mirków" },
              { icon: Clock, label: "Godziny", value: "Pon–Pt: 8:00–16:00" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <div className="w-9 h-9 bg-secondary text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-sm font-medium whitespace-pre-line">{value}</p>
                </div>
              </div>
            ))}
          </div>
            <div className="bg-white border border-border p-5 text-sm">
              <p className="eyebrow text-muted-foreground mb-3">Dane firmy</p>
              <p>LASER PARTS</p>
              <p>NIP: 893-104-80-94</p>
              <p>REGON: 340043718</p>
              <p className="mt-2 font-mono text-xs">PKOBP S.A. 65 1440 1185 0000 0000 0400 4892</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            {sent ? (
              <div className="border border-border bg-white p-8 text-center">
                <h2 className="text-xl font-bold mb-2">Wiadomość wysłana</h2>
                <p className="text-muted-foreground mb-4">Odpowiemy najszybciej jak to możliwe.</p>
                <Button variant="outline" onClick={() => setSent(false)}>Wyślij kolejną</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-border p-6 lg:p-8">
                <div className="h-1 w-12 bg-primary mb-5" />
                <h2 className="font-semibold text-xl mb-2">Formularz kontaktowy</h2>
                <p className="text-sm text-muted-foreground mb-6">Pola oznaczone gwiazdką (*) są wymagane.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Imię i nazwisko *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={errors.name ? "border-destructive" : ""} />
                    {errors.name && <p id="name-error" className="text-sm font-medium text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={errors.email ? "border-destructive" : ""} />
                    {errors.email && <p id="email-error" className="text-sm font-medium text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName">Nazwa firmy</Label>
                    <Input id="companyName" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="subject">Temat</Label>
                    <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="message">Wiadomość *</Label>
                    <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} className={`text-base ${errors.message ? "border-destructive" : ""}`} placeholder="Prosimy o podanie modelu maszyny, numeru referencyjnego oraz wymaganej ilości." />
                    {errors.message && <p id="message-error" className="text-sm font-medium text-destructive">{errors.message}</p>}
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2 h-12 text-base" disabled={sendMessage.isPending}>
                  <Send className="w-4 h-4" />
                  {sendMessage.isPending ? "Wysyłanie..." : "Wyślij wiadomość"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
