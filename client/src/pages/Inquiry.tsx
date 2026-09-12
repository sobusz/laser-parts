import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PublicLayout from "@/components/PublicLayout";
import QuantityStepper from "@/components/QuantityStepper";
import { useInquiry } from "@/contexts/InquiryContext";
import { trpc } from "@/lib/trpc";
import { useLocale } from "@/i18n/locale";
import type { MessageKey } from "@/i18n/messages";

type FieldKey = "items" | "companyName" | "contactName" | "contactEmail";
const FORM_KEY = "laser-parts-inquiry-form";
const isPreview = import.meta.env.VITE_PREVIEW === "true";

const emptyForm = {
  companyName: "",
  nip: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  notes: "",
};

export default function Inquiry() {
  const { t } = useLocale();
  const { items, updateQuantity, removeItem, updateNote, clear } = useInquiry();
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [testTicket, setTestTicket] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState(() => {
    try {
      const stored = sessionStorage.getItem(FORM_KEY);
      return stored ? { ...emptyForm, ...JSON.parse(stored) } : emptyForm;
    } catch {
      return emptyForm;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(FORM_KEY, JSON.stringify(form));
  }, [form]);

  const send = trpc.inquiries.create.useMutation();

  const fieldLabels: Record<FieldKey, string> = {
    items: t("inquiry.items"),
    companyName: t("inquiry.company"),
    contactName: t("inquiry.person"),
    contactEmail: t("inquiry.email"),
  };

  function validate(): Partial<Record<FieldKey, string>> {
    const next: Partial<Record<FieldKey, string>> = {};
    if (items.length === 0) next.items = t("inquiry.errItems");
    if (!form.companyName.trim()) next.companyName = t("inquiry.errCompany");
    if (!form.contactName.trim()) next.contactName = t("inquiry.errPerson");
    if (!form.contactEmail.trim()) next.contactEmail = t("inquiry.errEmail");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) next.contactEmail = t("inquiry.errEmailBad");
    return next;
  }

  function acceptFiles(list: FileList | null) {
    if (!list) return;
    const allowed = /\.(pdf|jpe?g|png|xlsx?|docx?)$/i;
    const next: File[] = [];
    let rejected = false;
    for (const file of Array.from(list)) {
      if (!allowed.test(file.name) || file.size > 8 * 1024 * 1024) {
        rejected = true;
        continue;
      }
      next.push(file);
    }
    setFiles(next);
    setFileError(rejected ? t("inquiry.fileErr") : "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const fileNote = files.length ? `Załączniki testowe: ${files.map((f) => f.name).join(", ")}` : "";
    const notes = [form.notes.trim(), fileNote].filter(Boolean).join("\n");
    if (isPreview) {
      const ticket = `ZP-TEST-${Date.now().toString().slice(-6)}`;
      setTestTicket(ticket);
      clear();
      return;
    }
    send.mutate({
      ...form,
      notes,
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
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t("inquiry.title")}</h1>
          <p className="text-muted-foreground max-w-2xl">{t("inquiry.lead")}</p>
        </div>
      </div>
      <div className="container py-8">
        {isPreview ? (
          <p className="mb-6 border border-border bg-muted/50 p-4 text-sm leading-relaxed">{t("inquiry.demo")}</p>
        ) : null}
        {testTicket || send.isSuccess ? (
          <p className="mb-6 border border-border bg-white p-4 text-sm">
            {t("inquiry.testOk")} {testTicket ?? send.data?.inquiryNumber}
            {files.length ? ` — ${files.map((f) => f.name).join(", ")}` : ""}
          </p>
        ) : null}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3" id="inquiry-items">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="font-semibold">{t("inquiry.items")}</h2>
              <Link href="/oferta" className="text-sm font-semibold underline underline-offset-4">
                {t("inquiry.openCatalog")}
              </Link>
            </div>
            {errors.items ? <p className="text-sm text-destructive mb-3">{errors.items}</p> : null}
            {items.length === 0 ? (
              <div className="border border-border bg-white p-8 text-center text-muted-foreground">
                <p className="mb-4">{t("inquiry.empty")}</p>
                <Link href="/oferta">
                  <Button variant="outline">{t("nav.catalog")}</Button>
                </Link>
              </div>
            ) : (
              <div className="border border-border bg-white divide-y divide-border">
                {items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.referenceNumber ? (
                          <p className="text-xs font-mono text-muted-foreground">Ref. {item.referenceNumber}</p>
                        ) : null}
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.packSize
                            ? `${t("product.pack")} (${item.packSize} ${t("product.pcs")})`
                            : item.unit || t("product.pcs")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="h-11 px-3 text-sm text-muted-foreground hover:text-destructive"
                        aria-label={`${t("inquiry.remove")} ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                      <QuantityStepper value={item.quantity} onChange={(value) => updateQuantity(index, value)} />
                      <Input
                        placeholder={t("inquiry.note")}
                        className="h-11"
                        value={item.note ?? ""}
                        onChange={(e) => updateNote(index, e.target.value)}
                        aria-label={`${t("inquiry.note")} ${item.name}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-4 text-sm text-muted-foreground">{t("catalog.promo")}</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="lg:col-span-2 bg-white border border-border p-6 space-y-3 self-start lg:sticky lg:top-24">
            <h2 className="font-semibold mb-2">{t("inquiry.form")}</h2>
            {errorKeys.length > 0 ? (
              <div
                ref={summaryRef}
                tabIndex={-1}
                role="alert"
                className="border border-destructive bg-destructive/5 p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <p className="font-semibold text-sm mb-2">{t("inquiry.errors")}</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {errorKeys.map((key) => (
                    <li key={key}>
                      <a href={`#inquiry-${key}`} className="underline underline-offset-2">
                        {fieldLabels[key]}: {errors[key]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {(
              [
                ["companyName", "inquiry.company", true],
                ["nip", "inquiry.nip", false],
                ["contactName", "inquiry.person", true],
                ["contactEmail", "inquiry.email", true],
                ["contactPhone", "inquiry.phone", false],
              ] as const
            ).map(([field, labelKey, required]) => (
              <div key={field}>
                <Label htmlFor={`inquiry-${field}`}>
                  {t(labelKey as MessageKey)}
                  {required ? " *" : ""}
                </Label>
                <Input
                  id={`inquiry-${field}`}
                  type={field === "contactEmail" ? "email" : "text"}
                  value={form[field]}
                  aria-invalid={Boolean(errors[field as FieldKey])}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
                {errors[field as FieldKey] ? (
                  <p className="text-sm text-destructive mt-1">{errors[field as FieldKey]}</p>
                ) : null}
              </div>
            ))}
            <div>
              <Label htmlFor="inquiry-notes">{t("inquiry.notes")}</Label>
              <Textarea id="inquiry-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">{t("inquiry.files")}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">{t("inquiry.filesHint")}</p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx,.doc,.docx"
                className="block w-full text-sm"
                onChange={(event) => acceptFiles(event.target.files)}
              />
              {fileError ? <p className="text-sm text-destructive mt-1">{fileError}</p> : null}
              {files.length > 0 ? (
                <ul className="mt-2 text-xs text-muted-foreground">
                  {files.map((file) => (
                    <li key={file.name}>
                      {file.name} ({Math.round(file.size / 1024)} kB)
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <Button type="submit" className="w-full h-11" disabled={send.isPending}>
              {t("inquiry.submit")}
            </Button>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
}
