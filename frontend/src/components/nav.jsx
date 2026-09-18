import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
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

  return (
    <div className='bg-lavender'>
      <div className='flex items-center justify-between p-4'>
        <div>
          <h1 onClick={() => navigate("/")} className='font-script text-5xl cursor-pointer'>Selora</h1>
        </div>
        <div className='flex items-center justify-center gap-6'>
          <h1 className='cursor-pointer' onClick={() => navigate("/")}>Home</h1>
          <h1 className='cursor-pointer' onClick={() => navigate("/contact")}>Contact</h1>
          <div className='relative cursor-pointer' onClick={() => navigate("/cart")}>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className='absolute -top-2 -right-4 bg-plum text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                {cartCount}
              </span>
            )}
          </div>
          <h1 className='cursor-pointer' onClick={handleAuthClick}>
            {token ? "Logout" : "Login"}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Navbar