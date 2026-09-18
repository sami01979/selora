import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useOrderNotifications } from "../context/OrderNotificationContext";

const Orders = ({ token }) => {
  const { orders, loading, markAllSeen, refetch } = useOrderNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    markAllSeen();
  }, []);

  const handleDelete = async (e, orderId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this order? This cannot be undone.")) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/delete",
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order deleted");
        refetch();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <div>
      <h2 className="font-display text-2xl text-plum mb-6">Orders</h2>

      <div className="flex flex-col gap-2">
        {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}

        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            className="border border-lavender rounded-xl p-4 bg-white flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:border-plum transition-colors"
          >
            <div className="min-w-[140px]">
              <p className="font-medium">{order.address?.name || "—"}</p>
              <p className="text-xs text-gray-400">
                {new Date(order.date).toLocaleString()}
              </p>
            </div>

            <p className="text-sm text-gray-600">📞 {order.address?.phone}</p>

            <p className="font-semibold text-plum">৳{order.amount}</p>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.status === "Delivered"
                  ? "bg-sage/20 text-sage"
                  : order.status === "Cancelled"
                  ? "bg-rose/20 text-rose"
                  : "bg-gold/20 text-gold"
              }`}
            >
              {order.status}
            </span>

            <button
              onClick={(e) => handleDelete(e, order._id)}
              className="text-rose font-bold text-lg px-2"
              aria-label="Delete order"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;