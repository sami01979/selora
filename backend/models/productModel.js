import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    brand: { type: String },
    image: { type: Array, required: true },
    sizes: { type: Array, default: [] },
    inStock: { type: Boolean, default: true },
    bestseller: { type: Boolean, default: false },
    date: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;