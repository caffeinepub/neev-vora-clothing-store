import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { navigate } from "../App";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0)
    return (
      <div
        data-ocid="cart.empty_state"
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#000" }}
      >
        <ShoppingBag
          size={64}
          className="mb-6 opacity-30"
          style={{ color: "#D4AF37" }}
        />
        <p
          className="text-xl font-bold tracking-wider mb-2"
          style={{ color: "#D4AF37" }}
        >
          Your cart is empty
        </p>
        <p className="text-sm mb-8" style={{ color: "rgba(212,175,55,0.5)" }}>
          Add some luxury to your life
        </p>
        <button
          type="button"
          data-ocid="cart.shop.button"
          onClick={() => navigate("catalog")}
          className="btn-gold px-8 py-3 tracking-widest font-bold text-sm"
        >
          SHOP NOW
        </button>
      </div>
    );

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1
          className="text-3xl font-black tracking-widest mb-8"
          style={{ color: "#D4AF37" }}
        >
          YOUR CART
        </h1>

        <div className="space-y-4 mb-8">
          {items.map((item, i) => (
            <div
              key={`${item.id}-${item.size}-${item.colour ?? ""}`}
              data-ocid={`cart.item.${i + 1}`}
              className="glass-card p-4 flex items-center gap-4"
            >
              <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-2xl"
                    style={{ background: "rgba(212,175,55,0.05)" }}
                  >
                    👔
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-sm tracking-wider truncate"
                  style={{ color: "#D4AF37" }}
                >
                  {item.name}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(212,175,55,0.5)" }}
                >
                  Size: {item.size}
                </p>
                {item.colour && (
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(212,175,55,0.2)",
                      border: "1px solid rgba(212,175,55,0.5)",
                      color: "#D4AF37",
                    }}
                  >
                    🎨 {item.colour}
                  </span>
                )}
                <p
                  className="text-sm font-bold mt-1"
                  style={{ color: "#D4AF37" }}
                >
                  ₹{(Number(item.price) / 100).toLocaleString("en-IN")} each
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-ocid={`cart.qty_minus.button.${i + 1}`}
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.size,
                      item.quantity - 1,
                      item.colour,
                    )
                  }
                  className="btn-outline-gold w-8 h-8 flex items-center justify-center rounded"
                >
                  <Minus size={12} />
                </button>
                <span
                  className="w-8 text-center font-bold"
                  style={{ color: "#D4AF37" }}
                >
                  {item.quantity}
                </span>
                <button
                  type="button"
                  data-ocid={`cart.qty_plus.button.${i + 1}`}
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.size,
                      item.quantity + 1,
                      item.colour,
                    )
                  }
                  className="btn-outline-gold w-8 h-8 flex items-center justify-center rounded"
                >
                  <Plus size={12} />
                </button>
              </div>

              <div className="text-right">
                <p className="font-black" style={{ color: "#D4AF37" }}>
                  ₹
                  {(
                    Number(item.price * BigInt(item.quantity)) / 100
                  ).toLocaleString("en-IN")}
                </p>
                <button
                  type="button"
                  data-ocid={`cart.delete_button.${i + 1}`}
                  onClick={() => removeItem(item.id, item.size, item.colour)}
                  className="mt-2 hover:opacity-70"
                  style={{ color: "#ef4444" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <span
              className="text-lg font-bold tracking-wider"
              style={{ color: "#D4AF37" }}
            >
              TOTAL
            </span>
            <span className="text-2xl font-black" style={{ color: "#D4AF37" }}>
              ₹{(Number(totalPrice) / 100).toLocaleString("en-IN")}
            </span>
          </div>
          <button
            type="button"
            data-ocid="cart.checkout.button"
            onClick={() => navigate("checkout")}
            className="btn-gold w-full py-4 text-sm tracking-widest font-black"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}
