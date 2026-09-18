import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useShop } from "../context/ShopContext";
import { CATEGORIES } from "../constants/categories";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useShop();

  const current = CATEGORIES.find((c) => c.value === category);
  const label = current?.name || category;

  const filtered = useMemo(
    () => products.filter((p) => p.category === category),
    [products, category]
  );

  if (loading) return <div className="p-8 font-poppins">Loading...</div>;

  return (
    <div className="px-3 py-8">
      <button
        onClick={() => navigate("/")}
        className="text-sm text-gray-500 mb-4 font-poppins hover:text-plum"
      >
        ← Back to home
      </button>

      <h2 className="font-script text-3xl text-plum mb-6">
        {current?.emoji} {label}
      </h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500 font-poppins">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}