import webpush from "../config/webpush.js";
import subscriptionModel from "../models/subscriptionModel.js";

export const sendPushToAdmins = async (payload) => {
  try {
    const subs = await subscriptionModel.find();
    await Promise.allSettled(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth } },
            JSON.stringify(payload)
          );
        } catch (err) {
          console.error("Push failed:", err.statusCode, err.body);
          if (err.statusCode === 404 || err.statusCode === 410) {
            await subscriptionModel.deleteOne({ _id: s._id });
          }
        }
      })
    );
  } catch (err) {
    console.error("sendPushToAdmins error:", err);
  }
};