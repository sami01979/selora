import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="font-display text-3xl text-plum mb-3">Order Placed!</h1>
      <p className="text-gray-500 mb-6">
        Thanks for your order. We'll deliver it soon — pay on delivery.
      </p>
      <Link to="/" className="inline-block bg-lavender text-white rounded-lg py-2.5 px-6">
        Continue Shopping
      </Link>
    </div>
  );
}