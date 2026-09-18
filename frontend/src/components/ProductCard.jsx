import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const hasOffer = product?.offerPrice && product.offerPrice < product.price;

  return (
    <Link to={`/product/${product?._id}`}>
      <div className="border border-lavender rounded-lg p-2">
        <div className="h-64 lg:h-96 w-full overflow-hidden rounded-lg">
          <img
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 active:scale-110"
            src={product?.image?.[0]}
            alt={product?.name || "Product"}
          />
        </div>
        {product?.brand && (
          <p className="text-xs text-gray-400 uppercase tracking-wide mt-2">{product.brand}</p>
        )}
        <h1>{product?.name}</h1>
        <div className="flex items-center gap-2">
          <h2 className="text-plum font-semibold">
            Price: {hasOffer ? product.offerPrice : product?.price}
          </h2>
          {hasOffer && (
            <span className="text-gray-400 line-through text-sm">{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}