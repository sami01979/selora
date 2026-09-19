import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { OrderNotificationProvider } from "./context/OrderNotificationContext";
import { subscribeToPush } from "./utils/pushNotifications";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // open the sidebar every time the admin logs in
  useEffect(() => {
    if (token) setSidebarOpen(true);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    subscribeToPush(backendUrl, token);

    // mobile Chrome needs the permission request to come from a tap
    const onTap = () => {
      subscribeToPush(backendUrl, token);
      window.removeEventListener("click", onTap);
      window.removeEventListener("touchend", onTap);
    };
    window.addEventListener("click", onTap);
    window.addEventListener("touchend", onTap);
    return () => {
      window.removeEventListener("click", onTap);
      window.removeEventListener("touchend", onTap);
    };
  }, [token]);

  return (
    <div>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <OrderNotificationProvider token={token}>
          <Navbar setToken={setToken} onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex w-full">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="w-full md:w-[80%] mx-auto px-4 sm:px-6 pt-6 pb-12">
              <Routes>
                <Route path="/" element={<Navigate to="/orders" replace />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/orders/:id" element={<OrderDetails token={token} />} />
              </Routes>
            </div>
          </div>
        </OrderNotificationProvider>
      )}
    </div>
  );
};

export default App;