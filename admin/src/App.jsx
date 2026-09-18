import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("token", token);
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