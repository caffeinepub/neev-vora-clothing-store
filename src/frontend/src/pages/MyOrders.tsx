import { Package, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { navigate } from "../App";
import type { Order } from "../backend";
import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";

export default function MyOrders() {
  const { currentUser } = useAuth();
  const { actor } = useActor();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser || !actor) return;
    setLoading(true);
    setError("");
    actor
      .getOrdersByUser()
      .then(setOrders)
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, [currentUser, actor]);

  const handleCancel = async (orderId: string) => {
    if (!actor || !confirm("Cancel this order?")) return;
    try {
      await actor.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch {
      alert("Failed to cancel order.");
    }
  };

  const statusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "fulfilled" || s === "delivered")
      return { bg: "rgba(34,197,94,0.15)", color: "#22c55e" };
    if (s === "cancelled")
      return { bg: "rgba(239,68,68,0.15)", color: "#ef4444" };
    return { bg: "rgba(234,179,8,0.15)", color: "#eab308" };
  };

  return (
    <div
      className="min-h-screen px-4 py-16"
      style={{ background: "#000", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-3xl font-black tracking-widest mb-8 text-center"
          style={{ color: "#D4AF37" }}
        >
          MY ORDERS
        </h1>

        {!currentUser ? (
          <div
            data-ocid="orders.empty_state"
            className="text-center py-20 rounded-2xl"
            style={{
              background: "rgba(212,175,55,0.04)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <ShoppingBag
              size={48}
              className="mx-auto mb-4"
              style={{ color: "rgba(212,175,55,0.3)" }}
            />
            <p
              className="mb-6 text-sm tracking-wider"
              style={{ color: "rgba(212,175,55,0.6)" }}
            >
              Please login to view your orders
            </p>
            <button
              type="button"
              data-ocid="orders.login.button"
              onClick={() => navigate("auth")}
              className="px-8 py-3 text-sm font-bold tracking-widest"
              style={{
                background: "#D4AF37",
                color: "#000",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              LOGIN
            </button>
          </div>
        ) : loading ? (
          <div
            data-ocid="orders.loading_state"
            className="flex justify-center py-20"
          >
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{ borderColor: "#D4AF37", borderTopColor: "transparent" }}
            />
          </div>
        ) : error ? (
          <div
            data-ocid="orders.error_state"
            className="text-center py-12 text-sm"
            style={{ color: "#ef4444" }}
          >
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div
            data-ocid="orders.empty_state"
            className="text-center py-20 rounded-2xl"
            style={{
              background: "rgba(212,175,55,0.04)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <ShoppingBag
              size={48}
              className="mx-auto mb-4"
              style={{ color: "rgba(212,175,55,0.3)" }}
            />
            <p
              className="mb-2 text-sm tracking-wider"
              style={{ color: "rgba(212,175,55,0.6)" }}
            >
              No orders yet
            </p>
            <p
              className="mb-6 text-xs"
              style={{ color: "rgba(212,175,55,0.4)" }}
            >
              Start shopping to see your orders here.
            </p>
            <button
              type="button"
              data-ocid="orders.shop.button"
              onClick={() => navigate("catalog")}
              className="px-8 py-3 text-sm font-bold tracking-widest"
              style={{
                background: "#D4AF37",
                color: "#000",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              SHOP ALL
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const sc = statusColor(order.status);
              return (
                <div
                  key={order.id}
                  data-ocid={`orders.item.${i + 1}`}
                  className="glass-card p-5"
                  style={{ border: "1px solid rgba(212,175,55,0.2)" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p
                        className="text-xs tracking-widest mb-1"
                        style={{ color: "rgba(212,175,55,0.5)" }}
                      >
                        ORDER ID
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: "#D4AF37" }}
                      >
                        #{order.id.slice(0, 12).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="px-3 py-1 rounded text-xs font-bold"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {order.status?.toUpperCase()}
                      </span>
                      {order.status?.toLowerCase() === "pending" && (
                        <button
                          type="button"
                          data-ocid={`orders.cancel.button.${i + 1}`}
                          onClick={() => handleCancel(order.id)}
                          className="p-2 rounded hover:opacity-70"
                          style={{ color: "#ef4444" }}
                          title="Cancel Order"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs"
                    style={{ color: "rgba(212,175,55,0.7)" }}
                  >
                    <div>
                      <p
                        className="tracking-widest mb-1"
                        style={{ color: "rgba(212,175,55,0.4)" }}
                      >
                        ITEMS
                      </p>
                      <p className="flex items-center gap-1">
                        <Package size={12} /> {order.items.length} item(s)
                      </p>
                    </div>
                    <div>
                      <p
                        className="tracking-widest mb-1"
                        style={{ color: "rgba(212,175,55,0.4)" }}
                      >
                        TOTAL
                      </p>
                      <p className="font-bold" style={{ color: "#D4AF37" }}>
                        ₹{(Number(order.total) / 100).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p
                        className="tracking-widest mb-1"
                        style={{ color: "rgba(212,175,55,0.4)" }}
                      >
                        PAYMENT
                      </p>
                      <p>{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p
                        className="tracking-widest mb-1"
                        style={{ color: "rgba(212,175,55,0.4)" }}
                      >
                        ADDRESS
                      </p>
                      <p className="truncate">{order.address}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
