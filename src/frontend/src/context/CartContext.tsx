import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: bigint;
  imageUrl: string;
  size: string;
  colour?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, colour?: string) => void;
  updateQuantity: (
    id: string,
    size: string,
    qty: number,
    colour?: string,
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: bigint;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved
        ? JSON.parse(saved, (k, v) => (k === "price" ? BigInt(v) : v))
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(items, (_k, v) =>
          typeof v === "bigint" ? v.toString() : v,
        ),
      );
    } catch {}
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.id === item.id && i.size === item.size && i.colour === item.colour,
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size && i.colour === item.colour
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string, size: string, colour?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.id === id && i.size === size && i.colour === colour),
      ),
    );
  };

  const updateQuantity = (
    id: string,
    size: string,
    qty: number,
    colour?: string,
  ) => {
    if (qty <= 0) {
      removeItem(id, size, colour);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size && i.colour === colour
          ? { ...i, quantity: qty }
          : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce(
    (s, i) => s + i.price * BigInt(i.quantity),
    0n,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
