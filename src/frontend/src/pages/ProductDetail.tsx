import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { navigate } from "../App";
import type { Product } from "../backend";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";

interface Props {
  productId: string;
}

export default function ProductDetail({ productId }: Props) {
  const { actor } = useActor();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!actor || !productId) return;
    actor
      .getProductById(productId)
      .then((p) => {
        setProduct(p);
        if (p?.sizes?.[0]) setSelectedSize(p.sizes[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, productId]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image?.getDirectURL?.() || "",
      size: selectedSize,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading)
    return (
      <div
        data-ocid="product.loading_state"
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#000" }}
      >
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#D4AF37", borderTopColor: "transparent" }}
        />
      </div>
    );

  if (!product)
    return (
      <div
        data-ocid="product.error_state"
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#000" }}
      >
        <p style={{ color: "#D4AF37" }}>Product not found</p>
        <button
          type="button"
          onClick={() => navigate("catalog")}
          className="btn-gold mt-4 px-6 py-2 text-sm"
        >
          Back to Catalog
        </button>
      </div>
    );

  const imgUrl = product.image?.getDirectURL?.() || "";
  const priceINR = Number(product.price) / 100;

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          type="button"
          data-ocid="product.back.button"
          onClick={() => navigate("catalog")}
          className="flex items-center gap-2 mb-8 text-sm tracking-wider hover:opacity-80"
          style={{ color: "rgba(212,175,55,0.7)" }}
        >
          <ArrowLeft size={16} /> BACK
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="glass-card overflow-hidden aspect-[3/4]">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-6xl"
                style={{ background: "rgba(212,175,55,0.05)" }}
              >
                👔
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6" data-ocid="product.info.panel">
            <div>
              <p
                className="text-xs tracking-[0.3em] mb-2"
                style={{ color: "rgba(212,175,55,0.5)" }}
              >
                {product.category || "CLOTHING"}
              </p>
              <h1
                className="text-3xl font-black tracking-wider"
                style={{ color: "#D4AF37" }}
              >
                {product.name}
              </h1>
              <p
                className="text-3xl font-black mt-3"
                style={{ color: "#D4AF37" }}
              >
                ₹{priceINR.toLocaleString("en-IN")}
              </p>
            </div>

            {product.description && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(212,175,55,0.7)" }}
              >
                {product.description}
              </p>
            )}

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div>
                <p
                  className="text-xs tracking-[0.3em] mb-3"
                  style={{ color: "rgba(212,175,55,0.5)" }}
                >
                  SELECT SIZE
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      type="button"
                      key={size}
                      data-ocid="product.size.toggle"
                      onClick={() => setSelectedSize(size)}
                      className="w-12 h-12 text-sm font-bold border-2 rounded-lg transition-all"
                      style={{
                        borderColor:
                          selectedSize === size
                            ? "#D4AF37"
                            : "rgba(212,175,55,0.3)",
                        background:
                          selectedSize === size ? "#D4AF37" : "transparent",
                        color: selectedSize === size ? "#000" : "#D4AF37",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p
                className="text-xs tracking-[0.3em] mb-3"
                style={{ color: "rgba(212,175,55,0.5)" }}
              >
                QUANTITY
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  data-ocid="product.qty_minus.button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="btn-outline-gold w-10 h-10 flex items-center justify-center rounded-lg"
                >
                  <Minus size={16} />
                </button>
                <span
                  className="text-xl font-bold w-8 text-center"
                  style={{ color: "#D4AF37" }}
                >
                  {qty}
                </span>
                <button
                  type="button"
                  data-ocid="product.qty_plus.button"
                  onClick={() => setQty(qty + 1)}
                  className="btn-outline-gold w-10 h-10 flex items-center justify-center rounded-lg"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                data-ocid="product.add_to_cart.button"
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="btn-gold flex-1 py-4 text-sm tracking-widest font-bold flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                {added ? "ADDED!" : "ADD TO CART"}
              </button>
              <button
                type="button"
                data-ocid="product.buy_now.button"
                onClick={() => {
                  handleAddToCart();
                  navigate("checkout");
                }}
                disabled={!selectedSize}
                className="btn-outline-gold px-6 py-4 text-sm tracking-widest font-bold"
              >
                BUY NOW
              </button>
            </div>

            <p className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>
              In Stock: {product.stock?.toString() || "N/A"} units
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
