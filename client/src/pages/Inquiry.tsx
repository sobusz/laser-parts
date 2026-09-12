import { useRef, useState } from "react";
import { Link } from "wouter";
import { Trash2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import { useInquiry } from "@/contexts/InquiryContext";
import { INQUIRY_INTRO } from "@shared/legacy-copy";
import { trpc } from "@/lib/trpc";

type FieldKey = "items" | "companyName" | "contactName" | "contactEmail";

const FIELD_LABELS: Record<FieldKey, string> = {
  items: "Lista pozycji",
  companyName: "Nazwa firmy",
  contactName: "Osoba kontaktowa",
  contactEmail: "E-mail",
};

export default function Inquiry() {
  const { items, updateQuantity, removeItem, updateNote, clear } = useInquiry();
  const [sentNumber, setSentNumber] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    companyName: "",
    nip: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
  });

  const send = trpc.inquiries.create.useMutation({
    onSuccess: (data) => {
      setSentNumber(data.inquiryNumber);
      setErrors({});
      clear();
      toast.success("Zapytanie zostało wysłane");
    },
    onError: (err) => toast.error(err.message ?? "Nie udało się wysłać zapytania"),
  });

  function validate(): Partial<Record<FieldKey, string>> {
    const next: Partial<Record<FieldKey, string>> = {};
    if (items.length === 0) next.items = "Dodaj przynajmniej jedną pozycję z katalogu.";
    if (!form.companyName.trim()) next.companyName = "Podaj nazwę firmy.";
    if (!form.contactName.trim()) next.contactName = "Podaj osobę kontaktową.";
    if (!form.contactEmail.trim()) next.contactEmail = "Podaj adres e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      next.contactEmail = "Podaj poprawny adres e-mail.";
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    send.mutate({
      ...form,
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.name,
        referenceNumber: i.referenceNumber,
        quantity: i.quantity,
        note: i.note,
      })),
    });
  }

  const errorKeys = (Object.keys(errors) as FieldKey[]).filter((key) => errors[key]);

  return (
    <PublicLayout>
      <PageHeader
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Zapytanie ofertowe" }]}
        title="Zapytanie"
        description={INQUIRY_INTRO}
      />

      <div className="tech-grid">
      <div className="container py-10">
        {sentNumber ? (
          <div className="max-w-lg mx-auto bg-white border border-border p-8 text-center">
            <div className="h-1 w-12 bg-primary mx-auto mb-5" />
            <ClipboardList className="w-10 h-10 mx-auto mb-3" />
            <h2 className="text-xl font-semibold mb-2">Zapytanie zostało przyjęte</h2>
            <p className="text-muted-foreground mb-1">Numer sprawy: <span className="font-mono font-medium">{sentNumber}</span></p>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Odpowiedź z ceną i terminem realizacji prześlemy na wskazany adres e-mail. W razie potrzeby skontaktujemy się telefonicznie.
            </p>
            <Link href="/oferta"><Button>Wróć do oferty</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3" id="inquiry-items">
              <h2 className="font-semibold mb-4">Pozycje</h2>
              {errors.items ? (
                <p id="inquiry-items-error" className="text-sm text-destructive mb-3">{errors.items}</p>
              ) : null}
              {items.length === 0 ? (
                <div className="border border-border bg-white p-8 text-center text-muted-foreground">
                  <p className="mb-4 leading-relaxed max-w-md mx-auto">
                    Lista zapytania jest pusta. Prosimy dodać pozycje z oferty (ikona przy nazwie części), a następnie przesłać zapytanie zbiorczo.
                  </p>
                  <Link href="/oferta"><Button variant="outline">Otwórz ofertę</Button></Link>
                </div>
              ) : (
                <div className="border border-border bg-white divide-y divide-border">
                  {items.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.referenceNumber && (
                            <p className="text-xs font-mono text-muted-foreground">Ref. {item.referenceNumber}</p>
                          )}
                        </div>
                        <button type="button" onClick={() => removeItem(index)} className="text-muted-foreground hover:text-destructive" aria-label={`Usuń ${item.name}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <Label htmlFor={`qty-${index}`} className="text-xs">Ilość</Label>
                        <Input
                          id={`qty-${index}`}
                          type="number"
                          min={1}
                          className="w-20 h-8"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(index, Number(e.target.value))}
                        />
                        <Input
                          placeholder="np. preferowany termin dostawy, inny przekrój"
                          className="h-8"
                          value={item.note ?? ""}
                          onChange={(e) => updateNote(index, e.target.value)}
                          aria-label={`Uwaga do ${item.name}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} noValidate className="lg:col-span-2 bg-white border border-border p-6 space-y-3 self-start lg:sticky lg:top-20">
              <div className="h-1 w-12 bg-primary mb-4" />
              <h2 className="font-semibold mb-2">Dane do oferty</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Do przygotowania oferty niezbędne są nazwa firmy oraz osoba kontaktowa. NIP i telefon przyspieszają wystawienie faktury oraz kontakt, nie są jednak wymagane.
              </p>
              {errorKeys.length > 0 ? (
                <div
                  ref={summaryRef}
                  tabIndex={-1}
                  role="alert"
                  className="border border-destructive bg-destructive/5 p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="font-semibold text-sm mb-2">Formularz zawiera błędy</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {errorKeys.map((key) => (
                      <li key={key}>
                        <a href={`#inquiry-${key}`} className="underline underline-offset-2">
                          {FIELD_LABELS[key]}: {errors[key]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div>
                <Label htmlFor="inquiry-companyName">Nazwa firmy *</Label>
                <Input
                  id="inquiry-companyName"
                  value={form.companyName}
                  aria-invalid={Boolean(errors.companyName)}
                  aria-describedby={errors.companyName ? "inquiry-companyName-error" : undefined}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
                {errors.companyName ? <p id="inquiry-companyName-error" className="text-sm text-destructive mt-1">{errors.companyName}</p> : null}
              </div>
              <div>
                <Label htmlFor="inquiry-nip">NIP</Label>
                <Input id="inquiry-nip" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="inquiry-contactName">Osoba kontaktowa *</Label>
                <Input
                  id="inquiry-contactName"
                  value={form.contactName}
                  aria-invalid={Boolean(errors.contactName)}
                  aria-describedby={errors.contactName ? "inquiry-contactName-error" : undefined}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
                {errors.contactName ? <p id="inquiry-contactName-error" className="text-sm text-destructive mt-1">{errors.contactName}</p> : null}
              </div>
              <div>
                <Label htmlFor="inquiry-contactEmail">E-mail *</Label>
                <Input
                  id="inquiry-contactEmail"
                  type="email"
                  value={form.contactEmail}
                  aria-invalid={Boolean(errors.contactEmail)}
                  aria-describedby={errors.contactEmail ? "inquiry-contactEmail-error" : undefined}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                />
                {errors.contactEmail ? <p id="inquiry-contactEmail-error" className="text-sm text-destructive mt-1">{errors.contactEmail}</p> : null}
              </div>
              <div>
                <Label htmlFor="inquiry-contactPhone">Telefon</Label>
                <Input id="inquiry-contactPhone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="inquiry-notes">Uwagi</Label>
                <Textarea id="inquiry-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <Button type="submit" className="w-full h-11" disabled={send.isPending}>
                {send.isPending ? "Wysyłanie..." : "Wyślij zapytanie"}
              </Button>
            </form>
          </div>
        )}
      </div>
      </div>
    </PublicLayout>
  );
}
