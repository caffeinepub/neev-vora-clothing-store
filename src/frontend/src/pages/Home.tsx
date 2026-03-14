import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { navigate } from "../App";
import type { Category, Product } from "../backend";
import ProductCard from "../components/ProductCard";
import { useActor } from "../hooks/useActor";

export default function Home() {
  const { actor, isFetching: actorLoading } = useActor();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    if (actorLoading) return;
    if (!actor) return;
    actor
      .getAllCategories()
      .then(setCategories)
      .catch(() => {});
    actor
      .getAllProducts()
      .then((p) => setFeatured(p.slice(0, 6)))
      .catch(() => {});
  }, [actor, actorLoading]);

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      {/* Hero */}
      <section
        data-ocid="home.hero.section"
        className="relative flex flex-col items-center justify-center text-center px-4 py-24 sm:py-36"
        style={{
          background:
            "linear-gradient(180deg, rgba(212,175,55,0.05) 0%, #000 100%)",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-8 mb-6">
            <img
              src="/assets/uploads/1781-photoaidcom-cropped.jpg-1.png"
              alt="Meet Enterprise Logo"
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(212,175,55,0.5)",
              }}
            />
            <div
              style={{
                width: "1px",
                height: "80px",
                background: "rgba(212,175,55,0.4)",
              }}
            />
            <img
              src="/assets/uploads/cropped_circle_image-1.png"
              alt="Navkar Fashion Logo"
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(212,175,55,0.5)",
              }}
            />
          </div>
          <p
            className="text-xs tracking-[0.5em] mb-4 font-medium"
            style={{ color: "rgba(212,175,55,0.7)" }}
          >
            LUXURY FASHION FOR MEN &amp; CHILDREN
          </p>
          <p
            className="text-sm sm:text-base tracking-wider mb-10 max-w-md mx-auto"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            Elevate your style with our premium collection
          </p>
          <button
            type="button"
            data-ocid="home.shop_now.button"
            onClick={() => navigate("catalog")}
            className="btn-gold px-10 py-4 text-sm tracking-widest font-bold uppercase"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section
          data-ocid="home.categories.section"
          className="max-w-7xl mx-auto px-4 py-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-xl font-black tracking-widest"
              style={{ color: "#D4AF37" }}
            >
              CATEGORIES
            </h2>
            <button
              type="button"
              data-ocid="home.view_all.link"
              onClick={() => navigate("catalog")}
              className="flex items-center gap-1 text-sm tracking-wider hover:opacity-80"
              style={{ color: "rgba(212,175,55,0.7)" }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                data-ocid="home.category.card"
                onClick={() => navigate("catalog")}
                className="glass-card p-6 text-center hover:scale-105 transition-all duration-200"
              >
                <p
                  className="font-bold text-sm tracking-wider"
                  style={{ color: "#D4AF37" }}
                >
                  {cat.name}
                </p>
                {cat.description && (
                  <p
                    className="text-xs mt-1 opacity-60"
                    style={{ color: "#D4AF37" }}
                  >
                    {cat.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section
          data-ocid="home.featured.section"
          className="max-w-7xl mx-auto px-4 py-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-xl font-black tracking-widest"
              style={{ color: "#D4AF37" }}
            >
              FEATURED
            </h2>
            <button
              type="button"
              data-ocid="home.view_all_products.link"
              onClick={() => navigate("catalog")}
              className="flex items-center gap-1 text-sm tracking-wider hover:opacity-80"
              style={{ color: "rgba(212,175,55,0.7)" }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section
        data-ocid="home.cta.section"
        className="mx-4 mb-16 rounded-2xl p-12 text-center"
        style={{
          background: "rgba(212,175,55,0.06)",
          border: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <h3
          className="text-2xl font-black tracking-widest mb-3"
          style={{ color: "#D4AF37" }}
        >
          PREMIUM QUALITY
        </h3>
        <p
          className="text-sm mb-6 tracking-wider"
          style={{ color: "rgba(212,175,55,0.6)" }}
        >
          Handpicked styles for the modern gentleman and his family
        </p>
        <button
          type="button"
          data-ocid="home.cta.button"
          onClick={() => navigate("catalog")}
          className="btn-outline-gold px-8 py-3 text-sm tracking-widest font-bold"
        >
          Explore Collection
        </button>
      </section>
    </div>
  );
}
