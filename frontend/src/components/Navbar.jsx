import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { User, ShoppingCart } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = useCart();
  const { token, logout } = useAuth();

  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const handleAuthClick = () => {
    if (token) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className='bg-lavender'>
      <div className='flex items-center justify-between p-4'>
        <div>
          <h1 onClick={() => navigate("/")} className='font-logo text-5xl cursor-pointer'>Selora</h1>
        </div>
        <div className='flex items-center justify-center gap-6 font-poppins'>
          <h1
            className={`cursor-pointer transition-colors ${
              isActive("/") ? "text-plum font-bold " : "text-gray-500"
            }`}
            onClick={() => navigate("/")}
          >
            Home
          </h1>
          <h1
            className={`cursor-pointer transition-colors ${
              isActive("/contact") ? "text-plum font-bold " : "text-gray-500"
            }`}
            onClick={() => navigate("/contact")}
          >
            Contact
          </h1>
          <div
            className={`relative cursor-pointer transition-colors ${
              isActive("/cart") ? "text-plum" : "text-gray-500"
            }`}
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className='absolute -top-2 -right-3 bg-plum text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                {cartCount}
              </span>
            )}
          </div>
          <div className='cursor-pointer text-gray-700' onClick={handleAuthClick}>
            <User size={22} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar