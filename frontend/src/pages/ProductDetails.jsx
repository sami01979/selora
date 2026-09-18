import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useCartActions } from "../context/CartContext";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartActions();
  const { products, loading } = useShop();
  const product = products.find((p) => p._id === id);

  const [selectedImage, setSelectedImage] = useState(0);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p._id !== product._id)
      .slice(0, 8);
  }, [products, product]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  const hasOffer = product.offerPrice && product.offerPrice < product.price;
  const images = product.image?.length ? product.image : [];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <div className="h-96 lg:h-[500px] w-full overflow-hidden rounded-lg border border-lavender">
            <img
              className="w-full h-full object-cover"
              src={images[selectedImage]}
              alt={product.name}
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden border-2 shrink-0 ${
                    selectedImage === idx ? "border-plum" : "border-lavender"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="flex items-center gap-3">
            <p className="text-xl font-semibold text-plum">
              Price: {hasOffer ? product.offerPrice : product.price}
            </p>
            {hasOffer && (
              <span className="text-gray-400 line-through text-lg">{product.price}</span>
            )}
          </div>
          <p className="text-gray-600">{product.description}</p>
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-500 text-white rounded-lg py-3 px-6 w-fit active:bg-blue-900 hover:bg-blue-700 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div key={p._id} onClick={() => navigate(`/product/${p._id}`)}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}