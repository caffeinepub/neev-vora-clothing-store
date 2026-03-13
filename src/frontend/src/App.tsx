import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import AdminPanel from "./pages/AdminPanel";
import Auth from "./pages/Auth";
import CartPage from "./pages/CartPage";
import Catalog from "./pages/Catalog";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import MyOrders from "./pages/MyOrders";
import OrderConfirmation from "./pages/OrderConfirmation";
import Payment from "./pages/Payment";
import ProductDetail from "./pages/ProductDetail";
import SplashScreen from "./pages/SplashScreen";
import Support from "./pages/Support";

function parseRoute(hash: string) {
  const path = hash.replace(/^#\/?/, "") || "";
  if (!path) return { page: "home", param: "" };
  if (path === "catalog") return { page: "catalog", param: "" };
  if (path.startsWith("product/"))
    return { page: "product", param: path.slice(8) };
  if (path === "cart") return { page: "cart", param: "" };
  if (path === "auth") return { page: "auth", param: "" };
  if (path === "checkout") return { page: "checkout", param: "" };
  if (path === "payment") return { page: "payment", param: "" };
  if (path === "order-confirmation")
    return { page: "order-confirmation", param: "" };
  if (path === "admin") return { page: "admin", param: "" };
  if (path === "my-orders") return { page: "my-orders", param: "" };
  if (path === "support") return { page: "support", param: "" };
  return { page: "home", param: "" };
}

export function navigate(path: string) {
  window.location.hash = `/${path}`;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashShown"),
  );
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (showSplash) {
    return (
      <SplashScreen
        onDone={() => {
          sessionStorage.setItem("splashShown", "1");
          setShowSplash(false);
        }}
      />
    );
  }

  const noNavPages = ["auth"];
  const showNav = !noNavPages.includes(route.page);

  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <div
            className="min-h-screen flex flex-col"
            style={{ background: "#000", color: "#D4AF37" }}
          >
            {showNav && <Navbar />}
            <main className="flex-1">
              {route.page === "home" && <Home />}
              {route.page === "catalog" && <Catalog />}
              {route.page === "product" && (
                <ProductDetail productId={route.param} />
              )}
              {route.page === "cart" && <CartPage />}
              {route.page === "auth" && <Auth />}
              {route.page === "checkout" && <Checkout />}
              {route.page === "payment" && <Payment />}
              {route.page === "order-confirmation" && <OrderConfirmation />}
              {route.page === "admin" && <AdminPanel />}
              {route.page === "my-orders" && <MyOrders />}
              {route.page === "support" && <Support />}
            </main>
            {showNav && <Footer />}
          </div>
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  );
}
