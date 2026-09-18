import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart, useCartActions } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { backendUrl } from "../context/ShopContext";

const DELIVERY_CHARGES = {
  inside: 80,
  outside: 120,
};

export default function Checkout() {
  const items = useCart();
  const { clearCart } = useCartActions();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [building, setBuilding] = useState("");
  const [city, setCity] = useState("");
  const [deliveryZone, setDeliveryZone] = useState("inside");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const getItemPrice = (item) =>
    item.offerPrice && item.offerPrice < item.price ? item.offerPrice : item.price;

  const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * item.qty, 0);
  const deliveryCharge = DELIVERY_CHARGES[deliveryZone];
  const grandTotal = subtotal + deliveryCharge;

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const orderItems = items.map((item) => ({
        itemId: item._id,
        name: item.name,
        price: getItemPrice(item),
        qty: item.qty,
        image: item.image?.[0] || item.image || "",
      }));

      const response = await axios.post(
        backendUrl + "/api/order/place",
        {
          items: orderItems,
          amount: subtotal,
          address: { name, phone, area, building, city },
          deliveryZone,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        clearCart();
        navigate("/order-success");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="max-w-xl mx-auto p-8 text-center text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8">
      <h1 className="font-display text-3xl text-plum mb-6">Checkout</h1>

      <div className="border border-lavender rounded-lg p-4 mb-6">
        {items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm py-1">
            <span>{item.name} × {item.qty}</span>
            <span>৳{getItemPrice(item) * item.qty}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm py-1 border-t border-lavender mt-2 pt-2">
          <span>Subtotal</span>
          <span>৳{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm py-1">
          <span>Delivery Charge</span>
          <span>৳{deliveryCharge}</span>
        </div>
        <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-lavender">
          <span>Total</span>
          <span>৳{grandTotal}</span>
        </div>
      </div>

      <form onSubmit={placeOrder} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Delivery Location</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDeliveryZone("inside")}
              className={`flex-1 border rounded-lg py-2.5 text-sm transition-colors ${deliveryZone === "inside"
                  ? "border-plum bg-plum text-white"
                  : "border-lavender text-plum"
                }`}
            >
              Inside Chattogram — ৳80
            </button>
            <button
              type="button"
              onClick={() => setDeliveryZone("outside")}
              className={`flex-1 border rounded-lg py-2.5 text-sm transition-colors ${deliveryZone === "outside"
                  ? "border-plum bg-plum text-white"
                  : "border-lavender text-plum"
                }`}
            >
              Outside Chattogram — ৳120
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-lavender focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-lavender focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Area Name</label>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            placeholder="e.g. GEC Circle, Khulshi"
            className="w-full px-3 py-2 rounded-lg border border-lavender focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Building / House Name</label>
          <input
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            required
            placeholder="e.g. House 12, Road 4"
            className="w-full px-3 py-2 rounded-lg border border-lavender focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-lavender focus:outline-none"
          />
        </div>

        <p className="text-sm text-gray-500">Payment: Cash on Delivery</p>
        {error && <p className="text-rose text-sm">{error}</p>}
        <button
          type="submit"
          disabled={placing}
          className="bg-lavender text-white rounded-lg py-3 mt-2 disabled:opacity-60"
        >
          {placing ? "Placing Order..." : `Place Order — ৳${grandTotal}`}
        </button>
      </form>
    </div>
  );
}