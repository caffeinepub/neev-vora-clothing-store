import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { navigate } from "../App";
import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext";

export default function Checkout() {
  const { items, totalPrice } = useCart();
  const { setCheckoutData } = useCheckout();
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const phoneRegex = /^[6-9]\d{9}$/;

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.pincode.match(/^\d{6}$/))
      e.pincode = "Enter valid 6-digit pincode";
    if (!phoneRegex.test(form.phone))
      e.phone = "Enter valid 10-digit Indian mobile number";
    if (!form.email.includes("@")) e.email = "Enter valid email";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setCheckoutData(form);
    navigate("payment");
  };

  if (items.length === 0) {
    navigate("cart");
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1
          className="text-3xl font-black tracking-widest mb-8"
          style={{ color: "#D4AF37" }}
        >
          CHECKOUT
        </h1>

        <form
          data-ocid="checkout.form"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="glass-card p-6 space-y-5">
            <h2
              className="text-sm font-bold tracking-widest"
              style={{ color: "#D4AF37" }}
            >
              DELIVERY DETAILS
            </h2>

            <div>
              <label
                htmlFor="checkout-name"
                className="text-xs tracking-wider mb-1 block"
                style={{ color: "rgba(212,175,55,0.6)" }}
              >
                FULL NAME *
              </label>
              <input
                id="checkout-name"
                data-ocid="checkout.name.input"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full px-4 py-3"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-xs mt-1 text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkout-address"
                className="text-xs tracking-wider mb-1 block"
                style={{ color: "rgba(212,175,55,0.6)" }}
              >
                ADDRESS *
              </label>
              <textarea
                id="checkout-address"
                data-ocid="checkout.address.textarea"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                className="w-full px-4 py-3 resize-none"
                rows={3}
                placeholder="House/Flat no., Street, Area"
              />
              {errors.address && (
                <p className="text-xs mt-1 text-red-400">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="checkout-city"
                  className="text-xs tracking-wider mb-1 block"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  CITY *
                </label>
                <input
                  id="checkout-city"
                  data-ocid="checkout.city.input"
                  type="text"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                  className="w-full px-4 py-3"
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-xs mt-1 text-red-400">{errors.city}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="checkout-pincode"
                  className="text-xs tracking-wider mb-1 block"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  PINCODE *
                </label>
                <input
                  id="checkout-pincode"
                  data-ocid="checkout.pincode.input"
                  type="text"
                  value={form.pincode}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pincode: e.target.value }))
                  }
                  className="w-full px-4 py-3"
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
                {errors.pincode && (
                  <p className="text-xs mt-1 text-red-400">{errors.pincode}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="checkout-phone"
                className="text-xs tracking-wider mb-1 flex items-center gap-2"
                style={{ color: "rgba(212,175,55,0.6)" }}
              >
                <MessageCircle size={12} style={{ color: "#25D366" }} />
                WHATSAPP / PHONE *
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: "rgba(212,175,55,0.5)" }}
                >
                  +91
                </span>
                <input
                  id="checkout-phone"
                  data-ocid="checkout.phone.input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className="w-full pl-12 pr-4 py-3"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </div>
              {errors.phone && (
                <p className="text-xs mt-1 text-red-400">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkout-email"
                className="text-xs tracking-wider mb-1 block"
                style={{ color: "rgba(212,175,55,0.6)" }}
              >
                EMAIL *
              </label>
              <input
                id="checkout-email"
                data-ocid="checkout.email.input"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full px-4 py-3"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-xs mt-1 text-red-400">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="glass-card p-4 flex justify-between items-center">
            <span
              className="text-sm tracking-wider"
              style={{ color: "#D4AF37" }}
            >
              Order Total
            </span>
            <span className="text-xl font-black" style={{ color: "#D4AF37" }}>
              ₹{(Number(totalPrice) / 100).toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="submit"
            data-ocid="checkout.submit.button"
            className="btn-gold w-full py-4 text-sm tracking-widest font-black"
          >
            CONTINUE TO PAYMENT
          </button>
        </form>
      </div>
    </div>
  );
}
