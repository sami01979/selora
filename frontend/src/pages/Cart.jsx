import { Link } from "react-router-dom";
import { useCart, useCartActions } from "../context/CartContext";

export default function Cart() {
  const items = useCart();
  const { removeFromCart, updateQty } = useCartActions();

  const getItemPrice = (item) =>
    item.offerPrice && item.offerPrice < item.price ? item.offerPrice : item.price;

  const total = items.reduce((sum, item) => sum + getItemPrice(item) * item.qty, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="font-display text-3xl text-plum mb-3">Your Cart</h1>
        <p className="text-gray-500 mb-6">Your cart is empty.</p>
        <Link to="/" className="inline-block bg-lavender text-white rounded-lg py-2.5 px-6">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="font-display text-3xl text-plum mb-6">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 border border-lavender rounded-lg p-3"
          >
            <div className="flex flex-col items-start gap-1">
              <img
                src={item.image?.[0] || item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <h2 className="font-medium">{item.name}</h2>
              <p className="text-plum font-semibold">৳{getItemPrice(item)}</p>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                className="w-8 h-8 rounded-full border border-lavender flex items-center justify-center"
              >
                −
              </button>
              <span className="w-6 text-center">{item.qty}</span>
              <button
                onClick={() => updateQty(item._id, item.qty + 1)}
                className="w-8 h-8 rounded-full border border-lavender flex items-center justify-center"
              >
                +
              </button>
            </div>

            <p className="w-20 text-right font-medium">
              ৳{getItemPrice(item) * item.qty}
            </p>

            <button
              onClick={() => removeFromCart(item._id)}
              className="text-rose font-bold text-lg"
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <p className="text-xl font-semibold text-plum">Subtotal: ৳{total}</p>
        <p className="text-xs text-gray-400">Delivery charge added at checkout</p>
        <Link
          to="/checkout"
          className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 active:scale-95 text-white rounded-lg py-3 px-8 w-fit"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}