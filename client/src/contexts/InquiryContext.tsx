import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface InquiryListItem {
  productId: number | null;
  name: string;
  referenceNumber?: string | null;
  quantity: number;
  note?: string;
  unit?: string;
}

interface InquiryContextValue {
  items: InquiryListItem[];
  totalItems: number;
  addItem: (item: Omit<InquiryListItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  updateNote: (index: number, note: string) => void;
  clear: () => void;
}

const InquiryContext = createContext<InquiryContextValue | null>(null);
const STORAGE_KEY = "laser-parts-inquiry";

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InquiryListItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  function addItem(newItem: Omit<InquiryListItem, "quantity"> & { quantity?: number }) {
    const qty = newItem.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.findIndex(
        (i) =>
          (newItem.productId && i.productId === newItem.productId) ||
          (!newItem.productId && i.referenceNumber && i.referenceNumber === newItem.referenceNumber && i.name === newItem.name)
      );
      if (existing >= 0) {
        return prev.map((i, idx) =>
          idx === existing ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...newItem, quantity: qty }];
    });
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQuantity(index: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    setItems((prev) => prev.map((i, idx) => (idx === index ? { ...i, quantity } : i)));
  }

  function updateNote(index: number, note: string) {
    setItems((prev) => prev.map((i, idx) => (idx === index ? { ...i, note } : i)));
  }

  function clear() {
    setItems([]);
  }

  return (
    <InquiryContext.Provider
      value={{ items, totalItems, addItem, removeItem, updateQuantity, updateNote, clear }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used within InquiryProvider");
  return ctx;
}
