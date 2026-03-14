import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import type { Category, Product } from "../backend";
import ProductCard from "../components/ProductCard";
import { useActor } from "../hooks/useActor";

export default function Catalog() {
  const { actor, isFetching: actorLoading } = useActor();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);

  useEffect(() => {
    if (actorLoading) return;
    if (!actor) {
      setLoading(false);
      return;
    }
    Promise.all([actor.getAllProducts(), actor.getAllCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  }, [actor, actorLoading]);

  const allSizes = [...new Set(products.flatMap((p) => p.sizes))];

  const filtered = products.filter((p) => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || p.category === selectedCategory;
    const matchSize = !selectedSize || p.sizes.includes(selectedSize);
    const matchPrice = Number(p.price) / 100 <= maxPrice;
    return matchSearch && matchCat && matchSize && matchPrice;
  });

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1
          className="text-3xl font-black tracking-widest mb-8"
          style={{ color: "#D4AF37" }}
        >
          COLLECTION
        </h1>

        <div
          data-ocid="catalog.filters.panel"
          className="glass-card p-4 mb-8 flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[180px]">
            <label
              htmlFor="catalog-search"
              className="text-xs tracking-wider mb-1 block"
              style={{ color: "rgba(212,175,55,0.6)" }}
            >
              SEARCH
            </label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#D4AF37" }}
              />
              <input
                id="catalog-search"
                data-ocid="catalog.search.input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-8 pr-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="min-w-[160px]">
            <label
              htmlFor="catalog-category"
              className="text-xs tracking-wider mb-1 block"
              style={{ color: "rgba(212,175,55,0.6)" }}
            >
              CATEGORY
            </label>
            <select
              id="catalog-category"
              data-ocid="catalog.category.select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {allSizes.length > 0 && (
            <div className="min-w-[120px]">
              <label
                htmlFor="catalog-size"
                className="text-xs tracking-wider mb-1 block"
                style={{ color: "rgba(212,175,55,0.6)" }}
              >
                SIZE
              </label>
              <select
                id="catalog-size"
                data-ocid="catalog.size.select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2 text-sm"
              >
                <option value="">All Sizes</option>
                {allSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="min-w-[160px]">
            <label
              htmlFor="catalog-price"
              className="text-xs tracking-wider mb-1 block"
              style={{ color: "rgba(212,175,55,0.6)" }}
            >
              MAX PRICE: ₹{maxPrice.toLocaleString("en-IN")}
            </label>
            <input
              id="catalog-price"
              data-ocid="catalog.price.input"
              type="range"
              min={100}
              max={100000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#D4AF37" }}
            />
          </div>

          {(search || selectedCategory || selectedSize) && (
            <button
              type="button"
              data-ocid="catalog.clear_filters.button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                setSelectedSize("");
                setMaxPrice(100000);
              }}
              className="btn-outline-gold px-4 py-2 text-xs tracking-wider"
            >
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div
            data-ocid="catalog.loading_state"
            className="flex items-center justify-center h-64"
          >
            <div className="text-center">
              <div
                className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
                style={{
                  borderColor: "#D4AF37",
                  borderTopColor: "transparent",
                }}
              />
              <p
                className="text-sm tracking-wider"
                style={{ color: "rgba(212,175,55,0.6)" }}
              >
                Loading collection...
              </p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div data-ocid="catalog.empty_state" className="text-center py-20">
            <SlidersHorizontal
              size={48}
              className="mx-auto mb-4 opacity-30"
              style={{ color: "#D4AF37" }}
            />
            <p
              className="text-lg font-semibold tracking-wider"
              style={{ color: "rgba(212,175,55,0.5)" }}
            >
              No products found
            </p>
            <p
              className="text-sm mt-2"
              style={{ color: "rgba(212,175,55,0.3)" }}
            >
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p, i) => (
              <div key={p.id} data-ocid={`catalog.product.item.${i + 1}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
