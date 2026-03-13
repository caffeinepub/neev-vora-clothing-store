import { ShoppingBag } from "lucide-react";
import { navigate } from "../App";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { currentUser } = useAuth();

  return (
    <div
      className="min-h-screen px-4 py-16"
      style={{ background: "#000", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="max-w-2xl mx-auto">
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
        ) : (
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
        )}
      </div>
    </div>
  );
}
