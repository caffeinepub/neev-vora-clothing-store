import { Package, Smartphone } from "lucide-react";
import { useState } from "react";
import { navigate } from "../App";
import { Variant_COD_GPay } from "../backend";
import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext";
import { useActor } from "../hooks/useActor";

export default function Payment() {
  const { actor } = useActor();
  const { items, totalPrice, clearCart } = useCart();
  const { checkoutData } = useCheckout();
  const [method, setMethod] = useState<"COD" | "GPay">("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!checkoutData || items.length === 0) {
    navigate("cart");
    return null;
  }

  const handleConfirm = async () => {
    if (!actor) {
      setError("Unable to connect. Please try again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const orderItems = items.map((i) => ({
        productId: i.id,
        size: i.colour ? `${i.size} | ${i.colour}` : i.size,
        quantity: BigInt(i.quantity),
      }));
      const fullAddress = `${checkoutData.address}, ${checkoutData.city} - ${checkoutData.pincode}`;
      const orderId = await actor.placeOrder(
        orderItems,
        fullAddress,
        checkoutData.phone,
        method === "COD" ? Variant_COD_GPay.COD : Variant_COD_GPay.GPay,
        totalPrice,
      );
      // Store order info for confirmation page
      localStorage.setItem("me_last_order_id", orderId);
      localStorage.setItem("me_last_order_total", String(Number(totalPrice)));
      localStorage.setItem("me_customer_name", checkoutData.name || "");
      clearCart();
      navigate("order-confirmation");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to place order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1
          className="text-3xl font-black tracking-widest mb-8"
          style={{ color: "#D4AF37" }}
        >
          PAYMENT
        </h1>

        {/* Method Toggle */}
        <div className="glass-card p-2 flex gap-2 mb-6">
          <button
            type="button"
            data-ocid="payment.cod.toggle"
            onClick={() => setMethod("COD")}
            className="flex-1 py-3 rounded-lg text-sm font-bold tracking-wider flex items-center justify-center gap-2 transition-all"
            style={{
              background: method === "COD" ? "#D4AF37" : "transparent",
              color: method === "COD" ? "#000" : "#D4AF37",
            }}
          >
            <Package size={16} /> CASH ON DELIVERY
          </button>
          <button
            type="button"
            data-ocid="payment.gpay.toggle"
            onClick={() => setMethod("GPay")}
            className="flex-1 py-3 rounded-lg text-sm font-bold tracking-wider flex items-center justify-center gap-2 transition-all"
            style={{
              background: method === "GPay" ? "#D4AF37" : "transparent",
              color: method === "GPay" ? "#000" : "#D4AF37",
            }}
          >
            <Smartphone size={16} /> GOOGLE PAY
          </button>
        </div>

        {method === "COD" && (
          <div
            data-ocid="payment.cod.panel"
            className="glass-card p-6 text-center mb-6"
          >
            <Package
              size={48}
              className="mx-auto mb-4"
              style={{ color: "#D4AF37" }}
            />
            <h3
              className="text-lg font-bold tracking-wider mb-2"
              style={{ color: "#D4AF37" }}
            >
              Cash on Delivery
            </h3>
            <p className="text-sm" style={{ color: "rgba(212,175,55,0.6)" }}>
              Pay in cash when your order is delivered to your doorstep.
            </p>
          </div>
        )}

        {method === "GPay" && (
          <div
            data-ocid="payment.gpay.panel"
            className="glass-card p-6 text-center mb-6"
          >
            <p
              className="text-xs tracking-[0.3em] mb-4"
              style={{ color: "rgba(212,175,55,0.5)" }}
            >
              SCAN TO PAY
            </p>
            <a
              href="upi://pay?pa=voraneev2828@okhdfcbank&pn=Meet+Enterprise"
              className="block flex justify-center"
            >
              <div
                style={{
                  background: "white",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "4px solid #D4AF37",
                  display: "inline-block",
                }}
              >
                <img
                  src="/assets/uploads/GooglePay_QR-1.png"
                  alt="GPay QR"
                  className="w-48 h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                />
              </div>
            </a>
            <p
              className="mt-4 text-sm font-bold tracking-wider"
              style={{ color: "#D4AF37" }}
            >
              voraneev2828@okhdfcbank
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(212,175,55,0.5)" }}
            >
              Tap QR to open UPI app
            </p>
          </div>
        )}

        <div className="glass-card p-4 flex justify-between items-center mb-6">
          <span className="text-sm tracking-wider" style={{ color: "#D4AF37" }}>
            Total Amount
          </span>
          <span className="text-xl font-black" style={{ color: "#D4AF37" }}>
            ₹{(Number(totalPrice) / 100).toLocaleString("en-IN")}
          </span>
        </div>

        {error && (
          <div
            data-ocid="payment.error_state"
            className="mb-4 p-3 rounded-lg text-sm"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="button"
          data-ocid="payment.confirm.button"
          onClick={handleConfirm}
          disabled={loading}
          className="btn-gold w-full py-4 text-sm tracking-widest font-black disabled:opacity-50"
        >
          {loading ? "PLACING ORDER..." : "CONFIRM ORDER"}
        </button>
      </div>
    </div>
  );
}
