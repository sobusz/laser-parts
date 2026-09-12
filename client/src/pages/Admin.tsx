import { useState } from "react";
import { Link } from "wouter";
import {
  Package,
  MessageSquare,
  Tag,
  LayoutDashboard,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  FileText,
  ClipboardList,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type AdminTab = "dashboard" | "products" | "categories" | "articles" | "machines" | "inquiries" | "messages";

const INQUIRY_STATUS: Record<string, string> = {
  new: "Nowe",
  in_progress: "W realizacji",
  closed: "Zamknięte",
};

export default function Admin() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Ładowanie...</div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center p-8">
          <h1 className="text-xl font-bold mb-2">Brak dostępu</h1>
          <p className="text-muted-foreground mb-4">Panel tylko dla administratorów.</p>
          <Link href="/admin/login"><Button>Zaloguj się</Button></Link>
        </div>
      </div>
    );
  }

  const navItems: { id: AdminTab; label: string; icon: typeof Package }[] = [
    { id: "dashboard", label: "Pulpit", icon: LayoutDashboard },
    { id: "products", label: "Produkty", icon: Package },
    { id: "categories", label: "Kategorie", icon: Tag },
    { id: "articles", label: "Baza wiedzy", icon: FileText },
    { id: "machines", label: "Maszyny", icon: Wrench },
    { id: "inquiries", label: "Zapytania", icon: ClipboardList },
    { id: "messages", label: "Wiadomości", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-56 bg-white border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <Link href="/" className="font-bold text-sm text-primary">Laser Parts Admin</Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md ${
                tab === id ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2 px-3">{user?.email}</div>
          <button onClick={() => logout()} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted">
            <LogOut className="w-4 h-4" />
            Wyloguj
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        {tab === "dashboard" && <DashboardTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "articles" && <ArticlesTab />}
        {tab === "machines" && <MachinesTab />}
        {tab === "inquiries" && <InquiriesTab />}
        {tab === "messages" && <MessagesTab />}
      </main>
    </div>
  );
}

function DashboardTab() {
  const { data: products } = trpc.products.list.useQuery();
  const { data: inquiries } = trpc.inquiries.list.useQuery();
  const { data: messages } = trpc.contact.list.useQuery();
  const unread = messages?.filter((m) => !m.read).length ?? 0;
  const openInquiries = inquiries?.filter((i) => i.status !== "closed").length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pulpit</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Produkty", value: products?.length ?? 0 },
          { label: "Otwarte zapytania", value: openInquiries },
          { label: "Nowe wiadomości", value: unread },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-border p-5">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsTab() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();
  const deleteProduct = trpc.products.delete.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); toast.success("Usunięto"); },
  });
  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); setOpen(false); toast.success("Dodano"); },
  });
  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); setOpen(false); toast.success("Zapisano"); },
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const empty = {
    categoryId: "", name: "", slug: "", referenceNumber: "", orderNumber: "", groupName: "",
    description: "", specifications: "", imageUrl: "", sketchUrl: "", price: "", unit: "szt.", inStock: true, featured: false,
  };
  const [form, setForm] = useState(empty);

  function slugFromName(name: string) {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function save() {
    if (!form.name || !form.slug || !form.categoryId) {
      toast.error("Wypełnij nazwę, slug i kategorię");
      return;
    }
    const data = {
      categoryId: Number(form.categoryId),
      name: form.name,
      slug: form.slug,
      referenceNumber: form.referenceNumber || null,
      orderNumber: form.orderNumber || null,
      groupName: form.groupName || null,
      description: form.description || null,
      specifications: form.specifications || null,
      imageUrl: form.imageUrl || null,
      sketchUrl: form.sketchUrl || null,
      price: form.price || null,
      unit: form.unit,
      inStock: form.inStock,
      featured: form.featured,
    };
    if (editing) updateProduct.mutate({ id: editing.id, ...data });
    else createProduct.mutate(data);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produkty</h1>
        <Button onClick={() => { setEditing(null); setForm(empty); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Dodaj
        </Button>
      </div>
      <div className="bg-white border border-border overflow-x-auto">
        {isLoading ? <p className="p-6 text-muted-foreground">Ładowanie...</p> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-3 py-2">Nazwa</th>
                <th className="text-left px-3 py-2">Ref.</th>
                <th className="text-left px-3 py-2">Cena</th>
                <th className="text-right px-3 py-2">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2 font-mono text-xs">{p.referenceNumber ?? "—"}</td>
                  <td className="px-3 py-2">{p.price ? `${p.price} zł` : "na zapytanie"}</td>
                  <td className="px-3 py-2 text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                      setEditing(p);
                      setForm({
                        categoryId: String(p.categoryId), name: p.name, slug: p.slug,
                        referenceNumber: p.referenceNumber ?? "", orderNumber: p.orderNumber ?? "",
                        groupName: p.groupName ?? "", description: p.description ?? "",
                        specifications: p.specifications ?? "", imageUrl: p.imageUrl ?? "",
                        sketchUrl: p.sketchUrl ?? "", price: p.price ?? "", unit: p.unit,
                        inStock: p.inStock, featured: p.featured,
                      });
                      setOpen(true);
                    }}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Usunąć?")) deleteProduct.mutate({ id: p.id }); }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edytuj produkt" : "Nowy produkt"}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Kategoria</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger><SelectValue placeholder="Kategoria" /></SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nazwa</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugFromName(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div><Label>Grupa (tabela)</Label><Input value={form.groupName} onChange={(e) => setForm({ ...form, groupName: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nr referencyjny</Label><Input value={form.referenceNumber} onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })} /></div>
              <div><Label>Nr zamówieniowy</Label><Input value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Cena netto (puste = na zapytanie)</Label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div><Label>Jednostka</Label><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
            </div>
            <div><Label>URL szkicu</Label><Input value={form.sketchUrl} onChange={(e) => setForm({ ...form, sketchUrl: e.target.value })} /></div>
            <div><Label>Opis</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Specyfikacja</Label><Textarea rows={3} value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Anuluj</Button>
            <Button onClick={save}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoriesTab() {
  const utils = trpc.useUtils();
  const { data: categories } = trpc.categories.list.useQuery();
  const createCat = trpc.categories.create.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); setOpen(false); toast.success("Dodano"); },
  });
  const deleteCat = trpc.categories.delete.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); toast.success("Usunięto"); },
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Kategorie</h1>
        <Button onClick={() => { setForm({ name: "", slug: "", description: "" }); setOpen(true); }} className="gap-2"><Plus className="w-4 h-4" /> Dodaj</Button>
      </div>
      <div className="bg-white border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b"><tr><th className="text-left px-3 py-2">Nazwa</th><th className="text-left px-3 py-2">Slug</th><th /></tr></thead>
          <tbody>
            {categories?.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2 font-mono text-xs">{c.slug}</td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Usunąć?")) deleteCat.mutate({ id: c.id }); }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nowa kategoria</DialogTitle></DialogHeader>
          <Label>Nazwa</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || e.target.value.toLowerCase() })} />
          <Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Label>Opis</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <DialogFooter>
            <Button onClick={() => { if (!form.name || !form.slug) return toast.error("Wymagane pola"); createCat.mutate(form); }}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ArticlesTab() {
  const utils = trpc.useUtils();
  const { data: articles } = trpc.articles.adminList.useQuery();
  const createA = trpc.articles.create.useMutation({ onSuccess: () => { utils.articles.adminList.invalidate(); setOpen(false); toast.success("Dodano"); } });
  const updateA = trpc.articles.update.useMutation({ onSuccess: () => { utils.articles.adminList.invalidate(); setOpen(false); toast.success("Zapisano"); } });
  const deleteA = trpc.articles.delete.useMutation({ onSuccess: () => { utils.articles.adminList.invalidate(); toast.success("Usunięto"); } });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ slug: "", title: "", excerpt: "", body: "", section: "technologia", published: true });

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Baza wiedzy</h1>
        <Button onClick={() => { setEditing(null); setForm({ slug: "", title: "", excerpt: "", body: "", section: "technologia", published: true }); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Dodaj
        </Button>
      </div>
      <div className="bg-white border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b"><tr><th className="text-left px-3 py-2">Tytuł</th><th className="text-left px-3 py-2">Sekcja</th><th /></tr></thead>
          <tbody>
            {articles?.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="px-3 py-2">{a.title}</td>
                <td className="px-3 py-2">{a.section}</td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                    setEditing(a);
                    setForm({ slug: a.slug, title: a.title, excerpt: a.excerpt ?? "", body: a.body, section: a.section, published: a.published });
                    setOpen(true);
                  }}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Usunąć?")) deleteA.mutate({ id: a.id }); }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edytuj artykuł" : "Nowy artykuł"}</DialogTitle></DialogHeader>
          <Label>Tytuł</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Label>Sekcja</Label>
          <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["technologia", "optyka", "nowosc", "oprogramowanie", "strona"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Label>Zajawka</Label><Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <Label>Treść</Label><Textarea rows={12} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <DialogFooter>
            <Button onClick={() => {
              const payload = { ...form, excerpt: form.excerpt || null, section: form.section as any };
              if (editing) updateA.mutate({ id: editing.id, ...payload });
              else createA.mutate(payload);
            }}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MachinesTab() {
  const utils = trpc.useUtils();
  const { data: machines } = trpc.machines.adminList.useQuery();
  const createM = trpc.machines.create.useMutation({ onSuccess: () => { utils.machines.adminList.invalidate(); setOpen(false); toast.success("Dodano"); } });
  const updateM = trpc.machines.update.useMutation({ onSuccess: () => { utils.machines.adminList.invalidate(); toast.success("Zapisano"); } });
  const deleteM = trpc.machines.delete.useMutation({ onSuccess: () => { utils.machines.adminList.invalidate(); toast.success("Usunięto"); } });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", contactNote: "", active: false });

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Maszyny używane</h1>
        <Button onClick={() => { setForm({ title: "", slug: "", description: "", contactNote: "", active: false }); setOpen(true); }} className="gap-2"><Plus className="w-4 h-4" /> Dodaj</Button>
      </div>
      <div className="space-y-3">
        {machines?.map((m) => (
          <div key={m.id} className="bg-white border p-4 flex justify-between gap-4">
            <div>
              <p className="font-medium">{m.title} {!m.active && <Badge variant="secondary">ukryta</Badge>}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{m.description}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => updateM.mutate({ id: m.id, active: !m.active })}>
                {m.active ? "Ukryj" : "Pokaż"}
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Usunąć?")) deleteM.mutate({ id: m.id }); }}>Usuń</Button>
            </div>
          </div>
        ))}
        {machines?.length === 0 && <p className="text-muted-foreground">Brak ogłoszeń. Seed wstawia TRUMATIC L3030 ze starej oferty — można wyłączyć.</p>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nowe ogłoszenie</DialogTitle></DialogHeader>
          <Label>Tytuł</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
          <Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Label>Opis</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Label>Kontakt</Label><Input value={form.contactNote} onChange={(e) => setForm({ ...form, contactNote: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Widoczne na stronie</label>
          <DialogFooter>
            <Button onClick={() => createM.mutate({ ...form, description: form.description || null, contactNote: form.contactNote || null })}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InquiriesTab() {
  const { data: inquiries } = trpc.inquiries.list.useQuery();
  const utils = trpc.useUtils();
  const updateStatus = trpc.inquiries.updateStatus.useMutation({ onSuccess: () => utils.inquiries.list.invalidate() });
  const [openId, setOpenId] = useState<number | null>(null);
  const { data: detail } = trpc.inquiries.detail.useQuery({ id: openId ?? 0 }, { enabled: !!openId });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Zapytania ofertowe</h1>
      <div className="bg-white border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left px-3 py-2">Nr</th>
              <th className="text-left px-3 py-2">Firma</th>
              <th className="text-left px-3 py-2">Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {inquiries?.map((i) => (
              <tr key={i.id} className="border-b">
                <td className="px-3 py-2 font-mono text-xs">{i.inquiryNumber}</td>
                <td className="px-3 py-2">{i.companyName}<div className="text-xs text-muted-foreground">{i.contactEmail}</div></td>
                <td className="px-3 py-2">
                  <Select value={i.status} onValueChange={(v) => updateStatus.mutate({ id: i.id, status: v as any })}>
                    <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(INQUIRY_STATUS).map(([k, lab]) => <SelectItem key={k} value={k}>{lab}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2"><Button size="sm" variant="outline" onClick={() => setOpenId(i.id)}>Szczegóły</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!openId} onOpenChange={() => setOpenId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{detail?.inquiryNumber}</DialogTitle></DialogHeader>
          {detail && (
            <div className="text-sm space-y-2">
              <p>{detail.companyName} · NIP {detail.nip ?? "—"}</p>
              <p>{detail.contactName}, {detail.contactEmail}, {detail.contactPhone}</p>
              {detail.notes && <p className="text-muted-foreground">{detail.notes}</p>}
              <ul className="list-disc pl-5">
                {detail.items.map((it) => (
                  <li key={it.id}>{it.quantity}× {it.productName} {it.referenceNumber ? `(${it.referenceNumber})` : ""}</li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MessagesTab() {
  const { data: messages, isLoading } = trpc.contact.list.useQuery();
  const utils = trpc.useUtils();
  const markRead = trpc.contact.markRead.useMutation({ onSuccess: () => utils.contact.list.invalidate() });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Wiadomości</h1>
      <div className="space-y-3">
        {isLoading && <p>Ładowanie...</p>}
        {messages?.map((m) => (
          <div key={m.id} className={`bg-white border p-4 ${m.read ? "" : "border-primary/40"}`}>
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-semibold text-sm">{m.name} {!m.read && <Badge>Nowa</Badge>}</p>
                <p className="text-xs text-muted-foreground">{m.email} {m.companyName && `· ${m.companyName}`}</p>
                {m.subject && <p className="text-sm font-medium mt-1">{m.subject}</p>}
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{m.message}</p>
              </div>
              <div className="flex flex-col gap-2">
                {!m.read && <Button size="sm" variant="outline" onClick={() => markRead.mutate({ id: m.id })}>Przeczytane</Button>}
                <a href={`mailto:${m.email}`}><Button size="sm" variant="outline">Odpowiedz</Button></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
