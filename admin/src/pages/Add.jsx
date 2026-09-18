import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { CATEGORIES } from "../constants/categories";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("makeup");
  const [sizes, setSizes] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [inStock, setInStock] = useState(true);

  const addSize = () => {
    if (sizeInput && !sizes.includes(sizeInput)) {
      setSizes([...sizes, sizeInput]);
      setSizeInput("");
    }
  };

  const removeSize = (s) => setSizes(sizes.filter((item) => item !== s));

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);
      formData.append("inStock", inStock);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(backendUrl + "/api/product/add", formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setOfferPrice("");
        setBrand("");
        setCategory("makeup");
        setSizes([]);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-plum mb-6">Add Product</h2>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-5 max-w-xl">
        <div>
          <p className="text-sm font-medium mb-2">Product Images</p>
          <div className="flex gap-3 flex-wrap">
            {[
              [image1, setImage1],
              [image2, setImage2],
              [image3, setImage3],
              [image4, setImage4],
            ].map(([img, setImg], idx) => (
              <label
                key={idx}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gold/50 bg-white flex items-center justify-center cursor-pointer overflow-hidden hover:border-berry transition-colors"
              >
                {img ? (
                  <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gold text-2xl">+</span>
                )}
                <input type="file" hidden onChange={(e) => setImg(e.target.files[0])} />
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Price (৳)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Offer Price (৳)</label>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="Leave blank if no offer"
              className="w-full px-3 py-2 rounded-lg border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sizes</label>
          <div className="flex gap-2">
            <input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="e.g. 30ml"
              className="flex-1 px-3 py-2 rounded-lg border border-gold/40 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
            />
            <button
              type="button"
              onClick={addSize}
              className="px-4 py-2 rounded-lg bg-sage text-white text-sm font-medium hover:bg-sage/90"
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {sizes.map((s) => (
              <span
                key={s}
                onClick={() => removeSize(s)}
                className="px-3 py-1 rounded-full bg-gold/20 text-gold text-sm cursor-pointer hover:bg-gold/30"
              >
                {s} ×
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)} className="accent-berry w-4 h-4" />
            Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={inStock} onChange={() => setInStock(!inStock)} className="accent-berry w-4 h-4" />
            In Stock
          </label>
        </div>

        <button
          type="submit"
          className="w-fit px-8 py-2.5 rounded-full bg-berry text-white font-medium hover:bg-berry/90 transition-colors"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;