import { ShoppingCart } from "lucide-react";
import { navigate } from "../App";
import type { Product } from "../backend";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const imgUrl = product.image?.getDirectURL?.() || "";
  const priceINR = Number(product.price) / 100;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const size = product.sizes?.[0] || "M";
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: imgUrl,
      size,
      quantity: 1,
    });
  };

  const handleCardClick = () => navigate(`product/${product.id}`);

  return (
    <button
      type="button"
      data-ocid="catalog.product.card"
      className="glass-card overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col text-left w-full"
      style={{ boxShadow: "0 4px 24px rgba(212,175,55,0.1)" }}
      onClick={handleCardClick}
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: "rgba(212,175,55,0.05)" }}
          >
            👔
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3
          className="font-bold text-sm tracking-wider truncate"
          style={{ color: "#D4AF37" }}
        >
          {product.name}
        </h3>
        {product.category && (
          <span className="text-xs opacity-60" style={{ color: "#D4AF37" }}>
            {product.category}
          </span>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-black text-lg" style={{ color: "#D4AF37" }}>
            ₹{priceINR.toLocaleString("en-IN")}
          </span>
          <button
            type="button"
            data-ocid="catalog.add_to_cart.button"
            onClick={handleAddToCart}
            className="btn-gold p-2 rounded-lg"
            title="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </button>
  );
}
