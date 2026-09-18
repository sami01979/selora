import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useOrderNotifications } from "../context/OrderNotificationContext";

const STATUS_OPTIONS = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const OrderDetails = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, refetch } = useOrderNotifications();

  const order = orders.find((o) => o._id === id);

  const changeStatus = async (status) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId: id, status },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Status updated");
        refetch();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this order? This cannot be undone.")) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/delete",
        { orderId: id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order deleted");
        refetch();
        navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!order) {
    return (
      <div className="p-4">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <button onClick={() => navigate("/orders")} className="text-plum underline">
          ← Back to orders
        </button>
      </div>
    );
  }

  const itemsSubtotal = order.amount - order.deliveryCharge;

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/orders")}
        className="text-sm text-gray-500 mb-4 hover:text-plum"
      >
        ← Back to orders
      </button>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h2 className="font-display text-2xl text-plum">Order Details</h2>
        <button
          onClick={handleDelete}
          className="text-rose border border-rose rounded-lg px-4 py-1.5 text-sm hover:bg-rose/10"
        >
          Delete Order
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div className="border border-lavender rounded-xl p-4 bg-white">
          <h3 className="font-medium text-plum mb-3">Customer</h3>
          <p><span className="text-gray-500">Name:</span> {order.address?.name}</p>
          <p><span className="text-gray-500">Phone:</span> {order.address?.phone}</p>
        </div>

        <div className="border border-lavender rounded-xl p-4 bg-white">
          <h3 className="font-medium text-plum mb-3">Delivery Address</h3>
          <p><span className="text-gray-500">Building:</span> {order.address?.building}</p>
          <p><span className="text-gray-500">Area:</span> {order.address?.area}</p>
          <p><span className="text-gray-500">City:</span> {order.address?.city}</p>
          <p className="mt-2 text-sm text-gray-500">
            Zone: {order.deliveryZone === "inside" ? "Inside Chattogram" : "Outside Chattogram"}
          </p>
        </div>
      </div>

      <div className="border border-lavender rounded-xl p-4 bg-white mb-6">
        <h3 className="font-medium text-plum mb-3">Items</h3>
        <div className="flex flex-col gap-3">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-2 border-b border-lavender/50 last:border-0"
            >
              <img
                src={item.image || "https://via.placeholder.com/60?text=No+Image"}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover border border-lavender shrink-0"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
              </div>
              <span className="text-sm">৳{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-lavender flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>৳{itemsSubtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Charge</span>
            <span>৳{order.deliveryCharge}</span>
          </div>
          <div className="flex justify-between font-semibold text-plum">
            <span>Total</span>
            <span>৳{order.amount}</span>
          </div>
        </div>
      </div>

      <div className="border border-lavender rounded-xl p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Placed: {new Date(order.date).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Payment: {order.paymentMethod} · {order.payment ? "Paid" : "Unpaid"}
          </p>
        </div>

        <select
          value={order.status}
          onChange={(e) => changeStatus(e.target.value)}
          className="border border-lavender rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderDetails;