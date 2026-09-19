const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// true if the existing subscription was made with the current VAPID key
function sameKey(subscription, keyBytes) {
  const existing = subscription.options?.applicationServerKey;
  if (!existing) return false;
  const a = new Uint8Array(existing);
  if (a.length !== keyBytes.length) return false;
  return a.every((v, i) => v === keyBytes[i]);
}

export async function subscribeToPush(backendUrl, token) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push not supported in this browser");
    return;
  }
  if (!VAPID_PUBLIC_KEY) {
    console.error("VITE_VAPID_PUBLIC_KEY is missing - set it in Vercel and redeploy");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission:", permission);
      return;
    }

    await navigator.serviceWorker.register("/sw.js");
    const registration = await navigator.serviceWorker.ready;

    const keyBytes = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    let subscription = await registration.pushManager.getSubscription();
    if (subscription && !sameKey(subscription, keyBytes)) {
      await subscription.unsubscribe();
      subscription = null;
    }
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyBytes,
      });
    }

    const res = await fetch(backendUrl + "/api/notification/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify(subscription),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false) {
      console.error("Subscribe request failed:", res.status, data);
      return;
    }
    console.log("Push subscribed and saved:", subscription.endpoint);
  } catch (error) {
    console.error("Push subscription failed:", error);
  }
}