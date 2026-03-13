import { type ReactNode, createContext, useContext, useState } from "react";

export interface CheckoutData {
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  email: string;
}

interface CheckoutContextType {
  checkoutData: CheckoutData | null;
  setCheckoutData: (data: CheckoutData) => void;
  lastOrderId: string | null;
  setLastOrderId: (id: string) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  return (
    <CheckoutContext.Provider
      value={{ checkoutData, setCheckoutData, lastOrderId, setLastOrderId }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
