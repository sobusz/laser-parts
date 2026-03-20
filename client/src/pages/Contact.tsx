import { useState } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PublicLayout from "@/components/PublicLayout";
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
      {/* Page header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container py-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">Strona główna</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Kontakt</span>
          </nav>
          <h1 className="text-3xl font-bold">Kontakt</h1>
          <p className="text-muted-foreground mt-1">Skontaktuj się z nami – odpowiadamy szybko</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-bold text-xl mb-4">Dane kontaktowe</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Phone,
                    label: "Telefon",
                    value: "+48 691 732 408",
                    href: "tel:+48691732408",
                  },
                  {
                    icon: Mail,
                    label: "E-mail",
                    value: "biuro@laser-parts.pl",
                    href: "mailto:biuro@laser-parts.pl",
                  },
                  {
                    icon: MapPin,
                    label: "Adres",
                    value: "ul. Przykładowa 1\n00-000 Warszawa",
                    href: null,
                  },
                  {
                    icon: Clock,
                    label: "Godziny pracy",
                    value: "Pon–Pt: 8:00–16:00",
                    href: null,
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a href={href} className="text-sm font-medium hover:text-primary transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium whitespace-pre-line">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl border border-border p-5">
              <h3 className="font-semibold mb-2">Szybka realizacja</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Zamówienia na produkty z oferty podstawowej realizujemy w dniu złożenia zamówienia.
                Wysyłka przez Pocztę Polską, DHL lub inną firmę kurierską.
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl border border-border p-5">
              <h3 className="font-semibold mb-2">Dane firmy</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Laser Parts</p>
                <p>NIP: 000-000-00-00</p>
                <p>REGON: 000000000</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-green-800 mb-2">Wiadomość wysłana!</h2>
                <p className="text-green-700 mb-4">
                  Dziękujemy za kontakt. Odpowiemy na Twoje pytanie najszybciej jak to możliwe.
                </p>
                <Button variant="outline" onClick={() => setSent(false)}>
                  Wyślij kolejną wiadomość
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-bold text-xl mb-6">Wyślij wiadomość</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="name">Imię i nazwisko *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jan Kowalski"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jan@firma.pl"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+48 000 000 000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Nazwa firmy</Label>
                    <Input
                      id="companyName"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      placeholder="Firma Sp. z o.o."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="subject">Temat</Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Zapytanie o produkt / wycena / inne"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="message">Wiadomość *</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Opisz czego potrzebujesz. Podaj model maszyny i numer referencyjny części, jeśli to możliwe."
                      rows={5}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={sendMessage.isPending}>
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
