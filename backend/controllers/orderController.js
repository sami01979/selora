import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import webpush from "../utils/webpush.js";

const DELIVERY_CHARGES = {
  inside: 80,
  outside: 120,
};

const notifyAdmins = async (order) => {
  try {
    const subs = await subscriptionModel.find({});
    const payload = JSON.stringify({
      title: "New Order — Selora",
      body: `${order.address?.name || "Customer"} · ৳${order.amount}`,
      url: "/orders",
    });

    await Promise.all(
      subs.map((sub) =>
        webpush.sendNotification(sub, payload).catch(async (err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await subscriptionModel.deleteOne({ endpoint: sub.endpoint });
          } else {
            console.log("Push error:", err.message);
          }
        })
      )
    );
  } catch (error) {
    console.log(error);
  }
};

// place order - cod only
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, deliveryZone } = req.body;

    if (!DELIVERY_CHARGES.hasOwnProperty(deliveryZone)) {
      return res.json({ success: false, message: "Invalid delivery zone" });
    }

    const deliveryCharge = DELIVERY_CHARGES[deliveryZone];
    const finalAmount = amount + deliveryCharge;

    const orderData = {
      userId,
      items,
      address,
      amount: finalAmount,
      deliveryCharge,
      deliveryZone,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    notifyAdmins(newOrder);

    res.json({ success: true, message: "Order placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// all orders - admin
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// user orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update status - admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// delete order - admin
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, allOrders, userOrders, updateStatus, deleteOrder };