import { MoreVertical, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigate } from "../App";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const menuItems = [
    {
      label: "HOME",
      action: () => {
        navigate("");
        setMenuOpen(false);
      },
    },
    {
      label: "SHOP",
      action: () => {
        navigate("catalog");
        setMenuOpen(false);
      },
    },
    {
      label: "CATEGORIES",
      action: () => {
        navigate("catalog");
        setMenuOpen(false);
      },
    },
    {
      label: "SUPPORT & FAQ",
      action: () => {
        navigate("support");
        setMenuOpen(false);
      },
    },
    ...(currentUser
      ? [
          {
            label: "MY ORDERS",
            action: () => {
              navigate("my-orders");
              setMenuOpen(false);
            },
          },
          {
            label: "SIGN OUT",
            action: () => {
              logout();
              setMenuOpen(false);
            },
            danger: true,
          },
        ]
      : [
          {
            label: "SIGN IN",
            action: () => {
              navigate("auth");
              setMenuOpen(false);
            },
          },
        ]),
  ];

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

        <div className="flex items-center gap-4">
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

          {/* Three-dots menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              data-ocid="navbar.menu.button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:opacity-80 transition-opacity"
              style={{ color: "#D4AF37" }}
              aria-label="Menu"
            >
              <MoreVertical size={22} />
            </button>

            {menuOpen && (
              <div
                data-ocid="navbar.dropdown_menu"
                className="absolute right-0 top-11 w-52 rounded-lg overflow-hidden z-50"
                style={{
                  background: "rgba(0,0,0,0.98)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
                }}
              >
                {currentUser && (
                  <div
                    className="px-4 py-3 text-xs tracking-widest"
                    style={{
                      borderBottom: "1px solid rgba(212,175,55,0.15)",
                      color: "rgba(212,175,55,0.5)",
                    }}
                  >
                    {currentUser.name.toUpperCase()}
                  </div>
                )}
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    data-ocid={`navbar.menu.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}.link`}
                    onClick={item.action}
                    className="w-full text-left px-4 py-3 text-sm font-semibold tracking-wider hover:opacity-70 transition-opacity"
                    style={{
                      color: (item as { danger?: boolean }).danger
                        ? "#ef4444"
                        : "#D4AF37",
                      borderBottom: "1px solid rgba(212,175,55,0.08)",
                      background: "transparent",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
