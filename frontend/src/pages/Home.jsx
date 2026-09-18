import { useState, useMemo } from "react";
import { useShop } from "../context/ShopContext";
import { Search, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import CategoryGrid from "../components/CategoryGrid";

const Home = () => {
  const { products } = useShop();
  const [query, setQuery] = useState("");

  const isSearching = query.trim().length > 0;

  const filteredProducts = useMemo(() => {
    if (!isSearching) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
  }, [products, query, isSearching]);

  return (
    <div className='px-3 py-8'>
      <div className='flex justify-center mb-8'>
        <div className='relative w-full max-w-md'>
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search products...'
            className='w-full border border-plum/40 rounded-full pl-10 pr-9 py-2 text-sm outline-none focus:border-plum font-poppins'
          />
          {query && (
            <X
              size={16}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer'
              onClick={() => setQuery("")}
            />
          )}
        </div>
      </div>

      {!isSearching && <CategoryGrid />}

      {isSearching && (
        <p className='text-gray-500 mb-4 font-poppins'>
          {filteredProducts.length} result{filteredProducts.length !== 1 && "s"} for "
          <span className='text-plum'>{query}</span>"
        </p>
      )}

      {filteredProducts.length === 0 ? (
        <p className='text-gray-500 font-poppins'>No products found.</p>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;