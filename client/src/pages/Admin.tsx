import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Package,
  ShoppingBag,
  MessageSquare,
  Tag,
  LayoutDashboard,
  Plus,
  Pencil,
  Trash2,
  Eye,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type AdminTab = "dashboard" | "products" | "categories" | "orders" | "messages";

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Oczekuje", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  paid: { label: "Opłacone", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  processing: { label: "W realizacji", color: "bg-blue-100 text-blue-700", icon: Package },
  shipped: { label: "Wysłane", color: "bg-purple-100 text-purple-700", icon: Truck },
  delivered: { label: "Dostarczone", color: "bg-gray-100 text-gray-700", icon: CheckCircle2 },
  cancelled: { label: "Anulowane", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function Admin() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center p-8">
          <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Brak dostępu</h1>
          <p className="text-muted-foreground mb-4">Ta strona jest dostępna tylko dla administratorów.</p>
          <Link href="/">
            <Button>Wróć do strony głównej</Button>
          </Link>
        </div>
      </div>
    );
  }

  const navItems: { id: AdminTab; label: string; icon: any }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Produkty", icon: Package },
    { id: "categories", label: "Kategorie", icon: Tag },
    { id: "orders", label: "Zamówienia", icon: ShoppingBag },
    { id: "messages", label: "Wiadomości", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">LP</span>
            </div>
            <span className="font-bold text-sm text-primary">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                tab === id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2 px-3">{user?.name}</div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Wyloguj
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {tab === "dashboard" && <DashboardTab />}
          {tab === "products" && <ProductsTab />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "messages" && <MessagesTab />}
        </div>
      </main>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab() {
  const { data: orders } = trpc.orders.list.useQuery();
  const { data: products } = trpc.products.list.useQuery();
  const { data: messages } = trpc.contact.list.useQuery();

  const pendingOrders = orders?.filter((o) => o.status === "pending").length ?? 0;
  const unreadMessages = messages?.filter((m) => !m.read).length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Produkty", value: products?.length ?? 0, icon: Package, color: "text-blue-600 bg-blue-50" },
          { label: "Zamówienia", value: orders?.length ?? 0, icon: ShoppingBag, color: "text-green-600 bg-green-50" },
          { label: "Oczekujące", value: pendingOrders, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
          { label: "Nowe wiadomości", value: unreadMessages, icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-lg border border-border p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-border p-5">
        <h2 className="font-semibold mb-3">Ostatnie zamówienia</h2>
        {orders && orders.length > 0 ? (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => {
              const s = STATUS_LABELS[order.status];
              return (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium font-mono">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.companyName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{Number(order.totalAmount).toFixed(2)} zł</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Brak zamówień</p>
        )}
      </div>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();
  const deleteProduct = trpc.products.delete.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); toast.success("Produkt usunięty"); },
  });
  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); setDialogOpen(false); toast.success("Produkt dodany"); },
  });
  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => { utils.products.list.invalidate(); setDialogOpen(false); toast.success("Produkt zaktualizowany"); },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    referenceNumber: "",
    description: "",
    price: "",
    unit: "szt.",
    inStock: true,
    featured: false,
  });

  function openCreate() {
    setEditingProduct(null);
    setForm({ categoryId: "", name: "", slug: "", referenceNumber: "", description: "", price: "", unit: "szt.", inStock: true, featured: false });
    setDialogOpen(true);
  }

  function openEdit(p: any) {
    setEditingProduct(p);
    setForm({
      categoryId: String(p.categoryId),
      name: p.name,
      slug: p.slug,
      referenceNumber: p.referenceNumber ?? "",
      description: p.description ?? "",
      price: p.price ?? "",
      unit: p.unit,
      inStock: p.inStock,
      featured: p.featured,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name || !form.slug || !form.categoryId) {
      toast.error("Wypełnij wymagane pola");
      return;
    }
    const data = {
      categoryId: Number(form.categoryId),
      name: form.name,
      slug: form.slug,
      referenceNumber: form.referenceNumber || undefined,
      description: form.description || undefined,
      price: form.price || undefined,
      unit: form.unit,
      inStock: form.inStock,
      featured: form.featured,
    };
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, ...data });
    } else {
      createProduct.mutate(data);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produkty</h1>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Dodaj produkt
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Ładowanie...</div>
        ) : products && products.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nazwa</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Ref.</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Cena</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{p.name}</p>
                    {p.featured && <span className="text-xs text-primary">Wyróżniony</span>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-muted-foreground">
                    {p.referenceNumber ?? "—"}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {p.price ? `${Number(p.price).toFixed(2)} zł` : "Na zapytanie"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={p.inStock ? "bg-green-100 text-green-700 border-green-200" : "bg-orange-100 text-orange-700"}>
                      {p.inStock ? "Dostępny" : "Na zamówienie"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/produkt/${p.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => { if (confirm("Usunąć produkt?")) deleteProduct.mutate({ id: p.id }); }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Brak produktów. Dodaj pierwszy produkt.</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edytuj produkt" : "Dodaj produkt"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Kategoria *</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger><SelectValue placeholder="Wybierz kategorię" /></SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nazwa *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nr referencyjny</Label>
                <Input value={form.referenceNumber} onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })} />
              </div>
              <div>
                <Label>Cena (zł netto)</Label>
                <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
            </div>
            <div>
              <Label>Opis</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
                Dostępny w magazynie
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Wyróżniony
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Anuluj</Button>
            <Button onClick={handleSave} disabled={createProduct.isPending || updateProduct.isPending}>
              {editingProduct ? "Zapisz zmiany" : "Dodaj produkt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Categories Tab ───────────────────────────────────────────────────────────
function CategoriesTab() {
  const utils = trpc.useUtils();
  const { data: categories } = trpc.categories.list.useQuery();
  const createCat = trpc.categories.create.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); setDialogOpen(false); toast.success("Kategoria dodana"); },
  });
  const deleteCat = trpc.categories.delete.useMutation({
    onSuccess: () => { utils.categories.list.invalidate(); toast.success("Kategoria usunięta"); },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kategorie</h1>
        <Button onClick={() => { setForm({ name: "", slug: "", description: "" }); setDialogOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Dodaj kategorię
        </Button>
      </div>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        {categories && categories.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nazwa</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Opis</th>
                <th className="text-right px-4 py-3 font-medium">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.slug}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground line-clamp-1">{c.description ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => { if (confirm("Usunąć kategorię?")) deleteCat.mutate({ id: c.id }); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-muted-foreground">Brak kategorii.</div>
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Dodaj kategorię</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label>Nazwa *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Slug *</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div><Label>Opis</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Anuluj</Button>
            <Button onClick={() => {
              if (!form.name || !form.slug) { toast.error("Wypełnij wymagane pola"); return; }
              createCat.mutate(form);
            }} disabled={createCat.isPending}>Dodaj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const { data: orders, isLoading } = trpc.orders.list.useQuery();
  const utils = trpc.useUtils();
  const updateStatus = trpc.orders.updateStatus.useMutation({
    onSuccess: () => { utils.orders.list.invalidate(); toast.success("Status zaktualizowany"); },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Zamówienia</h1>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Ładowanie...</div>
        ) : orders && orders.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nr zamówienia</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Firma</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Kwota</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden xl:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const s = STATUS_LABELS[o.status];
                return (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{o.orderNumber}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="font-medium line-clamp-1">{o.companyName}</p>
                      <p className="text-xs text-muted-foreground">{o.contactEmail}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell font-semibold">
                      {Number(o.totalAmount).toFixed(2)} zł
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={o.status}
                        onValueChange={(v) => updateStatus.mutate({ id: o.id, status: v as any })}
                      >
                        <SelectTrigger className={`h-7 text-xs w-36 ${s.color}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_LABELS).map(([key, val]) => (
                            <SelectItem key={key} value={key}>{val.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString("pl-PL")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-muted-foreground">Brak zamówień.</div>
        )}
      </div>
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────
function MessagesTab() {
  const { data: messages, isLoading } = trpc.contact.list.useQuery();
  const utils = trpc.useUtils();
  const markRead = trpc.contact.markRead.useMutation({
    onSuccess: () => utils.contact.list.invalidate(),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Wiadomości kontaktowe</h1>
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Ładowanie...</div>
        ) : messages && messages.length > 0 ? (
          messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-lg border p-4 ${m.read ? "border-border" : "border-primary/30 bg-primary/5"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{m.name}</p>
                    {!m.read && <Badge className="bg-primary text-primary-foreground text-xs">Nowa</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{m.email} {m.companyName && `· ${m.companyName}`}</p>
                  {m.subject && <p className="text-sm font-medium mb-1">{m.subject}</p>}
                  <p className="text-sm text-muted-foreground line-clamp-2">{m.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.createdAt).toLocaleDateString("pl-PL")}
                  </p>
                  {!m.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => markRead.mutate({ id: m.id })}
                    >
                      Oznacz jako przeczytane
                    </Button>
                  )}
                  <a href={`mailto:${m.email}`}>
                    <Button size="sm" variant="outline" className="text-xs h-7">Odpowiedz</Button>
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground bg-white rounded-lg border border-border">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Brak wiadomości.</p>
          </div>
        )}
      </div>
    </div>
  );
}
