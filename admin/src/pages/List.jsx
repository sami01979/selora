import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { CATEGORIES } from "../constants/categories";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const categoryLabel = (value) =>
    CATEGORIES.find((c) => c.value === value)?.name || "—";

  const filteredList = useMemo(() => {
    if (filter === "all") return list;
    return list.filter((item) => item.category === filter);
  }, [list, filter]);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h2 className="font-display text-2xl text-plum">All Products</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gold/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-berry"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

     
      <div className="hidden sm:grid grid-cols-[60px_2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 rounded-xl bg-plum text-cream text-sm font-medium">
        <span>Image</span>
        <span>Name</span>
        <span>Brand</span>
        <span>Category</span>
        <span>Price</span>
        <span>Status</span>
        <span></span>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {filteredList.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[60px_1fr_auto] sm:grid-cols-[60px_2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center bg-white rounded-xl px-4 py-3 shadow-sm"
          >
            <img src={item.image[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-ink/50 sm:hidden">
                {item.brand} · {categoryLabel(item.category)} · ৳{item.price}
              </p>
            </div>
            <span className="hidden sm:block text-sm text-ink/70">{item.brand}</span>
            <span className="hidden sm:block text-sm text-ink/70">{categoryLabel(item.category)}</span>
            <span className="hidden sm:block text-sm font-medium">৳{item.price}</span>
            <span className="hidden sm:flex">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.inStock ? "bg-sage/20 text-sage" : "bg-berry/20 text-berry"
                }`}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </span>
            <button
              onClick={() => removeProduct(item._id)}
              className="text-berry font-bold text-lg justify-self-end hover:text-berry/70"
              aria-label="Remove product"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;