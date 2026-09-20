import express from "express";
import cors from "cors";
import compression from "compression";
import "dotenv/config";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

const app = express();

const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(compression());
app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("Selora API is running");
});

app.get("/health", (req, res) => res.status(200).send("ok"));

app.listen(port, () => console.log(`Server running on port ${port}`));