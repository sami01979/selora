import { NavLink } from "react-router-dom";
import { useOrderNotifications } from "../context/OrderNotificationContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { unseenCount } = useOrderNotifications();

  const linkClass = ({ isActive }) =>
    `flex items-center justify-between px-6 py-3 rounded-r-full mr-4 transition-colors ${
      isActive
        ? "bg-berry text-white font-medium"
        : "text-cream/80 hover:bg-plum-light"
    }`;

  return (
    <>
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 md:w-[20%] bg-plum z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-4 md:hidden">
          <span className="font-display text-cream text-lg">Menu</span>
          <button onClick={onClose} className="text-cream text-xl">✕</button>
        </div>
        <nav className="pt-2 md:pt-8 flex flex-col gap-1">
          <NavLink to="/add" className={linkClass} onClick={onClose}>
            Add Product
          </NavLink>
          <NavLink to="/list" className={linkClass} onClick={onClose}>
            List Products
          </NavLink>
          <NavLink to="/orders" className={linkClass} onClick={onClose}>
            <span>Orders</span>
            {unseenCount > 0 && (
              <span className="bg-rose text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {unseenCount > 9 ? "9+" : unseenCount}
              </span>
            )}
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;