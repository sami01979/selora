const Navbar = ({ setToken, onMenuClick }) => {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-plum">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-cream text-2xl leading-none"
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="font-display text-xl sm:text-2xl text-cream">Selora Admin</h1>
      </div>
      <button
        onClick={() => setToken("")}
        className="px-4 sm:px-5 py-1.5 rounded-full bg-berry text-cream text-sm font-medium hover:bg-berry/90 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;