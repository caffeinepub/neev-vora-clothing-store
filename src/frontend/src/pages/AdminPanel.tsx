import {
  Check,
  Edit3,
  Fingerprint,
  KeyRound,
  Package,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigate } from "../App";
import type { Category, Order, Product } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";

const getAdminPin = () => localStorage.getItem("adminPin") || "2537";

type Tab = "dashboard" | "products" | "categories" | "orders";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  sizes: string;
  imageUrl: string;
  stock: string;
}

const emptyProductForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  sizes: "S,M,L,XL",
  imageUrl: "",
  stock: "10",
};

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      className="glass-card p-6 flex flex-col gap-2"
      style={{
        border: "1px solid rgba(212,175,55,0.3)",
        background: "rgba(212,175,55,0.05)",
      }}
    >
      <p
        className="text-xs tracking-widest font-semibold uppercase"
        style={{ color: "rgba(212,175,55,0.55)" }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-black tracking-wider"
        style={{ color: "#D4AF37" }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const { actor } = useActor();

  // PIN state
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState(false);
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Change PIN modal
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [changePinError, setChangePinError] = useState("");

  // Data state
  const [tab, setTab] = useState<Tab>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Product form
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkCsvMode, setBulkCsvMode] = useState(false);
  const [csvText, setCsvText] = useState("");

  // Category form
  const [showCatModal, setShowCatModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ id: "", name: "", description: "" });

  useEffect(() => {
    if (unlocked && actor) loadData();
  }, [unlocked, actor]);

  const loadData = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const [p, c, o] = await Promise.all([
        actor.getAllProducts(),
        actor.getAllCategories(),
        actor.getAllOrders(),
      ]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handlePin = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    setPinError(false);
    if (val && idx < 3) pinRefs[idx + 1]?.current?.focus();
    if (newPin.every((d) => d !== "") && newPin.join("") === getAdminPin()) {
      setUnlocked(true);
    } else if (newPin.every((d) => d !== "")) {
      setPinError(true);
      setTimeout(() => {
        setPin(["", "", "", ""]);
        pinRefs[0]?.current?.focus();
      }, 600);
    }
  };

  const handleFingerprint = async () => {
    try {
      await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          userVerification: "required",
          timeout: 60000,
          allowCredentials: [],
          rpId: window.location.hostname,
        },
      });
      setUnlocked(true);
    } catch {
      try {
        const result = await (navigator as any).credentials?.get({
          mediation: "optional",
        });
        if (result) setUnlocked(true);
      } catch {
        setPinError(true);
      }
    }
  };

  const handleChangePin = () => {
    setChangePinError("");
    if (!/^\d{4}$/.test(newPin)) {
      setChangePinError("PIN must be exactly 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      setChangePinError("PINs do not match");
      return;
    }
    localStorage.setItem("adminPin", newPin);
    setShowChangePinModal(false);
    setNewPin("");
    setConfirmPin("");
  };

  const handleSaveProduct = async () => {
    if (!actor) return;
    try {
      const price = BigInt(
        Math.round(Number.parseFloat(productForm.price) * 100),
      );
      const sizes = productForm.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const stock = BigInt(Number.parseInt(productForm.stock) || 0);
      const image = ExternalBlob.fromURL(
        productForm.imageUrl ||
          "https://placehold.co/400x500/000/D4AF37?text=No+Image",
      );
      const now = BigInt(Date.now()) * 1_000_000n;
      if (editProduct) {
        await actor.updateProduct({
          ...editProduct,
          name: productForm.name,
          description: productForm.description,
          price,
          category: productForm.category,
          sizes,
          image,
          stock,
        });
      } else {
        await actor.createProduct({
          id: crypto.randomUUID(),
          name: productForm.name,
          description: productForm.description,
          price,
          category: productForm.category,
          sizes,
          image,
          stock,
          createdAt: now,
        });
      }
      setShowProductModal(false);
      setEditProduct(null);
      setProductForm(emptyProductForm);
      loadData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error saving product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!actor || !confirm("Delete this product?")) return;
    await actor.deleteProduct(id).catch(() => {});
    loadData();
  };

  const handleBulkDelete = async () => {
    if (
      !actor ||
      selectedIds.size === 0 ||
      !confirm(`Delete ${selectedIds.size} products?`)
    )
      return;
    await actor.bulkDeleteProducts([...selectedIds]).catch(() => {});
    setSelectedIds(new Set());
    loadData();
  };

  const handleBulkImport = async () => {
    if (!actor || !csvText.trim()) return;
    const lines = csvText
      .trim()
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("name"));
    for (const line of lines) {
      const [
        name,
        description,
        priceStr,
        category,
        sizesStr,
        imageUrl,
        stockStr,
      ] = line.split(",").map((s) => s.trim());
      if (!name) continue;
      try {
        await actor.createProduct({
          id: crypto.randomUUID(),
          name,
          description: description || "",
          price: BigInt(Math.round(Number.parseFloat(priceStr || "0") * 100)),
          category: category || "",
          sizes: (sizesStr || "M").split("/"),
          image: ExternalBlob.fromURL(
            imageUrl || "https://placehold.co/400x500/000/D4AF37?text=No+Image",
          ),
          stock: BigInt(Number.parseInt(stockStr || "10")),
          createdAt: BigInt(Date.now()) * 1_000_000n,
        });
      } catch {}
    }
    setBulkCsvMode(false);
    setCsvText("");
    loadData();
  };

  const handleSaveCat = async () => {
    if (!actor) return;
    try {
      if (editCat) {
        await actor.updateCategory({
          id: editCat.id,
          name: catForm.name,
          description: catForm.description,
        });
      } else {
        await actor.createCategory({
          id: crypto.randomUUID(),
          name: catForm.name,
          description: catForm.description,
        });
      }
      setShowCatModal(false);
      setEditCat(null);
      setCatForm({ id: "", name: "", description: "" });
      loadData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error saving category");
    }
  };

  // Compute dashboard stats
  const totalOrders = orders.length;
  const totalRevenue =
    orders.reduce((sum, o) => sum + Number(o.total), 0) / 100;
  const codOrders = orders.filter(
    (o) => o.paymentMethod?.toLowerCase() === "cod",
  ).length;
  const gpayOrders = orders.filter((o) =>
    o.paymentMethod?.toLowerCase().includes("gpay"),
  ).length;

  const statusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "fulfilled" || s === "delivered")
      return { bg: "rgba(34,197,94,0.15)", color: "#22c55e" };
    if (s === "cancelled")
      return { bg: "rgba(239,68,68,0.15)", color: "#ef4444" };
    return { bg: "rgba(234,179,8,0.15)", color: "#eab308" };
  };

  if (!unlocked)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#000" }}
      >
        <div className="glass-card p-8 w-full max-w-sm text-center">
          <h2
            className="text-xl font-black tracking-widest mb-2"
            style={{ color: "#D4AF37" }}
          >
            ADMIN ACCESS
          </h2>
          <p
            className="text-xs tracking-wider mb-8"
            style={{ color: "rgba(212,175,55,0.5)" }}
          >
            Enter 4-digit PIN to unlock
          </p>

          <div className="flex justify-center gap-4 mb-6">
            {([0, 1, 2, 3] as const).map((i) => (
              <input
                key={`pin-${i}`}
                ref={pinRefs[i]}
                data-ocid={`admin.pin.input.${i + 1}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={pin[i]}
                onChange={(e) => handlePin(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !pin[i] && i > 0) {
                    pinRefs[i - 1]?.current?.focus();
                  }
                }}
                className={`w-14 h-14 text-center text-2xl font-black rounded-xl transition-all ${
                  pinError ? "animate-bounce" : ""
                }`}
                style={{
                  border: pinError
                    ? "2px solid #ef4444"
                    : "2px solid rgba(212,175,55,0.4)",
                  background: "rgba(0,0,0,0.8)",
                  color: "#D4AF37",
                }}
              />
            ))}
          </div>

          {pinError && (
            <p className="text-red-400 text-sm mb-4">Incorrect PIN</p>
          )}

          <button
            type="button"
            data-ocid="admin.fingerprint.button"
            onClick={handleFingerprint}
            className="btn-outline-gold w-full py-3 text-sm tracking-wider flex items-center justify-center gap-2"
          >
            <Fingerprint size={18} /> Use Fingerprint
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl font-black tracking-widest"
            style={{ color: "#D4AF37" }}
          >
            ADMIN PANEL
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="admin.change_pin.open_modal_button"
              onClick={() => {
                setNewPin("");
                setConfirmPin("");
                setChangePinError("");
                setShowChangePinModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider rounded-lg hover:opacity-80"
              style={{
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#D4AF37",
                background: "rgba(212,175,55,0.08)",
              }}
            >
              <KeyRound size={14} /> CHANGE PIN
            </button>
            <button
              type="button"
              data-ocid="admin.lock.button"
              onClick={() => setUnlocked(false)}
              className="text-xs tracking-wider hover:opacity-70"
              style={{ color: "rgba(212,175,55,0.5)" }}
            >
              LOCK
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div data-ocid="admin.tabs.panel" className="flex flex-wrap gap-2 mb-8">
          {(["dashboard", "products", "categories", "orders"] as Tab[]).map(
            (t) => (
              <button
                type="button"
                key={t}
                data-ocid={`admin.${t}.tab`}
                onClick={() => setTab(t)}
                className="px-6 py-3 text-sm font-bold tracking-wider rounded-lg transition-all flex items-center gap-2"
                style={{
                  background: tab === t ? "#D4AF37" : "rgba(212,175,55,0.1)",
                  color: tab === t ? "#000" : "#D4AF37",
                  border: "1px solid rgba(212,175,55,0.3)",
                }}
              >
                {t === "dashboard" && <ShoppingBag size={14} />}
                {t === "products" && <Package size={14} />}
                {t === "categories" && <Tag size={14} />}
                {t === "orders" && <ShoppingBag size={14} />}
                {t.toUpperCase()}
              </button>
            ),
          )}
        </div>

        {loading && (
          <div
            data-ocid="admin.loading_state"
            className="flex justify-center py-12"
          >
            <div
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#D4AF37", borderTopColor: "transparent" }}
            />
          </div>
        )}

        {/* Dashboard Tab */}
        {tab === "dashboard" && !loading && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Orders"
                value={totalOrders.toString()}
                sub="All time"
              />
              <StatCard
                label="Total Revenue"
                value={`₹${totalRevenue.toLocaleString("en-IN")}`}
                sub="Across all orders"
              />
              <StatCard
                label="COD Orders"
                value={codOrders.toString()}
                sub="Cash on delivery"
              />
              <StatCard
                label="GPay Orders"
                value={gpayOrders.toString()}
                sub="Google Pay"
              />
            </div>
            <div
              className="glass-card p-6"
              style={{ border: "1px solid rgba(212,175,55,0.2)" }}
            >
              <p
                className="text-xs tracking-widest font-semibold mb-4"
                style={{ color: "rgba(212,175,55,0.55)" }}
              >
                RECENT ORDERS
              </p>
              {orders.length === 0 ? (
                <p
                  className="text-center py-8"
                  style={{ color: "rgba(212,175,55,0.3)" }}
                >
                  No orders yet
                </p>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 5).map((o, i) => {
                    const sc = statusColor(o.status);
                    return (
                      <div
                        key={o.id}
                        data-ocid={`admin.dashboard.order.item.${i + 1}`}
                        className="flex items-center justify-between py-2"
                        style={{
                          borderBottom: "1px solid rgba(212,175,55,0.08)",
                        }}
                      >
                        <span
                          className="text-xs"
                          style={{ color: "rgba(212,175,55,0.5)" }}
                        >
                          #{o.id.slice(0, 8)}
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: "#D4AF37" }}
                        >
                          ₹{(Number(o.total) / 100).toLocaleString("en-IN")}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          {o.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === "products" && !loading && (
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                type="button"
                data-ocid="admin.add_product.button"
                onClick={() => {
                  setEditProduct(null);
                  setProductForm(emptyProductForm);
                  setBulkCsvMode(false);
                  setShowProductModal(true);
                }}
                className="btn-gold px-6 py-2 text-sm tracking-wider flex items-center gap-2"
              >
                <Plus size={16} /> ADD PRODUCT
              </button>
              <button
                type="button"
                data-ocid="admin.bulk_add.button"
                onClick={() => {
                  setBulkCsvMode(true);
                  setEditProduct(null);
                  setShowProductModal(true);
                }}
                className="btn-outline-gold px-6 py-2 text-sm tracking-wider"
              >
                BULK ADD (CSV)
              </button>
              {selectedIds.size > 0 && (
                <button
                  type="button"
                  data-ocid="admin.bulk_delete.button"
                  onClick={handleBulkDelete}
                  className="px-6 py-2 text-sm tracking-wider rounded-lg flex items-center gap-2"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "#ef4444",
                  }}
                >
                  <Trash2 size={14} /> DELETE ({selectedIds.size})
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <div
                data-ocid="admin.products.empty_state"
                className="text-center py-16"
              >
                <Package
                  size={48}
                  className="mx-auto mb-4 opacity-30"
                  style={{ color: "#D4AF37" }}
                />
                <p style={{ color: "rgba(212,175,55,0.5)" }}>
                  No products yet. Add your first product!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  data-ocid="admin.products.table"
                  className="w-full text-sm"
                >
                  <thead>
                    <tr
                      style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}
                    >
                      <th className="p-3 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            setSelectedIds(
                              e.target.checked
                                ? new Set(products.map((p) => p.id))
                                : new Set(),
                            )
                          }
                          checked={
                            selectedIds.size === products.length &&
                            products.length > 0
                          }
                        />
                      </th>
                      {[
                        "Image",
                        "Name",
                        "Category",
                        "Price",
                        "Stock",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="p-3 text-left text-xs tracking-wider"
                          style={{ color: "rgba(212,175,55,0.6)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => (
                      <tr
                        key={p.id}
                        data-ocid={`admin.product.row.${i + 1}`}
                        style={{
                          borderBottom: "1px solid rgba(212,175,55,0.1)",
                        }}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(p.id)}
                            onChange={(e) => {
                              const next = new Set(selectedIds);
                              e.target.checked
                                ? next.add(p.id)
                                : next.delete(p.id);
                              setSelectedIds(next);
                            }}
                          />
                        </td>
                        <td className="p-3">
                          <div className="w-12 h-14 rounded overflow-hidden">
                            {p.image?.getDirectURL?.() ? (
                              <img
                                src={p.image.getDirectURL()}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full"
                                style={{ background: "rgba(212,175,55,0.1)" }}
                              />
                            )}
                          </div>
                        </td>
                        <td
                          className="p-3 font-semibold"
                          style={{ color: "#D4AF37" }}
                        >
                          {p.name}
                        </td>
                        <td
                          className="p-3"
                          style={{ color: "rgba(212,175,55,0.6)" }}
                        >
                          {p.category}
                        </td>
                        <td
                          className="p-3 font-bold"
                          style={{ color: "#D4AF37" }}
                        >
                          ₹{(Number(p.price) / 100).toLocaleString("en-IN")}
                        </td>
                        <td
                          className="p-3"
                          style={{ color: "rgba(212,175,55,0.6)" }}
                        >
                          {p.stock?.toString()}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              data-ocid={`admin.product.edit_button.${i + 1}`}
                              onClick={() => {
                                setEditProduct(p);
                                setBulkCsvMode(false);
                                setProductForm({
                                  name: p.name,
                                  description: p.description,
                                  price: (Number(p.price) / 100).toString(),
                                  category: p.category,
                                  sizes: p.sizes.join(","),
                                  imageUrl: p.image?.getDirectURL?.() || "",
                                  stock: p.stock?.toString() || "0",
                                });
                                setShowProductModal(true);
                              }}
                              className="p-2 rounded hover:opacity-70"
                              style={{ color: "#D4AF37" }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              data-ocid={`admin.product.delete_button.${i + 1}`}
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 rounded hover:opacity-70"
                              style={{ color: "#ef4444" }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {tab === "categories" && !loading && (
          <div>
            <button
              type="button"
              data-ocid="admin.add_category.button"
              onClick={() => {
                setEditCat(null);
                setCatForm({ id: "", name: "", description: "" });
                setShowCatModal(true);
              }}
              className="btn-gold px-6 py-2 text-sm tracking-wider flex items-center gap-2 mb-6"
            >
              <Plus size={16} /> ADD CATEGORY
            </button>
            {categories.length === 0 ? (
              <div
                data-ocid="admin.categories.empty_state"
                className="text-center py-16"
              >
                <Tag
                  size={48}
                  className="mx-auto mb-4 opacity-30"
                  style={{ color: "#D4AF37" }}
                />
                <p style={{ color: "rgba(212,175,55,0.5)" }}>
                  No categories yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c, i) => (
                  <div
                    key={c.id}
                    data-ocid={`admin.category.card.${i + 1}`}
                    className="glass-card p-4 flex items-start justify-between"
                  >
                    <div>
                      <p className="font-bold" style={{ color: "#D4AF37" }}>
                        {c.name}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "rgba(212,175,55,0.5)" }}
                      >
                        {c.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        type="button"
                        data-ocid={`admin.category.edit_button.${i + 1}`}
                        onClick={() => {
                          setEditCat(c);
                          setCatForm({
                            id: c.id,
                            name: c.name,
                            description: c.description,
                          });
                          setShowCatModal(true);
                        }}
                        style={{ color: "#D4AF37" }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        data-ocid={`admin.category.delete_button.${i + 1}`}
                        onClick={async () => {
                          if (confirm("Delete?")) {
                            await actor?.deleteCategory(c.id);
                            loadData();
                          }
                        }}
                        style={{ color: "#ef4444" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && !loading && (
          <div>
            {orders.length === 0 ? (
              <div
                data-ocid="admin.orders.empty_state"
                className="text-center py-16"
              >
                <ShoppingBag
                  size={48}
                  className="mx-auto mb-4 opacity-30"
                  style={{ color: "#D4AF37" }}
                />
                <p style={{ color: "rgba(212,175,55,0.5)" }}>No orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  data-ocid="admin.orders.table"
                  className="w-full text-sm"
                >
                  <thead>
                    <tr
                      style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}
                    >
                      {[
                        "Order ID",
                        "Items",
                        "Total",
                        "Payment",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="p-3 text-left text-xs tracking-wider"
                          style={{ color: "rgba(212,175,55,0.6)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => {
                      const sc = statusColor(o.status);
                      return (
                        <tr
                          key={o.id}
                          data-ocid={`admin.order.row.${i + 1}`}
                          style={{
                            borderBottom: "1px solid rgba(212,175,55,0.1)",
                          }}
                        >
                          <td
                            className="p-3 text-xs"
                            style={{ color: "rgba(212,175,55,0.5)" }}
                          >
                            {o.id.slice(0, 8)}...
                          </td>
                          <td className="p-3" style={{ color: "#D4AF37" }}>
                            {o.items.length} item(s)
                          </td>
                          <td
                            className="p-3 font-bold"
                            style={{ color: "#D4AF37" }}
                          >
                            ₹{(Number(o.total) / 100).toLocaleString("en-IN")}
                          </td>
                          <td
                            className="p-3"
                            style={{ color: "rgba(212,175,55,0.6)" }}
                          >
                            {o.paymentMethod}
                          </td>
                          <td className="p-3">
                            <span
                              className="px-2 py-1 rounded text-xs font-bold"
                              style={{ background: sc.bg, color: sc.color }}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                data-ocid={`admin.order.fulfill.button.${i + 1}`}
                                onClick={async () => {
                                  await actor?.updateOrderStatus(
                                    o.id,
                                    "fulfilled",
                                  );
                                  loadData();
                                }}
                                disabled={o.status === "fulfilled"}
                                className="px-3 py-1 rounded text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                                style={{
                                  background: "rgba(34,197,94,0.15)",
                                  color: "#22c55e",
                                  border: "1px solid rgba(34,197,94,0.3)",
                                }}
                              >
                                <Check size={12} /> Fulfill
                              </button>
                              <button
                                type="button"
                                data-ocid={`admin.order.cancel.button.${i + 1}`}
                                onClick={async () => {
                                  await actor?.updateOrderStatus(
                                    o.id,
                                    "cancelled",
                                  );
                                  loadData();
                                }}
                                disabled={o.status === "cancelled"}
                                className="px-3 py-1 rounded text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                                style={{
                                  background: "rgba(239,68,68,0.15)",
                                  color: "#ef4444",
                                  border: "1px solid rgba(239,68,68,0.3)",
                                }}
                              >
                                <X size={12} /> Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div
          data-ocid="admin.product.modal"
          className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.85)" }}
        >
          <div className="glass-card w-full max-w-lg my-8 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg font-black tracking-wider"
                style={{ color: "#D4AF37" }}
              >
                {bulkCsvMode
                  ? "BULK ADD PRODUCTS"
                  : editProduct
                    ? "EDIT PRODUCT"
                    : "ADD PRODUCT"}
              </h3>
              <button
                type="button"
                data-ocid="admin.product.close_button"
                onClick={() => setShowProductModal(false)}
              >
                <X size={20} style={{ color: "#D4AF37" }} />
              </button>
            </div>

            {bulkCsvMode ? (
              <div>
                <p
                  className="text-xs mb-2"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  CSV format:
                  name,description,price(INR),category,sizes(S/M/L),imageUrl,stock
                </p>
                <textarea
                  data-ocid="admin.bulk_csv.textarea"
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full h-48 px-3 py-2 text-xs font-mono resize-none mb-4"
                  placeholder={
                    "T-Shirt,Premium cotton,999,mens,S/M/L/XL,https://example.com/img.jpg,50\nKids Shirt,Soft fabric,599,kids,2-4Y/6-8Y,,30"
                  }
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    data-ocid="admin.bulk_import.button"
                    onClick={handleBulkImport}
                    className="btn-gold flex-1 py-3 text-sm tracking-wider"
                  >
                    IMPORT
                  </button>
                  <button
                    type="button"
                    data-ocid="admin.bulk_cancel.button"
                    onClick={() => setBulkCsvMode(false)}
                    className="btn-outline-gold px-6 py-3 text-sm"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {(
                  [
                    {
                      key: "name",
                      label: "NAME *",
                      placeholder: "Product name",
                    },
                    {
                      key: "description",
                      label: "DESCRIPTION",
                      placeholder: "Product description",
                    },
                    {
                      key: "price",
                      label: "PRICE (INR) *",
                      placeholder: "999",
                    },
                    {
                      key: "category",
                      label: "CATEGORY ID",
                      placeholder: "Category ID",
                    },
                    {
                      key: "sizes",
                      label: "SIZES (comma-separated)",
                      placeholder: "S,M,L,XL",
                    },
                    {
                      key: "imageUrl",
                      label: "IMAGE URL",
                      placeholder: "https://...",
                    },
                    { key: "stock", label: "STOCK", placeholder: "10" },
                  ] as {
                    key: keyof ProductForm;
                    label: string;
                    placeholder: string;
                  }[]
                ).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label
                      htmlFor={`admin-product-${key}`}
                      className="text-xs tracking-wider mb-1 block"
                      style={{ color: "rgba(212,175,55,0.6)" }}
                    >
                      {label}
                    </label>
                    <input
                      id={`admin-product-${key}`}
                      data-ocid={`admin.product.${key}.input`}
                      type={
                        key === "price" || key === "stock" ? "number" : "text"
                      }
                      value={productForm[key]}
                      onChange={(e) =>
                        setProductForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                      className="w-full px-4 py-2 text-sm"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    data-ocid="admin.product.save.button"
                    onClick={handleSaveProduct}
                    className="btn-gold flex-1 py-3 text-sm tracking-wider flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> SAVE
                  </button>
                  <button
                    type="button"
                    data-ocid="admin.product.cancel.button"
                    onClick={() => setShowProductModal(false)}
                    className="btn-outline-gold px-6 py-3 text-sm"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCatModal && (
        <div
          data-ocid="admin.category.modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
        >
          <div className="glass-card w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg font-black tracking-wider"
                style={{ color: "#D4AF37" }}
              >
                {editCat ? "EDIT CATEGORY" : "ADD CATEGORY"}
              </h3>
              <button
                type="button"
                data-ocid="admin.category.close_button"
                onClick={() => setShowCatModal(false)}
              >
                <X size={20} style={{ color: "#D4AF37" }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="admin-cat-name"
                  className="text-xs tracking-wider mb-1 block"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  NAME *
                </label>
                <input
                  id="admin-cat-name"
                  data-ocid="admin.category.name.input"
                  type="text"
                  value={catForm.name}
                  onChange={(e) =>
                    setCatForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-4 py-2"
                  placeholder="e.g. Men's Shirts"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-cat-desc"
                  className="text-xs tracking-wider mb-1 block"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  DESCRIPTION
                </label>
                <input
                  id="admin-cat-desc"
                  data-ocid="admin.category.description.input"
                  type="text"
                  value={catForm.description}
                  onChange={(e) =>
                    setCatForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full px-4 py-2"
                  placeholder="Short description"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  data-ocid="admin.category.save.button"
                  onClick={handleSaveCat}
                  className="btn-gold flex-1 py-3 text-sm tracking-wider"
                >
                  SAVE
                </button>
                <button
                  type="button"
                  data-ocid="admin.category.cancel.button"
                  onClick={() => setShowCatModal(false)}
                  className="btn-outline-gold px-6 py-3 text-sm"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <div
          data-ocid="admin.change_pin.modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
        >
          <div className="glass-card w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg font-black tracking-wider"
                style={{ color: "#D4AF37" }}
              >
                CHANGE PIN
              </h3>
              <button
                type="button"
                data-ocid="admin.change_pin.close_button"
                onClick={() => setShowChangePinModal(false)}
              >
                <X size={20} style={{ color: "#D4AF37" }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="admin-new-pin"
                  className="text-xs tracking-wider mb-1 block"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  NEW 4-DIGIT PIN
                </label>
                <input
                  id="admin-new-pin"
                  data-ocid="admin.change_pin.new.input"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) =>
                    setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest"
                  placeholder="••••"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    border: "2px solid rgba(212,175,55,0.4)",
                    color: "#D4AF37",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="admin-confirm-pin"
                  className="text-xs tracking-wider mb-1 block"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  CONFIRM PIN
                </label>
                <input
                  id="admin-confirm-pin"
                  data-ocid="admin.change_pin.confirm.input"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) =>
                    setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest"
                  placeholder="••••"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    border: "2px solid rgba(212,175,55,0.4)",
                    color: "#D4AF37",
                    borderRadius: "8px",
                  }}
                />
              </div>
              {changePinError && (
                <p
                  data-ocid="admin.change_pin.error_state"
                  className="text-red-400 text-sm"
                >
                  {changePinError}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  data-ocid="admin.change_pin.save.button"
                  onClick={handleChangePin}
                  className="btn-gold flex-1 py-3 text-sm tracking-wider"
                >
                  SAVE PIN
                </button>
                <button
                  type="button"
                  data-ocid="admin.change_pin.cancel.button"
                  onClick={() => setShowChangePinModal(false)}
                  className="btn-outline-gold px-6 py-3 text-sm"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
