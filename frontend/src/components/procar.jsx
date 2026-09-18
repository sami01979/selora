import { Link } from "react-router-dom";
import { useCartActions } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCartActions();

  return (
    <div className="group">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-[3/4] bg-blush rounded-lg overflow-hidden mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <h3 className="font-display text-lg text-plum">{product.name}</h3>
      <p className="text-sm text-rose mb-2">৳{product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="w-full border border-plum text-plum text-sm py-2 rounded-full hover:bg-plum hover:text-ivory transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}