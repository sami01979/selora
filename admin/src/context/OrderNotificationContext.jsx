import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { notifyNewOrder } from "../utils/notify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const POLL_MS = 15000;

const OrderNotificationContext = createContext({
  orders: [],
  loading: true,
  unseenCount: 0,
  markAllSeen: () => {},
  refetch: () => {},
});

export const useOrderNotification = () => useContext(OrderNotificationContext);
// alias, because Sidebar and Orders import the plural name
export const useOrderNotifications = useOrderNotification;

export const OrderNotificationProvider = ({ token, children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unseenCount, setUnseenCount] = useState(0);

  const knownIds = useRef(null); // null until the first fetch sets the baseline
  const onOrdersPage = useRef(false);
  const location = useLocation();

  const markAllSeen = useCallback(() => setUnseenCount(0), []);

  useEffect(() => {
    onOrdersPage.current = location.pathname.startsWith("/orders");
    if (onOrdersPage.current) setUnseenCount(0);
  }, [location.pathname]);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(backendUrl + "/api/order/list", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: "{}",
      });
      const data = await res.json();

      if (!data.success) {
        console.warn("Order poll rejected:", data.message);
        return;
      }

      const list = (data.orders || []).slice().sort((a, b) => b.date - a.date);
      setOrders(list);

      // first fetch: remember existing orders, don't notify for them
      if (knownIds.current === null) {
        knownIds.current = new Set(list.map((o) => o._id));
        return;
      }

      const fresh = list.filter((o) => !knownIds.current.has(o._id));
      if (fresh.length === 0) return;

      fresh.forEach((o) => knownIds.current.add(o._id));
      notifyNewOrder(fresh[0]);
      if (!onOrdersPage.current) setUnseenCount((c) => c + fresh.length);
    } catch (err) {
      console.error("Order poll failed:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchOrders();
    const id = setInterval(fetchOrders, POLL_MS);
    return () => clearInterval(id);
  }, [token, fetchOrders]);

  return (
    <OrderNotificationContext.Provider
      value={{ orders, loading, unseenCount, markAllSeen, refetch: fetchOrders }}
    >
      {children}
    </OrderNotificationContext.Provider>
  );
};