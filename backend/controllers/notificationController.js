import subscriptionModel from "../models/subscriptionModel.js";

const subscribe = async (req, res) => {
  try {
    const sub = req.body;
    const exists = await subscriptionModel.findOne({ endpoint: sub.endpoint });
    if (!exists) {
      await subscriptionModel.create(sub);
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { subscribe };