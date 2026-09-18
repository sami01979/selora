import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const OrderNotificationContext = createContext();

const notifySound = new Audio("/notification.wav");

const SEEN_KEY = "admin_last_seen_order_date";

export function OrderNotificationProvider({ token, children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSeenDate, setLastSeenDate] = useState(
    Number(localStorage.getItem(SEEN_KEY)) || 0
  );
  const knownOrderIds = useRef(new Set());
  const firstLoad = useRef(true);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const fetched = response.data.orders.slice().sort((a, b) => b.date - a.date);

        if (!firstLoad.current) {
          const newOnes = fetched.filter((o) => !knownOrderIds.current.has(o._id));
          if (newOnes.length > 0) {
            newOnes.forEach((o) => {
              toast.info(`New order from ${o.address?.phone || "customer"} — ৳${o.amount}`);
            });
            notifySound.play().catch(() => {});
          }
        }

        knownOrderIds.current = new Set(fetched.map((o) => o._id));
        setOrders(fetched);
        firstLoad.current = false;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const markAllSeen = () => {
    const latest = orders.length ? orders[0].date : Date.now();
    setLastSeenDate(latest);
    localStorage.setItem(SEEN_KEY, String(latest));
  };

  const unseenCount = orders.filter((o) => o.date > lastSeenDate).length;

  return (
    <OrderNotificationContext.Provider
      value={{ orders, loading, unseenCount, markAllSeen, refetch: fetchOrders }}
    >
      {children}
    </OrderNotificationContext.Provider>
  );
}

export const useOrderNotifications = () => useContext(OrderNotificationContext);