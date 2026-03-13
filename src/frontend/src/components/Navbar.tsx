import { LogIn, ShoppingCart, User } from "lucide-react";
import { navigate } from "../App";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { currentUser, logout } = useAuth();

  return (
    <nav
      data-ocid="navbar.panel"
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(0,0,0,0.95)",
        borderBottom: "1px solid rgba(212,175,55,0.3)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          type="button"
          data-ocid="navbar.home.link"
          onClick={() => navigate("")}
          className="text-xl font-black tracking-widest"
          style={{ color: "#D4AF37", fontFamily: "Montserrat, sans-serif" }}
        >
          MEET ENTERPRISE
        </button>

        <div className="flex items-center gap-6">
          <button
            type="button"
            data-ocid="navbar.home.link"
            onClick={() => navigate("")}
            className="hidden md:block text-sm font-semibold hover:opacity-80 tracking-wider"
            style={{ color: "#D4AF37" }}
          >
            HOME
          </button>
          <button
            type="button"
            data-ocid="navbar.catalog.link"
            onClick={() => navigate("catalog")}
            className="hidden md:block text-sm font-semibold hover:opacity-80 tracking-wider"
            style={{ color: "#D4AF37" }}
          >
            SHOP
          </button>

          <button
            type="button"
            data-ocid="navbar.cart.link"
            onClick={() => navigate("cart")}
            className="relative hover:opacity-80"
            style={{ color: "#D4AF37" }}
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: "#D4AF37", color: "#000" }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span
                className="flex items-center gap-1 text-sm font-semibold"
                style={{ color: "#D4AF37" }}
              >
                <User size={18} />
                <span className="hidden md:inline">
                  {currentUser.name.split(" ")[0].toUpperCase()}
                </span>
              </span>
              <button
                type="button"
                data-ocid="navbar.logout.button"
                onClick={logout}
                className="text-xs font-bold tracking-wider hover:opacity-80 px-3 py-1 rounded"
                style={{
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#D4AF37",
                  background: "transparent",
                }}
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button
              type="button"
              data-ocid="navbar.login.button"
              onClick={() => navigate("auth")}
              className="flex items-center gap-1 text-sm font-semibold hover:opacity-80"
              style={{ color: "#D4AF37" }}
            >
              <LogIn size={18} />
              <span className="hidden md:inline">LOGIN</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
